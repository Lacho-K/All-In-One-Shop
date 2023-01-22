import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShopApiService } from 'src/app/shop-api.service';
import { Router } from '@angular/router';
import { ProductResponseModel } from 'src/app/models/productResponseModel';
import { StorageResponseModel } from 'src/app/models/storageResponseModel';
import { ProductTypeResponseModel } from 'src/app/models/productTypeResponseModel';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  constructor(private route:ActivatedRoute, private service: ShopApiService, private router: Router) { }

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

    if(confirm(`Are you sure you want to delete this Product:  "${deleteProduct.name}"`))
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

  modalClose(){
    this.assignProductInfo();
    this.activeAddEditProductComponent = false;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
}

}
