import { Component, Input } from '@angular/core';

import { Cocktail } from './cocktail';

@Component({
  selector: 'cocktails',
  templateUrl: 'cocktails.component.html',
  styleUrls: ['cocktails.component.scss']
})
export class CocktailsComponent {
  @Input() cocktails: Cocktail[];
  @Input() sortFunction: (a: Cocktail, b: Cocktail) => Number;
}
