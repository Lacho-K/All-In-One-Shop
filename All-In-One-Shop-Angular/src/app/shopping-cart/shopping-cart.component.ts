import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  displaySum: string = "";

  initialCheck: boolean = false;

  ngOnInit(): void { 
    if(!this.initialCheck){
      this.getProductsInCart();
      this.getSumOfProducts();
    }

    this.initialCheck = true;
    console.log(this.productList);


    this.shoppingCart.getObservableCartItems().subscribe((storages) => {
    this.storageList = storages;
    
    this.getSumOfProducts();
    this.getLastProduct();
    
   });   
  }

  getSumOfProducts(){
   let currentSum = 0;
   for (let i = 0; i < this.productList.length; i++) {
      currentSum += this.productList[i].price;
   }
   this.displaySum = currentSum.toFixed(2);
  }

  getLastProduct(){
      this.shopApi.getProductById(this.storageList[this.storageList.length - 1].productId)
      .subscribe((p) => {
        this.productList.push(p);
      })
  }

  getProductsInCart(){
    let previouslyAddedProducts = this.shoppingCart.getStaticCartItems();

    for (let i = 0; i < previouslyAddedProducts.length - 1; i++) {
      this.shopApi.getProductById(previouslyAddedProducts[i].id).subscribe(p => {
        this.productList.push(p);
      })
    }
  }

  navigation(i: number){
    this.router.navigate([`products/productDetails/${this.storageList[i].productId}`]).then(() => window.location.reload());
  }

}
