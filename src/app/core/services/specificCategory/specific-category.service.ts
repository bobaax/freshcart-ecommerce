import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SpecificCategoryService {
  private readonly httpClient = inject(HttpClient)

  getSpecificCategories(categoryId: string): Observable<any> {
    return this.httpClient.get( environment.baseUrl + 'categories/' + categoryId)

  }
  
}
