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
export class UserordersService {
  constructor(private http: HttpClient) {}

  getMyOrders(): Observable<any> {
    return this.http.get('api/OrderApi/MyOrders', {
      headers: getHeaders(),
      observe: 'response',
    });
  }

  getOrderDetails(id: number): Observable<any> {
    return this.http.get(`api/OrderApi/Details/${id}`, {
      headers: getHeaders(),
      observe: 'response',
    });
  }

  cancelOrder(id: number): Observable<any> {
    return this.http.post(`api/OrderApi/Cancel/${id}`, {}, {
      headers: getHeaders(),
      observe: 'response',
    });
  }

  reorder(id: number): Observable<any> {
    return this.http.post(`api/OrderApi/Reorder/${id}`, {}, {
      headers: getHeaders(),
      observe: 'response',
    });
  }
}
