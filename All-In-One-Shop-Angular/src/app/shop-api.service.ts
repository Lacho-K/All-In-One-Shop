import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShopApiService {

  readonly shopAPIUrl = "https://localhost:7220/api"

  constructor(private http:HttpClient) { }

  // Products

  getProductsList(): Observable<any[]>{
    return this.http.get<any>(this.shopAPIUrl + '/products');
  }

  getProductById(id:number|string): Observable<any>{
    return this.http.get<any>(this.shopAPIUrl + `/products/${id}`)
  }

  addProduct(data:any){
    return this.http.post(this.shopAPIUrl + '/products', data)
  }

  updateProduct(id:number|string, data:any){
    return this.http.put(this.shopAPIUrl + `/products/${id}`, data)
  }

  deleteProduct(id:number|string){
    return this.http.delete(this.shopAPIUrl + `/products/${id}`)
  }

  // Storage

  getStoragesList(): Observable<any[]>{
    return this.http.get<any>(this.shopAPIUrl + '/storages');
  }

  getStoragetById(id:number|string): Observable<any>{
    return this.http.get<any>(this.shopAPIUrl + `/storages/${id}`)
  }

  addStorage(data:any){
    return this.http.post(this.shopAPIUrl + '/storages', data)
  }

  updateStorage(id:number|string, data:any){
    return this.http.put(this.shopAPIUrl + `/storages/${id}`, data)
  }

  deleteStorage(id:number|string){
    return this.http.delete(this.shopAPIUrl + `/storages/${id}`)
  }

  // ProductTypes

  getProductTypesList(): Observable<any[]>{
    return this.http.get<any>(this.shopAPIUrl + '/productTypes');
  }

  getProductTypeById(id:number|string): Observable<any>{
    return this.http.get<any>(this.shopAPIUrl + `/productTypes/${id}`)
  }

  addProductType(data:any){
    return this.http.post(this.shopAPIUrl + '/productTypes', data)
  }

  updateProductTypes(id:number|string, data:any){
    return this.http.put(this.shopAPIUrl + `/productTypes/${id}`, data)
  }

  deleteProductType(id:number|string){
    return this.http.delete(this.shopAPIUrl + `/productTypes/${id}`)
  }
}
