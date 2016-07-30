from __future__ import print_function

import json
import gzip
import urllib
from zipfile import ZipFile
from urllib import urlopen
from StringIO import StringIO

print('Loading function')

def lambda_handler(event, context):
    # Parse options and construct the API call URI
    latitude = event["params"]["querystring"]["latitude"]
    longitude = event["params"]["querystring"]["longitude"]
    radius = event["params"]["querystring"]["radius"]
    species_ids = event["params"]["querystring"]["species_ids"].split(",")
    uri = construct_request_uri(latitude, longitude, radius, species_ids)
    return get_sightings_from_atlas(uri, species_ids)
    
def construct_request_uri(latitude, longitude, radius, species_ids):
    BASE_URI = "http://biocache.ala.org.au/ws/occurrences/index/download?"
    
    # Get the substrings of request params. On some we just use constants for now.
    species_querystring = get_species_querystring(species_ids)
    position_querystring = get_position_querystring(latitude, longitude, radius)
    csv_opts_querystring = get_csv_generation_opts_querystring()
    misc_opts_querystring = get_misc_opts_querystring()
    return_fields_querystring = get_return_fields_querystring()
    
    # Combinefor the final request string
    request_params = species_querystring + "&" + position_querystring + "&" + csv_opts_querystring + "&" + misc_opts_querystring + "&" + return_fields_querystring
    return BASE_URI + request_params

def get_sightings_from_atlas(uri, species_ids):
    # Create a dict of sightings
    # Each species ID will have a list of sightings with [lat, long]
    sightings = dict()
    for species_id in species_ids:
        sightings[species_id] = []

    # The CSV headers
    LONG = 0
    LAT = 1
    LSID = 2
        
    # Download API call and unzip
    url = urlopen(uri)
    zipfile = ZipFile(StringIO(url.read()))

    # Skip the header row using [1:]
    for line in zipfile.open("data.csv").readlines()[1:]:
        sighting_record = line.split(",")
        # Slice off the CSV formatting around the real data using [1:-2] etc.. filthy line clean up if time permits
        sightings[sighting_record[LSID][1:-2]].append([sighting_record[LAT][1:-1],sighting_record[LONG][1:-1]])
        
    for species_id in species_ids:
        if sightings[species_id] == []: del sightings[species_id]
        
    return sightings
    
# Query string will look like:
# taxon_concept_lsid:"<id>" OR taxon_concept_lsid:"<id2> OR ..."
def get_species_querystring(species_ids):
    # Construct the Species IDs querystring. Filthy flag operationz i'm not familiar with python
    first = True
    species_querystring = "fq="
    for species_id in species_ids:
        if first:
            species_querystring += encode_uri('taxon_concept_lsid:"%s"' % species_id)
            first = False
        else:
            species_querystring += encode_uri(' OR taxon_concept_lsid:"%s"' % species_id)
    return species_querystring
    
def get_position_querystring(lat, lon, radius):
    return encode_uri("lat=%s&lon=%s&radius=%s" % (lat, lon, radius))
    
def get_csv_generation_opts_querystring():
    # esc = CSV escape char
    # sep = Seperator
    return encode_uri('esc=\\&sep=,')

def get_misc_opts_querystring():
    # QA = error handling, no need to worry
    # reasonTypeId = the reason we are requesting the data. No need to change this.
    # sourceTypeId = ID for source system. No need to change.
    qa = 'none'
    reason = 10
    source = 2001
    return encode_uri('qa=%s&reasonTypeId=%s&sourceTypeId=%s' % (qa, reason, source))

def get_return_fields_querystring():
    return encode_uri('fields=longitude,latitude,taxon_concept_lsid')

# Thanks to http://stackoverflow.com/questions/946170/equivalent-javascript-functions-for-pythons-urllib-quote-and-urllib-unquote    
def encode_uri(url):
    # URL-encodes a string (either str (i.e. ASCII) or unicode);
    # uses de-facto UTF-8 encoding to handle Unicode codepoints in given string.
    DO_NOT_ENCODE_CHARS = '=&~()*!.\''
    return urllib.quote(unicode(url).encode('utf-8'), DO_NOT_ENCODE_CHARS)
