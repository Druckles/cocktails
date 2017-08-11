import { MongoClient } from 'mongodb';

const PRODUCTION_URI = 'mongodb://localhost:27017/cocktails';
const TEST_URI = 'mongodb://localhost:27017/test';

export const Mode = {
  PRODUCTION: 'production',
  TEST: 'test'
}

const state = {
  db: null,
  mode: null
}

export function db() {
  return state.db;
}

export async function connect(mode) {
  state.mode = mode;

  // Default to test database.
  const connectionUri = (mode === Mode.PRODUCTION)
    ? PRODUCTION_URI
    : TEST_URI;

  return MongoClient().connect(connectionUri).then(db => {
    state.db = db;
    return db;
  }).catch(error => {
    throw error;
  });
}

//! TODO disconnect function
