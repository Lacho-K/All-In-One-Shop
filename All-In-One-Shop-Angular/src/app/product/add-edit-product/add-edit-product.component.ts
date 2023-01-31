import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import ValidateForm from 'src/app/helpers/validateForm';
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

  //Form validation
  addEditForm !: FormGroup;

  constructor(private service: ShopApiService, private fb: FormBuilder) { }


  @Input() product : ProductResponseModel = new ProductResponseModel(0, "", "", "", 0, 0);
  productId: number | string = 0;
  name : FormControl = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  description : FormControl = new FormControl('', Validators.maxLength(200));
  productImageURL : FormControl = new FormControl('', [Validators.required, Validators.pattern('^https?:\\\/\\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\\/=]*)$')]);
  productTypeId: FormControl = new FormControl('', Validators.required);;
  price : FormControl = new FormControl('', [Validators.required, Validators.pattern('^\\d*[.,]?\\d{0,2}$')]);
  

  @Input() storage : StorageResponseModel = new StorageResponseModel(0, 0, 0, "", "");
  id: number | string = 0;
  productQuantity : FormControl = new FormControl('', [Validators.required, Validators.pattern('^\\d*$')]);
  productLocation: FormControl = new FormControl('', Validators.required);
  productRatings: FormControl = new FormControl('', Validators.required);


  ngOnInit(): void {

    this.addEditForm = this.fb.group({
      name: this.name,
      description: this.description,
      imgUrl: this.productImageURL, 
      productType: this.productTypeId,
      price: this.price,
      quantity: this.productQuantity,
      location: this.productLocation,
      ratings: this.productRatings
    });    

    this.id = this.storage.id; 
    this.productId = this.product.id;

    this.name.setValue(this.product.name);
    this.description.setValue(this.product.description);
    this.productImageURL.setValue(this.product.productImageURL);
    this.productTypeId.setValue(this.product.productTypeId);
    this.price.setValue(this.product.price);
    this.productQuantity.setValue(this.storage.productQuantity);
    this.productLocation.setValue(this.storage.productLocation);
    this.productRatings.setValue(this.storage.productRatings);
    

    this.productLis$ = this.service.getProductsList();
    this.storageLis$ = this.service.getStoragesList();
    this.productTypesList$ = this.service.getProductTypesList();
  }

  addProduct(){
    
    var product = {
      name: this.name.value,
      description: this.description.value,
      productImageURL: this.productImageURL.value,
      productTypeId: this.productTypeId.value,
      price: this.price.value
    }           
    
    this.service.addProduct(product).subscribe(lastAddedProduct => {
      var closeModalBtn = document.getElementById('add-edit-modal-close');
      
      var currentProductStorage = {
        // casts last added product to type 'ProductResponseModel' and gets its id
        productId: (lastAddedProduct as ProductResponseModel).id,
        productQuantity: this.productQuantity.value,
        productLocation: this.productLocation.value,
        productRatings: this.productRatings.value
      }

      console.log(currentProductStorage);
      

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
      name: this.name.value,
      description: this.description.value,
      productImageURL: this.productImageURL.value,
      productTypeId: this.productTypeId.value,
      price: this.price.value
    }

    var storage = {
      id: this.id,
      productId: this.productId,
      productQuantity: this.productQuantity.value,
      productLocation: this.productLocation.value,
      productRatings: this.productRatings.value
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

  onSubmit(){    
    if(this.addEditForm.valid){
      if(this.storage.id){
        this.updateProduct();
      }
      else{
        this.addProduct();
      }
    }
    else{
      ValidateForm.validateAllFormField(this.addEditForm);

      // assign shake animatio to inputs
      document.querySelectorAll('input.ng-invalid, select.ng-invalid').forEach((current) => {
        current.classList.remove('error');
        void (current as HTMLElement).offsetWidth;
        current.classList.add('error');
      });

      
    } 
  }
}
