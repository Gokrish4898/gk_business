import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-landingpage',
  imports: [CommonModule],
  standalone:true,
  templateUrl: './landingpage.html',
  styleUrl: './landingpage.scss',
})
export class Landingpage {
 category = [
  { name: 'Bakery',    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600' },
];
  private router =  inject(Router);

  ngOnInit(): void {
    
  }

  navigate_dashboard(mode:string){
    if(mode == 'Bakery'){
    this.router.navigate(['/bdashboard'])
    }else{
  }
}
}
