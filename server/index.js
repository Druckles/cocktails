import express from 'express';
import bodyParser from 'body-parser';

import { Router } from './src/routes';
import { CocktailManager } from './src/cocktails.js';
import * as Data from './src/data';

const PORT_NUM = 9090;
const CLIENT_URL = 'http://h2628212.stratoserver.net';

const app = express();

app.use(bodyParser.json());

// Set the allowance for queries.
app.all('*', function(req, res, next) {
  if (!req.get('Origin'))
    return next();

  res.set('Access-Control-Allow-Origin', CLIENT_URL);
  //res.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.set('Access-Control-Allow-Methods', 'GET');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  //! TODO Not sure what this does.
  if ('OPTIONS' == req.method)
    return res.sendStatus(200);

  next();
});

// Create the router.
Data.connect(Data.Mode.PRODUCTION).then(db => {
  const cocktailManager = new CocktailManager(db);
  const router = new Router(cocktailManager);

  app.get('/', router.getCollection.bind(router));
  app.get('/:id', router.findById.bind(router));
  app.post('/', router.addOne.bind(router));
  app.put('/:id', router.updateOne.bind(router));
  app.delete('/:id', router.deleteOne.bind(router));

  app.listen(PORT_NUM);
  console.log('Listening on port ' + PORT_NUM + '...');
});
