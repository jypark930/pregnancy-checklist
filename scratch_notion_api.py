import urllib.request
import json

url = "https://www.notion.so/api/v3/loadPageChunk"
headers = {
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

# The page ID parsed from the redirect metadata
page_id = "32056f8d-209d-8062-9dfa-e06d11c53061"

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
        
        print(f"Successfully fetched {len(blocks)} blocks.")
        
        extracted_content = []
        
        # In Notion's JSON, a block data structure is:
        # blocks[block_id]["value"]["value"] -> this contains the actual properties, type, etc.
        
        root_block_outer = blocks.get(page_id, {})
        root_block_inner = root_block_outer.get("value", {}).get("value", {}) if root_block_outer else {}
        
        if root_block_inner:
            page_title = "".join([p[0] for p in root_block_inner.get("properties", {}).get("title", []) if p])
            extracted_content.append(f"# {page_title}\n")
            print(f"Root Page Title: {page_title}")
        
        # Track items in correct order using the page's "content" list if available
        content_ids = root_block_inner.get("content", [])
        
        # If no content list, we fall back to iterating all blocks
        blocks_to_parse = []
        if content_ids:
            print(f"Using page content order ({len(content_ids)} sub-blocks)...")
            blocks_to_parse = [ (cid, blocks.get(cid, {})) for cid in content_ids if cid in blocks ]
        else:
            print("No content order list, iterating all blocks...")
            blocks_to_parse = list(blocks.items())
            
        for bid, block_data in blocks_to_parse:
            if bid == page_id:
                continue
            
            # Extract nested value
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
                
                # Format based on block type
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
            
            # Handle child content blocks recursively if they exist (simple 1-level check for callouts/quotes/etc)
            child_content_ids = inner_val.get("content", [])
            if child_content_ids:
                for ccid in child_content_ids:
                    cblock = blocks.get(ccid, {})
                    c_inner = cblock.get("value", {}).get("value", {}) if cblock else {}
                    if c_inner:
                        c_text = "".join([part[0] for part in c_inner.get("properties", {}).get("title", []) if part])
                        if c_text.strip():
                            extracted_content.append(f"  └─ {c_text}")
        
        final_text = "\n".join(extracted_content)
        
        output_file = "notion_clean_content.txt"
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(final_text)
            
        print(f"\n--- Clean Content saved to {output_file} ---")
        # Print a short preview
        lines = [l for l in final_text.split('\n') if l.strip()]
        for line in lines[:40]:
            print(line)
        if len(lines) > 40:
            print(f"... and {len(lines) - 40} more lines.")
        print("---------------------------------------------")
        
except Exception as e:
    print("API Request Error:", e)
    import traceback
    traceback.print_exc()
