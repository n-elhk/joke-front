import { Routes } from '@angular/router';
import { jokeResolver } from './pages/single-joke/joke.resolver';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then(
        ({ HomeComponent }) => HomeComponent
      ),
  },

  {
    path: ':slug',
    loadComponent: () =>
      import('./pages/single-joke/single-joke.component').then(
        ({ SingleJokeComponent }) => SingleJokeComponent
      ),
    resolve: { joke: jokeResolver },
  },
];
