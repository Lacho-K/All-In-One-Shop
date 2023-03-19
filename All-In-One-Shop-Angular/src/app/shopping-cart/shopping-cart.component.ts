import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { forkJoin, switchMap } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { ProductResponseModel } from '../models/productResponseModel';
import { ProductTypeResponseModel } from '../models/productTypeResponseModel';
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

  removing: boolean = false;

  ngOnInit(): void {

    this.getProductsInCart();

    // this.shoppingCart.getObservableCartItems().subscribe((storages) => {
    //   this.storageList = storages;

    //   this.addProductToShoppingCart(storages);
    // });   

  }


  addProductToShoppingCart(storages: StorageResponseModel[]) {
    let products: ProductResponseModel[] = [];

    let productObservables: Observable<ProductResponseModel>[] = [];
    for (let i = 0; i < storages.length; i++) {
      productObservables.push(this.shopApi.getProductById(storages[i].productId));
    }

    Promise.all(productObservables).then((productResponses) => {
      productResponses.forEach((observable) => {
        observable.subscribe((product) => {
          products.push(product);
        });
        this.productList = products;
        console.log(this.productList);

      });
    });
  }


  getProductsInCart() {
    this.shoppingCart.getStoragesInShoppngCart(24).pipe(
      switchMap(storageList => {
        this.storageList = storageList;
        const productObservables = storageList.map(storage => this.shopApi.getProductById(storage.productId));
        return forkJoin(productObservables);
      })
    ).subscribe(products => {
      this.productList = products;
    });
  }

  navigation(i: number) {
    this.router.navigate(['products']).then(() => this.router.navigate([`products/productDetails/${this.storageList[i].id}`]));
    document.getElementById('shopping-cart-modal-close')?.click(); 
  }

  // removeItemFromCart(i: number){

  //   this.shoppingCart.removeFromCart(this.storageList[i]);

  //   //this.displaySum -= this.productList[i].price;

  //   //this.productList = this.productList.splice(i,1);

  //   console.log(this.productList);
  //   console.log(this.storageList);

  // }

}
