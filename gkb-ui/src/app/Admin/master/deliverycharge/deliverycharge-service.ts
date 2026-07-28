import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

let header = new HttpHeaders();
header = header.set('Content-Type', 'application/json; charset=utf-8');

@Injectable({
  providedIn: 'root',
})
export class DeliveryChargeService {
  constructor(private http: HttpClient) {}

  adddeliverycharge(data: any): Observable<any> {
    return this.http.post('api/DeliveryChargeApi/AddDeliveryCharge', data, {
      headers: header,
      observe: 'response',
    });
  }

  editdeliverycharge(data: any): Observable<any> {
    return this.http.post('api/DeliveryChargeApi/EditDeliveryCharge', data, {
      headers: header,
      observe: 'response',
    });
  }

  getdeliverycharge(): Observable<any> {
    return this.http.get('api/DeliveryChargeApi/GetDeliveryCharge', {
      headers: header,
      observe: 'response',
    });
  }
}
