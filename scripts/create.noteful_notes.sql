DROP TABLE IF EXISTS noteful_notes;

CREATE TABLE noteful_notes (
  id INTEGER primary key generated by default as identity,
  name TEXT NOT NULL,
  modified TIMESTAMPTZ DEFAULT now() NOT NULL,
  content TEXT
);

INSERT INTO noteful_notes (name, modified, content)
VALUES
  ('Note 1', '2016-01-16 12:00:00', 'Content for note 1'),
  ('Note 2', '2017-04-04 08:00:00', 'Content for note 2'),
  ('Note 3', '2019-05-05 21:00:00', '');