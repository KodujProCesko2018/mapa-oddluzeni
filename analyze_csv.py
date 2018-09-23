#!/usr/bin/env python
#coding=utf-8

import sys
from defs import *

insolvence = {}
osoby = {}

def parse_details(s, old=False):
    if old:
        x = s.replace('ns2:', '').replace('udalost:', '').replace('vec:', '').replace('osoba:', '').replace('adresa:', '')
        d = dict([(x.split(':', 1)[0], x.split(':', 1)[1]) for x in x.split(';;') if x.strip()])
    else:
        x = s.replace('ns2::', '').replace('udalost::', '').replace('vec::', '').replace('osoba::', '').replace('adresa::', '')
        d = dict([(x.split('::', 1)[0], x.split('::', 1)[1]) for x in x.split(';;') if x.strip()])
    o = {}
    for m in META:
        v = d.get(m, '')
        if v:
            o[m] = v
    return o

def updobj(old, new):
    for k in new:
        if k not in old:
            old[k] = new[k]
        elif old[k] != new[k]:
            old[k] = new[k]

wrong_lines = 0
kody_zacatek = [174, 175]
kody_konec = [177, 178]

year_konce = {}
year_month_konce = {}

for line in sys.stdin:
    columns = line.split('\t')
    old = False
    if len(columns) == 8:
        i, kod, _, publish, ins, _, event, details = columns
        old = True
    elif len(columns) == 6:
        i, kod, _, publish, ins, details = columns
    else:
        wrong_lines += 1
        continue
    publish = publish[:10]
    kod = int(kod)
    akce = KODY.get(kod, '???NEZNAMA AKCE???')
    ins = ins[4:]
    y, m = publish[:7].split('-')
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
    d = parse_details(details, old)
    puvodce = d.get('idOsobyPuvodce', '')
    if puvodce:
        insobj['puvodci'].add(puvodce)

    # pocatek insolvence
    if kod in [174, 175]:
        insobj['start'] = publish
        insobj['start_type'] = kod
        print "START", publish, kod, ins
    # konec insolvence
    elif kod in [177, 178]:
        assert ins in insolvence
        insobj['end'] = publish
        insobj['end_type'] = kod
        print 'KONEC', publish, kod, ins, d
        year_konce.setdefault(y, []).append(insobj)
        year_month_konce.setdefault((y, m), []).append(insobj)
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
        rn = rc and int(rc[:2]) or 0
        if rn:
            rn = rn < 18 and 2000+rn or 1900+rn
            vek = 2018-rn
        else:
            vek = 0
        if rc:
            sex = int(rc[2]) > 1 and "F" or "M"
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
            raise Exception('ROLE?' + role + ins)
    elif kod in [4, 5, 184]:
        # ignore
        continue
    #else:
        #if len(d.keys()) > 2:
            #print kod, akce, d

for ins in insolvence:
    print ins, insolvence[ins]

print '='*60

for os in osoby:
    print os, osoby[os]

print 'Wrong lines', wrong_lines
