import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

// Child Pages
import { AuthGuard } from '../core/guards/auth.guard';
import { BookingComponent } from './booking.component';
import { BookingSearchComponent } from './booking-search/booking-search.component';
import { BookingAddComponent } from './booking-add/booking-add.component';
import { BookingEditComponent } from './booking-edit/booking-edit.component';


const bookingRoutes: Routes = [
	{
		path: 'bookings',
		component: BookingComponent,
		data: { animation: 'home' },
		canActivate: [AuthGuard],
		canActivateChild: [AuthGuard],
		children: [
			{
				path: '',
				component: BookingSearchComponent
			},
			{
				path: 'add',
				component: BookingAddComponent,
				data: { animation: 'detail' }
			},
			{
				path: 'detail/:id',
				component: BookingEditComponent,
				data: { animation: 'detail' }
			},
		]
	}
];


@NgModule({
	imports: [
		RouterModule.forChild(bookingRoutes)
	],
	exports: [
		RouterModule
	]
})
export class BookingRoutingModule { }
