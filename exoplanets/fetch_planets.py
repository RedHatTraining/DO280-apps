#!/usr/bin/env python3
import xml.etree.ElementTree as ET, urllib.request, gzip, io

# Grab and parse the data
url  = "https://github.com/OpenExoplanetCatalogue/oec_gzip/raw/master/systems.xml.gz"
resp = urllib.request.urlopen(url).read()
body = gzip.GzipFile(fileobj=io.BytesIO(resp))
oec  = ET.parse(body)

fields = ["name", "mass", "radius", "period"]
count = 0
limit = 50

# Print out a GoLang formatted struct seed, if we have all of the values
print("package main\n")
print("var seed = []Exoplanet{")
for planet in oec.findall(".//planet"):
    p = { k:planet.findtext(k) for k in fields }
    if all(p.values()):
        print("\t{")
        print('\t\tName:   "{}",'.format(p.get("name")))
        print('\t\tMass:   {},'.format(p.get("mass")))
        print('\t\tRadius: {},'.format(p.get("radius")))
        print('\t\tPeriod: {},'.format(p.get("period")))
        print("\t},")
        count += 1
        if count > limit:
            break

print("}")
