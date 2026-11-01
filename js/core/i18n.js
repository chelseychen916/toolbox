import EN from'./lang-en.js';const KEY='toolbox-lang';export const LANGS=[{id:'zh',name:'中文'},{id:'en',name:'English'}];function detect(){try{const s=localStorage.getItem(KEY);if(s==='zh'||s==='en')return s;}catch{}
return(navigator.language||'').toLowerCase().startsWith('zh')?'zh':'en';}
export const lang=detect();export function setLang(id){try{localStorage.setItem(KEY,id);}catch{}}
let back;export function zhOf(en){if(!back){back=new Map();const dup=new Set();for(const[zh,v]of Object.entries(EN)){const e=v.split('|')[0];if(back.has(e))dup.add(e);else back.set(e,zh);}
dup.forEach((e)=>back.delete(e));}
return back.get(en);}
export function tr(zh,...args){let s=lang==='en'?(EN[zh]??zh):zh;if(s.includes('|')){const[one,other]=s.split('|');s=args.includes(1)&&other!==undefined?other:one;}
return s.replace(/\{(\d+)\}/g,(_,i)=>args[i]??'');}
document.documentElement.lang=lang==='zh'?'zh-CN':'en';document.title=tr('我的工具箱');document.querySelector('meta[name="apple-mobile-web-app-title"]')?.setAttribute('content',tr('工具箱'));