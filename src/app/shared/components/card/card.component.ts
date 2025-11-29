import { Component,  inject,  Input } from '@angular/core';
import { Products } from '../../../core/models/products.interface';
import { RouterLink } from "@angular/router";
import { TitleCasePipe } from '@angular/common';
import { OnSalePipe } from '../../pipes/on-sale-pipe';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../../features/cart/services/cart.service';






@Component({
  selector: 'app-card',
  imports: [RouterLink, TitleCasePipe,OnSalePipe,],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @Input({ required: true }) product: Products = {} as Products;
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);

  
  addToCart(id: string): void {
    this.cartService.addProductToCart(id).subscribe({
      next: (res) => {
        console.log(res);
        // this.cartService.countNumber.next(res.numOfCartItems);
        this.cartService.countNumber.set(res.numOfCartItems);
        if(res.status==='success'){
          this.toastrService.success(res.message, 'Fresh!');
        }
        
      },
      error: (err) => {
        console.error(err);
        if(err.status===401){
          this.toastrService.error('You need to log in first.', 'Error');
        }

      }
    });
  }

}
