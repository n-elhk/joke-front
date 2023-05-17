import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import type { Joke } from '../../interface/joke';
import { Observable, finalize, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class JokeService {
  private httpClient = inject(HttpClient);

  private urlServer = environment.urlServer;

  public jokes = signal<Joke[]>([]);

  public jokeIsLoading = signal<boolean>(false);

  public currentJokeIndex = signal<number>(0);

  public previousJoke: Signal<Joke | undefined> = computed(
    () => this.jokes()[this.currentJokeIndex() - 1]
  );

  public currentJoke: Signal<Joke | undefined> = computed(
    () => this.jokes()[this.currentJokeIndex()]
  );

  public nextJoke: Signal<Joke | undefined> = computed(
    () => this.jokes()[this.currentJokeIndex() + 1]
  );

  public getJokes(): Observable<Joke[]> {
    return this.httpClient.get<Joke[]>(this.urlServer + '/jokes').pipe(
      tap(() => this.jokeIsLoading.set(true)),
      tap((newJokes) => this.jokes.mutate((j) => j.push(...newJokes))),
      finalize(() => this.jokeIsLoading.set(false)),
    );
  }

  public getBySlugJoke(slug: string): Observable<Joke> {
    return this.httpClient.get<Joke>(`${this.urlServer}/joke/${slug}`);
  }

  public selectIndex(index: number): void {
    this.currentJokeIndex.set(index);
  }

  public incrIndex(): void {
    this.currentJokeIndex.update((index) => index + 1);
  }

  public decrIndex(): void {
    this.currentJokeIndex.update((index) => index - 1);
  }
}
