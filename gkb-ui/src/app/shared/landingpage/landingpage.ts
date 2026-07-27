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
    }
  }

  onMouseMove(event: MouseEvent, card: HTMLElement) {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((centerY - y) / centerY) * 15; // Rotate up/down up to 15deg
    const rotateY = ((x - centerX) / centerX) * 15; // Rotate left/right up to 15deg
    card.style.setProperty('--rx', `${rotateX}deg`);
    card.style.setProperty('--ry', `${rotateY}deg`);
  }

  onMouseLeave(card: HTMLElement) {
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
  }
}
