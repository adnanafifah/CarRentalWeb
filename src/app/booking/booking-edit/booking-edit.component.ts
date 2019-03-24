import { Component, OnInit, OnDestroy } from '@angular/core';
import { Booking } from '../../core/models/booking.interface';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ParamMap, ActivatedRoute } from '@angular/router';
import { BookingsService } from '../../core/services/bookings.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { UiService } from '../../core/services/ui.service';
import { PaymentsService } from '../../core/services/payments.service';

@Component({
	selector: 'app-booking-edit',
	templateUrl: './booking-edit.component.html',
	styleUrls: ['./booking-edit.component.scss']
})
export class BookingEditComponent implements OnInit, OnDestroy {
	bookingRecord: Booking;
	bookingForm: FormGroup;
	bookingStatus: string;
	confirmMsgType: string;
	booking$: Subscription;

	vehImage = 'assets/imgs/default.png';
	userImage = 'assets/imgs/default.png';

	constructor(
		private bookingService: BookingsService,
		private paymentService: PaymentsService,
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private uiService: UiService
	) {
		this.bookingForm = this.fb.group({
			'applicant_info': this.fb.group({
				'uid': [{ value: null, disabled: true }],
				'username': [{ value: null, disabled: true }],
				'icno': [{ value: null, disabled: true }],
				'phoneno': [{ value: null, disabled: true }],
				'email': [{ value: null, disabled: true }]
			}),
			'vehicle_info': this.fb.group({
				'uid': [{ value: null, disabled: true }],
				'model': [{ value: null, disabled: true }],
				'regno': [{ value: null, disabled: true }],
				'chassisno': [{ value: null, disabled: true }],
				'price': [{ value: null, disabled: true }],
				'category': [{ value: null, disabled: true }],
			}),
			'bookingno': [{ value: null, disabled: true }],
			'destination': [{ value: null, disabled: true }, [Validators.required]],
			'depart_date': [{ value: null, disabled: true }, [Validators.required]],
			'return_date': [{ value: null, disabled: true }, [Validators.required]],
			'duration': [{ value: '0', disabled: true }, Validators.required],
			'purpose': [{ value: null, disabled: true }, [Validators.required]],
			'estimate_price': [{ value: '0', disabled: true }, [Validators.required]],
			'booking_status': 'Open',
			'payment_status': 'Closed',
			'uid': '',
			'category': ''
		});
	}

	ngOnInit() {
		this.booking$ = this.route.paramMap.pipe(
			switchMap((params: ParamMap) => {
				return this.bookingService.getBookingByID(params.get('id'));
			})
		).subscribe((booking: Booking) => {
			booking.depart_date = formatDate(booking.depart_date.toDate(), 'dd/MM/yyyy', 'en-MY');
			booking.return_date = formatDate(booking.return_date.toDate(), 'dd/MM/yyyy', 'en-MY');
			this.bookingStatus = booking.booking_status;

			if (booking.category === 'Public') {
				this.confirmMsgType = `This vehicle will be reserved from ${booking.depart_date} to ${booking.return_date}
					 and payment record will be generated for applicant ${booking.applicant_info.username}. Confirm to proceed?`;
			} else {
				this.confirmMsgType = `This vehicle will be reserved from ${booking.depart_date} to ${booking.return_date}. Confirm to proceed?`;
			}

			this.bookingForm.patchValue(booking);

			this.vehImage = booking.vehicle_info.image ? booking.vehicle_info.image : this.vehImage;
			this.userImage = booking.applicant_info.photoURL ? booking.applicant_info.photoURL : this.userImage;
		});
	}

	ngOnDestroy() {
		this.booking$.unsubscribe();
	}

	rejectBooking() {
		this.uiService.showLoader();
		const bookingObj: any = {};
		bookingObj.uid = this.bookingForm.get('uid').value;
		bookingObj.booking_status = 'Rejected';

		this.bookingService.updateBooking(bookingObj)
			.then(() => {
				this.uiService.dismissLoader();
				this.uiService.showToast('Booking sucessfully rejected.', 'success');
			})
			.catch((error) => {
				this.uiService.dismissLoader();
				this.uiService.showToast('Oops! An error occured!', 'error');
				console.error(error.message);
			});
	}

	confirmBooking() {
		this.uiService.showLoader();
		const bookingObj: any = {};
		const paymentObj: any = {};
		let successMsg = '';
		bookingObj.uid = this.bookingForm.get('uid').value;

		if (this.bookingForm.get('category').value === 'Public') {
			bookingObj.booking_status = 'Pending Payment';
			successMsg = 'Booking successfully updated. New payment record has been generated.';
		} else {
			bookingObj.booking_status = 'Confirmed';
			successMsg = 'Booking successfully confirmed.';
		}

		this.bookingService.updateBooking(bookingObj)
			.then(() => {
				if (this.bookingForm.get('category').value === 'Public') {
					paymentObj.bookingno = this.bookingForm.get('bookingno').value;
					paymentObj.applicant_id = this.bookingForm.get('applicant_info').get('uid').value;
					paymentObj.created_datetime = new Date();
					paymentObj.payment_status = 'Open';

					return this.paymentService.addNewPayment(paymentObj, this.bookingForm.getRawValue());
				} else {
					return Promise.resolve();
				}
			})
			.then(() => {
				this.uiService.dismissLoader();
				this.uiService.showToast(successMsg, 'success');
			})
			.catch((error) => {
				this.uiService.dismissLoader();
				this.uiService.showToast('Oops! An error occured!', 'error');
				console.error(error.message);
			});
	}

}
