import{LANGS}from'./languages.js';import LEGACY from'./lang/legacy-zh.js';const KEY='toolbox-lang';export{LANGS};const IDS=LANGS.map((l)=>l.id);const CJK=/[\u4e00-\u9fff]/;function detect(){try{const s=localStorage.getItem(KEY);if(IDS.includes(s))return s;}catch{}
const n=(navigator.language||'').toLowerCase();if(/^zh-(tw|hk|mo|hant)/.test(n))return'zh-TW';if(n.startsWith('zh'))return'zh';const short=n.slice(0,2);return IDS.includes(short)?short:'en';}
export const lang=detect();export const isZh=lang==='zh'||lang==='zh-TW';export const locale=LANGS.find((l)=>l.id===lang).locale;const DICT=lang==='en'?null:(await import(`./lang/${lang}.js`)).default;export function setLang(id){try{localStorage.setItem(KEY,id);}catch{}}
let back;export function zhOf(en){if(!back){back=new Map();const dup=new Set();for(const[zh,v]of Object.entries(LEGACY)){const e=v.split('|')[0];if(back.has(e))dup.add(e);else back.set(e,zh);}
dup.forEach((e)=>back.delete(e));}
return back.get(en);}
export function tr(key,...args){let s;if(CJK.test(key)){if(lang==='zh')s=key;else{const en=LEGACY[key]??key;s=DICT?(DICT[en]??en):en;}}else s=DICT?(DICT[key]??key):key;if(s.includes('|')){const[one,other]=s.split('|');s=args.includes(1)&&other!==undefined?other:one;}
return s.replace(/\{(\d+)\}/g,(_,i)=>args[i]??'');}
document.documentElement.lang=locale;document.title='Cubbie';document.querySelector('meta[name="apple-mobile-web-app-title"]')?.setAttribute('content','Cubbie');