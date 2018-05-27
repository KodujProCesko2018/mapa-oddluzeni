CREATE TABLE insolvence (
    id      INTEGER PRIMARY KEY,
    ins     CHAR(10) NOT NULL UNIQUE,
    date1   DATE,
    code1   INTEGER,
    date2   DATE,
    code2   INTEGER
);
