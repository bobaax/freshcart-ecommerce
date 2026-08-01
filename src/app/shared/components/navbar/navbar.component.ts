import { Component, computed, DestroyRef, inject, Input, OnInit, Signal } from '@angular/core';
import { FlowbiteService } from '../../../core/services/flowbite.service';
import { initFlowbite } from 'flowbite';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/auth/services/auth.service';
import { CartService } from '../../../features/cart/services/cart.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit { // ✅ إصلاح: إضافة implements OnInit
  @Input({ required: true }) isLogin!: boolean;

  private readonly cartService = inject(CartService);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  constructor(private flowbiteService: FlowbiteService) {}

  count: Signal<number> = computed(() => this.cartService.countNumber());

  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((_flowbite) => {
      initFlowbite();
    });

    // تهيئة عدد السلة عند تحميل الصفحة
    if (this.isLogin) {
      this.getAllDataCart();
    }
  }

  signOut(): void {
    this.authService.logOut();
  }

  getAllDataCart(): void {
    this.cartService.getCartItems()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.cartService.countNumber.set(res.numOfCartItems);
        },
        error: (err) => {
          console.error('Error fetching cart items:', err);
        }
      });
  }
}

