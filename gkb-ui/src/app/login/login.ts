import { Component, inject, OnInit } from '@angular/core';
import { Landingpage } from '../shared/landingpage/landingpage';
import { Router } from '@angular/router';
import { ToastService } from '../shared/toaster/toast-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone:true,
  imports: [CommonModule,FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit{

  // UI State
  isLoginMode: boolean = true; 
  

  // OTP State
  mobileNumber: string = '';
  otpCode: string = '';
  otpSent: boolean = false;
  otpVerified: boolean = false;

  private router = inject(Router)

  constructor(private toastr : ToastService){

  }
  ngOnInit(): void {
       
  }

  
  Login(){
    this.router.navigate(['/landingpage']);

  }

  toggleMode(mode:'login'|'register'){
    this.isLoginMode =mode === 'login';

    this.otpSent =false;
    this.otpSent = false;
    this.mobileNumber = ''
    this.otpCode = '';
  }

  sendOtp(){
    if(this.mobileNumber && this.mobileNumber.length >= 10){
      this.otpSent =true;
    }
  }

  verifyOtp(){
    debugger;
    if(this.otpCode.length == 4){
      this.otpVerified = true;
      this.toastr.show("OTP Verified","success","top-right");
    }
  }

  login(){
    console.log("logging in..")
  }

  register(){
    if(!this.otpVerified){
      this.toastr.show("Please verify your mobile number first!","error","top-center");
      return;
    }
    this.toastr.show("Successfully Register","success","top-right");
    console.log('Registering user..')
    this.router.navigate(["/landingpage"])
  }

}
