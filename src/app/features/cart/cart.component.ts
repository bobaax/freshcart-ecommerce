import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CartService } from './services/cart.service';
import { Cart } from './models/cart.interface';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-cart',
  imports: [RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly destroyRef = inject(DestroyRef);

  cartDetails: Cart = {} as Cart;
  cartLoaded = false; // ✅ flag لتمييز حالة التحميل عن السلة الفارغة

  ngOnInit(): void {
    this.getCartData();
  }

  getCartData(): void {
    this.cartService.getCartItems()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.cartDetails = res.data;
          this.cartService.countNumber.set(res.numOfCartItems); // ✅ sync العداد
          this.cartLoaded = true;
        },
        error: (err) => {
          console.error('Error fetching cart items:', err);
          this.cartLoaded = true;
        }
      });
  }

  updateQuantity(id: string, quantity: number): void {
    this.cartService.updateCartItemQuantity(id, quantity)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.cartDetails = res.data;
        },
        error: (err) => {
          console.error('Error updating cart item quantity:', err);
        }
      });
  }

  removeFromCart(id: string): void {
    this.cartService.removeCartItem(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.cartService.countNumber.set(res.numOfCartItems);
          this.cartDetails = res.data;
        },
        error: (err) => {
          console.error('Error removing cart item:', err);
        }
      });
  }
}
