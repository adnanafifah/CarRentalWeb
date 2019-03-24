import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsersService } from '../../core/services/users.service';
import { User } from '../../core/models/user.interface';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { ThrowStmt } from '@angular/compiler';

@Component({
	selector: 'app-user-search',
	templateUrl: './user-search.component.html',
	styleUrls: ['./user-search.component.scss']
})
export class UserSearchComponent implements OnInit, OnDestroy {
	userRoles = ['Admin', 'Staff', 'Public'];
	rows: User[] = [];
	temp;
	searchForm: FormGroup;

	user$: Subscription;

	constructor(
		private userService: UsersService,
		private router: Router,
		private fb: FormBuilder
	) { }

	ngOnInit() {
		this.searchForm = this.fb.group({
			'searchField': '',
			'usertype': ''
		});

		this.searchForm.patchValue({
			'usertype': this.userRoles
		});

		this.searchForm.valueChanges
			.debounceTime(1000)
			.subscribe(val => {
				const temp = this.temp.filter(userRecord => {
					let condition = true;

					condition = (val.searchField && userRecord.username.toLowerCase().indexOf(val.searchField.toLowerCase()) !== -1)
						|| (val.searchField && userRecord.email.toLowerCase().indexOf(val.searchField.toLowerCase()) !== -1)
						|| !val.searchField;

					condition = condition
						&& (
							(val.usertype && val.usertype.indexOf(userRecord.usertype.charAt(0).toUpperCase() + userRecord.usertype.slice(1)) !== -1)
							|| !val.usertype
						);

					return condition;
				});

				this.rows = temp;
			});

		this.user$ = this.userService.getAllUsers().subscribe((users: User[]) => {
			this.rows = users;
			this.temp = users;
		});
	}

	ngOnDestroy() {
		this.user$.unsubscribe();
	}

	navigateToDetail(event) {
		this.router.navigate([`/users/detail/${event.selected[0].uid}`]);
	}
}
