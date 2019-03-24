import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable, of } from 'rxjs';
import { User } from '../models/user.interface';
import { switchMap } from 'rxjs/operators';
import * as firebase from 'firebase/app';

@Injectable()
export class AuthService {
	user$: Observable<User>;

	constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {
		this.user$ = this.afAuth.authState.pipe(
			switchMap(user => {
				if (user) {
					return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
				} else {
					return of(null);
				}
			})
		);
	}

	updateUserPassword(newpass: string) {
		return this.afAuth.auth.currentUser.updatePassword(newpass);
	}

	validateCurrentPassword(currentPass: string) {
		// tslint:disable-next-line:max-line-length
		return firebase.auth().currentUser.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(firebase.auth().currentUser.email, currentPass));
	}

	signIn(email, password) {
		return this.afAuth.auth.signInWithEmailAndPassword(email, password);
	}

	signOut() {
		return this.afAuth.auth.signOut();
	}
}
