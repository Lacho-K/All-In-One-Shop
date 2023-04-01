import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductResponseModel } from '../models/productResponseModel';
import { ShoppingCartModel } from '../models/shoppingCartModel';
import { ShoppingCartResponseModel } from '../models/shoppingCartResponseModel';
import { StorageResponseModel } from '../models/storageResponseModel';
import { ShopApiService } from './shop-api.service';
import { UserStoreService } from './user-store.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  readonly shoppingCartApiUrl = "https://localhost:7220/api/shoppingCarts"
  private cartItems$ = new BehaviorSubject<StorageResponseModel[]>([]);
  private cartKey = 'cartItems';

  constructor(private http: HttpClient, private shopApi: ShopApiService, private toaster: NgToastService, private userStore: UserStoreService, private auth: AuthService) {
    this.loadCartItemsFrom();
  }

  private loadCartItemsFrom() {
    let cartItems: StorageResponseModel[] = [];
    let userId: number | string | null = 0;

    this.userStore.getIdFromStore().subscribe(id => {
      let idFromRoken = this.auth.getIdFromToken();
      userId = id || idFromRoken;

      if (userId != undefined) {
        this.getStoragesInShoppngCart((userId as unknown as number)).subscribe((items) => {
          cartItems = items;
        });
      }
      else {
        cartItems = JSON.parse(localStorage.getItem(this.cartKey) || '[]');
      }

      this.cartItems$.next(cartItems);
    })
  }

  getObservableCartItems() {
    return this.cartItems$.asObservable();
  }

  getShoppingCarts(): Observable<ShoppingCartResponseModel[]> {
    return this.http.get<ShoppingCartResponseModel[]>(this.shoppingCartApiUrl);
  }

  getShoppingCartById(id: number | string): Observable<ShoppingCartResponseModel> {
    return this.http.get<ShoppingCartResponseModel>(this.shoppingCartApiUrl + `/${id}`);
  }

  getShoppingCartByUserId(userId: number): Observable<ShoppingCartResponseModel> {
    return this.http.get<ShoppingCartResponseModel>(this.shoppingCartApiUrl + `/user/${userId}?userId=${userId}`)
  }

  addShoppingCart(shoppingCart: ShoppingCartModel) {
    return this.http.post(this.shoppingCartApiUrl, shoppingCart);
  }

  deleteShoppingCart(id: number | string) {
    return this.http.delete(this.shoppingCartApiUrl + `/${id}`);
  }

  getStoragesInShoppngCart(id: number | string): Observable<StorageResponseModel[]> {
    return this.http.get<StorageResponseModel[]>(this.shoppingCartApiUrl + `/${id}/storages`)
  }

  addStorageToShoppingCart(id: number | string, storageId: number | string) {
    return this.http.put(this.shoppingCartApiUrl + `/${id}/storages?cartId=${id}&storageId=${storageId}`, storageId).subscribe({
      next: () => {
        this.shopApi.getStoragetById(storageId).subscribe({
          next: targetStorage => {
            let cartItems = this.cartItems$.value;
            cartItems.push(targetStorage);
            this.cartItems$.next(cartItems);
            this.toaster.success({ detail: "SUCCESS", summary: "Product added to Shopping Cart", duration: 2000, position: 'tl' });
          },
          error: () => {
            this.toaster.error({ detail: "ERROR", summary: "Storage of product not found", duration: 2000, position: 'tl' });
          }
        });
      },
      error: () => {
        this.toaster.error({ detail: "ERROR", summary: "Product already in cart", duration: 2000, position: 'tl' });
      }
    });
  }

  addToLocalStorageCart(item: StorageResponseModel) {
    const cartItems = this.cartItems$.value;
    if (!this.isDuplicateItem(cartItems, item)){
      cartItems.push(item);
      this.cartItems$.next(cartItems);
      localStorage.setItem(this.cartKey, JSON.stringify(cartItems));
      this.toaster.success({ detail: "SUCCESS", summary: "Product added to Shopping Cart", duration: 2000, position: 'tl' })
    }
    else{
      this.toaster.error({ detail: "ERROR", summary: "Product already in cart", duration: 2000, position: 'tl' });
    }
  }

  deleteStorageFromShoppingCart(id: number | string, storageId: number | string) {
    return this.http.delete(this.shoppingCartApiUrl + `/${id}/storages?cartId=${id}&storageId=${storageId}`).subscribe({
      next: (() => {
        let cartItems = this.cartItems$.value;
        cartItems = cartItems.filter((cartItem) => cartItem.id !== storageId);
        this.cartItems$.next(cartItems);
        this.toaster.info({ detail: "INFO", summary: "Product removed from Shopping Cart", duration: 2000, position: 'tl' })
      }),
      error: ((e) => {
        this.toaster.error({ detail: "ERROR", summary: `${e.message}`, duration: 2000, position: 'tl' });
      })
    });
  }

  removeFromlocalStorageCart(item: StorageResponseModel) {
    let cartItems = this.cartItems$.value;
    cartItems = cartItems.filter((cartItem) => cartItem.id !== item.id);
    this.cartItems$.next(cartItems);
    localStorage.setItem(this.cartKey, JSON.stringify(cartItems));
    this.toaster.info({ detail: "INFO", summary: "Product removed from Shopping Cart", duration: 2000, position: 'tl' })
  }

  isDuplicateItem(items: StorageResponseModel[], newItem: StorageResponseModel): boolean {
    if (items.find(item => item.id == newItem.id)) {
      return true;
    }
    return false;
  }

}