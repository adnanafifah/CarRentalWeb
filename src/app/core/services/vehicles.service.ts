import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { Vehicle } from '../models/vehicle.interface';

import { finalize, concatMap, switchMap, take, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class VehiclesService {
	downloadURL: Observable<string>;
	constructor(
		private afs: AngularFirestore,
		private storage: AngularFireStorage
	) { }

	getAvailableVehicleCount() {
		return this.afs.collection<Vehicle>('vehicles').valueChanges().pipe(
			map((vehicles: Vehicle[]) => {
				const totalVehicles = vehicles.length;
				const filteredvehicles = vehicles.filter(vehicle => {
					return vehicle.status === 'Active';
				});

				return {
					'PERCENTAGE': filteredvehicles.length / totalVehicles * 100,
					'TOTAL': totalVehicles,
					'CURRENT': filteredvehicles.length
				};
			})
		);
	}

	addNewVehicle(vehicleObj: Vehicle) {
		return this.afs.collection<Vehicle>('vehicles').add(vehicleObj);
	}

	uploadVehicleImage(image: File, vehicle: Vehicle) {
		const fileExtension = image.name.split('.').pop();
		const filePath = `vehicles/${vehicle.uid}.${fileExtension}`;
		const fileRef = this.storage.ref(filePath);

		return this.storage.upload(filePath, image).then(() => {
			const ref = this.storage.ref(filePath);
			return ref.getDownloadURL()
				.pipe(
					switchMap(urlPath => this.afs.collection('vehicles').doc(vehicle.uid).update({
						image: urlPath,
						uid: vehicle.uid
					})),
					take(1)
				).toPromise();
		});
	}

	getAllVehicles() {
		return this.afs.collection<Vehicle>('vehicles').valueChanges();
	}

	getVehicleByUID(uid: string) {
		return this.afs.doc<Vehicle>(`vehicles/${uid}`).valueChanges();
	}

	updateVehicle(vehicleObj: Vehicle) {
		return this.afs.collection('vehicles').doc(vehicleObj.uid).update(vehicleObj);
	}

}
