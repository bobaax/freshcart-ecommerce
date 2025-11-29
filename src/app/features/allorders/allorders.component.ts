import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../cart/services/cart.service';


@Component({
  selector: 'app-allorders',
  imports: [],
  templateUrl: './allorders.component.html',
  styleUrl: './allorders.component.css'
})
export class AllordersComponent implements OnInit {

  private readonly cartService = inject(CartService);


  orders:any[] = [];

  ngOnInit():void{
    this.getAllOrders();
  }

  getAllOrders():void{
    this.cartService.getAllOrders().subscribe({
      next: (res) => {
        this.orders = res.data;
        console.log(this.orders);
      },
      error: (err) => {
        console.error('Error fetching orders', err);
      }
    });
  }

}
