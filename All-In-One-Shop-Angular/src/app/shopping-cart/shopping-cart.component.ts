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

  // the sum price of items in shopping-cart
  sum: number = 0;


  ngOnInit(): void {
   this.productList$ = this.shopApi.getProductsList();
   this.getSumOfProucts();
  }

  getSumOfProucts(){
    this.shopApi.getProductsList().subscribe((p: ProductResponseModel[]) => {
      for (let i = 0; i < p.length; i++) {
        this.sum += p[i].price;        
      }      
    });
  }

}
