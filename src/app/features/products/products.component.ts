import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ProductsService } from '../../core/services/products/products.service';
import { CardComponent } from "../../shared/components/card/card.component";
import { Products } from '../../core/models/products.interface';
import { NgxPaginationModule } from 'ngx-pagination';
import { SearchPipe } from './../../shared/pipes/search-pipe';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-products',
  imports: [CardComponent, NgxPaginationModule, SearchPipe, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly destroyRef = inject(DestroyRef);
  // ✅ إصلاح: حذف NgxSpinnerService (غير مستخدم — الـ loading interceptor يتكفل بالـ spinner)

  productsList: Products[] = [];
  searchTerm: string = '';
  pageSize!: number;
  p!: number;
  total!: number;

  ngOnInit(): void {
    this.getAllProductsData();
  }

  search(event: any): void {
    this.searchTerm = event.target.value;
  }

  getAllProductsData(pageNum: number = 1): void {
    this.productsService.getAllProducts(pageNum)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.productsList = res.data;
          this.pageSize = res.metadata.limit;
          this.p = res.metadata.currentPage;
          this.total = res.results;
        },
        error: (err) => {
          console.error(err);
        }
      });
  }
}

