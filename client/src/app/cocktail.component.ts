import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import 'rxjs/add/operator/switchMap';

import { Cocktail } from './cocktail';
import { CocktailService } from './cocktail.service';

@Component({
  selector: 'cocktail',
  templateUrl: 'cocktail.component.html',
})
export class CocktailComponent {
  constructor(
    private cocktailService: CocktailService,
    private route: ActivatedRoute
  ) { }

  cocktail: Cocktail;

  ngOnInit(): void {
    this.route.paramMap.switchMap(params => {
      return this.cocktailService.getCocktailById(params.get('id'));
    }).subscribe(cocktail => this.cocktail = cocktail);
  }
}
