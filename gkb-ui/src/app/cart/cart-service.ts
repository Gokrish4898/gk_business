import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

function getHeaders(): HttpHeaders {
  const token = localStorage.getItem('token') || '';
  return new HttpHeaders({
    'Content-Type': 'application/json; charset=utf-8',
    'Authorization': `Bearer ${token}`
  });
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(private http: HttpClient) {}

  // Cart operations
  getCart(): Observable<any> {
    return this.http.get('api/CartApi/Get', {
      headers: getHeaders(),
      observe: 'response',
    });
  }

  addItemToCart(data: any): Observable<any> {
    return this.http.post('api/CartApi/AddItem', data, {
      headers: getHeaders(),
      observe: 'response',
    });
  }

  updateItemQuantity(data: any): Observable<any> {
    return this.http.post('api/CartApi/UpdateQuantity', data, {
      headers: getHeaders(),
      observe: 'response',
    });
  }

  removeItemFromCart(id: number): Observable<any> {
    return this.http.delete(`api/CartApi/RemoveItem/${id}`, {
      headers: getHeaders(),
      observe: 'response',
    });
  }

  clearCart(): Observable<any> {
    return this.http.post('api/CartApi/Clear', {}, {
      headers: getHeaders(),
      observe: 'response',
    });
  }

  // Active payments list
  getActivePayments(): Observable<any> {
    return this.http.get('api/PaymentMasterApi/List', {
      headers: getHeaders(),
      observe: 'response',
    });
  }

  // Place order
  placeOrder(data: any): Observable<any> {
    return this.http.post('api/OrderApi/Place', data, {
      headers: getHeaders(),
      observe: 'response',
    });
  }

  // Delivery charge calculator endpoint or local computation fallback
  // The backend already handles delivery charge lookups by pincode on checkout.
  // We can fetch delivery configs if we want to display it on checkout.
  getDeliveryCharges(): Observable<any> {
    return this.http.get('api/DeliveryChargeApi/GetDeliveryCharge', {
      headers: getHeaders(),
      observe: 'response',
    });
  }
}
