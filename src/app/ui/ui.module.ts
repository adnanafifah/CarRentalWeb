import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { LoaderComponent } from './loader/loader.component';

@NgModule({
	imports: [
		CommonModule,
		SharedModule
	],
	exports: [
		LoaderComponent
	],
	declarations: [
		LoaderComponent
	]
})
export class UiModule { }
