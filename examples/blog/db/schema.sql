SET SESSION TIME ZONE 'UTC';

DROP TABLE IF EXISTS blog;

CREATE TABLE blog (
    id varchar NOT NULL primary key,
    title varchar NOT NULL,
    content varchar,
    "createdBy" varchar NOT NULL,
    "createdDate" timestamptz NOT NULL
);
