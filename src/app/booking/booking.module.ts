import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingSearchComponent } from './booking-search/booking-search.component';
import { BookingAddComponent } from './booking-add/booking-add.component';
import { BookingEditComponent } from './booking-edit/booking-edit.component';
import { BookingComponent } from './booking.component';
import { BookingRoutingModule } from './booking-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
	imports: [
		CommonModule,
		BookingRoutingModule,
		SharedModule
	],
	exports: [
		BookingRoutingModule
	],
	declarations: [BookingSearchComponent, BookingAddComponent, BookingEditComponent, BookingComponent]
})
export class BookingModule { }
