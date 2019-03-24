import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Datatable
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

// Materialize
import {
	MzCardModule,
	MzIconMdiModule,
	MzInputModule,
	MzButtonModule,
	MzNavbarModule,
	MzSidenavModule,
	MzCollapsibleModule,
	MzProgressModule,
	MzDatepickerModule,
	MzCheckboxModule,
	MzSelectModule,
	MzModalModule,
	MzToastModule,
	MzTextareaModule,
	MzRadioButtonModule
} from 'ng2-materialize';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
	imports: [
		CommonModule,
		NgxDatatableModule,
		MzCardModule,
		MzInputModule,
		MzIconMdiModule,
		MzButtonModule,
		MzNavbarModule,
		MzSidenavModule,
		MzCollapsibleModule,
		MzProgressModule,
		MzDatepickerModule,
		MzCheckboxModule,
		MzSelectModule,
		MzModalModule,
		MzToastModule,
		MzTextareaModule,
		MzRadioButtonModule,
		ReactiveFormsModule
	],
	exports: [
		NgxDatatableModule,
		MzCardModule,
		MzInputModule,
		MzIconMdiModule,
		MzButtonModule,
		MzNavbarModule,
		MzSidenavModule,
		MzCollapsibleModule,
		MzProgressModule,
		MzDatepickerModule,
		MzCheckboxModule,
		MzSelectModule,
		MzModalModule,
		MzToastModule,
		MzTextareaModule,
		MzRadioButtonModule,
		ReactiveFormsModule
	],
	declarations: []
})
export class SharedModule { }
