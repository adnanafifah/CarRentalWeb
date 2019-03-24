import { Component, OnInit } from '@angular/core';
import { BookingsService } from '../core/services/bookings.service';
import { Observable } from 'rxjs';
import { VehiclesService } from '../core/services/vehicles.service';
import { PaymentsService } from '../core/services/payments.service';
import { UsersService } from '../core/services/users.service';
import { CalendarEvent } from 'angular-calendar';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
	viewDate: Date = new Date();
	booking$: Observable<any>;
	vehicle$: Observable<any>;
	payment$: Observable<any>;
	user$: Observable<any>;

	events: CalendarEvent[] = [];

	view = 'month';
	constructor(
		private bookService: BookingsService,
		private vehService: VehiclesService,
		private payService: PaymentsService,
		private userService: UsersService
	) { }

	ngOnInit() {
		this.booking$ = this.bookService.getBookingsInProgressCount();
		this.vehicle$ = this.vehService.getAvailableVehicleCount();
		this.payment$ = this.payService.getPaymentInProgressCount();
		this.user$ = this.userService.getRegisteredUsersCount();

		this.bookService.getBookingsForCalendar().subscribe(events => {
			this.events = events;
		});
	}

}
