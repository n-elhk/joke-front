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

  protected readonly previousJoke = this.jokeService.previousJoke;

  protected readonly nextJoke = this.jokeService.nextJoke;

  /** Provide from route data. */
  @Input() public joke!: Joke;

  /**
   *
   * @param id sorted by id.
   */
  previousItem(): void {
    const previous = this.previousJoke();

    if (previous) {
      this.jokeService.decrIndex();
      this.router.navigate([previous.slug]);
    }
  }

  /**
   *
   * @param id sorted by id.
   */
  nextItem(): void {
    const next = this.nextJoke();

    if (next) {
      this.jokeService.incrIndex();
      this.router.navigate([next.slug]);
    }
  }
}
