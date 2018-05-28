#!/usr/bin/env python

import json
import sqlite3
import requests

conn = sqlite3.connect('/var/www/baisa.net/vitek/insolvence/insolvence.db')
cursor = conn.cursor()

geojson = {
    'obec': requests.get('http://mapaexekuci.cz/mapa/obce.geojson').json(),
    'kraj': requests.get('http://mapaexekuci.cz/mapa/kraje.geojson').json(),
    'okres': requests.get('http://mapaexekuci.cz/mapa/okresy.geojson').json()
}

for y in range(2008, 2011):
    # kraj
    q = """select nazev_kraj, COUNT(rc) from (select DISTINCT nazev_kraj, rc
    FROM rok%d LEFT OUTER JOIN ruian ON ruian.psc = CAST(rok%d.psc AS TEXT)
    WHERE ruian.psc > 0) group by nazev_kraj;""" % (y, y)
    r = cursor.execute(q)
    d = {}
    for row in r.fetchall():
        nazev, pocet = row[0], row[1]
        d[nazev] = pocet
    for item in geojson['kraj']['features']:
        if item['properties']['k'] in d:
            item['properties']['poi' + str(y)[2:]] = d[item['properties']['k']]
    # okres
    q = """select nazev_okres, COUNT(rc) from (select DISTINCT nazev_okres, rc
    FROM rok%d LEFT OUTER JOIN ruian ON ruian.psc = CAST(rok%d.psc AS TEXT)
    WHERE ruian.psc > 0) group by nazev_okres;""" % (y, y)
    r = cursor.execute(q)
    d = {}
    for row in r.fetchall():
        nazev, pocet = row[0], row[1]
        d[nazev] = pocet
    for item in geojson['okres']['features']:
        if item['properties']['r'] in d:
            item['properties']['poi' + str(y)[2:]] = d[item['properties']['r']]
        else:
            item['properties']['poi' + str(y)[2:]] = 0
    # obec
    q = """select nazev_obec, nazev_okres, kod_obec, COUNT(rc) from (select
    DISTINCT kod_obec, nazev_okres, nazev_obec, ruian.psc, rc FROM rok%d LEFT
    OUTER JOIN ruian ON ruian.psc = CAST(rok%d.psc AS TEXT) AND
    ruian.nazev_obec = rok%d.mesto WHERE ruian.psc > 0) group by kod_obec;""" % (y, y, y)
    r = cursor.execute(q)
    d = {}
    for row in r.fetchall():
        kod_obec, pocet = row[2], row[3]
        d[kod_obec] = pocet
    for item in geojson['obec']['features']:
        if item['properties']['i'] in d:
            item['properties']['poi' + str(y)[2:]] = d[item['properties']['i']]
        else:
            item['properties']['poi' + str(y)[2:]] = 0

json.dump(geojson['kraj'], open('json/kraje_2008_2010.geojson', 'w'))
json.dump(geojson['okres'], open('json/okresy_2008_2010.geojson', 'w'))
json.dump(geojson['obec'], open('json/obce_2008_2010.geojson', 'w'))
