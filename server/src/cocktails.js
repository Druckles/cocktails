import { ObjectID } from 'mongodb';

// Check the given thing is an ID. Throws an error if not.
function assertIsId(id) {
  if (!ObjectID.isValid(id)) {
    throw {
      message: 'Invalid ID.',
      code: 404,
    };
  }
}

export class CocktailManager {

  constructor(db, options) {
    this.db = db;
    this.options = Object.assign({}, options);
  }

  // Get the slug name for a given cocktail.
  getSlugName(cocktail) {
    return cocktail.name
      .toLowerCase()
      // Trim at start and end.
      .replace(/^[\s_]+/, '')
      .replace(/[\s_]+$/, '')
      // Remove characters we don't want.
      .replace(/[^\w-\s]/g, '')
      // Treat underscores like spaces.
      .replace(/_/g, ' ')
      // Replace first letter of every word with a capital. jim-bob => Jim-Bob.
      .replace(/\b\w/g, letter => letter.toUpperCase())
      // Replace multiple spaces with a single underscore. E.g. '   ' => '_'.
      .replace(/\s+/g, '_')
      // Remove duplicate spaces.
      .replace(/_+/g, '_');
  }

  // Return all cocktails that start with the given name.
  async filterByName(term) {
    return this.db.collection('drinks').find({
      name: {
        $regex: new RegExp('^' + RegExp.escape(term)),
        $options: 'i'
      }
    }).toArray();
  }

  // Get all cocktails.
  async findAll() {
    return this.db.collection('drinks').find().toArray();
  }

  // Get a cocktail using ID.
  async findById(id) {
    assertIsId(id);
    return this.db.collection('drinks').findOne({_id: ObjectID(id)});
  }

  async findBySlug(slug) {
    return this.db.collection('drinks').findOne({slug});
  }

  // Insert a cocktail using an object.
  async insertOne(cocktail) {
    const cocktailToInsert = Object.assign({}, cocktail, {
      slug: this.getSlugName(cocktail)
    });
    return new Promise((resolve, reject) => {
      this.db.collection('drinks').insertOne(cocktailToInsert,
          (error, doc) => {
        if (error) {
          return reject(error);
        }
        resolve(doc.ops[0]);
      });
    });
  }

  // Update the cocktail at ID with the given object.
  async update(id, cocktail) {
    return this.db.collection('drinks').update({_id: ObjectID(id)},
        cocktail);
  }

  async remove(id) {
    assertIsId(id);
    return this.db.collection('drinks').remove({_id: ObjectID(id)});
  }

}
