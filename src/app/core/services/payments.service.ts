import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Payment } from '../models/payment.interface';
import { Booking } from '../models/booking.interface';
import { map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class PaymentsService {

	constructor(
		private afs: AngularFirestore
	) { }

	getPaymentInProgressCount() {
		return this.afs.collection<Payment>('payments').valueChanges().pipe(
			map((payments: Payment[]) => {
				const totalpayments = payments.length;
				const filteredpayments = payments.filter(vehicle => {
					return vehicle.payment_status !== 'Verified';
				});

				return {
					'PERCENTAGE': filteredpayments.length / totalpayments * 100,
					'TOTAL': totalpayments,
					'CURRENT': filteredpayments.length
				};
			})
		);
	}

	updatePayment(payment: Payment) {
		return this.afs.collection('payments').doc(payment.uid).update(payment);
	}

	getPaymentByID(uid: string) {
		return this.afs.doc<Payment>(`payments/${uid}`).valueChanges();
	}

	getAllPayments() {
		return this.afs.collection<Payment>('payments').valueChanges();
	}

	addNewPayment(paymentObj: Payment, bookingObj: Booking) {
		const docRef = this.afs.firestore.collection('documentno').doc('payments');

		// Create document initial document if does not exist
		return docRef.get().then((doc) => {
			if (doc.exists) {
				return doc.data();
			} else {
				const recordObj = {
					'Compact': 1,
					'Sedan': 1,
					'SUV': 1,
					'Van': 1,
					'Truck': 1,
					'Bus': 1
				};
				return docRef.set(recordObj).then(() => recordObj);
			}
		}).then((documentObj) => {
			return this.getPaymentNo(bookingObj, documentObj).then((paymentNo) => {
				paymentObj.paymentno = paymentNo;
				return this.afs.collection('payments').add(paymentObj);
			});
		}).then((paymentRecord) => {
			return this.afs.collection('payments').doc(paymentRecord.id).update({
				'uid': paymentRecord.id
			});
		});
	}

	getPaymentNo(bookingObj: Booking, documentObj) {
		let paymentno = '';
		if (bookingObj.vehicle_info.category === 'Compact') {
			paymentno = 'PMTCPT' + this.pad(documentObj.Compact++, 4);
		} else if (bookingObj.vehicle_info.category === 'Sedan') {
			paymentno = 'PMTSDN' + this.pad(documentObj.Sedan++, 4);
		} else if (bookingObj.vehicle_info.category === 'SUV') {
			paymentno = 'PMTSUV' + this.pad(documentObj.SUV++, 4);
		} else if (bookingObj.vehicle_info.category === 'Van') {
			paymentno = 'PMTVAN' + this.pad(documentObj.Van++, 4);
		} else if (bookingObj.vehicle_info.category === 'Truck') {
			paymentno = 'PMTTRK' + this.pad(documentObj.Truck++, 4);
		} else if (bookingObj.vehicle_info.category === 'Bus') {
			paymentno = 'PMTBUS' + this.pad(documentObj.Bus++, 4);
		}

		return this.afs.collection('documentno').doc('payments').update(documentObj).then(() => paymentno);
	}

	// Pad number with leading zeros
	pad(n: any, width: any, z?: any) {
		z = z || '0';
		n = n + '';
		return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
	}
}
