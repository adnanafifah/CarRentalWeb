import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UiService } from '../../core/services/ui.service';
import { UsersService } from '../../core/services/users.service';
import { User } from '../../core/models/user.interface';

@Component({
	selector: 'app-user-add',
	templateUrl: './user-add.component.html',
	styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent implements OnInit {
	imageUrl = 'assets/imgs/default.png';
	profileImage: File;
	submitted = false;
	userForm: FormGroup;

	constructor(
		private fb: FormBuilder,
		private uiService: UiService,
		private userService: UsersService
	) { }

	ngOnInit() {
		this.userForm = this.fb.group({
			email: ['', [Validators.required, Validators.email]],
			phoneno: ['', [Validators.required, Validators.pattern(`^(\\+601)[0-46-9]-*[0-9]{7,8}$`)]],
			username: ['', [Validators.required]],
			usertype: ['', [Validators.required]],
			icno: ['', [Validators.required]],
		});
	}

	// To Preview Image
	readUrl(event: any) {
		if (event.target.files && event.target.files[0]) {
			const reader = new FileReader();

			// tslint:disable-next-line:no-shadowed-variable
			reader.onload = (event: any) => {
				this.imageUrl = event.target.result;
			};

			reader.readAsDataURL(event.target.files[0]);

			this.profileImage = event.target.files[0];
		}
	}

	submitForm() {
		this.submitted = true;
		if (this.userForm.valid) {
			this.uiService.showLoader();

			this.userService.createNewUser(this.userForm.value).then((result: User) => {
				const userObj: User = this.userForm.value;
				userObj.uid = result.uid;

				if (typeof this.profileImage !== 'undefined') {
					return this.userService.uploadUserImage(userObj, this.profileImage);
				} else {
					return Promise.resolve();
				}
			}).then(() => {
				this.userForm.reset();
				this.imageUrl = 'assets/imgs/default.png';
				this.uiService.dismissLoader();
				this.uiService.showToast('New User Successfully Registered!', 'success');
			}).catch((error) => {
				this.uiService.dismissLoader();
				this.uiService.showToast(`Error: ${error}`, 'error');
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
