import { APP_INITIALIZER, ApplicationConfig, LOCALE_ID } from '@angular/core';
import {
  RouteReuseStrategy,
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { CustomReusingStrategy } from './core/services/custom-reuse-strategy/custom-reuse-strategy';
import { JokeService } from './core/services/joke/joke.service';
import { provideComponentStore } from '@ngrx/component-store';

export function initializeApp1(jokeService: JokeService) {
  return () => {
    return jokeService.getJokes();
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: RouteReuseStrategy, useClass: CustomReusingStrategy },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp1,
      deps: [JokeService],
      multi: true,
    },
    { provide: LOCALE_ID, useValue: "fr-FR" }, //replace "en-US" with your locale
    provideRouter(routes, withComponentInputBinding(), withInMemoryScrolling()),
    provideHttpClient(),
    provideComponentStore(JokeService),
  ],
};
