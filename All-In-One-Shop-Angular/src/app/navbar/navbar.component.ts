import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserStoreService } from '../services/user-store.service';
import { NgToastService } from 'ng-angular-popup';
import { AppComponent } from '../app.component';
import { HttpClient } from '@angular/common/http';
import { ShoppingCartService } from '../services/shopping-cart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  
  constructor(private router: Router, private auth: AuthService, private userStore: UserStoreService, private shoppingCart: ShoppingCartService) { }

  fullName: string = "";
  activeShoppingCart: boolean = false;
  modalTitle: string = "";
  shoppingCartItemsCount: number = 0;
  userId: number = 0;
  shoppingCartId: number|string = 0;

  public ngOnInit(): void {
        
    this.userStore.getFullNameFromStore()
    .subscribe(name => {
      let fullNameFromToken = this.auth.getFullNameFromToken();
      this.fullName = name || fullNameFromToken;
    });

    this.userStore.getIdFromStore()
      .subscribe(id => {
        let idFromRoken = this.auth.getIdFromToken();
        this.userId = id || idFromRoken;

        if (this.userId != undefined) {
          this.shoppingCart.getObservableCartItems().subscribe(() => {
            this.shoppingCart.getShoppingCartByUserId(this.userId).subscribe((s) => {
              this.shoppingCartId = s.id;
              this.shoppingCart.getStoragesInShoppngCart(s.id).subscribe(st => {
                this.shoppingCartItemsCount = st.length;
                console.log('its faked');                                               
              })
            });
          }) 
        }
        else{
          this.shoppingCart.getObservableCartItems().subscribe((s) => {
            this.shoppingCartItemsCount = s.length;
          });
        }
      });
  }

  refreshPage(){
    this.router.navigate(['/home']).then(() => window.location.reload());
  }

  logOut(){
    this.auth.signOut();
    this.userStore.clearStore();
    this.router.navigate(['/home']).then(() => window.location.reload());
  }

  get staticLoggin(){
    return this.auth.isLoggedIn();
  }

  openCart(){
    this.modalTitle = "Shopping Cart";
    this.activeShoppingCart = true;
  }

}
