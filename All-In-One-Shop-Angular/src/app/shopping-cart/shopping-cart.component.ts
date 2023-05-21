import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { forkJoin, map, switchMap, throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { ProductResponseModel } from '../models/productResponseModel';
import { ProductTypeResponseModel } from '../models/productTypeResponseModel';
import { StorageResponseModel } from '../models/storageResponseModel';
import { AuthService } from '../services/auth.service';
import { ShopApiService } from '../services/shop-api.service';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { UserStoreService } from '../services/user-store.service';
import UrlValidator from '../helpers/validateUrl';
import ModalCloser from '../helpers/closeModals';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
})
export class ShoppingCartComponent implements OnInit {

  constructor(private shopApi: ShopApiService, private shoppingCart: ShoppingCartService, private router: Router, private toaster: NgToastService, private authService: AuthService, private userStore: UserStoreService) { }

  productList: ProductResponseModel[] = [];
  storageList: StorageResponseModel[] = [];

  userId: number = 0;
  shoppingCartId: number | string = 0;

  productQuantity: number[] = [];

  ngOnInit(): void {
    this.shoppingCart.getObservableCartItems().subscribe((localStorageItems) => {
      this.userStore.getIdFromStore()
        .subscribe(id => {
          let idFromRoken = this.authService.getIdFromToken();
          this.userId = id || idFromRoken;

          if (this.userId != undefined) {
            // logged in
            this.shoppingCart.getShoppingCartByUserId(this.userId).subscribe(s => {
              this.shoppingCartId = s.id;
              this.getProductsInUserCart();
            })
          }
          else {
            // not logged in
            this.getProductsInLocalStorageCart(localStorageItems);
          }
        })
    })
  }


  getProductsInUserCart() {
    this.shoppingCart.getStoragesInShoppngCart(this.shoppingCartId).pipe(
      switchMap(storageList => {
        this.storageList = storageList;
        const productObservables = storageList.map(storage => this.shopApi.getProductById(storage.productId));
        return forkJoin(productObservables);
      })
    ).subscribe(products => {
      this.productList = products;
      if (typeof this.productQuantity !== 'undefined' && this.productQuantity.length === 0) {
        this.productQuantity = new Array(this.productList.length).fill(1);
      }
      else if (this.productQuantity.length < this.productList.length) {
        this.productQuantity.push(1);
      }
    });
  }

  getProductsInLocalStorageCart(localStorageItems: StorageResponseModel[]) {
    this.storageList = localStorageItems;
    const productObservables = localStorageItems.map(item => this.shopApi.getProductById(item.productId));
    forkJoin(productObservables).subscribe(resultProducts => {
      this.productList = resultProducts;
      if (typeof this.productQuantity !== 'undefined' && this.productQuantity.length === 0) {
        this.productQuantity = new Array(this.productList.length).fill(1);
      }
      else if (this.productQuantity.length < this.productList.length) {
        this.productQuantity.push(1);
      }
    });
  }

  navigation(i: number) {
    this.router.navigate(['products']).then(() => this.router.navigate([`products/productDetails/${this.storageList[i].id}`]));
    document.getElementById('cart-modal-close')?.click();
  }

  removeItemFromCart(i: number) {
    if (this.userId != undefined) {
      this.shoppingCart.deleteStorageFromShoppingCart(this.shoppingCartId, this.storageList[i].id);
    }
    else {
      // get target product to delete
      this.shopApi.getStoragetById(this.storageList[i].id).subscribe((targetStorage) => {
        this.shoppingCart.removeFromlocalStorageCart(targetStorage);
      })
    }
    this.productQuantity.splice(i, 1);
  }

  mouseHover(i: number) {
    document.getElementsByClassName('text-danger trashcan')[i].classList.remove('text-danger');
  }

  mouseOut(i: number) {
    document.getElementsByClassName('trashcan')[i].classList.add('text-danger');
  }


  calculateTotalPrice(i: number) {
    const currentQuantity = (document.getElementById(`${i}`) as HTMLInputElement).value;
    this.productQuantity[i] = (currentQuantity as unknown as number);
  }

  get displaySum() {
    let sum = 0;

    for (let i = 0; i < this.productList.length; i++) {
      sum += this.productList[i].price * this.productQuantity[i];
    }

    return isNaN(sum) ? 0 : sum.toFixed(2);
  }

  // method that determines the validity of product image urls
  validateUrl(url: string) {
    return UrlValidator.testUrl(url);
  }

  proceedToPay() {

    for (let i = 0; i < this.storageList.length; i++) {
      if (this.storageList[i].productQuantity >= this.productQuantity[i]) {

        this.storageList[i].productQuantity -= this.productQuantity[i];

        var storageToEdit = {
          id: this.storageList[i].id,
          productId: this.storageList[i].productId,
          productQuantity: this.storageList[i].productQuantity,
          productLocation: this.storageList[i].productLocation,
          productRatings: this.storageList[i].productRatings,
          dateCreated: this.storageList[i].dateCreated
        }
  
        this.shopApi.updateStorage(storageToEdit.id, storageToEdit).subscribe();
      }
      else{
        this.toaster.info({ detail: "INFO", summary: `${this.productList[i].name} doesn't have enough quantity`, duration: 5000, position: 'tl' });
        ModalCloser.closeOpenModals();
        this.router.navigate(['products']).then(() => this.router.navigate([`products/productDetails/${this.storageList[i].id}`]));
        return;
      }
    }

    this.shoppingCart.emptyUserShoppingCart(this.shoppingCartId);
    ModalCloser.closeOpenModals();
    this.router.navigate(['/home']);
  }
}
