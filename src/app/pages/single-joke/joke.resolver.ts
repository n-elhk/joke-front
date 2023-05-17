import { inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ResolveFn } from '@angular/router';
import { Joke } from 'src/app/core/interface/joke';
import { JokeService } from 'src/app/core/services/joke/joke.service';

export const jokeResolver: ResolveFn<Joke | undefined> = (route, state) => {
  const jokeService = inject(JokeService);
  const currentJoke = toSignal(jokeService.selectCurrentJoke$);
  if (!currentJoke()) {
    return jokeService.getJokeBySlug(route.paramMap.get('slug')!!);
  }

  // return toObservable(jokeService.currentJoke);
  return jokeService.getJokeBySlug(route.paramMap.get('slug')!!);
};
