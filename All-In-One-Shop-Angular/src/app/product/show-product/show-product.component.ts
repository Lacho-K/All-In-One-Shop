import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, combineLatest, forkJoin, map, switchMap } from 'rxjs';
import UrlValidator from 'src/app/helpers/validateUrl';
import { ProductResponseModel } from 'src/app/models/productResponseModel';
import { ProductTypeResponseModel } from 'src/app/models/productTypeResponseModel';
import { StorageResponseModel } from 'src/app/models/storageResponseModel';
import { AuthService } from 'src/app/services/auth.service';
import { ShopApiService } from 'src/app/services/shop-api.service';



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


  constructor(private shopApi: ShopApiService, private auth: AuthService, private router: Router) {
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

  // gets current storages's products
  getStoragesProducts(): Observable<ProductResponseModel[]> {
    const productObservables = this.storagesList.map(s => {
      return this.shopApi.getProductById(s.productId);
    });

    return forkJoin(productObservables);
  }

  // gets current products's storages
  sortProductByStorageDateAdded() {
    this.productList$.pipe(
      switchMap(productList => {
        const storageObservables = productList.map((p: { id: string | number; }) => this.shopApi.getStorageByProductId(p.id));
        return forkJoin(storageObservables);
      })
    ).subscribe(storages => {
      this.storagesList = (storages as StorageResponseModel[]).sort((s1, s2) => s1.dateCreated > s2.dateCreated ? 1 : -1);
      this.productList$ = this.getStoragesProducts();
    })
  }

  //Variables(properties)
  selectedProductType: string = "";
  modalTitle: string = "";
  activeAddEditProductComponent: boolean = false;
  product: any;
  storage: any;
  currentPage: number = 1;
  itemsPerPage: number = 3;
  sortingParameter: string = '';

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
    this.getProductsOnCurrentPage();
  }

  navigation(i: number) {
    this.router.navigate([`products/productDetails/${this.storagesList[i].id}`]);
  }

  search() {
    const searchName = (document.getElementById('searchInput') as HTMLInputElement).value
    this.productList$ = this.shopApi.getFilteredProducts(this.selectedProductType, searchName);
    this.getProductsOnCurrentPage();
    this.currentPage = 1;
    this.sortingParameter = '';
  }

  checkAllCategories() {
    this.selectedProductType = '';
  }

  // method that determines the validity of product image urls
  validateUrl(url: string) {
    return UrlValidator.testUrl(url);
  }

  get getIsAdmin() {
    return this.auth.isAdmin();
  }

  onPageChange(pageNumber: number) {
    this.currentPage = pageNumber;
    this.getProductsOnCurrentPage();
  }

  sortProductsByPrice() {
    this.sortingParameter = 'price';

    let sortedProducts$ = this.productList$.pipe(
      map((products) => [...products].sort((p1, p2) => p1.price - p2.price))
    );

    this.productList$ = sortedProducts$;
  }

  sortProductsByName() {
    this.sortingParameter = 'name';

    let sortedProducts$ = this.productList$.pipe(
      map((products) => [...products].sort((p1, p2) => p1.name.localeCompare(p2.name)))
    );

    this.productList$ = sortedProducts$;
  }

  sortProductsByDateAdded() {
    this.sortingParameter = 'date added';

    this.sortProductByStorageDateAdded();
  }
}
