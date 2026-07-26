import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

let header = new HttpHeaders();
header = header.set('Content-Type', 'application/json; charset=utf-8');

@Injectable({
  providedIn: 'root',
})
export class StockService {

  constructor(private http : HttpClient){

  }

    addstock(data: any): Observable<any> {
      return this.http.post('api/StockApi/AddStock', data,{
        headers: header,
        observe: 'response',
      });
    }
    editstock(data: any): Observable<any> {
      return this.http.post('api/StockApi/EditStock', data,{
        headers: header,
        observe: 'response',
      });
    }

    getstock(): Observable<any> {
      return this.http.get('api/StockApi/GetStock', {
        headers: header,
        observe: 'response',
      });
    }
}
