import { expect } from 'chai';

import { DatabaseSimulator } from './db_simulator.js';

describe('DatabaseSimulator', () => {

  describe('find', () => {

    it('returns all objects', done => {
      const fixture = [{
        _id: 0,
        name: 'alice',
        age: 27
      }, {
        _id: 1,
        name: 'bob',
        age: 54
      }, {
        _id: 2,
        name: 'charlie',
        age: 18
      }];
      const db = new DatabaseSimulator();
      db.initializeCollection('test', fixture).then(collection => {
        return collection().find().toArray();
      }).then(result => {
        expect(result).to.deep.equal(fixture);
      }).then(done, done);
    });

    it('finds using an object', done => {
      const expected = {
        name: 'bob',
        age: 54
      };
      const db = new DatabaseSimulator();
      db.initializeCollection('persons', [{
        name: 'alice',
        age: 27
      }, {
        name: 'bob',
        age: 54
      }]).then(collection => {
        return collection().find({name: 'bob'}).toArray();
      }).then(result => {
        expect(result).to.have.lengthOf(1);
        expect(result[0]).to.include(expected);
      }).then(done, done);
    });

    it('searches using several terms', done => {
      const db = new DatabaseSimulator();
      db.initializeCollection('persons', [{
        name: 'alice',
        age: 27
      }, {
        name: 'alice',
        age: 54
      }, {
        name: 'bob',
        age: 54
      }]).then(collection => {
        return collection().find({
          name: 'alice', age: 54
        }).toArray();
      }).then(result => {
        expect(result).to.have.lengthOf(1);
        expect(result[0]).to.include({
          name: 'alice',
          age: 54
        });
      }).then(done, done);
    });

    it('returns several results', done => {
      const db = new DatabaseSimulator();
      db.initializeCollection('persons', [{
        name: 'alice',
        age: 50
      }, {
        name: 'bob',
        age: 50
      }]).then(collection => {
        return collection().find({age: 50}).toArray();
      }).then(result => {
        expect(result).to.have.lengthOf(2);
        expect(result).to.deep.equal([{
          _id: 0,
          name: 'alice',
          age: 50
        }, {
          _id: 1,
          name: 'bob',
          age: 50
        }]);
      }).then(done, done);
    });

    it('allows a search by regex', done => {
      const db = new DatabaseSimulator();
      db.initializeCollection('persons', [{
        name: 'alice spencer',
      }, {
        name: 'alice cooper',
      }, {
        name: 'bob spencer',
      }]).then(collection => {
        const search1 = collection().find({name: {
          $regex: new RegExp('alice'),
        }}).toArray().then(result => {
          expect(result.map(x => x.name)).to.have.members([
            'alice spencer', 'alice cooper'
          ]);
        });
        const search2 = collection().find({name: {
          $regex: new RegExp('Spencer$'),
          $options: 'i'
        }}).toArray().then(result => {
          expect(result.map(x => x.name)).to.have.members([
            'alice spencer', 'bob spencer'
          ]);
        });
        Promise.all([search1, search2]).then(() => {}).then(done, done);
      }).catch(done);
    });

  });

  describe('findOne', () => {

    it('returns a single result', done => {
      const db = new DatabaseSimulator();
      db.initializeCollection('persons', [{
        name: 'alice',
        age: 27
      }, {
        name: 'bob',
        age: 27
      }]).then(collection => {;
        return collection().findOne({age: 27});
      }).then(result => {
        expect(result).to.include({
          name: 'alice',
          age: 27
        });
      }).then(done, done);
    });

    it('returns null if not found', done => {
      const db = new DatabaseSimulator();
      db.initializeCollection('test').then(collection => {
        return collection().findOne({name: 'what'});
      }).then(result => {
        expect(result).to.be.null;
      }).then(done, done);
    });

  });

  describe('insertMany', () => {

    it('inserts several items', done => {
      const fixture = [{
        name: 'alice',
        age: 27
      }, {
        name: 'bob',
        age: 54
      }];
      const db = new DatabaseSimulator();
      db.initializeCollection('test').then(collection => {
        collection().insertMany(fixture).then(result => {
          expect(result.insertedCount).to.equal(2);
          return collection().find().toArray();
        }).then(result => {
          expect(result).to.deep.equal([{
            _id: 0,
            name: 'alice',
            age: 27,
          }, {
            _id: 1,
            name: 'bob',
            age: 54
          }]);
        }).then(done, done);
      }).catch(done);
    });

  });

  describe('insertOne', () => {

    it('inserts an item', done => {
      const db = new DatabaseSimulator();
      db.initializeCollection('test').then(collection => {
        return collection().insertOne({name: 'test'});
      }).then(result => {
        expect(result.insertedCount).to.equal(1);
      }).then(done, done);
    });

    it('adds an ID to inserted elements', done => {
      const db = new DatabaseSimulator();
      db.initializeCollection('test').then(collection => {
        collection().insertOne({name: 'test'}).then(result => {
          expect(result.insertedId).to.be.a('number');
          return collection().findOne({name: 'test'});
        }).then(result => {
          expect(result).to.include.keys('_id');
        }).then(done, done);
      }).catch(done);
    });

  });

  describe('updateOne', () => {

    it('updates an existing item', done => {
      const db = new DatabaseSimulator();
      db.initializeCollection('test', [{
        _id: 12345,
        name: 'alice'
      }]).then(collection => {
        collection().updateOne({_id: 12345}, {
          name: 'bob'
        }).then(result => {
          expect(result.modifiedCount).to.equal(1);
          return collection().findOne({_id: 12345});
        }).then(result => {
          expect(result.name).to.equal('bob');
        }).then(done, done);
      }).catch(done);
    });

    it('throws error on updating item that doesn\'t exist', done => {
      const fixture = [{
        _id: 12345,
        name: 'alice'
      }];
      const db = new DatabaseSimulator();
      db.initializeCollection('test', fixture).then(collection => {
        collection().updateOne({_id: 0}, {
          name: 'bob'
        }).then(result => {
          expect(result.modifiedCount).to.equal(0);
          return collection().find().toArray();
        }).then(result => {
          expect(result).to.deep.equal(fixture);
        }).then(done, done);
      }).catch(done);
    });

  });

  describe('reset', () => {

    it('resets the database', done => {
      const collectionName = 'persons';
      const fixture = [{
        _id: 0,
        name: 'alice',
        age: 27
      }, {
        _id: 1,
        name: 'bob',
        age: 54
      }];
      const db = new DatabaseSimulator();
      db.initializeCollection(collectionName, fixture).then(
          collection => {
        collection().insertOne({
          name: 'charlie',
          age: 30
        }).then(() => {
          return collection().updateOne({name: 'bob'}, {
            name: 'bob',
            age: 1000
          });
        }).then(() => {
          return db.reset();
        }).then(() => {
          return collection().find().toArray();
        }).then(all => {
          expect(all).to.deep.equal(fixture);
        }).then(done, done);
      }).catch(done);
    });

    it('resets an individual collection', done => {
      // Set up two collections, each with two items.
      const fixture1 = [{
        _id: 0,
        name: 'alice'
      }, {
        _id: 1,
        name: 'bob',
      }];
      const db = new DatabaseSimulator();
      const collection1 = db.initializeCollection('test1', fixture1);
      const collection2 = db.initializeCollection('test2', [{
        _id: 0,
        name: 'charlie'
      }, {
        _id: 1,
        name: 'dave'
      }]);
      // Wait for both to be finished.
      Promise.all([collection1, collection2]).then(([co1, co2]) => {
        // Insert one in each collection.
        co1().insertOne({
          _id: 2,
          name: 'eva'
        }).then(() => {
          return co2().insertOne({
            _id: 2,
            name: 'fred'
          });
        }).then(() => {
          // Reset the first, make sure second is updated.
          return db.reset('test1');
        }).then(() => {
          const all1 = co1().find().toArray();
          const all2 = co2().find().toArray();
          Promise.all([all1, all2]).then(results => {
            expect(results[0]).to.deep.equal(fixture1);
            expect(results[1]).to.deep.equal([{
              _id: 0,
              name: 'charlie'
            }, {
              _id: 1,
              name: 'dave'
            }, {
              _id: 2,
              name: 'fred'
            }]);
          }).then(done, done);
        }).catch(done);
      }).catch(done);
    });

    it('creates copy of original state', done => {
      let collectionName = 'persons';
      const fixture = [{
        _id: 0,
        name: 'alice',
        age: 27
      }, {
        _id: 1,
        name: 'bob',
        age: 54
      }];
      const db = new DatabaseSimulator();
      db.initializeCollection(collectionName, fixture).then(collection => {
        collectionName += 'aw';
        fixture.push({name: 'charlie'});
        return collection().find().toArray();
      }).then(all => {
        expect(all).to.deep.equal([{
          _id: 0,
          name: 'alice',
          age: 27
        }, {
          _id: 1,
          name: 'bob',
          age: 54
        }]);
      }).then(done, done);
    });

  });

});
