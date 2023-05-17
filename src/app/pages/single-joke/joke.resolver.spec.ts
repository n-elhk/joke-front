import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { jokeResolver } from './joke.resolver';

describe('jokeResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => jokeResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
