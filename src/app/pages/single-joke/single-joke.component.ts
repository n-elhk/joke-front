import { NgIf } from '@angular/common';
import {
  Component,
  Input,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CardComponent } from '../../components/card/card.component';
import type { Joke } from '../../core/interface/joke';
import { JokeService } from 'src/app/core/services/joke/joke.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-single-joke',
  standalone: true,
  templateUrl: './single-joke.component.html',
  styleUrls: ['./single-joke.component.scss'],
  imports: [NgIf, RouterLink, CardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SingleJokeComponent {
  /** Injection of {@link JokeService}. */
  private readonly jokeService = inject(JokeService);

  /** Injection of {@link Router}. */
  private readonly router = inject(Router);

  protected readonly previousJoke =  this.jokeService.selectPreviousJokes;

  protected readonly nextJoke = this.jokeService.selectNextJokes;

  /** Provide from route data. */
  @Input() public joke!: Joke;

  /**
   *
   * @param id sorted by id.
   */
  public previousItem(): void {
    const previous = this.previousJoke();

    if (previous) {
      this.updateJoke(previous);
    } else {
      this.navigateToJoke(this.joke.id - 1).subscribe();
    }
  }

  /**
   *
   * @param id sorted by id.
   */
  public nextItem(): void {
    const next = this.nextJoke();

    if (next) {
      this.updateJoke(next);
    } else {
      this.navigateToJoke(this.joke.id + 1).subscribe();
    }
  }

  public updateJoke(joke: Joke) {
    this.jokeService.updateCurrentJoke(joke.id);
    this.router.navigate([joke.slug]);
  }

  public navigateToJoke(id: number) {
    return this.jokeService
      .getJoke({ id })
      .pipe(tap((joke) => this.updateJoke(joke)));
  }
}
