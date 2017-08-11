import { connect, Mode as DbMode } from './data.js';
import { ObjectID } from 'mongodb';

let db = null;
connect(DbMode.PRODUCTION).then(result => {
  db = result;
});

// Check the given thing is an ID. Throws an error if not.
function assertIsId(id) {
  if (!ObjectID.isValid(id)) {
    throw {
      message: 'Invalid ID.',
      code: 404,
    };
  }
}

// Return all cocktails that start with the given name.
export async function filterByName(term) {
  return db.collection('drinks').find({
    name: {
      $regex: new RegExp('^' + RegExp.escape(term)),
      $options: 'i'
    }
  }).toArray();
}

export async function findAll() {
  return db.collection('drinks').find().toArray();
}

export async function findById(id) {
  assertIsId(id);
  return db.collection('drinks').findOne({_id: ObjectID(id)});
}

export async function insertOne(cocktail) {
  return new Promise((resolve, reject) => {
    db.collection('drinks').insertOne(cocktail, (error, doc) => {
      if (error) {
        return reject(error);
      }
      resolve(doc.ops[0]);
    });
  });
}

export async function update(id, cocktail) {
  return db.collection('drinks').update({_id: ObjectID(id)}, cocktail);
}

export async function remove(id) {
  assertIsId(id);
  return db.collection('drinks').remove({_id: ObjectID(id)});
}
