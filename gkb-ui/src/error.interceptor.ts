import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";

export const errorInterceptor: HttpInterceptorFn =(req,next)=>{
    const route = inject(Router);
    return next(req).pipe(
        catchError((error:any)=>{
        // catchError((error:HttpErrorResponse)=>{
        console.log(error,"error","https://gokrish4898.github.io",)
            if(error.error.maintenance){
                route.navigate(["/maintenance"]);
            }

            return throwError(()=>error);
        })
    )
};