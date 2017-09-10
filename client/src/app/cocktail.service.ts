import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

//! TODO Actually get the real cocktails.
import { Cocktail, getMockCocktails } from './cocktail';

const SERVER_URL = 'http://h2628212.stratoserver.net:9090';

@Injectable()
export class CocktailService {
  constructor(
    private http: Http
  ) { }

  //! TODO Do this properly.
  private handleError(error: any): Promise<any> {
    console.error(error);
    return Promise.reject(error.message || error);
  }

  private toCocktail(thing: any): Cocktail {
    return Object.assign({}, ...Object.keys(thing).map(key => {
      if (key === '_id') {
        return {id: thing[key]};
      }
      return {[key]: thing[key]};
    }));
  }

  getCocktails(): Promise<Cocktail[]> {
    return this.http.get(SERVER_URL).toPromise()
      .then(response => response.json().map(this.toCocktail))
      .catch(this.handleError);
  }

  getCocktailBySlug(slug: string): Promise<Cocktail> {
    const url = `${SERVER_URL}/${slug}`;
    return this.http.get(url).toPromise()
      .then(response => this.toCocktail(response.json()))
      .catch(this.handleError);
  }

  getCocktailById(id: string): Promise<Cocktail> {
    const url = `${SERVER_URL}/?id=${id}`;
    return this.http.get(url).toPromise()
      .then(response => this.toCocktail(response.json()))
      .catch(this.handleError);
  }
}
