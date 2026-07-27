import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

let header = new HttpHeaders();
header = header.set('Content-Type', 'application/json; charset=utf-8');

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  constructor(private http: HttpClient) {}

  addwishlist(data: any): Observable<any> {
    return this.http.post('api/WishlistApi/AddWishlist', data, {
      headers: header,
      observe: 'response',
    });
  }

  editwishlist(data: any): Observable<any> {
    return this.http.post('api/WishlistApi/EditWishlist', data, {
      headers: header,
      observe: 'response',
    });
  }

  getwishlist(): Observable<any> {
    return this.http.get('api/WishlistApi/GetWishlist', {
      headers: header,
      observe: 'response',
    });
  }

  deletewishlist(id: number): Observable<any> {
    return this.http.delete(`api/WishlistApi/DeleteWishlist/${id}`, {
      headers: header,
      observe: 'response',
    });
  }
}
