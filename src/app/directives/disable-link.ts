import { Directive, Input, inject } from '@angular/core';
import { RouterLink, RouterLinkWithHref } from '@angular/router';

@Directive({
  selector: '[routerLink][disableLink]',
  standalone: true,
})
export class DisableLinkDirective {
  /** Injection of {@link RouterLink}. */
  private readonly routerLink = inject(RouterLink, { optional: true });

  /** Injection of {@link RouterLinkWithHref}. */
  private readonly routerLinkWithHref = inject(RouterLinkWithHref, { optional: true });

  @Input() public disableLink = false;

  constructor() {
    const link = this.routerLink || this.routerLinkWithHref;
    if (link) {
        // Save original method
        const onClick = link.onClick.bind(this);
    
        // Replace method
        link.onClick = (...args) => {
          if (this.disableLink) {
            return this.routerLinkWithHref ? false : true;
          } else {
            return onClick.apply(link, args);
          }
        };
    }
  }
}
