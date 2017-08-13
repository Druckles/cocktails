import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';

import { CocktailService } from './cocktail.service';
import { CocktailFilter } from './cocktail-filter.pipe';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard.component';
import { CocktailsComponent } from './cocktails.component';
import { CocktailComponent } from './cocktail.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CocktailsComponent,
    CocktailComponent,
    CocktailFilter
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
  ],
  providers: [CocktailService],
  bootstrap: [AppComponent],
})
export class AppModule { }
