import { TestBed } from '@angular/core/testing';

import { GleeService } from './glee.service';

describe('GleeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GleeService = TestBed.get(GleeService);
    expect(service).toBeTruthy();
  });
});
