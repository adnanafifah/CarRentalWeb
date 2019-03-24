import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { VehicleComponent } from './vehicle.component';

// Child Pages
import { VehicleSearchComponent } from './vehicle-search/vehicle-search.component';
import { VehicleAddComponent } from './vehicle-add/vehicle-add.component';
import { VehicleEditComponent } from './vehicle-edit/vehicle-edit.component';
import { AuthGuard } from '../core/guards/auth.guard';


const vehicleRoutes: Routes = [
	{
		path: 'vehicles',
		component: VehicleComponent,
		data: { animation: 'home' },
		canActivate: [AuthGuard],
		canActivateChild: [AuthGuard],
		children: [
			{
				path: '',
				component: VehicleSearchComponent
			},
			{
				path: 'add',
				component: VehicleAddComponent,
				data: { animation: 'detail' }
			},
			{
				path: 'detail/:id',
				component: VehicleEditComponent,
				data: { animation: 'detail' }
			},
		]
	}
];


@NgModule({
	imports: [
		RouterModule.forChild(vehicleRoutes)
	],
	exports: [
		RouterModule
	]
})
export class VehicleRoutingModule { }
