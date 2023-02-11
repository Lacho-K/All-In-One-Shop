import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserResponseModel } from '../models/userResponseModel';
import { ShopApiService } from '../services/shop-api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private service: ShopApiService) { }

  users !: Observable<UserResponseModel[]>

  ngOnInit(): void {
    this.users = this.service.getUsersList();
  }

}
