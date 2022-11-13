import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ShopApiService  } from 'src/app/shop-api.service';

@Component({
  selector: 'app-add-edit-product',
  templateUrl: './add-edit-product.component.html',
  styleUrls: ['./add-edit-product.component.css']
})
export class AddEditProductComponent implements OnInit {

  productLis$! : Observable<any[]>;
  productTypesList$!: Observable<any[]>;

  constructor(private service: ShopApiService) { }

  
  @Input() product:any;
  id:number = 0;
  name:string = '';
  description:string = '';
  productImageURL:string = '';
  productTypeId!:number;
  price:number = 0;
  
  ngOnInit(): void {
    this.id = this.product.id;
    this.name = this.product.name;
    this.description = this.product.description;
    this.productImageURL = this.product.productImageURL;
    this.productTypeId = this.product.productTypeId;
    this.price = this.product.price;

    this.productLis$ = this.service.getProductsList();
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

    this.service.addProduct(product).subscribe(res => {
      var closeModalBtn = document.getElementById('add-edit-modal-close');
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
    })
  }

  updateProduct(){
    var product = {
      id: this.id,
      name: this.name,
      description: this.description,
      productImageURL: this.productImageURL,
      productTypeId: this.productTypeId,
      price: this.price
    }

    var id:number = this.id;

    this.service.updateProduct(id, product).subscribe(res => {
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
