#!/usr/bin/python
#coding=utf-8

import os
import sys
import cgi
import json
import sqlite3
import requests
import xml.etree.cElementTree as ET
import json

def getInfo(bcVec,rocnik):
    response = requests.get('https://vitek.baisa.net/insolvence/soap2.cgi?bcVec=%s&rocnik=%s' %(bcVec,rocnik), auth=('insolv', 'bankrot'))
    root = ET.fromstring(response.text)
    data = {}
    for child in root[0][0][0]:
        data[child.tag] = child.text
    return data

class Insolvence():
    def __init__(self):
        pass

    def default(self):
        return {'error': 'Unknown method'}

    def api1(self, od='20080101', do='20082131', udalost='in'):
        return {'data': [{'rc': 'XYZ', 'name': 'ABC DEF'}]}

    def getFromDB(self, dateFrom, dateTo):
        conIn = sqlite3.connect('input.db',detect_types=sqlite3.PARSE_DECLTYPES)
        curIn = conIn.cursor()
        sqlQuery = "SELECT * FROM `tabulka` WHERE dateFrom > date('%s') AND dateTo < date('%s')" %(dateFrom,dateTo)
        curIn.execute(sqlQuery)
        row = curIn.fetchone()
        result = []
        while row is not None:
            result.append(getInfo(row[0],row[1]))
            row = cur.fetchone()
        curIn.close()
        conIn.close()
        return result

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