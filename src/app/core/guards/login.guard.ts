import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UiService } from '../services/ui.service';

import { map, take } from 'rxjs/operators';
import 'rxjs/add/operator/do';

@Injectable()
export class LoginGuard implements CanActivate {

	constructor(private router: Router, private authService: AuthService, private uiService: UiService) { }

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		return this.authService.user$
			.pipe(
				take(1),
				map(user => !user)
			)
			.do(loggedIn => {
				if (!loggedIn) {
					this.router.navigate(['/']);
				}
			});
	}
}
