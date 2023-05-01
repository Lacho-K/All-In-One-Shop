import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ProductResponseModel } from 'src/app/models/productResponseModel';
import { StorageResponseModel } from 'src/app/models/storageResponseModel';
import { ProductTypeResponseModel } from 'src/app/models/productTypeResponseModel';
import { Subscription } from 'rxjs';
import { ShopApiService } from 'src/app/services/shop-api.service';
import { UserStoreService } from 'src/app/services/user-store.service';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { AppComponent } from 'src/app/app.component';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { NgToastService } from 'ng-angular-popup';
import UrlValidator from 'src/app/helpers/validateUrl';




@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  constructor(private route: ActivatedRoute, private service: ShopApiService, private router: Router, private userStore: UserStoreService, private auth: AuthService, private http: HttpClient, private shoppingCart: ShoppingCartService, private toaster: NgToastService) { }

  // The Id used to get the current item's storage with which we can display all information about a product
  storageId: string | null = null

  // The Ids used to get the current user's shopping cart
  userId: number = 0;
  shoppingCartId: number | string = 0;

  dateObj: Date = new Date();

  //variables used to display all available information about a product
  storage: StorageResponseModel = new StorageResponseModel('', 0, 0, '', '', this.dateObj);
  product: ProductResponseModel = new ProductResponseModel('', '', '', '', '', 0);
  productType: ProductTypeResponseModel = new ProductTypeResponseModel('', '');

  //Modal variables
  modalTitle: string = '';
  activeAddEditProductComponent: boolean = false;

  //Subscriptions we need to destroy after we're done with displaying info to prevent memory leaks
  subscriptions: Subscription = new Subscription();

  ngOnInit(): void {
    this.storageId = this.route.snapshot.paramMap.get('storageId');

    this.assignProductInfo();
  }

  assignProductInfo() {
    //Adding to 'subscriptions' to be able to unsubscribe from all subscriptions when they're not needed
    this.subscriptions.add(this.service.getStoragetById((this.storageId as string)).subscribe(dbStorage => {
      this.storage = dbStorage;
      this.subscriptions.add(this.service.getProductById(this.storage.productId).subscribe(dbProduct => {
        this.product = dbProduct;
        this.subscriptions.add(this.service.getProductTypeById(this.product.productTypeId).subscribe(dbProductType => {
          this.productType = dbProductType;
        }))
      }))
    }))
  }

  modalEdit(product: any, storage: any) {
    this.product = product;
    this.storage = storage;

    this.modalTitle = "Edit Product";
    this.activeAddEditProductComponent = true;
  }

  deleteProduct(productToDelete: any) {
    this.service.deleteProduct(productToDelete.id).subscribe(() => {
      this.router.navigate(['/products']).then(() => window.location.reload());
      this.shoppingCart.resetLocalStorageCart();
    })
  }

  addToShoppingCart() {
    this.userStore.getIdFromStore()
      .subscribe(id => {
        let idFromRoken = this.auth.getIdFromToken();
        this.userId = id || idFromRoken;

        if (this.userId != undefined) {
          this.shoppingCart.getShoppingCartByUserId(this.userId).subscribe((s) => {
            this.shoppingCartId = s.id;
            this.shoppingCart.addStorageToShoppingCart(this.shoppingCartId, (this.storageId as string));
          });
        }
        else {
          this.shoppingCart.addToLocalStorageCart(this.storage);
        }
      });
  }

  modalClose() {
    this.assignProductInfo();
    this.activeAddEditProductComponent = false;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  // method that determines the validity of product image urls
  validateUrl(url: string) {
    return UrlValidator.testUrl(url);
  }

  get getIsAdmin() {
    return this.auth.isAdmin();
  }

}
