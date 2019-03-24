import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from '../core/guards/auth.guard';

// Child Pages
import { UserComponent } from './user.component';
import { UserSearchComponent } from './user-search/user-search.component';
import { UserAddComponent } from './user-add/user-add.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

const userRoutes: Routes = [
	{
		path: 'users',
		component: UserComponent,
		data: { animation: 'home' },
		canActivate: [AuthGuard],
		canActivateChild: [AuthGuard],
		children: [
			{
				path: '',
				component: UserSearchComponent
			},
			{
				path: 'add',
				component: UserAddComponent,
				data: { animation: 'detail' }
			},
			{
				path: 'detail/:id',
				component: UserEditComponent,
				data: { animation: 'detail' }
			},
			{
				path: 'profile/:id',
				component: UserProfileComponent,
				data: { animation: 'detail' }
			}
		]
	}
];


@NgModule({
	imports: [
		RouterModule.forChild(userRoutes)
	],
	exports: [
		RouterModule
	]
})
export class UserRoutingModule { }
