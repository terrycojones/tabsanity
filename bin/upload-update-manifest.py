#!/usr/bin/env python

from fom.session import Fluid
from json import loads
import os
import sys

if len(sys.argv) != 1:
    print >>sys.stderr, 'Usage: %s < manifest.json' % sys.argv[0]
    sys.exit(1)

APP_ID = 'lmfnijpoggenenldinamblpiliecmlmg'
codebase = (
    'https://fluiddb.fluidinfo.com/about/tabsanity/fluidinfo.com/chrome.crx')

version = loads(sys.stdin.read())['version']
fdb = Fluid('https://fluiddb.fluidinfo.com')
password = os.environ['FLUIDDB_FLUIDINFO_DOT_COM_PASSWORD']
fdb.login('fluidinfo.com', password)

about = 'tabsanity'
tag = 'fluidinfo.com/chrome-update.xml'

data = '''<?xml version='1.0' encoding='UTF-8'?>
<gupdate xmlns='http://www.google.com/update2/response' protocol='2.0'>
  <app appid='%(id)s'>
    <updatecheck codebase='%(codebase)s' version='%(version)s' />
  </app>
</gupdate>
''' % {
    'codebase': codebase,
    'id': APP_ID,
    'version': version,
}

fdb.about[about][tag].put(data, 'application/xml')

print ('Uploaded update manifest for Tabsanity version %s to '
       'https://fluiddb.fluidinfo.com/about/%s/%s' % (version, about, tag))
