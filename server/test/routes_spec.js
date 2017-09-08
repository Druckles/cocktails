import { expect } from 'chai';

import { DatabaseSimulator } from './db_simulator.js';

import { Router } from '../src/routes.js';
import { CocktailManager } from '../src/cocktails.js';

//! TODO Set up a fake database.
const fixtures = [{
}];

// Provides an interface for modifying a given object with the results.
const res = returnObject => ({
  send: data => {
    returnObject.data = data;
  },
  sendStatus: num => {
    returnObject.status = num;
  }
});

describe('Router', () => {

  let router;
  let db;
  let collection;

  before(done => {
    db = new DatabaseSimulator();
    db.initializeCollection('drinks', fixtures).then(col => {
      collection = col;
      router = new Router(new CocktailManager(db));
    }).then(done, done);
  });

  beforeEach(done => {
    console.log(db);
    db.reset().then(done, done);
  });

  it('returns all cocktails', () => {
    const req = {query: {}}
    const returnObject = {};
    router.getCollection(req, res(returnObject));

    expect(returnObject.data).to.deep.equal(fixtures);
  });

});
