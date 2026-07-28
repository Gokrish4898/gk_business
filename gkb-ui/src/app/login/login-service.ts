import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

let header = new HttpHeaders();
header = header.set('Content-Type', 'application/json; charset=utf-8');

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  // Angular signals for logged-in user state
  userid = signal<number>(0);
  roleid = signal<number>(0);
  username = signal<string>('');
  useremail = signal<string>('');

  constructor(private http: HttpClient) {
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('userId');
      const storedRoleId = localStorage.getItem('roleId');
      const storedUsername = localStorage.getItem('username');
      const storedEmail = localStorage.getItem('email');
      
      if (storedUserId) {
        this.userid.set(Number(storedUserId));
      }
      if (storedRoleId) {
        this.roleid.set(Number(storedRoleId));
      }
      if (storedUsername) {
        this.username.set(storedUsername);
      }
      if (storedEmail) {
        this.useremail.set(storedEmail);
      }
    }
  }

  loginUser(data: any): Observable<any> {
    return this.http.post('api/AuthApi/Login', data, {
      headers: header,
      observe: 'response',
    });
  }

  registerUser(data: any): Observable<any> {
    return this.http.post('api/AuthApi/Register', data, {
      headers: header,
      observe: 'response',
    });
  }

  generateotp(data: any): Observable<any> {
    return this.http.get('api/AuthApi/GenerateOtp', {
      params: data,
      headers: header,
      observe: 'response',
    });
  }
}
