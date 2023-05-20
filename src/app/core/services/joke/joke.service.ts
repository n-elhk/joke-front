import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
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
  jokes: Record<string, Joke | undefined>;
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

  readonly updateJokes = this.updater((state, jokes: Joke[]) => ({
    ...state,
    jokes: {
      ...state.jokes,
      ...Object.fromEntries(jokes.map((joke) => [joke.slug, joke])),
    },
  }));

  readonly updatePreviousJoke = this.updater(
    (state, previousJoke: Joke | undefined) => ({
      ...state,
      previousJoke,
    })
  );

  public readonly updateCurrentJoke = this.updater((state, jokeId: number) => ({
    ...state,
    previousJoke: state.jokes[jokeId - 1],
    currentJoke: state.jokes[jokeId],
    nextJoke: state.jokes[jokeId + 1],
  }));

  private readonly updateloading = this.updater((state, loading: boolean) => ({
    ...state,
    loading,
  }));

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

  public getJokes(skip = 0): Observable<Joke[]> {
    const params = new HttpParams().set('skip', skip);
    this.updateloading(true);
    return this.httpClient
      .get<Joke[]>(this.urlServer + '/jokes', { params })
      .pipe(
        tap((newJokes) => this.updateJokes(newJokes)),
        finalize(() => this.updateloading(false))
      );
  }

  public getJokeBySlug(slug: string): Observable<Joke> {
    return this.httpClient.get<Joke>(`${this.urlServer}/joke/${slug}`);
  }

  public getJokeById(id: number): Observable<Joke> {
    this.updateloading(true);
    return this.httpClient
      .get<Joke>(`${this.urlServer}/joke/${id}`)
      .pipe(finalize(() => this.updateloading(false)));
  }
}
