import sqlite3
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

def getFromDB():
    con = sqlite3.connect('example.db')
    cur = con.cursor()
    #cur.execute('''CREATE TABLE tabulka
    #             (bcVec int, rocnik int, dateFrom text, dateTo text)''')
    #cur.execute("INSERT INTO tabulka VALUES (336,2008,'2006-01-05','2007-01-05')")
    #con.commit()
    cur.execute("SELECT * FROM `tabulka`")
    row = cur.fetchone()
    while row is not None:
        info = getInfo(row[0],row[1])
        print(info.psc)
        row = cur.fetchone()
    cur.close()
    con.close()

getFromDB()


