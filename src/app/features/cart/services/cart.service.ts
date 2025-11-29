import { environment } from './../../../../environments/environment.development';
import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly httpClient = inject(HttpClient);
  private readonly cookieService = inject(CookieService);

  // countNumber : BehaviorSubject<number> = new BehaviorSubject(0);
  countNumber: WritableSignal<number> = signal(0);
    
  

  addProductToCart(id: string): Observable<any> {
    return this.httpClient.post(environment.baseUrl + 'cart', 
    {
    "productId": id,
  } );
  }
  getCartItems(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + 'cart');
  }

  updateCartItemQuantity(id: string, quantity: number): Observable<any> {
    return this.httpClient.put(environment.baseUrl + `cart/${id}`, { count:quantity });
  }

  removeCartItem(id: string): Observable<any> {
    return this.httpClient.delete(environment.baseUrl + `cart/${id}`);
  }

  checkOutSession(id: string | null, data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + `orders/checkout-session/${id}?url=http://localhost:4200`, data);
  }

  getAllOrders(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `orders/user/${this.cookieService.get('userId')}`);
  }

}
