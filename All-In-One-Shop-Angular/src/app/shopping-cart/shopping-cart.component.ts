import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ProductResponseModel } from '../models/productResponseModel';
import { StorageResponseModel } from '../models/storageResponseModel';
import { ShopApiService } from '../services/shop-api.service';
import { ShoppingCartService } from '../services/shopping-cart.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

  constructor(private shopApi: ShopApiService, private shoppingCart: ShoppingCartService) { }

  productList: ProductResponseModel[] = [];
  storageList: StorageResponseModel[] = [];

  // the sum price of items in shopping-cart
  displaySum: string = "";


  ngOnInit(): void { 
    this.getStoragesInCart();
    console.log(this.storageList);


    this.shoppingCart.getObservableCartItems().subscribe((products) => {
    this.productList = products;
    
    this.getSumOfProducts();
    if(this.productList.length > this.storageList.length){
      this.getLastStorageId();
    }
    
    console.log(this.storageList);  
   });   
  }

  getSumOfProducts(){
   let currentSum = 0;
   for (let i = 0; i < this.productList.length; i++) {
      currentSum += this.productList[i].price;
   }
   this.displaySum = currentSum.toFixed(2);
  }

  getLastStorageId(){
      this.shopApi.getStorageByProductId(this.productList[this.productList.length - 1]?.id).subscribe(s => {
      this.storageList.push(s);
    });
  }

  getStoragesInCart(){
    let previouslyAddedProducts = this.shoppingCart.getStaticCartItems();

    for (let i = 0; i < previouslyAddedProducts.length; i++) {
      this.shopApi.getStorageByProductId(previouslyAddedProducts[i].id).subscribe(s => {
        this.storageList.push(s);
      })
    }
  }

}
