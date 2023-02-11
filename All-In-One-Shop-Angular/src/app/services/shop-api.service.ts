import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductModel } from '../models/productModel';
import { ProductResponseModel } from '../models/productResponseModel';
import { ProductTypeModel } from '../models/productTypeModel';
import { ProductTypeResponseModel } from '../models/productTypeResponseModel';
import { StorageModel } from '../models/storageModel';
import { StorageResponseModel } from '../models/storageResponseModel';

@Injectable({
  providedIn: 'root'
})
export class ShopApiService {

  readonly shopAPIUrl = "https://localhost:7220/api"

  constructor(private http:HttpClient) { }

  // Products

  getProductsList(): Observable<ProductResponseModel[]>{
    return this.http.get<ProductResponseModel[]>(this.shopAPIUrl + '/products');
  }

  getProductById(id:number|string): Observable<ProductResponseModel>{
    return this.http.get<ProductResponseModel>(this.shopAPIUrl + `/products/${id}`)
  }

  addProduct(data:ProductModel){
    return this.http.post(this.shopAPIUrl + '/products', data)
  }

  updateProduct(id:number|string, data:ProductResponseModel){
    return this.http.put(this.shopAPIUrl + `/products/${id}`, data)
  }

  deleteProduct(id:number|string){
    return this.http.delete(this.shopAPIUrl + `/products/${id}`)
  }

  // Storage

  getStoragesList(): Observable<StorageResponseModel[]>{
    return this.http.get<StorageResponseModel[]>(this.shopAPIUrl + '/storages');
  }

  getStoragetById(id:number|string): Observable<StorageResponseModel>{
    return this.http.get<StorageResponseModel>(this.shopAPIUrl + `/storages/${id}`)
  }

  addStorage(data:StorageModel){
    return this.http.post(this.shopAPIUrl + '/storages', data)
  }

  updateStorage(id:number|string, data:StorageResponseModel){
    return this.http.put(this.shopAPIUrl + `/storages/${id}`, data)
  }

  deleteStorage(id:number|string){
    return this.http.delete(this.shopAPIUrl + `/storages/${id}`)
  }

  // ProductTypes

  getProductTypesList(): Observable<ProductTypeResponseModel[]>{
    return this.http.get<ProductTypeResponseModel[]>(this.shopAPIUrl + '/productTypes');
  }

  getProductTypeById(id:number|string): Observable<ProductTypeResponseModel>{
    return this.http.get<any>(this.shopAPIUrl + `/productTypes/${id}`)
  }

  addProductType(data:ProductTypeModel){
    return this.http.post(this.shopAPIUrl + '/productTypes', data)
  }

  updateProductTypes(id:number|string, data:ProductTypeResponseModel){
    return this.http.put(this.shopAPIUrl + `/productTypes/${id}`, data)
  }

  deleteProductType(id:number|string){
    return this.http.delete(this.shopAPIUrl + `/productTypes/${id}`)
  }
  
}
