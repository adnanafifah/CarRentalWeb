import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsersService } from '../../core/services/users.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { User } from '../../core/models/user.interface';
import { UiService } from '../../core/services/ui.service';
import { Validators } from '@angular/forms';

@Component({
	selector: 'app-user-edit',
	templateUrl: './user-edit.component.html',
	styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit, OnDestroy {
	userForm: FormGroup;
	imageUrl = 'assets/imgs/default.png';
	submitted = false;
	user$: Subscription;

	constructor(
		private userService: UsersService,
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private uiService: UiService
	) { }

	ngOnInit() {
		this.userForm = this.fb.group({
			email: ['', [Validators.required, Validators.email]],
			phoneno: ['', [Validators.required, Validators.pattern(`^(\\+601)[0-46-9]-*[0-9]{7,8}$`)]],
			username: ['', [Validators.required]],
			usertype: ['', [Validators.required]],
			icno: ['', [Validators.required]],
			uid: '',
			photoURL: '',
			emailVerified: '',
		});

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
}
