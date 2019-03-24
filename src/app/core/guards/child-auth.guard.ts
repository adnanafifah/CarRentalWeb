import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UiService } from '../services/ui.service';

import { map, take } from 'rxjs/operators';
import 'rxjs/add/operator/do';

@Injectable()
export class AuthGuard implements CanActivateChild {

	constructor(private router: Router, private authService: AuthService, private uiService: UiService) { }

	canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		return this.authService.user$
			.pipe(
				take(1),
				map(user => !!user)
			)
			.do(loggedIn => {
				if (!loggedIn) {
					this.uiService.showToast('You are unauthorized to access this page. Please log in.', 'error');
					this.router.navigate(['/login']);
				}
			});
	}
}
