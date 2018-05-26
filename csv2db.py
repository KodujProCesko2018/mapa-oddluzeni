#!/usr/bin/env python
#coding=utf-8

import sys
import sqlite3

for line in sys.stdin:
    try:
        i, kod, od, do, ins, _, event, details = line.split('\t')
    except ValueError:
        continue
    if int(kod) in [174, 175]:
        details = details.replace('ns2:', '').replace('udalost:', '').replace('vec:', '')
        #print 'DETAILS:', details
        d = {}
        for x in details.split(';;'):
            if x.strip():
                a, b = x.split(':', 1)
                d[a] = b
        print kod, d.get('nazevOsoby', 'NAZEV_OSOBY'), d.get('idOsobyPuvodce', 'SOUDXXX')
