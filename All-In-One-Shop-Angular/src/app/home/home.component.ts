import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ShopApiService } from 'src/app/shop-api.service';
import { ProductResponseModel } from '../Models/productResponseModel';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private service: ShopApiService) { }

  recentProducts$!:Observable<ProductResponseModel[]>;

  ngOnInit(): void {
    this.recentProducts$ = this.service.getProductsList()
    
  }

}
