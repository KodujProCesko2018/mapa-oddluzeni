#!/usr/bin/env python
#coding=utf-8

import os
import sys
import cgi
import json

class Insolvence():
    def __init__(self):
        pass

    def default(self):
        return {'error': 'Unknown method'}

    def api1(self, od='20080101', do='20082131', udalost='in'):
        return {'data': [{'rc': 'XYZ', 'name': 'ABC DEF'}]}

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
