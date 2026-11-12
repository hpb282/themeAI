// Scene rasters are local assets; thumbnail viewports sample the approved reference.
export const palettes = {
  night: {name:'Night',subtitle:'Pixel night',accent:'#6af1ff',secondary:'#bda1ff',sky:'#15133e',surface:'#24235a',rgb:'106 241 255',hsl:'243 52% 15%'},
  forest:{name:'Forest',subtitle:'Alpine forest',accent:'#8bf2be',secondary:'#d6efa8',sky:'#102a2b',surface:'#173d3b',rgb:'139 242 190',hsl:'171 40% 9%'},
  sakura:{name:'Sakura',subtitle:'Cherry blossom valley',accent:'#ffb3e7',secondary:'#d4adff',sky:'#2e1b45',surface:'#432951',rgb:'255 179 231',hsl:'282 31% 11%'}
};
export function makeAssets(){
 const crops={night:{x:1249,y:285,w:86,h:72},forest:{x:1358,y:284,w:86,h:72},sakura:{x:1464,y:284,w:87,h:72}};
 return Object.fromEntries(Object.entries(palettes).map(([key,p])=>{
  const c=crops[key];
  const moon=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" shape-rendering="crispEdges"><path fill="#ffeda9" d="M15 2H23V4H27V8H31V12H35V18H37V26H35V30H31V34H27V36H19V38H11V36H7V32H3V26H7V30H11V32H19V30H25V26H29V20H31V14H29V10H25V6H19V4H15Z"/><path fill="#fff9c7" d="M27 9H30V15H33V24H30V28H27V31H23V33H14V31H22V28H26V23H29V16H27Z"/></svg>`;
  const cloud=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 42" shape-rendering="crispEdges"><path fill="${key==='night'?'#49408e':key==='forest'?'#cde7dc':'#ad8dc9'}" d="M0 36H8V32H16V28H24V22H32V14H40V6H48V2H56V6H64V14H72V20H80V16H88V20H96V24H104V30H112V34H120V38H128V42H0Z"/><path fill="${key==='night'?'#6f56ba':key==='forest'?'#fff3cc':'#e4b7e1'}" d="M16 32H24V26H32V20H40V10H48V6H54V10H60V18H68V24H76V28H60V24H52V18H44V24H36V30H28V34H16Z"/><path fill="${key==='night'?'#332a70':key==='forest'?'#9ecac6':'#8568af'}" d="M0 38H20V34H36V36H48V32H60V36H84V32H96V36H116V40H128V42H0Z"/></svg>`;
  return [key,{moon,cloud,crop:{size:`${1586/c.w*100}% ${992/c.h*100}%`,position:`${c.x/(1586-c.w)*100}% ${c.y/(992-c.h)*100}%`}}];
 }));
}
