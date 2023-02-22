import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'All-In-One-Shop-Angular';
  public static IsLoggedIn: boolean
  public static IsAdmin: boolean
}
