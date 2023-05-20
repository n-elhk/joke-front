import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { Event, Router, RouterOutlet, Scroll } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { NgIf, ViewportScroller } from '@angular/common';
import { delay, filter, tap } from 'rxjs';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet, HeaderComponent, NgIf],
})
export class AppComponent {
  public title = 'joke-front';

  /** Injection of {@link Router}. */
  private readonly router = inject(Router);

  /** Injection of {@link Router}. */
  private readonly viewportScroller = inject(ViewportScroller);

  /** Injection of {@link ChangeDetectorRef}. */
  private readonly cdr = inject(ChangeDetectorRef);

  constructor() {
    /** Restore the scroll. */
    this.router.events
      .pipe(
        filter((e: Event): e is Scroll => e instanceof Scroll),
        delay(50),
        tap((scroll) => {
          this.cdr.detectChanges();
          if (scroll.position) {
            // backward navigation
            this.viewportScroller.scrollToPosition(scroll.position);
          } else if (scroll.anchor) {
            // anchor navigation
            this.viewportScroller.scrollToAnchor(scroll.anchor);
          } else {
            // forward navigation
            this.viewportScroller.scrollToPosition([0, 0]);
          }
        }),
        takeUntilDestroyed()
      )
      .subscribe();
  }
}
