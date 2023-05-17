import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import type { Joke } from '../../interface/joke';
import {
  Observable,
  filter,
  finalize,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { ComponentStore } from '@ngrx/component-store';

interface JokeStore {
  jokes: Record<number, Joke | undefined>;
  previousJoke: Joke | undefined;
  currentJoke: Joke | undefined;
  nextJoke: Joke | undefined;
  loading: boolean;
  error: string;
}

@Injectable({
  providedIn: 'root',
})
export class JokeService extends ComponentStore<JokeStore> {
  private httpClient = inject(HttpClient);

  private urlServer = environment.urlServer;

  readonly selectJokes$ = this.select(({ jokes }) => Object.values(jokes));

  readonly selectPreviousJokes$ = this.select(
    ({ previousJoke }) => previousJoke
  );

  readonly selectCurrentJoke$ = this.select(({ currentJoke }) => currentJoke);

  readonly selectNextJokes$ = this.select(({ nextJoke }) => nextJoke);

  readonly loadPreviousJoke = this.effect((trigger$) => {
    return trigger$.pipe(
      withLatestFrom(this.selectPreviousJokes$, this.selectCurrentJoke$),
      filter(
        ([, previousJokes, currentJoke]) => !previousJokes && !!currentJoke
      ),
      switchMap(([, , currentJoke]) =>
        this.getJokeById((currentJoke?.id as number) - 1)
      ),
      tap((previousJoke) => {
        this.updatePreviousJoke(previousJoke);
      })
    );
  });

  constructor() {
    super({
      jokes: {},
      previousJoke: undefined,
      currentJoke: undefined,
      nextJoke: undefined,
      loading: false,
      error: '',
    });
  }

  readonly updateJokes = this.updater((state, jokes: Joke[]) => ({
    ...state,
    jokes: Object.fromEntries(jokes.map((joke) => [joke.id, joke])),
  }));

  readonly updatePreviousJoke = this.updater(
    (state, previousJoke: Joke | undefined) => ({
      ...state,
      previousJoke,
    })
  );

  readonly loadJoke = this.updater((state, jokeId: number) => ({
    ...state,
    previousJoke: state.jokes[jokeId - 1],
    currentJoke: state.jokes[jokeId],
    nextJoke: state.jokes[jokeId + 1],
  }));

  readonly loading = this.updater((state, loading: boolean) => ({
    ...state,
    loading,
  }));

  public getJokes(): Observable<Joke[]> {
    this.loading(true);
    return this.httpClient.get<Joke[]>(this.urlServer + '/jokes').pipe(
      tap(newJokes => this.updateJokes(newJokes)),
      finalize(() => this.loading(false))
    );
  }

  // public getJokes(): Observable<Joke[]> {
  //   return this.httpClient.get<Joke[]>(this.urlServer + '/jokes').pipe(
  //     tap(() => this.jokeIsLoading.set(true)),
  //     tap(newJokes => this.jokes.mutate((j) => j.push(...newJokes))),
  //     finalize(() => this.jokeIsLoading.set(false))
  //   );
  // }

  public getJokeBySlug(slug: string): Observable<Joke> {
    return this.httpClient.get<Joke>(`${this.urlServer}/joke/${slug}`);
  }

  public getJokeById(id: number): Observable<Joke> {
    this.loading(true);
    return this.httpClient
      .get<Joke>(`${this.urlServer}/joke/${id}`)
      .pipe(finalize(() => this.loading(false)));
  }
}
