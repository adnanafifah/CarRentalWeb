import { Component, OnInit } from '@angular/core';
import { BookingsService } from '../../core/services/bookings.service';
import { Booking } from '../../core/models/booking.interface';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
	selector: 'app-booking-search',
	templateUrl: './booking-search.component.html',
	styleUrls: ['./booking-search.component.scss']
})
export class BookingSearchComponent implements OnInit {
	rows = [];
	temp = [];
	searchForm: FormGroup;

	bookingStatus = ['Open', 'Rejected', 'Confirmed', 'Pending Payment'];
	constructor(
		private bookingService: BookingsService,
		private router: Router,
		private fb: FormBuilder
	) {
		this.searchForm = this.fb.group({
			'searchField': '',
			'status': ''
		});
	}

	ngOnInit() {
		this.searchForm.patchValue({
			'status': this.bookingStatus
		});

		this.searchForm.valueChanges
			.debounceTime(1000)
			.subscribe(val => {
				const temp = this.temp.filter(bookRecord => {
					let condition = true;

					condition = (val.searchField && bookRecord.bookingno.toLowerCase().indexOf(val.searchField.toLowerCase()) !== -1)
						|| (val.searchField && bookRecord.applicant_info.username.toLowerCase().indexOf(val.searchField.toLowerCase()) !== -1)
						|| !val.searchField;

					condition = condition
						&& (
							(val.status && val.status.indexOf(bookRecord.booking_status.charAt(0).toUpperCase() + bookRecord.booking_status.slice(1)) !== -1)
							|| !val.status
						);

					return condition;
				});

				this.rows = temp;
			});


		this.bookingService.getAllBookings().subscribe((bookings: Booking[]) => {
			this.rows = bookings;
			this.temp = bookings;
		});
	}

	navigateToDetail(event) {
		this.router.navigate([`/bookings/detail/${event.selected[0].uid}`]);
	}

}
