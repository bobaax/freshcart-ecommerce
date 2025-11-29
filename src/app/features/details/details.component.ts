import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductDetailsService } from './services/product-details.service';
import { Products } from '../../core/models/products.interface';
import { CarouselModule, OwlOptions} from 'ngx-owl-carousel-o';
// import { CartService } from '../cart/services/cart.service';

@Component({
  selector: 'app-details',
  imports: [CarouselModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly productDetailsService = inject(ProductDetailsService);

  ngOnInit(): void {
    this.getProductId();
    this.getProductDetailsData();
  }
  id:string|null=null;
  productDetails:Products={} as Products;

  getProductId(){
    this.activatedRoute.paramMap.subscribe({
      next: (UrlParams) => {
        this.id = UrlParams.get('id');
      }
    });
  }

  getProductDetailsData():void{
    this.productDetailsService.getProductDetails(this.id).subscribe({
      next: (res) => {
        console.log(res.data);
        this.productDetails = res.data;
      }
    });
  }

  // private readonly cartService = inject(CartService);
    
  //   addToCart(id: string): void {
  //     this.cartService.addProductToCart(id).subscribe({
  //       next: (res) => {
  //         console.log(res);
          
  //       },
  //       error: (err) => {
  //         console.error(err);
          
  //       }
  //     });
  //   }

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
  }

}
