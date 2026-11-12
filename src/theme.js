/* ThemeAI / Pixel Studio — no network, no content replacement, no remote code. */
(() => {
  'use strict';
  if (window.top !== window.self) return;
  const KEY = 'themeai.pixel.v1';
  const IMAGE_KEY = 'themeai.pixel.wallpaper.v1';
  const VERSION = '1.1.2';
  const SCRIPT_URL = document.currentScript?.src;
  const PALETTES = __PALETTES__;
  const ASSETS = __ASSETS__;
  const PAGE_CSS = __PAGE_CSS__;
  const PANEL_CSS = __PANEL_CSS__;
  const SCENE_CSS = __SCENE_CSS__;
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
      if(settings.enabled) root.dataset.themeai=active; else root.removeAttribute('data-themeai');
      scene.hidden=!settings.enabled; scene.style.display=settings.enabled?'block':'none';
      // Pixel presets keep their original colors; personal photos use neutral glass.
      const values={accent:p.accent,secondary:p.secondary,rgb:p.rgb,sky:p.sky,solid:p.surface,
        main:p.sky+'88',surface:p.surface+'eb',raised:p.surface,message:p.surface+'ee',sidebar:p.sky+'b8',
        hsl:p.hsl,'hsl-raised':p.hsl.replace(/\d+%$/, '17%'),glow:settings.glow/100,
        ...(active==='custom'?{
          sky:'#10131d',main:'transparent',solid:'rgb(18 24 36 / .82)',
          surface:'rgb(18 24 36 / .72)',raised:'rgb(29 37 53 / .86)',
          message:'rgb(18 24 36 / .80)',sidebar:'rgb(15 21 33 / .80)',
          hsl:'228 27% 8% / .78','hsl-raised':'228 20% 16% / .86'
        }:{})};
      for(const [key,value] of Object.entries(values)) root.style.setProperty('--ta-'+key,String(value));
      for(const [key,value] of Object.entries({accent:p.accent,rgb:p.rgb,sky:values.sky,glow:settings.glow/100})) scene.style.setProperty('--'+key,String(value));
      host.style.setProperty('--accent',p.accent); host.style.setProperty('--secondary',p.secondary);
      host.dataset.palette=settings.enabled?active:'';
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
    const promptSelector='textarea, #prompt-textarea, #mobile-composer-prompt, [data-testid="chat-input"][contenteditable="true"], .ProseMirror[contenteditable="true"], [contenteditable="true"][role="textbox"], [contenteditable="plaintext-only"][role="textbox"]';
    const composerSelector='[data-testid="composer"], [data-testid="chat-input-container"], [data-testid="chat-input-grid-container"], [data-chat-input-container]';
    const sidebarSelector='#sidebar, #ds-sidebar, #stage-slideover-sidebar, [data-testid="sidebar"], [data-testid="claude-sidebar"], [data-testid="sidebar-content"], nav[aria-label="Sidebar"], .dframe-sidebar';
    const toolbarSelector='header, [role="toolbar"], [data-testid="page-header"], [data-testid="composer-toolbar"], [data-testid="composer-action-bar"]';
    const preserve='pre, code, kbd, .monaco-editor, .cm-editor, [data-themeai-preserve]';
    function findComposer(prompt) {
      const container=prompt.closest('form')||prompt.closest(composerSelector)
        ||(platform==='claude'?prompt.closest('.bg-bg-000'):null);
      if(container)return container;
      // Codex also has textareas without a ChatGPT id or a surrounding form.
      const canvas='body, main, [role="main"], #root, #app, #__next';
      let parent=prompt.parentElement;
      for(let depth=0;parent&&depth<4;depth++,parent=parent.parentElement) {
        if(parent.matches(canvas)||parent.matches(sidebarSelector))break;
        if(parent.querySelector('button'))return parent;
      }
      return prompt.parentElement&&!prompt.parentElement.matches(canvas)?prompt.parentElement:prompt;
    }
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
        if(prompt.closest(preserve))continue;
        const composer=findComposer(prompt);
        composer.setAttribute('data-themeai-composer','');
        // A single glass pane: nested native input shells must not stack dark fills.
        for(let layer=prompt;layer&&layer!==composer;layer=layer.parentElement)layer.setAttribute('data-themeai-composer-layer','');
      }
      const sidebars=[...(node.matches(sidebarSelector)?[node]:[]),...node.querySelectorAll(sidebarSelector)];
      for(const sidebar of sidebars)sidebar.setAttribute('data-themeai-sidebar','');
      const toolbars=[...(node.matches(toolbarSelector)?[node]:[]),...node.querySelectorAll(toolbarSelector)];
      for(const toolbar of toolbars)if(!toolbar.closest(preserve))toolbar.setAttribute('data-themeai-toolbar','');
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
