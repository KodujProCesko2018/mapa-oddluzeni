import sqlite3
from datetime import datetime, date
import zeep

class Info:
    nazevOrganizace = ""
    datumNarozeni = ""
    jmeno = ""
    prijemni = ""
    mesto = ""
    okres = ""
    psc = ""

def getInfo(bcVec,rocnik):
    wsdl = 'https://isir.justice.cz:8443/isir_cuzk_ws/IsirWsCuzkService?wsdl'
    client = zeep.Client(wsdl=wsdl)
    response = client.service.getIsirWsCuzkData(bcVec=bcVec,rocnik=rocnik)
    info = Info() 
    info.nazevOrganizace = response['data'][0]['nazevOrganizace']
    info.datumNarozeni = response['data'][0]['datumNarozeni']
    info.jmeno = response['data'][0]['jmeno']
    info.prijemni = response['data'][0]['nazevOsoby']
    info.mesto = response['data'][0]['mesto']
    info.okres = response['data'][0]['okres']
    info.psc = response['data'][0]['psc']
    return info

def getFromDB(dateFrom, dateTo):
    con = sqlite3.connect('example.db',detect_types=sqlite3.PARSE_DECLTYPES)
    cur = con.cursor()
    #cur.execute('''CREATE TABLE tabulka
    #             (bcVec int, rocnik int, dateFrom date, dateTo date)''')
    #cur.execute("INSERT INTO tabulka VALUES (336,2008,'2006-01-05','2007-01-05')")
    #cur.execute("INSERT INTO tabulka VALUES (337,2008,'2007-01-05','2008-01-05')")
    #con.commit()
    cur.execute("SELECT * FROM `tabulka` WHERE dateFrom > date('%s') AND dateTo < date('%s')" %(dateFrom,dateTo))
    #cur.execute("SELECT " + dateFrom + " FROM `tabulka`")
    row = cur.fetchone()
    while row is not None:
        print(row[2])
        #info = getInfo(row[0],row[1])
        #print(info.psc)
        row = cur.fetchone()
    cur.close()
    con.close()

getFromDB('2006-01-01','2007-12-31')


