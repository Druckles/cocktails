import express from 'express';

import * as cocktails from './routes/cocktails';

const portNum = 9090;

const app = express();

app.get('/wines', cocktails.findAll);
app.get('/wines/:id', cocktails.findById);

app.listen(portNum);
console.log('Listening on port ' + portNum + '...');
