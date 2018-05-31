#!/usr/bin/env python
#coding=utf-8

import sys

meta = ["idOsobyPuvodce", "druhStavRizeni", "nazevOsoby", "idOsoby",
        "druhRoleVRizeni", "druhOsoby", "jmeno", "rc", "datumPobytOd",
        "adresa", "psc", "mesto", "idAdresy", "cisloPopisne", "ulice",
        "datumNarozeni", "ic", "druhPravniForma", "titulPred", "okres", "zeme",
        "druhSpravce", "nazevOsobyObchodni", "priznakAnInterniCisUdalost",
        "popisCisUdalosti", "datumZalozeniCisUdalosti", "cisUdalost",
        "telefon", "fax", "datumZruseniCisUdalosti",
        "priznakAnVedlejsiUdalost",
        "priznakAnVedlejsiDokument", "datumPravniMoci", "bcVecHlavni",
        "druhVecHlavni", "rocnikHlavni", "datumSpojeni",
        "priznakMylnyZapisVeritelPohled",
        "priznakPlatnyVeritel", "datumOddeleni",
        "datumZverejneniOpraveneUdalosti",
        "datumOsobaVeVeciZrusena", "titulZa", "dic", "datumUstanoveniSpravce"]

# CCA = asi admini,
idOsobyPuvodce = "KSSTCAB,KSSCEUL,KSZPCPM,KSJIMBM,MSPHAAB,KSSEMOS,KSJICCB,KSVYCHK".split(',')
mapaSoudu = {
    'KSJIMBM': 'Krajský soud v Brně',
    'KSJICCB': 'Krajský soud v Českých Budějovicích',
    'KSVYCHK': 'Krajský soud v Hradci Králové',
    'KSVYCPA': 'Krajský soud v Hradci Králové pobočka Pardubice',
    'KSSEMOS': 'Krajský soud v Ostravě',
    'KSSEMOC': 'Krajský soud v Ostravě pobočka Olomouc',
    'KSZPCPM': 'Krajský soud v Plzni',
    'KSSTCAB': 'Krajský soud v Praze',
    'KSSCEUL': 'Krajský soud v Ústí nad Labem',
    'KSSCELB': 'Krajský soud v Ústí nad Labem pobočka Liberec'
}
druhStavRizeni = "KONKURS,VYRIZENA,OBZIVLA,ZRUŠENO VS,ODDLUŽENÍ,MORATORIUM,ODSKRTNUTA,PRAVOMOCNA,NEVYRIZENA,MYLNÝ ZÁP.,ÚPADEK".split(',')

def parse_details(str):
    x = str.replace('ns2:', '').replace('udalost:', '').replace('vec:', '').replace('osoba:', '')
    d = dict([(x.split(':', 1)[0], x.split(':', 1)[1]) for x in x.split(';;') if x.strip()])
    o = {}
    for m in meta:
        v = d.get(m, '')
        if v:
            o[m] = v
    return o

def monthly_codes(codes=[174,175,177,178]):
    d = {}
    for line in sys.stdin:
        try:
            i, kod, _, publish, ins, _, event, details = line.split('\t')
            det = parse_details(details)
        except ValueError:
            continue
        y, m = publish[:7].split('-')
        ym = (int(y), int(m))
        kod = int(kod)
        if kod in codes:
            if ym in d:
                if kod in d[ym]:
                    d[ym][kod].add(ins)
                else:
                    d[ym].setdefault(kod, set([])).add(ins)
            else:
                d.setdefault(ym, {})
                d[ym].setdefault(kod, set([])).add(ins)
            #d.setdefault(publish[:7], {'174': set([]), '175': set([]), '177': set([]), '178': set([])})[kod].add(ins)
    
    for ym in sorted(d.keys()):
        x = d[ym]
        print '%d%2d	%d	%d	%d	%d' % (ym[0], ym[1], len(x.get(174, [])), len(x.get(175, [])), len(x.get(177, [])), len(x.get(178, [])))

def monthly_courts():
    d = {}
    c = 0
    for line in sys.stdin:
        try:
            i, kod, _, publish, ins, _, event, details = line.split('\t')
            det = parse_details(details)
        except ValueError:
            continue
        y, m = publish[:7].split('-')
        ym = (int(y), int(m))
        ks = det.get('idOsobyPuvodce', '')
        if ks:
            if ym in d:
                if ks in d[ym]:
                    d[ym][ks].add(ins)
                else:
                    d[ym].setdefault(ks, set([])).add(ins)
            else:
                d[ym] = {}
                d[ym][ks] = set([ins])
            c += 1
    print 'MESIC\t' + '\t'.join(idOsobyPuvodce)
    for ym in sorted(d.keys()):
        x = d[ym]
        print '%d-%d	%s' % (ym[0], ym[1], '\t'.join([str(len(d[ym].get(x, []))) for x in idOsobyPuvodce]))

def distinct():
    nezajem = ["nazevOsoby", "datumZalozeniCisUdalosti", "datumNarozeni",
            "datumPobytOd", "datumZruseniCisUdalosti", "datumPravniMoci",
            "datumSpojeni","datumOddeleni", "datumZverejneniOpravneneUdalosti",
            "datumOsobaVeVeciZrusena", "datumUstanoveniSpravce", "jmeno",
            "idOsoby", "rc", "ic", "ulice", "psc", "idAdresy", "mesto",
            "cisloPopisne", "okres", "fax", "telefon", "cisUdalost", "dic",
            "nazevOsobyObchodni", "popisCisUdalosti"]
    d = {}
    for line in sys.stdin:
        try:
            i, kod, _, publish, ins, _, event, details = line.split('\t')
            det = parse_details(details)
            for k in det:
                d.setdefault(k, set([])).add(det[k])
        except ValueError:
            continue
    for k in d:
        if k not in nezajem:
            print k, ','.join(d[k]) = {}

for line in sys.stdin:
    try:
        i, kod, _, publish, ins, _, event, details = line.split('\t')
        det = parse_details(details)
        for k in det:
            d.setdefault(k, set([])).add(det[k])
    except ValueError:
        continue

for k in d:
    if k not in nezajem:
        print k, ','.join(d[k])

if __name__ == '__main__':
    monthly_courts()
