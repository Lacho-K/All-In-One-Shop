import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductResponseModel } from 'src/app/models/productResponseModel';
import { ProductTypeResponseModel } from 'src/app/models/productTypeResponseModel';
import { StorageResponseModel } from 'src/app/models/storageResponseModel';
import { ShopApiService  } from 'src/app/shop-api.service';

@Component({
  selector: 'app-add-edit-product',
  templateUrl: './add-edit-product.component.html',
  styleUrls: ['./add-edit-product.component.css']
})
export class AddEditProductComponent implements OnInit {

  productLis$! : Observable<ProductResponseModel[]>;
  storageLis$! : Observable<StorageResponseModel[]>;
  productTypesList$!: Observable<ProductTypeResponseModel[]>;
  
  constructor(private service: ShopApiService) { }

  
  @Input() product : ProductResponseModel = new ProductResponseModel(0, "", "", "", 0, 0);
  productId: number | string = 0;
  name:string = '';
  description:string = '';
  productImageURL:string = '';
  productTypeId!: number | string;
  price:number = 0;
  

  @Input() storage : StorageResponseModel = new StorageResponseModel(0, 0, 0, "", "");
  id: number | string = 0;
  productQuantity:number = 0;
  productLocation:string = '';
  productRatings:string = '';

  ngOnInit(): void {
    this.id = this.storage.id;

    console.log(this.storage);
    console.log(this.product);
    

    this.productId = this.product.id;
    this.name = this.product.name;
    this.description = this.product.description;
    this.productImageURL = this.product.productImageURL;
    this.productTypeId = this.product.productTypeId;
    this.price = this.product.price;

    this.productQuantity = this.storage.productQuantity;
    this.productLocation = this.storage.productLocation;
    this.productRatings = this.storage.productRatings;

    this.productLis$ = this.service.getProductsList();
    this.storageLis$ = this.service.getStoragesList();
    this.productTypesList$ = this.service.getProductTypesList();
  }

  addProduct(){
    var product = {
      name: this.name,
      description: this.description,
      productImageURL: this.productImageURL,
      productTypeId: this.productTypeId,
      price: this.price
    }        

    this.service.addProduct(product).subscribe(lastAddedProduct => {
      var closeModalBtn = document.getElementById('add-edit-modal-close');
      
      var currentProductStorage = {
        // casts last added product to type 'ProductResponseModel' and gets its id
        productId: (lastAddedProduct as ProductResponseModel).id,
        productQuantity: this.productQuantity,
        productLocation: this.productLocation,
        productRatings: this.productRatings
      }

      this.service.addStorage(currentProductStorage).subscribe(() => {
        if(closeModalBtn){
          closeModalBtn.click();
        }
  
        var showAddSuccess = document.getElementById('add-success-alert');
  
        if(showAddSuccess){
          showAddSuccess.style.display = "block";
        }
  
        setTimeout(function (){
          if(showAddSuccess){
            showAddSuccess.style.display = "none"
          }
        }, 4000)
      });
    })
  }

  updateProduct(){

    var product = {
      id: this.productId,
      name: this.name,
      description: this.description,
      productImageURL: this.productImageURL,
      productTypeId: this.productTypeId,
      price: this.price
    }

    var storage = {
      id: this.id,
      productId: this.productId,
      productQuantity: this.productQuantity,
      productLocation: this.productLocation,
      productRatings: this.productRatings
    }

    var productId: number | string = this.productId;
    var storageId: number | string = this.id;
    
    this.service.updateStorage(storageId, storage).subscribe(() => {

      this.service.updateProduct(productId, product).subscribe(() => {

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

      });    
    })
  }

}
