import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';
import { HttpClientModule } from '@angular/common/http';

// Pages
import { UiModule } from '../ui/ui.module';
import { LoginModule } from '../login/login.module';
import { HomeModule } from '../home/home.module';
import { VehicleModule } from '../vehicle/vehicle.module';
import { UserModule } from '../user/user.module';
import { BookingModule } from '../booking/booking.module';

// Guards
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';


// Services
import { AuthService } from './services/auth.service';
import { VehiclesService } from './services/vehicles.service';
import { UiService } from './services/ui.service';
import { UsersService } from './services/users.service';
import { BookingsService } from './services/bookings.service';
import { PaymentsService } from './services/payments.service';
import { PaymentModule } from '../payment/payment.module';

// Components

@NgModule({
	imports: [
		CommonModule,
		HttpClientModule,
		LoginModule,
		HomeModule,
		AppRoutingModule,
		VehicleModule,
		UiModule,
		UserModule,
		BookingModule,
		PaymentModule
	],
	exports: [
		AppRoutingModule,
		HttpClientModule,
		UiModule
	],
	declarations: [
	],
	providers: [
		AuthGuard,
		LoginGuard,
		AuthService,
		VehiclesService,
		UsersService,
		UiService,
		BookingsService,
		PaymentsService
	]
})
export class CoreModule { }
