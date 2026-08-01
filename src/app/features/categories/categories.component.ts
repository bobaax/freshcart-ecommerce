import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Category } from '../../core/models/category.interface';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { CardComponent } from "../../shared/components/card/card.component";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-categories',
  imports: [RouterLink, CardComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit {

  private readonly categoriesService = inject(CategoriesService);
  private readonly destroyRef = inject(DestroyRef);

  categoriesList: Category[] = [];
  pageSize!: number;
  p!: number;
  total!: number;

  ngOnInit(): void {
    this.getCategoryData();
  }

  getCategoryData(): void {
    this.categoriesService.getAllCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.categoriesList = res.data;
          this.pageSize = res.metadata?.limit;
          this.p = res.metadata?.currentPage;
          this.total = res.results;
        },
        error: (err) => {
          console.error(err);
        }
      });
  }
}

