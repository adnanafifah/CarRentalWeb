import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';
import { CalendarModule } from 'angular-calendar';


@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		CalendarModule.forRoot()
	],
	declarations: [HomeComponent]
})
export class HomeModule { }
