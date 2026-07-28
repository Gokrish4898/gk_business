import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

let header = new HttpHeaders();
header = header.set('Content-Type', 'application/json; charset=utf-8');

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  constructor(private http: HttpClient) {}

  addrole(data: any): Observable<any> {
    return this.http.post('api/RoleApi/AddRole', data, {
      headers: header,
      observe: 'response',
    });
  }

  editrole(data: any): Observable<any> {
    return this.http.post('api/RoleApi/EditRole', data, {
      headers: header,
      observe: 'response',
    });
  }

  getrole(): Observable<any> {
    return this.http.get('api/RoleApi/GetRole', {
      headers: header,
      observe: 'response',
    });
  }
}
