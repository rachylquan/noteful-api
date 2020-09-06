const knex = require('knex');
const app = require('../src/app');
const FoldersService = require('../src/folders/folders-service');

describe(`Folders service object`, function () {
  let db;

  let testFolders = [
    {
      id: 1,
      name: 'Important',
    },
    {
      id: 2,
      name: 'Super',
    },
    {
      id: 3,
      name: 'Spangley',
    },
  ];

  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
  });

  before(() => db('noteful_folders').truncate());

  afterEach(() => db('noteful_folders').truncate());

  after(() => db.destroy());

  context(`Given 'noteful_folders' has data`, () => {
    beforeEach(() => {
      return db.into('noteful_folders').insert(testFolders);
    });

    it(`getAllFolders() resolves all folders from 'noteful_folders' table`, () => {
      return FoldersService.getAllFolders(db).then((actual) => {
        expect(actual).to.eql(testFolders);
      });
    });

    it(`getById() resolves a folder by id from 'noteful_folders' table`, () => {
      const thirdId = 3;
      const thirdTestFolder = testFolders[thirdId - 1];
      return FoldersService.getById(db, thirdId).then((actual) => {
        expect(actual).to.eql({
          id: thirdId,
          name: thirdTestFolder.name,
        });
      });
    });

    it(`deleteFolder() removes an folder by id from 'noteful_folders' table`, () => {
      const folderId = 3;
      return FoldersService.deleteFolder(db, folderId)
        .then(() => FoldersService.getAllFolders(db))
        .then((allFolders) => {
          // copy the test folders array without the "deleted" folder
          const expected = testFolders.filter(
            (folder) => folder.id !== folderId
          );
          expect(allFolders).to.eql(expected);
        });
    });

    it(`updateFolder() updates an folder from the 'noteful_folders' table`, () => {
      const idOfFolderToUpdate = 3;
      const newFolderData = {
        name: 'updated name',
      };
      return FoldersService.updateFolder(db, idOfFolderToUpdate, newFolderData)
        .then(() => FoldersService.getById(db, idOfFolderToUpdate))
        .then((folder) => {
          expect(folder).to.eql({
            id: idOfFolderToUpdate,
            ...newFolderData,
          });
        });
    });
  });

  context(`Given 'noteful_folders' has no data`, () => {
    it(`getAllFolders() resolves an empty array`, () => {
      return FoldersService.getAllFolders(db).then((actual) => {
        expect(actual).to.eql([]);
      });
    });

    it(`insertFolder() inserts a new folder and resolves the new folder with an 'id'`, () => {
      const newFolder = {
        name: 'Test new name',
      };

      return FoldersService.insertFolder(db, newFolder).then((actual) => {
        expect(actual).to.eql({
          id: 1,
          name: newFolder.name,
        });
      });
    });
  });
});
