import { Injectable, EventEmitter } from '@angular/core';
import { MzToastService } from 'ng2-materialize';

declare var Materialize: any;

@Injectable()
export class UiService {
	preloaderActions = new EventEmitter<boolean>();

	constructor(private toastService: MzToastService) {

	}

	showToast(message, type) {
		const color = type === 'error' ? 'red' : 'green';
		this.toastService.show(message, 4000, color);
	}

	showLoader() {
		this.preloaderActions.emit(true);
	}

	dismissLoader() {
		this.preloaderActions.emit(false);
	}
}
