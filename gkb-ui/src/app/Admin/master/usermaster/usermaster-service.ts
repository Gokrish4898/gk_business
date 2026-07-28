import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

let header = new HttpHeaders();
header = header.set('Content-Type', 'application/json; charset=utf-8');

export interface UserMasterItem {
  userId: number;
  username: string;
  email: string;
  password?: string;
  houseNo: string;
  addressLine1: string;
  addressLine2?: string;
  area: string;
  state: string;
  mobile: string;
  roleId: number;
  active?: number;
  createdOn?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserMasterService {
  constructor(private http: HttpClient) {}

  edituser(data: any): Observable<any> {
    return this.http.post('api/UserApi/EditUser', data, {
      headers: header,
      observe: 'response',
    });
  }

  getusers(): Observable<any> {
    return this.http.get('api/UserApi/GetUser', {
      headers: header,
      observe: 'response',
    });
  }
}
