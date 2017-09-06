import { connect, Mode } from './data.js';
import { CocktailManager } from './cocktails.js';

connect(Mode.PRODUCTION).then(db => {
  const cocktails = new CocktailManager({db});
  cocktails.findAll().then(all => {
    for (let cocktail of all) {
      cocktails.update(cocktail._id, Object.assign({}, cocktail, {
        slug: cocktails.getSlugName(cocktail)
      }));
    }
  });
});

