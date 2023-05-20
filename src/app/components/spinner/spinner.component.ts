import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'spinner',
  standalone: true,
  templateUrl: './spinner.component.svg',
  styleUrls: ['./spinner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent {}
