#!/usr/bin/env python

import sys
import json

d = json.load(sys.stdin)
o = {'id': 'KRAJ_ID', 'type': 'fill', 'source': {'type': 'geojson', 'data':
    {}}, 'layout': {}, 'paint': {'fill-color': '#088', 'fill-opacity': 0.8}}
out =  []
for f in d['features']:
    no = dict(o)
    o['source']['data'] = f
    out.append(o)

json.dump(out, sys.stdout)
