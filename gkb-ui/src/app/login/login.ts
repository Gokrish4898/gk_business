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
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {

  // UI State
  isLoginMode: boolean = true;

  // Login Form Binding
  loginEmail = '';
  loginPassword = '';

  // Registration Form Binding
  regUsername = '';
  regEmail = '';
  regHouseNo = '';
  regAddressLine1 = '';
  regAddressLine2 = '';
  regArea = '';
  regState = '';
  regMobile = '';
  regPassword = '';

  private router = inject(Router);

  constructor(
    private toastr: ToastService,
    private loginservice: LoginService
  ) { }

  ngOnInit(): void { }

  login() {
    if (!this.loginEmail.trim() || !this.loginPassword.trim()) {
      this.toastr.show('Please fill in all mandatory fields', 'error');
      return;
    }

    const payload = {
      Email: this.loginEmail.trim(),
      Password: this.loginPassword.trim()
    };

    this.loginservice.loginUser(payload).subscribe({
      next: (res) => {
        if (res.body != null) {
          const body = res.body;
          // Store token and user details in localStorage
          localStorage.setItem('token', body.token);
          localStorage.setItem('userId', body.userId.toString());
          localStorage.setItem('roleId', body.roleId.toString());
          localStorage.setItem('username', body.username || '');
          localStorage.setItem('email', body.email || '');

          // Update signals
          this.loginservice.userid.set(Number(body.userId));
          this.loginservice.roleid.set(Number(body.roleId));
          this.loginservice.username.set(body.username || '');
          this.loginservice.useremail.set(body.email || '');

          this.toastr.show(`Welcome back, ${body.username || 'Chef'}!`, 'success');

          // Redirect based on role: Admin (1) to Admin Dashboard, Customer (2) to Landing Page
          if (Number(body.roleId) === 1) {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/landingpage']);
          }
        }
      },
      error: (err) => {
        const errorMsg = err.error?.error || 'Invalid credentials or login failed';
        this.toastr.show(errorMsg, 'error');
      }
    });
  }

  toggleMode(mode: 'login' | 'register') {
    this.isLoginMode = mode === 'login';
    // Clear values
    this.loginEmail = '';
    this.loginPassword = '';
    this.regUsername = '';
    this.regEmail = '';
    this.regHouseNo = '';
    this.regAddressLine1 = '';
    this.regAddressLine2 = '';
    this.regArea = '';
    this.regState = '';
    this.regMobile = '';
    this.regPassword = '';
  }

  register() {
    if (
      !this.regUsername.trim() ||
      !this.regEmail.trim() ||
      !this.regPassword.trim() ||
      !this.regHouseNo.trim() ||
      !this.regAddressLine1.trim() ||
      !this.regArea.trim() ||
      !this.regState.trim() ||
      !this.regMobile.trim()
    ) {
      this.toastr.show('All fields are mandatory', 'error');
      return;
    }

    const payload = {
      Email: this.regEmail.trim(),
      Password: this.regPassword.trim(),
      Username: this.regUsername.trim(),
      HouseNo: this.regHouseNo.trim(),
      AddressLine1: this.regAddressLine1.trim(),
      AddressLine2: this.regAddressLine2.trim(),
      Area: this.regArea.trim(),
      State: this.regState.trim(),
      Mobile: this.regMobile.trim()
    };

    this.loginservice.registerUser(payload).subscribe({
      next: (res) => {
        this.toastr.show('Registration successful! Please login.', 'success');
        this.toggleMode('login');
      },
      error: (err) => {
        const errorMsg = err.error?.error || 'Registration failed';
        this.toastr.show(errorMsg, 'error');
      }
    });
  }
}
