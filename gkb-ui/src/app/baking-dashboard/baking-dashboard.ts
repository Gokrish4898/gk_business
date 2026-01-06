import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import {MatPaginatorModule} from '@angular/material/paginator';
import '@angular/localize/init';

@Component({
  selector: 'app-baking-dashboard',
  imports: [CommonModule, 
    NgbCarouselModule,MatPaginatorModule],
  standalone:true,
  templateUrl: './baking-dashboard.html',
  styleUrl: './baking-dashboard.scss',
})
export class BakingDashboard {
slides = [
    {
      url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      title: 'Fresh Croissants',
      description: 'Buttery layers of perfection.'
    },
    {
      url: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      title: 'Artisan Bread',
      description: 'Sourdough starters aged to perfection.'
    }
  ];

  categories = [
    { name: 'All Items', icon: 'bi-camera-reels' },
    { name: 'Brownie', icon: 'bi-balloon-heart' },
    { name: 'Cakes', icon: 'bi-cake2' },
    { name: 'Breads', icon: 'bi-basket' },
    { name: 'Apple Pie', icon: 'bi-basket' },

  ];

  product =[
    { title:'brownie', 
      image:'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      rating:'4',
      wishlist:1,
      rceipelst:{},
      totalrating: '20'
    },
{ title:'brownie', 
      image:'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      rating:'4',
      wishlist:1,
      rceipelst:{},
      totalrating: '20'
    },
{ title:'brownie', 
      image:'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      rating:'4',
      wishlist:1,
      rceipelst:{},
      totalrating: '20'
    },
{ title:'brownie', 
      image:'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      rating:'4',
      wishlist:0,
      rceipelst:{},
      totalrating: '20'
    },
{ title:'brownie', 
      image:'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      rating:'4',
      wishlist:1,
      rceipelst:{},
      totalrating: '20'
    },
{ title:'brownie', 
      image:'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      rating:'4',
      wishlist:0,
      rceipelst:{},
      totalrating: '20'
    },
{ title:'brownie', 
      image:'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      rating:'4',
      wishlist:1,
      rceipelst:{},totalrating: '20'
    },
{ title:'brownie', 
      image:'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      rating:'4',
      wishlist:1,
      rceipelst:{},totalrating: '20'
    },
  ]

  categoryChunks: any[] = [];

  total_counter : number = 0;
  Reviews_counter : number = 0;
  customer_counter : number = 0;
  private interval :any;
  private interval_01 :any;
  private interval_02 :any;
  ngOnInit() {
    this.chunkCategories(4); // Group by 4 items per slide
    this.interval = setInterval(()=>{
      this.total_counter++
      this.Reviews_counter++;
      if(this.total_counter > 101){
        clearInterval(this.interval)
      }
    },200)
    this.interval_01 = setInterval(()=>{
      this.Reviews_counter++;
      if(this.Reviews_counter > 201){
        clearInterval(this.interval_01)
      }
    },200)
    this.interval_02 = setInterval(()=>{
      this.customer_counter++;
      if(this.customer_counter > 150){
        clearInterval(this.interval_02)
      }
    },200)
  }
  ngOnDestroy(): void {
    clearInterval(this.interval)
  }

  chunkCategories(chunkSize: number) {
    for (let i = 0; i < this.categories.length; i += chunkSize) {
      this.categoryChunks.push(this.categories.slice(i, i + chunkSize));
    }
  }
}
