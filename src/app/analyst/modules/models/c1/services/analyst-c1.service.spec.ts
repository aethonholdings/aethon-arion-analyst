import { TestBed } from '@angular/core/testing';

import { AnalystC1Service } from './analyst-c1.service';

describe('AnalystC1Service', () => {
  let service: AnalystC1Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnalystC1Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
