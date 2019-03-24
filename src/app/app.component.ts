import { Component, OnDestroy } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { fadeInAnimation } from './core/animations/fadeIn.animation';
import { NgwWowService } from 'ngx-wow';
import { User } from './core/models/user.interface';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
	loggedIn$: Subscription;
	loggedIn = false;

	user: User;

	constructor(
		private authService: AuthService,
		private router: Router,
		private ngwowservice: NgwWowService
	) {
		this.loggedIn$ = this.authService.user$
			.map(user => !user)
			.subscribe(user => {
				this.loggedIn = !user;
			});

		this.authService.user$.subscribe(user => {
			if (user) {
				this.user = user;
			}
		});

		this.ngwowservice.init();
	}

	signOut() {
		this.authService.signOut()
			.then(() => {
				this.router.navigate(['/login']);
			});
	}

	ngOnDestroy() {
		this.loggedIn$.unsubscribe();
	}

	goToProfile() {
		this.router.navigate([`/users/profile/${this.user.uid}`]);
	}
}
