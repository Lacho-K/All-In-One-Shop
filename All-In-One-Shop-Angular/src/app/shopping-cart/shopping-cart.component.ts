import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { forkJoin, switchMap } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { ProductResponseModel } from '../models/productResponseModel';
import { ProductTypeResponseModel } from '../models/productTypeResponseModel';
import { StorageResponseModel } from '../models/storageResponseModel';
import { AuthService } from '../services/auth.service';
import { ShopApiService } from '../services/shop-api.service';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { UserStoreService } from '../services/user-store.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

  constructor(private shopApi: ShopApiService, private shoppingCart: ShoppingCartService, private router: Router, private toaster: NgToastService, private authService: AuthService, private userStore: UserStoreService) { }

  productList: ProductResponseModel[] = [];
  storageList: StorageResponseModel[] = [];

  userId: number = 0;
  shoppingCartId: number | string = 0;


  // the sum price of items in shopping-cart
  displaySum: number = 0;

  ngOnInit(): void {

    this.shoppingCart.getObservableCartItems().subscribe(() => {

      this.userStore.getIdFromStore()
        .subscribe(id => {
          let idFromRoken = this.authService.getIdFromToken();
          this.userId = id || idFromRoken;
          this.shoppingCart.getShoppingCartByUserId(this.userId).subscribe(s => {
            this.shoppingCartId = s.id;
            this.getProductsInCart();
          });
        });

      console.log(this.productList);

    })
  }


  getProductsInCart() {
    console.log(this.shoppingCartId);
    
    this.shoppingCart.getStoragesInShoppngCart(this.shoppingCartId).pipe(
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

  removeItemFromCart(i: number) {
    this.shoppingCart.deleteStorageFromShoppingCart(this.shoppingCartId, this.storageList[i].id);
  }

  mouseHover(i: number) {
    document.getElementsByClassName('text-danger clickable')[i].classList.remove('text-danger');
  }

  mouseOut(i: number) {
    document.getElementsByClassName('clickable')[i].classList.add('text-danger');
  }

}
