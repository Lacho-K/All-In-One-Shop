import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private router: Router, private auth: AuthService) { }

  loggedIn: boolean = this.auth.isLoggedIn();

  ngOnInit(): void {

  }

  refreshPage(){
    this.router.navigate(['/home']).then(() => window.location.reload());
  }

  logOut(){
    this.auth.signOut();
    this.loggedIn = this.auth.isLoggedIn();
  }

}
