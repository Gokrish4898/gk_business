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
  category:any =[];
  private router =  inject(Router);

  ngOnInit(): void {
    this.category = [
      {name:"Bakery"},
      {name:"Photograpy"}
    ]
  }

  navigate_dashboard(mode:string){
    if(mode == 'Bakery'){
    this.router.navigate(['/bdashboard'])
    }else{
  }
}
}
