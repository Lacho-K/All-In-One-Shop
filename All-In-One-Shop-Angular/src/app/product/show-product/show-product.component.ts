import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
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
  productList$!: Observable<any>;
  productTypesList$ !: Observable<ProductTypeResponseModel[]>;
  storagesList: StorageResponseModel[] = [];
  currentProductList: ProductResponseModel[] = [];

  constructor(private shopApi: ShopApiService, private auth: AuthService, private userStore: UserStoreService, private http: HttpClient, private router: Router) {
    this.productList$ = this.shopApi.getProductsList();
  }

  ngOnInit(): void {
    this.productTypesList$ = this.shopApi.getProductTypesList();
    this.getProductsOnCurrentPage();
  }

  // used for navigation between different product pages
  assignStorageIds() {
    if (this.currentProductList.length === 0) {
      this.storagesList = [];
      return;
    }
    const storageObservables = this.currentProductList.map(p => {
      return this.shopApi.getStorageByProductId(p.id);
    });
    forkJoin(storageObservables).subscribe((results: StorageResponseModel[]) => {
      this.storagesList = results;      
    });
  }

  getProductsOnCurrentPage() {
    this.productList$.subscribe(paginatedProducts => {
      this.currentProductList = paginatedProducts.slice(
        (this.currentPage - 1) * this.itemsPerPage,
        this.currentPage * this.itemsPerPage
      );
      this.assignStorageIds();
    });
  }

  //Variables(properties)
  selectedProductType: string = "";
  modalTitle: string = "";
  activeAddEditProductComponent: boolean = false;
  product: any;
  storage: any;
  currentPage: number = 1;
  itemsPerPage: number = 2;

  modalAdd() {

    this.product = {
      id: 0,
      name: null,
      description: null,
      productImageURL: null,
      productTypeId: null,
      price: null
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

  modalClose() {
    this.activeAddEditProductComponent = false;
    this.productList$ = this.shopApi.getProductsList();
    this.assignStorageIds();
  }

  navigation(i: number) {
    this.router.navigate([`products/productDetails/${this.storagesList[i].id}`]);
  }

  search() {
    const searchName = (document.getElementById('searchInput') as HTMLInputElement).value
    this.productList$ = this.shopApi.getFilteredProducts(this.selectedProductType, searchName);
    this.getProductsOnCurrentPage();
    this.currentPage = 1;
  }

  checkAllCategories(){
    this.selectedProductType = '';
  }

  get getIsAdmin() {
    return this.auth.isAdmin();
  }
}
