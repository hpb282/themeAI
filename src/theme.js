/* ThemeAI / Pixel Studio — no network, no content replacement, no remote code. */
(() => {
  'use strict';
  if (window.top !== window.self) return;
  const KEY = 'themeai.pixel.v1';
  const VERSION = '1.0.0';
  const PALETTES = __PALETTES__;
  const ASSETS = __ASSETS__;
  const PAGE_CSS = __PAGE_CSS__;
  const PANEL_CSS = __PANEL_CSS__;
  const SCENE_CSS = __SCENE_CSS__;
  const DEFAULTS = Object.freeze({ enabled: true, palette: 'night', glow: 70, motion: true, stars: true, clouds: true, cursor: true });
  const dataURL = svg => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  function sanitize(raw) {
    const result = { ...DEFAULTS };
    if (raw && typeof raw === 'object') {
      for (const k of ['enabled', 'motion', 'stars', 'clouds', 'cursor']) if (typeof raw[k] === 'boolean') result[k] = raw[k];
      if (Object.hasOwn(PALETTES, raw.palette)) result.palette = raw.palette;
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
  function storageAdapter() {
    if (typeof chrome !== 'undefined' && chrome.runtime?.id && chrome.storage?.local) {
      return {
        label: 'Lưu chung trên trình duyệt',
        async read() { return (await chrome.storage.local.get(KEY))[KEY]; },
        async write(value) { await chrome.storage.local.set({[KEY]:value}); },
        listen(fn) { chrome.storage.onChanged.addListener((changes,area) => { if (area === 'local' && changes[KEY]) fn(changes[KEY].newValue); }); }
      };
    }
    if (typeof GM_getValue === 'function' && typeof GM_setValue === 'function') {
      return {
        label: 'Lưu chung qua Tampermonkey',
        async read() { return await GM_getValue(KEY, null); },
        async write(value) { await GM_setValue(KEY, value); },
        listen(fn) { if (typeof GM_addValueChangeListener === 'function') GM_addValueChangeListener(KEY, (_key,_old,value,remote) => { if (remote) fn(value); }); }
      };
    }
    return {
      label: 'Lưu trên trình duyệt của trang này',
      async read() { return JSON.parse(localStorage.getItem(KEY)); },
      async write(value) { localStorage.setItem(KEY, JSON.stringify(value)); },
      listen(fn) { window.addEventListener('storage',event => { if (event.key === KEY) { try { fn(JSON.parse(event.newValue)); } catch {} } }); }
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
    let settings = {...DEFAULTS}, storageFailed = false;
    try { settings = sanitize(await storage.read()); } catch { storageFailed = true; }
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
    const sky = el('div',{class:'sky'},[el('div',{class:'horizon'}),terrain,moon,...clouds]);
    for (let i=0;i<38;i++) {
      const star=el('i',{class:'star'+(i%7===0?' cross':'')});
      star.style.cssText = `left:${(i*37.91+5)%100}%;top:${(i*19.73+4)%82}%;--duration:${3+i%6}s;--delay:-${i*.57}s;`;
      sky.append(star);
    }
    sceneShadow.append(el('style',{text:SCENE_CSS}),sky);
    document.body.append(scene);
    const shadow = host.attachShadow({mode:'open'});
    shadow.append(el('style',{text:PANEL_CSS}));
    const close = el('button',{class:'close',type:'button','aria-label':'Đóng cài đặt',text:'×'});
    const title=el('h2',{class:'title',id:'ta-panel-title',text:'Pixel Studio'});
    const panel = el('section',{class:'panel'},[
      el('div',{class:'top'},[pixelStar(),title,close]),
      el('p',{class:'subtitle',text:'Một chút phép màu pixel cho không gian của bạn.'})
    ]);
    const frame = el('div',{class:'frame',id:'ta-panel',role:'region','aria-labelledby':'ta-panel-title'} ,[panel]); frame.hidden=true;
    const inputs = new Map();
    function toggle(key,titleText,hint) {
      const input=el('input',{type:'checkbox',role:'switch',class:'switch','data-setting':key});
      inputs.set(key,input);
      const text=el('span',{class:'row-title',text:titleText});
      if (hint) text.append(el('small',{text:hint}));
      return el('label',{class:'row'},[text,input]);
    }
    panel.append(toggle('enabled','Bật theme pixel'));
    const swatches = el('div',{class:'palettes',role:'group','aria-label':'Chọn cảnh pixel'});
    for(const [key,p] of Object.entries(PALETTES)) {
      const button=el('button',{type:'button',class:'palette','data-palette':key,'aria-pressed':'false',title:p.subtitle},[
        el('img',{src:dataURL(ASSETS[key].thumb),alt:'',draggable:'false'}),el('span',{text:p.name})
      ]);
      button.addEventListener('click',()=>{settings.palette=key; apply(); save();});
      swatches.append(button);
    }
    const range = el('input',{type:'range',id:'ta-glow',min:'10',max:'100',step:'1','data-setting':'glow','aria-label':'Độ sáng hiệu ứng'});
    inputs.set('glow',range);
    const output=el('output',{for:'ta-glow'});
    panel.append(el('p',{class:'eyebrow',text:'CHỌN MỘT THẾ GIỚI'}),swatches,
      el('label',{class:'row range-row',for:'ta-glow'},[el('span',{text:'Độ sáng hiệu ứng'}),output]),range,
      el('div',{class:'divider'},[
        toggle('motion','Chuyển động','Tắt để giữ toàn bộ cảnh đứng yên'),
        toggle('stars','Sao lấp lánh','Những chấm sáng nhỏ trên bầu trời'),
        toggle('clouds','Mây pixel','Những đám mây trôi thật chậm'),
        toggle('cursor','Tia sáng theo chuột','Vệt pixel nhỏ khi di chuyển')
      ])
    );
    const reset=el('button',{class:'reset',type:'button',text:'Khôi phục mặc định'});
    const dockSide=el('button',{class:'reset',type:'button',text:'Chuyển góc'});
    const notice=el('p',{class:'notice',role:'status'}); notice.hidden=true;
    const foot=el('p',{class:'foot',text:storage.label+' · v'+VERSION});
    panel.append(el('div',{class:'actions'},[reset,dockSide]),foot,notice);
    const dot=el('span',{class:'dock-status','aria-hidden':'true'});
    const dock=el('button',{type:'button',class:'dock','aria-label':'Mở cài đặt Pixel Studio','aria-controls':'ta-panel','aria-expanded':'false'},[pixelStar(),el('span',{text:'Pixel Studio'}),dot]);
    shadow.append(frame,dock);
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    const fine=matchMedia('(pointer: fine)');
    const sparks=Array.from({length:10},()=>{const spark=el('i',{class:'spark','aria-hidden':'true'});shadow.append(spark);return spark;});
    let sparkIndex=0, request=0, lastTime=-100, lastX=-100, lastY=-100, saveTimer=0, saveQueue=Promise.resolve();
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
      notice.textContent=messages.join(' '); notice.hidden=!messages.length;
    }
    function apply() {
      const p=PALETTES[settings.palette];
      if(settings.enabled) root.dataset.themeai=settings.palette; else root.removeAttribute('data-themeai');
      scene.hidden=!settings.enabled; scene.style.display=settings.enabled?'block':'none';
      // Use opaque readable surfaces for composers/menus, translucent main and side panels.
      const values={accent:p.accent,secondary:p.secondary,rgb:p.rgb,sky:p.sky,solid:p.surface,
        main:p.sky+'b8',surface:p.surface+'ed',raised:p.surface,message:p.surface+'ee',sidebar:p.sky+'eb',
        hsl:p.hsl,'hsl-raised':p.hsl.replace(/\d+%$/, '17%'),glow:settings.glow/100};
      for(const [key,value] of Object.entries(values)) root.style.setProperty('--ta-'+key,String(value));
      for(const [key,value] of Object.entries({accent:p.accent,rgb:p.rgb,sky:p.sky,glow:settings.glow/100})) scene.style.setProperty('--'+key,String(value));
      host.style.setProperty('--accent',p.accent); host.style.setProperty('--secondary',p.secondary);
      if(scene.dataset.palette!==settings.palette) {
        terrain.src=dataURL(ASSETS[settings.palette].landscape); moon.src=dataURL(ASSETS[settings.palette].moon);
        clouds.forEach(cloud=>{cloud.src=dataURL(ASSETS[settings.palette].cloud);}); scene.dataset.palette=settings.palette;
      }
      scene.dataset.motion=String(canMove()); scene.dataset.stars=String(settings.stars); scene.dataset.clouds=String(settings.clouds);
      scene.dataset.paused=String(document.hidden);
      dot.style.opacity=settings.enabled?'1':'.25';
      for(const [key,input] of inputs) { if(input.type==='checkbox') input.checked=settings[key]; else input.value=String(settings[key]); }
      for(const button of swatches.children) button.setAttribute('aria-pressed',String(button.dataset.palette===settings.palette));
      output.textContent=settings.glow+'%';
      if(!canMove()||!settings.cursor) clearSparks();
      renderNotice();
    }
    function save() {
      clearTimeout(saveTimer);
      // Debounce the slider, then serialize writes so an older choice cannot win.
      saveTimer=setTimeout(()=>{
        const value={...settings};
        saveQueue=saveQueue.then(()=>storage.write(value)).then(()=>{storageFailed=false;renderNotice();},()=>{storageFailed=true;renderNotice();});
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
    dockSide.addEventListener('click',()=>{
      const left=host.style.left==='18px';
      host.style.left=left?'auto':'18px';host.style.right=left?'18px':'auto';
      frame.style.left=left?'auto':'0';frame.style.right=left?'0':'auto';
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
      const updated=sanitize(value);
      if(JSON.stringify(updated)!==JSON.stringify(settings)){settings=updated;apply();}
    });
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
