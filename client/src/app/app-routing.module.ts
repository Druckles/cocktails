import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { CocktailComponent } from './cocktail.component';

const routes: Routes = [{
  path: '',
  component: DashboardComponent
}, {
  path: ':slug',
  component: CocktailComponent
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
