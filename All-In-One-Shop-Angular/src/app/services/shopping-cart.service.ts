import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProductResponseModel } from '../models/productResponseModel';
import { StorageResponseModel } from '../models/storageResponseModel';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  private cartItems$ = new BehaviorSubject<ProductResponseModel[]>([]);
  private cartKey = 'cartItems';

  constructor() {
    this.loadCartItemsFromLocalStorage();
  }

  private loadCartItemsFromLocalStorage() {
    const cartItems = JSON.parse(localStorage.getItem(this.cartKey) || '[]');
    this.cartItems$.next(cartItems);
  }

  getObservableCartItems() {
    return this.cartItems$.asObservable();
  }

  getStaticCartItems(): ProductResponseModel[]{
    let products: ProductResponseModel[] = [];
    this.getObservableCartItems().subscribe(p => {
      for (let i = 0; i < p.length; i++) {
        products.push(p[i]);
      }
    })
    return products;
  }

  addToCart(item: ProductResponseModel) {
    const cartItems = this.cartItems$.value;
    cartItems.push(item);
    this.cartItems$.next(cartItems);
    localStorage.setItem(this.cartKey, JSON.stringify(cartItems));
  }

  removeFromCart(item: ProductResponseModel) {
    let cartItems = this.cartItems$.value;
    cartItems = cartItems.filter((cartItem) => cartItem.id !== item.id);
    this.cartItems$.next(cartItems);
    localStorage.setItem(this.cartKey, JSON.stringify(cartItems));
  }

  checkIfItemIsDuplicate(id: number | string): boolean{
    this.getObservableCartItems().subscribe((items) => {
      if(items.find(item => item.id == id)){
        return true;
      }
      return false;
    })
    return false;
  }
}