import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserStoreService } from '../services/user-store.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public static loggedIn: any;

  
  constructor(private router: Router, private auth: AuthService, private userStore: UserStoreService, private toast: NgToastService) { }

  fullName: string = ""

  public ngOnInit(): void {
    
    NavbarComponent.loggedIn = this.auth.isLoggedIn();
    
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
    NavbarComponent.loggedIn = this.auth.isLoggedIn();
    this.refreshPage();
  }

  get staticLoggin(){
    return NavbarComponent.loggedIn;
  }

}
