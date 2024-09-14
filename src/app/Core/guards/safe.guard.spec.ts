import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { safeGuard } from './safe.guard';

describe('safeGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => safeGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
