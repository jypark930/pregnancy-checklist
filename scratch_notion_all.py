import urllib.request
import json

url = "https://www.notion.so/api/v3/loadPageChunk"
headers = {
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}
page_id = "250d8880-c712-8062-8243-fd839a09e8b8"

# We will paginated fetch using cursor
all_blocks = {}
cursor = {"stack": []}
chunk_no = 0

while True:
    print(f"Fetching chunk {chunk_no}...")
    data = {
        "pageId": page_id,
        "limit": 100,
        "cursor": cursor,
        "chunkNumber": chunk_no,
        "verticalColumns": False
    }
    
    req = urllib.request.Request(
        url, 
        data=json.dumps(data).encode('utf-8'), 
        headers=headers, 
        method='POST'
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            res_data = json.loads(response.read().decode('utf-8'))
            
            record_map = res_data.get("recordMap", {})
            blocks = record_map.get("block", {})
            
            # Merge blocks
            all_blocks.update(blocks)
            print(f"Fetched chunk {chunk_no} with {len(blocks)} blocks. Total unique blocks: {len(all_blocks)}")
            
            # Check cursor
            next_cursor = res_data.get("cursor")
            if next_cursor and next_cursor.get("stack") and next_cursor != cursor:
                cursor = next_cursor
                chunk_no += 1
            else:
                print("No more chunks or same cursor. Stopping.")
                break
                
    except Exception as e:
        print("Error during chunk fetch:", e)
        break

# Parse all collected blocks
extracted_content = []
root_block = all_blocks.get(page_id, {}).get("value", {}).get("value", {})
if root_block:
    page_title = "".join([p[0] for p in root_block.get("properties", {}).get("title", []) if p])
    extracted_content.append(f"# {page_title}\n")
    
content_ids = root_block.get("content", []) if root_block else []
blocks_to_parse = [(cid, all_blocks.get(cid, {})) for cid in content_ids if cid in all_blocks] if content_ids else list(all_blocks.items())

for bid, block_data in blocks_to_parse:
    if bid == page_id:
        continue
    inner_val = block_data.get("value", {}).get("value", {})
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
            checked = "✅" if properties.get("checked", [["No"]])[0][0] == "Yes" else "⬜"
            extracted_content.append(f"{checked} {text}")
        elif block_type == "text" and text.strip():
            extracted_content.append(text)
        elif text.strip():
            extracted_content.append(f"[{block_type}] {text}")

notion_clean = "\n".join(extracted_content)
with open("notion_parsed.txt", "w", encoding="utf-8") as f:
    f.write(notion_clean)
    
print("Saved all blocks to notion_parsed.txt.")
