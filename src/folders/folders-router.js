const express = require('express');
const { v4: uuid } = require('uuid');
const logger = require('../logger');
const { folders, notes } = require('../store');

const foldersRouter = express.Router();
const bodyParser = express.json();

foldersRouter
  .route('/folders')
  .get((req, res) => {
    res.json(folders);
  })
  .post(bodyParser, (req, res) => {
    const { name } = req.body;

    if (!name) {
      logger.error(`Name is required`);
      return res.status(400).send('Invalid data');
    }

    const id = uuid();

    const folder = {
      id,
      name,
    };

    folders.push(folder);

    logger.info(`Folder with id ${id} created`);

    res.status(201).location(`http://localhost:800/folders/${id}`).json(folder);
  });

foldersRouter
  .route('/folders/:id')
  .get((req, res) => {
    const { id } = req.params;
    const folder = folders.find((f) => f.id == id);

    // make sure we found a card
    if (!folder) {
      logger.error(`Folder with id ${id} not found`);
      return res.status(404).send('Folder Not Found');
    }

    res.json(folder);
  })
  .delete((req, res) => {
    const { id } = req.params;

    const folderIndex = folders.findIndex((f) => f.id == id);

    if (folderIndex === -1) {
      logger.error(`Folder with id ${id} not found.`);
      return res.status(404).send('Not Found');
    }

    folders.splice(folderIndex, 1);

    logger.info(`Folder with id ${id} deleted.`);
    res.status(204).end();
  });

module.exports = foldersRouter;
