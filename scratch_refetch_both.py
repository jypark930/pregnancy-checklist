import urllib.request
import json
import re
from html.parser import HTMLParser

# Custom HTML parser for Naver Blog Mobile HTML
class NaverStripper(HTMLParser):
    def __init__(self):
        super().__init__()
        self.reset()
        self.fed = []
        self.is_main_container = False
        self.div_depth = 0
        
    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        
        # Check if we enter the main content container
        if tag == "div" and "class" in attrs_dict and "se-main-container" in attrs_dict["class"]:
            self.is_main_container = True
            self.div_depth = 1
            return
            
        if self.is_main_container:
            if tag == "div":
                self.div_depth += 1
                
    def handle_endtag(self, tag):
        if self.is_main_container:
            if tag == "div":
                self.div_depth -= 1
                if self.div_depth == 0:
                    self.is_main_container = False
                    
    def handle_data(self, d):
        if self.is_main_container:
            val = d.strip()
            if val:
                self.fed.append(val)
                
    def get_data(self):
        return "\n".join(self.fed)

# 1. Fetch & Parse Naver Blog
naver_url = "https://m.blog.naver.com/parkminji17/224041835804"
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

print(f"Fetching Naver Blog: {naver_url}...")
try:
    req = urllib.request.Request(naver_url, headers=headers)
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        
    # Save raw html just in case
    with open("naver_raw.html", "w", encoding="utf-8") as f:
        f.write(html)
        
    stripper = NaverStripper()
    stripper.feed(html)
    naver_text = stripper.get_data()
    
    # Simple clean up of duplicates and extra newlines
    cleaned_lines = []
    prev = ""
    for line in naver_text.split('\n'):
        line = line.strip()
        if line and line != prev:
            cleaned_lines.append(line)
            prev = line
            
    naver_text_clean = "\n".join(cleaned_lines)
    with open("naver_parsed.txt", "w", encoding="utf-8") as f:
        f.write(naver_text_clean)
        
    print(f"Naver Blog successfully parsed. Length: {len(naver_text_clean)} chars.")
except Exception as e:
    print("Error with Naver Blog:", e)


# 2. Fetch & Parse Notion page with larger limit
notion_url = "https://www.notion.so/api/v3/loadPageChunk"
notion_page_id = "250d8880-c712-8062-8243-fd839a09e8b8"

# Large limit to fetch everything on the page
data = {
    "pageId": notion_page_id,
    "limit": 1000,
    "cursor": {"stack": []},
    "chunkNumber": 0,
    "verticalColumns": False
}

print(f"Fetching Notion page ID: {notion_page_id} (limit: 1000)...")
try:
    req = urllib.request.Request(
        notion_url, 
        data=json.dumps(data).encode('utf-8'), 
        headers={
            "Content-Type": "application/json",
            "User-Agent": headers["User-Agent"]
        },
        method='POST'
    )
    
    with urllib.request.urlopen(req) as response:
        res_data = json.loads(response.read().decode('utf-8'))
        
    record_map = res_data.get("recordMap", {})
    blocks = record_map.get("block", {})
    
    print(f"Successfully fetched {len(blocks)} blocks for Notion.")
    
    extracted_content = []
    
    root_block_outer = blocks.get(notion_page_id, {})
    root_block_inner = root_block_outer.get("value", {}).get("value", {}) if root_block_outer else {}
    
    if root_block_inner:
        page_title = "".join([p[0] for p in root_block_inner.get("properties", {}).get("title", []) if p])
        extracted_content.append(f"# {page_title}\n")
        
    content_ids = root_block_inner.get("content", [])
    
    blocks_to_parse = []
    if content_ids:
        # Sort blocks according to page's content order
        blocks_to_parse = [ (cid, blocks.get(cid, {})) for cid in content_ids if cid in blocks ]
    else:
        blocks_to_parse = list(blocks.items())
        
    for bid, block_data in blocks_to_parse:
        if bid == notion_page_id:
            continue
        outer_val = block_data.get("value", {})
        if not outer_val:
            continue
        inner_val = outer_val.get("value", {})
        if not inner_val:
            continue
            
        block_type = inner_val.get("type", "")
        properties = inner_val.get("properties", {})
        title_prop = properties.get("title", [])
        
        if title_prop:
            text = "".join([part[0] for part in title_prop if part])
            
            if block_type == "header":
                extracted_content.append(f"\n## {text}")
            elif block_type == "sub_header":
                extracted_content.append(f"\n### {text}")
            elif block_type == "sub_sub_header":
                extracted_content.append(f"\n#### {text}")
            elif block_type in ["bulleted_list", "numbered_list"]:
                extracted_content.append(f"- {text}")
            elif block_type == "to_do":
                checked_val = properties.get("checked", [["No"]])
                checked = "✅" if checked_val[0][0] == "Yes" else "⬜"
                extracted_content.append(f"{checked} {text}")
            elif block_type == "text" and text.strip():
                extracted_content.append(text)
            elif text.strip():
                extracted_content.append(f"[{block_type}] {text}")
                
    notion_clean = "\n".join(extracted_content)
    with open("notion_parsed.txt", "w", encoding="utf-8") as f:
        f.write(notion_clean)
    print("Notion parsed and saved completely!")
    
except Exception as e:
    print("Error with Notion:", e)
