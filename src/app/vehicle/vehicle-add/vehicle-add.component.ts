import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { VehiclesService } from '../../core/services/vehicles.service';
import { Vehicle } from '../../core/models/vehicle.interface';
import { UiService } from '../../core/services/ui.service';

@Component({
	selector: 'app-vehicle-add',
	templateUrl: './vehicle-add.component.html',
	styleUrls: ['./vehicle-add.component.scss']
})
export class VehicleAddComponent implements OnInit {
	imageUrl = 'assets/imgs/default.png';
	profileImage: File;
	submitted = false;
	vehicleForm: FormGroup;

	vehCategory = [
		'Compact',
		'Sedan',
		'SUV',
		'Van',
		'Truck',
		'Bus'
	];

	constructor(
		private fb: FormBuilder,
		private vehService: VehiclesService,
		private uiService: UiService
	) { }

	ngOnInit() {
		this.vehicleForm = this.fb.group({
			model: ['', Validators.required],
			regdate: ['', Validators.required],
			regno: ['', Validators.required],
			chassisno: ['', Validators.required],
			cartype: ['', Validators.required],
			status: ['', Validators.required],
			aircondition: ['', Validators.required],
			bags: ['', [Validators.required, Validators.pattern('^\\d+$')]],
			doors: ['', [Validators.required, Validators.pattern('^\\d+$')]],
			passengers: ['', [Validators.required, Validators.pattern('^\\d+$')]],
			price: ['', [Validators.required, Validators.pattern('\\d+(\\.\\d{1,2})?')]],
			category: ['', Validators.required]
		});
	}

	// To Preview Image
	readUrl(event: any) {
		if (event.target.files && event.target.files[0]) {
			const reader = new FileReader();

			// tslint:disable-next-line:no-shadowed-variable
			reader.onload = (event: any) => {
				this.imageUrl = event.target.result;
			};

			reader.readAsDataURL(event.target.files[0]);

			this.profileImage = event.target.files[0];
		}
	}

	submitForm() {
		this.submitted = true;
		if (this.vehicleForm.valid) {
			this.uiService.showLoader();
			this.vehService.addNewVehicle(this.vehicleForm.value).then(result => {
				const vehicleObj: Vehicle = this.vehicleForm.value;
				vehicleObj.uid = result.id;

				if (typeof this.profileImage !== 'undefined') {
					return this.vehService.uploadVehicleImage(this.profileImage, vehicleObj);
				} else {
					return Promise.resolve();
				}
			}).then(() => {
				this.vehicleForm.reset();
				this.submitted = false;
				this.imageUrl = 'assets/imgs/default.png';
				this.uiService.dismissLoader();
				this.uiService.showToast('New Vehicle Successfully Registered!', 'success');
			}).catch((error) => {
				console.error(error);
			});
		}
	}

	// Error message mapping
	getErrorMsg(controlName) {
		const controlField = this.vehicleForm.get(controlName);

		if (controlField.hasError('required')) {
			return 'This field is required.';
		} else if (controlName === 'price' && controlField.hasError('pattern')) {
			return 'Please enter value in decimal format.';
		} else if (controlField.hasError('pattern')) {
			return 'Please enter numeric value.';
		}

		return '';
	}

	get model() {
		return this.vehicleForm.get('model');
	}
	get regdate() {
		return this.vehicleForm.get('regdate');
	}
	get regno() {
		return this.vehicleForm.get('regno');
	}
	get chassisno() {
		return this.vehicleForm.get('chassisno');
	}
	get cartype() {
		return this.vehicleForm.get('cartype');
	}
	get status() {
		return this.vehicleForm.get('status');
	}
	get aircondition() {
		return this.vehicleForm.get('aircondition');
	}
	get bags() {
		return this.vehicleForm.get('bags');
	}
	get doors() {
		return this.vehicleForm.get('doors');
	}
	get passengers() {
		return this.vehicleForm.get('passengers');
	}
	get price() {
		return this.vehicleForm.get('price');
	}
	get category() {
		return this.vehicleForm.get('category');
	}
}
