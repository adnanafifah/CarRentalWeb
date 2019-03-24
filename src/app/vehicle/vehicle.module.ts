import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehicleComponent } from './vehicle.component';
import { SharedModule } from '../shared/shared.module';
import { VehicleSearchComponent } from './vehicle-search/vehicle-search.component';
import { VehicleAddComponent } from './vehicle-add/vehicle-add.component';
import { VehicleEditComponent } from './vehicle-edit/vehicle-edit.component';
import { VehicleRoutingModule } from './vehicle-routing.module';

@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		VehicleRoutingModule
	],
	exports: [
		VehicleRoutingModule
	],
	declarations: [VehicleComponent, VehicleSearchComponent, VehicleAddComponent, VehicleEditComponent]
})
export class VehicleModule { }
