import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CardComponent } from "../../../../shared/components/card/card.component";
import { ProductsService } from '../../../../core/services/products/products.service';
import { Products } from '../../../../core/models/products.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-popular-products',
  imports: [CardComponent],
  templateUrl: './popular-products.component.html',
  styleUrl: './popular-products.component.css'
})
export class PopularProductsComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly destroyRef = inject(DestroyRef);

  productsList: Products[] = [];

  ngOnInit(): void {
  this.getAllProductsData();

  }

  getAllProductsData():void {
    this.productsService.getAllProducts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.productsList = res.data;
        },
        error: (err) => { console.error(err); }
      });
  }


}
