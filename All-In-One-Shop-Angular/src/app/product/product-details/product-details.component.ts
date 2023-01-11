import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ShopApiService } from 'src/app/shop-api.service';


@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  constructor(private route:ActivatedRoute, private service: ShopApiService) { }

  storageId : string | null = null

  //the storage associated with the current page
  storage !: any

  ngOnInit(): void {
    this.storageId = this.route.snapshot.paramMap.get('storageId');
    this.service.getStoragetById((this.storageId as string)).subscribe(res =>{
      this.storage = res;
    })
    
  }

}
