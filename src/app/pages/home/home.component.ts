import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { JokeService } from '../../core/services/joke/joke.service';
import { Router, RouterLink } from '@angular/router';
import { CardComponent } from '../../components/card/card.component';
import { filter, fromEvent, switchMap, tap, throttleTime } from 'rxjs';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CardComponent, RouterLink, SpinnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  /** Injection of {@link JokeService}. */
  private jokeService = inject(JokeService);

  /** Injection of {@link Router}. */
  private router = inject(Router);

  /** Injection of {@link ChangeDetectorRef}. */
  private readonly cdr = inject(ChangeDetectorRef);

  public jokes = this.jokeService.selectJokes;

  public isLoading = this.jokeService.selectIsLoading;

  public currentJoke = this.jokeService.selectCurrentJoke;

  constructor() {
    fromEvent(window, 'scroll', { passive: true })
      .pipe(
        throttleTime(100, undefined, { trailing: true, leading: true }),
        filter(
          () =>
            Math.ceil(window.innerHeight + window.scrollY) >=
            document.body.offsetHeight
        ),
        switchMap(() => this.jokeService.getJokes(this.jokes().length)),
        tap(() => this.cdr.detectChanges()),
        takeUntilDestroyed()
      )
      .subscribe();
  }

  public goToJoke(jokeId: number): void {
    this.jokeService.updateCurrentJoke(jokeId);

    const currentJoke = this.currentJoke();

    if (currentJoke) {
      this.router.navigate([currentJoke.slug]);
    }
  }
}
