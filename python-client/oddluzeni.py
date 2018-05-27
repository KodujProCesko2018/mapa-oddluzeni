import sqlite3
from datetime import datetime, date
import requests
import xml.etree.cElementTree as ET
import json
import csv


def getInfo(bcVec,rocnik,sqlfile):
    response = requests.get('https://vitek.baisa.net/insolvence/soap2.cgi?bcVec=%s&rocnik=%s' %(bcVec,rocnik), auth=('insolv', 'bankrot'))
    root = ET.fromstring(response.text)
    data = {}
    for child in root[0][0][0]:
        data[child.tag] = child.text

    if "kodChyby" not in data:
        rc = data.get('rc',"-1").replace("/","")
        rok = data.get('datumNarozeni',"-1")[:4]
        psc = data.get('psc',"-1").replace(" ","")
        tab = sqlfile.name[:-4]
        #"CREATE TABLE rokXXXX (insNum text, rc int, jmeno text, prijmeni text, rokNarozeni int, mesto text, soud text, psc int)"
        line = "INSERT INTO %s VALUES ('%s', %d, '%s', '%s', %d, '%s', '%s', %d);\n" %(tab, bcVec + "/" + rocnik, int(rc), data.get('jmeno',""), data.get('nazevOsoby',""), int(rok), data.get('mesto',""), data.get('nazevOrganizace',""), int(psc) )
        sqlfile.write(line.encode('utf8'))
    return data

def getFromDB(dateFrom, dateTo):
    con = sqlite3.connect('input.db',detect_types=sqlite3.PARSE_DECLTYPES)
    cur = con.cursor()
    cur.execute("SELECT * FROM `tabulka` WHERE dateFrom > date('%s') AND dateTo < date('%s')" %(dateFrom,dateTo))
    row = cur.fetchone()
    with open('sql/rok2018.sql', 'wb') as sqlfile:
        while row is not None:
            info = getInfo(row[0],row[1],sqlfile)
            print(info['psc'])
            row = cur.fetchone()
    cur.close()
    con.close()

#getFromDB('2006-01-01','2007-12-31')
def getFromCSV():
    #data = []
    with open('data/isr_data_oddluzeni.1.csv', newline='') as csvfile:
        spamreader = csv.reader(csvfile, delimiter=' ', quotechar='|')
        with open('sql/rok2018.sql', 'wb') as sqlfile: 
            for row in spamreader:
                split = row[1].split("/")
                #data.append(getInfo(split[0],split[1]))
                #print(getInfo(split[0],split[1]))
                getInfo(split[0],split[1],sqlfile)
    #print(data)

getFromCSV()
