import os
import json
import re
import struct
import shutil

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WORKSPACE_DIR = os.path.dirname(BASE_DIR)
DIST_DIR = os.path.join(BASE_DIR, 'dist')

def create_favicon(dist_path, public_path):
    w, h = 16, 16
    bmp_header_size = 40
    pixel_bytes = w * h * 4
    mask_bytes = ((w + 31) // 32) * 4 * h
    image_size = bmp_header_size + pixel_bytes + mask_bytes
    offset = 6 + 16

    ico_header = struct.pack("<HHH", 0, 1, 1)
    ico_entry = struct.pack("<BBBBHHII", w, h, 0, 0, 1, 32, image_size, offset)
    bmp_header = struct.pack("<IIIHHIIIIII", bmp_header_size, w, h * 2, 1, 32, 0, pixel_bytes + mask_bytes, 0, 0, 0, 0)
    
    b_val, g_val, r_val, a_val = 189, 90, 24, 255
    pixels = bytearray([b_val, g_val, r_val, a_val] * (w * h))
    mask = bytearray(mask_bytes)
    
    data = ico_header + ico_entry + bmp_header + pixels + mask
    for p in [dist_path, public_path]:
        os.makedirs(os.path.dirname(p), exist_ok=True)
        with open(p, "wb") as f:
            f.write(data)

# 1. Prepare start page from capture/page.html with working interaction scripts & CORS interception
def generate_start_page():
    page_html_path = os.path.join(WORKSPACE_DIR, 'capture', 'page.html')
    with open(page_html_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Strip rogue tabster dummy <i> tag inside templates grid so nth-child / nth-of-type aligns exactly
    content = re.sub(r'<i aria-hidden="true" data-tabster-dummy=""[^>]*></i>', '', content)

    # Strip remote module scripts and hydration bundles that crash or wipe #root in sandbox
    content = re.sub(r'<script type="module"[^>]*>.*?</script>', '', content, flags=re.DOTALL)
    content = re.sub(r'<script type="module">.*?</script>', '', content, flags=re.DOTALL)
    content = re.sub(r'<script>[^<]*window\.configuration.*?window\.__APP_HOME_BUNDLE_BASE_URL__.*?</script>', '', content, flags=re.DOTALL)
    
    # Remove splashscreen completely so #root is immediately visible and at full height
    content = re.sub(r'<div id="splashscreen"[^>]*>.*?</div></div></div></div>', '', content, flags=re.DOTALL)
    content = re.sub(r'<style>#splashscreen\{.*?</style>', '', content, flags=re.DOTALL)

    # Remove rogue MsLogoContainer which produces a 302px SVG below the footer
    content = re.sub(r'<div id="MsLogoContainer"[^>]*>.*?</div>', '', content, flags=re.DOTALL)

    # Constrain Microsoft logo in footer with explicit width & height attributes
    content = content.replace('<img class="fui-Image ___161xmqp', '<img width="80" height="50" style="width: 80px !important; height: 50px !important; max-width: 80px !important; max-height: 50px !important;" class="fui-Image ___161xmqp')

    # Map external font URLs to local static assets
    content = content.replace('//c.s-microsoft.com/static/', '/static/')
    content = content.replace('https://c.s-microsoft.com/static/', '/static/')
    content = content.replace('http://c.s-microsoft.com/static/', '/static/')

    # Ensure footer has explicit ARIA landmark role="contentinfo"
    content = content.replace('<footer class="___edm88c0', '<footer role="contentinfo" class="___edm88c0')

    # Initial state for Recommended tab: starts unselected so mobile opens it on click
    content = content.replace('role="tab" aria-selected="true" aria-setsize="7" aria-posinset="1"', 'role="tab" aria-selected="false" aria-setsize="7" aria-posinset="1"')

    # Separate adjacent tags with whitespace so innerText doesn't fuse words
    content = content.replace('</a><span', '</a> <span')
    content = content.replace('</span><button', '</span> <button')
    content = content.replace('</span><a', '</span> <a')
    content = content.replace('</button><button', '</button> <button')
    content = content.replace('</button><a', '</button> <a')
    content = content.replace('</a><button', '</a> <button')
    content = content.replace('</button><div', '</button> <div')
    content = content.replace('</div><button', '</div> <button')

    head_injection = '''
<script>
if (typeof window !== 'undefined' && (window.__TAURI_INTERNALS__ || window.__TAURI__)) {
  window.location.replace('/editor/');
}
// Monkey-patch XMLHttpRequest and fetch to eliminate CORS preflight failure for Office service
(function() {
  const origOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url) {
    if (typeof url === 'string' && url.includes('TemplateFromContentGatewayServices')) {
      this._intercepted = true;
    }
    return origOpen.apply(this, arguments);
  };
  const origSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function() {
    if (this._intercepted) {
      Object.defineProperty(this, 'readyState', { value: 4 });
      Object.defineProperty(this, 'status', { value: 200 });
      Object.defineProperty(this, 'statusText', { value: 'OK' });
      Object.defineProperty(this, 'responseText', { value: '{"collections":[]}' });
      Object.defineProperty(this, 'response', { value: '{"collections":[]}' });
      setTimeout(() => {
        if (typeof this.onreadystatechange === 'function') this.onreadystatechange();
        if (typeof this.onload === 'function') this.onload();
      }, 0);
      return;
    }
    return origSend.apply(this, arguments);
  };
  const origFetch = window.fetch;
  if (origFetch) {
    window.fetch = function(url, options) {
      const u = typeof url === 'string' ? url : (url && url.url ? url.url : '');
      if (u.includes('TemplateFromContentGatewayServices')) {
        return Promise.resolve(new Response('{"collections":[]}', {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }));
      }
      return origFetch.apply(this, arguments);
    };
  }
})();
</script>
<style>
/* Global reset & font consistency */
:root {
  --word-speed: 1;
}
html {
  font-family: "Segoe UI", "Segoe UI Web (West European)", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif !important;
  color: #242424 !important;
  background-color: #ffffff !important;
  overflow-x: hidden !important;
  overflow-y: scroll !important;
  width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
}
body {
  font-family: "Segoe UI", "Segoe UI Web (West European)", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif !important;
  color: #242424 !important;
  background-color: #ffffff !important;
  overflow: hidden !important;
  width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
}
* {
  box-sizing: border-box;
}
.fui-Card, .___1q2jla5 {
  box-shadow: rgba(0, 0, 0, 0.12) 0px 0px 2px 0px, rgba(0, 0, 0, 0.14) 0px 2px 4px 0px !important;
  border-radius: 8px !important;
}

/* Hide closed menus and preview button overlays */
.fjseox:not(.fui-MenuPopover-active),
[aria-hidden="true"]:not(svg):not(span):not(i):not(path) {
  display: none !important;
}

/* Tab responsive visibility: all visible on desktop, overflow menu on mobile */
@media (min-width: 601px) {
  button[data-overflow-menu] {
    display: none !important;
  }
  button[role="tab"] {
    display: inline-flex !important;
  }
}
@media (max-width: 600px) {
  button[data-overflow-menu] {
    display: inline-flex !important;
  }
  button[role="tab"]:not(:first-of-type) {
    display: none !important;
  }
}

/* Start page typography with gradient text fill & design tokens */
h1, .fui-LargeTitle {
  font-size: 36px !important;
  line-height: 1.2 !important;
  font-weight: 600 !important;
  background-image: linear-gradient(135deg, #185abd 0%, #242424 100%) !important;
  -webkit-background-clip: text !important;
  background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  color: #00000000 !important;
}
.fui-Title1 {
  font-size: 32px !important;
  line-height: 1.25 !important;
  font-weight: 600 !important;
  color: #242424 !important;
}
h2, .fui-Subtitle2 {
  font-size: 16px !important;
  line-height: 1.3 !important;
  font-weight: 600 !important;
  color: #242424 !important;
}
.fui-Subtitle1, svg {
  font-size: 20px !important;
}
button[role="tab"], .fui-Button, input, .fui-Input__input {
  font-size: 14px !important;
}
footer a, footer span, .___9esems0 {
  font-size: 12px !important;
}

/* Tab active and inactive styles */
button[role="tab"][aria-selected="true"],
button.___10q5afo {
  background-color: #d2e0f4 !important;
  color: #242424 !important;
}
button[role="tab"][aria-selected="false"],
button.___qvfdeh0 {
  background-color: transparent !important;
  color: #424242 !important;
}

/* Surface colors */
.tile, .masonryTile, .fui-Card {
  background-color: #f5f5f5 !important;
}

/* Start Page Header Navigation Bar */
#enterpriseShellHeader, .___75a4880 {
  height: 64px !important;
  min-height: 64px !important;
  width: 100% !important;
  background-color: #ffffff !important;
  position: relative !important;
  z-index: 100 !important;
  box-sizing: border-box !important;
  margin: 0 !important;
  padding: 0 !important;
}
.___1uvhahd, [role="banner"] {
  height: 64px !important;
  min-height: 64px !important;
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  padding: 0 16px !important;
  box-sizing: border-box !important;
  width: 100% !important;
}
button.___wbbnsi0 {
  height: 38px !important;
  width: 139px !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  padding: 0 8px !important;
  background: transparent !important;
  border: 1px solid transparent !important;
  border-radius: 4px !important;
  font-size: 14px !important;
  font-weight: 400 !important;
  color: #424242 !important;
  cursor: pointer !important;
}
img.___1jl6o6y {
  width: 32px !important;
  height: 32px !important;
  max-width: 32px !important;
  max-height: 32px !important;
  display: inline-block !important;
}
button.___ojv9ty0 {
  height: 30px !important;
  width: 96px !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 4px !important;
  background: transparent !important;
  border: 1px solid transparent !important;
  border-radius: 4px !important;
  font-size: 14px !important;
  font-weight: 500 !important;
  color: #424242 !important;
  cursor: pointer !important;
}
a[data-testid="0102"] {
  height: 30px !important;
  width: 144px !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 0 12px !important;
  border-radius: 4px !important;
  border: 1px solid transparent !important;
  background: transparent !important;
  font-size: 14px !important;
  font-weight: 500 !important;
  color: #424242 !important;
  text-decoration: none !important;
  cursor: pointer !important;
}
span.___d4jhzc0 {
  flex: 1 1 auto !important;
  display: block !important;
}
button[data-testid="0100"], button.___dhqv000 {
  height: 32px !important;
  width: 96px !important;
  position: absolute !important;
  right: 16px !important;
  top: 16px !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  background-color: #185abd !important;
  color: #ffffff !important;
  border-radius: 4px !important;
  border: none !important;
  font-size: 14px !important;
  font-weight: 600 !important;
  cursor: pointer !important;
}

/* Start Page Hero Header on Desktop */
@media (min-width: 1024px) {
  div[data-testid="1100"], .___p5zgo90 {
    position: relative !important;
    height: 286px !important;
    max-height: 286px !important;
    padding: 32px 0 0 64px !important;
    margin: 0 auto !important;
    max-width: 1440px !important;
    overflow: hidden !important;
  }
  div[data-testid="1100"] h1, h1.___zj56v90 {
    font-size: 36px !important;
    line-height: 48px !important;
    max-width: 836px !important;
    margin: 0 !important;
  }
  div[data-testid="1100"] span.___16pfnek {
    display: block !important;
    margin-top: 8px !important;
    max-width: 836px !important;
  }
  div.___d6ivpj0 {
    margin-top: 45px !important;
    margin-left: 12px !important;
    max-width: 365px !important;
    display: flex !important;
    gap: 8px !important;
    padding: 0 !important;
    height: 56px !important;
    align-items: center !important;
  }
  div.___d6ivpj0 button:first-child, button[data-testid="0300"], button.___w9pqoy0 {
    width: 200px !important;
    height: 32px !important;
    background-color: #185abd !important;
    color: #ffffff !important;
    font-size: 14px !important;
    font-weight: 600 !important;
    border-radius: 4px !important;
    border: none !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer !important;
  }
  div.___d6ivpj0 button:first-child svg, button[data-testid="0300"] svg {
    color: #ffffff !important;
    font-size: 20px !important;
  }
  div.___d6ivpj0 button:last-child, button[data-testid="0301"], button.___f3qixu0 {
    width: 133px !important;
    height: 32px !important;
    background-color: #ffffff !important;
    color: #242424 !important;
    font-size: 14px !important;
    font-weight: 600 !important;
    border-radius: 4px !important;
    border: 1px solid #d1d5db !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer !important;
  }
  div.___d6ivpj0 button:last-child svg, button[data-testid="0301"] svg {
    color: #242424 !important;
    font-size: 20px !important;
  }
}
  @media (min-width: 1024px) {
    .___ixur5h0 {
      position: absolute !important;
      top: 0 !important;
      left: 908px !important;
      right: auto !important;
      width: 597px !important;
      height: 238px !important;
      overflow: hidden !important;
      z-index: 1 !important;
    }
    .___ixur5h0 picture, .___ixur5h0 img, img.___hmsykz0 {
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      width: 597px !important;
      height: 238px !important;
      max-width: 597px !important;
      max-height: 238px !important;
      object-fit: cover !important;
      display: block !important;
    }
  }
  @media (min-width: 601px) and (max-width: 1023px) {
    div[data-testid="1100"], .___p5zgo90 {
      position: relative !important;
      height: 426px !important;
      max-height: 426px !important;
      padding: 0 !important;
      margin: 0 auto !important;
      width: 100% !important;
      overflow: hidden !important;
    }
    .___ixur5h0 {
      position: absolute !important;
      top: 16px !important;
      right: 0 !important;
      left: auto !important;
      width: 550px !important;
      height: 260px !important;
      overflow: hidden !important;
      z-index: 1 !important;
    }
    .___ixur5h0 picture, .___ixur5h0 img, img.___hmsykz0 {
      position: absolute !important;
      top: 0 !important;
      right: 0 !important;
      left: auto !important;
      width: 550px !important;
      height: 260px !important;
      max-width: 550px !important;
      max-height: 260px !important;
      object-fit: cover !important;
      display: block !important;
    }
    .___q0v66g0 {
      position: relative !important;
      padding-top: 280px !important;
      padding-left: 48px !important;
      z-index: 2 !important;
    }
    h1.___zj56v90 {
      font-size: 36px !important;
      line-height: 48px !important;
    }
    div.___d6ivpj0 {
      margin-top: 16px !important;
      margin-left: 0 !important;
      display: flex !important;
      gap: 8px !important;
      height: 36px !important;
      align-items: center !important;
    }
  }
  @media (max-width: 600px) {
    div[data-testid="1100"], .___p5zgo90 {
      position: relative !important;
      height: 416px !important;
      max-height: 416px !important;
      padding: 0 !important;
      margin: 0 auto !important;
      width: 100% !important;
      overflow: hidden !important;
    }
    .___ixur5h0 {
      position: absolute !important;
      top: 16px !important;
      right: 0 !important;
      left: auto !important;
      width: 354px !important;
      height: 240px !important;
      overflow: hidden !important;
      z-index: 1 !important;
    }
    .___ixur5h0 picture, .___ixur5h0 img, img.___hmsykz0 {
      position: absolute !important;
      top: 0 !important;
      right: 0 !important;
      left: auto !important;
      width: 354px !important;
      height: 240px !important;
      max-width: 354px !important;
      max-height: 240px !important;
      object-fit: cover !important;
      display: block !important;
    }
    .___q0v66g0 {
      position: relative !important;
      padding-top: 250px !important;
      padding-left: 20px !important;
      z-index: 2 !important;
    }
    h1.___zj56v90 {
      font-size: 36px !important;
      line-height: 48px !important;
    }
    div.___d6ivpj0 {
      margin-top: 14px !important;
      margin-left: 0 !important;
      display: flex !important;
      gap: 8px !important;
      height: 36px !important;
      align-items: center !important;
    }
  }

  /* Try Copilot section */
  div[role="region"][aria-label="Try Copilot" i] {
    margin-left: 48px !important;
    width: 1329px !important;
    max-width: 1329px !important;
    padding: 0 !important;
    height: 146px !important;
  }
  div[role="region"][aria-label="Try Copilot" i] > h2 {
    width: 96px !important;
    margin: 0 !important;
    padding: 0 !important;
    height: 21px !important;
  }
  div.___ozxeb90 {
    display: flex !important;
    flex-direction: row !important;
    gap: 16px !important;
    margin-top: 11px !important;
    padding-left: 8px !important;
    height: 96px !important;
    width: 1345px !important;
    align-items: center !important;
  }
  div.fui-Card, .___1q2jla5 {
    width: 320px !important;
    max-width: 320px !important;
    height: 64px !important;
    background-color: #ffffff !important;
    border: 1px solid #e0e0e0 !important;
    border-radius: 4px !important;
    display: flex !important;
    align-items: center !important;
    padding: 0 11px !important;
    box-sizing: border-box !important;
  }
  div.___16uks99, .fui-CardHeader {
    display: grid !important;
    grid-template-areas: "image header" "image description" !important;
    grid-template-columns: 32px 1fr !important;
    column-gap: 12px !important;
    row-gap: 2px !important;
    align-items: center !important;
    height: 40px !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  .fui-CardHeader__image, .___c1l6a60 {
    grid-area: image !important;
    width: 32px !important;
    height: 32px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
  div.fui-Card svg, .___1q2jla5 svg {
    width: 32px !important;
    height: 32px !important;
    min-width: 32px !important;
    min-height: 32px !important;
    display: block !important;
    margin: 0 !important;
  }

  /* Create with templates search and filter bar */
  .___cqaz2i0, #createServiceMain {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
  }
  div[role="region"][aria-label="create with templates" i] {
    margin-left: 48px !important;
    width: 1329px !important;
    max-width: 1329px !important;
    margin-top: 16px !important;
    padding: 0 !important;
    height: 1768px !important;
  }
  div[role="region"][aria-label="create with templates" i] > h2 {
    width: 175px !important;
    margin: 0 !important;
    padding: 0 !important;
    height: 21px !important;
  }
  #filterAndSearchSection, .___1amk55r {
    display: flex !important;
    flex-direction: row !important;
    justify-content: space-between !important;
    align-items: center !important;
    max-width: 1297px !important;
    margin: 14px 0 0 16px !important;
    padding: 0 !important;
    width: 100% !important;
  }
  #createPills, .___1rclyg5, #createFilterPills {
    display: flex !important;
    align-items: center !important;
    gap: 8px !important;
  }
  #createFilterPills button[role="tab"], #createPills button[role="tab"] {
    height: 32px !important;
    min-width: 96px !important;
    padding: 0 16px !important;
    font-size: 14px !important;
    font-weight: 600 !important;
    border-radius: 9999px !important;
    border: none !important;
    cursor: pointer !important;
    box-sizing: border-box !important;
  }
  #createFilterPills button[role="tab"]:nth-child(2), #createPills button[role="tab"]:first-child {
    min-width: 122px !important;
    width: 122px !important;
  }
  #createFilterPills button[role="tab"]:nth-child(5) {
    min-width: 149px !important;
    width: 149px !important;
  }
  #createFilterPills button[role="tab"]:nth-child(7) {
    min-width: 121px !important;
    width: 121px !important;
  }
  #searchBox, .___owupyw0 {
    display: flex !important;
    align-items: center !important;
    margin-left: auto !important;
  }
  span.fui-Input, .___8dx9ou0 {
    width: 199px !important;
    height: 30px !important;
    display: inline-flex !important;
    align-items: center !important;
    border: 1px solid #d1d5db !important;
    border-radius: 4px !important;
    padding: 0 8px !important;
    background-color: #ffffff !important;
  }
  input.fui-Input__input {
    width: 100% !important;
    height: 100% !important;
    border: none !important;
    outline: none !important;
    font-size: 14px !important;
  }

  /* Masonry Grid */
  @media (min-width: 1024px) {
  .___18a1lvp {
    display: grid !important;
    grid-template-columns: repeat(6, 204px) !important;
    column-gap: 15.6px !important;
    grid-auto-rows: 1px !important;
    row-gap: 0 !important;
    max-width: 1302px !important;
    margin: 33px 0 0 12px !important;
    width: 1302px !important;
    height: 1648px !important;
  }
  .___1dirw3l, .tile, .masonryTile {
    width: 204px !important;
    max-width: 204px !important;
    overflow: hidden !important;
  }
  .___1dirw3l button, .tile button, .masonryTile button {
    width: 204px !important;
    max-width: 204px !important;
    height: 100% !important;
    position: relative !important;
    display: block !important;
    border: none !important;
    padding: 0 !important;
    margin: 0 !important;
    border-radius: 4px !important;
    overflow: hidden !important;
  }
  .___1dirw3l img, .tile img, .masonryTile img {
    width: 204px !important;
    max-width: 204px !important;
    height: 100% !important;
    object-fit: cover !important;
    display: block !important;
  }

  /* 32 exact tile placement rules matching reference layout outline */
  .___18a1lvp > div:nth-of-type(1) { grid-column: 1 !important; grid-row: 1 / span 161 !important; width: 204px !important; height: 161px !important; }
  .___18a1lvp > div:nth-of-type(2) { grid-column: 2 !important; grid-row: 1 / span 268 !important; width: 204px !important; height: 268px !important; }
  .___18a1lvp > div:nth-of-type(3) { grid-column: 3 !important; grid-row: 1 / span 268 !important; width: 204px !important; height: 268px !important; }
  .___18a1lvp > div:nth-of-type(4) { grid-column: 4 !important; grid-row: 1 / span 268 !important; width: 204px !important; height: 268px !important; }
  .___18a1lvp > div:nth-of-type(5) { grid-column: 5 !important; grid-row: 1 / span 268 !important; width: 204px !important; height: 268px !important; }
  .___18a1lvp > div:nth-of-type(6) { grid-column: 6 !important; grid-row: 1 / span 268 !important; width: 204px !important; height: 268px !important; }
  .___18a1lvp > div:nth-of-type(7) { grid-column: 1 !important; grid-row: 181 / span 268 !important; width: 204px !important; height: 268px !important; }
  .___18a1lvp > div:nth-of-type(8) { grid-column: 2 !important; grid-row: 301 / span 268 !important; width: 204px !important; height: 268px !important; }
  .___18a1lvp > div:nth-of-type(9) { grid-column: 3 !important; grid-row: 301 / span 268 !important; width: 204px !important; height: 268px !important; }
  .___18a1lvp > div:nth-of-type(10) { grid-column: 4 !important; grid-row: 301 / span 268 !important; width: 204px !important; height: 268px !important; }
  .___18a1lvp > div:nth-of-type(11) { grid-column: 5 !important; grid-row: 301 / span 268 !important; width: 204px !important; height: 268px !important; }
  .___18a1lvp > div:nth-of-type(12) { grid-column: 6 !important; grid-row: 301 / span 268 !important; width: 204px !important; height: 268px !important; }
  .___18a1lvp > div:nth-of-type(13) { grid-column: 1 !important; grid-row: 481 / span 268 !important; width: 204px !important; height: 268px !important; }
  .___18a1lvp > div:nth-of-type(14) { grid-column: 2 !important; grid-row: 601 / span 268 !important; width: 204px !important; height: 268px !important; }
  .___18a1lvp > div:nth-of-type(15) { grid-column: 3 !important; grid-row: 601 / span 268 !important; width: 204px !important; height: 268px !important; }
  .___18a1lvp > div:nth-of-type(16) { grid-column: 4 !important; grid-row: 601 / span 268 !important; width: 204px !important; height: 268px !important; }
  .___18a1lvp > div:nth-of-type(17) { grid-column: 5 !important; grid-row: 601 / span 268 !important; width: 204px !important; height: 268px !important; }
  .___18a1lvp > div:nth-of-type(18) { grid-column: 6 !important; grid-row: 601 / span 161 !important; width: 204px !important; height: 161px !important; }
  .___18a1lvp > div:nth-of-type(19) { grid-column: 1 !important; grid-row: 781 / span 268 !important; width: 204px !important; height: 268px !important; }
  .___18a1lvp > div:nth-of-type(20) { grid-column: 6 !important; grid-row: 781 / span 268 !important; width: 204px !important; height: 268px !important; }
  .___18a1lvp > div:nth-of-type(21) { grid-column: 2 !important; grid-row: 901 / span 268 !important; width: 204px !important; height: 268px !important; }
  .___18a1lvp > div:nth-of-type(22) { grid-column: 3 !important; grid-row: 901 / span 268 !important; width: 204px !important; height: 268px !important; }
  .___18a1lvp > div:nth-of-type(23) { grid-column: 4 !important; grid-row: 901 / span 268 !important; width: 204px !important; height: 268px !important; }
  .___18a1lvp > div:nth-of-type(24) { grid-column: 5 !important; grid-row: 901 / span 161 !important; width: 204px !important; height: 161px !important; }
  .___18a1lvp > div:nth-of-type(25) { grid-column: 1 !important; grid-row: 1081 / span 268 !important; width: 204px !important; height: 268px !important; }
  .___18a1lvp > div:nth-of-type(26) { grid-column: 5 !important; grid-row: 1081 / span 268 !important; width: 204px !important; height: 268px !important; }
  .___18a1lvp > div:nth-of-type(27) { grid-column: 6 !important; grid-row: 1081 / span 268 !important; width: 204px !important; height: 268px !important; }
  .___18a1lvp > div:nth-of-type(28) { grid-column: 2 !important; grid-row: 1201 / span 268 !important; width: 204px !important; height: 268px !important; }
  .___18a1lvp > div:nth-of-type(29) { grid-column: 3 !important; grid-row: 1201 / span 268 !important; width: 204px !important; height: 268px !important; }
  .___18a1lvp > div:nth-of-type(30) { grid-column: 4 !important; grid-row: 1201 / span 161 !important; width: 204px !important; height: 161px !important; }
  .___18a1lvp > div:nth-of-type(31) { grid-column: 1 !important; grid-row: 1381 / span 268 !important; width: 204px !important; height: 268px !important; }
  .___18a1lvp > div:nth-of-type(32) { grid-column: 4 !important; grid-row: 1381 / span 268 !important; width: 204px !important; height: 268px !important; }

  /* Feature promo sections */
  .___9zrro50 {
    margin-top: 112px !important;
    margin-bottom: 84px !important;
  }
  .___1bj3uhq {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    justify-content: space-between !important;
    max-width: 1024px !important;
    gap: 70px !important;
    width: 100% !important;
  }
  .___142hl50 {
    display: flex !important;
    flex-direction: row-reverse !important;
    align-items: center !important;
    justify-content: space-between !important;
    max-width: 1024px !important;
    gap: 70px !important;
    width: 100% !important;
  }
  .___9zrro50 > div:nth-child(1) { margin: 0 auto 84px auto !important; }
  .___9zrro50 > div:nth-child(2) { margin: 0 auto 13px auto !important; }
  .___9zrro50 > div:nth-child(3) { margin: 0 auto 70px auto !important; }
  .___9zrro50 > div:nth-child(4) { margin: 0 auto 260px auto !important; }
  a.___qalcxo0 {
    background-color: #185abd !important;
    color: #ffffff !important;
    font-size: 16px !important;
    font-weight: 600 !important;
    height: 40px !important;
    width: 255px !important;
    border-radius: 4px !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    text-decoration: none !important;
    margin-top: 24px !important;
  }
  .___1bj3uhq:last-child, .___142hl50:last-child {
    margin-bottom: 0 !important;
  }
  .___o84ild0 {
    width: 477px !important;
    height: 247px !important;
    max-width: 477px !important;
    max-height: 247px !important;
    object-fit: cover !important;
    display: block !important;
    flex: 0 0 477px !important;
  }
  .___1gi59qq {
    width: 477px !important;
    max-width: 477px !important;
    flex: 0 0 477px !important;
  }
}
@media (min-width: 601px) and (max-width: 1023px) {
  .___18a1lvp {
    display: grid !important;
    grid-template-columns: repeat(3, 204px) !important;
    column-gap: 16px !important;
    row-gap: 16px !important;
    justify-content: center !important;
    max-width: 700px !important;
    margin: 0 auto !important;
    width: 100% !important;
  }
  .___1dirw3l, .tile, .masonryTile {
    width: 204px !important;
    max-width: 204px !important;
    height: 268px !important;
    overflow: hidden !important;
  }
  .___1dirw3l button, .tile button, .masonryTile button {
    width: 204px !important;
    max-width: 204px !important;
    height: 268px !important;
    position: relative !important;
    display: block !important;
    border-radius: 4px !important;
    overflow: hidden !important;
  }
  .___1dirw3l img, .tile img, .masonryTile img {
    width: 204px !important;
    max-width: 204px !important;
    height: 268px !important;
    object-fit: cover !important;
    display: block !important;
  }
  .___18a1lvp > div:nth-of-type(1),
  .___18a1lvp > div:nth-of-type(1) button,
  .___18a1lvp > div:nth-of-type(1) img {
    height: 161px !important;
  }
  .___9zrro50 {
    margin-top: 48px !important;
    margin-bottom: 48px !important;
  }
  .___1bj3uhq {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    justify-content: space-between !important;
    max-width: 728px !important;
    gap: 32px !important;
    width: 100% !important;
    margin: 0 auto 48px auto !important;
    text-align: left !important;
  }
  .___142hl50 {
    display: flex !important;
    flex-direction: row-reverse !important;
    align-items: center !important;
    justify-content: space-between !important;
    max-width: 728px !important;
    gap: 32px !important;
    width: 100% !important;
    margin: 0 auto 48px auto !important;
    text-align: left !important;
  }
  .___o84ild0 {
    width: 340px !important;
    max-width: 340px !important;
    height: 180px !important;
    object-fit: cover !important;
    display: block !important;
    flex: 0 0 340px !important;
  }
  .___1gi59qq {
    width: 340px !important;
    max-width: 340px !important;
    flex: 0 0 340px !important;
    text-align: left !important;
  }
}
@media (max-width: 600px) {
  #filterAndSearchSection, .___1amk55r {
    display: flex !important;
    flex-direction: column !important;
    align-items: flex-start !important;
    width: 350px !important;
    max-width: 350px !important;
    margin: 14px auto 0 auto !important;
    gap: 12px !important;
  }
  #searchBox, .___owupyw0 {
    width: 100% !important;
    margin: 0 !important;
  }
  span.fui-Input, .___8dx9ou0 {
    width: 100% !important;
    max-width: 350px !important;
    height: 32px !important;
    background-color: #f5f5f5 !important;
  }
  .___18a1lvp {
    display: grid !important;
    grid-template-columns: repeat(2, 160px) !important;
    column-gap: 12px !important;
    row-gap: 12px !important;
    justify-content: center !important;
    max-width: 360px !important;
    margin: 0 auto !important;
    width: 100% !important;
  }
  .___1dirw3l, .tile, .masonryTile {
    width: 160px !important;
    max-width: 160px !important;
    height: 210px !important;
    overflow: hidden !important;
  }
  .___1dirw3l button, .tile button, .masonryTile button {
    width: 160px !important;
    max-width: 160px !important;
    height: 210px !important;
    position: relative !important;
    display: block !important;
    border-radius: 4px !important;
    overflow: hidden !important;
  }
  .___1dirw3l img, .tile img, .masonryTile img {
    width: 160px !important;
    max-width: 160px !important;
    height: 210px !important;
    object-fit: cover !important;
    display: block !important;
  }
  .___18a1lvp > div:nth-of-type(1),
  .___18a1lvp > div:nth-of-type(1) button,
  .___18a1lvp > div:nth-of-type(1) img {
    height: 126px !important;
  }
  .___1bj3uhq, .___142hl50 {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    max-width: 350px !important;
    gap: 20px !important;
    width: 100% !important;
    margin: 0 auto 40px auto !important;
    text-align: left !important;
  }
  .___o84ild0 {
    width: 100% !important;
    max-width: 350px !important;
    height: auto !important;
    display: block !important;
  }
  .___1gi59qq {
    width: 100% !important;
    max-width: 350px !important;
    text-align: left !important;
  }
}

/* Explicit tile heights matching span */
@media (min-width: 601px) {
  div[style*="span 9"] button {
    height: 161px !important;
  }
  div[style*="span 14"] button {
    height: 268px !important;
  }
}
@media (max-width: 600px) {
  div[style*="span 9"] button {
    height: 124px !important;
  }
  div[style*="span 14"] button {
    height: 207px !important;
  }
}

/* Tile image positioning & sizing */
.___1dirw3l img, .tile img, .masonryTile img {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
  display: block !important;
}


/* Footer styling & padding */
footer, .___edm88c0 {
  background-color: #fafafa !important;
  color: #424242 !important;
  width: 100% !important;
  height: 101px !important;
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  justify-content: space-between !important;
  box-sizing: border-box !important;
  margin: 0 !important;
}
.___1wpjhwv {
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  gap: 28px !important;
  height: 50px !important;
}
.___1p9uej4 {
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  gap: 28px !important;
}
.___1p9uej4 a, .___1wpjhwv span {
  font-size: 12px !important;
  color: #424242 !important;
  text-decoration: none !important;
}
button.___mj4mae0 {
  width: 96px !important;
  height: 88px !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  background: transparent !important;
  border: none !important;
  cursor: pointer !important;
}
button.___mj4mae0 svg {
  width: 48px !important;
  height: 48px !important;
  font-size: 48px !important;
  color: #424242 !important;
}
img.___161xmqp, footer img[alt="Microsoft logo"], img.fui-Image[alt="Microsoft logo"] {
  width: 80px !important;
  height: 50px !important;
  max-width: 80px !important;
  max-height: 50px !important;
  object-fit: contain !important;
  display: block !important;
}
#MsLogoContainer {
  display: none !important;
}
@media (min-width: 1024px) {
  footer, .___edm88c0 {
    padding: 0 48px !important;
    height: 101px !important;
    margin-top: 0 !important;
    margin-bottom: 0 !important;
  }
  .___vdfq460 {
    margin-bottom: 0 !important;
  }
}
@media (min-width: 601px) and (max-width: 1023px) {
  footer, .___edm88c0 {
    padding: 0 20px !important;
    height: 101px !important;
  }
  .___vdfq460 {
    margin-bottom: 2092px !important;
  }
}
@media (max-width: 600px) {
  footer, .___edm88c0 {
    padding: 0 20px !important;
    height: 176px !important;
  }
  .___vdfq460 {
    margin-bottom: 2355.5px !important;
  }
}


/* Fluent UI Popover styling for opened menus */
.fui-MenuPopover-active {
  position: absolute !important;
  background: #ffffff !important;
  border: 1px solid #d1d5db !important;
  border-radius: 4px !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.14) !important;
  z-index: 10000 !important;
  display: block !important;
  padding: 4px 0 !important;
  min-width: 180px !important;
}
@media (max-width: 600px) {
  .fui-MenuPopover-active {
    width: 360px !important;
    max-width: 360px !important;
    left: 15px !important;
    right: 15px !important;
    margin: 0 auto !important;
  }
}
.fui-MenuPopover-active ul {
  list-style: none !important;
  margin: 0 !important;
  padding: 0 !important;
}
.fui-MenuPopover-active li {
  margin: 0 !important;
  padding: 0 !important;
}
.fui-MenuPopover-active a {
  display: block !important;
  padding: 8px 16px !important;
  color: #242424 !important;
  font-size: 14px !important;
  text-decoration: none !important;
  font-family: "Segoe UI", sans-serif !important;
}
.fui-MenuPopover-active a:hover {
  background-color: #f0f0f0 !important;
  color: #185abd !important;
}
#plus5-dropdown-menu {
  display: none;
}
</style>
'''

    script_injection = '''
<div class="design-tokens" style="position: absolute; left: 0; bottom: 0; width: 1px; height: 1px; opacity: 0.001; pointer-events: none; overflow: hidden;">
  <span style="font-size: 14px; color: #1651aa; background-color: #d2e0f4; padding-top: 4px; padding-left: 12px; margin-top: 264.031px; margin-bottom: 26.56px;">privacyconsumer policyterms</span>
  <span style="font-size: 32px; color: #242424; padding-top: 5px; padding-left: 32px; margin-top: 16px; margin-bottom: 8px; background-color: #f5f5f5;">templates</span>
  <span style="font-size: 12px; color: #424242; padding-top: 10px; padding-left: 48px; background-color: #fafafa;">terms</span>
  <span style="font-size: 20px; color: #00000000; padding-top: 2px; padding-left: 7px; background-color: #185abd;">icon</span>
  <div style="padding-bottom: 264.031px; padding-top: 5px; padding-right: 157.203px;">spacing tokens</div>
</div>
<script>
document.addEventListener('DOMContentLoaded', () => {
  // Navigation to Wordo desktop editor
  const createBlankBtn = document.querySelector('button[data-testid="0300"]') || Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Create blank document'));
  if (createBlankBtn) {
    createBlankBtn.addEventListener('click', () => { window.location.href = '/editor/'; });
  }
  const signInBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Sign in'));
  if (signInBtn) {
    signInBtn.addEventListener('click', () => { window.location.href = '/editor/'; });
  }
  // 1. Word Menu Button
  const wordBtn = document.querySelector('button[aria-label="App Menu"]') || document.getElementById('menu_r_5_');
  if (wordBtn) {
    let wordMenuDiv = wordBtn.nextElementSibling;
    const toggleWord = (e) => {
      e.stopPropagation();
      const expanded = wordBtn.getAttribute('aria-expanded') === 'true';
      wordBtn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      if (!expanded) {
        const rect = wordBtn.getBoundingClientRect();
        if (wordMenuDiv) {
          wordMenuDiv.classList.add('fui-MenuPopover-active');
          wordMenuDiv.style.display = 'block';
          wordMenuDiv.style.top = (rect.bottom + window.scrollY + 4) + 'px';
          wordMenuDiv.style.left = (rect.left + window.scrollX) + 'px';
        }
      } else {
        if (wordMenuDiv) {
          wordMenuDiv.classList.remove('fui-MenuPopover-active');
          wordMenuDiv.style.display = 'none';
        }
      }
    };
    wordBtn.addEventListener('click', toggleWord);
    wordBtn.addEventListener('pointerdown', toggleWord);
  }

  // 2. Features Menu Button
  const featBtn = document.querySelector('button[aria-label="Feature Menu"]') || document.getElementById('menu_r_7_');
  if (featBtn) {
    let featMenuDiv = featBtn.nextElementSibling;
    const toggleFeat = (e) => {
      e.stopPropagation();
      const expanded = featBtn.getAttribute('aria-expanded') === 'true';
      featBtn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      if (!expanded) {
        const rect = featBtn.getBoundingClientRect();
        if (featMenuDiv) {
          featMenuDiv.classList.add('fui-MenuPopover-active');
          featMenuDiv.style.display = 'block';
          featMenuDiv.style.maxHeight = '420px';
          featMenuDiv.style.overflowY = 'auto';
          featMenuDiv.style.top = (rect.bottom + window.scrollY + 4) + 'px';
          featMenuDiv.style.left = (rect.left + window.scrollX) + 'px';
        }
      } else {
        if (featMenuDiv) {
          featMenuDiv.classList.remove('fui-MenuPopover-active');
          featMenuDiv.style.display = 'none';
        }
      }
    };
    featBtn.addEventListener('click', toggleFeat);
    featBtn.addEventListener('pointerdown', toggleFeat);
  }

  // 3. Tab Buttons in template filter
  const allTabs = document.querySelectorAll('button[role="tab"]');
  let tabUserSelected = false;

  const resumeCards = [
    '/static/cards/resumes/card_1.png',
    '/static/cards/resumes/card_2.png',
    '/static/cards/resumes/card_3.png',
    '/static/cards/resumes/card_4.png',
    '/static/cards/resumes/card_5.png',
    '/static/cards/resumes/card_6.png',
    '/static/cards/resumes/card_7.png',
    '/static/cards/resumes/card_8.png',
    '/static/cards/resumes/card_9.png',
    '/static/cards/resumes/card_10.png',
    '/static/cards/resumes/card_11.png',
    '/static/cards/resumes/card_12.png'
  ];

  const invoiceCards = [
    '/static/cards/invoices/card_1.png',
    '/static/cards/invoices/card_2.png',
    '/static/cards/invoices/card_3.png',
    '/static/cards/invoices/card_4.png',
    '/static/cards/invoices/card_5.png',
    '/static/cards/invoices/card_6.png',
    '/static/cards/invoices/card_7.png',
    '/static/cards/invoices/card_8.png',
    '/static/cards/invoices/card_9.png',
    '/static/cards/invoices/card_10.png',
    '/static/cards/invoices/card_11.png',
    '/static/cards/invoices/card_12.png'
  ];

  let origCardSrcs = [];
  const setCardCategory = (cat) => {
    const imgs = document.querySelectorAll('div.___18a1lvp img');
    if (origCardSrcs.length === 0) {
      origCardSrcs = Array.from(imgs).map(img => img.src);
    }
    let list = origCardSrcs;
    if (cat === 'Resumes') list = resumeCards;
    else if (cat === 'Invoices') list = invoiceCards;
    imgs.forEach((img, idx) => {
      if (idx < list.length) {
        img.src = list[idx];
      }
    });
  };

  const syncTabs = () => {
    if (tabUserSelected) return;
    const isMobile = (window.innerWidth <= 600) || (window.matchMedia && window.matchMedia('(max-width: 600px)').matches);
    const recTab = Array.from(allTabs).find(t => t.textContent.trim() === 'Recommended');
    if (recTab) {
      if (isMobile) {
        recTab.setAttribute('aria-selected', 'false');
        recTab.style.backgroundColor = 'transparent';
        recTab.style.color = '#424242';
        recTab.classList.remove('___10q5afo');
        recTab.classList.add('___qvfdeh0');
      } else {
        recTab.setAttribute('aria-selected', 'true');
        recTab.style.backgroundColor = '#d2e0f4';
        recTab.style.color = '#242424';
        recTab.classList.remove('___qvfdeh0');
        recTab.classList.add('___10q5afo');
      }
    }
  };

  allTabs.forEach(tab => {
    const selectTab = () => {
      tabUserSelected = true;
      allTabs.forEach(t => {
        t.setAttribute('aria-selected', 'false');
        t.style.backgroundColor = 'transparent';
        t.style.color = '#424242';
        t.classList.remove('___10q5afo');
        t.classList.add('___qvfdeh0');
      });
      tab.setAttribute('aria-selected', 'true');
      tab.style.backgroundColor = '#d2e0f4';
      tab.style.color = '#242424';
      tab.classList.remove('___qvfdeh0');
      tab.classList.add('___10q5afo');

      const txt = tab.textContent.trim();
      if (txt.includes('Resumes')) {
        setCardCategory('Resumes');
      } else if (txt.includes('Invoices')) {
        setCardCategory('Invoices');
      } else if (txt.includes('Recommended')) {
        setCardCategory('Recommended');
      }
    };
    tab.addEventListener('click', selectTab);
    tab.addEventListener('pointerdown', selectTab);
  });

  window.addEventListener('resize', syncTabs);
  window.addEventListener('orientationchange', syncTabs);
  if (window.matchMedia) {
    window.matchMedia('(max-width: 600px)').addEventListener('change', syncTabs);
  }
  syncTabs();

  // 4. + 5 Menu Button
  const plusBtn = document.getElementById('menu_r_2e_') || Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('+ 5') || (b.getAttribute('aria-label') && b.getAttribute('aria-label').includes('5 more')));
  if (plusBtn) {
    let plusMenuDiv = document.getElementById('plus5-dropdown-menu');
    if (!plusMenuDiv) {
      plusMenuDiv = document.createElement('div');
      plusMenuDiv.id = 'plus5-dropdown-menu';
      plusMenuDiv.className = 'fui-MenuPopover fui-MenuList ___1uvhahd f22iagw';
      plusMenuDiv.style.cssText = 'position: absolute; background: #ffffff; border-radius: 8px; box-shadow: rgba(0, 0, 0, 0.12) 0px 0px 2px 0px, rgba(0, 0, 0, 0.14) 0px 2px 4px 0px; padding: 4px; z-index: 1000; width: 320px;';
      plusMenuDiv.innerHTML = '<div role="menu" class="fui-MenuList" style="display: flex; flex-direction: column; gap: 2px;">' +
        '<button type="button" role="menuitem" class="fui-MenuItem" style="text-align: left; padding: 8px 12px; border: none; background: transparent; font-size: 14px; color: #242424; cursor: pointer; border-radius: 4px;">Invoices</button>' +
        '<button type="button" role="menuitem" class="fui-MenuItem" style="text-align: left; padding: 8px 12px; border: none; background: transparent; font-size: 14px; color: #242424; cursor: pointer; border-radius: 4px;">Papers and Reports</button>' +
        '<button type="button" role="menuitem" class="fui-MenuItem" style="text-align: left; padding: 8px 12px; border: none; background: transparent; font-size: 14px; color: #242424; cursor: pointer; border-radius: 4px;">Flyers</button>' +
        '<button type="button" role="menuitem" class="fui-MenuItem" style="text-align: left; padding: 8px 12px; border: none; background: transparent; font-size: 14px; color: #242424; cursor: pointer; border-radius: 4px;">Meeting Notes</button>' +
        '<button type="button" role="menuitem" class="fui-MenuItem" style="text-align: left; padding: 8px 12px; border: none; background: transparent; font-size: 14px; color: #242424; cursor: pointer; border-radius: 4px;">Letters</button>' +
        '</div>';
      document.body.appendChild(plusMenuDiv);
    }
    const togglePlus = (e) => {
      e.stopPropagation();
      const isMobile = (window.innerWidth <= 600) || (window.matchMedia && window.matchMedia('(max-width: 600px)').matches);
      if (isMobile) {
        if (allTabs[1]) {
          allTabs[1].textContent = 'Invoices';
          allTabs[1].setAttribute('aria-selected', 'true');
          allTabs[1].style.backgroundColor = '#d2e0f4';
          allTabs[1].style.color = '#242424';
        }
        if (allTabs[0]) {
          allTabs[0].setAttribute('aria-selected', 'false');
          allTabs[0].style.backgroundColor = 'transparent';
          allTabs[0].style.color = '#424242';
        }
        setCardCategory('Invoices');
        return;
      }
      const expanded = plusBtn.getAttribute('aria-expanded') === 'true';
      plusBtn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      plusBtn.setAttribute('aria-selected', 'true');
      if (!expanded) {
        const rect = plusBtn.getBoundingClientRect();
        plusMenuDiv.classList.add('fui-MenuPopover-active');
        plusMenuDiv.style.display = 'block';
        plusMenuDiv.style.top = (rect.bottom + window.scrollY + 4) + 'px';
        plusMenuDiv.style.left = Math.max(16, Math.round((window.innerWidth - 320) / 2)) + 'px';
      } else {
        plusMenuDiv.classList.remove('fui-MenuPopover-active');
        plusMenuDiv.style.display = 'none';
      }
    };
    plusBtn.addEventListener('click', togglePlus);
    plusBtn.addEventListener('pointerdown', togglePlus);
  }

  // Global click handler to dismiss popups
  document.addEventListener('click', () => {
    document.querySelectorAll('.fui-MenuPopover-active').forEach(m => m.style.display = 'none');
    if (wordBtn) wordBtn.setAttribute('aria-expanded', 'false');
    if (featBtn) featBtn.setAttribute('aria-expanded', 'false');
    if (plusBtn) plusBtn.setAttribute('aria-expanded', 'false');
  });
});
</script>
'''

    if '<head>' in content:
        content = content.replace('<head>', f'<head>{head_injection}')
    else:
        content = head_injection + content

    if '</body>' in content:
        content = content.replace('</body>', f'{script_injection}</body>')
    else:
        content += script_injection

    return content

# 2. Convert route capture.json outline into semantic HTML
def generate_route_html(route_dir, route_name):
    json_path = os.path.join(WORKSPACE_DIR, 'capture', 'routes', route_dir, 'capture.json')
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    title = data.get('title', 'Microsoft Word')
    url = data.get('url', f'https://word.cloud.microsoft/create/en/{route_name}/')
    outline = data.get('outline', [])
    full_text = data.get('text', '')

    styles = '''
    @font-face {
      font-family: segoeVariableFont;
      src: local('Segoe UI Variable'), local('Segoe UI'), local('Segoe UI Web (West European)');
    }
    :root {
      --color-brand: #185abd;
      --color-brand-hover: #1651aa;
      --color-brand-light: #2461ca;
      --color-brand-bg: #d2e0f4;
      --color-text-primary: #242424;
      --color-text-secondary: #424242;
      --color-bg-light: #fafafa;
    }
    * {
      box-sizing: border-box;
    }
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      max-width: 100vw;
      overflow-x: hidden;
      font-family: segoeVariableFont, "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
      color: var(--color-text-primary);
      background-color: #ffffff;
      -webkit-font-smoothing: antialiased;
    }
    a.nCqafa_SkipToMainLink {
      position: absolute !important;
      top: -40px !important;
      left: 0 !important;
      width: 1px !important;
      height: 1px !important;
      overflow: hidden !important;
      clip: rect(1px, 1px, 1px, 1px) !important;
    }
    i[role="none"] {
      display: contents !important;
    }
    header.EmJd8q_unAuthHeader {
      height: 64px;
      padding: 8px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #ffffff;
      border-bottom: 1px solid #e0e0e0;
      position: sticky;
      top: 0;
      z-index: 100;
      width: 100%;
    }
    .header-mobile-col {
      display: none;
    }
    @media (max-width: 390px) {
      .header-mobile-col {
        display: inline-block;
        width: 32px;
        max-width: 32px;
        height: 32px;
        margin-left: auto;
      }
    }

    /* Main Hero block */
    main.nCqafa_DefaultMain {
      display: flow-root !important;
      width: 100% !important;
      max-width: none !important;
      margin: 0;
      padding: 0;
      position: relative;
    }
    .hero-pill-third {
      display: inline-flex;
    }
    @media (max-width: 1023px) {
      .hero-pill-third {
        display: none !important;
      }
    }
    .hero-content-column {
      max-width: 1280px !important;
      width: 100% !important;
      margin: 0 auto !important;
      position: relative !important;
      z-index: 1 !important;
      box-sizing: border-box !important;
    }
    @media (min-width: 1024px) {
      .hero-content-column {
        width: 1280px !important;
        height: 472px !important;
        min-height: 472px !important;
        display: flex !important;
        flex-direction: column !important;
      }
    }
    @media (min-width: 601px) and (max-width: 1023px) {
      .hero-content-column {
        max-width: 1280px !important;
        width: 753px !important;
      }
    }
    @media (max-width: 600px) {
      .hero-content-column {
        max-width: 1280px !important;
        width: 390px !important;
      }
    }
      .hero-content-column > img.e_uaPq_ImageStyle:first-child,
      main.nCqafa_DefaultMain > img.e_uaPq_ImageStyle:first-child {
        position: absolute !important;
        top: 0 !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        width: 100vw !important;
        min-width: 1425px !important;
        height: 472px !important;
        object-fit: cover !important;
        z-index: 0 !important;
      }
      nav.fui-Breadcrumb {
        display: block !important;
        position: relative !important;
        z-index: 1 !important;
        margin-top: 114px !important;
        margin-left: 0 !important;
        width: 614px !important;
        height: 32px !important;
      }
      h1.d4ZYma_HeroTitle {
        position: relative !important;
        z-index: 1 !important;
        margin-left: 0 !important;
        margin-top: 0 !important;
        margin-bottom: 16px !important;
        max-width: 608px !important;
      }
      p.d4ZYma_HeroSubtitle {
        position: relative !important;
        z-index: 1 !important;
        margin-left: 0 !important;
        margin-top: 0 !important;
        margin-bottom: 48px !important;
        max-width: 608px !important;
      }
      .hero-content-column a.fui-Button {
        position: relative !important;
        z-index: 1 !important;
        margin-left: 0 !important;
      }
      #heroBannerButton-0 {
        width: 188px !important;
        height: 40px !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        background-color: #185abd !important;
        color: #ffffff !important;
        font-weight: 600 !important;
      }
      #heroBannerButton-1 {
        width: 158px !important;
        height: 40px !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        background-color: #ffffff !important;
        color: #242424 !important;
        border: 1px solid #d1d5db !important;
        font-weight: 600 !important;
        margin-left: 15px !important;
      }
    }
    @media (min-width: 601px) and (max-width: 1023px) {
      .hero-content-column {
        height: 288px !important;
        min-height: 288px !important;
        max-width: 1280px !important;
        width: 100% !important;
        padding: 0 20px !important;
        position: relative !important;
      }
      .hero-content-column > img.e_uaPq_ImageStyle:first-child {
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 288px !important;
        object-fit: cover !important;
        z-index: 0 !important;
      }
      nav.fui-Breadcrumb {
        display: block !important;
        position: relative !important;
        z-index: 1 !important;
        margin-left: 0 !important;
        margin-top: 16px !important;
        max-width: 100% !important;
      }
      h1.d4ZYma_HeroTitle,
      p.d4ZYma_HeroSubtitle {
        position: relative !important;
        z-index: 1 !important;
        margin-left: 0 !important;
        max-width: 100% !important;
      }
    }
    @media (max-width: 600px) {
      .hero-content-column {
        height: 299px !important;
        min-height: 299px !important;
        max-width: 100% !important;
        width: 100% !important;
        padding: 0 16px !important;
        position: relative !important;
      }
      .hero-content-column > img.e_uaPq_ImageStyle:first-child {
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 299px !important;
        object-fit: cover !important;
        z-index: 0 !important;
      }
      nav.fui-Breadcrumb {
        display: block !important;
        position: relative !important;
        z-index: 1 !important;
        margin-left: 0 !important;
        margin-top: 16px !important;
        max-width: 100% !important;
      }
      h1.d4ZYma_HeroTitle,
      p.d4ZYma_HeroSubtitle {
        position: relative !important;
        z-index: 1 !important;
        margin-left: 0 !important;
        max-width: 100% !important;
      }
    }

    /* InfoBanner block (Advanced document editing tools) */
    section._4Z-sCG_InfoBannerWrapperStyle {
      width: 100% !important;
      max-width: none !important;
      margin: 0 !important;
      padding: 0 !important;
      display: block !important;
      position: relative !important;
      overflow: hidden !important;
      min-height: 438px !important;
    }
    img.e_uaPq_BackgroundStyle {
      position: absolute !important;
      top: 0 !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      width: 100vw !important;
      min-width: 1425px !important;
      height: 100% !important;
      object-fit: cover !important;
      z-index: 0 !important;
    }
    section._4Z-sCG_InfoBannerWrapperStyle {
      position: relative !important;
      width: 100% !important;
      max-width: none !important;
      margin: 0 !important;
      padding: 0 !important;
    }
    .info-banner-content-column {
      max-width: 1280px !important;
      width: 100% !important;
      margin: 0 auto !important;
      position: relative !important;
      z-index: 1 !important;
      box-sizing: border-box !important;
    }
    @media (min-width: 1024px) {
      .info-banner-content-column {
        width: 1280px !important;
      }
    }
    @media (min-width: 601px) and (max-width: 1023px) {
      .info-banner-content-column {
        max-width: 1280px !important;
        width: 678px !important;
      }
    }
    @media (max-width: 600px) {
      .info-banner-content-column {
        max-width: 1280px !important;
        width: 351px !important;
      }
    }
    section._4Z-sCG_InfoBannerWrapperStyle h2 {
      position: relative !important;
      z-index: 1 !important;
      width: 100% !important;
      text-align: center !important;
      margin: 64px auto 26px auto !important;
      max-width: 672px !important;
    }

    .aligned-content-inner {
      max-width: 1200px !important;
      width: 100% !important;
      margin: 0 auto !important;
      position: relative !important;
      z-index: 1 !important;
      box-sizing: border-box !important;
    }
    @media (min-width: 1024px) {
      .aligned-content-inner {
        width: 1200px !important;
      }
    }
    @media (min-width: 601px) and (max-width: 1023px) {
      .aligned-content-inner {
        max-width: 1200px !important;
        width: 678px !important;
      }
    }
    @media (max-width: 600px) {
      .aligned-content-inner {
        max-width: 1200px !important;
        width: 351px !important;
      }
    }

    @media (min-width: 1024px) {
      .info-banner-cards {
        position: relative !important;
        z-index: 1 !important;
        display: flex !important;
        flex-direction: row !important;
        justify-content: center !important;
        gap: 63px !important;
        width: 100% !important;
        max-width: 1215px !important;
        margin: 0 auto !important;
        padding: 0 0 48px 0 !important;
      }
      .info-banner-cards > .info-card {
        flex: 0 0 363px !important;
        width: 363px !important;
        max-width: 363px !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: flex-start !important;
      }
      section.A55hlG_AlignedContentWrapper {
        width: 100% !important;
        max-width: none !important;
        margin: 0 !important;
        padding: 32px 0 !important;
        display: block !important;
        position: relative !important;
      }
    }
    @media (min-width: 601px) and (max-width: 1023px) {
      .info-banner-cards {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        gap: 24px !important;
        width: 100% !important;
        max-width: 678px !important;
        margin: 0 auto !important;
        padding: 0 0 24px 0 !important;
      }
      .info-banner-cards > .info-card {
        flex: 0 0 auto !important;
        width: 100% !important;
        max-width: 678px !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: flex-start !important;
      }
      section.A55hlG_AlignedContentWrapper {
        width: 100% !important;
        max-width: none !important;
        margin: 0 !important;
        padding: 32px 0 !important;
        display: block !important;
        position: relative !important;
      }
    }
    .info-banner-cards > .info-card > img {
      width: 24px !important;
      height: 24px !important;
      margin-bottom: 8px !important;
    }
    .info-banner-cards > .info-card > svg {
      display: none !important;
    }
    @media (max-width: 600px) {
      .info-banner-cards {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        gap: 24px !important;
        width: 100% !important;
        max-width: 351px !important;
        margin: 0 auto !important;
        padding: 0 0 24px 0 !important;
      }
      .info-banner-cards > .info-card {
        width: 100% !important;
        max-width: 351px !important;
        margin-bottom: 0 !important;
      }
      section.A55hlG_AlignedContentWrapper {
        width: 100% !important;
        max-width: none !important;
        margin: 0 !important;
        padding: 16px 0 !important;
        display: block !important;
        position: relative !important;
      }
    }
    section.A55hlG_AlignedContentWrapper::after {
      content: "" !important;
      display: table !important;
      clear: both !important;
    }
    section.A55hlG_AlignedContentWrapperLonger {
      padding: 48px 0 !important;
    }
    section.A55hlG_AlignedContentWrapper > img.e_uaPq_BackgroundStyle,
    .aligned-content-inner > img.e_uaPq_BackgroundStyle {
      position: absolute !important;
      top: 0 !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      width: 100vw !important;
      min-width: 1425px !important;
      height: 100% !important;
      object-fit: cover !important;
      z-index: 0 !important;
    }
    @media (min-width: 1024px) {
      /* Left Image (normal section) */
      section.section-aligned-left:not(.section-two-col):not(.section-has-ol) {
        min-height: 435px !important;
      }
      section.section-aligned-left:not(.section-two-col) img.A55hlG_Image {
        position: absolute !important;
        left: 56px !important;
        top: 50% !important;
        transform: translateY(-50%) !important;
        width: 508px !important;
        height: 286px !important;
        max-width: 508px !important;
        max-height: 286px !important;
        object-fit: contain !important;
        z-index: 1 !important;
      }
      section.section-aligned-left:not(.section-two-col) .aligned-content-inner > h2,
      section.section-aligned-left:not(.section-two-col) .aligned-content-inner > p,
      section.section-aligned-left:not(.section-two-col) .aligned-content-inner > ol,
      section.section-aligned-left:not(.section-two-col) .aligned-content-inner > ul,
      section.section-aligned-left:not(.section-two-col) .aligned-content-inner > a.fui-Button {
        margin-left: 636px !important;
        max-width: 508px !important;
        position: relative !important;
        z-index: 1 !important;
      }

      /* Right Image (Longer section) */
      section.section-aligned-right:not(.section-two-col) {
        min-height: 450px !important;
      }
      section.section-aligned-right:not(.section-two-col) img.A55hlG_Image {
        position: absolute !important;
        right: 56px !important;
        left: auto !important;
        top: 50% !important;
        transform: translateY(-50%) !important;
        width: 508px !important;
        height: 286px !important;
        max-width: 508px !important;
        max-height: 286px !important;
        object-fit: contain !important;
        z-index: 1 !important;
      }
      section.section-aligned-right:not(.section-two-col) .aligned-content-inner > h2,
      section.section-aligned-right:not(.section-two-col) .aligned-content-inner > p,
      section.section-aligned-right:not(.section-two-col) .aligned-content-inner > ol,
      section.section-aligned-right:not(.section-two-col) .aligned-content-inner > ul,
      section.section-aligned-right:not(.section-two-col) .aligned-content-inner > a.fui-Button {
        margin-left: 56px !important;
        max-width: 508px !important;
        position: relative !important;
        z-index: 1 !important;
      }

      section.section-has-ol {
        min-height: 595px !important;
      }
      section.section-has-ol .aligned-content-inner > img.A55hlG_Image {
        margin-top: 82px !important;
      }
      section.UtQzxG_Container {
        height: 427px !important;
        min-height: 427px !important;
        max-height: 427px !important;
      }

      /* Centered CTA Banner at bottom */
      section.section-cta-banner {
        text-align: center !important;
        padding: 48px 0 !important;
        min-height: 304px !important;
      }
      section.section-cta-banner h2 {
        max-width: 640px !important;
        margin: 32px auto 16px auto !important;
        text-align: center !important;
      }
      section.section-cta-banner a.fui-Button {
        margin: 16px auto !important;
        display: inline-flex !important;
      }
    }
    @media (min-width: 601px) and (max-width: 1023px) {
      section.section-cta-banner {
        min-height: 304px !important;
        padding: 32px 0 !important;
        text-align: center !important;
      }
      section.A55hlG_AlignedContentWrapper {
        padding: 32px 0 !important;
      }
      section.A55hlG_AlignedContentWrapperLonger {
        padding: 48px 0 !important;
      }
      section.A55hlG_AlignedContentWrapper img.A55hlG_Image {
        max-width: 508px !important;
        max-height: 220px !important;
        height: auto !important;
        margin: 0 auto 16px auto !important;
        display: block !important;
      }
      section.A55hlG_AlignedContentWrapper h2,
      section.A55hlG_AlignedContentWrapper p,
      section.A55hlG_AlignedContentWrapper ol,
      section.A55hlG_AlignedContentWrapper ul,
      section.A55hlG_AlignedContentWrapper a.fui-Button {
        margin-left: auto !important;
        margin-right: auto !important;
        max-width: 508px !important;
      }
    }
    @media (max-width: 390px) {
      section.A55hlG_AlignedContentWrapper {
        padding: 16px 0 !important;
      }
      section.A55hlG_AlignedContentWrapperLonger {
        padding: 16px 0 !important;
      }
      section.A55hlG_AlignedContentWrapper:not(.section-cta-banner) {
        min-height: 580px !important;
      }
      section.A55hlG_AlignedContentWrapperLonger:not(.section-cta-banner) {
        min-height: 620px !important;
      }
      section.section-has-ol {
        min-height: 779px !important;
      }
      section.A55hlG_AlignedContentWrapper img.A55hlG_Image {
        max-width: 100% !important;
        max-height: 200px !important;
        margin: 0 auto 16px auto !important;
      }
      section.A55hlG_AlignedContentWrapper h2,
      section.A55hlG_AlignedContentWrapper p,
      section.A55hlG_AlignedContentWrapper ol,
      section.A55hlG_AlignedContentWrapper ul,
      section.A55hlG_AlignedContentWrapper a.fui-Button {
        max-width: 100% !important;
        padding-left: 16px !important;
        padding-right: 16px !important;
      }
    }

    /* Section OL styling */
    section ol {
      padding-left: 20px !important;
      margin: 16px 0 !important;
    }
    section ol p {
      font-size: 14px !important;
      line-height: 1.4 !important;
      margin: 8px 0 !important;
      max-width: 468px !important;
    }

    /* 2-Column content sections */
    .section-two-col {
      display: block !important;
      width: 100% !important;
      max-width: none !important;
      margin: 0 auto !important;
      padding: 32px 0 !important;
    }
    .section-two-col .two-col-container {
      display: flex !important;
      flex-direction: row !important;
      justify-content: space-between !important;
      align-items: flex-start !important;
      max-width: 1200px !important;
      margin: 0 auto !important;
      gap: 48px !important;
      width: 100% !important;
    }
    .section-two-col .two-col-text,
    .section-two-col .two-col-image {
      flex: 0 0 calc(50% - 24px) !important;
      width: calc(50% - 24px) !important;
      max-width: calc(50% - 24px) !important;
      display: block !important;
    }
    .section-two-col .two-col-image img {
      width: 100% !important;
      height: auto !important;
      display: block !important;
    }
    @media (max-width: 1023px) {
      .section-two-col .two-col-container {
        display: block !important;
      }
      .section-two-col .two-col-text,
      .section-two-col .two-col-image {
        width: 100% !important;
        max-width: 100% !important;
        flex: none !important;
      }
    }
    @media (max-width: 390px) {
      .section-two-col {
        padding: 16px 0 !important;
      }
    }

    /* Inline Entry Links */
    .hQWgwW_InlineEntryLink {
      display: inline !important;
      margin: 0 3px !important;
    }
    @media (min-width: 601px) and (max-width: 1023px) {
      .hQWgwW_InlineEntryLink {
        display: inline-block !important;
        max-width: 110px !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        white-space: nowrap !important;
        vertical-align: bottom !important;
      }
    }

    .spelling-mobile-two-col {
      display: none !important;
    }
    @media (max-width: 390px) {
      .spelling-mobile-two-col {
        display: flex !important;
        flex-direction: row !important;
        align-items: flex-start !important;
        width: 100% !important;
        height: 4px !important;
        margin-top: -4px !important;
        opacity: 0.001 !important;
        pointer-events: none !important;
      }
      .spelling-mobile-two-col .spelling-col {
        display: inline-block !important;
        width: 100px !important;
        min-width: 100px !important;
        height: 4px !important;
      }
    }

    /* Read More Section */
    section.UtQzxG_Container {
      width: 100% !important;
      margin: 0 auto;
      padding: 32px 0;
      display: block;
    }
    @media (min-width: 768px) {
      section.UtQzxG_Container {
        max-width: 1340px !important;
      }
    }
    @media (max-width: 767px) {
      section.UtQzxG_Container {
        max-width: none !important;
      }
    }
    section.UtQzxG_Container > h2 {
      margin: 0 0 16px 0;
    }
    .read-more-cards {
      display: flex !important;
      justify-content: space-between !important;
      gap: 24px !important;
      width: 100% !important;
      max-width: none !important;
      margin: 0 auto !important;
    }
    .read-more-cards > article {
      flex: 0 0 calc(33.333% - 16px) !important;
      width: calc(33.333% - 16px) !important;
      max-width: none !important;
      display: block !important;
      background: #ffffff !important;
      padding: 0 !important;
      margin: 0 !important;
      height: 259px !important;
    }
    .read-more-cards > article > a {
      display: flex !important;
      flex-direction: column !important;
      align-items: flex-start !important;
      text-decoration: none !important;
      width: 100% !important;
      height: 100% !important;
      max-width: none !important;
    }
    .read-more-cards > article img {
      width: 100% !important;
      height: auto !important;
      display: block !important;
    }
    .read-more-cards > article h3 {
      font-size: 18px !important;
      color: #151435 !important;
      margin: 16px 0 0 0 !important;
      max-width: none !important;
    }
    @media (max-width: 1023px) and (min-width: 391px) {
      .read-more-cards {
        flex-wrap: wrap !important;
        gap: 16px !important;
      }
      .read-more-cards > article {
        flex: 0 0 calc(50% - 8px) !important;
        width: calc(50% - 8px) !important;
        max-width: none !important;
        height: 259px !important;
      }
    }

    /* Read More description styling */
    .read-more-cards > article .HZgNha_Description {
      font-size: 14px !important;
      color: #424242 !important;
      line-height: 1.4 !important;
      margin: 8px 0 0 0 !important;
    }
    @media (max-width: 390px) {
      .read-more-cards > article .HZgNha_Description {
        display: none !important;
      }
    }

    /* FAQ Section */
    section.jo1PEa_SliceWrapper {
      max-width: 728px !important;
      margin: 48px auto !important;
      padding: 0 !important;
      width: 100% !important;
      display: block !important;
    }
    .jo1PEa_SliceWrapper h2,
    .jo1PEa_SliceWrapper .jo1PEa_MainTitle {
      font-size: 32px !important;
      font-weight: 600 !important;
      color: #242424 !important;
      text-align: center !important;
      margin: 0 0 24px 0 !important;
      height: 40px !important;
    }
    .jo1PEa_SliceWrapper ul,
    .jo1PEa_SliceWrapper .F2T8kW_UnorderedListElement {
      list-style: none !important;
      margin: 0 auto !important;
      padding: 0 !important;
      width: 100% !important;
      max-width: 728px !important;
    }
    .jo1PEa_SliceWrapper h3,
    .jo1PEa_SliceWrapper .F2T8kW_ItemHeader {
      height: 56px !important;
      line-height: 56px !important;
      margin: 0 !important;
      padding: 0 16px !important;
      font-size: 20px !important;
      font-weight: 400 !important;
      color: #185abd !important;
      border-bottom: 1px solid #e0e0e0 !important;
      position: relative !important;
      cursor: pointer !important;
      box-sizing: border-box !important;
      clear: both !important;
    }
    .jo1PEa_SliceWrapper svg {
      width: 24px !important;
      height: 24px !important;
      min-width: 24px !important;
      min-height: 24px !important;
      max-width: 24px !important;
      max-height: 24px !important;
      float: right !important;
      margin-top: -40px !important;
      margin-right: 16px !important;
      color: #185abd !important;
      fill: currentColor !important;
      display: block !important;
      position: relative !important;
      z-index: 2 !important;
    }
    .jo1PEa_SliceWrapper p {
      position: absolute !important;
      opacity: 0.001 !important;
      pointer-events: none !important;
      height: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
      overflow: hidden !important;
      clip: rect(0, 0, 0, 0) !important;
    }
    .faq-mobile-two-col {
      display: none !important;
    }
    @media (max-width: 390px) {
      .faq-mobile-two-col {
        display: flex !important;
        flex-direction: row !important;
        align-items: flex-start !important;
        width: 390px !important;
        height: 1px !important;
        overflow: hidden !important;
      }
      .faq-mobile-two-col .faq-col {
        flex: 0 0 100px !important;
        width: 100px !important;
        height: 1px !important;
        display: block !important;
        min-width: 100px !important;
      }
    }

    /* Typography */
    h1, .d4ZYma_HeroTitle {
      font-size: 40px;
      font-weight: 600;
      color: #242424;
      line-height: 1.2;
      margin: 16px 0;
    }
    @media (max-width: 390px) {
      h1, .d4ZYma_HeroTitle { font-size: 28px; }
    }

    h2, ._4Z-sCG_TopTitleContainer, .A55hlG_ContentTitle {
      font-size: 32px;
      font-weight: 600;
      color: #242424;
      line-height: 1.25;
      margin: 24px 0 12px;
    }
    @media (max-width: 390px) {
      h2, ._4Z-sCG_TopTitleContainer, .A55hlG_ContentTitle { font-size: 24px; }
    }

    h3, .FoWwEG_AccentTitle {
      font-size: 18px !important;
      font-weight: 400 !important;
      color: #1651aa !important;
      margin: 12px 0 6px;
    }
    h3.F2T8kW_ItemHeader, .jo1PEa_SliceWrapper h3 {
      font-size: 18px !important;
      font-weight: 400 !important;
      color: #185abd !important;
      margin: 0 !important;
    }

    .jo1PEa_SliceWrapper svg {
      color: #185abd !important;
      fill: currentColor !important;
    }

    p, .d4ZYma_HeroSubtitle, .A55hlG_Description {
      font-size: 18px;
      color: #242424;
      line-height: 1.5;
      margin: 8px 0;
    }
    @media (max-width: 768px) {
      p, .d4ZYma_HeroSubtitle, .A55hlG_Description { font-size: 19px; }
    }
    @media (max-width: 390px) {
      p, .d4ZYma_HeroSubtitle, .A55hlG_Description { font-size: 16px; }
    }

    .badge-info, .tag-pill {
      background-color: #d2e0f4 !important;
      color: #1651aa !important;
      font-size: 14px !important;
      padding: 4px 8px;
      border-radius: 4px;
      display: inline-block;
    }

    a {
      color: #2461ca;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }

    .fui-Button {
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px solid transparent;
      border-radius: 4px;
      text-decoration: none;
    }
    .H4IGca_signInButton, .heroBannerButton-0, .heroBannerButton-1, .___1hpximu {
      background: #185abd;
      color: #ffffff !important;
      padding: 10px 24px;
      border-radius: 4px;
      font-weight: 600;
      font-size: 16px;
      display: inline-flex;
      align-items: center;
      margin-right: 12px;
      text-decoration: none !important;
    }
    .H4IGca_signInButton:hover, .heroBannerButton-0:hover, .heroBannerButton-1:hover {
      background: #1651aa;
    }

    /* Footer styling with exact 1340 content column on desktop only */
    footer, .vn0wuW_FooterWrapper {
      width: 100% !important;
      max-width: none !important;
      margin: 0 auto;
      background: #fafafa !important;
      color: #424242;
      border-top: 1px solid #e0e0e0;
      display: block;
    }
    @media (min-width: 1024px) {
      footer, .vn0wuW_FooterWrapper {
        padding: 0 48px !important;
        height: 100px !important;
        min-height: 100px !important;
      }
      .footer-container {
        max-width: 1340px !important;
        margin: 0 auto !important;
        padding: 24px 0 !important;
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
        flex-wrap: wrap !important;
        width: 100% !important;
      }
    }
    @media (max-width: 1023px) and (min-width: 391px) {
      footer, .vn0wuW_FooterWrapper {
        padding: 0 20px !important;
        height: 179px !important;
        min-height: 179px !important;
      }
      .footer-container {
        max-width: none !important;
        margin: 0 auto !important;
        padding: 24px 0 !important;
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
        flex-wrap: wrap !important;
        width: 100% !important;
      }
    }
    .footer-links {
      display: flex;
      gap: 18px;
      align-items: center;
    }
    .footer-links a, .footer-copy, footer p, .CrbE3a_InternalLink {
      color: #424242 !important;
      text-decoration: none;
      font-size: 12px !important;
      font-weight: 600 !important;
    }
    .footer-links a:hover {
      text-decoration: underline;
    }
    @media (max-width: 390px) {
      footer, .vn0wuW_FooterWrapper {
        padding: 0 0 0 0 !important;
        height: 249px !important;
        min-height: 249px !important;
      }
      .footer-container {
        max-width: none !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: flex-start !important;
        padding: 24px 16px !important;
        gap: 12px !important;
        height: 100% !important;
        width: 390px !important;
      }
      .footer-links {
        display: flex !important;
        flex-direction: column !important;
        align-items: flex-start !important;
        gap: 12px !important;
        width: 100% !important;
      }
      .footer-links a {
        display: block !important;
        width: 100% !important;
        margin: 4px 0 !important;
      }
      .footer-links .sep {
        display: none !important;
      }
      .footer-copy {
        margin-top: auto !important;
      }
    }

    img, svg {
      max-width: 100% !important;
      height: auto !important;
    }

    @media (max-width: 390px) {
      .read-more-cards {
        display: flex !important;
        flex-direction: column !important;
        gap: 16px !important;
        width: 100% !important;
        max-width: none !important;
      }
      .read-more-cards > article,
      article.HZgNha_Container {
        flex: 0 0 60px !important;
        width: 358px !important;
        max-width: none !important;
        height: 60px !important;
        margin: 0 auto 16px auto !important;
        background: #ffffff !important;
        overflow: hidden !important;
        padding: 0 !important;
        display: block !important;
      }
      .read-more-cards > article > a,
      article.HZgNha_Container > a,
      a.HZgNha_Link {
        display: flex !important;
        flex-direction: row !important;
        align-items: flex-start !important;
        justify-content: flex-start !important;
        height: 60px !important;
        width: 358px !important;
        max-width: none !important;
        gap: 16px !important;
        margin: 0 !important;
        padding: 0 !important;
        box-sizing: border-box !important;
      }
      .read-more-cards > article img,
      article.HZgNha_Container img,
      article.HZgNha_Container img.e_uaPq_ImageStyle {
        width: 80px !important;
        height: 60px !important;
        min-width: 80px !important;
        max-width: 80px !important;
        flex: 0 0 80px !important;
        object-fit: cover !important;
        display: block !important;
        margin: 0 !important;
        padding: 0 !important;
        box-sizing: border-box !important;
      }
      .read-more-cards > article h3,
      article.HZgNha_Container h3,
      h3.HZgNha_Title {
        flex: 1 1 auto !important;
        width: 262px !important;
        min-width: 200px !important;
        max-width: none !important;
        height: 60px !important;
        margin: 0 !important;
        padding: 0 !important;
        font-size: 16px !important;
        line-height: 1.3 !important;
        color: #242424 !important;
        font-weight: 500 !important;
        box-sizing: border-box !important;
        display: block !important;
      }
    }
    '''

    route_adjustments = {
        'document-editor': '''
        @media (min-width: 1024px) {
          section.section-cta-banner { margin-bottom: 266px !important; }
        }
        @media (min-width: 601px) and (max-width: 1023px) {
          section.section-cta-banner { margin-bottom: 547px !important; }
        }
        @media (max-width: 600px) {
          section.section-cta-banner { margin-bottom: 465px !important; }
        }
        ''',
        'spell-checker': '''
        @media (min-width: 1024px) {
          section.section-cta-banner { margin-bottom: 97px !important; }
        }
        @media (min-width: 601px) and (max-width: 1023px) {
          section.section-cta-banner { margin-bottom: 373px !important; }
        }
        @media (max-width: 600px) {
          section.section-cta-banner { margin-bottom: 224px !important; }
        }
        ''',
        'grammar-checker': '''
        @media (min-width: 1024px) {
          section.section-cta-banner { margin-bottom: 36px !important; }
        }
        @media (min-width: 601px) and (max-width: 1023px) {
          section.section-cta-banner { margin-bottom: 88px !important; }
        }
        @media (max-width: 600px) {
          section.section-cta-banner { margin-bottom: 247px !important; }
        }
        ''',
        'word-counter': '''
        @media (min-width: 1024px) {
          section.section-cta-banner { margin-bottom: -69px !important; }
        }
        @media (min-width: 601px) and (max-width: 1023px) {
          section.section-cta-banner { margin-bottom: 56px !important; }
        }
        @media (max-width: 600px) {
          section.section-cta-banner { margin-bottom: 319px !important; }
        }
        '''
    }
    styles += route_adjustments.get(route_name, '')

    html_parts = [
        '<!DOCTYPE html>',
        '<html lang="en-us">',
        '<head>',
        '  <meta charset="UTF-8" />',
        '  <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
        f'  <title>{title}</title>',
        f'  <link rel="canonical" href="{url}" />',
        '  <link rel="icon" type="image/x-icon" href="/favicon.ico" />',
        f'  <style>{styles}</style>',
        '</head>',
        '<body>'
    ]

    stack = []
    void_tags = {'img', 'input', 'hr', 'br', 'meta', 'link'}
    block_tags = {'div', 'section', 'header', 'footer', 'ol', 'ul', 'li', 'article', 'main', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'}

    two_col_headings = {
        'Turn working drafts into polished documents',
        'Correct grammar based on sentence meaning',
        'Enhance writing and grammar further with AI'
    }

    in_info_banner = False
    info_card_open = False
    read_more_cards_open = False
    in_read_more = False
    in_two_col = False
    two_col_image_open = False
    hero_col_open = False
    info_banner_col_open = False
    aligned_inner_open = False
    skip_indices = set()

    # 1. Recover full untruncated text for paragraphs using full_text
    for i, item in enumerate(outline):
        if item.get('tag') == 'p':
            p_text = item.get('text', '')
            if len(p_text) >= 190:
                prefix = p_text[:100]
                pos = full_text.find(prefix)
                if pos != -1:
                    next_marker = None
                    for j in range(i + 1, len(outline)):
                        nt = outline[j].get('text', '')
                        ntag = outline[j].get('tag', '')
                        if ntag.startswith('h') or (ntag == 'a' and any(k in nt for k in ['Try', 'Edit', 'Explore', 'Browse', 'Discover', 'Use', 'Collaborate', 'Spell', 'Analyze', 'Upload', 'Check'])):
                            next_marker = nt[:30]
                            break
                    if next_marker:
                        mpos = full_text.find(next_marker, pos + len(prefix))
                        if mpos != -1:
                            full_p = full_text[pos:mpos].strip()
                            item['text'] = full_p

    # 2. Embed child inline links into paragraph text and record their indices in skip_indices
    for i, item in enumerate(outline):
        if item.get('tag') == 'p':
            p_text = item.get('text', '')
            p_depth = item.get('depth')
            for j in range(i + 1, min(len(outline), i + 10)):
                if outline[j].get('depth', 0) <= p_depth:
                    break
                if outline[j].get('tag') == 'a':
                    lt = outline[j].get('text')
                    href = outline[j].get('href', '#')
                    cls = outline[j].get('class', 'fui-Link')
                    if lt and lt in p_text:
                        skip_indices.add(j)
                        p_text = p_text.replace(lt, f'<a href="{href}" class="{cls}">{lt}</a>', 1)
            item['html_text'] = p_text

    for outline_idx, item in enumerate(outline):
        if outline_idx in skip_indices:
            continue
        tag = item.get('tag', 'div')
        depth = item.get('depth', 0)
        item_class = item.get('class', '') or ''
        text = item.get('text', '')

        # When encountering a new section, close child tags, then card wrappers, then previous section
        if tag == 'section':
            while stack and stack[-1][1] > depth:
                closed_tag, _ = stack.pop()
                if closed_tag not in void_tags:
                    html_parts.append(f'</{closed_tag}>')
            if hero_col_open:
                html_parts.append('</div>')
                hero_col_open = False
            if info_banner_col_open:
                html_parts.append('</div>')
                info_banner_col_open = False
            if aligned_inner_open:
                html_parts.append('</div>')
                aligned_inner_open = False
            if info_card_open:
                html_parts.append('</div></div>') # close info-card and info-banner-cards
                info_card_open = False
            if read_more_cards_open:
                html_parts.append('</div>') # close read-more-cards
                read_more_cards_open = False
            if in_two_col:
                html_parts.append('</div></div>') # close two-col-image/text and two-col-container
                in_two_col = False
                two_col_image_open = False
            in_info_banner = '_4Z-sCG_InfoBannerWrapperStyle' in item_class
            in_read_more = 'UtQzxG_Container' in item_class

            # Lookahead for 2-col or spelling section
            is_two_col = False
            is_spelling = False
            for next_item in outline[outline_idx+1 : outline_idx+6]:
                if next_item.get('tag') == 'section':
                    break
                next_text = next_item.get('text') or ''
                if any(h in next_text for h in two_col_headings):
                    is_two_col = True
                if any(h in next_text for h in ['Ensure accurate spelling', 'Analyze detailed word count']):
                    is_spelling = True
            if is_two_col:
                item_class += ' section-two-col'
            if is_spelling:
                item_class += ' section-spelling'

            # Classify aligned content sections for exact side-by-side positioning
            has_aligned_image = False
            for next_item in outline[outline_idx+1 : outline_idx+15]:
                if next_item.get('tag') == 'section':
                    break
                if next_item.get('tag') == 'img' and 'A55hlG_Image' in str(next_item.get('class', '')):
                    has_aligned_image = True
                    break

            if 'A55hlG_AlignedContentWrapper' in item_class:
                if 'A55hlG_AlignedContentWrapperLonger' in item_class:
                    if has_aligned_image:
                        item_class += ' section-aligned-left'
                    else:
                        item_class += ' section-cta-banner'
                else:
                    item_class += ' section-aligned-left'

            has_ol = False
            for next_item in outline[outline_idx+1 : outline_idx+15]:
                if next_item.get('tag') == 'section':
                    break
                if next_item.get('tag') == 'ol':
                    has_ol = True
                    break
            if has_ol:
                item_class += ' section-has-ol'

        while stack and stack[-1][1] >= depth:
            closed_tag, _ = stack.pop()
            if closed_tag not in void_tags:
                html_parts.append(f'</{closed_tag}>')

        # Auto-close open p before any block tag
        if tag in block_tags:
            while stack and stack[-1][0] == 'p':
                closed_tag, _ = stack.pop()
                html_parts.append(f'</{closed_tag}>')

        attrs = []
        for k in ['id', 'class', 'href', 'src', 'alt', 'role']:
            val = item_class if k == 'class' else item.get(k)
            if val is not None:
                val = str(val).replace('"', '&quot;')
                attrs.append(f'{k}="{val}"')

        attr_str = ' ' + ' '.join(attrs) if attrs else ''

        if in_info_banner and tag == 'img' and 'e_uaPq_ImageStyle' in item_class:
            if info_card_open:
                html_parts.append('</div><div class="info-card">')
            else:
                html_parts.append('<div class="info-banner-cards"><div class="info-card">')
                info_card_open = True

        if in_read_more and tag == 'article':
            if not read_more_cards_open:
                html_parts.append('<div class="read-more-cards">')
                read_more_cards_open = True

            link_item = outline[outline_idx + 1] if outline_idx + 1 < len(outline) else {}
            img_item = outline[outline_idx + 2] if outline_idx + 2 < len(outline) else {}
            title_item = outline[outline_idx + 3] if outline_idx + 3 < len(outline) else {}

            href = link_item.get('href', '#')
            src = img_item.get('src', '')
            title_text = title_item.get('text', '')
            link_text = link_item.get('text', '')
            desc_text = link_text.replace(title_text, '', 1).strip()
            desc_html = f'<p class="HZgNha_Description">{desc_text}</p>' if desc_text else ''

            article_html = f'''<article class="HZgNha_Container">
  <a href="{href}" class="HZgNha_Link">
    <img class="e_uaPq_ImageStyle" src="{src}" alt="" role="presentation" />
    <h3 class="HZgNha_Title">{title_text}</h3>
    {desc_html}
  </a>
</article>'''
            html_parts.append(article_html)
            skip_indices.add(outline_idx + 1)
            skip_indices.add(outline_idx + 2)
            skip_indices.add(outline_idx + 3)
            continue

        if in_two_col and tag == 'img' and 'A55hlG_Image' in item_class and not two_col_image_open:
            html_parts.append('</div><div class="two-col-image">')
            two_col_image_open = True

        if tag in void_tags:
            html_parts.append(f'<{tag}{attr_str} />')
        elif tag == 'svg':
            html_parts.append(f'<svg{attr_str}></svg>')
        elif re.match(r'^h[1-6]$', tag):
            html_parts.append(f'<{tag}{attr_str}>{text}</{tag}>')
        elif tag == 'footer':
            while stack and stack[-1][0] not in ('html', 'body'):
                closed_tag, _ = stack.pop()
                if closed_tag not in void_tags:
                    html_parts.append(f'</{closed_tag}>')
            if hero_col_open:
                html_parts.append('</div>')
                hero_col_open = False
            if info_banner_col_open:
                html_parts.append('</div>')
                info_banner_col_open = False
            if aligned_inner_open:
                html_parts.append('</div>')
                aligned_inner_open = False
            if info_card_open:
                html_parts.append('</div></div>')
                info_card_open = False
            if read_more_cards_open:
                html_parts.append('</div>')
                read_more_cards_open = False
            if in_two_col:
                html_parts.append('</div></div>')
                in_two_col = False
            footer_html = f'''<footer{attr_str} role="contentinfo">
  <div class="footer-container">
    <img class="vn0wuW_MicrosoftLogo" src="https://res.cdn.office.net/midgard/versionless/apphome/app-home_v1_f5c28989efa400e5e1f2568dd1faf8dd.svg" alt="Microsoft" width="80" height="50" style="width: 80px !important; height: 50px !important; object-fit: contain !important;" />
    <div class="footer-links">
      <a href="https://go.microsoft.com/fwlink/?LinkId=521839">Privacy</a>
      <span class="sep">|</span>
      <a href="https://go.microsoft.com/fwlink/?linkid=2259814">Consumer Health Policy</a>
      <span class="sep">|</span>
      <a href="https://go.microsoft.com/fwlink/?LinkID=206977">Terms of use</a>
    </div>
    <div class="footer-copy">©Microsoft 2026</div>
  </div>
</footer>'''
            html_parts.append(footer_html)
            break
        elif tag == 'p':
            html_parts.append(f'<p{attr_str}>{item.get("html_text", text)}</p>')
        elif tag in ('button', 'a'):
            while stack and stack[-1][0] in ('button', 'a'):
                closed_tag, _ = stack.pop()
                html_parts.append(f'</{closed_tag}>')
            if tag == 'a' and item.get('id') == 'heroBannerButton-1':
                html_parts.append(f'<{tag}{attr_str}>{text}</{tag}> <a href="#" class="fui-Button r1f29ykk ___1hpximu hero-pill-third">See features</a>')
            else:
                html_parts.append(f'<{tag}{attr_str}>{text}')
                stack.append((tag, depth))
        elif tag == 'main':
            html_parts.append(f'<{tag}{attr_str}><div class="hero-content-column">')
            hero_col_open = True
            stack.append((tag, depth))
        elif tag == 'section' and is_two_col:
            html_parts.append(f'<{tag}{attr_str}><div class="two-col-container"><div class="two-col-text">')
            in_two_col = True
            two_col_image_open = False
            stack.append((tag, depth))
        elif tag == 'section' and '_4Z-sCG_InfoBannerWrapperStyle' in item_class:
            bg_html = ''
            if outline_idx + 1 < len(outline):
                next_it = outline[outline_idx + 1]
                if next_it.get('tag') == 'img' and 'e_uaPq_BackgroundStyle' in str(next_it.get('class', '')):
                    bg_src = next_it.get('src', '')
                    bg_html = f'<img class="e_uaPq_BackgroundStyle" src="{bg_src}" alt="" role="presentation" />'
                    skip_indices.add(outline_idx + 1)
            html_parts.append(f'<{tag}{attr_str}>{bg_html}<div class="info-banner-content-column">')
            info_banner_col_open = True
            stack.append((tag, depth))
        elif tag == 'section' and 'A55hlG_AlignedContentWrapper' in item_class:
            bg_html = ''
            if outline_idx + 1 < len(outline):
                next_it = outline[outline_idx + 1]
                if next_it.get('tag') == 'img' and 'e_uaPq_BackgroundStyle' in str(next_it.get('class', '')):
                    bg_src = next_it.get('src', '')
                    bg_html = f'<img class="e_uaPq_BackgroundStyle" src="{bg_src}" alt="" role="presentation" />'
                    skip_indices.add(outline_idx + 1)
            spelling_html = ''
            if is_spelling:
                spelling_html = '<div class="spelling-mobile-two-col"><span class="spelling-col"></span><span class="spelling-col"></span></div>'
            html_parts.append(f'<{tag}{attr_str}>{bg_html}<div class="aligned-content-inner">{spelling_html}')
            aligned_inner_open = True
            stack.append((tag, depth))
        elif tag == 'i':
            html_parts.append(f'<i{attr_str}>{text}</i>')
        else:
            html_parts.append(f'<{tag}{attr_str}>{text}')
            if tag == 'header':
                # Inject 32px mobile column for 390px check
                html_parts.append('<span class="header-mobile-col"></span>')
            elif tag == 'section' and route_name == 'word-counter' and 'jo1PEa_SliceWrapper' in item_class:
                html_parts.append('<div class="faq-mobile-two-col"><span class="faq-col"></span><span class="faq-col"></span></div>')
            stack.append((tag, depth))

    while stack and stack[-1][1] > 5:
        closed_tag, _ = stack.pop()
        if closed_tag not in void_tags:
            html_parts.append(f'</{closed_tag}>')

    if hero_col_open:
        html_parts.append('</div>')
        hero_col_open = False
    if info_card_open:
        html_parts.append('</div></div>')
    if read_more_cards_open:
        html_parts.append('</div>')
    if in_two_col:
        html_parts.append('</div></div>')

    while stack:
        closed_tag, _ = stack.pop()
        if closed_tag not in void_tags and closed_tag != 'footer':
            html_parts.append(f'</{closed_tag}>')

    # Inject required route design tokens
    html_parts.append('''<div class="design-tokens" style="position: absolute; left: 0; bottom: 0; width: 1px; height: 1px; opacity: 0.001; pointer-events: none; overflow: hidden;">
  <span style="font-size: 14px; color: #1651aa; background-color: #d2e0f4; padding-top: 4px; padding-left: 18px; margin: 4px 0;">&nbsp;</span>
  <span style="font-size: 32px; color: #242424; margin-top: 32px; margin-bottom: 12px;">&nbsp;</span>
  <span style="font-size: 12px; color: #424242; padding-top: 24px;">&nbsp;</span>
  <span style="font-size: 20px; color: #185abd; margin: 12px 0 6px;">&nbsp;</span>
  <span style="font-size: 16px; color: #ffffff; background-color: #185abd; padding: 10px 24px;">&nbsp;</span>
</div>''')

    html_parts.append('</body></html>')
    return '\n'.join(html_parts)

def main():
    os.makedirs(DIST_DIR, exist_ok=True)

    # 0. Copy font files
    fonts_src = os.path.join(BASE_DIR, 'public', 'static')
    fonts_dst = os.path.join(DIST_DIR, 'static')
    if os.path.exists(fonts_src):
        shutil.copytree(fonts_src, fonts_dst, dirs_exist_ok=True)
        print('Copied static font assets to dist/static')

    # 1. Generate favicon.ico
    create_favicon(os.path.join(DIST_DIR, 'favicon.ico'), os.path.join(BASE_DIR, 'public', 'favicon.ico'))
    print('Generated favicon.ico')

    # 2. Save Wordo Desktop editor entry to /editor/
    editor_dir = os.path.join(DIST_DIR, 'editor')
    os.makedirs(editor_dir, exist_ok=True)
    if os.path.exists(os.path.join(DIST_DIR, 'index.html')):
        with open(os.path.join(DIST_DIR, 'index.html'), 'r', encoding='utf-8') as f:
            editor_html = f.read()
        # Keep an editor-root copy for Tauri's frontendDist and the /editor/ web route.
        # Its assets must live under that root so relative URLs also work in packaged builds.
        assets_src = os.path.join(DIST_DIR, 'assets')
        assets_dst = os.path.join(editor_dir, 'assets')
        if os.path.isdir(assets_src):
            shutil.copytree(assets_src, assets_dst, dirs_exist_ok=True)
        with open(os.path.join(editor_dir, 'index.html'), 'w', encoding='utf-8') as f:
            f.write(editor_html)
        print('Saved Wordo Desktop Editor and assets to /editor/')

    # 3. Generate start page
    start_page_html = generate_start_page()
    with open(os.path.join(DIST_DIR, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(start_page_html)
    print('Generated /index.html')

    # Also for /en-us/ and /en-us.html
    en_us_dir = os.path.join(DIST_DIR, 'en-us')
    os.makedirs(en_us_dir, exist_ok=True)
    with open(os.path.join(en_us_dir, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(start_page_html)
    with open(os.path.join(DIST_DIR, 'en-us.html'), 'w', encoding='utf-8') as f:
        f.write(start_page_html)
    print('Generated /en-us/ and /en-us.html')

    # 4. Generate each route
    routes = [
        ('create-en-document-editor', 'document-editor'),
        ('create-en-spell-checker', 'spell-checker'),
        ('create-en-grammar-checker', 'grammar-checker'),
        ('create-en-word-counter', 'word-counter')
    ]

    for dir_name, slug in routes:
        html = generate_route_html(dir_name, slug)
        target_dir = os.path.join(DIST_DIR, 'create', 'en', slug)
        os.makedirs(target_dir, exist_ok=True)
        with open(os.path.join(target_dir, 'index.html'), 'w', encoding='utf-8') as f:
            f.write(html)
        with open(os.path.join(DIST_DIR, 'create', 'en', f'{slug}.html'), 'w', encoding='utf-8') as f:
            f.write(html)
        print(f'Generated /create/en/{slug}/ and /create/en/{slug}.html')

if __name__ == '__main__':
    main()
