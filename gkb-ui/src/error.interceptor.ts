import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";

export const errorInterceptor: HttpInterceptorFn =(req,next)=>{
    const route = inject(Router);
// debugger;
    return next(req).pipe(
        catchError((error:any)=>{
        // catchError((error:HttpErrorResponse)=>{
            if(error.maintenance){
                console.log("maintance Mode")
                route.navigate(["/maintenance"]);
            }

            return throwError(()=>error);
        })
    )
};