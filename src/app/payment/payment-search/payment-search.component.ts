import { Component, OnInit } from '@angular/core';
import { PaymentsService } from '../../core/services/payments.service';
import { Payment } from '../../core/models/payment.interface';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
	selector: 'app-payment-search',
	templateUrl: './payment-search.component.html',
	styleUrls: ['./payment-search.component.scss']
})
export class PaymentSearchComponent implements OnInit {
	rows = [];
	temp = [];
	searchForm: FormGroup;

	paymentStatus = ['Open', 'Submitted', 'Verified'];

	constructor(
		private paymentService: PaymentsService,
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
			'status': this.paymentStatus
		});

		this.searchForm.valueChanges
			.debounceTime(1000)
			.subscribe(val => {
				const temp = this.temp.filter(payRecord => {
					let condition = true;

					condition = (val.searchField && payRecord.paymentno.toLowerCase().indexOf(val.searchField.toLowerCase()) !== -1)
						|| (val.searchField && payRecord.bookingno.toLowerCase().indexOf(val.searchField.toLowerCase()) !== -1)
						|| !val.searchField;

					condition = condition
						&& (
							(val.status && val.status.indexOf(payRecord.payment_status.charAt(0).toUpperCase() + payRecord.payment_status.slice(1)) !== -1)
							|| !val.status
						);

					return condition;
				});

				this.rows = temp;
			});

		this.paymentService.getAllPayments().subscribe((paymentRecord: Payment[]) => {
			this.rows = paymentRecord;
			this.temp = paymentRecord;
		});
	}

	navigateToDetail(event) {
		this.router.navigate([`/payments/detail/${event.selected[0].uid}`]);
	}

}
