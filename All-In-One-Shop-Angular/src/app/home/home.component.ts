import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ProductResponseModel } from '../models/productResponseModel';
import { ShopApiService } from '../services/shop-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private service: ShopApiService) { }

  recentProducts$!:Observable<ProductResponseModel[]>;

  productsLenght: number = 0;

  subscription !: Subscription;

  ngOnInit(): void {
    this.recentProducts$ = this.service.getProductsList()
    
    this.subscription = this.recentProducts$.subscribe((res) => {
      this.productsLenght = res.length;
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe(); // Unsubscribe from recentProducts$ subscription to prevent memory leaks
}

}
