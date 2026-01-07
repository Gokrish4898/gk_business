import { Component } from '@angular/core';
import {TooltipPosition, MatTooltipModule} from '@angular/material/tooltip';
import OrderTrackList from '@mindinventory/order-tracking';
import { Ordertacking } from "../ordertacking/ordertacking";
@Component({
  selector: 'app-userorders',
  imports: [MatTooltipModule, Ordertacking],
  templateUrl: './userorders.html',
  styleUrl: './userorders.scss',
})
export class Userorders {
  paymentStatus:any="PENDING";
  // paymentStatus:any="COMPLETED";
  orderData = [
  {
    status: 'Order Confirmed',
    date: `Tue, 28th Dec '21 - 1:47 PM`,
  },
  {
    status: 'Shipped',
    date: `Thu, 30th Dec '21 - 1:30 AM`,
  },
  {
    status: 'Out For Delivery',
    date: `Thu, 30th Dec '21 - 11:31 AM`,
  },
  {
    status: 'Delivered',
    date: `Thu, 30th Dec '21 - 4:45 PM`,
  },
  {
    status: 'Return',
    date: `Thu, 31st Dec '21 - 2:23 PM`,
  },
];
  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
}
