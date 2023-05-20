import { NgIf } from '@angular/common';
import {
  Component,
  Input,
  inject,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CardComponent } from '../../components/card/card.component';
import type { Joke } from '../../core/interface/joke';
import { JokeService } from 'src/app/core/services/joke/joke.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-single-joke',
  standalone: true,
  templateUrl: './single-joke.component.html',
  styleUrls: ['./single-joke.component.scss'],
  imports: [NgIf, RouterLink, CardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SingleJokeComponent implements OnInit {
  /** Injection of {@link JokeService}. */
  private readonly jokeService = inject(JokeService);

  /** Injection of {@link Router}. */
  private readonly router = inject(Router);

  protected readonly previousJoke = toSignal(
    this.jokeService.selectPreviousJokes$
  );

  protected readonly nextJoke = toSignal(this.jokeService.selectNextJokes$);

  /** Provide from route data. */
  @Input() public joke!: Joke;

   public ngOnInit(): void {
    this.jokeService.loadPreviousJoke();
  }

  /**
   *
   * @param id sorted by id.
   */
  public previousItem(): void {
    const previous = this.previousJoke();

    if (previous) {
      this.jokeService.updateCurrentJoke(previous.id);
      this.router.navigate([previous.slug]);
    }
  }

  /**
   *
   * @param id sorted by id.
   */
  public nextItem(): void {
    const next = this.nextJoke();

    if (next) {
      this.jokeService.updateCurrentJoke(next.id);
      this.router.navigate([next.slug]);
    }
  }
}
