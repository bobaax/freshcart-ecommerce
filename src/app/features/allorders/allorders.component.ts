import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CartService } from '../cart/services/cart.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-allorders',
  imports: [DatePipe, NgClass],
  templateUrl: './allorders.component.html',
  styleUrl: './allorders.component.css'
})
export class AllordersComponent implements OnInit {

  private readonly cartService = inject(CartService);
  private readonly destroyRef = inject(DestroyRef);

  orders: any[] = [];
  ordersLoaded = false;

  ngOnInit(): void {
    this.getAllOrders();
  }

  getAllOrders(): void {
    this.cartService.getAllOrders()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.orders = res;
          this.ordersLoaded = true;
        },
        error: (err) => {
          console.error('Error fetching orders', err);
          this.ordersLoaded = true;
        }
      });
  }
}

