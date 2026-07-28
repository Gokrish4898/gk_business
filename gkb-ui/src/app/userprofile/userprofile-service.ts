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
export class UserprofileService {
  constructor(private http: HttpClient) {}

  // Profile endpoints
  getProfile(): Observable<any> {
    return this.http.get('api/ProfileApi/Get', {
      headers: getHeaders(),
      observe: 'response',
    });
  }

  updateProfile(data: any): Observable<any> {
    return this.http.post('api/ProfileApi/Update', data, {
      headers: getHeaders(),
      observe: 'response',
    });
  }

  changePassword(data: any): Observable<any> {
    return this.http.post('api/ProfileApi/ChangePassword', data, {
      headers: getHeaders(),
      observe: 'response',
    });
  }

  // Address endpoints
  listAddresses(): Observable<any> {
    return this.http.get('api/AddressApi/List', {
      headers: getHeaders(),
      observe: 'response',
    });
  }

  addAddress(data: any): Observable<any> {
    return this.http.post('api/AddressApi/Add', data, {
      headers: getHeaders(),
      observe: 'response',
    });
  }

  updateAddress(data: any): Observable<any> {
    return this.http.post('api/AddressApi/Update', data, {
      headers: getHeaders(),
      observe: 'response',
    });
  }

  deleteAddress(id: number): Observable<any> {
    return this.http.delete(`api/AddressApi/Delete/${id}`, {
      headers: getHeaders(),
      observe: 'response',
    });
  }

  setDefaultAddress(id: number): Observable<any> {
    return this.http.post(`api/AddressApi/SetDefault/${id}`, {}, {
      headers: getHeaders(),
      observe: 'response',
    });
  }
}
