import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-about-page',
  imports: [CommonModule],
  templateUrl: './about-page.html',
  styleUrl: './about-page.scss',
})
export class AboutPage {
  // You can keep this simple, or bind these to variables if you plan to fetch them from an API later!
  chefName = "Chef Gordon";
  subtitle = "Master Baker & Founder";
}