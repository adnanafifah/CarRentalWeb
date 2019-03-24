import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

// Child Pages
import { AuthGuard } from '../core/guards/auth.guard';
import { PaymentComponent } from './payment.component';
import { PaymentSearchComponent } from './payment-search/payment-search.component';
import { PaymentEditComponent } from './payment-edit/payment-edit.component';


const paymentRoutes: Routes = [
	{
		path: 'payments',
		component: PaymentComponent,
		data: { animation: 'home' },
		canActivate: [AuthGuard],
		canActivateChild: [AuthGuard],
		children: [
			{
				path: '',
				component: PaymentSearchComponent
			},
			{
				path: 'detail/:id',
				component: PaymentEditComponent,
				data: { animation: 'detail' }
			},
		]
	}
];


@NgModule({
	imports: [
		RouterModule.forChild(paymentRoutes)
	],
	exports: [
		RouterModule
	]
})
export class PaymentRoutingModule { }
