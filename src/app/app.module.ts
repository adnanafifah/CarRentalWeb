import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { NgwWowModule } from 'ngx-wow';

// Firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';

// Environment File
import { environment } from '../environments/environment';
@NgModule({
	declarations: [
		AppComponent,
	],
	imports: [
		BrowserModule,
		AngularFireModule.initializeApp(environment.dbconfig),
		AngularFirestoreModule,
		AngularFireAuthModule,
		AngularFireStorageModule,
		BrowserAnimationsModule,
		CoreModule,
		SharedModule,
		NgwWowModule.forRoot()
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
