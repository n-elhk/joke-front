import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import type { Joke } from '../../interface/joke';
import { Observable, finalize, tap } from 'rxjs';
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

  readonly selectJokes = this.selectSignal(({ jokes }) =>
    Object.values(jokes).sort((a, b) => (b?.id ?? 0) - (a?.id ?? 0))
  );

  readonly selectPreviousJokes = this.selectSignal(
    ({ previousJoke }) => previousJoke
  );

  readonly selectCurrentJoke = this.selectSignal(({ currentJoke }) => currentJoke);

  readonly selectNextJokes = this.selectSignal(({ nextJoke }) => nextJoke);

  readonly selectIsLoading = this.selectSignal(({ loading }) => loading);

  readonly updateJokes = this.updater((state, jokes: Joke[]) => ({
    ...state,
    jokes: {
      ...state.jokes,
      ...Object.fromEntries(jokes.map((joke) => [joke.id, joke])),
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

  public getJoke(
    parameters: Record<string, string | number>
  ): Observable<Joke> {
    const params = Object.entries(parameters).reduce(
      (acc, [key, value]) => acc.set(key, value),
      new HttpParams()
    );

    this.updateloading(true);

    return this.httpClient.get<Joke>(`${this.urlServer}/joke`, { params }).pipe(
      tap((joke) => this.updateJokes([joke])),
      finalize(() => this.updateloading(false))
    );
  }

  public getRandomJoke(): Observable<Joke> {
    this.updateloading(true);

    return this.httpClient.get<Joke>(`${this.urlServer}/joke/random`).pipe(
      tap((joke) => this.updateJokes([joke])),
      tap((joke) => this.updateCurrentJoke(joke.id)),
      finalize(() => this.updateloading(false))
    );
  }
}
