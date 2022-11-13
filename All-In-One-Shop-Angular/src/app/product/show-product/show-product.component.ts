import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ShopApiService } from 'src/app/shop-api.service';

@Component({
  selector: 'app-show-product',
  templateUrl: './show-product.component.html',
  styleUrls: ['./show-product.component.css']
})
export class ShowProductComponent implements OnInit {

  // Lists of visualisable objects
  productList$!:Observable<any[]>;
  productTypesList$!:Observable<any[]>;
  storagesList$!:Observable<any[]>;

  // Lists of objects used to map data
  productTypesList:any=[];
  storagesList:any=[];
  productsList:any=[];
  
  // Maps used to display data associate with foreign keys
  productTypesMap:Map<number, string> = new Map();
  storagesMap:Map<number, any> = new Map();

  constructor(private service: ShopApiService) { }

  ngOnInit(): void {
    this.productList$ = this.service.getProductsList();
    this.productTypesList$ = this.service.getProductTypesList();
    this.storagesList$ = this.service.getStoragesList();

    this.mapProductTypes();
    this.mapStoragesWithProducts();
  }

  //Variables(properties)
  modalTitle:string = '';
  activeAddEditProductComponent:boolean = false;
  product:any;



  mapProductTypes(){
    this.service.getProductTypesList().subscribe(data => {
      this.productTypesList = data;

      for (let i = 0; i < data.length; i++) {
        this.productTypesMap.set(this.productTypesList[i].id, this.productTypesList[i].productTypeStr)        
      }
    })
  }

  modalAdd(){
    this.product = {
      id: 0,
      name: null,
      description:null,
      productImageURL:null,
      productTypeId:null,
      price:null
    }
    this.modalTitle = "Add Product"
    this.activeAddEditProductComponent = true;
  }

  modalClose(){
    this.activeAddEditProductComponent = false;
    this.productList$ = this.service.getProductsList();
  }

  mapStoragesWithProducts(){
    this.service.getStoragesList().subscribe(storages => {
      this.storagesList = storages;

      this.service.getProductsList().subscribe(products => {
        this.productsList = products;

        for (let i = 0; i < storages.length && i < products.length; i++) {
          this.storagesMap.set(this.storagesList[i].productId, this.productsList[i])
        }
      })
    })
  }

}