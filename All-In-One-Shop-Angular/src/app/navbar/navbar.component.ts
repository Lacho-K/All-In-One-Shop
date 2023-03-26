import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserStoreService } from '../services/user-store.service';
import { NgToastService } from 'ng-angular-popup';
import { AppComponent } from '../app.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  
  constructor(private router: Router, private auth: AuthService, private userStore: UserStoreService, private toast: NgToastService, private http: HttpClient) { }

  fullName: string = "";
  activeShoppingCart: boolean = false;
  modalTitle: string = "";

  public ngOnInit(): void {
    
    AppComponent.IsLoggedIn = this.auth.isLoggedIn();
    
    this.userStore.getFullNameFromStore()
    .subscribe(name => {
      let fullNameFromToken = this.auth.getFullNameFromToken();
      this.fullName = name || fullNameFromToken;
    });
  }

  refreshPage(){
    this.router.navigate(['/home']).then(() => window.location.reload());
  }

  logOut(){
    this.auth.signOut();
    AppComponent.IsLoggedIn = this.auth.isLoggedIn();
    AppComponent.IsAdmin = this.auth.isAdmin();
    this.userStore.clearStore();
    this.router.navigate(['/home']).then(() => window.location.reload());
  }

  get staticLoggin(){
    return AppComponent.IsLoggedIn;
  }

  openCart(){
    this.modalTitle = "Shopping Cart";
    this.activeShoppingCart = true;
    //console.log(this.activeShoppingCart);  
  }

}
