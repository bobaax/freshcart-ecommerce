import { Component, inject, OnInit } from '@angular/core';
import { CardComponent } from "../../../../shared/components/card/card.component";
import { ProductsService } from '../../../../core/services/products/products.service';
import { Products } from '../../../../core/models/products.interface';

@Component({
  selector: 'app-popular-products',
  imports: [CardComponent],
  templateUrl: './popular-products.component.html',
  styleUrl: './popular-products.component.css'
})
export class PopularProductsComponent implements OnInit {
  private readonly productsService = inject(ProductsService)

  productsList:Products[] = [];

  ngOnInit(): void {
  this.getAllProductsData();

  }

  getAllProductsData():void {
    this.productsService.getAllProducts().subscribe({
      next:(res)=>{console.log(res.data)
        this.productsList = res.data;
      },
      error:(err)=>{console.error(err)}
    });
  }


}
