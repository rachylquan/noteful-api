const express = require('express');
const { v4: uuid } = require('uuid');
const logger = require('../logger');
const { folders, notes } = require('../store');

const notesRouter = express.Router();
const bodyParser = express.json();

notesRouter
  .route('/notes')
  .get((req, res) => {
    res.json(notes);
  })
  .post(bodyParser, (req, res) => {
    const { name, modified, folderId, content } = req.body;

    if (!name) {
      logger.error(`Name is required`);
      return res.status(400).send('Invalid data');
    }

    if (!modified) {
      logger.error(`Modified is required`);
      return res.status(400).send('Invalid data');
    }

    if (!folderId) {
      logger.error(`FolderId is required`);
      return res.status(400).send('Invalid data');
    }

    if (!content) {
      logger.error(`Content is required`);
      return res.status(400).send('Invalid data');
    }

    const id = uuid();

    const note = {
      id,
      name,
      modified,
      folderId,
      content,
    };

    notes.push(note);

    logger.info(`Note with id ${id} created`);

    res.status(201).location(`http://localhost:800/notes/${id}`).json(note);
  });

notesRouter
  .route('/notes/:id')
  .get((req, res) => {
    const { id } = req.params;
    const note = notes.find((n) => n.id == id);

    // make sure note is found
    if (!note) {
      logger.error(`Note with id ${id} not found.`);
      return res.status(404).send('Note Not Found');
    }

    res.json(note);
  })
  .delete((req, res) => {
    const { id } = req.params;

    const noteIndex = notes.findIndex((n) => n.id == id);

    if (noteIndex === -1) {
      logger.error(`Note with id ${id} not found.`);
      return res.status(404).send('Not Found');
    }

    notes.splice(noteIndex, 1);

    logger.info(`Note with ${id} deleted.`);
    res.status(204).end();
  });

module.exports = notesRouter;
