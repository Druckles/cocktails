import * as core from './core.js';

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

export function getCollection(req, res) {
  let collectionPromise;
  if (req.query.name) {
    console.log('Filtering cocktails by ', req.query.name);
    collectionPromise = core.filterByName(req.query.name);
  } else {
    console.log('Retrieving all cocktails...');
    collectionPromise = core.findAll(req.query.name)
  }
  // Return the result.
  collectionPromise.then(cocktails => {
    res.send(cocktails);
  });
}

export function findById(req, res) {
  console.log('Retrieving cocktail:', req.params.id);
  core.findById(req.params.id).then(cocktail => {
    if (!cocktail) {
      return res.sendStatus(404);
    }
    res.send(cocktail);
  }).catch(handleError(res));
}

export function addOne(req, res) {
  console.log('Adding cocktail:', JSON.stringify(req.body));
  core.insertOne(req.body).then((result, doc) => {
    console.log('Success:', JSON.stringify(result));
    console.log(doc);
    res.send(result);
  }).catch(handleError(res));;
}

export function updateOne(req, res) {
  console.log('Updating cocktail:', req.params.id);
  console.log('...', JSON.stringify(req.body));
  core.update(req.params.id, req.body).then(result => {
    console.log(result.result.n, 'document(s) updated');
    res.send(req.body);
  }).catch(handleError(res));;
}

export function deleteOne(req, res) {
  console.log('Deleting cocktail:', req.params.id);
  core.remove(req.params.id).then(result => {
    console.log(result.result.n, 'document(s) deleted');
    res.send(req.body);
  }).catch(handleError(res));;
}
