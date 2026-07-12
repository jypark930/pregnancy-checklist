import urllib.request
import json

url = "https://wiry-postage-71a.notion.site/_-32056f8d209d80629dfae06d11c53061"

req = urllib.request.Request(
    url, 
    headers={
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
    }
)

try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        print("Success! HTML length:", len(html))
        # Save a sample to check if it contains text
        with open("notion_seo.html", "w", encoding="utf-8") as f:
            f.write(html)
        
        # Check if some common text is there
        if "notion-page-content" in html or "notion-text-block" in html:
            print("Detected notion content structure!")
        else:
            print("Did not detect standard SEO layout, checking if any plain text exists...")
            
except Exception as e:
    print("Error:", e)
