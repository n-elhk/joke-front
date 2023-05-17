import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Joke } from 'src/app/core/interface/joke';


@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {}
