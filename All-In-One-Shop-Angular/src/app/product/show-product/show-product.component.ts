import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductResponseModel } from 'src/app/models/productResponseModel';
import { ProductTypeResponseModel } from 'src/app/models/productTypeResponseModel';
import { StorageResponseModel } from 'src/app/models/storageResponseModel';
import { AuthService } from 'src/app/services/auth.service';
import { ShopApiService } from 'src/app/services/shop-api.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-show-product',
  templateUrl: './show-product.component.html',
  styleUrls: ['./show-product.component.css']
})
export class ShowProductComponent implements OnInit {

  // Lists of database objects
  productList$ !: Observable<ProductResponseModel[]>;
  productTypesList$ !: Observable<ProductTypeResponseModel[]>;
  storagesList : StorageResponseModel[] = [];
  selectedValue: any;
  
  constructor(private shopApi: ShopApiService, private auth: AuthService, private userStore: UserStoreService, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.productList$ = this.shopApi.getProductsList();
    this.productTypesList$ = this.shopApi.getProductTypesList();
    this.assignStorageIds();
    this.selectedValue = 'All categories'
  }

  // used for navigation between different product pages
  assignStorageIds(){
    let storages: StorageResponseModel[] = [];
    this.productList$.subscribe(products => {
      products.forEach(p => {
        this.shopApi.getStorageByProductId(p.id).subscribe(s => {
          storages.push(s);
        })
        this.storagesList = storages;        
      })
    });
  }

  //Variables(properties)
  modalTitle:string = '';
  activeAddEditProductComponent:boolean = false;
  product:any;
  storage:any;

  modalAdd(){

    this.product = {
      id: 0,
      name: null,
      description:null,
      productImageURL:null,
      productTypeId:null,
      price:null
    }

    this.storage = {
      id: 0,
      productId: null,
      productQuantity: null,
      productLocation: null,
      productRatings: null
    }

    this.modalTitle = "Add Product"
    this.activeAddEditProductComponent = true;
  }

  modalClose(){
    this.activeAddEditProductComponent = false;
    this.productList$ = this.shopApi.getProductsList();
    this.assignStorageIds();
  }

  navigation(i:number){
    this.router.navigate([`products/productDetails/${this.storagesList[i].id}`]);
  }

  search(){
    const searchName = (document.getElementById('searchInput') as HTMLInputElement).value
    this.productList$ = this.shopApi.getProductsByName(searchName);
    this.assignStorageIds();
  }

  filterProducts(type: string){    
    this.productList$ = this.shopApi.getProductsByType(type);
    this.assignStorageIds();
  }

  get getIsAdmin(){
    return this.auth.isAdmin();
  }
}
