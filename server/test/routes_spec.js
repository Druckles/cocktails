import { expect } from 'chai';
import { ObjectID } from 'mongodb';

import { DatabaseSimulator } from './db_simulator.js';

import { Router } from '../src/routes.js';
import { CocktailManager } from '../src/cocktails.js';

const oldFashionedId = ObjectID();
const fixtures = [{
  _id: oldFashionedId,
  name: 'Old Fashioned'
}, {
  name: 'Caipirihna'
}, {
  name: 'Manhattan'
}, {
  name: 'San Francisco',
  slug: 'San_Francisco',
  color: 'red'
}, {
  name: 'Old Yeller'
}, {
  name: 'Oldham'
}];

// Creates an object that can be passed to res.
class ResultObject {
  constructor() {
    // Create a deferred promise.
    this._sendWaitPromise = new Promise((resolve, reject) => {
      this._resolveSend = resolve;
      this._rejectSend = reject;
    });
  }

  send(data) {
    this.data = data;
    this._resolveSend(data);
  }

  sendStatus(num) {
    this.status = num;
    this._rejectSend(num);
  }

  waitForSend() {
    return this._sendWaitPromise;
  }
}

describe('Router', () => {

  let router;
  let db;

  before(done => {
    db = new DatabaseSimulator();
    db.initializeCollection('drinks', fixtures).then(col => {
      router = new Router(new CocktailManager(db));
      //col().find().toArray().then(all => console.log(all));
    }).then(done, done);
  });

  beforeEach(done => {
    db.reset().then(done, done);
  });

  describe('getCollection', () => {

    it('returns all cocktails', done => {
      const req = {query: {}}
      const res = new ResultObject();
      router.getCollection(req, res);

      // Need to wait for the res to resolve, then check what was 'sent'.
      res.waitForSend().then(data => {
        // Only interested in the names inserted. Also adds things like _id.
        expect(data.map(x => x.name)).to.deep.equal(fixtures.map(x => x.name));
      }).then(done, done);
    });

    it('filters cocktails', done => {
      const req = {query: {
        name: 'old'
      }};
      const res = new ResultObject();
      router.getCollection(req, res);

      res.waitForSend().then(data => {
        // Only want to know what 'names' were returned.
        expect(data.map(x => x.name)).to.have.members([
          'Old Fashioned', 'Old Yeller', 'Oldham'
        ]);
      }).then(done, done);
    });

  });

  describe('findById', () => {

    it('returns a single cocktail with the given ID', done => {
      const req = {params: {
        id: oldFashionedId
      }};
      const res = new ResultObject();
      router.findById(req, res);

      res.waitForSend().then(data => {
        expect(data.name).to.equal('Old Fashioned');
      }).then(done, done);
    });

  });

  describe('findBySlug', () => {

    it('returns a single cocktail that matches the slug', done => {
      const req = {params: {
        slug: 'San_Francisco'
      }};
      const res = new ResultObject();
      router.findBySlug(req, res);

      res.waitForSend().then(data => {
        expect(data).to.include({
          name: 'San Francisco',
          color: 'red'
        });
      }).then(done, done);
    });

  });

});
