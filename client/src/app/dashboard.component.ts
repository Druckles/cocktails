import { Component, OnInit } from '@angular/core';

import { Cocktail } from './cocktail'
import { CocktailService } from './cocktail.service';

      //<input #searchBox id="search-box" (keyup)="search(searchBox.value)" />
@Component({
  selector: 'dashboard',
  template: `
    <input #searchBox type="text" (keyup)="search(searchBox.value)" class="mb-4 d-print-none" />
    <cocktails *ngIf="searchTerm; else elseBlock" [cocktails]="cocktails | CocktailFilter:[{name: searchTerm}, {regex: true}]"></cocktails>
    <ng-template #elseBlock>
      <h2>Mit Alkohol</h2>
      <cocktails [cocktails]="cocktails | CocktailFilter:[{alcohol: false}, {filterOut: true}]"></cocktails>

      <hr />
      <h2>Alkoholfrei</h2>
      <cocktails [cocktails]="cocktails | CocktailFilter:{alcohol: false}"></cocktails>
    </ng-template>
  `,
  styleUrls: ['cocktails.component.scss']
})
export class DashboardComponent implements OnInit {
  constructor(private cocktailService: CocktailService) { }

  cocktails: Cocktail[] = [];
  searchTerm: string;

  ngOnInit(): void {
    this.cocktailService.getCocktails().then(cocktails => {
      this.cocktails = cocktails;
    });
  }

  search(term: string): void {
    this.searchTerm = term;
    //console.log(this.searchTerm);
  }
}
