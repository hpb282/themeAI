/* ThemeAI / Pixel Studio — no network, no content replacement, no remote code. */
(() => {
  'use strict';
  if (window.top !== window.self) return;
  const KEY = 'themeai.pixel.v1';
  const IMAGE_KEY = 'themeai.pixel.wallpaper.v1';
  const VERSION = '1.1.0';
  const SCRIPT_URL = document.currentScript?.src;
  const PALETTES = {"night":{"name":"Night","subtitle":"Pixel night","accent":"#6af1ff","secondary":"#bda1ff","sky":"#15133e","surface":"#24235a","rgb":"106 241 255","hsl":"243 52% 15%"},"forest":{"name":"Forest","subtitle":"Alpine forest","accent":"#8bf2be","secondary":"#d6efa8","sky":"#102a2b","surface":"#173d3b","rgb":"139 242 190","hsl":"171 40% 9%"},"sakura":{"name":"Sakura","subtitle":"Cherry blossom valley","accent":"#ffb3e7","secondary":"#d4adff","sky":"#2e1b45","surface":"#432951","rgb":"255 179 231","hsl":"282 31% 11%"}};
  const ASSETS = {"night":{"moon":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 40 40\" shape-rendering=\"crispEdges\"><path fill=\"#ffeda9\" d=\"M15 2H23V4H27V8H31V12H35V18H37V26H35V30H31V34H27V36H19V38H11V36H7V32H3V26H7V30H11V32H19V30H25V26H29V20H31V14H29V10H25V6H19V4H15Z\"/><path fill=\"#fff9c7\" d=\"M27 9H30V15H33V24H30V28H27V31H23V33H14V31H22V28H26V23H29V16H27Z\"/></svg>","cloud":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 128 42\" shape-rendering=\"crispEdges\"><path fill=\"#49408e\" d=\"M0 36H8V32H16V28H24V22H32V14H40V6H48V2H56V6H64V14H72V20H80V16H88V20H96V24H104V30H112V34H120V38H128V42H0Z\"/><path fill=\"#6f56ba\" d=\"M16 32H24V26H32V20H40V10H48V6H54V10H60V18H68V24H76V28H60V24H52V18H44V24H36V30H28V34H16Z\"/><path fill=\"#332a70\" d=\"M0 38H20V34H36V36H48V32H60V36H84V32H96V36H116V40H128V42H0Z\"/></svg>","crop":{"size":"1844.1860465116279% 1377.7777777777778%","position":"83.26666666666667% 30.978260869565215%"}},"forest":{"moon":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 40 40\" shape-rendering=\"crispEdges\"><path fill=\"#ffeda9\" d=\"M15 2H23V4H27V8H31V12H35V18H37V26H35V30H31V34H27V36H19V38H11V36H7V32H3V26H7V30H11V32H19V30H25V26H29V20H31V14H29V10H25V6H19V4H15Z\"/><path fill=\"#fff9c7\" d=\"M27 9H30V15H33V24H30V28H27V31H23V33H14V31H22V28H26V23H29V16H27Z\"/></svg>","cloud":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 128 42\" shape-rendering=\"crispEdges\"><path fill=\"#cde7dc\" d=\"M0 36H8V32H16V28H24V22H32V14H40V6H48V2H56V6H64V14H72V20H80V16H88V20H96V24H104V30H112V34H120V38H128V42H0Z\"/><path fill=\"#fff3cc\" d=\"M16 32H24V26H32V20H40V10H48V6H54V10H60V18H68V24H76V28H60V24H52V18H44V24H36V30H28V34H16Z\"/><path fill=\"#9ecac6\" d=\"M0 38H20V34H36V36H48V32H60V36H84V32H96V36H116V40H128V42H0Z\"/></svg>","crop":{"size":"1844.1860465116279% 1377.7777777777778%","position":"90.53333333333333% 30.869565217391305%"}},"sakura":{"moon":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 40 40\" shape-rendering=\"crispEdges\"><path fill=\"#ffeda9\" d=\"M15 2H23V4H27V8H31V12H35V18H37V26H35V30H31V34H27V36H19V38H11V36H7V32H3V26H7V30H11V32H19V30H25V26H29V20H31V14H29V10H25V6H19V4H15Z\"/><path fill=\"#fff9c7\" d=\"M27 9H30V15H33V24H30V28H27V31H23V33H14V31H22V28H26V23H29V16H27Z\"/></svg>","cloud":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 128 42\" shape-rendering=\"crispEdges\"><path fill=\"#ad8dc9\" d=\"M0 36H8V32H16V28H24V22H32V14H40V6H48V2H56V6H64V14H72V20H80V16H88V20H96V24H104V30H112V34H120V38H128V42H0Z\"/><path fill=\"#e4b7e1\" d=\"M16 32H24V26H32V20H40V10H48V6H54V10H60V18H68V24H76V28H60V24H52V18H44V24H36V30H28V34H16Z\"/><path fill=\"#8568af\" d=\"M0 38H20V34H36V36H48V32H60V36H84V32H96V36H116V40H128V42H0Z\"/></svg>","crop":{"size":"1822.9885057471265% 1377.7777777777778%","position":"97.66511007338225% 30.869565217391305%"}}};
  const PAGE_CSS = "/* Host-page styling is scoped to one removable attribute. Never replace the app DOM. */\nhtml[data-themeai] {\n  color-scheme: dark;\n  background: var(--ta-sky) !important;\n  --main-surface-primary: var(--ta-main) !important;\n  --main-surface-primary-inverse: #f0f2fc !important;\n  --main-surface-secondary: var(--ta-surface) !important;\n  --main-surface-tertiary: var(--ta-raised) !important;\n  --sidebar-surface-primary: var(--ta-sidebar) !important;\n  --sidebar-surface-secondary: var(--ta-surface) !important;\n  --sidebar-surface-tertiary: var(--ta-raised) !important;\n  --message-surface: var(--ta-message) !important;\n  --bg-primary: var(--ta-main) !important;\n  --bg-secondary: var(--ta-surface) !important;\n  --bg-tertiary: var(--ta-raised) !important;\n  --bg-elevated-primary: var(--ta-solid) !important;\n  --bg-elevated-secondary: var(--ta-raised) !important;\n  --text-primary: #eef1fc !important;\n  --text-secondary: #c2cadf !important;\n  --text-tertiary: #a3afcd !important;\n  --text-quaternary: #8c9aba !important;\n  --text-accent: var(--ta-accent) !important;\n  --border-light: #d9e3ff18 !important;\n  --border-medium: #d9e3ff30 !important;\n  --border-heavy: #d9e3ff44 !important;\n  --theme-bg-primary: var(--ta-main) !important;\n  --theme-bg-secondary: var(--ta-surface) !important;\n  --theme-bg-tertiary: var(--ta-raised) !important;\n  --theme-bg-elevated: var(--ta-solid) !important;\n  --theme-fg-primary: #eef1fc !important;\n  --theme-fg-secondary: #c2cadf !important;\n  --theme-text-primary: #eef1fc !important;\n  --theme-text-secondary: #c2cadf !important;\n  --theme-border: #d9e3ff28 !important;\n}\nhtml[data-themeai] body {\n  background: transparent !important;\n  color: #eef1fc;\n  isolation: isolate;\n}\nhtml[data-themeai] :is(#root, #app, #__next, main, [role=\"main\"]) {\n  background-color: transparent !important;\n}\nhtml[data-themeai] [data-themeai-sidebar] {\n  background: var(--ta-sidebar) !important;\n  border-inline-end-color: rgb(var(--ta-rgb) / .7) !important;\n  box-shadow: inset 0 0 0 1px rgb(var(--ta-rgb) / .45), 0 0 16px rgb(var(--ta-rgb) / .13);\n}\n/* The lightweight/mobile ChatGPT shell has some hard-coded neutral colors. */\nhtml[data-themeai] #web-mobile-root [data-themeai-neutral-text=\"primary\"] { color: #eef1fc !important; }\nhtml[data-themeai] #web-mobile-root [data-themeai-neutral-text=\"muted\"] { color: #a3afcd !important; }\nhtml[data-themeai] #web-mobile-root [data-themeai-neutral-bg=\"surface\"] { background-color: var(--ta-solid) !important; }\nhtml[data-themeai] #web-mobile-root [data-themeai-neutral-bg=\"canvas\"] { background-color: transparent !important; }\nhtml[data-themeai] #web-mobile-root [data-themeai-neutral-gradient] { background-image: none !important; }\nhtml[data-themeai] #web-mobile-root [data-themeai-neutral-before]::before,\nhtml[data-themeai] #web-mobile-root [data-themeai-neutral-after]::after { background: var(--ta-sidebar) !important; }\nhtml[data-themeai] [data-themeai-composer] {\n  background-color: var(--ta-solid) !important;\n  border-radius: 4px !important;\n  box-shadow: 0 0 0 2px rgb(var(--ta-rgb) / .95),\n    3px 0 0 -1px rgb(var(--ta-rgb) / .45), -3px 0 0 -1px rgb(var(--ta-rgb) / .45),\n    0 3px 0 -1px rgb(var(--ta-rgb) / .45), 0 -3px 0 -1px rgb(var(--ta-rgb) / .45),\n    0 0 6px rgb(var(--ta-rgb) / .7), 0 0 25px rgb(var(--ta-rgb) / calc(var(--ta-glow) * .30)) !important;\n}\nhtml[data-themeai] :is(#prompt-textarea, textarea, [contenteditable=\"true\"], [contenteditable=\"plaintext-only\"]) {\n  caret-color: var(--ta-accent);\n}\nhtml[data-themeai] :is(button, a, input, textarea, [contenteditable=\"true\"]):focus-visible {\n  outline: 2px solid var(--ta-accent) !important;\n  outline-offset: 3px;\n}\nhtml[data-themeai] ::selection { background: rgb(var(--ta-rgb) / .28); color: #fff; }\n/* Current ChatGPT also exposes semantic --color-* tokens. Keep status/syntax colors intact. */\nhtml[data-themeai][data-themeai-platform=\"chatgpt\"],\nhtml[data-themeai][data-themeai-platform=\"chatgpt\"] body {\n  --color-surface: var(--ta-main) !important;\n  --color-surface-canvas: var(--ta-main) !important;\n  --color-surface-card: var(--ta-solid) !important;\n  --color-surface-secondary: var(--ta-surface) !important;\n  --color-surface-tertiary: var(--ta-raised) !important;\n  --color-surface-elevated: var(--ta-solid) !important;\n  --color-surface-elevated-secondary: var(--ta-raised) !important;\n  --color-background-primary: var(--ta-main) !important;\n  --color-background-secondary: var(--ta-surface) !important;\n  --color-background-tertiary: var(--ta-raised) !important;\n  --color-background-panel: var(--ta-solid) !important;\n  --color-background-composer-primary: var(--ta-solid) !important;\n  --color-background-composer-surface: var(--ta-solid) !important;\n  --color-background-composer-action-bar: var(--ta-solid) !important;\n  --color-background-user-message: var(--ta-message) !important;\n  --color-text: #eef1fc !important;\n  --color-text-primary: #eef1fc !important;\n  --color-text-prose: #eef1fc !important;\n  --color-text-secondary: #c2cadf !important;\n  --color-text-tertiary: #a3afcd !important;\n  --color-text-composer-primary: #eef1fc !important;\n  --color-text-user-message: #eef1fc !important;\n  --color-border: #d9e3ff28 !important;\n  --color-border-light: #d9e3ff18 !important;\n  --color-border-heavy: #d9e3ff44 !important;\n}\n/* Claude uses HSL component tokens, unlike ChatGPT's complete color values. */\nhtml[data-themeai][data-themeai-platform=\"claude\"],\nhtml[data-themeai][data-themeai-platform=\"claude\"] body {\n  --bg-000: var(--ta-hsl) !important;\n  --bg-100: var(--ta-hsl) !important;\n  --bg-200: var(--ta-hsl-raised) !important;\n  --bg-300: var(--ta-hsl-raised) !important;\n  --bg-400: var(--ta-hsl-raised) !important;\n  --bg-500: var(--ta-hsl-raised) !important;\n  --text-000: 226 70% 96% !important;\n  --text-100: 226 50% 93% !important;\n  --text-200: 225 30% 83% !important;\n  --text-300: 225 24% 74% !important;\n  --text-400: 225 20% 65% !important;\n  --text-500: 225 20% 60% !important;\n  --border-100: 225 30% 72% !important;\n  --border-200: 225 30% 68% !important;\n  --border-300: 225 30% 64% !important;\n  --oncolor-100: 225 40% 10% !important;\n}\nhtml[data-themeai][data-themeai-platform=\"claude\"] :is(.bg-bg-100, .bg-bg-000, [data-testid=\"root\"]) {\n  background-color: transparent !important;\n}\nhtml[data-themeai][data-themeai-platform=\"claude\"] [data-themeai-composer] {\n  background-color: var(--ta-solid) !important;\n}\n/* Claude's newer CDS/dframe shell, verified against its public stylesheets. */\nhtml[data-themeai][data-themeai-platform=\"claude\"],\nhtml[data-themeai][data-themeai-platform=\"claude\"] :is(body, [data-cds-theme]) {\n  --cds-surface-0: var(--ta-main) !important;\n  --cds-surface-1: var(--ta-main) !important;\n  --cds-surface-2: var(--ta-surface) !important;\n  --cds-surface-3: var(--ta-solid) !important;\n  --cds-surface-panel: var(--ta-solid) !important;\n  --cds-surface-popover: var(--ta-solid) !important;\n  --cds-text-primary: #eef1fc !important;\n  --cds-text-secondary: #c2cadf !important;\n  --cds-text-stays-secondary: #c2cadf !important;\n  --cds-text-muted: #a3afcd !important;\n  --cds-text-disabled: #8290ad !important;\n  --cds-text-accent: var(--ta-accent) !important;\n  --cds-chat-composer-link: var(--ta-accent) !important;\n  --cds-chat-composer-link-hover: var(--ta-secondary) !important;\n  --cds-border: #d9e3ff20 !important;\n  --cds-border-line: #d9e3ff30 !important;\n  --cds-border-line-muted: #d9e3ff18 !important;\n  --cds-border-strong: #d9e3ff38 !important;\n  --cds-border-stronger: #d9e3ff50 !important;\n  --df-bg-page: var(--ta-main) !important;\n  --df-bg-page-hsl: var(--ta-hsl) !important;\n  --df-page-ground: var(--ta-main) !important;\n  --df-sidebar-bg: var(--ta-sidebar) !important;\n  --df-web-sidebar-bg: var(--ta-sidebar) !important;\n  --df-sidebar-tint: var(--ta-sidebar) !important;\n  --df-z0: var(--ta-hsl) !important;\n  --df-z1: var(--ta-hsl) !important;\n  --df-z2: var(--ta-hsl-raised) !important;\n  --df-z3: var(--ta-hsl-raised) !important;\n}\n@media print {\n  #themeai-scene, #themeai-ui { display: none !important; }\n}\n";
  const PANEL_CSS = ":host{all:initial;font:15px/1.45 Arial,Helvetica,system-ui,sans-serif;color:#f9f8ff;--accent:#6af1ff;--secondary:#bda1ff}\n*{box-sizing:border-box}[hidden]{display:none!important}button,input,select{font:inherit}button{color:inherit;cursor:pointer}button:focus-visible,input:focus-visible,summary:focus-visible{outline:2px solid var(--accent);outline-offset:4px}.pixel-icon{width:24px;height:24px;flex-shrink:0;image-rendering:pixelated}.dock{pointer-events:auto;display:flex;align-items:center;gap:9px;padding:11px 15px;border:2px solid var(--accent);border-radius:4px;background:linear-gradient(130deg,#1d2059,#17183deF);box-shadow:0 0 5px var(--accent),0 0 19px #63e8ff60,inset 0 0 13px #8df2ff18;font-weight:650;font-size:14px}.dock .pixel-icon{width:22px;height:22px}.dock-status{width:4px;height:4px;background:var(--accent)}\n.frame{pointer-events:auto;position:fixed;right:18px;top:clamp(70px,16vh,160px);width:min(360px,calc(100vw - 36px));max-height:calc(100dvh - clamp(70px,16vh,160px) - 24px);overflow:auto;scrollbar-width:thin;scrollbar-color:#7cefff66 #171640;padding:2px;border:0;filter:drop-shadow(0 0 3px #68efffb0) drop-shadow(0 14px 35px #08052fa0)}\n.frame::before{content:'';position:absolute;inset:0;pointer-events:none;background:var(--accent);clip-path:polygon(10px 0,calc(100% - 10px) 0,calc(100% - 10px) 4px,calc(100% - 4px) 4px,calc(100% - 4px) 10px,100% 10px,100% calc(100% - 10px),calc(100% - 4px) calc(100% - 10px),calc(100% - 4px) calc(100% - 4px),calc(100% - 10px) calc(100% - 4px),calc(100% - 10px) 100%,10px 100%,10px calc(100% - 4px),4px calc(100% - 4px),4px calc(100% - 10px),0 calc(100% - 10px),0 10px,4px 10px,4px 4px,10px 4px)}\n.panel{position:relative;padding:22px 22px 19px;background:radial-gradient(ellipse at 45% 15%,#302d75b0,transparent 70%),linear-gradient(140deg,#21215ceF,#181744f8);backdrop-filter:blur(12px);clip-path:polygon(9px 0,calc(100% - 9px) 0,calc(100% - 9px) 4px,calc(100% - 4px) 4px,calc(100% - 4px) 9px,100% 9px,100% calc(100% - 9px),calc(100% - 4px) calc(100% - 9px),calc(100% - 4px) calc(100% - 4px),calc(100% - 9px) calc(100% - 4px),calc(100% - 9px) 100%,9px 100%,9px calc(100% - 4px),4px calc(100% - 4px),4px calc(100% - 9px),0 calc(100% - 9px),0 9px,4px 9px,4px 4px,9px 4px)}\n.top{display:flex;align-items:center;gap:8px;position:relative}.title{margin:0;font-size:24px;letter-spacing:-.35px;font-weight:700;line-height:1.2}.top::after{content:'✦';position:absolute;right:11px;top:-5px;font-size:24px;color:#d4bbff;text-shadow:-12px 14px #9f7ad4;pointer-events:none}.close{margin-left:auto;z-index:1;position:relative;width:22px;height:22px;border:0;background:#17143c70;color:#cfc4f4;font-size:17px;opacity:0}.top:hover .close,.close:focus-visible{opacity:1}.subtitle{font-size:15.5px;color:#cab9ff;line-height:1.45;margin:8px 0 24px;max-width:260px}.palettes{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:13px;margin:0 0 22px;align-items:start}.palette{display:block;position:relative;padding:0;border:0;background:transparent;min-width:0;font-size:14px;font-weight:600;line-height:1.3;text-align:center}.thumb{display:block;position:relative;width:100%;aspect-ratio:1.1;border:1px solid #a4b2dc;border-radius:3px;background-color:#14113f;background-image:var(--reference);background-repeat:no-repeat;image-rendering:pixelated;box-shadow:1px 1px 0 #a7aecc88,-1px -1px 0 #bad8ed55;clip-path:polygon(4px 0,calc(100% - 4px) 0,calc(100% - 4px) 2px,100% 2px,100% calc(100% - 4px),calc(100% - 2px) calc(100% - 4px),calc(100% - 2px) 100%,2px 100%,2px calc(100% - 2px),0 calc(100% - 2px),0 4px,2px 4px,2px 2px,4px 2px)}.thumb[data-photo=night]::after{content:'';position:absolute;top:0;right:0;width:23%;height:25%;background:linear-gradient(135deg,#181344,#16113c)}.palette>span:last-child{display:block;margin-top:8px}.palette[aria-pressed=true] .thumb{border:2px solid #82fbff;box-shadow:inset 0 0 2px #fff;filter:brightness(1.08)}.palette[aria-pressed=true]::before{content:'';position:absolute;inset:-2px -2px 24px;border:2px solid #70faff;border-radius:3px;box-shadow:0 0 3px #fff,0 0 8px #00eaff,0 0 16px #00b8ff,inset 0 0 6px #00eaff;pointer-events:none;z-index:2}.palette[aria-pressed=true]::after{content:'✓';position:absolute;z-index:3;right:-7px;top:-10px;width:29px;height:29px;display:grid;place-items:center;font-size:22px;font-weight:bold;background:#45e9ee;color:white;border:2px solid #9cffff;border-radius:9px;box-shadow:0 0 7px #01edf980;transform:rotate(-5deg)}.palette:hover .thumb{filter:brightness(1.12)}\n.range-row{display:flex;align-items:center;justify-content:space-between;margin:10px 0 6px;font-size:16px}.range-row output{font-size:10px;color:#9d8fd1}.glow-control{display:flex;align-items:center;gap:12px;margin:8px 0 24px}.sun{font-size:23px;line-height:1;color:#d6c7ff;flex-shrink:0}.glow-control input{appearance:none;width:100%;height:8px;border-radius:99px;background:linear-gradient(to right,#42e9ef 0 var(--value,70%),#5c5fb4 var(--value,70%) 100%);cursor:pointer;outline:none;margin:0}.glow-control input::-webkit-slider-thumb{appearance:none;width:21px;height:21px;border-radius:50%;border:2px solid #96fcff;background:#fff;box-shadow:0 0 8px #3fffffb0}.glow-control input::-moz-range-thumb{width:18px;height:18px;border-radius:50%;border:2px solid #96fcff;background:#fff;box-shadow:0 0 8px #3fffffb0}.divider{border-top:1px solid #a8a0ed65;padding-top:12px}.row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 0;cursor:pointer}.row-title{display:flex;align-items:center;gap:12px;font-size:16px}.row small{display:none}.row-icon{width:21px;display:inline-flex;justify-content:center;align-items:center;color:#f0e9ff;font-size:24px;line-height:1}.switch{appearance:none;flex:0 0 44px;width:44px;height:24px;border:0;border-radius:999px;position:relative;background:#66648d;margin:0;cursor:pointer}.switch::after{content:'';position:absolute;left:3px;top:3px;width:18px;height:18px;background:#fff;border-radius:50%;box-shadow:0 1px 3px #0003}.switch:checked{background:#28d5e9;box-shadow:0 0 7px #23dae626}.switch:checked::after{transform:translateX(20px)}\n.foot{font:11px/1.6 ui-monospace,monospace;color:#bdacf0;margin:16px 0 0;padding-top:15px;border-top:1px solid #aaa3ef70;display:flex;gap:9px;align-items:center}.upload-section{margin-top:15px;padding-top:15px;border-top:1px solid #aaa3ef35}.upload-heading{font-size:12px;color:#c0b1e8;margin:0 0 8px}.upload-button{width:100%;padding:10px;border:1px dashed #a79be6;border-radius:4px;color:#ebe6ff;background:#c8afff09;font-size:13px;display:flex;justify-content:center;gap:9px;align-items:center}.upload-button:hover{background:#c8afff18}.upload-button:disabled{opacity:.5;cursor:progress}.file-input{display:none}.custom-preview{display:flex;align-items:center;gap:10px;margin-top:10px;padding:7px;border:1px solid #a79be644;border-radius:3px;background:#15113770}.custom-preview[data-selected=true]{border-color:var(--accent);box-shadow:0 0 6px #6af1ff26}.custom-thumb{width:48px;height:38px;object-fit:cover;border-radius:2px}.custom-name{font-size:10px;color:#cfc5ea;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:185px}.custom-buttons{display:flex;gap:7px;margin-top:4px}.mini-button{background:transparent;border:0;font-size:10px;color:#92eff7;padding:0 2px}.mini-button.remove{color:#f1b8d3}.fit-controls{display:flex;gap:7px;margin-top:8px}.fit-controls button{flex:1;font-size:10px;background:#aaa1e810;border:1px solid #a79be650;border-radius:3px;padding:5px}.fit-controls [aria-pressed=true]{border-color:var(--accent);color:#abf7ff}.advanced{margin-top:12px;border-top:1px solid #a79be622;padding-top:9px}.advanced summary{font-size:10px;color:#b4a6d9;cursor:pointer}.advanced .row{padding:8px 0}.advanced .row-title{font-size:12px}.advanced .switch{transform:scale(.8);transform-origin:right center}.actions{display:flex;gap:8px;margin-top:6px}.reset{flex:1;border:1px solid #a79be63d;background:#b1a0e409;border-radius:3px;font-size:10px;padding:7px;color:#cfc4ee}.notice{font-size:10px;line-height:1.6;color:#ffdaa4;margin:9px 0 0}.spark{position:fixed;left:0;top:0;width:4px;height:4px;background:var(--accent);box-shadow:-4px 0 var(--accent),4px 0 var(--accent),0 -4px var(--accent),0 4px var(--accent),0 0 8px #a5f9ff;pointer-events:none;opacity:0}@media(max-width:480px){.panel{padding:19px}.title{font-size:23px}.subtitle{font-size:15px}.palettes{gap:11px}.dock{padding:9px 12px}.row-title{font-size:15px}}@media print{:host{display:none!important}}\n";
  const SCENE_CSS = ":host{all:initial}.sky{position:absolute;inset:0;overflow:hidden;background:var(--sky)}.terrain{position:absolute;inset:0;width:100%;height:100%;object-fit:var(--wallpaper-fit,cover);object-position:center bottom;image-rendering:pixelated;opacity:calc(.62 + var(--glow)*.38)}.horizon{position:absolute;inset:0;z-index:1;pointer-events:none;background:linear-gradient(180deg,#15133e16,transparent 70%)}:host([data-palette=forest]) .horizon{background:linear-gradient(180deg,#071d3ac9,#0d304776 60%,#071c2810)}:host([data-palette=sakura]) .horizon{background:linear-gradient(180deg,#2d174eac,#341c573d 65%,transparent)}:host([data-palette=custom]) .horizon{background:linear-gradient(180deg,#10112c80,#10112c45)}:host([data-palette=custom]) .terrain{image-rendering:auto;object-position:center}.moon{position:absolute;z-index:2;top:6%;right:4.5%;width:clamp(45px,5.5vw,83px);image-rendering:pixelated;filter:drop-shadow(0 0 6px #e8baff3b)}:host(:not([data-palette=night])) .moon{display:none}.cloud{position:absolute;z-index:2;width:clamp(100px,13vw,210px);image-rendering:pixelated;opacity:calc(.5 + var(--glow)*.35);animation:cloud-drift 68s steps(100,end) infinite alternate}.cloud-one{top:20%;left:20%}.cloud-two{top:16%;right:13%;animation-delay:-34s;animation-direction:alternate-reverse}.cloud-three{top:57%;left:1%;width:clamp(90px,14vw,200px);animation-delay:-16s}.star{position:absolute;z-index:2;width:2px;height:2px;background:var(--star-color,var(--accent));opacity:.8;animation:twinkle var(--duration) steps(3,end) infinite alternate;animation-delay:var(--delay);box-shadow:0 0 5px var(--star-color,var(--accent))}.star.cross{width:3px;height:3px;box-shadow:-3px 0 var(--star-color,var(--accent)),3px 0 var(--star-color,var(--accent)),0 -3px var(--star-color,var(--accent)),0 3px var(--star-color,var(--accent)),0 0 8px var(--star-color,var(--accent))}.star.big{width:4px;height:4px;box-shadow:-4px 0 var(--star-color,var(--accent)),4px 0 var(--star-color,var(--accent)),0 -4px var(--star-color,var(--accent)),0 4px var(--star-color,var(--accent)),0 0 12px var(--star-color,var(--accent))}:host([data-stars=false]) .star{display:none}:host([data-clouds=false]) .cloud{display:none}:host([data-motion=false]) *,:host([data-paused=true]) *{animation-play-state:paused!important}@keyframes cloud-drift{to{transform:translateX(80px)}}@keyframes twinkle{from{opacity:calc(var(--glow)*.35)}to{opacity:calc(.35 + var(--glow)*.65)}}@media(prefers-reduced-motion:reduce){*{animation:none!important}}@media(max-width:600px){.terrain{object-position:center bottom}.moon{top:8%;right:7%;width:45px}.cloud-three{display:none}}@media print{:host{display:none!important}}\n";
  const DEFAULTS = Object.freeze({ enabled: true, palette: 'night', glow: 70, motion: true, stars: true, clouds: true, cursor: true, customFit: 'cover' });
  const dataURL = svg => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  function resource(name) {
    if(typeof chrome!=='undefined'&&chrome.runtime?.id&&typeof chrome.runtime.getURL==='function')return chrome.runtime.getURL('assets/'+name+'.webp');
    if(typeof GM_getResourceURL==='function')try{const url=GM_getResourceURL('ta_'+name.replaceAll('-','_'));if(typeof url==='string'&&url)return url;}catch{}
    if(SCRIPT_URL)return new URL('assets/'+name+'.webp',SCRIPT_URL).href;
    return dataURL('<svg xmlns="http://www.w3.org/2000/svg" width="2" height="2"><path fill="#15133e" d="M0 0H2V2H0Z"/></svg>');
  }
  function validImage(raw) {
    if(!raw||typeof raw!=='object'||typeof raw.data!=='string'||!/^data:image\/(webp|png);base64,/.test(raw.data)||raw.data.length>4000000)return null;
    return {data:raw.data,name:typeof raw.name==='string'?raw.name.slice(0,160):'My wallpaper',id:typeof raw.id==='string'?raw.id:'saved'};
  }
  function sanitize(raw) {
    const result = { ...DEFAULTS };
    if (raw && typeof raw === 'object') {
      for (const k of ['enabled', 'motion', 'stars', 'clouds', 'cursor']) if (typeof raw[k] === 'boolean') result[k] = raw[k];
      if (Object.hasOwn(PALETTES, raw.palette)||raw.palette==='custom') result.palette = raw.palette;
      if(raw.customFit==='cover'||raw.customFit==='contain')result.customFit=raw.customFit;
      if (typeof raw.glow === 'number' && Number.isFinite(raw.glow)) result.glow = Math.round(Math.max(10, Math.min(100, raw.glow)));
    }
    return result;
  }
  // Construct DOM directly: no innerHTML/eval and no Trusted Types policy changes.
  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    for (const [name, value] of Object.entries(attrs)) {
      if (name === 'text') node.textContent = value;
      else if (name === 'class') node.className = value;
      else node.setAttribute(name, String(value));
    }
    node.append(...children);
    return node;
  }
  function pixelStar() {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    for (const [k,v] of Object.entries({viewBox:'0 0 24 24',class:'pixel-icon','aria-hidden':'true','shape-rendering':'crispEdges'})) svg.setAttribute(k,v);
    const outline = document.createElementNS(ns,'path');
    outline.setAttribute('d','M10 1H14V5H16V8H22V12H20V14H18V20H14V18H10V20H6V14H4V12H2V8H8V5H10Z');
    outline.setAttribute('fill','var(--accent)');
    const eye1 = document.createElementNS(ns,'rect'), eye2 = document.createElementNS(ns,'rect');
    for (const [eye,x] of [[eye1,9],[eye2,14]]) {
      for (const [k,v] of Object.entries({x,y:9,width:2,height:4,fill:'#14223d'})) eye.setAttribute(k,String(v));
    }
    svg.append(outline,eye1,eye2); return svg;
  }
  function lineIcon(name) {
    const paths={stars:'M12 2l2.6 7.4L22 12l-7.4 2.6L12 22l-2.6-7.4L2 12l7.4-2.6Z',clouds:'M7 19h11a4 4 0 0 0 .6-8A6 6 0 0 0 7.2 8.2 5.4 5.4 0 0 0 7 19Z',cursor:'M5 2l14 13h-7l-3 7Z M12 15l4 6',upload:'M12 16V3m-5 5 5-5 5 5M4 14v7h16v-7',save:'M4 3h13l4 4v14H3V3ZM7 3v6h10V3M7 21v-8h10v8'};
    const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg'),path=document.createElementNS(ns,'path');
    for(const [key,value] of Object.entries({viewBox:'0 0 24 24',width:'21',height:'21',fill:'none',stroke:'currentColor','stroke-width':'1.6','stroke-linejoin':'round','aria-hidden':'true'}))svg.setAttribute(key,value);
    path.setAttribute('d',paths[name]);svg.append(path);return svg;
  }
  function storageAdapter(key=KEY) {
    if (typeof chrome !== 'undefined' && chrome.runtime?.id && chrome.storage?.local) {
      return {
        label: 'Lưu chung trên trình duyệt',
        async read() { return (await chrome.storage.local.get(key))[key]; },
        async write(value) { await chrome.storage.local.set({[key]:value}); },
        listen(fn) { chrome.storage.onChanged.addListener((changes,area) => { if (area === 'local' && changes[key]) fn(changes[key].newValue); }); }
      };
    }
    if (typeof GM_getValue === 'function' && typeof GM_setValue === 'function') {
      return {
        label: 'Lưu chung qua Tampermonkey',
        async read() { return await GM_getValue(key, null); },
        async write(value) { await GM_setValue(key, value); },
        listen(fn) { if (typeof GM_addValueChangeListener === 'function') GM_addValueChangeListener(key, (_key,_old,value,remote) => { if (remote) fn(value); }); }
      };
    }
    return {
      label: 'Lưu trên trình duyệt của trang này',
      async read() { return JSON.parse(localStorage.getItem(key)); },
      async write(value) { localStorage.setItem(key, JSON.stringify(value)); },
      listen(fn) { window.addEventListener('storage',event => { if (event.key === key) { try { fn(JSON.parse(event.newValue)); } catch {} } }); }
    };
  }
  async function start() {
    if (document.getElementById('themeai-ui')) return;
    const host = el('div', {id:'themeai-ui'});
    // Mount the guard before the asynchronous storage read, including if two editions run.
    host.style.cssText = 'all:initial;font:13px/1.5 system-ui,sans-serif;color:#edf0fc;position:fixed;right:18px;bottom:18px;z-index:2147483000;pointer-events:none;color-scheme:dark;';
    document.body.append(host);
    const root = document.documentElement;
    const storage = storageAdapter();
    const imageStore=storageAdapter(IMAGE_KEY);
    let settings = {...DEFAULTS}, storageFailed = false, customImage=null, uploadMessage='', imageRevision=0;
    try { settings = sanitize(await storage.read()); } catch { storageFailed = true; }
    try { customImage=validImage(await imageStore.read()); } catch {}
    const hostname = location.hostname;
    const platform = hostname === 'claude.ai' ? 'claude' : 'chatgpt';
    host.dataset.platform = platform;
    root.dataset.themeaiPlatform = platform;
    const pageStyle = el('style',{id:'themeai-page-style',text:PAGE_CSS}); document.head.append(pageStyle);
    const scene = el('div',{id:'themeai-scene','aria-hidden':'true'});
    scene.style.cssText = 'all:initial;position:fixed;inset:0;z-index:-1;pointer-events:none;';
    const sceneShadow = scene.attachShadow({mode:'open'});
    const terrain = el('img',{class:'terrain',alt:'',draggable:'false'});
    const moon = el('img',{class:'moon',alt:'',draggable:'false'});
    const clouds = [1,2,3].map((_,i) => el('img',{class:'cloud cloud-'+['one','two','three'][i],alt:'',draggable:'false'}));
    const sky = el('div',{class:'sky'},[terrain,el('div',{class:'horizon'}),moon,...clouds]);
    for (let i=0;i<72;i++) {
      const star=el('i',{class:'star'+(i%11===0?' big':i%5===0?' cross':'')});
      star.style.cssText = `left:${(i*37.91+5)%100}%;top:${(i*19.73+4)%84}%;--duration:${3+i%6}s;--delay:-${i*.57}s;--star-color:${['#88efff','#c9a8ff','#f8e7bc','#ffffff'][i%4]};`;
      sky.append(star);
    }
    sceneShadow.append(el('style',{text:SCENE_CSS}),sky);
    document.body.append(scene);
    const shadow = host.attachShadow({mode:'open'});
    shadow.append(el('style',{text:PANEL_CSS}));
    const close = el('button',{class:'close',type:'button','aria-label':'Đóng cài đặt',text:'×'});
    const title=el('h2',{class:'title',id:'ta-panel-title',text:'Pixel Studio'});
    const panel = el('section',{class:'panel'},[
      el('div',{class:'top'},[title,close]),
      el('p',{class:'subtitle',text:'Make your space a little more magical.'})
    ]);
    const frame = el('div',{class:'frame',id:'ta-panel',role:'region','aria-labelledby':'ta-panel-title'} ,[panel]); frame.hidden=true;
    const inputs = new Map();
    function toggle(key,titleText,hint) {
      const input=el('input',{type:'checkbox',role:'switch',class:'switch','data-setting':key});
      inputs.set(key,input);
      const text=el('span',{class:'row-title'});
      if(['stars','clouds','cursor'].includes(key))text.append(el('span',{class:'row-icon','aria-hidden':'true'},[lineIcon(key)]));
      text.append(el('span',{text:titleText}));
      if (hint) text.append(el('small',{text:hint}));
      return el('label',{class:'row'},[text,input]);
    }
    const swatches = el('div',{class:'palettes',role:'group','aria-label':'Chọn cảnh pixel'});
    host.style.setProperty('--reference','url("'+resource('approved-reference')+'")');
    for(const [key,p] of Object.entries(PALETTES)) {
      const photo=el('span',{class:'thumb','data-photo':key,'aria-hidden':'true'});
      photo.style.backgroundSize=ASSETS[key].crop.size;photo.style.backgroundPosition=ASSETS[key].crop.position;
      const button=el('button',{type:'button',class:'palette','data-palette':key,'aria-pressed':'false',title:p.subtitle},[
        photo,el('span',{text:p.name})
      ]);
      button.addEventListener('click',()=>{settings.palette=key; apply(); save();});
      swatches.append(button);
    }
    const range = el('input',{type:'range',id:'ta-glow',min:'10',max:'100',step:'1','data-setting':'glow','aria-label':'Độ sáng hiệu ứng'});
    inputs.set('glow',range);
    const output=el('output',{for:'ta-glow'});
    panel.append(swatches,
      el('label',{class:'range-row',for:'ta-glow'},[el('span',{text:'Glow'}),output]),
      el('div',{class:'glow-control'},[el('span',{class:'sun','aria-hidden':'true',text:'☼'}),range,el('span',{class:'sun','aria-hidden':'true',text:'☼'})]),
      el('div',{class:'divider'},[
        toggle('stars','Floating stars'),
        toggle('clouds','Pixel clouds'),
        toggle('cursor','Cursor sparkle')
      ])
    );
    const reset=el('button',{class:'reset',type:'button',text:'Khôi phục mặc định'});
    const dockSide=el('button',{class:'reset',type:'button',text:'Chuyển góc'});
    const notice=el('p',{class:'notice',role:'status'}); notice.hidden=true;
    const foot=el('p',{class:'foot',title:storage.label},[lineIcon('save'),el('span',{text:'Saved on this browser'})]);
    const fileInput=el('input',{class:'file-input',type:'file',accept:'image/*','aria-label':'Choose wallpaper from computer'});
    const upload=el('button',{class:'upload-button',type:'button'},[lineIcon('upload'),el('span',{text:'Upload image'})]);
    const customThumb=el('img',{class:'custom-thumb',alt:'Your wallpaper'});
    const customName=el('div',{class:'custom-name'});
    const usePhoto=el('button',{class:'mini-button',type:'button',text:'Use image'});
    const removePhoto=el('button',{class:'mini-button remove',type:'button',text:'Remove'});
    const preview=el('div',{class:'custom-preview'},[customThumb,el('div',{},[customName,el('div',{class:'custom-buttons'},[usePhoto,removePhoto])])]);
    const fits=el('div',{class:'fit-controls',role:'group','aria-label':'Wallpaper fit'});
    for(const [value,label] of [['cover','Fill screen'],['contain','Fit image']]) {
      const button=el('button',{type:'button','data-fit':value,'aria-pressed':'false',text:label});
      button.addEventListener('click',()=>{settings.customFit=value;apply();save();});fits.append(button);
    }
    const advanced=el('details',{class:'advanced'},[el('summary',{text:'More settings'}),toggle('enabled','Bật theme pixel'),toggle('motion','Chuyển động'),el('div',{class:'actions'},[reset,dockSide])]);
    panel.append(foot,el('div',{class:'upload-section'},[el('p',{class:'upload-heading',text:'YOUR WALLPAPER'}),upload,fileInput,preview,fits]),advanced,notice);
    const dot=el('span',{class:'dock-status','aria-hidden':'true'});
    const dock=el('button',{type:'button',class:'dock','aria-label':'Mở cài đặt Pixel Studio','aria-controls':'ta-panel','aria-expanded':'false'},[pixelStar(),el('span',{text:'Pixel Studio'}),dot]);
    shadow.append(frame,dock);
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    const fine=matchMedia('(pointer: fine)');
    const sparks=Array.from({length:10},()=>{const spark=el('i',{class:'spark','aria-hidden':'true'});shadow.append(spark);return spark;});
    let sparkIndex=0, request=0, lastTime=-100, lastX=-100, lastY=-100, saveTimer=0, saveQueue=Promise.resolve(), localDirty=false, activeScene='';
    const animations=new Set();
    const canMove=()=>settings.enabled && settings.motion && !reduced.matches && !document.hidden;
    function clearSparks() {
      if(request) cancelAnimationFrame(request); request=0;
      for (const animation of animations) animation.cancel(); animations.clear();
      for(const spark of sparks) spark.style.opacity='0';
    }
    function renderNotice() {
      const messages=[];
      if(reduced.matches) messages.push('Chuyển động đang tắt theo cài đặt giảm chuyển động của hệ thống.');
      if(storageFailed) messages.push('Không lưu được lựa chọn; theme vẫn hoạt động trong tab này.');
      if(uploadMessage)messages.push(uploadMessage);
      notice.textContent=messages.join(' '); notice.hidden=!messages.length;
    }
    function apply() {
      const active=settings.palette==='custom'?(customImage?'custom':'night'):settings.palette;
      const p=PALETTES[active]||PALETTES.night;
      if(settings.enabled) root.dataset.themeai=settings.palette; else root.removeAttribute('data-themeai');
      scene.hidden=!settings.enabled; scene.style.display=settings.enabled?'block':'none';
      // Use opaque readable surfaces for composers/menus, translucent main and side panels.
      const values={accent:p.accent,secondary:p.secondary,rgb:p.rgb,sky:p.sky,solid:p.surface,
        main:p.sky+'88',surface:p.surface+'eb',raised:p.surface,message:p.surface+'ee',sidebar:p.sky+'b8',
        hsl:p.hsl,'hsl-raised':p.hsl.replace(/\d+%$/, '17%'),glow:settings.glow/100};
      for(const [key,value] of Object.entries(values)) root.style.setProperty('--ta-'+key,String(value));
      for(const [key,value] of Object.entries({accent:p.accent,rgb:p.rgb,sky:p.sky,glow:settings.glow/100})) scene.style.setProperty('--'+key,String(value));
      host.style.setProperty('--accent',p.accent); host.style.setProperty('--secondary',p.secondary);
      const source=active==='custom'?customImage.data:resource(active);
      if(activeScene!==source) {
        terrain.src=source;activeScene=source;
        const art=ASSETS[active]||ASSETS.night;
        moon.src=dataURL(art.moon);clouds.forEach(cloud=>{cloud.src=dataURL(art.cloud);});
      }
      scene.dataset.palette=active;
      scene.style.setProperty('--wallpaper-fit',active==='custom'?settings.customFit:'cover');
      scene.dataset.motion=String(canMove()); scene.dataset.stars=String(settings.stars); scene.dataset.clouds=String(settings.clouds);
      scene.dataset.paused=String(document.hidden);
      dot.style.opacity=settings.enabled?'1':'.25';
      for(const [key,input] of inputs) { if(input.type==='checkbox') input.checked=settings[key]; else input.value=String(settings[key]); }
      for(const button of swatches.children) button.setAttribute('aria-pressed',String(button.dataset.palette===settings.palette));
      output.textContent=settings.glow+'%';
      range.style.setProperty('--value',settings.glow+'%');
      preview.hidden=!customImage;fits.hidden=!customImage;
      if(customImage){if(customThumb.src!==customImage.data)customThumb.src=customImage.data;customName.textContent=customImage.name;}
      else customThumb.removeAttribute('src');
      preview.dataset.selected=String(active==='custom');
      for(const button of fits.children)button.setAttribute('aria-pressed',String(button.dataset.fit===settings.customFit));
      if(!canMove()||!settings.cursor) clearSparks();
      renderNotice();
    }
    function save() {
      localDirty=true;
      clearTimeout(saveTimer);
      // Debounce the slider, then serialize writes so an older choice cannot win.
      saveTimer=setTimeout(()=>{
        const value={...settings};
        saveQueue=saveQueue.then(()=>storage.write(value)).then(()=>{storageFailed=false;if(JSON.stringify(value)===JSON.stringify(settings))localDirty=false;renderNotice();},()=>{storageFailed=true;localDirty=false;renderNotice();});
      },90);
    }
    function openPanel(open,restoreFocus=true) {
      frame.hidden=!open; dock.setAttribute('aria-expanded',String(open));
      if(open) close.focus(); else if(restoreFocus) dock.focus();
    }
    dock.addEventListener('click',()=>openPanel(frame.hidden));
    close.addEventListener('click',()=>openPanel(false));
    shadow.addEventListener('keydown',event=>{if(event.key==='Escape'&&!frame.hidden){event.preventDefault();event.stopPropagation();openPanel(false);}});
    shadow.addEventListener('input',event=>{
      const key=event.target.dataset.setting; if(!inputs.has(key)) return;
      settings[key]=event.target.type==='checkbox'?event.target.checked:Number(event.target.value); apply(); save();
    });
    reset.addEventListener('click',()=>{settings={...DEFAULTS};apply();save();});
    upload.addEventListener('click',()=>fileInput.click());
    usePhoto.addEventListener('click',()=>{if(customImage){settings.palette='custom';apply();save();}});
    removePhoto.addEventListener('click',async()=>{
      imageRevision++;upload.disabled=false;customImage=null;if(settings.palette==='custom')settings.palette='night';
      try{await imageStore.write(null);}catch{storageFailed=true;}
      uploadMessage='';apply();save();
    });
    fileInput.addEventListener('change',async()=>{
      const file=fileInput.files?.[0];if(!file)return;
      const revision=++imageRevision;upload.disabled=true;uploadMessage='Đang xử lý ảnh trên trình duyệt…';renderNotice();
      let objectURL;
      try{
        if(file.size>32*1024*1024)throw new Error('Ảnh quá lớn. Hãy chọn file nhỏ hơn 32 MB.');
        objectURL=URL.createObjectURL(file);const image=new Image();image.src=objectURL;await image.decode();
        const scale=Math.min(1,2048/Math.max(image.naturalWidth,image.naturalHeight));
        const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(image.naturalWidth*scale));canvas.height=Math.max(1,Math.round(image.naturalHeight*scale));
        canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);
        let data=canvas.toDataURL('image/webp',.9);
        if(data.length>3500000)data=canvas.toDataURL('image/webp',.72);
        if(data.length>4000000)throw new Error('Ảnh vẫn quá lớn để lưu. Hãy chọn bản ảnh có độ phân giải thấp hơn.');
        const next=validImage({data,name:file.name,id:Date.now().toString(36)});
        if(!next)throw new Error('Trình duyệt không đọc được định dạng này. Thử PNG, JPG, WebP, GIF, SVG hoặc AVIF.');
        if(revision!==imageRevision)return;
        try{await imageStore.write(next);storageFailed=false;}catch{storageFailed=true;}
        if(revision!==imageRevision)return;
        customImage=next;settings.palette='custom';uploadMessage='';apply();save();
      }catch(error){if(revision===imageRevision){uploadMessage=error?.message?.includes('Ảnh')?error.message:'Không đọc được ảnh. Hãy thử một file ảnh khác.';renderNotice();}}
      finally{if(objectURL)URL.revokeObjectURL(objectURL);fileInput.value='';if(revision===imageRevision)upload.disabled=false;}
    });
    dockSide.addEventListener('click',()=>{
      const left=host.style.left==='18px';
      host.style.left=left?'auto':'18px';host.style.right=left?'18px':'auto';
      frame.style.left=left?'auto':'18px';frame.style.right=left?'18px':'auto';
    });
    document.addEventListener('pointerdown',event=>{if(!frame.hidden&&!event.composedPath().includes(host))openPanel(false,false);},{passive:true});
    document.addEventListener('pointermove',event=>{
      if(!canMove()||!settings.cursor||!fine.matches||event.pointerType==='touch'||event.composedPath().includes(host))return;
      if(event.timeStamp-lastTime<65||Math.hypot(event.clientX-lastX,event.clientY-lastY)<14)return;
      lastTime=event.timeStamp;lastX=event.clientX;lastY=event.clientY;
      if(request)cancelAnimationFrame(request);
      request=requestAnimationFrame(()=>{
        request=0;if(!canMove()||!settings.cursor)return;
        const spark=sparks[sparkIndex++%sparks.length];
        for(const old of spark.getAnimations()){old.cancel();animations.delete(old);}
        spark.style.left=Math.round(event.clientX/2)*2+'px';spark.style.top=Math.round(event.clientY/2)*2+'px';
        const animation=spark.animate([{opacity:.7,transform:'translate(0,0) scale(.6)'},{opacity:0,transform:'translate(0,20px) scale(.2)'}],{duration:600,easing:'steps(5,end)'});
        animations.add(animation);animation.onfinish=()=>animations.delete(animation);
      });
    },{passive:true});
    document.addEventListener('visibilitychange',()=>{scene.dataset.paused=String(document.hidden);scene.dataset.motion=String(canMove());if(document.hidden)clearSparks();});
    reduced.addEventListener('change',apply);
    fine.addEventListener('change',()=>{if(!fine.matches)clearSparks();});
    storage.listen(value=>{
      if(localDirty)return;
      const updated=sanitize(value);
      if(JSON.stringify(updated)!==JSON.stringify(settings)){settings=updated;apply();}
    });
    imageStore.listen(value=>{customImage=validImage(value);apply();});
    // Add only styling markers. Input values, messages, code and app handlers stay intact.
    const promptSelector='#prompt-textarea, #mobile-composer-prompt, [data-testid="chat-input"][contenteditable="true"], textarea[data-testid="chat-input"], [data-chat-input-container] textarea, .ProseMirror[contenteditable="true"], [contenteditable="true"][role="textbox"], [contenteditable="plaintext-only"][role="textbox"]';
    const sidebarSelector='#sidebar, #ds-sidebar, #stage-slideover-sidebar, [data-testid="sidebar"], [data-testid="claude-sidebar"], [data-testid="sidebar-content"], nav[aria-label="Sidebar"], .dframe-sidebar';
    const preserve='pre, code, kbd, .monaco-editor, .cm-editor, [data-themeai-preserve]';
    function neutral(color,includeTransparent=false) {
      const parts=color.match(/[\d.]+/g)?.map(Number);
      if(!parts||parts.length<3||(!includeTransparent&&parts.length===4&&parts[3]<.85))return null;
      return Math.max(...parts.slice(0,3))-Math.min(...parts.slice(0,3))<5?parts[0]:null;
    }
    function isNeutralGradient(gradient) {
      const stops=[...gradient.matchAll(/rgba?\([^)]+\)/g)].map(match=>match[0]);
      return gradient.includes('gradient(')&&!gradient.includes('url(')&&stops.length>0&&stops.every(color=>neutral(color,true)!==null);
    }
    function markLightweightShell(node) {
      const shell=document.getElementById('web-mobile-root');
      if(!shell||node.closest(preserve))return;
      const scopes=shell===node||shell.contains(node)?[node]:[...node.querySelectorAll('#web-mobile-root')];
      for(const scope of scopes) {
        const tags='div, section, header, aside, nav, main, form, button, a, span, p, h1, h2, h3, label, textarea, input';
        const nodes=[...(scope.matches(tags)?[scope]:[]),...scope.querySelectorAll(tags)];
        for(const element of nodes) {
          if(element.closest(preserve))continue;
          const computed=getComputedStyle(element);
          const ink=neutral(computed.color),bg=neutral(computed.backgroundColor);
          const neutralGradient=isNeutralGradient(computed.backgroundImage);
          if(ink!==null&&ink<220&&!element.hasAttribute('data-themeai-neutral-text'))element.dataset.themeaiNeutralText=ink<100?'primary':'muted';
          if((bg!==null||neutralGradient)&&/^(DIV|SECTION|HEADER|ASIDE|NAV|MAIN|FORM|BUTTON|A|INPUT|TEXTAREA)$/.test(element.tagName)&&!element.hasAttribute('data-themeai-neutral-bg'))element.dataset.themeaiNeutralBg='surface';
          if(neutralGradient)element.setAttribute('data-themeai-neutral-gradient','');
          if(/^(DIV|SECTION|HEADER|ASIDE|NAV)$/.test(element.tagName))for(const pseudo of ['before','after']) {
            const paint=getComputedStyle(element,'::'+pseudo);
            if(paint.content==='none'||paint.content==='normal'||paint.backgroundImage.includes('url('))continue;
            if(neutral(paint.backgroundColor)!==null||isNeutralGradient(paint.backgroundImage))element.setAttribute('data-themeai-neutral-'+pseudo,'');
          }
        }
      }
      // Clear just the ancestor canvases, preserving opaque forms, menus, and cards.
      for(const anchor of shell.querySelectorAll('main, [role="main"], [data-themeai-sidebar]')) {
        for(let parent=anchor;parent&&parent!==shell;parent=parent.parentElement)if(parent.hasAttribute('data-themeai-neutral-bg'))parent.dataset.themeaiNeutralBg='canvas';
      }
    }
    function mark(node) {
      if(!(node instanceof Element)||node===host||node===scene||node.closest('#themeai-ui, #themeai-scene'))return;
      const prompts=[...(node.matches(promptSelector)?[node]:[]),...node.querySelectorAll(promptSelector)];
      for(const prompt of prompts) {
        const composer=prompt.closest('form, [data-testid="composer"], [data-testid="chat-input-container"], [data-testid="chat-input-grid-container"], [data-chat-input-container]')
          ||(platform==='claude'?prompt.closest('.bg-bg-000'):null);
        if(composer)composer.setAttribute('data-themeai-composer','');
      }
      const sidebars=[...(node.matches(sidebarSelector)?[node]:[]),...node.querySelectorAll(sidebarSelector)];
      for(const sidebar of sidebars)sidebar.setAttribute('data-themeai-sidebar','');
      if(platform==='chatgpt')markLightweightShell(node);
    }
    mark(document.body);
    if(document.readyState!=='complete')window.addEventListener('load',()=>mark(document.body),{once:true});
    new MutationObserver(records=>{
      for(const record of records)for(const node of record.addedNodes)if(node.nodeType===Node.ELEMENT_NODE)mark(node);
    }).observe(document.body,{childList:true,subtree:true});
    apply();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
