import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductResponseModel } from '../models/productResponseModel';
import { ShoppingCartModel } from '../models/shoppingCartModel';
import { ShoppingCartResponseModel } from '../models/shoppingCartResponseModel';
import { StorageResponseModel } from '../models/storageResponseModel';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  
  readonly shoppingCartApiUrl = "https://localhost:7220/api/shoppingCarts"

  constructor(private http:HttpClient) { }

  getShoppingCarts(): Observable<ShoppingCartResponseModel[]>{
    return this.http.get<ShoppingCartResponseModel[]>(this.shoppingCartApiUrl);
  }

  getShoppingCartById(id: number|string): Observable<ShoppingCartResponseModel>{
    return this.http.get<ShoppingCartResponseModel>(this.shoppingCartApiUrl + `/${id}`);
  }

  addShoppingCart(shoppingCart: ShoppingCartModel){
    return this.http.post(this.shoppingCartApiUrl, shoppingCart);
  }

  deleteShoppingCart(id:number|string){
    return this.http.delete(this.shoppingCartApiUrl + `/${id}`);
  }

  getStoragesInShoppngCart(id:number|string): Observable<StorageResponseModel[]>{
    return this.http.get<StorageResponseModel[]>(this.shoppingCartApiUrl + `/${id}/storages`)
  }
  
}