from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

url = "https://wiry-postage-71a.notion.site/_-32056f8d209d80629dfae06d11c53061"

options = Options()
options.add_argument('--headless')
options.add_argument('--disable-gpu')
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')
options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")

# page_load_strategy = 'none' tells Selenium to return immediately after navigation starts
options.page_load_strategy = 'none'

print("Initializing Chrome webdriver with 'none' load strategy...")
driver = webdriver.Chrome(options=options)

try:
    print(f"Starting navigation to: {url}")
    driver.get(url)
    
    print("Waiting for body element to appear (timeout 15s)...")
    # Wait for body to be present
    body = WebDriverWait(driver, 15).until(
        EC.presence_of_element_located((By.TAG_NAME, "body"))
    )
    print("Body element present! Waiting 8 seconds for React/JS content to render...")
    time.sleep(8)
    
    # Check if we can find any text inside the body
    body_text = body.text
    
    # Also check page source length
    source_len = len(driver.page_source)
    print(f"Rendered Page Source Length: {source_len} chars")
    
    if not body_text.strip() or "JavaScript must be enabled" in body_text:
        print("Detected empty body or JS blocked message. Let's wait a bit longer...")
        time.sleep(5)
        body_text = driver.find_element(By.TAG_NAME, "body").text

    output_file = "notion_content.txt"
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(body_text)
        
    print(f"Content successfully written to {output_file}")
    print("\n--- Content Preview ---")
    lines = [l for l in body_text.split('\n') if l.strip()]
    for line in lines[:40]:  # Show first 40 non-empty lines
        print(line)
    if len(lines) > 40:
        print(f"... and {len(lines) - 40} more lines.")
    print("-----------------------")

except Exception as e:
    print("An error occurred during extraction:", e)
finally:
    driver.quit()
