import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Loading } from '../shared/spinner/loading';

@Component({
  selector: 'app-product-details',
  imports: [FormsModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetails implements OnInit {
  productid: number = 0;
  recipe = [
    {
      ingredient: 'Flour',
      image: 'assets/images/ingredients/flour.jpg',
      pergmcost: 23,
      quantity: 10, // Default to min
      max: 100,
      min: 10,
      unit: 'gm',
    },
    {
      ingredient: 'Chocolate',
      image: 'assets/images/ingredients/chocolate.jpg',
      pergmcost: 45,
      quantity: 10,
      max: 50,
      min: 10,
      unit: 'gm',
    },
    {
      ingredient: 'Cocoa Powder',
      image: 'assets/images/ingredients/cocoa.jpg',
      pergmcost: 30,
      quantity: 5,
      max: 30,
      min: 5,
      unit: 'gm',
    },
    {
      ingredient: 'Butter',
      image: 'assets/images/ingredients/butter.jpg',
      pergmcost: 15,
      quantity: 20,
      max: 80,
      min: 20,
      unit: 'gm',
    },
    {
      ingredient: 'Sugar',
      image: 'assets/images/ingredients/sugar.jpg',
      pergmcost: 10,
      quantity: 15,
      max: 60,
      min: 15,
      unit: 'gm',
    },
  ];
  product = [
    {
      id: 1,
      title: 'brownie',
      image:
        'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      rating: '4',
      wishlist: 1,
      rceipelst: {},
      totalrating: '20',
    },
    {
      id: 2,
      title: 'brownie',
      image:
        'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      rating: '4',
      wishlist: 1,
      rceipelst: {},
      totalrating: '20',
    },
    {
      id: 3,
      title: 'brownie',
      image:
        'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      rating: '4',
      wishlist: 1,
      rceipelst: {},
      totalrating: '20',
    },
    {
      id: 4,
      title: 'brownie',
      image:
        'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      rating: '4',
      wishlist: 0,
      rceipelst: {},
      totalrating: '20',
    },
    {
      id: 5,
      title: 'brownie',
      image:
        'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      rating: '4',
      wishlist: 1,
      rceipelst: {},
      totalrating: '20',
    },
    {
      id: 6,
      title: 'brownie',
      image:
        'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      rating: '4',
      wishlist: 0,
      rceipelst: {},
      totalrating: '20',
    },
    {
      id: 7,
      title: 'brownie',
      image:
        'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      rating: '4',
      wishlist: 1,
      rceipelst: {},
      totalrating: '20',
    },
    {
      id: 8,
      title: 'brownie',
      image:
        'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      rating: '4',
      wishlist: 1,
      rceipelst: {},
      totalrating: '20',
    },
  ];

  // Sets '1 kg' as the default active button
  selectedOption: string = '1 kg';

  // Updates the active button when clicked
  selectOption(option: string) {
    this.selectedOption = option;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private loading: Loading,
  ) {
    this.route.paramMap.subscribe((params) => {
      this.productid = Number(params.get('id'));
    });
    console.log(this.productid);
  }
  ngOnInit(): void {
    this.loading.showAndAutoHide();
    this.product.filter((x) => x.id == this.productid);
  }

  calculateTotal() {
    return this.recipe.reduce((total, item) => {
      const cost = item.pergmcost || 0;
      const qty = item.quantity || 0;
      return total + cost * qty;
    }, 0);
  }
  goBack() {
    this.router.navigate(['/bdashboard']);
  }

  //popup view
  @ViewChild('paymentModal') paymentModal!: TemplateRef<any>;

  finalTotal: number = 0;

  openPaymentModal() {
    this.finalTotal = this.calculateTotal();

    // This single line opens the popup and handles the dark background!
    this.modalService.open(this.paymentModal, {
      centered: true, // Centers it on the screen
      windowClass: 'custom-modal-radius', // Optional: for rounded corners
    });
  }

  processPayment(method: string, modal: any) {
    console.log(`User selected: ${method}`);
    // Close the modal automatically after selection
    modal.close('Payment Selected');
  }
}
