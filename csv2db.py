#!/usr/bin/env python
#coding=utf-8

import sys
import sqlite3

meta = ["idOsobyPuvodce", "druhStavRizeni", "nazevOsoby", "idOsoby",
        "druhRoleVRizeni", "druhOsoby", "jmeno", "rc", "datumPobytOd",
        "adresa", "psc", "mesto", "idAdresy", "cisloPopisne", "ulice",
        "datumNarozeni", "ic", "druhPravniForma", "titulPred", "okres", "zeme",
        "druhSpravce", "nazevOsobyObchodni", "priznakAnInterniCisUdalost",
        "popisCisUdalosti", "datumZalozeniCisUdalosti", "cisUdalost",
        "telefon", "fax", "datumZruseniCisUdalosti"]

ins_list = {}

def parse_details(str):
    x = str.replace('ns2:', '').replace('udalost:', '').replace('vec:', '').replace('osoba:', '')
    d = dict([(x.split(':', 1)[0], x.split(':', 1)[1]) for x in x.split(';;') if x.strip()])
    o = {}
    for m in meta:
        v = d.get(m, '')
        if v:
            o[m] = v
    return o

for line in sys.stdin:
    try:
        i, kod, _, publish, ins, _, event, details = line.split('\t')
    except ValueError:
        continue
    publish = publish[:10]
    kod = int(kod)
    ins = ins[4:]
    if kod in [174, 175, 177, 178]:
        # pocatek insolvence
        if kod in [174, 175]:
            # store the last event with this code
            ins_list[ins] = {
                'ins_start': publish,
                'kod_start': kod
            }
        # konec insolvence
        if kod in [177, 178]:
            if ins in ins_list:
                ins_list[ins]['ins_end'] = publish
                ins_list[ins]['kod_end'] = kod

for ins in ins_list:
    print "INSERT INTO insolvence (ins, date1, code1, date2, code2) VALUES ('%s', '%s', %d, '%s', %d);" %\
            (ins, ins_list[ins].get('ins_start', '????-??-??'),
            ins_list[ins].get('kod_start', -1),
            ins_list[ins].get('ins_end', '????-??-??'),
            ins_list[ins].get('kod_end', -1))
