import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ShoppingCartService } from './shopping-cart.service';
import { UserStoreService } from './user-store.service';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { StorageResponseModel } from '../models/storageResponseModel';
import { UserLoginModel } from '../models/userLoginModel';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private auth: AuthService, private userStore: UserStoreService, private shoppingCart: ShoppingCartService, private router: Router) {}

  public loginUser(loginData: UserLoginModel) {
    this.auth.login(loginData)
      .subscribe({
        next: ((res: any) => {
          this.auth.storeToken(res.token);
          const tokenPayload = this.auth.decodedToken();

          this.userStore.setFullNameForStore(tokenPayload.name);
          this.userStore.setRoleForStore(tokenPayload.role);
          this.userStore.setIdForStore(tokenPayload.userId);

          this.shoppingCart.getShoppingCartByUserId(tokenPayload.userId).subscribe(sc => {
            this.shoppingCart.getStoragesInShoppngCart(sc.id).subscribe(items => {

              const localCartItems = JSON.parse(localStorage.getItem(this.shoppingCart.cartKey) || '[]');

              if (localCartItems.length != 0) {
                console.log(localCartItems);
                
                localCartItems.forEach((st: StorageResponseModel) => {
                  if (!this.shoppingCart.isDuplicateItem(items, st)) {
                    this.shoppingCart.addStorageToShoppingCart(sc.id, st.id);
                  }
                })
              }

              this.router.navigate(['/home']).then(() => window.location.reload());
              this.shoppingCart.resetLocalStorageCart();

            })
          })
        }),
        error: ((err) => {
          return throwError(err);
        })
      });
  }

}