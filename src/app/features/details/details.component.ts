import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductDetailsService } from './services/product-details.service';
import { Products } from '../../core/models/products.interface';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { CartService } from '../cart/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-details',
  imports: [CarouselModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly productDetailsService = inject(ProductDetailsService);
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);
  private readonly destroyRef = inject(DestroyRef);

  id: string | null = null;
  productDetails: Products = {} as Products;

  ngOnInit(): void {
    // ✅ إصلاح: حل الـ Race Condition — نجيب الـ id أولاً ثم نطلب البيانات
    this.activatedRoute.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(urlParams => {
        this.id = urlParams.get('id');
        this.getProductDetailsData();
      });
  }

  getProductDetailsData(): void {
    this.productDetailsService.getProductDetails(this.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.productDetails = res.data;
        },
        error: (err) => {
          console.error('Error fetching product details:', err);
        }
      });
  }

  // ✅ إصلاح: تفعيل Add to Cart بنفس نمط card.component.ts
  addToCart(id: string): void {
    this.cartService.addProductToCart(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.cartService.countNumber.set(res.numOfCartItems);
          if (res.status === 'success') {
            this.toastrService.success(res.message, 'Fresh!');
          }
        },
        error: (err) => {
          console.error(err);
          if (err.status === 401) {
            this.toastrService.error('You need to log in first.', 'Error');
          }
        }
      });
  }

  detailsSliderOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    autoplay: true,
    autoplayTimeout: 1500,
    autoplayHoverPause: true,
    dots: true,
    navSpeed: 700,
    navText: ['<i class="fa-solid fa-arrow-left"></i>', '<i class="fa-solid fa-arrow-right"></i>'],
    items: 1,
    nav: false
  };
}

