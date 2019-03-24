import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserSearchComponent } from './user-search/user-search.component';
import { UserAddComponent } from './user-add/user-add.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserComponent } from './user.component';
import { SharedModule } from '../shared/shared.module';
import { UserRoutingModule } from './user-routing.module';
import { UserProfileComponent } from '../user/user-profile/user-profile.component';

@NgModule({
	imports: [
		CommonModule,
		UserRoutingModule,
		SharedModule
	],
	exports: [
		UserRoutingModule
	],
	declarations: [UserSearchComponent, UserAddComponent, UserEditComponent, UserComponent, UserProfileComponent]
})
export class UserModule { }
