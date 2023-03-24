import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductResponseModel } from '../models/productResponseModel';
import { ShoppingCartModel } from '../models/shoppingCartModel';
import { ShoppingCartResponseModel } from '../models/shoppingCartResponseModel';
import { StorageResponseModel } from '../models/storageResponseModel';
import { ShopApiService } from './shop-api.service';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  readonly shoppingCartApiUrl = "https://localhost:7220/api/shoppingCarts"
  private cartItems$ = new BehaviorSubject<StorageResponseModel[]>([]);

  constructor(private http: HttpClient, private shopApi: ShopApiService, private toaster: NgToastService) {
    this.loadCartItemsFromApi();
  }

  private loadCartItemsFromApi() {
    let cartItems: StorageResponseModel[] = [];
    this.getStoragesInShoppngCart(1).subscribe((items) => {
      cartItems = items;
      this.cartItems$.next(cartItems);
    });
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

  getShoppingCartByUserId(userId: number): Observable<ShoppingCartResponseModel>{
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
            this.toaster.success({detail: "SUCCESS", summary: "Product added to Shopping Cart", duration: 2000, position: 'tl'});
          },
          error: () => {
            this.toaster.error({detail:"ERROR", summary: "Storage of product not found", duration: 2000, position: 'tl'});
          }
        });
      },
      error: () => {
        this.toaster.error({detail:"ERROR", summary: "Product already in cart", duration: 2000, position: 'tl'});
      }
    });
  }

  deleteStorageFromShoppingCart(id: number | string, storageId: number | string) {
    return this.http.delete(this.shoppingCartApiUrl + `/${id}/storages?cartId=${id}&storageId=${storageId}`).subscribe({
      next: (() => {
        let cartItems = this.cartItems$.value;
        cartItems = cartItems.filter((cartItem) => cartItem.id !== storageId);
        this.cartItems$.next(cartItems);
        this.toaster.info({detail:"INFO", summary: "Product removed from Shopping Cart", duration:2000, position: 'tl'})
      }),
      error: ((e) => {
        this.toaster.error({detail:"ERROR", summary: `${e.message}`, duration: 2000, position: 'tl'});
      })
    });
  }

}