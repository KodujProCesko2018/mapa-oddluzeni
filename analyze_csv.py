#!/usr/bin/env python
#coding=utf-8

import sys
from defs import *

insolvence = {}
osoby = {}

def parse_details(s):
    x = s.replace('ns2::', '').replace('udalost::', '').replace('vec::', '').replace('osoba::', '').replace('adresa::', '')
    x = s.replace('ns2:', '').replace('udalost:', '').replace('vec:', '').replace('osoba:', '').replace('adresa:', '')
    d = {}
    for x in x.split(';;'):
        if '::' in x.strip():
            a, b = x.strip().split('::', 1)
            d[a] = b
        elif ':' in x.strip():
            a, b = x.strip().split(':', 1)
            d[a] = b
    return d

def updobj(old, new):
    for k in new:
        if k not in old:
            old[k] = new[k]
        elif old[k] != new[k]:
            old[k] = new[k]

def complex_analysis():
    wrong_lines = 0
    d_start, d_end = {}, {}
    new_codes = {}

    for line in sys.stdin:
        columns = line.split('\t')
        if len(columns) == 7:
            i, kod, _, publish, ins, _, event, details = columns
        else:
            print >>sys.stderr, '### WRONG COLUMNS', line.strip()
            wrong_lines += 1
            continue
        publish = publish[:10]
        kod = int(kod)
        if kod not in KODY:
            if not kod in new_codes:
                new_codes[kod] = event
            akce = 'NEZNAMA AKCE'
        else:
            akce = KODY[kod]
        ins = ins[4:]
        if ins not in insolvence:
            insolvence[ins] = {
                'start': '',
                'end': '',
                'start_type': '',
                'end_type': '',
                'spravci': set([]),
                'veritele': set([]),
                'dluznici': set([]),
                'puvodci': set([])
            }
        insobj = insolvence[ins]
        d = parse_details(details)
        puvodce = d.get('idOsobyPuvodce', '')
        if puvodce:
            insobj['puvodci'].add(puvodce)
        # pocatek insolvence
        if kod in [174, 175]:
            d_start[y]
            insobj['start'] = publish
            insobj['start_type'] = kod
        # konec insolvence
        elif kod in [177, 178]:
            assert ins in insolvence
            insobj['end'] = publish
            insobj['end_type'] = kod
            #print 'KONEC', publish, kod, ins
        elif kod == 2:
            id = d.get('idOsoby')
            idadresy = d.get('idAdresy', '')
            ulice = d.get('ulice', '')
            mesto = d.get('mesto', '')
            zeme = d.get('zeme', '')
            psc = d.get('psc', '')
            cp = d.get('cislo_popisne', '')
            okres = d.get('okres', '')
            obj = {}
            if ulice: obj['ulice'] = ulice
            if mesto: obj['mesto'] = mesto
            if zeme: obj['zeme'] = zeme
            if psc: obj['psc'] = psc
            if cp: obj['cp'] = cp
            if okres: obj['okres'] = okres
            if idadresy: obj['idadresy'] = idadresy
            if not id in osoby:
                osoby[id] = obj
            else:
                updobj(osoby[id], obj)
        elif kod == 1:
            role = d.get('druhRoleVRizeni', '')
            druh = d.get('druhOsoby', '')
            nazev = d.get('nazevOsoby', 'NAZEV???')
            id = d.get('idOsoby', '')
            assert id
            ic = d.get('ic', '')
            rc = d.get('rc', '')
            try:
                rn = rc and int(rc[:2]) or 0
            except ValueError, e:
                rn = 0
                rc = ''
            if rn:
                rn = rn < 18 and 2000+rn or 1900+rn
                vek = 2018-rn
            else:
                vek = 0
            if rc:
                try:
                    sex = int(rc[2]) > 1 and "F" or "M"
                except ValueError:
                    print '### UNKNOWN SEX FROM RC:', rc
                    sex = '?'
            else:
                sex = '?'
            jmeno = d.get('jmeno', '')
            obj = {}
            if jmeno: obj['jmeno'] = jmeno
            if vek: obj['vek'] = vek
            if ic: obj['ic'] = ic
            obj['nazev'] = nazev
            obj['role'] = role and role[0] or '?'
            obj['druh'] = druh and druh[0] or '?'
            if not id in osoby:
                osoby[id] = {}
            else:
                updobj(osoby[id], obj)
            if role.startswith('D'):
                insobj['dluznici'].add(id)
            elif role.startswith('V'):
                insobj['veritele'].add(id)
            elif role.startswith('SPR'):
                insobj['spravci'].add(id)
            else:
                print 'UNKNOWN ROLE:', role
    
    # output statistics
    
    with open('year-start-end.csv', 'w') as yse:
        ds, de = {}, {}
        for ins in insolvence:
            e = insolvence[ins]['end']
            s = insolvence[ins]['start']
            if e:
                try:
                    y, m = int(e[:4]), int(e[5:7])
                    bj['nazev'] = nazev
                    de.setdefault(y, 0)
                    de[y] += 1
                except ValueError:
                    continue
            if s:
                try:
                    y, m = int(s[:4]), int(s[5:7])
                    ds.setdefault(y, 0)
                    ds[y] += 1
                except ValueError:
                    continue
        for k in sorted(ds.keys()):
            print >>yse, '%d,%d,%d' % (k, ds[k], de.get(k, -1))

    print >>sys.stderr, 'Wrong lines', wrong_lines
    print >>sys.stderr, 'New codes:'
    for nc in new_codes:
        print >>sys.stderr, '    %d: "%s",' % (nc, new_codes[nc])


def filtr():
    FILTR_KODY = [5, 6, 7, 18, 20, 72, 75, 82, 96, 104, 124, 166, 171, 172, 173, 174,
            175, 176, 177, 178, 181, 185, 410, 636]
    dluznici = {} # ins => [osoba1, osoba2, ...]
    typydluz = {} # id_osoby => typ
    data = {} # ins => seznam akcí
    for line in sys.stdin:
        columns = line.split('\t')
        if len(columns) == 7:
            _, kod, _, publish, ins, event, details = columns
        else:
            continue
        ins = ins[4:]
        d = parse_details(details)
        y = publish[:4]
        kod = int(kod)
        if kod == 1 and d.get('druhRoleVRizeni', '').startswith('DLU'):
            ido = d.get('idOsoby', '')
            if ido:
                typydluz[ido] = d.get('druhOsoby', '?')
                dluznici.setdefault(ins, set([])).add(ido)
        if kod in FILTR_KODY:
            data.setdefault(ins, {})
            data[ins][kod] =  (y, event)
    for ins in data:
        for k in data[ins]:
            print '%s,%d,%s,%s,%d,%s' % (ins, k, data[ins][k][0], data[ins][k][1], len(dluznici.get(ins, [])), ''.join([typydluz.get(x, '???') for x in dluznici.get(ins, [])]))


if __name__ == '__main__':
    if 'filtr' in sys.argv:
        filtr()
    else:
        complex_analysis()
