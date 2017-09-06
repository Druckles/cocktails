import { expect } from 'chai';
import DatabaseCleaner from 'database-cleaner';

import { connect, Mode } from '../src/data';
import { addFixture } from './db_helper.js';
import { CocktailManager } from '../src/cocktails';

let cocktails;
let data;
let addDrink;

describe('CocktailManager', () => {

  before(done => {
    connect(Mode.TEST).then(db => {
      cocktails = new CocktailManager(db);
      data = db;
      addDrink = addFixture(db)('drinks');
    }).then(done, done);
  });

  beforeEach(done => {
    const dbCleaner = new DatabaseCleaner('mongodb');
    dbCleaner.clean(data, done);
  });

  describe('getSlugName', () => {

    it('slugifies a cocktail name', () => {
      const cocktail = {'name': 'old fashioned'};

      const cocktailSlug = cocktails.getSlugName(cocktail);
      expect(cocktailSlug).to.equal('Old_Fashioned');
    });

    it ('correctly removes unwanted characters', () => {
      const cocktail = {'name': ' _What*is-this_ _Actually '};

      const cocktailSlug = cocktails.getSlugName(cocktail);
      expect(cocktailSlug).to.equal('Whatis-This_Actually');
    });

  });

  describe('finds', () => {

    it('a cocktail by ID', done => {
      const cocktail = {'name': 'Old Fashioned'};
      addDrink(cocktail).then(res => {
        const id = res.insertedId;
        return cocktails.findById(id);
      }).then(result => {
        expect(result.name).to.equal(cocktail.name);
      }).then(done, done);
    });

    it('a cocktail by its slug', done => {
      const cocktail = {'name': 'Old Fashioned'};
      cocktails.insertOne(cocktail).then(() => {
        return cocktails.findBySlug('Old_Fashioned');
      }).then(result => {
        expect(result, 'result').to.be.an('object');
        expect(result.name).to.equal(cocktail.name);
      }).then(done, done);
    });

  });

  describe('insert', () => {

    it('assigns the cocktail a slug upon insert', done => {
      const cocktail = {'name': 'Old Fashioned'};
      cocktails.insertOne(cocktail).then(result => {
        expect(result.slug).to.equal(cocktails.getSlugName(cocktail));
      }).then(done, done);
    });

  });

});
