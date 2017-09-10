import { Component, Input } from '@angular/core';

import { Cocktail } from './cocktail';

@Component({
  selector: 'cocktail-image',
  templateUrl: 'cocktail-image.component.html',
  styleUrls: ['cocktail-image.component.scss']
})
export class CocktailImageComponent {
  @Input() cocktail: Cocktail;
}
