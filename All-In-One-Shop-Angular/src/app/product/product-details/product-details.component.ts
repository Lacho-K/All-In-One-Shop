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
import CheckUserRole from 'src/app/helpers/checkUserRole';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { NgToastService } from 'ng-angular-popup';
import { ShoppingCartModel } from 'src/app/models/shoppingCartModel';
import { StorageModel } from 'src/app/models/storageModel';



@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  constructor(private route:ActivatedRoute, private service: ShopApiService, private router: Router, private userStore: UserStoreService, private auth: AuthService, private http: HttpClient, private shoppingCart: ShoppingCartService, private toaster: NgToastService) { }

  // The Id used to get the current item's storage with which we can display all information about a product
  storageId : string | null = null

  //variables used to display all available information about a product
  storage : StorageResponseModel = new StorageResponseModel('', 0, 0, '', '');
  product : ProductResponseModel = new ProductResponseModel('', '', '', '', '', 0);
  productType : ProductTypeResponseModel = new ProductTypeResponseModel('', '');

  //Modal variables
  modalTitle:string = '';
  activeAddEditProductComponent:boolean = false;

  //Subscriptions we need to destroy after we're done with displaying info to prevent memory leaks
  subscriptions: Subscription = new Subscription();

  ngOnInit(): void {
    this.storageId = this.route.snapshot.paramMap.get('storageId');
 
    this.assignProductInfo();
    
    AppComponent.IsLoggedIn = this.auth.isLoggedIn();
    CheckUserRole.checkUserRole(this.userStore, this.auth, this.http);
  }

  assignProductInfo(){
    //Adding to 'subscriptions' to be able to unsubscribe from all subscriptions when they're not needed
    this.subscriptions.add(this.service.getStoragetById((this.storageId as string)).subscribe(dbStorage =>{
      this.storage = dbStorage;
      this.subscriptions.add(this.service.getProductById(this.storage.productId).subscribe(dbProduct => {
        this.product = dbProduct;
        this.subscriptions.add(this.service.getProductTypeById(this.product.productTypeId).subscribe(dbProductType => {
          this.productType = dbProductType;
        }))
      }))
    }))
  }

  modalEdit(product:any, storage: any){
    this.product = product;
    this.storage = storage;

    this.modalTitle = "Edit Product";
    this.activeAddEditProductComponent = true;
  }

  deleteProduct(deleteProduct : any, storageAssociatedWithProduct : any){

    if(confirm(`Are you sure you want to delete "${deleteProduct.name}"`))
    {
      this.service.deleteStorage(storageAssociatedWithProduct.id).subscribe(() => {

        this.service.deleteProduct(deleteProduct.id).subscribe(res => {

          this.router.navigate(['/products']).then(() => {
            var showDeleteSuccess = document.getElementById('delete-success-alert');
            if(showDeleteSuccess){
              showDeleteSuccess.style.display = "block";
            }
    
            setTimeout(function (){
              if(showDeleteSuccess){
                showDeleteSuccess.style.display = "none"
              }
            }, 4000)
          })
          })
      })                 
     }
  }

  addToShoppingCart(){
    // if(this.shoppingCart.checkIfItemIsDuplicate(this.storage.id)){
    //   this.toaster.warning({detail: "WARNING", summary: "Product already in shopping cart", position: "tl", duration: 3000});
    //   return;
    // }

    //this.toaster.success({detail: "SUCCESS", summary: "Product added to shopping cart", position: "tl", duration: 3000});


    // this.shoppingCart.getStoragesInShoppngCart(24).subscribe(res => {
    //   console.log(res);
    // })

    // this.service.getUsersList().subscribe(res => {
    //   console.log(res);
      
    // })

    this.userStore.getIdFromStore().subscribe(id => {
      let idFromService = this.auth.getIdFromToken();
      console.log(id || idFromService);
    })
    

  }

  modalClose(){
    this.assignProductInfo();
    this.activeAddEditProductComponent = false;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  get getIsAdmin(){
    return AppComponent.IsAdmin;
  }

}
