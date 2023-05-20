import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { tap } from 'rxjs';
import { JokeService } from 'src/app/core/services/joke/joke.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  /** Injection of {@link JokeService}. */
  protected readonly jokeService = inject(JokeService);

  /** Injection of {@link JokeService}. */
  protected readonly router = inject(Router);

  public getRandom(): void {
    this.jokeService
      .getRandomJoke()
      .pipe(tap((joke) => this.router.navigate([joke.slug])))
      .subscribe();
  }
}
