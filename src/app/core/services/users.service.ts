import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from 'angularfire2/firestore';
import { User } from '../models/user.interface';
import { environment } from '../../../environments/environment';
import { switchMap, take, map } from 'rxjs/operators';
import { AngularFireStorage } from 'angularfire2/storage';

@Injectable()
export class UsersService {
	functionURL = environment.cloudFunctionURL;

	constructor(
		private afs: AngularFirestore,
		private storage: AngularFireStorage,
		private http: HttpClient
	) { }

	getRegisteredUsersCount() {
		return this.afs.collection<User>('users').valueChanges().pipe(
			map((users: User[]) => {
				const totalusers = users.length;
				const filteredusers = users.filter(user => {
					return user.usertype !== 'Admin';
				});

				return {
					'PERCENTAGE': filteredusers.length / totalusers * 100,
					'TOTAL': totalusers,
					'CURRENT': filteredusers.length
				};
			})
		);
	}

	getAllUsers() {
		return this.afs.collection<User>('users').valueChanges();
	}

	getUserByID(uid: string) {
		return this.afs.doc<User>(`users/${uid}`).valueChanges();
	}

	createNewUser(userRecord: User) {
		return this.http.post(`${this.functionURL}/createUser`, userRecord).pipe(take(1)).toPromise();
	}

	updateUser(userRecord: User) {
		return this.http.post(`${this.functionURL}/updateUser`, userRecord).pipe(take(1)).toPromise();
	}

	uploadUserImage(userRecord: User, userImage: File) {
		const fileExtension = userImage.name.split('.').pop();
		const filePath = `users/${userRecord.icno}.${fileExtension}`;
		const fileRef = this.storage.ref(filePath);

		return this.storage.upload(filePath, userImage).then(() => {
			const ref = this.storage.ref(filePath);
			return ref.getDownloadURL()
				.pipe(
					switchMap(urlPath => this.afs.collection('users').doc(userRecord.uid).update({
						photoURL: urlPath,
					})),
					take(1)
				).toPromise();
		});
	}
}
