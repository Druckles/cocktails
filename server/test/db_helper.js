export const addFixture = db => collection => fixture => {
  return db.collection(collection).insertOne(fixture);
}
