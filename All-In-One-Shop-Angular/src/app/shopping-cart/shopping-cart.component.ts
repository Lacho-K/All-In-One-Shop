import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ProductResponseModel } from '../models/productResponseModel';
import { ShopApiService } from '../services/shop-api.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

  constructor(private shopApi: ShopApiService) { }

  productList$!:Observable<ProductResponseModel[]>;


  ngOnInit(): void {
    this.productList$ = this.shopApi.getProductsList();
  }

}
