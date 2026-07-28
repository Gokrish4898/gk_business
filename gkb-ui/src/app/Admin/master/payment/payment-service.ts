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
export class PaymentMasterService {
  constructor(private http: HttpClient) {}

  getPayments(): Observable<any> {
    return this.http.get('api/PaymentMasterApi/AdminList', {
      headers: getHeaders(),
      observe: 'response',
    });
  }

  addPayment(data: any): Observable<any> {
    return this.http.post('api/PaymentMasterApi/Add', data, {
      headers: getHeaders(),
      observe: 'response',
    });
  }

  updatePayment(data: any): Observable<any> {
    return this.http.post('api/PaymentMasterApi/Update', data, {
      headers: getHeaders(),
      observe: 'response',
    });
  }

  deletePayment(id: number): Observable<any> {
    return this.http.delete(`api/PaymentMasterApi/Delete/${id}`, {
      headers: getHeaders(),
      observe: 'response',
    });
  }
}
