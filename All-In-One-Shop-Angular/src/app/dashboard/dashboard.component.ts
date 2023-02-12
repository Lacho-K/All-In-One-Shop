import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserResponseModel } from '../models/userResponseModel';
import { AuthService } from '../services/auth.service';
import { ShopApiService } from '../services/shop-api.service';
import { UserStoreService } from '../services/user-store.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private service: ShopApiService, private auth: AuthService, private userStore: UserStoreService) { }

  users !: Observable<UserResponseModel[]>
  fullName: string = "";

  ngOnInit(): void {
    this.users = this.service.getUsersList();

    this.userStore.getFullNameFromStore()
    .subscribe(name => {
      let fullNameFromToken = this.auth.getFullNameFromToken();
      this.fullName = name || fullNameFromToken;
    });
  }

}
