import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

let header = new HttpHeaders();
header = header.set('Content-Type', 'application/json; charset=utf-8');

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  
  constructor(private http : HttpClient){

  }

      addrecipe(data: any): Observable<any> {
        return this.http.post('api/RecipeApi/AddRecipe', data,{
          headers: header,
          observe: 'response',
        });
      }
      editrecipe(data: any): Observable<any> {
        return this.http.post('api/RecipeApi/EditRecipe', data,{
          headers: header,
          observe: 'response',
        });
      }
  
      getrecipe(): Observable<any> {
        return this.http.get('api/RecipeApi/GetRecipe', {
          headers: header,
          observe: 'response',
        });
      }
}
