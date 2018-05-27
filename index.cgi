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
    root = ET.fromstring(response.text.encode('utf-8'))
    data = {}
    for child in root[0][0][0]:
        data[child.tag] = child.text#.encode('utf-8')
    return data

class Insolvence():
    def __init__(self):
        pass

    def default(self):
        return {'error': 'Unknown method'}

    def api1(self, dateFrom='2008-01-01', dateTo='2008-12-31', type='start'):
        if type not in ['start', 'end', 'active']:
            return {'error': 'Use type={start,end,active}'}
        conIn = sqlite3.connect('input.db')
        curIn = conIn.cursor()
        print >>sys.stderr, type, dateFrom, dateTo
        if type == 'start':
            q = 'SELECT * FROM insolvence WHERE (date1 BETWEEN "%s" AND "%s")' % (dateFrom, dateTo)
            q += ' AND (date1 NOT LIKE "%?%");'
        elif type == 'active':
            q = "SELECT * FROM insolvence WHERE date1 < '%s' AND date2 > '%s';" % (dateTo, dateTo)
        else:
            q = 'SELECT * FROM insolvence WHERE date2 BETWEEN "%s" AND "%s"' % (dateFrom, dateTo)
            q += ' AND date2 NOT LIKE "%?%";'
        r = curIn.execute(q)
        result = []
        for row in r.fetchall():
            result.append({
                'ins': row[1],
                'date1': row[2],
                'code1': row[3],
                'date2': row[4],
                'code2': row[5]
            })
        curIn.close()
        conIn.close()
        return {'data': result, 'records': len(result)}

    def getFromDB(self, dateFrom, dateTo):
        conIn = sqlite3.connect('input.db',detect_types=sqlite3.PARSE_DECLTYPES)
        curIn = conIn.cursor()
        sqlQuery = "SELECT * FROM `tabulka` WHERE dateFrom > date('%s') AND dateTo < date('%s')" %(dateFrom,dateTo)
        curIn.execute(sqlQuery)
        row = curIn.fetchone()
        result = []
        while row is not None:
            result.append(getInfo(row[0],row[1]))
            row = curIn.fetchone()
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
