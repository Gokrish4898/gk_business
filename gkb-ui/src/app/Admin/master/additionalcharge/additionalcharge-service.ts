import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

let header = new HttpHeaders();
header = header.set('Content-Type', 'application/json; charset=utf-8');

@Injectable({
  providedIn: 'root',
})
export class AdditionalChargeService {
  constructor(private http: HttpClient) {}

  addcharge(data: any): Observable<any> {
    return this.http.post('api/AdditionalChargeApi/AddCharge', data, {
      headers: header,
      observe: 'response',
    });
  }

  editcharge(data: any): Observable<any> {
    return this.http.post('api/AdditionalChargeApi/EditCharge', data, {
      headers: header,
      observe: 'response',
    });
  }

  getcharge(): Observable<any> {
    return this.http.get('api/AdditionalChargeApi/GetCharge', {
      headers: header,
      observe: 'response',
    });
  }
}
