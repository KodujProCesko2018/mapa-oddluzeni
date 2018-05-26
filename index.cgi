#!/usr/bin/env python
#coding=utf-8

import os
import sys
import cgi
import json
import sqlite3

class Insolvence():
    def __init__(self):
        pass

    def default(self):
        return {'error': 'Unknown method'}

    def api1(self, od='20080101', do='20082131', udalost='in'):
        return {'data': [{'rc': 'XYZ', 'name': 'ABC DEF'}]}

    def getFromDB(self, dateFrom, dateTo, tableName):
        conIn = sqlite3.connect('input.db',detect_types=sqlite3.PARSE_DECLTYPES)
        curIn = conIn.cursor()
        curIn.execute("SELECT * FROM `tabulka` WHERE dateFrom > date('%s') AND dateTo < date('%s')" %(dateFrom,dateTo))
        row = curIn.fetchone()
        while row is not None:
            info = getInfo(row[0],row[1])
            row = cur.fetchone()
        curIn.close()
        conIn.close()

    def serve(self):
        form = cgi.FieldStorage()
        parse_url = os.getenv('PATH_INFO', '').strip().split('/')
        sys.stdout.write('Content-Type: application/json; charset=utf-8\n\n')
        if len(parse_url) > 1:
            methodname = parse_url[1]
            method = getattr(self, methodname, self.default)
            parameters = dict([(k, form.getvalue(k)) for k in form])
            response = apply(method, [], parameters)
            sys.stdout.write(json.dumps(response) + '\n')
        else:
            sys.stdout.write(json.dumps({'error': 'URL parse error'}))

if __name__ == '__main__':
    Insolvence().serve()

def getInfo(bcVec,rocnik):
    wsdl = 'https://isir.justice.cz:8443/isir_cuzk_ws/IsirWsCuzkService?wsdl'
    client = zeep.Client(wsdl=wsdl)
    response = client.service.getIsirWsCuzkData(bcVec=bcVec,rocnik=rocnik)
    writeInfo(response,rocnik)

def writeInfo(response,rocnik):
    conOut = sqlite3.connect('output.db',detect_types=sqlite3.PARSE_DECLTYPES)
    curOut = conOut.cursor()
    rc = response['data'][0]['rc'].replace("/", "")
    curIn.execute('''INSERT INTO rok%s (rc, jmeno, prijmeni, rokNarozeni, mesto, okres, psc)
                        VALUES (%s, %s, %s, %s, %s, %s, %s)''' 
                        %(rocnik, rc, response['data'][0]['jmeno'], response['data'][0]['nazevOsoby'], response['data'][0]['datumNarozeni'], response['data'][0]['mesto'], response['data'][0]['okres'], response['data'][0]['psc']))
