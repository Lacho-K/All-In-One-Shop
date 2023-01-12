import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ShopApiService } from 'src/app/shop-api.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  constructor(private route:ActivatedRoute, private service: ShopApiService, private router: Router) { }

  storageId : string | null = null

  //variables used to display all available information about a product
  storage !: any
  product !: any
  productType !: any

  modalTitle:string = '';
  activeAddEditProductComponent:boolean = false;

  ngOnInit(): void {
    this.storageId = this.route.snapshot.paramMap.get('storageId');
   
    this.assignProductInfo();
  }

  assignProductInfo(){
    this.service.getStoragetById((this.storageId as string)).subscribe(dbStorage =>{
      this.storage = dbStorage;
      this.service.getProductById(this.storage.productId).subscribe(dbProduct => {
        this.product = dbProduct;
        this.service.getProductTypeById(this.product.productTypeId).subscribe(dbProductType => {
          this.productType = dbProductType;
        })
      })
    })
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

          this.router.navigate(['/products'])

          var closeModalBtn = document.getElementById('add-edit-modal-close');
          
          if(closeModalBtn){
            closeModalBtn.click();
          }
  
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
     }
  }

  modalClose(){
    this.assignProductInfo();
    this.activeAddEditProductComponent = false;
  }

}
