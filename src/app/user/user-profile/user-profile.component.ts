import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { UsersService } from '../../core/services/users.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { User } from '../../core/models/user.interface';
import { UiService } from '../../core/services/ui.service';
import { Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
	selector: 'app-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {
	@ViewChild('confirmModal') confirmModal: any;
	userForm: FormGroup;
	passForm: FormGroup;

	imageUrl = 'assets/imgs/default.png';
	submitted = false;
	passSubmitted = false;
	user$: Subscription;

	constructor(
		private userService: UsersService,
		private authService: AuthService,
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private uiService: UiService
	) { }

	ngOnInit() {
		this.userForm = this.fb.group({
			email: ['', [Validators.required, Validators.email]],
			phoneno: ['', [Validators.required, Validators.pattern(`^(\\+601)[0-46-9]-*[0-9]{7,8}$`)]],
			username: ['', [Validators.required]],
			usertype: [{ value: null, disabled: true }],
			icno: [{ value: null, disabled: true }],
			uid: '',
			photoURL: '',
			emailVerified: '',
		});

		this.passForm = this.fb.group({
			'currentPassword': ['', [Validators.required]],
			'newPassword': ['', [Validators.required, Validators.minLength(6)]],
			'confirmPassword': ['', [Validators.required, Validators.minLength(6)]]
		}, { validator: this.passwordMatchValidator });

		this.user$ = this.route.paramMap.pipe(
			switchMap((params: ParamMap) => {
				return this.userService.getUserByID(params.get('id'));
			})
		).subscribe((user: User) => {
			if (typeof user.photoURL !== 'undefined' && user.photoURL !== null) {
				this.imageUrl = user.photoURL;
			} else {
				user.photoURL = null;
			}

			this.userForm.patchValue(user);
		});
	}

	passwordMatchValidator(g: FormGroup) {
		return g.get('newPassword').value === g.get('confirmPassword').value ? null : { 'mismatch': true };
	}

	ngOnDestroy() {
		this.user$.unsubscribe();
	}

	readUrl(event: any) {
		if (event.target.files && event.target.files[0]) {
			const file = event.target.files[0];

			if (file.type === 'image/jpeg' || file.type === 'image/png') {
				this.uiService.showLoader();

				this.userService.uploadUserImage(this.userForm.value, file)
					.then(result => {
						this.uiService.dismissLoader();
						this.uiService.showToast('Profile image successfully updated!', 'success');
					})
					.catch(error => {
						this.uiService.dismissLoader();
						this.uiService.showToast(error.message, 'error');
					});
			} else {
				this.uiService.showToast('Only .jpg, .jpeg, and .png image types allowed!', 'error');
			}
		}
	}

	submitForm() {
		this.submitted = true;
		if (this.userForm.valid) {
			this.uiService.showLoader();
			this.userService.updateUser(this.userForm.value)
				.then(() => {
					this.uiService.dismissLoader();
					this.uiService.showToast('User successfully updated!', 'success');
				})
				.catch((error) => {
					this.uiService.dismissLoader();
					this.uiService.showToast(`Error : ${error}`, 'error');
				});
		}
	}

	// Error message mapping
	getErrorMsg(controlName) {
		const controlField = this.userForm.get(controlName);

		if (controlField.hasError('required')) {
			return 'This field is required.';
		} else if (controlField.hasError('email')) {
			return 'Please enter a valid email format.';
		} else if (controlField.hasError('pattern')) {
			return 'Please enter correct phone format. Eg. (+60122365100)';
		}

		return '';
	}

	getPassErrorMsg(controlName) {
		const controlField = this.passForm.get(controlName);

		if (controlField.hasError('required')) {
			return 'This field is required.';
		} else if (controlField.hasError('minlength')) {
			return 'Minimum password length is 6 characters.';
		} else if (this.passForm.hasError('mismatch') && controlName !== 'currentPassword') {
			return 'New password and confirm password do not match.';
		}

		return '';
	}

	updatePassword() {
		this.passSubmitted = true;

		if (this.passForm.valid) {
			this.authService.validateCurrentPassword(this.passForm.get('currentPassword').value)
				.then(() => {
					return this.authService.updateUserPassword(this.passForm.get('newPassword').value);
				})
				.then((result) => {
					this.uiService.showToast('Password successfully updated!', 'success');
					this.passForm.reset();
					this.confirmModal.close();
				})
				.catch((error) => {
					if (error.code === 'auth/wrong-password') {
						this.uiService.showToast('Password does not match with existing password!', 'error');
					} else {
						this.uiService.showToast(`${error.message}`, 'error');
					}
				});
		}
	}

	// Getters
	get username() {
		return this.userForm.get('username');
	}
	get icno() {
		return this.userForm.get('icno');
	}
	get phoneno() {
		return this.userForm.get('phoneno');
	}
	get email() {
		return this.userForm.get('email');
	}

	get currentPassword() {
		return this.passForm.get('currentPassword');
	}
	get newPassword() {
		return this.passForm.get('newPassword');
	}
	get confirmPassword() {
		return this.passForm.get('confirmPassword');
	}


}
