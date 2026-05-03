import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

let header = new HttpHeaders();
header = header.set('Content-Type', 'application/json; charset=utf-8');

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}

  login(): Observable<any> {
    return this.http.get('WeatherForecast', { headers: header, observe: 'response' });
  }

  generateotp(data: any): Observable<any> {
    return this.http.get('AuthApi/GenerateOtp', {
      params: data,
      headers: header,
      observe: 'response',
    });
  }
}
