import sqlite3
from datetime import datetime, date
import requests
import xml.etree.cElementTree as ET
import json
import csv
from xml.etree.ElementTree import ParseError as PE

def getInfo(bcVec,rocnik,sqlfile):
    response = requests.get('https://vitek.baisa.net/insolvence/soap2.cgi?bcVec=%s&rocnik=%s' %(bcVec,rocnik), auth=('insolv', 'bankrot'))
    try: 
        root = ET.fromstring(response.text)
        data = {}
        for child in root[0][0][0]:
            data[child.tag] = child.text
    except PE: return {}

    if "kodChyby" not in data:
        rc = data.get('rc',"-1").replace("/","").replace("-","")
        rok = data.get('datumNarozeni',"-1")[:4]
        psc = data.get('psc',"-1").replace(" ","")
        try: int(psc)
        except ValueError: psc = "-1"

        tab = sqlfile.name[4:-4]
        #"CREATE TABLE rokXXXX (insNum text, rc int, jmeno text, prijmeni text, rokNarozeni int, mesto text, soud text, psc int)"
        line = "INSERT INTO `%s` VALUES ('%s', %d, '%s', '%s', %d, '%s', '%s', %d);\n" %(tab, bcVec + "/" + rocnik, int(rc), data.get('jmeno',""), data.get('nazevOsoby',""), int(rok), data.get('mesto',""), data.get('nazevOrganizace',""), int(psc) )
        sqlfile.write(line.encode('utf8'))
    return data

def getFromDB(dateFrom, dateTo):
    con = sqlite3.connect('input.db',detect_types=sqlite3.PARSE_DECLTYPES)
    cur = con.cursor()
    cur.execute("SELECT * FROM `tabulka` WHERE dateFrom > date('%s') AND dateTo < date('%s')" %(dateFrom,dateTo))
    row = cur.fetchone()
    with open('sql/rok2016.sql', 'wb') as sqlfile:
        while row is not None:
            info = getInfo(row[0],row[1],sqlfile)
            print(info['psc'])
            row = cur.fetchone()
    cur.close()
    con.close()

#getFromDB('2006-01-01','2006-12-31')
#getFromDB('2007-01-01','2007-12-31')
#getFromDB('2008-01-01','2008-12-31')
#getFromDB('2009-01-01','2009-12-31')
#getFromDB('2010-01-01','2010-12-31')
#getFromDB('2011-01-01','2011-12-31')
#getFromDB('2012-01-01','2012-12-31')
#getFromDB('2013-01-01','2013-12-31')
#getFromDB('2014-01-01','2014-12-31')
#getFromDB('2015-01-01','2015-12-31')
#getFromDB('2016-01-01','2016-12-31')
#getFromDB('2017-01-01','2017-12-31')
#getFromDB('2018-01-01','2018-12-31')


def getFromCSV():
    with open('data/isr_data_oddluzeni.1.csv', newline='') as csvfile:
        spamreader = csv.reader(csvfile, delimiter=' ', quotechar='|')
        with open('sql/rok2018.sql', 'wb') as sqlfile: 
            line = "CREATE TABLE `%s` (insNum text, rc int, jmeno text, prijmeni text, rokNarozeni int, mesto text, soud text, psc int)\n" %(sqlfile.name[4:-4])
            sqlfile.write(line.encode('utf8'))
            for row in spamreader:
                split = row[1].split("/")
                getInfo(split[0],split[1],sqlfile)

#getFromCSV()

def getFromWS(endDate):
    response = requests.get('http://vitek.baisa.net/insolvence/index.cgi/api1?&dateTo=%s&type=active' %(endDate), auth=('insolv', 'bankrot'))
    json = response.json()
    with open('sql/rok2017.sql', 'ab') as sqlfile:
        line = "CREATE TABLE `%s` (insNum text, rc int, jmeno text, prijmeni text, rokNarozeni int, mesto text, soud text, psc int)\n" %(sqlfile.name[4:-4])
        sqlfile.write(line.encode('utf8'))
        for x in json['data'][77750:]:
            split = x['ins'].split("/")
            getInfo(split[0],split[1],sqlfile)

getFromWS('2017-12-31')
