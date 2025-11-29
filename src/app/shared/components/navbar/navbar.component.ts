import { Component, computed, inject, Input, Signal} from '@angular/core';
import { FlowbiteService } from '../../../core/services/flowbite.service';
import { initFlowbite } from 'flowbite';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/auth/services/auth.service';
import { CartService } from '../../../features/cart/services/cart.service';
// import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  @Input({required:true}) isLogin!:boolean

  private readonly cartService = inject(CartService)
  private readonly authService = inject(AuthService);
  // private readonly id = inject(PLATFORM_ID);


  constructor(private flowbiteService: FlowbiteService) {}
  // count!:number
  count: Signal<number> = computed(() => this.cartService.countNumber());


  ngOnInit(): void {

    // this.getAllDataCart();

    // this.getCartNumber();

    // if(isPlatformBrowser(this.id)){
    //   this.getAllDataCart();
    // }
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });
  }

  signOut(): void {
    this.authService.logOut();
  }

  // getCartNumber(): void {
  //   this.cartService.countNumber.subscribe({
  //     set:(num)=>{
  //       this.count=num
  //     }
  //   })  
  // }
  getAllDataCart(): void {
    this.cartService.getCartItems().subscribe({
      next: (res) => {
        this.cartService.countNumber.set(res.numOfCartItems);
      },
      error: (err) => {
        console.error('Error fetching cart items:', err);
      }
    });

}
}
