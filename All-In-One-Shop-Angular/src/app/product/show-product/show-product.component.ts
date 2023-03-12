import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import CheckUserRole from 'src/app/helpers/checkUserRole';
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
  productList$!:Observable<ProductResponseModel[]>;
  productTypesList$!:Observable<ProductTypeResponseModel[]>;
  storagesList$!:Observable<StorageResponseModel[]>;
  
  // Map used to display data associated with foreign keys
  storagesMap:Map<number | string, ProductResponseModel> = new Map();

  constructor(private service: ShopApiService, private auth: AuthService, private userStore: UserStoreService, private http: HttpClient) { }

  ngOnInit(): void {
    this.productList$ = this.service.getProductsList();
    this.productTypesList$ = this.service.getProductTypesList();
    this.storagesList$ = this.service.getStoragesList();
    this.mapStoragesWithProducts(); 

    // gets current role of user without the need to refresh the page
    CheckUserRole.checkUserRole(this.userStore, this.auth, this.http);
  }

  //Variables(properties)
  modalTitle:string = '';
  activeAddEditProductComponent:boolean = false;
  product:any;
  storage:any;

  mapStoragesWithProducts(){
    this.service.getStoragesList().subscribe(storages => {

      this.service.getProductsList().subscribe(products => {

        for (let i = 0; i < storages.length && products.length; i++) {
          this.storagesMap.set(storages[i].productId, products[i])
        }
      })
    })
  }

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
    this.productList$ = this.service.getProductsList();
    this.storagesList$ = this.service.getStoragesList();

    this.mapStoragesWithProducts(); 
  }

  get getIsAdmin(){
    return AppComponent.IsAdmin;
  }
}
