import urllib.request

url = 'https://www.thieptotnghiep.com/_next/static/chunks/3_8ue42jk2nr9.js'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as resp:
        content = resp.read().decode('utf-8', errors='ignore')

    idx = content.find('case"royal":')
    if idx != -1:
        print('=== ROYAL IN ORIGINAL ===')
        print(content[idx:idx+1500])

    idx_tl = content.find('if("ceremony"===f)')
    if idx_tl != -1:
        print('=== TIMELINE IN ORIGINAL ===')
        print(content[idx_tl:idx_tl+1500])

except Exception as e:
    print('Error:', e)
