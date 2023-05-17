import { ActivatedRouteSnapshot, DetachedRouteHandle, BaseRouteReuseStrategy } from '@angular/router';

/** Custom routing strategy. Check reuse parameter on component indicate if the component should be reuse between two same routing. */
export class CustomReusingStrategy extends BaseRouteReuseStrategy {
  /** Route cache. */
  private cache: { [key: string]: DetachedRouteHandle } = {};

  /** @inheritdoc */
  public override shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return route?.routeConfig?.data?.['caching'] ? true : false;
  }

  /** @inheritdoc */
  public override store(route: ActivatedRouteSnapshot, handler: DetachedRouteHandle): void {
    if (handler) {
      const url = this.getUrl(route);

      if (url && !this.cache[url]) {
        this.cache[url] = handler;
      }
    }
  }

  /** @inheritdoc */
  public override shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const url = this.getUrl(route);

    return url ? !!this.cache[url] : false;
  }

  /** @inheritdoc */
  public override retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    if (!route.routeConfig || route.routeConfig.loadChildren) {
      return null;
    }

    const url = this.getUrl(route);

    return url ? this.cache[url] : null;
  }

  /** @inheritdoc */
  public override shouldReuseRoute(future: ActivatedRouteSnapshot, current: ActivatedRouteSnapshot): boolean {
    return super.shouldReuseRoute(future, current) && (future?.routeConfig?.data?.['caching'] ? false : true);
  }

  /**
   * Get the url.
   *
   * @param route The route to get url.
   * @returns The url string.
   */
  private getUrl(route: ActivatedRouteSnapshot): string | undefined {
    if (route.routeConfig && route.routeConfig.data?.['caching']) {
      const fullPath = route.pathFromRoot
        .map((el: ActivatedRouteSnapshot) => el.routeConfig ? el.routeConfig.path : '')
        .filter(str => str && str.length > 0)
        .join('');

      return fullPath || undefined;
    }

    return undefined;
  }
}
