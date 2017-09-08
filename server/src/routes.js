import { CocktailManager } from './cocktails.js';

function handleError(res) {
  return error => {
    console.log('Error:', error.message ? error.message : error);
    switch (error.code) {
      case 11000:
        return res.sendStatus(409);
      case 404:
        return res.sendStatus(404);
      default:
        return res.sendStatus(500);
    }
  }
}

export class Router {

  constructor(cocktailManager) {
    this.manager = cocktailManager;
  }

  getCollection(req, res) {
    let collectionPromise;
    if (req.query.name) {
      console.log('Filtering cocktails by ', req.query.name);
      collectionPromise = this.manager.filterByName(req.query.name);
    } else {
      console.log('Retrieving all cocktails...');
      collectionPromise = this.manager.findAll(req.query.name)
    }
    // Return the result.
    collectionPromise.then(cocktails => {
      res.send(cocktails);
    });
  }

  findById(req, res) {
    console.log('Retrieving cocktail:', req.params.id);
    this.manager.findById(req.params.id).then(cocktail => {
      if (!cocktail) {
        return res.sendStatus(404);
      }
      res.send(cocktail);
    }).catch(handleError(res));
  }

  addOne(req, res) {
    console.log('Adding cocktail:', JSON.stringify(req.body));
    this.manager.insertOne(req.body).then((result, doc) => {
      console.log('Success:', JSON.stringify(result));
      console.log(doc);
      res.send(result);
    }).catch(handleError(res));;
  }

  updateOne(req, res) {
    console.log('Updating cocktail:', req.params.id);
    console.log('...', JSON.stringify(req.body));
    this.manager.update(req.params.id, req.body).then(result => {
      console.log(result.result.n, 'document(s) updated');
      res.send(req.body);
    }).catch(handleError(res));;
  }

  deleteOne(req, res) {
    console.log('Deleting cocktail:', req.params.id);
    this.manager.remove(req.params.id).then(result => {
      console.log(result.result.n, 'document(s) deleted');
      res.send(req.body);
    }).catch(handleError(res));;
  }

}
