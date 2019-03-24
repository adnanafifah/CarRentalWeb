import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { UiService } from '../../core/services/ui.service';

@Component({
	selector: 'app-loader',
	templateUrl: './loader.component.html',
	styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {
	@ViewChild('preloader') preloader;
	loaderOptions: {};

	constructor(
		private uiService: UiService
	) {
		this.loaderOptions = {
			dismissible: false
		};

		this.uiService.preloaderActions.subscribe(result => {
			if (result) {
				this.preloader.open();
			} else {
				this.preloader.close();
			}
		});
	}

}
