import { Component, inject } from '@angular/core';
import { Landingpage } from '../shared/landingpage/landingpage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone:true,
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private router = inject(Router)

  
  Login(){
    this.router.navigate(['/landingpage']);
  }



}
