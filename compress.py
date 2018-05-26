#!/usr/bin/env python

o = open('records.csv', 'a')

import sys

from xml.sax.handler import ContentHandler
import xml.sax
import xml.parsers.expat
import ConfigParser
import xml.sax

class Exact(xml.sax.handler.ContentHandler):
  def __init__(self):
      pass

  def startElement(self, name, attrs):
    o.write(name + ':')

  def endElement(self, name):
    o.write(';;')
    pass

  def characters(self, data):
    o.write(data.encode('utf-8'))

handler = Exact()

i = ''

for line in sys.stdin:
    x = line.split('\t')[-1]
    o.write('\t'.join(line.split('\t')[:-1]) + '\t')
    try:
        xml.sax.parseString(x, handler)
    except xml.sax._exceptions.SAXParseException:
        o.write('<WRONG_XML>')
    o.write('\n')
    i = line.split('\t')[0]

print i
