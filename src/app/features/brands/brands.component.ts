import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface Brand {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

@Component({
  selector: 'app-brands',
  imports: [],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css'
})
export class BrandsComponent implements OnInit {
  private readonly httpClient = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);

  brandsList: Brand[] = [];
  brandsLoaded = false;

  ngOnInit(): void {
    this.getAllBrands();
  }

  getAllBrands(): void {
    this.httpClient.get<any>(environment.baseUrl + 'brands')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.brandsList = res.data;
          this.brandsLoaded = true;
        },
        error: (err) => {
          console.error('Error fetching brands:', err);
          this.brandsLoaded = true;
        }
      });
  }
}

