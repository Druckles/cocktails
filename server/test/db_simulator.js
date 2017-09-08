import { Map, fromJS } from 'immutable';

/**
 * HELPER: Checks to see if an object matches a search criteria.
 */
function checkItem(item, searchObj) {
  // Positive search. Only doesn't match if it fails one of the criteria.
  let found = true;
  for (const key of Object.keys(searchObj)) {
    if (!(key in item) || item[key] !== searchObj[key]) {
      found = false;
      break;
    }
  }
  return found;
}

/**
 * HELPER: Finds items in the database that match the searchObj.
 * 
 * @numToFind indicates how many results to return. -1 indicates all.
 */
function findHelper(collection, searchObj, numToFind) {
  // searchObj can be undefined.
  if (!searchObj) {
    searchObj = {};
  }

  //! TODO Generalise to all unique keys.
  // Unique keys will find single items. Save some time by fetching them.
  if ('_id' in searchObj && searchObj._id in collection) {
    const theItem = collection.get(searchObj._id).toJS();
    if (checkItem(theItem, searchObj)) {
      return [theItem];
    }
  }

  // The list to return.
  let items = [];
  // If a negative number, allow us to search through the whole collection.
  let numFound = (numToFind < 0) ? (0 - collection.length) : 0;
  for (const key of [...collection.keys()]) {
    if (numFound >= numToFind) {
      return items;
    }

    const current = collection.get(key).toJS();
    if (checkItem(current, searchObj)) {
      items.push(current);
      numFound++;
    }
  }

  return items;

}

class DatabaseCollectionSimulator {
  constructor(name) {
    // Properties.
    this._id = 0;
    this._database = Map();
    this._name = name;
  }

  /**
   * Inserts several documents simultaneously.
   * 
   * Function waits for each item to be inserted before continuing to next.
   */
  async insertMany(items) {
    const result = {
      insertedCount: 0,
      insertedIds: [],
      result: {
        ok: 1,
        n: 0
      }
    };

    for (const item of items) {
      const res = await this.insertOne(item);
      if (res.result.ok) {
        result.insertedCount++;
        result.insertedIds.push(res.insertedId);
        result.result.n++;
      } else {
        result.result.ok = 0;
      }
    }

    return result;
  }

  async insertOne(something) {
    // Whether to use the ID from the object.
    const fakeId = ('_id' in something && !(something._id in this._database));
    const id = fakeId ? something._id : this._id++;
    const newItem = Map(something).merge({_id: id});
    this._database = this._database.set(id, newItem);
    return {
      insertedCount: 1,
      insertedId: id,
      result: {ok: 1, n: 1}
    }
  }

  async updateOne(searchObj, thing) {
    const item = await this.findOne(searchObj);
    if (item === null) {
      return {
        result: {
          ok: 1,
          nModified: 0
        },
        matchedCount: 0,
        modifiedCount: 0
      };
    }

    //! TODO Make sure they're not changing the ID. If they are:
    // make sure it doesn't already exist
    // insert the item
    this._database = this._database.updateIn([item._id], x => x.merge(thing));
    return {
      result: {
        ok: 1,
        nModified: 1
      },
      matchedCount: 1,
      modifiedCount: 1
    }
  }

  find(searchObj) {
    // Find all objects in the database.
    const items = findHelper(this._database, searchObj, -1);
    return {
      toArray: async () => {
        return items;
      }
    };
  }

  async findOne(searchObj) {
    const items = findHelper(this._database, searchObj, 1);
    if (items.length > 0) {
      return items[0];
    }
    return null;
  }
}

/**
 * Simulates the Node.js MongoDB API with an Immutable object.
 * 
 * Passing a name and fixture to the constructor will initialize a single
 * collection.
 */
export class DatabaseSimulator {
  constructor(name, fixture) {
    // The original state.
    this._resetFunctions = {};
    this._collections = {};

    if (name !== undefined) {
      return this.initializeCollection(name, fixture);
    }
  }

  async reset(name) {
    if (name === undefined) {
      // Reset all collections.
      for (const key of Object.keys(this._resetFunctions)) {
        await this._resetFunctions[key]();
      }
    } else {
      await this._resetFunctions[name]();
    }
  }

  /**
   * Create a new simulated collection in this database.
   * 
   * Will reurn a getter function that must be called to get the latest version
   * of the collection. After a reset, the old collection is discarded,
   * invalidating previous references.
   */
  initializeCollection(name, fixture) {
    // Add the following 'initialisation' to the reset procedure and execute it.
    this._resetFunctions[name] = async () => {
      // Create the collection and remember it.
      const collection = new DatabaseCollectionSimulator(name);
      this._collections[name] = collection;

      // Initialize it with the fixture.
      if (fixture === undefined) {
        fixture = [];
      }
      await collection.insertMany(fixture);
      // return getter, so we can discard collections whenever we want.
      return () => {
        return this._collections[name];
      };
    };

    return this._resetFunctions[name]();
  };

  collection(name) {
    return this._collections[name];
  }
}
