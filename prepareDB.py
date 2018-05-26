import sqlite3

conIn = sqlite3.connect('input.db',detect_types=sqlite3.PARSE_DECLTYPES)
curIn = conIn.cursor()
curIn.execute("CREATE TABLE tabulka (bcVec int, rocnik int, dateFrom date, dateTo date)")
curIn.execute("INSERT INTO tabulka VALUES (336, 2008,'2006-01-05','2007-01-05')")
curIn.execute("INSERT INTO tabulka VALUES (337, 2008,'2007-01-05','2008-01-05')")
conIn.commit()


conOut = sqlite3.connect('output.db',detect_types=sqlite3.PARSE_DECLTYPES)
curOut = conOut.cursor()
for year in range(2008, 2020):
    curOut.execute("CREATE TABLE rok%s (rc int, jmeno text, prijmeni text, rokNarozeni int, mesto text, okres text, psc int)" %(str(year)))
conOut.commit()
