import { TestBed } from '@angular/core/testing';

import { ShopApiService } from './shop-api.service';

describe('ShopApiService', () => {
  let service: ShopApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShopApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
