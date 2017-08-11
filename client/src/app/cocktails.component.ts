import { Component, OnInit } from '@angular/core';

import { Cocktail } from './cocktail'
import { CocktailService } from './cocktail.service';

@Component({
  selector: 'cocktails',
  template: `
    <ul>
      <li *ngIf="cocktail.glass==ikea" *ngFor="let cocktail of cocktails">
        <a [routerLink]=[cocktail.id]>{{ cocktail.name }}</a>
        <span>{{ cocktail.glass }}</span>
        <ul>
          <li *ngFor="let ingredient of cocktail.ingredients">
            {{ ingredient }}
          </li>
        </ul>
      </li>
    </ul>
  `,
})
export class CocktailsComponent implements OnInit {
  constructor(private cocktailService: CocktailService) { }

  cocktails: Cocktail[] = [];

  ngOnInit(): void {
    this.cocktailService.getCocktails().then(cocktails => {
      this.cocktails = cocktails;
    });
  }
}
