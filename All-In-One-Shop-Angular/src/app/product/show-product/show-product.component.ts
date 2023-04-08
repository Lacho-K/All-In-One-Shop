import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, map, shareReplay } from 'rxjs';
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
  currentProductList$!: Observable<ProductResponseModel[]>;

  private currentProductListSubject = new BehaviorSubject<ProductResponseModel[]>([]);

  constructor(private shopApi: ShopApiService, private auth: AuthService, private userStore: UserStoreService, private http: HttpClient, private router: Router) {
    this.productList$ = this.shopApi.getProductsList();
  }

  ngOnInit(): void {
    this.productTypesList$ = this.shopApi.getProductTypesList();
    //this.assignStorageIds();
    this.getProductsOnCurrentPage();
  }

  // used for navigation between different product pages
  assignStorageIds() {
    let storages: StorageResponseModel[] = [];
    this.currentProductList$.subscribe(products => {

      products.forEach((p: { id: string | number; }) => {
        this.shopApi.getStorageByProductId(p.id).subscribe(s => {
          storages.push(s);
        })
      })

      this.storagesList = storages;
    });
  }

  getProductsOnCurrentPage() {
    this.productList$.subscribe(paginatedProducts => {
      const currentProductList = paginatedProducts.slice(
        (this.currentPage - 1) * this.itemsPerPage,
        this.currentPage * this.itemsPerPage
      );
      this.currentProductListSubject.next(currentProductList);
      this.assignStorageIds();
    });
    this.currentProductList$ = this.currentProductListSubject.asObservable();
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
    this.currentProductList$ = this.shopApi.getFilteredProducts(this.selectedProductType, searchName);
    this.productList$ = this.currentProductList$;
    this.getProductsOnCurrentPage();
    this.currentPage = 1;
  }

  get getIsAdmin() {
    return this.auth.isAdmin();
  }
}
