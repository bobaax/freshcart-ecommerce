import { Component, computed, Signal, signal, WritableSignal } from '@angular/core';

@Component({
  selector: 'app-brands',
  imports: [],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css'
})
export class BrandsComponent {
  price: WritableSignal<number> = signal(100);
  quantity: WritableSignal<number> = signal(20);
  totolprice: Signal<number> = computed( () => this.price() * this.quantity() );

  changeprice():void {
    this.price.update((value) => value + 10);
    console.log(this.price());
  }


}
