import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Guards
import { AuthGuard } from './core/guards/auth.guard';
import { LoginGuard } from './core/guards/login.guard';

// Components
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';

const appRoutes: Routes = [
	{ path: 'login', component: LoginComponent, canActivate: [LoginGuard] },

	// home route protected by auth guard
	{ path: '', component: HomeComponent, canActivate: [AuthGuard] },
	// { path: '', component: HomeComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(appRoutes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
