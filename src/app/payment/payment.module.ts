import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentComponent } from './payment.component';
import { PaymentSearchComponent } from './payment-search/payment-search.component';
import { PaymentEditComponent } from './payment-edit/payment-edit.component';
import { SharedModule } from '../shared/shared.module';
import { PaymentRoutingModule } from './payment-routing.module';

@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		PaymentRoutingModule
	],
	exports: [
		PaymentRoutingModule
	],
	declarations: [PaymentComponent, PaymentSearchComponent, PaymentEditComponent]
})
export class PaymentModule { }
