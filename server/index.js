import express from 'express';
import bodyParser from 'body-parser';

import * as cocktails from './src/routes';

const PORT_NUM = 9090;
const CLIENT_URL = 'http://h2628212.stratoserver.net:7080';

const app = express();

app.use(bodyParser.json());

// Set the allowance for queries.
app.all('*', function(req, res, next) {
  if (!req.get('Origin'))
    return next();

  //! TODO These should be limited to get methods.
  res.set('Access-Control-Allow-Origin', CLIENT_URL);
  res.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  //! TODO Not sure what this does.
  if ('OPTIONS' == req.method)
    return res.sendStatus(200);

  next();
});

app.get('/', cocktails.getCollection);
app.get('/:id', cocktails.findById);
app.post('/', cocktails.addOne);
app.put('/:id', cocktails.updateOne);
app.delete('/:id', cocktails.deleteOne);

app.listen(PORT_NUM);
console.log('Listening on port ' + PORT_NUM + '...');
