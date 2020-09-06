const knex = require('knex');
const app = require('../src/app');
const NotesService = require('../src/notes/notes-service');
const { makeNotesArray } = require('./notes.fixtures');
const supertest = require('supertest');

describe(`Notes service object`, function () {
  let db;

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });

    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('clean the table', () => db('noteful_notes').truncate());

  afterEach('cleanup', () => db('noteful_notes').truncate());

  describe(`Get /notes`, () => {
    context(`Given no notes`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app).get('/notes').expect(200, []);
      });

      it(`responds with 404`, () => {
        const noteId = 123456;
        return supertest(app)
          .get(`/notes/${noteId}`)
          .expect(404, {
            error: {
              message: `Note doesn't exist`,
            },
          });
      });
    });

    context('Given there are notes in the database', () => {
      const testNotes = makeNotesArray();

      beforeEach('insert notes', () => {
        return db.into('noteful_notes').insert(testNotes);
      });

      it('responds with 200 and all the notes', () => {
        return supertest(app).get('/notes').expect(200, testNotes);
      });
    });
  });

  describe(`GET /notes/:note_id`, () => {
    context('Given there are notes in the database', () => {
      const testNotes = makeNotesArray();

      beforeEach('insert notes', () => {
        return db.into('noteful_notes').insert(testNotes);
      });

      it('responds with 200 and the specified note', () => {
        const noteId = 2;
        const expectedNote = testNotes[noteId - 1];
        return supertest(app).get(`/notes/${noteId}`).expect(200, expectedNote);
      });
    });
  });
});
