import { expect } from 'chai';
import DatabaseCleaner from 'database-cleaner';

import { connect, Mode } from '../src/data';
import { CocktailManager } from '../src/cocktails';

describe('CocktailManager', () => {

  let cocktails;
  let db;
  let col;

  before(done => {
    connect(Mode.TEST).then(connectedDb => {
      cocktails = new CocktailManager(connectedDb);
      db = connectedDb;
      col = db.collection('drinks');
    }).then(done, done);
  });

  beforeEach(done => {
    const dbCleaner = new DatabaseCleaner('mongodb');
    dbCleaner.clean(db, done);
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
      col.insertOne(cocktail).then(res => {
        const id = res.insertedId;
        return cocktails.findById(id);
      }).then(result => {
        expect(result.name).to.equal(cocktail.name);
      }).then(done, done);
    });

    it('a cocktail filtered by name', done => {
      const fixture = [{
        'name': 'Old Fashioned'
      }, {
        'name': 'Mojito'
      }, {
        'name': 'Oldham'
      }];
      col.insertMany(fixture).then(() => {
        return cocktails.filterByName('old');
      }).then(result => {
        expect(result.length).to.equal(2);
        // Convert list of objects to list of names.
        expect(result.map(x => x.name)).to.include.all.members([
          'Old Fashioned',
          'Oldham'
        ]);
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

  describe('insertMany', () => {

    it('inserts several cocktails simulataneously', done => {
      const fixture = [{
        name: 'Old Fashioned'
      }, {
        name: 'Manhattan'
      }, {
        name: 'Mojito'
      }];
      cocktails.insertMany(fixture).then(result => {
        return col.find().toArray();
      }).then(all => {
        expect(all.length).to.equal(3);
        // Get rid of everything except the names (_id and slug are unimportant)
        expect(all.map(x => x.name)).to.have.all.members([
          'Old Fashioned', 'Manhattan', 'Mojito'
        ]);
      }).then(done, done);
    });

    it('adds a slug for each cocktail', done => {
      const fixture = [{
        name: 'Old Fashioned',
        color: 'red'
      }, {
        name: 'Manhattan',
        color: 'blue'
      }, {
        name: ' Blue Carabic__',
        color: 'blue'
      }]
      cocktails.insertMany(fixture).then(result => {
        return col.find().toArray();
      }).then(all => {
        expect(all.length).to.equal(3);
        expect(all.map(x => x.slug)).to.have.all.members([
          'Old_Fashioned', 'Manhattan', 'Blue_Carabic'
        ]);
      }).then(done, done)
    });

  });

});
