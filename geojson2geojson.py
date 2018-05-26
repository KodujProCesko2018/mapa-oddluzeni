#!/usr/bin/env python

import sys
import json
import requests

kraje = requests.get('http://arccr-arcdata.opendata.arcgis.com/datasets/6475ee085a0d498fb9075fd6320d16f2_8.geojson').json()
o = {'id': 'KRAJ_ID', 'type': 'fill', 'source': {'type': 'geojson', 'data':
    {}}, 'layout': {}, 'paint': {'fill-color': '#088', 'fill-opacity': 0.8}}
out =  []
for f in kraje['features']:
    no = dict(o)
    coordinates = []
    f['geometry']['coordinates'][0] = f['geometry']['coordinates'][0][::30]
    #print f['properties']['NAZ_CZNUTS3'], len(f['geometry']['coordinates'][0])
    o['source']['data'] = f
    out.append(o)

json.dump(out, sys.stdout)
