import { Pipe } from '@angular/core';

import { Cocktail } from './cocktail';

const escapeRegExp = function(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

@Pipe({
  name: 'CocktailFilter'
})
export class CocktailFilter {
  transform(cocktails: Cocktail[], args: any) {
    let filterSpec;
    let options = {
      filterOut: undefined,
      regex: undefined
    };
    if (Array.isArray(args)) {
      filterSpec = args[0];
      options = args[1];
    } else {
      filterSpec = args;
    }
    return cocktails.filter(cocktail => {
      return Object.keys(filterSpec).map(key => {
        if (options.regex) {
          return new RegExp('^' + escapeRegExp(filterSpec[key]), 'i')
            .test(cocktail[key]);
        }
        return cocktail[key] === filterSpec[key];
      }).every(x => options.filterOut ? !x : x);
    });
  }
}
