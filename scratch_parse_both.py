import urllib.request
import json
import re
from html.parser import HTMLParser

class TextStripper(HTMLParser):
    def __init__(self):
        super().__init__()
        self.reset()
        self.fed = []
        self.in_title = False
        self.in_post_view = False
        
    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        if tag == "title":
            self.in_title = True
        if "class" in attrs_dict and "_postView" in attrs_dict["class"]:
            self.in_post_view = True
            
    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False
            
    def handle_data(self, d):
        if self.in_title:
            self.fed.append(f"TITLE: {d.strip()}")
        elif self.in_post_view:
            val = d.strip()
            if val:
                self.fed.append(val)
                
    def get_data(self):
        return "\n".join(self.fed)

# 1. Parse Naver Blog
print("Parsing Naver Blog HTML...")
naver_html_path = r"C:\Users\USER\.gemini\antigravity\brain\6c87521e-9e6d-4e81-9cf6-446888811398\.system_generated\steps\186\content.md"

try:
    with open(naver_html_path, "r", encoding="utf-8") as f:
        html_content = f.read()
        
    stripper = TextStripper()
    stripper.feed(html_content)
    naver_text = stripper.get_data()
    naver_text = re.sub(r'\n+', '\n', naver_text)
    
    with open("naver_parsed.txt", "w", encoding="utf-8") as f:
        f.write(naver_text)
    print("Naver Blog parsed successfully!")
except Exception as e:
    print("Error parsing Naver Blog:", e)


# 2. Fetch and Parse Notion page
url = "https://www.notion.so/api/v3/loadPageChunk"
headers = {
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}
page_id = "250d8880-c712-8062-8243-fd839a09e8b8"

data = {
    "pageId": page_id,
    "limit": 100,
    "cursor": {"stack": []},
    "chunkNumber": 0,
    "verticalColumns": False
}

req = urllib.request.Request(
    url, 
    data=json.dumps(data).encode('utf-8'), 
    headers=headers, 
    method='POST'
)

print(f"Fetching Notion page chunk for page ID: {page_id}...")
try:
    with urllib.request.urlopen(req) as response:
        res_data = json.loads(response.read().decode('utf-8'))
        
        record_map = res_data.get("recordMap", {})
        blocks = record_map.get("block", {})
        
        print(f"Successfully fetched {len(blocks)} blocks for Notion.")
        
        extracted_content = []
        
        root_block_outer = blocks.get(page_id, {})
        root_block_inner = root_block_outer.get("value", {}).get("value", {}) if root_block_outer else {}
        
        if root_block_inner:
            page_title = "".join([p[0] for p in root_block_inner.get("properties", {}).get("title", []) if p])
            extracted_content.append(f"# {page_title}\n")
            # Avoid printing non-ASCII title directly to cmd console to prevent encoding issues
            print("Successfully extracted page title.")
            
        content_ids = root_block_inner.get("content", [])
        
        blocks_to_parse = []
        if content_ids:
            blocks_to_parse = [ (cid, blocks.get(cid, {})) for cid in content_ids if cid in blocks ]
        else:
            blocks_to_parse = list(blocks.items())
            
        for bid, block_data in blocks_to_parse:
            if bid == page_id:
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
        print("Notion parsed and saved to notion_parsed.txt successfully!")
        
except Exception as e:
    print("Error fetching/parsing Notion:", e)
