import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from '../core/services/auth.service';
import { UiService } from '../core/services/ui.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
	loginForm: FormGroup;

	constructor(
		private fb: FormBuilder,
		private authService: AuthService,
		private uiService: UiService,
		private router: Router
	) { }

	ngOnInit() {
		this.loginForm = this.fb.group({
			email: '',
			password: ''
		});
	}

	signIn() {
		this.authService.signIn(this.loginForm.get('email').value, this.loginForm.get('password').value)
			.then(result => {
				this.uiService.showToast(`Welcome ${this.loginForm.get('email').value}!`, 'success');
				this.router.navigate(['/']);
			}).catch(error => {
				this.uiService.showToast(error, 'error');
			});
	}

}
