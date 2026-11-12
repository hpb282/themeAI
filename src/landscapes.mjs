// Original, deterministic SVG pixel art. All assets are embedded locally at build time.
export const palettes = {
  night: { name: 'Night', subtitle: 'Đêm đầy sao', accent: '#7ceaf5', secondary: '#b3a0ff', sky: '#101631', surface: '#111a35', rgb: '124 234 245', hsl: '225 43% 10%', hill: ['#303c78','#253363','#17284c','#0c1a35'], cloud: '#52538d', moon: '#ffe8a5' },
  forest: { name: 'Forest', subtitle: 'Rừng đom đóm', accent: '#8de3ba', secondary: '#bcd9a0', sky: '#0a201e', surface: '#0f2825', rgb: '141 227 186', hsl: '171 40% 9%', hill: ['#29564a','#1f453e','#16362f','#0b2523'], cloud: '#356756', moon: '#f3e9b5' },
  sakura: { name: 'Sakura', subtitle: 'Chiều hoa anh đào', accent: '#ffb2d0', secondary: '#ceb2ff', sky: '#24172c', surface: '#291d34', rgb: '255 178 208', hsl: '282 31% 11%', hill: ['#694665','#503450','#36273f','#241c32'], cloud: '#8d5d82', moon: '#ffe0bc' }
};

const rect = (x,y,w,h,fill) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`;
function ridge(seed, base, amp, color) {
  let d=`M0 360V${base}`;
  for(let x=0;x<=960;x+=8) {
    const shape=Math.sin(x/83+seed)*.55+Math.sin(x/37+seed*3)*.24+Math.cos(x/151-seed)*.3;
    const y=Math.round((base+shape*amp)/4)*4;
    d+=`H${x}V${y}`;
  }
  return `<path d="${d}H960V360Z" fill="${color}"/>`;
}
function pine(x,y,s,color) {
  return `<g transform="translate(${x} ${y}) scale(${s})" fill="${color}"><path d="M-2 0H2V8H6V12H4V16H10V20H6V24H14V28H9V32H18V36H3V45H-3V36H-18V32H-9V28H-14V24H-6V20H-10V16H-4V12H-6V8H-2Z"/></g>`;
}
function sakura(x,y,s) {
  let out=`<g transform="translate(${x} ${y}) scale(${s})">`;
  out+='<path d="M-3 0H4V-42H11V-49H18V-56H14V-53H7V-48H1V-67H-4V-46H-13V-50H-21V-54H-25V-48H-17V-42H-8V-35H-3Z" fill="#3b2942"/>';
  for(let i=0;i<22;i++) {
    const px=Math.round(Math.sin(i*2.4)*25/3)*3, py=-55+Math.round(Math.cos(i*1.6)*15/3)*3;
    out+=rect(px,py,9+i%3*3,6+i%2*3,['#bc6b9f','#d88bb4','#f1adc9','#995987'][i%4]);
  }
  return out+'</g>';
}
function landscape(key,p) {
  let art=ridge(2,215,62,p.hill[0])+ridge(5,254,44,p.hill[1])+ridge(8,290,27,p.hill[2]);
  if(key==='sakura') {
    art+=sakura(47,342,2.3)+sakura(920,340,2.9)+sakura(856,345,1.7);
  } else {
    for(const [x,y,s] of [[14,228,2.7],[62,258,2.2],[107,284,1.4],[920,225,3.1],[860,255,2.5],[815,287,1.5],[964,270,2]]) art+=pine(x,y,s,p.hill[3]);
  }
  art+=ridge(11,340,13,p.hill[3]);
  // Warm windows and lanterns: a quiet hint of a small world beyond the workspace.
  for(const [x,y] of [[166,328],[174,328],[732,324],[740,324]]) art+=rect(x,y,3,4,'#e0bb83');
  if(key==='forest') for(let i=0;i<16;i++) art+=rect(25+(i*71)%910,240+(i*17)%83,2,2,'#d9e99d');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 360" shape-rendering="crispEdges">${art}</svg>`;
}
export function makeAssets() {
  const out={};
  for(const [key,p] of Object.entries(palettes)) {
    const landscapeSVG=landscape(key,p);
    const moon=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges"><path fill="${p.moon}" d="M12 2H20V4H24V8H28V12H30V22H28V26H24V28H20V30H10V28H6V24H2V18H6V22H10V24H18V22H22V18H24V10H22V6H18V4H12Z"/></svg>`;
    const cloud=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 32" shape-rendering="crispEdges"><path fill="${p.cloud}" d="M0 28H8V24H16V20H24V12H32V4H48V8H56V16H64V12H72V16H80V24H88V28H96V32H0Z"/><path fill="${p.secondary}" opacity=".12" d="M16 24H24V16H32V8H44V12H36V20H28V24Z"/></svg>`;
    const thumb=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 88" shape-rendering="crispEdges"><rect width="160" height="88" fill="${p.sky}"/><g fill="${p.accent}">${rect(12,12,2,2,p.accent)}${rect(44,7,2,2,p.accent)}${rect(86,20,2,2,p.accent)}</g><g transform="translate(126 8) scale(.6)">${moon.replace(/<\/?svg[^>]*>/g,'')}</g><g transform="translate(0 26) scale(.167)">${landscapeSVG.replace(/<\/?svg[^>]*>/g,'')}</g></svg>`;
    out[key]={landscape:landscapeSVG,moon,cloud,thumb};
  }
  return out;
}
