#!/usr/bin/env python
#coding=utf-8

import sys
from defs import *

ins_list = {}

def parse_details(str):
    x = str.replace('ns2:', '').replace('udalost:', '').replace('vec:', '').replace('osoba:', '')
    d = dict([(x.split('::', 1)[0], x.split('::', 1)[1]) for x in x.split(';;') if x.strip()])
    o = {}
    for m in META:
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
    if kod in [174, 175, 177, 178, 1]:
        d = parse_details(details)
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

        # metadata
        if kod == 1:
            if d.get('druhRoleVRizeni', 'XXX').startswith('VĚŘ') and d.get('druhOsoby', 'X') == 'P':
                print '%s	%s' % (ins, d.get('nazevOsoby', 'UNKNOWN'))
