import { Component, OnInit, OnDestroy } from '@angular/core';
import { VehiclesService } from '../../core/services/vehicles.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Vehicle } from '../../core/models/vehicle.interface';
import { UiService } from '../../core/services/ui.service';
import { Validators } from '@angular/forms';

@Component({
	selector: 'app-vehicle-edit',
	templateUrl: './vehicle-edit.component.html',
	styleUrls: ['./vehicle-edit.component.scss']
})
export class VehicleEditComponent implements OnInit, OnDestroy {
	vehicleForm: FormGroup;
	vehicle$: Subscription;
	profileImage: File;
	imageUrl = 'assets/imgs/default.png';
	submitted = false;
	vehCategory = [
		'Compact',
		'Sedan',
		'SUV',
		'Van',
		'Truck',
		'Bus'
	];

	constructor(
		private vehService: VehiclesService,
		private fb: FormBuilder,
		private route: ActivatedRoute,
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
			category: ['', Validators.required],
			uid: ''
		});

		this.vehicle$ = this.route.paramMap.pipe(
			switchMap((params: ParamMap) => {
				return this.vehService.getVehicleByUID(params.get('id'));
			})
		).subscribe((vehicle: Vehicle) => {
			this.vehicleForm.patchValue(vehicle);
			this.imageUrl = vehicle.image ? vehicle.image : this.imageUrl;
		});
	}

	ngOnDestroy() {
		this.vehicle$.unsubscribe();
	}

	// To Preview Image
	readUrl(event: any) {
		if (event.target.files && event.target.files[0]) {
			const file = event.target.files[0];

			if (file.type === 'image/jpeg' || file.type === 'image/png') {
				this.uiService.showLoader();

				this.vehService.uploadVehicleImage(file, this.vehicleForm.value)
					.then(result => {
						this.uiService.dismissLoader();
						this.uiService.showToast('Profile image successfully updated!', 'success');
					})
					.catch(error => {
						this.uiService.dismissLoader();
						this.uiService.showToast(error.message, 'error');
					});
			} else {
				this.uiService.showToast('Only .jpg, .jpeg, and .png image types allowed!', 'error');
			}
		}
	}

	submitForm() {
		this.submitted = true;
		if (this.vehicleForm.valid) {
			this.uiService.showLoader();
			this.vehService.updateVehicle(this.vehicleForm.value).then(() => {
				this.uiService.dismissLoader();
				this.uiService.showToast('Vehicle Successfully Updated!', 'success');
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
