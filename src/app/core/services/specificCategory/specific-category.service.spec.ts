import { TestBed } from '@angular/core/testing';

import { SpecificCategoryService } from './specific-category.service';

describe('SpecificCategoryService', () => {
  let service: SpecificCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpecificCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
