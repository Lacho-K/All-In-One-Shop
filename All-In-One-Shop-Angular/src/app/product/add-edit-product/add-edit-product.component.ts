import { Component, Input, OnInit } from '@angular/core';
import { distinctUntilChanged, Observable } from 'rxjs';
import { ShopApiService  } from 'src/app/shop-api.service';

@Component({
  selector: 'app-add-edit-product',
  templateUrl: './add-edit-product.component.html',
  styleUrls: ['./add-edit-product.component.css']
})
export class AddEditProductComponent implements OnInit {

  productLis$! : Observable<any[]>;
  storageLis$! : Observable<any[]>;
  productTypesList$!: Observable<any[]>;
  
  lastAddedProduct!:any;

  //Array of product objects, used to properly assign the product's storage
  productsList:any=[];

  constructor(private service: ShopApiService) { }

  
  @Input() storageWithProduct:any;
  id:number = 0;
  productId:number = 0;
  name:string = '';
  description:string = '';
  productImageURL:string = '';
  productTypeId!:number;
  price:number = 0;
  productQuantity:number = 0;
  productLocation:string = '';
  productRatings:string = '';
  
  ngOnInit(): void {
    this.id = this.storageWithProduct.id;
    this.productId = this.storageWithProduct.productId;
    this.name = this.storageWithProduct.name;
    this.description = this.storageWithProduct.description;
    this.productImageURL = this.storageWithProduct.productImageURL;
    this.productTypeId = this.storageWithProduct.productTypeId;
    this.price = this.storageWithProduct.price;
    this.productQuantity = this.storageWithProduct.productQuantity;
    this.productLocation = this.storageWithProduct.productLocation;
    this.productRatings = this.storageWithProduct.productRatings;

    this.productLis$ = this.service.getProductsList();
    this.storageLis$ = this.service.getStoragesList();
    this.productTypesList$ = this.service.getProductTypesList();
  }

  async addProduct(){
    var product = {
      name: this.name,
      description: this.description,
      productImageURL: this.productImageURL,
      productTypeId: this.productTypeId,
      price: this.price
    }
    
    this.lastAddedProduct = await this.addProductAndReturnIt(product);
        
    var storage = {
      productId: this.lastAddedProduct.id,
      productQuantity: this.productQuantity,
      productLocation: this.productLocation,
      productRatings: this.productRatings
    }

    this.service.addStorage(storage).subscribe(res => {});

  }

  async addProductAndReturnIt(product:any): Promise<any>{
    return new Promise<any>((resolve) => {
    this.service.addProduct(product).subscribe(res => {
      var closeModalBtn = document.getElementById('add-edit-modal-close');
      if(closeModalBtn){
        closeModalBtn.click();
      }
    //Returns the last added product
      resolve(res);

      var showAddSuccess = document.getElementById('add-success-alert');
      if(showAddSuccess){
        showAddSuccess.style.display = "block";
      }

      setTimeout(function (){
        if(showAddSuccess){
          showAddSuccess.style.display = "none"
        }
      }, 4000)
    })
  })
}

  updateProduct(){
    var storageWithProduct = {
      id: this.id,
      name: this.name,
      description: this.description,
      productImageURL: this.productImageURL,
      productTypeId: this.productTypeId,
      price: this.price
    }

    var id:number = this.id;

    this.service.updateProduct(id, storageWithProduct).subscribe(res => {

      var closeModalBtn = document.getElementById('add-edit-modal-close');

      if(closeModalBtn){
        closeModalBtn.click();
      }

      var showUpdateSuccess = document.getElementById('update-success-alert');

      if(showUpdateSuccess){
        showUpdateSuccess.style.display = "block";
      }

      setTimeout(function (){
        if(showUpdateSuccess){
          showUpdateSuccess.style.display = "none"
        }
      }, 4000)
    })
  }

}
