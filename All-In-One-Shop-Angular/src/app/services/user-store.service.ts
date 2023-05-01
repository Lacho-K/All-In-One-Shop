import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ShoppingCartService } from './shopping-cart.service';

@Injectable({
  providedIn: 'root'
})
export class UserStoreService {

  private role$ = new BehaviorSubject('');
  private fullName$ = new BehaviorSubject('');
  private id$ = new BehaviorSubject('');

  constructor() { }

  public getRoleFromStore(){
    return this.role$.asObservable();
  }

  public setRoleForStore(role: string){
    this.role$.next(role);
  }

  public getFullNameFromStore(){
    return this.fullName$.asObservable();
  }

  public setFullNameForStore(fullName: string){
    this.fullName$.next(fullName);
  }

  public getIdFromStore(){
    return this.id$.asObservable();
  }

  public setIdForStore(id: string){
    this.id$.next(id);
  }

  public clearStore(){
    this.fullName$.next('');
    this.role$.next('');
  }
}
