import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Booking } from '../models/booking.interface';
import { switchMap, map, take } from 'rxjs/operators';
import { User } from '../models/user.interface';
import { Vehicle } from '../models/vehicle.interface';
import { CalendarEvent } from 'angular-calendar';

const colors: any = {
	red: {
		primary: '#ad2121',
		secondary: '#FAE3E3'
	},
	blue: {
		primary: '#1e90ff',
		secondary: '#D1E8FF'
	},
	yellow: {
		primary: '#e3bc08',
		secondary: '#FDF1BA'
	}
};

@Injectable({
	providedIn: 'root'
})
export class BookingsService {

	constructor(
		private afs: AngularFirestore
	) { }

	getBookingsForCalendar() {
		return this.afs.collection<Booking>('bookings').valueChanges().pipe(
			map((bookings: Booking[]) => {
				const events: CalendarEvent[] = [];

				bookings.forEach(booking => {
					events.push({
						start: booking.depart_date.toDate(),
						end: booking.return_date.toDate(),
						title: booking.bookingno,
						color: colors.yellow,
					});
				});

				return events;
			})
		);
	}

	getBookingsInProgressCount() {
		return this.afs.collection<Booking>('bookings').valueChanges().pipe(
			map((bookings: Booking[]) => {
				const totalbooking = bookings.length;
				const filteredBookings = bookings.filter(booking => {
					return booking.booking_status !== 'Confirmed';
				});

				return {
					'PERCENTAGE': filteredBookings.length / totalbooking * 100,
					'TOTAL': totalbooking,
					'CURRENT': filteredBookings.length
				};
			})
		);
	}

	getAllBookings() {
		return this.afs.collection('bookings').valueChanges();
	}

	getBookingByID(id: string) {
		return this.afs.doc<Booking>(`bookings/${id}`).valueChanges().pipe(
			// Get Applicant Info
			switchMap((bookingRecord) => {
				const bookingObj = bookingRecord;

				return this.afs.doc(`users/${bookingRecord.applicant_info.uid}`).valueChanges().pipe(
					map((userRecord: User) => {
						bookingObj.applicant_info = userRecord;
						return bookingObj;
					})
				);
			}),

			// Get Vehicle Info
			switchMap((bookingRecord) => {
				const bookingObj = bookingRecord;

				return this.afs.doc(`vehicles/${bookingRecord.vehicle_info.uid}`).valueChanges().pipe(
					map((vehRecord: Vehicle) => {
						bookingObj.vehicle_info = vehRecord;
						return bookingObj;
					})
				);
			})
		);
	}

	getBookingByNo(bookingno: string) {
		return this.afs.collection<Booking>('bookings', ref => ref.where('bookingno', '==', bookingno)).valueChanges()
			.map((bookings: Booking[]) => bookings[0]).pipe(
				take(1)
			)
			.toPromise();
	}

	updateBooking(bookingObj: Booking) {
		return this.afs.collection('bookings').doc(bookingObj.uid).update(bookingObj);
	}
}
