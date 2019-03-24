import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { PaymentsService } from '../../core/services/payments.service';
import { Payment } from '../../core/models/payment.interface';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { formatDate } from '@angular/common';
import { Booking } from '../../core/models/booking.interface';
import { BookingsService } from '../../core/services/bookings.service';
import { UiService } from '../../core/services/ui.service';

@Component({
	selector: 'app-payment-edit',
	templateUrl: './payment-edit.component.html',
	styleUrls: ['./payment-edit.component.scss']
})
export class PaymentEditComponent implements OnInit, OnDestroy {
	paymentSub: Subscription;

	payForm: FormGroup;
	proofImage = 'assets/imgs/default.png';
	payStatus;

	constructor(
		private route: ActivatedRoute,
		private payService: PaymentsService,
		private bookService: BookingsService,
		private uiService: UiService,
		private fb: FormBuilder
	) {
		this.payForm = this.fb.group({
			'uid': [{ value: null, disabled: true }],
			'paymentno': [{ value: null, disabled: true }],
			'bookingno': [{ value: null, disabled: true }],
			'applicant_id': [{ value: null, disabled: true }],
			'created_datetime': [{ value: null, disabled: true }],
			'payment_datetime': [{ value: null, disabled: true }],
			'payment_type': [{ value: null, disabled: true }],
			'bank': [{ value: null, disabled: true }],
			'payment_amount': [{ value: null, disabled: true }],
			'payment_proof': [{ value: null, disabled: true }],
			'payment_status': [{ value: null, disabled: true }],
		});
	}

	ngOnInit() {
		this.paymentSub = this.route.paramMap.pipe(
			switchMap((params: ParamMap) => {
				return this.payService.getPaymentByID(params.get('id'));
			})
		).subscribe((payment) => {
			const payObj = payment;
			if (payObj.payment_datetime) {
				payObj.payment_datetime = formatDate(payment.payment_datetime.toDate(), 'yyyy-MM-dd', 'en-MY');
			}
			payObj.created_datetime = formatDate(payment.created_datetime.toDate(), 'yyyy-MM-dd', 'en-MY');

			if (payObj.payment_proof) {
				this.proofImage = payObj.payment_proof;
			}

			this.payStatus = payObj.payment_status;

			this.payForm.patchValue(payment);
		});
	}

	ngOnDestroy() {
		this.paymentSub.unsubscribe();
	}

	async verifyPayment() {
		this.uiService.showLoader();
		const payForm = this.payForm.getRawValue();
		const payObj: any = {};
		const bookObj: any = {};
		payObj.uid = payForm.uid;
		payObj.payment_status = 'Verified';

		bookObj.bookingno = payForm.bookingno;
		bookObj.booking_status = 'Confirmed';
		const tempBook: Booking = await this.bookService.getBookingByNo(bookObj.bookingno);
		console.log(tempBook);
		bookObj.uid = tempBook.uid;

		try {
			console.log(payObj);
			await this.payService.updatePayment(payObj);
			console.log(bookObj);
			await this.bookService.updateBooking(bookObj);

			this.uiService.showToast('Payment successfully verified!', 'success');
			this.uiService.dismissLoader();
		} catch (e) {
			console.error(e);
			this.uiService.showToast('Oops! An error occured. Please contact system administrator.', 'error');
			this.uiService.dismissLoader();
		}
	}

}
