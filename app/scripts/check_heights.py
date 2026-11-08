import subprocess, time, json, urllib.request, websocket, os

def get_page_height(url, width):
    proc = subprocess.Popen([
        "/usr/bin/google-chrome",
        "--headless",
        "--no-sandbox",
        "--disable-gpu",
        "--remote-debugging-port=9222"
    ], stderr=subprocess.DEVNULL)
    time.sleep(1)

    try:
        with urllib.request.urlopen("http://127.0.0.1:9222/json") as resp:
            tabs = json.loads(resp.read())
        ws_url = tabs[0]["webSocketDebuggerUrl"]
        ws = websocket.create_connection(ws_url)

        # Set viewport
        ws.send(json.dumps({
            "id": 1,
            "method": "Emulation.setDeviceMetricsOverride",
            "params": {"width": width, "height": 900, "deviceScaleFactor": 1, "mobile": width <= 600}
        }))
        ws.recv()

        # Navigate
        ws.send(json.dumps({"id": 2, "method": "Page.navigate", "params": {"url": url}}))
        ws.recv()
        time.sleep(1.2)

        # Evaluate height
        ws.send(json.dumps({
            "id": 3,
            "method": "Runtime.evaluate",
            "params": {"expression": "Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)"}
        }))
        res = json.loads(ws.recv())
        val = res["result"]["result"]["value"]
        ws.close()
        return val
    finally:
        proc.terminate()
        proc.wait()

if __name__ == "__main__":
    base = os.path.abspath("app/dist")
    pages = [
        ("start", "file://" + os.path.join(base, "en-us/index.html"), {1440: 3979, 768: 5945, 390: 6967}),
        ("document-editor", "file://" + os.path.join(base, "create/en/document-editor/index.html"), {1440: 6622, 768: 8925, 390: 8631}),
        ("grammar-checker", "file://" + os.path.join(base, "create/en/grammar-checker/index.html"), {1440: 5040, 768: 6539, 390: 6335}),
        ("spell-checker", "file://" + os.path.join(base, "create/en/spell-checker/index.html"), {1440: 5606, 768: 7672, 390: 7179}),
        ("word-counter", "file://" + os.path.join(base, "create/en/word-counter/index.html"), {1440: 5565, 768: 7270, 390: 7087}),
    ]

    for name, url, targets in pages:
        print(f"=== {name} ===")
        for w, target in targets.items():
            h = get_page_height(url, w)
            diff = h - target
            status = "EXACT" if diff == 0 else f"{diff:+d}px"
            print(f"  {w}px: measured={h}, target={target} [{status}]")
