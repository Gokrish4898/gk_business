import { Component, inject, OnInit } from '@angular/core';
import { Landingpage } from '../shared/landingpage/landingpage';
import { Router } from '@angular/router';
import { ToastService } from '../shared/toaster/toast-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginService } from './login-service';
import { ReversePipe } from '../custom-pipe/reverse-pipe';

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

  constructor(private toastr : ToastService,
    private loginservice : LoginService
  ){

  }
  ngOnInit(): void {
       
  }

  
  login(){
    //     this.loginservice.login().subscribe(
    //   res=>{
    //     console.log(res,"fdssdhfkj")
    // this.router.navigate(['/landingpage']);

    //   }
    // )
    let postdata = "asdfg";
    let result = new ReversePipe().transform(postdata);

    console.log(result,"result")
    var formdata = {
      Email : "mohamedshamir988@gmail.com"
    }
    this.loginservice.generateotp(formdata).subscribe({
  // 1. The 'next' block handles a successful response
  next: (res) => {
    console.log(res);
  },
  
  // 2. The 'error' block handles the failure
  error: (error: any) => {
    console.log(error, "generateotp");
  }
});
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
    /* The `debugger;` statement in JavaScript is a breakpoint that can be used for debugging purposes.
    When the browser encounters this statement while executing the code, it will pause the execution
    at that point, allowing you to inspect variables, check the call stack, and step through the
    code using developer tools. It is commonly used during development to pause the execution flow
    and analyze the state of the application at that particular point in the code. */
    // debugger;
    if(this.otpCode.length == 4){
      this.otpVerified = true;
      this.toastr.show("OTP Verified","success","top-right");
    }
  }

  // login(){
  //   console.log("logging in..")
  // }

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
