import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

let header = new HttpHeaders();
header = header.set('Content-Type', 'application/json; charset=utf-8');

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  
  constructor(private http : HttpClient){}

  addproduct(data: any): Observable<any> {
    return this.http.post('api/ProductApi/AddProduct', data, {
      headers: header,
      observe: 'response',
    });
  }

  editproduct(data: any): Observable<any> {
    return this.http.post('api/ProductApi/EditProduct', data, {
      headers: header,
      observe: 'response',
    });
  }

  getproduct(): Observable<any> {
    return this.http.get('api/ProductApi/GetProduct', {
      headers: header,
      observe: 'response',
    });
  }
}
