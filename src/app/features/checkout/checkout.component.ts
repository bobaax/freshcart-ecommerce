import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from "../../shared/components/input/input.component";
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../cart/services/cart.service';
import { isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef } from '@angular/core';

@Component({
  selector: 'app-checkout',
  imports: [FormsModule, ReactiveFormsModule, InputComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly cartService = inject(CartService);
  private readonly platformId = inject(PLATFORM_ID); // ✅ للـ SSR safety
  private readonly destroyRef = inject(DestroyRef);

  checkOutForm!: FormGroup;
  id: string | null = null;

  ngOnInit(): void {
    this.initForm();
    this.getCartID();
  }

  getCartID(): void {
    this.activatedRoute.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (urlParams) => {
          this.id = urlParams.get('id');
        }
      });
  }

  initForm(): void {
    this.checkOutForm = this.fb.group({
      shippingAddress: this.fb.group({
        details: [null, [Validators.required]],
        phone: [null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
        city: [null, [Validators.required]]
      })
    });
  }

  submitForm(): void {
    if (this.checkOutForm.valid) {
      this.cartService.checkOutSession(this.id, this.checkOutForm.value)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res) => {
            if (res.status === 'success') {
              // ✅ إصلاح SSR: window غير موجود في بيئة الـ server
              if (isPlatformBrowser(this.platformId)) {
                window.open(res.session.url, '_self');
              }
            }
          },
          error: (err) => {
            console.error('Checkout failed', err);
          }
        });
    }
  }
}

