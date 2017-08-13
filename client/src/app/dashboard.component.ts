import { Component, OnInit } from '@angular/core';

import { Cocktail } from './cocktail'
import { CocktailService } from './cocktail.service';

type SortFunction = (a: Cocktail, b: Cocktail) => number;

@Component({
  selector: 'dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['cocktails.component.scss']
})
export class DashboardComponent implements OnInit {
  constructor(private cocktailService: CocktailService) { }

  cocktails: Cocktail[] = [];
  searchTerm: string;
  sortFunction: SortFunction = this.aToZ.bind(this);
  searchType: string = 'name';

  private strcmp(a: string, b: string): number {
    if (a < b) {
      return -1;
    } else if (a === b) {
      return 0;
    } else {
      return 1;
    }
  }

  private aToZ(a: Cocktail, b: Cocktail): number {
    return this.strcmp(a.name, b.name);
  }

  private zToA(a: Cocktail, b: Cocktail): number {
    return this.aToZ(a, b) * -1;
  }

  private glassSort(a: Cocktail, b: Cocktail): number {
    return this.strcmp(a.glass, b.glass) * -1;
  }

  ngOnInit(): void {
    this.cocktailService.getCocktails().then(cocktails => {
      this.cocktails = cocktails;
    });
  }

  private isSearchByName(): boolean {
    return this.searchType === 'name';
  }

  private search(term: string): void {
    this.searchTerm = term;
  }

  private changeSortingMethod(sorting: SortFunction): void {
    this.sortFunction = sorting;
  }

  private checkSort(sorting: SortFunction): boolean {
    return this.sortFunction === sorting;
  }
}
