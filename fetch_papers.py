import os
import json
import urllib.request
import ssl

BASE_URL = "https://gate2026.iitg.ac.in"
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "public", "papers")

# Map of papers to fetch: (folder, year, relative_url, filename)
PAPERS = [
    # CSE Papers
    ("cse", 2025, "doc/download/2025/CS12025.pdf", "GATE_CS1_2025.pdf"),
    ("cse", 2025, "doc/download/2025/CS22025.pdf", "GATE_CS2_2025.pdf"),
    ("cse", 2024, "doc/download/2024/CS124S5.pdf", "GATE_CS1_2024.pdf"),
    ("cse", 2024, "doc/download/2024/CS224S6.pdf", "GATE_CS2_2024.pdf"),
    ("cse", 2023, "doc/download/2023/cs_2023.pdf", "GATE_CS_2023.pdf"),
    ("cse", 2022, "doc/download/2022/cs_2022.pdf", "GATE_CS_2022.pdf"),
    # DSAI Papers (DA paper introduced in 2024)
    ("dsai", 2025, "doc/download/2025/DA2025.pdf", "GATE_DA_2025.pdf"),
    ("dsai", 2024, "doc/download/2024/DA24S1.pdf", "GATE_DA_2024.pdf"),
]

# SSL context to handle certificate issues
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE


def fetch_paper(folder, year, rel_url, filename):
    dest_dir = os.path.join(OUTPUT_DIR, folder)
    os.makedirs(dest_dir, exist_ok=True)
    dest_path = os.path.join(dest_dir, filename)

    if os.path.exists(dest_path) and os.path.getsize(dest_path) > 1000:
        print(f"  [skip] {filename} already exists")
        return True

    url = f"{BASE_URL}/{rel_url}"
    print(f"  Fetching {url} ...")
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, context=ctx) as resp:
            data = resp.read()
        with open(dest_path, "wb") as f:
            f.write(data)
        print(f"  [done] {filename} ({len(data)} bytes)")
        return True
    except Exception as e:
        print(f"  [FAIL] {filename}: {e}")
        return False


def build_availability():
    availability = {"cse": [], "dsai": []}
    for folder, year, _, filename in PAPERS:
        path = os.path.join(OUTPUT_DIR, folder, filename)
        if os.path.exists(path) and os.path.getsize(path) > 1000:
            availability[folder].append({
                "year": year,
                "file": f"/papers/{folder}/{filename}",
            })
    for key in availability:
        availability[key].sort(key=lambda x: (-x["year"], x["file"]))
    return availability


def main():
    print("=== GATE PYQ Paper Fetcher ===\n")
    success = 0
    total = len(PAPERS)

    for folder, year, rel_url, filename in PAPERS:
        print(f"[{folder.upper()} {year}]")
        if fetch_paper(folder, year, rel_url, filename):
            success += 1

    print(f"\nFetched {success}/{total} papers.\n")

    availability = build_availability()
    avail_path = os.path.join(OUTPUT_DIR, "availability.json")
    with open(avail_path, "w") as f:
        json.dump(availability, f, indent=2)
    print(f"Availability manifest written to {avail_path}")
    print(json.dumps(availability, indent=2))


if __name__ == "__main__":
    main()
