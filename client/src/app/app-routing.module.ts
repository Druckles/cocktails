import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CocktailsComponent } from './cocktails.component';
import { CocktailComponent } from './cocktail.component';

const routes: Routes = [{
  path: '',
  component: CocktailsComponent
}, {
  path: ':id',
  component: CocktailComponent
}];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
