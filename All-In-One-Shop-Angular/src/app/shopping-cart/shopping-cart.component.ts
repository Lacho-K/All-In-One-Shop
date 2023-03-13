import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
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

  constructor(private shopApi: ShopApiService, private shoppingCart: ShoppingCartService, private router: Router) { }

  productList: ProductResponseModel[] = [];
  storageList: StorageResponseModel[] = [];

  // the sum price of items in shopping-cart
  displaySum: number = 0;

  ngOnInit(): void { 
    
    this.getProductsInCart();

    console.log(this.productList);

    this.shoppingCart.getObservableCartItems().subscribe((storages) => {
      this.storageList = storages;
    
      this.addProductToShoppingCart();
    });   

  }


  addProductToShoppingCart(){
      this.shopApi.getProductById(this.storageList[this.storageList.length - 1].productId)
      .subscribe((lastAddedProduct) => {
        this.productList.push(lastAddedProduct);

        this.displaySum += lastAddedProduct.price;

        // rounds the number to second decimal point
        this.displaySum = Math.round(this.displaySum * 1e2) / 1e2;
      })
  }

  getProductsInCart(){
    let previouslyAddedProducts = this.shoppingCart.getStaticCartItems();

    // loop skips last element because it gets added at the start anyways
    for (let i = 0; i < previouslyAddedProducts.length - 1; i++) {
      this.shopApi.getProductById(previouslyAddedProducts[i].id).subscribe(product => {
        this.productList.push(product);

        this.displaySum += product.price;
      })
    }
  }

  navigation(i: number){
    this.router.navigate([`products/productDetails/${this.storageList[i].productId}`]).then(() => window.location.reload());
  }

}
