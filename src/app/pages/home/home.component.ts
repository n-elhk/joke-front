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
import { NgForOf } from '@angular/common';
import { filter, fromEvent, switchMap, tap, throttleTime } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CardComponent, NgForOf, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  /** Injection of {@link JokeService}. */
  private jokeService = inject(JokeService);

  /** Injection of {@link Router}. */
  private router = inject(Router);

  /** Injection of {@link ChangeDetectorRef}. */
  private readonly cdr = inject(ChangeDetectorRef);

  public jokes = this.jokeService.jokes;
  public currentJoke = this.jokeService.currentJoke;

  constructor() {
    fromEvent(window, 'scroll', { passive: true })
      .pipe(
        throttleTime(100, undefined, { trailing: true, leading: true }),
        filter(
          () =>
            Math.ceil(window.innerHeight + window.scrollY) >=
            document.body.offsetHeight
        ),
        switchMap(() => this.jokeService.getJokes()),
        tap(() => this.cdr.detectChanges()),
        takeUntilDestroyed()
      )
      .subscribe();
  }


  public goToJoke(index: number): void {
    this.jokeService.selectIndex(index);

    const currentJoke = this.currentJoke();

    if (currentJoke) {
      this.router.navigate([currentJoke.slug]);
    }
  }
}
