import{tr}from'../core/i18n.js';import{dbDump,dbPut,dbClear,dbGet}from'./db.js';const toDataURL=(blob)=>new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=()=>rej(r.error);r.readAsDataURL(blob);});async function encode(v){if(v instanceof Blob)return{__blob:1,type:v.type,data:await toDataURL(v)};if(Array.isArray(v))return Promise.all(v.map(encode));if(v&&typeof v==='object'){const o={};for(const k of Object.keys(v))o[k]=await encode(v[k]);return o;}
return v;}
async function decode(v){if(v&&v.__blob)return(await fetch(v.data)).blob();if(Array.isArray(v))return Promise.all(v.map(decode));if(v&&typeof v==='object'){const o={};for(const k of Object.keys(v))o[k]=await decode(v[k]);return o;}
return v;}
export async function lastBackup(){const m=await dbGet('_meta','backup');return m?m.at:null;}
export async function hasAnyData(){const all=await dbDump();return Object.keys(all).some((c)=>!c.startsWith('_')&&c!=='tool_settings'&&c!=='prefs'&&all[c].length);}
export async function exportData(){const all=await dbDump();const collections={};for(const c of Object.keys(all))if(!c.startsWith('_'))collections[c]=await encode(all[c]);const json=JSON.stringify({app:'toolbox',version:1,exportedAt:new Date().toISOString(),collections});const stamp=new Date().toISOString().slice(0,10);const file=new File([json],tr('peasmine-backup-{0}.json',stamp),{type:'application/json'});let done=false;if(navigator.canShare&&navigator.canShare({files:[file]})){try{await navigator.share({files:[file]});done=true;}
catch(e){if(e.name==='AbortError')return false;}}
if(!done){const a=document.createElement('a');a.href=URL.createObjectURL(file);a.download=file.name;document.body.append(a);a.click();a.remove();}
await dbPut('_meta',{id:'backup',at:Date.now()});return true;}
export async function importData(file){let payload;try{payload=JSON.parse(await file.text());}catch{throw new Error(tr('This is not a valid backup file'));}
if(payload.app!=='toolbox'||!payload.collections)throw new Error(tr('This is not a Peasmine backup file'));let n=0;for(const[col,rows]of Object.entries(payload.collections)){for(const row of rows){await dbPut(col,await decode(row));n++;}}
return n;}
export{dbClear};