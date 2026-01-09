import { TestBed } from '@angular/core/testing';

import { Automaatti } from './automaatti';

describe('Automaatti', () => {
  let service: Automaatti;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Automaatti);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
