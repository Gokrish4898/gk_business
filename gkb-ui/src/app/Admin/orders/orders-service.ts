import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
export class AdminOrdersService {
  constructor(private http: HttpClient) {}

  getOrders(params: {
    searchTerm?: string;
    statusFilter?: string;
    sortBy?: string;
    sortOrder?: string;
    pageIndex: number;
    pageSize: number;
  }): Observable<any> {
    let httpParams = new HttpParams()
      .set('pageIndex', params.pageIndex.toString())
      .set('pageSize', params.pageSize.toString());

    if (params.searchTerm) httpParams = httpParams.set('searchTerm', params.searchTerm);
    if (params.statusFilter) httpParams = httpParams.set('statusFilter', params.statusFilter);
    if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
    if (params.sortOrder) httpParams = httpParams.set('sortOrder', params.sortOrder);

    return this.http.get('api/AdminOrderApi/List', {
      headers: getHeaders(),
      params: httpParams,
      observe: 'response',
    });
  }

  updateOrderStatus(data: { orderId: number; status: string; statusMessage?: string }): Observable<any> {
    return this.http.post('api/AdminOrderApi/UpdateStatus', data, {
      headers: getHeaders(),
      observe: 'response',
    });
  }

  // Query dedicated admin order details endpoint
  getOrderDetails(id: number): Observable<any> {
    return this.http.get(`api/AdminOrderApi/Details/${id}`, {
      headers: getHeaders(),
      observe: 'response',
    });
  }
}
