import urllib.request
import re

url = 'https://www.thieptotnghiep.com/_next/static/chunks/3_8ue42jk2nr9.js'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
content = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')

# find how blocks are rendered
idx = content.find('blocks.map')
if idx != -1:
    print('blocks.map:')
    print(content[idx-200:idx+400])

# find the main container wrapper
idx2 = content.find('className:"flex flex-col')
if idx2 != -1:
    print('flex flex-col:')
    print(content[idx2:idx2+500])
