import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { detailsDataResolver } from './details-data.resolver';

describe('detailsDataResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => detailsDataResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
