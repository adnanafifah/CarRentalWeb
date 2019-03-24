import { Component, OnInit, ViewChild } from '@angular/core';
import { VehiclesService } from '../../core/services/vehicles.service';
import { Vehicle } from '../../core/models/vehicle.interface';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
	selector: 'app-vehicle-search',
	templateUrl: './vehicle-search.component.html',
	styleUrls: ['./vehicle-search.component.scss']
})
export class VehicleSearchComponent implements OnInit {
	@ViewChild('myTable') table: any;

	searchForm: FormGroup;
	rows: Vehicle[] = [];
	temp;

	vehCategory = [
		'Compact',
		'Sedan',
		'SUV',
		'Van',
		'Truck',
		'Bus'
	];

	vehStatus = [
		'Active',
		'Inactive'
	];

	constructor(
		private vehService: VehiclesService,
		private router: Router,
		private fb: FormBuilder
	) { }

	ngOnInit() {
		this.searchForm = this.fb.group({
			'regno': '',
			'model': '',
			'status': '',
			'category': ''
		});

		this.searchForm.patchValue({
			'category': this.vehCategory,
			'status': this.vehStatus
		});

		this.searchForm.valueChanges
			.debounceTime(1000)
			.subscribe(val => {
				const temp = this.temp.filter(vehRecord => {
					let condition = true;

					condition = condition && ((val.model && vehRecord.model.toLowerCase().indexOf(val.model.toLowerCase()) !== -1) || !val.model);

					condition = condition && ((val.regno && vehRecord.regno.toLowerCase().indexOf(val.regno.toLowerCase()) !== -1) || !val.regno);

					condition = condition
						&& (
							(val.status && val.status.indexOf(vehRecord.status.charAt(0).toUpperCase() + vehRecord.status.slice(1)) !== -1)
							|| !val.status
						);

					condition = condition
						&& (
							(val.category && val.category.indexOf(vehRecord.category.charAt(0).toUpperCase() + vehRecord.category.slice(1)) !== -1)
							|| !val.category
						);
					return condition;
				});

				this.rows = temp;
			});

		this.vehService.getAllVehicles().subscribe((vehicles: Vehicle[]) => {
			this.rows = vehicles;
			this.temp = vehicles;
		});
	}

	toggleExpandRow(row) {
		this.table.rowDetail.toggleExpandRow(row);
	}

	navigateToDetail(event) {
		this.router.navigate([`/vehicles/detail/${event.selected[0].uid}`]);
	}
}
