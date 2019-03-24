const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const app = express();

var serviceAccount = require("./env/serviceAccountKey.json");

// Initialize Admin SDK
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://carrentaluitmweb.firebaseio.com"
});

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));
// Add middleware to authenticate requests
// app.use(myMiddleware);

const firestoreDB = admin.firestore();

// Create New User as Admin
app.post('/createUser', (req, res) => {
	admin.auth().createUser({
		email: req.body.email,
		phoneNumber: req.body.phoneno,
		password: "123456789",
		displayName: req.body.username,
	})
		.then((userRecord) => updateUserProfile(userRecord, req))
		.then((result) => {
			console.log("Successfully created new user:", result);
			return res.send(result);
		}).catch((error) => {
			console.log("Error creating new user:", error);
			res.status(500).send(error);
		});
});

app.post('/updateUser', (req, res) => {
	admin.auth().updateUser(req.body.uid, {
		email: req.body.email,
		phoneNumber: req.body.phoneno,
		displayName: req.body.username,
		photoURL: req.body.photoURL
	})
		.then((userRecord) => updateUserProfile(userRecord, req))
		.then((result) => {
			console.log("Successfully updated user:", result);
			return res.send(result);
		}).catch((error) => {
			console.log("Error updating user:", error);
			res.status(500).send(error);
		})
});

// Expose Express API as a single Cloud Function:
exports.httpFunctions = functions.https.onRequest(app);

function updateUserProfile(userData, req) {
	return firestoreDB.collection('users').doc(userData.uid).set({
		email: req.body.email,
		emailVerified: false,
		phoneno: req.body.phoneno,
		username: req.body.username,
		usertype: req.body.usertype,
		icno: req.body.icno,
		uid: userData.uid
	}, { merge: true }).then(() => userData);
}


exports.bookingNotification = functions.firestore
	.document('bookings/{bookingid}')
	.onUpdate(event => {

		const data = event.after.data();
		const userId = data.applicant_info.uid;
		const bookingStatus = data.booking_status;
		const bookingNo = data.bookingno;

		let msg = '';
		if (bookingStatus === 'Rejected') {
			msg = `Booking (${bookingNo}) has been rejected! Please check system for further details`;
		} else if (bookingStatus === 'Pending Payment') {
			msg = `Booking (${bookingNo}) has been approved! Please proceed with payment.`;
		} else if (bookingStatus === 'Confirmed') {
			msg = `Booking (${bookingNo}) has been confirmed!`;
		}

		if (msg !== '') {
			// Notification content
			const payload = {
				notification: {
					title: 'Booking Update',
					body: msg,
					icon: 'https://carrentailuitmweb.firebaseapp.com/assets/imgs/uitm-logo.png'
				}
			}

			// ref to the device collection for the user
			const devicesRef = firestoreDB.collection('devices').where('uid', '==', userId);
			const tokens = [];

			// send a notification to each device token
			return devicesRef.get().then(devices => {
				devices.forEach(result => {
					const token = result.data().token;
					tokens.push(token);
				});
				return admin.messaging().sendToDevice(tokens, payload);
			});
		} else {
			return Promise.resolve();
		}
	});