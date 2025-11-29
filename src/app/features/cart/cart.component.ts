import { Component, inject, OnInit } from '@angular/core';
import { CartService } from './services/cart.service';
import { Cart } from './models/cart.interface';
import { RouterLink } from '@angular/router';







@Component({
  selector: 'app-cart',
  imports: [RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit  {
  private readonly cartService = inject(CartService);

  cartDetails:Cart={} as Cart;

  ngOnInit(): void {
    this.getLogedUserData();
  }

  getLogedUserData(): void {
    this.cartService.getCartItems().subscribe({
      next: (res) => {
        console.log(res.data);
        this.cartDetails = res.data;
      },
      error: (err) => {
        console.error('Error fetching cart items:', err);
      }
    });
  }

  updateQuantity(id: string, quantity: number): void {
    this.cartService.updateCartItemQuantity(id, quantity).subscribe({
      next: (res) => {
        console.log(res);
        this.cartDetails = res.data; // Refresh cart data after quantity update
      },
      error: (err) => {
        console.error('Error updating cart item quantity:', err);
      }
    });
  }

  
  removeFromCart(id: string): void {
    this.cartService.removeCartItem(id).subscribe({
      next: (res) => {
        console.log(res);
        this.cartService.countNumber.set(res.numOfCartItems);
        this.cartDetails = res.data; // Refresh cart data after removal
      },
      error: (err) => {
        console.error('Error removing cart item:', err);
      }
    });
  }
  

}





