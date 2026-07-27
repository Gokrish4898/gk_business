import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

let header = new HttpHeaders();
header = header.set('Content-Type', 'application/json; charset=utf-8');

@Injectable({
  providedIn: 'root',
})
export class RatingService {
  constructor(private http: HttpClient) {}

  addrating(data: any): Observable<any> {
    return this.http.post('api/RatingApi/AddRating', data, {
      headers: header,
      observe: 'response',
    });
  }

  editrating(data: any): Observable<any> {
    return this.http.post('api/RatingApi/EditRating', data, {
      headers: header,
      observe: 'response',
    });
  }

  getrating(): Observable<any> {
    return this.http.get('api/RatingApi/GetRating', {
      headers: header,
      observe: 'response',
    });
  }

  deleterating(id: number): Observable<any> {
    return this.http.delete(`api/RatingApi/DeleteRating/${id}`, {
      headers: header,
      observe: 'response',
    });
  }
}
