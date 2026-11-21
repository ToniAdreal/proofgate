var rs=Object.defineProperty;var as=(t,e,n)=>e in t?rs(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var D=(t,e,n)=>as(t,typeof e!="symbol"?e+"":e,n);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function n(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(i){if(i.ep)return;i.ep=!0;const r=n(i);fetch(i.href,r)}})();function xe(t){const e=[];let n=0;const s=i=>{const r=i.trim();if(r.length===0)return;const a=t.indexOf(r,n),o=a>=0?[a,a+r.length]:[n,n+r.length];a>=0&&(n=a+r.length),e.push({id:`c${e.length+1}`,index:e.length,text:r,span:o})};for(const i of t.split(/\r?\n/)){if(i.trim().length===0)continue;const r=i.split(new RegExp(`(?<=[.!?;])\\s+(?=[A-Z0-9"“'(])`));for(const a of r)s(a)}return e}function k(t){const e=t.replace(/[$,%\s]/g,"").replace(/,/g,"").replace(/\.$/,"");if(e===""||!/^-?\d+(\.\d+)?$/.test(e))return null;const n=Number(e);return Number.isFinite(n)?n:null}const os=.01;function Ae(t,e){return Math.abs(t-e)<=os}function Jt(t){const e=[],n=t.text,s=/(-?[\d][\d,]*\.?\d*)\s*([+\-*/x×])\s*(-?[\d][\d,]*\.?\d*)\s*=\s*\$?(-?[\d][\d,]*\.?\d*)/g;let i;for(;(i=s.exec(n))!==null;){const o=k(i[1]),c=k(i[3]),l=k(i[4]),u=i[2];if(o===null||c===null||l===null)continue;let p=null;if(u==="+"?p=o+c:u==="-"?p=o-c:u==="*"||u==="x"||u==="×"?p=o*c:u==="/"&&(p=c===0?null:o/c),p===null)continue;const h=Ae(p,l);e.push({validator:"arithmetic",claimId:t.id,status:h?"pass":"fail",detail:h?`Equation ${o} ${u} ${c} = ${l} recomputes correctly.`:`Equation ${o} ${u} ${c} stated as ${l}, recomputed value is ${J(p)}.`,evidence:{kind:"equation",a:o,op:u,b:c,stated:l,expected:J(p)}})}const r=/(\d+(?:\.\d+)?)\s*(?:units?|items?|pcs|pieces)?\s*(?:at|x|×|@)\s*\$?([\d][\d,]*\.?\d*)\s*(?:each\s*)?=\s*\$?([\d][\d,]*\.?\d*)/gi;for(;(i=r.exec(n))!==null;){const o=k(i[1]),c=k(i[2]),l=k(i[3]);if(o===null||c===null||l===null||e.some(h=>h.evidence.kind==="equation"&&h.evidence.stated===l))continue;const u=o*c,p=Ae(u,l);e.push({validator:"arithmetic",claimId:t.id,status:p?"pass":"fail",detail:p?`Line total ${o} × ${c} = ${l} recomputes correctly.`:`Line total ${o} × ${c} stated as ${l}, recomputed value is ${J(u)}.`,evidence:{kind:"line-total",qty:o,price:c,stated:l,expected:J(u)}})}const a=/(\d+(?:\.\d+)?)%\s*of\s*\$?([\d][\d,]*\.?\d*)\s*=\s*\$?([\d][\d,]*\.?\d*)/gi;for(;(i=a.exec(n))!==null;){const o=k(i[1]),c=k(i[2]),l=k(i[3]);if(o===null||c===null||l===null)continue;const u=o/100*c,p=Ae(u,l);e.push({validator:"arithmetic",claimId:t.id,status:p?"pass":"fail",detail:p?`${o}% of ${c} = ${l} recomputes correctly.`:`${o}% of ${c} stated as ${l}, recomputed value is ${J(u)}.`,evidence:{kind:"percent-of",pct:o,base:c,stated:l,expected:J(u)}})}return e.length===0&&e.push({validator:"arithmetic",claimId:t.id,status:"skip",detail:"No recomputable arithmetic found in this claim.",evidence:{}}),e}function J(t){return Math.round(t*100)/100}const cs={january:0,february:1,march:2,april:3,may:4,june:5,july:6,august:7,september:8,october:9,november:10,december:11,jan:0,feb:1,mar:2,apr:3,jun:5,jul:6,aug:7,sep:8,sept:8,oct:9,nov:10,dec:11},bt=["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];function Xt(t){const e=[],n=/\b(\d{4})-(\d{2})-(\d{2})\b/g;let s;for(;(s=n.exec(t))!==null;)e.push(Te(s[0],Number(s[1]),Number(s[2])-1,Number(s[3])));const i=/\b(\d{1,2})\/(\d{1,2})\/(\d{4})\b/g;for(;(s=i.exec(t))!==null;)e.push(Te(s[0],Number(s[3]),Number(s[1])-1,Number(s[2])));const r=/\b(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.?\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})\b/gi;for(;(s=r.exec(t))!==null;){const a=cs[s[1].toLowerCase()];a!==void 0&&e.push(Te(s[0],Number(s[3]),a,Number(s[2])))}return e}function Te(t,e,n,s){if(e<1900||e>2100)return{raw:t,date:null,valid:!1,reason:`Year ${e} is outside the sane range 1900-2100.`};if(n<0||n>11)return{raw:t,date:null,valid:!1,reason:`Month index ${n+1} is invalid.`};const i=new Date(Date.UTC(e,n,s));return i.getUTCFullYear()!==e||i.getUTCMonth()!==n||i.getUTCDate()!==s?{raw:t,date:null,valid:!1,reason:`${t} is not a real calendar date.`}:{raw:t,date:i,valid:!0}}function Qt(t){const e=Xt(t.text);if(e.length===0)return[{validator:"dates",claimId:t.id,status:"skip",detail:"No dates found in this claim.",evidence:{}}];const n=[];for(const s of e){if(!s.valid){n.push({validator:"dates",claimId:t.id,status:"fail",detail:s.reason??`Date "${s.raw}" is invalid.`,evidence:{raw:s.raw}});continue}const i=t.text.toLowerCase(),r=bt.find(a=>i.includes(a));if(r&&s.date){const a=bt[s.date.getUTCDay()];if(a!==r){n.push({validator:"dates",claimId:t.id,status:"fail",detail:`Claim says ${r} but ${s.raw} falls on a ${a}.`,evidence:{raw:s.raw,claimedWeekday:r,actualWeekday:a}});continue}}n.push({validator:"dates",claimId:t.id,status:"pass",detail:`Date "${s.raw}" is a real calendar date.`,evidence:{raw:s.raw,iso:s.date.toISOString().slice(0,10)}})}return n}function ls(t){const e=[];let n=null,s=null;for(const i of t){const r=i.text.toLowerCase(),a=Xt(i.text).filter(o=>o.valid&&o.date);a.length!==0&&(/(invoice date|issued|issue date|date issued)/.test(r)&&!n&&(n={claim:i,fd:a[0]}),/(due date|due on|payment due|payable by)/.test(r)&&!s&&(s={claim:i,fd:a[0]}))}return n&&s&&n.fd.date&&s.fd.date&&(s.fd.date.getTime()<n.fd.date.getTime()?e.push({validator:"dates",claimId:s.claim.id,status:"fail",detail:`Due date ${s.fd.raw} is before the invoice/issue date ${n.fd.raw}.`,evidence:{kind:"ordering",issueDate:n.fd.date.toISOString().slice(0,10),dueDate:s.fd.date.toISOString().slice(0,10)}}):e.push({validator:"dates",claimId:s.claim.id,status:"pass",detail:`Due date ${s.fd.raw} is on or after the issue date ${n.fd.raw}.`,evidence:{kind:"ordering",issueDate:n.fd.date.toISOString().slice(0,10),dueDate:s.fd.date.toISOString().slice(0,10)}})),e}const Zt=[{dimension:"length",toBase:1,aliases:["m","meter","meters","metre","metres"]},{dimension:"length",toBase:1e3,aliases:["km","kilometer","kilometers"]},{dimension:"length",toBase:.01,aliases:["cm","centimeter","centimeters"]},{dimension:"length",toBase:1609.344,aliases:["mile","miles","mi"]},{dimension:"length",toBase:.0254,aliases:["inch","inches","in"]},{dimension:"length",toBase:.3048,aliases:["foot","feet","ft"]},{dimension:"mass",toBase:1,aliases:["kg","kilogram","kilograms"]},{dimension:"mass",toBase:.001,aliases:["g","gram","grams"]},{dimension:"mass",toBase:.45359237,aliases:["lb","lbs","pound","pounds"]},{dimension:"mass",toBase:.028349523125,aliases:["oz","ounce","ounces"]},{dimension:"storage",toBase:1,aliases:["mb","megabyte","megabytes"]},{dimension:"storage",toBase:1e3,aliases:["gb","gigabyte","gigabytes"]},{dimension:"storage",toBase:1e6,aliases:["tb","terabyte","terabytes"]},{dimension:"time",toBase:1,aliases:["second","seconds","sec","s"]},{dimension:"time",toBase:60,aliases:["minute","minutes","min"]},{dimension:"time",toBase:3600,aliases:["hour","hours","hr","hrs","h"]}],Fe=new Map;for(const t of Zt)for(const e of t.aliases)Fe.set(e,t);const vt=Zt.flatMap(t=>t.aliases).sort((t,e)=>e.length-t.length).map(t=>t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).join("|"),Et=new RegExp(`([\\d][\\d,]*\\.?\\d*)\\s*(${vt})\\b[^=()]{0,12}?(?:=|\\(|is\\s+|equals\\s+)\\s*([\\d][\\d,]*\\.?\\d*)\\s*(${vt})\\b`,"gi"),ds=.02;function en(t){const e=[];let n;for(Et.lastIndex=0;(n=Et.exec(t.text))!==null;){const s=Number(n[1].replace(/,/g,"")),i=Number(n[3].replace(/,/g,"")),r=Fe.get(n[2].toLowerCase()),a=Fe.get(n[4].toLowerCase());if(!r||!a||!Number.isFinite(s)||!Number.isFinite(i))continue;if(r.dimension!==a.dimension){e.push({validator:"units",claimId:t.id,status:"fail",detail:`Units ${n[2]} (${r.dimension}) and ${n[4]} (${a.dimension}) are not convertible.`,evidence:{kind:"dimension-mismatch",from:n[2],to:n[4]}});continue}const o=s*r.toBase/a.toBase,l=(o===0?Math.abs(i):Math.abs(i-o)/Math.abs(o))<=ds;e.push({validator:"units",claimId:t.id,status:l?"pass":"fail",detail:l?`Conversion ${s} ${n[2]} = ${i} ${n[4]} is within 2% of the recomputed ${Re(o)} ${n[4]}.`:`Conversion ${s} ${n[2]} stated as ${i} ${n[4]}, recomputed value is ${Re(o)} ${n[4]}.`,evidence:{kind:"conversion",value:s,fromUnit:n[2],statedTo:i,toUnit:n[4],expected:Re(o)}})}return e.length===0&&e.push({validator:"units",claimId:t.id,status:"skip",detail:"No unit conversions found in this claim.",evidence:{}}),e}function Re(t){return Math.round(t*1e4)/1e4}function tn(t){const e=[],n=t.text,s=/\b(?:https?:\/\/|www\.)[^\s<>"')\]]+/gi,i=n.match(s)??[];let r=!1;for(const u of i){const p=u.startsWith("www.")?`https://${u}`:u;try{const h=new URL(p);if(h.protocol!=="http:"&&h.protocol!=="https:")throw new Error("protocol");if(!h.hostname.includes("."))throw new Error("hostname");e.push({validator:"citations",claimId:t.id,status:"pass",detail:`URL ${u} is well-formed.`,evidence:{kind:"url",url:u,hostname:h.hostname}})}catch{r=!0,e.push({validator:"citations",claimId:t.id,status:"fail",detail:`URL "${u}" is malformed and cannot be resolved as written.`,evidence:{kind:"url",url:u}})}}const a=/\b10\.\d{4,9}\/[^\s<>"')\]]+/g;for(const u of n.match(a)??[])e.push({validator:"citations",claimId:t.id,status:"pass",detail:`DOI ${u} has a valid shape.`,evidence:{kind:"doi",doi:u}});const o=/(according to|study (shows|found|reports)|research (shows|suggests)|reported by|source\s*:|data from|statistics show)/i.test(n),c=/\[[^\]]{1,80}\]/.test(n)||/\([A-Z][a-z]+(?: et al\.)?,? \d{4}\)/.test(n),l=i.length>0||c||(n.match(a)??[]).length>0;return o&&!l&&!r&&e.push({validator:"citations",claimId:t.id,status:"warn",detail:"Claim attributes a fact to an external source but provides no URL, DOI, or bracketed citation.",evidence:{kind:"missing-citation"}}),e.length===0&&e.push({validator:"citations",claimId:t.id,status:"skip",detail:"No citations or source attributions in this claim.",evidence:{}}),e}function us(t){const e=[],n=/\$\s?([\d][\d,]*\.?\d*)/g;for(const s of t){let i;for(n.lastIndex=0;(i=n.exec(s.text))!==null;){const r=k(i[1]);if(r===null)continue;const o=s.text.slice(Math.max(0,i.index-40),i.index).match(/([A-Za-z][A-Za-z /-]{1,30})[:\-]?\s*$/);e.push({claimId:s.id,label:o?o[1].trim().toLowerCase():null,amount:r,raw:i[0]})}}return e}const wt=.01;function ps(t){const e=[],n=us(t),s=n.find(o=>o.label&&/^(total|amount due|grand total|balance due)/.test(o.label)),i=n.find(o=>o.label&&/subtotal/.test(o.label)),r=n.find(o=>o.label&&/(tax|vat)/.test(o.label));if(s&&i&&r){const o=i.amount+r.amount,c=Math.abs(o-s.amount)<=wt;return e.push({validator:"numeric-consistency",claimId:s.claimId,status:c?"pass":"fail",detail:c?`Subtotal ${i.amount} + tax ${r.amount} = total ${s.amount} reconciles.`:`Subtotal ${i.amount} + tax ${r.amount} = ${ne(o)}, but the stated total is ${s.amount}.`,evidence:{kind:"subtotal-tax-total",subtotal:i.amount,tax:r.amount,statedTotal:s.amount,expected:ne(o)}}),e}if(s){const o=new Set([s]);i&&o.add(i),r&&o.add(r);const c=n.filter(u=>!o.has(u)&&!(u.label&&/(deposit|discount|paid)/.test(u.label))),l=c.reduce((u,p)=>u+p.amount,0);if(c.length>=2){const u=Math.abs(l-s.amount)<=wt;e.push({validator:"numeric-consistency",claimId:s.claimId,status:u?"pass":"fail",detail:u?`Line items sum to ${ne(l)}, matching the stated total ${s.amount}.`:`Line items sum to ${ne(l)}, but the stated total is ${s.amount}.`,evidence:{kind:"line-item-sum",itemCount:c.length,itemSum:ne(l),statedTotal:s.amount}})}}const a=new Map;for(const o of n){if(!o.label)continue;const c=o.label.replace(/\s+/g," ");a.has(c)||a.set(c,[]),a.get(c).push(o)}for(const[o,c]of a){const l=[...new Set(c.map(u=>u.amount))];c.length>=2&&l.length>=2&&/deposit|total|price|fee|amount/.test(o)&&e.push({validator:"numeric-consistency",claimId:c[c.length-1].claimId,status:"fail",detail:`Figure "${o}" appears with conflicting values: ${l.join(", ")}.`,evidence:{kind:"conflicting-figure",label:o,values:l}})}return e}function ne(t){return Math.round(t*100)/100}function hs(t,e,n){const s=[],i=e.filter(a=>a.status==="fail");if(i.length>0){for(const a of i)s.push(`[R1] ${a.validator}: ${a.detail}`);return{verdict:"FAIL",reasons:s}}if(n&&n.label==="contradicts"&&n.confidence>=.7)return s.push(`[R2] Model (${n.source}, ${n.modelId}) contradicts this claim with confidence ${n.confidence}: ${n.rationale}`),{verdict:"FAIL",reasons:s};const r=e.filter(a=>a.status==="warn");for(const a of r)s.push(`[R3] ${a.validator}: ${a.detail}`);return n&&(n.label==="contradicts"?s.push(`[R3] Model contradicts with low confidence ${n.confidence}: ${n.rationale}`):n.label==="uncertain"?s.push(`[R3] Model is uncertain: ${n.rationale}`):n.label==="supports"&&n.confidence<.5&&s.push(`[R3] Model supports but with low confidence ${n.confidence}.`)),s.length>0?{verdict:"NEEDS REVIEW",reasons:s}:(s.push("[R4] All deterministic checks passed and no model objection."),{verdict:"PASS",reasons:s})}function fs(t){return t.includes("FAIL")?"FAIL":t.includes("NEEDS REVIEW")?"NEEDS REVIEW":"PASS"}const ms=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298];function gs(t){const e=[];for(let n=0;n<t.length;n++){let s=t.charCodeAt(n);if(s<128)e.push(s);else if(s<2048)e.push(192|s>>6,128|s&63);else if(s>=55296&&s<=56319&&n+1<t.length){const i=t.charCodeAt(n+1);i>=56320&&i<=57343?(s=65536+(s-55296<<10)+(i-56320),n++,e.push(240|s>>18,128|s>>12&63,128|s>>6&63,128|s&63)):e.push(239,191,189)}else e.push(224|s>>12,128|s>>6&63,128|s&63)}return e}function C(t,e){return t>>>e|t<<32-e}function Be(t){const e=gs(t),n=Math.floor(e.length*8/4294967296),s=e.length*8>>>0;for(e.push(128);e.length%64!==56;)e.push(0);e.push(n>>>24&255,n>>>16&255,n>>>8&255,n&255,s>>>24&255,s>>>16&255,s>>>8&255,s&255);let i=1779033703,r=3144134277,a=1013904242,o=2773480762,c=1359893119,l=2600822924,u=528734635,p=1541459225;const h=new Array(64);for(let y=0;y<e.length;y+=64){for(let E=0;E<16;E++){const B=y+E*4;h[E]=e[B]<<24|e[B+1]<<16|e[B+2]<<8|e[B+3]|0}for(let E=16;E<64;E++){const B=C(h[E-15],7)^C(h[E-15],18)^h[E-15]>>>3,Se=C(h[E-2],17)^C(h[E-2],19)^h[E-2]>>>10;h[E]=h[E-16]+B+h[E-7]+Se|0}let b=i,A=r,x=a,we=o,F=c,le=l,de=u,Ie=p;for(let E=0;E<64;E++){const B=C(F,6)^C(F,11)^C(F,25),Se=F&le^~F&de,yt=Ie+B+Se+ms[E]+h[E]|0,ns=C(b,2)^C(b,13)^C(b,22),ss=b&A^b&x^A&x,is=ns+ss|0;Ie=de,de=le,le=F,F=we+yt|0,we=x,x=A,A=b,b=yt+is|0}i=i+b|0,r=r+A|0,a=a+x|0,o=o+we|0,c=c+F|0,l=l+le|0,u=u+de|0,p=p+Ie|0}return[i,r,a,o,c,l,u,p].map(y=>(y>>>0).toString(16).padStart(8,"0")).join("")}const ys="0.1.0";function he(t){return t===null||typeof t!="object"?JSON.stringify(t)??"null":Array.isArray(t)?`[${t.map(he).join(",")}]`:`{${Object.entries(t).sort(([n],[s])=>n<s?-1:n>s?1:0).map(([n,s])=>`${JSON.stringify(n)}:${he(s)}`).join(",")}}`}function bs(t){return{totalClaims:t.length,pass:t.filter(e=>e.verdict==="PASS").length,needsReview:t.filter(e=>e.verdict==="NEEDS REVIEW").length,fail:t.filter(e=>e.verdict==="FAIL").length,overallVerdict:fs(t.map(e=>e.verdict))}}function vs(t,e,n){const s=Be(t),i={version:"proofgate.report/1",id:`pr_${s.slice(0,16)}`,createdAt:n,inputText:t,inputHash:s,claims:e,summary:bs(e),engine:{name:"proofgate-core",version:ys}},r=Be(he(i));return{...i,contentHash:r}}function Es(t){const{contentHash:e,...n}=t;return Be(he(n))===e}function nn(t,e,n,s){return{claimId:t,label:"uncertain",confidence:0,rationale:`Model pass did not complete (${s}); no model judgement was obtained, so this claim is recorded as uncertain and decided by the deterministic checks.`,source:e,modelId:n,failure:s}}const Ue=/(guarantee|guaranteed|always|never fails|100%|risk-free|proven|clinically|legally|contract|liable|certified)/i,It=280;function sn(t,e){return t.text.length<40&&!Ue.test(t.text)?{tier:"deterministic-only",reason:"Short plain claim; deterministic checks are sufficient."}:Ue.test(t.text)?{tier:"cloud",reason:"Claim contains high-stakes markers (guarantee / legal / medical / absolute wording); deep cloud pass required."}:t.text.length>It?{tier:"cloud",reason:`Claim length ${t.text.length} exceeds the on-device comfort threshold ${It}.`}:e?{tier:"cloud",reason:"A deterministic check warned on this claim; cloud pass gathers more context."}:{tier:"on-device",reason:"Standard claim; private on-device first pass is sufficient."}}class He{constructor(){D(this,"name","mock-deterministic")}async analyze(e){const n=e.text;if(/^\s*(hello|hi|thanks|thank you)\b/i.test(n))return{claimId:e.id,label:"not-applicable",confidence:1,rationale:"Greeting or courtesy text; nothing to verify.",source:"mock",modelId:"mock-deterministic-v1"};if(Ue.test(n))return{claimId:e.id,label:"uncertain",confidence:.35,rationale:"Claim uses absolute or high-stakes wording that a mock pass cannot verify.",source:"mock",modelId:"mock-deterministic-v1"};const s=Math.min(.95,.6+n.length/1e3);return{claimId:e.id,label:"supports",confidence:Math.round(s*100)/100,rationale:"Mock pass: no contradiction signals detected in claim shape.",source:"mock",modelId:"mock-deterministic-v1"}}}class rn extends Error{constructor(n,s){super(`${n} timed out after ${s} ms`);D(this,"label");D(this,"timeoutMs");this.name="TimeoutError",this.label=n,this.timeoutMs=s}}function an(t){return t instanceof rn||t instanceof Error&&t.name==="TimeoutError"}function Ve(t,e,n){if(!Number.isFinite(e)||e<=0)return t;let s;const i=new Promise((r,a)=>{s=setTimeout(()=>a(new rn(n,e)),e)});return Promise.race([t,i]).finally(()=>{s!==void 0&&clearTimeout(s)})}const ws=9e4;async function Is(t,e,n,s){const i=n==="cloud"?"cloud":"on-device";try{return await Ve(t.analyze(e),s,`Model pass for claim ${e.id}`)}catch(r){const a=an(r)?`timed out after ${s} ms`:`failed: ${r instanceof Error?r.message:String(r)}`;return nn(e.id,i,t.name,a)}}async function on(t,e={}){const n=e.adapter??new He,s=e.useModel??!0,i=e.now??new Date().toISOString(),r=e.modelTimeoutMs??ws,a=e.onProgress,o=xe(t);a==null||a({type:"split",totalClaims:o.length});const c=new Map;for(const h of[...ls(o),...ps(o)])c.has(h.claimId)||c.set(h.claimId,[]),c.get(h.claimId).push(h);const l=o.map(h=>{const y=[...Jt(h),...Qt(h),...en(h),...tn(h),...c.get(h.id)??[]],b=y.some(A=>A.status==="warn");return{claim:h,checks:y,tier:sn(h,b).tier}});a==null||a({type:"checks-complete",totalClaims:o.length,onDeviceClaims:l.filter(h=>s&&h.tier==="on-device").length,cloudClaims:l.filter(h=>s&&h.tier==="cloud").length});const u=[];for(const h of l){const y=s&&h.tier!=="deterministic-only"?await Is(n,h.claim,h.tier,r):null;y&&(a==null||a({type:"model-claim-complete",claimId:h.claim.id,tier:h.tier}));const{verdict:b,reasons:A}=hs(h.claim.id,h.checks,y);u.push({claim:h.claim,checks:h.checks,modelOutput:y,verdict:b,reasons:A})}a==null||a({type:"model-complete",totalClaims:o.length});const p=vs(t,u,i);return a==null||a({type:"report-built"}),p}const cn=["AI Answer","Quote","Invoice","Announcement"],Ss=["Invoice Q-1042 from Acme Studio.","Invoice date: 2026-11-10.","Payment due date: 2026-12-10.","Design services: 3 units at $2,800 = $9,400.","The project lead is Maya Chen."].join(`
`),As={Invoice:Ss,"AI Answer":["The migration will finish in 10 days, which is 240 hours of wall-clock time.","According to a recent study, teams that adopt staged rollouts see 30% fewer incidents.","The new plan costs $49 per user per month, so 20 users cost $980 per month.","Storage grows from 500 GB to 1 TB, an increase of exactly 500 GB."].join(`
`),Quote:["Vendor quote QT-2081, issued 2026-11-05.","Implementation: 12 days at $950 = $11,400.","Training: 2 sessions at $1,500 = $3,000.","Subtotal: $14,400.","Tax (10%): $1,440.","Total: $15,840."].join(`
`),Announcement:["Northline Mobility will open its Austin facility on 15 September 2026.","The facility covers 10 km of test track, equal to 6.21 miles.","The company guarantees the service will always be available, with zero downtime.","The launch event is scheduled for Friday, September 18, 2026."].join(`
`)},ln="proofgate.history.v1";function Ze(t,e=64){const s=t.inputText.split(`
`).map(i=>i.trim()).find(i=>i.length>0)??t.id;return s.length>e?`${s.slice(0,e-1)}…`:s}function Ts(t,e,n){return{key:t.contentHash,report:t,sourceType:e,title:Ze(t),savedAt:n,replayCount:0,lastReplayAt:null,lastReplayMatches:null}}function Rs(t){if(typeof t!="object"||t===null)return!1;const e=t;return typeof e.key=="string"&&typeof e.title=="string"&&typeof e.savedAt=="string"&&typeof e.replayCount=="number"&&typeof e.sourceType=="string"&&typeof e.report=="object"&&e.report!==null&&typeof e.report.contentHash=="string"}function be(t){try{const e=t.getItem(ln);if(!e)return[];const n=JSON.parse(e);return Array.isArray(n)?n.filter(Rs):[]}catch{return[]}}function et(t,e){t.setItem(ln,JSON.stringify(e))}function _s(t,e,n,s){const i=be(t).filter(r=>r.key!==e.contentHash);return i.unshift(Ts(e,n,s)),et(t,i),i}function Cs(t,e,n){const s=be(t).map(i=>i.key===e?{...i,...n}:i);return et(t,s),s}function ks(t,e){const n=be(t).filter(s=>s.key!==e);return et(t,n),n}function Os(t,e){const n=(e.query??"").trim().toLowerCase(),s=e.now?Date.parse(e.now):Date.now();return t.filter(i=>{if(e.verdict&&e.verdict!=="ALL"&&i.report.summary.overallVerdict!==e.verdict||e.sourceType&&e.sourceType!=="ALL"&&i.sourceType!==e.sourceType)return!1;if(e.withinDays!==void 0){const r=Date.parse(i.savedAt);if(Number.isNaN(r)||s-r>e.withinDays*864e5)return!1}return!(n&&![i.title,i.sourceType,i.report.id,...i.report.claims.map(a=>a.claim.text)].join(`
`).toLowerCase().includes(n))})}function $s(t,e){const n=Date.parse(e);return{reportsLast30Days:t.filter(s=>{const i=Date.parse(s.savedAt);return!Number.isNaN(i)&&n-i<=30*864e5&&i<=n}).length,replaysRun:t.reduce((s,i)=>s+i.replayCount,0),reportsPassed:t.filter(s=>s.report.summary.overallVerdict==="PASS").length}}function Ds(t,e){const n=new Map(e.claims.map(r=>[r.claim.id,r])),s=t.claims.map(r=>{const a=n.get(r.claim.id),o=a?a.verdict:null;return{claimId:r.claim.id,claimText:r.claim.text,originalVerdict:r.verdict,replayVerdict:o,changed:o!==r.verdict}}),i=s.filter(r=>r.changed).length;return{matches:i===0&&e.summary.overallVerdict===t.summary.overallVerdict,originalOverall:t.summary.overallVerdict,replayOverall:e.summary.overallVerdict,claims:s,changedCount:i}}function Ns(t){const e=t.claims.map(a=>a.modelOutput).filter(a=>a!=null),n=e.filter(a=>!a.failure),s=e.length-n.length,i=new Set(n.map(a=>a.source));if(i.has("mock"))return"Demo mode (mock model)";if(n.length===0)return s>0?"Deterministic checks only (model pass unavailable)":"Deterministic checks only";const r=[];return i.has("on-device")&&r.push("Gemini Nano first pass"),i.has("cloud")&&r.push("cloud escalation"),s>0&&r.push("model pass partly unavailable"),r.join(" + ")}const Ls=()=>{};var St={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dn=function(t){const e=[];let n=0;for(let s=0;s<t.length;s++){let i=t.charCodeAt(s);i<128?e[n++]=i:i<2048?(e[n++]=i>>6|192,e[n++]=i&63|128):(i&64512)===55296&&s+1<t.length&&(t.charCodeAt(s+1)&64512)===56320?(i=65536+((i&1023)<<10)+(t.charCodeAt(++s)&1023),e[n++]=i>>18|240,e[n++]=i>>12&63|128,e[n++]=i>>6&63|128,e[n++]=i&63|128):(e[n++]=i>>12|224,e[n++]=i>>6&63|128,e[n++]=i&63|128)}return e},Ps=function(t){const e=[];let n=0,s=0;for(;n<t.length;){const i=t[n++];if(i<128)e[s++]=String.fromCharCode(i);else if(i>191&&i<224){const r=t[n++];e[s++]=String.fromCharCode((i&31)<<6|r&63)}else if(i>239&&i<365){const r=t[n++],a=t[n++],o=t[n++],c=((i&7)<<18|(r&63)<<12|(a&63)<<6|o&63)-65536;e[s++]=String.fromCharCode(55296+(c>>10)),e[s++]=String.fromCharCode(56320+(c&1023))}else{const r=t[n++],a=t[n++];e[s++]=String.fromCharCode((i&15)<<12|(r&63)<<6|a&63)}}return e.join("")},tt={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,s=[];for(let i=0;i<t.length;i+=3){const r=t[i],a=i+1<t.length,o=a?t[i+1]:0,c=i+2<t.length,l=c?t[i+2]:0,u=r>>2,p=(r&3)<<4|o>>4;let h=(o&15)<<2|l>>6,y=l&63;c||(y=64,a||(h=64)),s.push(n[u],n[p],n[h],n[y])}return s.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(dn(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):Ps(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,s=[];for(let i=0;i<t.length;){const r=n[t.charAt(i++)],o=i<t.length?n[t.charAt(i)]:0;++i;const l=i<t.length?n[t.charAt(i)]:64;++i;const p=i<t.length?n[t.charAt(i)]:64;if(++i,r==null||o==null||l==null||p==null)throw new Ms;const h=r<<2|o>>4;if(s.push(h),l!==64){const y=o<<4&240|l>>2;if(s.push(y),p!==64){const b=l<<6&192|p;s.push(b)}}}return s},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class Ms extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const xs=function(t){const e=dn(t);return tt.encodeByteArray(e,!0)},un=function(t){return xs(t).replace(/\./g,"")},je=function(t){try{return tt.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function W(t){return pn(void 0,t)}function pn(t,e){if(!(e instanceof Object))return e;switch(e.constructor){case Date:const n=e;return new Date(n.getTime());case Object:t===void 0&&(t={});break;case Array:t=[];break;default:return e}for(const n in e)!e.hasOwnProperty(n)||!Fs(n)||(t[n]=pn(t[n],e[n]));return t}function Fs(t){return t!=="__proto__"}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nt(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bs=()=>nt().__FIREBASE_DEFAULTS__,Us=()=>{if(typeof process>"u"||typeof St>"u")return;const t=St.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},Hs=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&je(t[1]);return e&&JSON.parse(e)},Vs=()=>{try{return Ls()||Bs()||Us()||Hs()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},hn=()=>{var t;return(t=Vs())==null?void 0:t.config};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fe{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,s)=>{n?this.reject(n):this.resolve(s),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,s))}}}function st(){try{return typeof indexedDB=="object"}catch{return!1}}function js(){return new Promise((t,e)=>{try{let n=!0;const s="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(s);i.onsuccess=()=>{i.result.close(),n||self.indexedDB.deleteDatabase(s),t(!0)},i.onupgradeneeded=()=>{n=!1},i.onerror=()=>{var r;e(((r=i.error)==null?void 0:r.message)||"")}}catch(n){e(n)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gs="FirebaseError";class te extends Error{constructor(e,n,s){super(n),this.code=e,this.customData=s,this.name=Gs,Object.setPrototypeOf(this,te.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,it.prototype.create)}}class it{constructor(e,n,s){this.service=e,this.serviceName=n,this.errors=s}create(e,...n){const s=n[0]||{},i=`${this.service}/${e}`,r=this.errors[e],a=r?qs(r,s):"Error",o=`${this.serviceName}: ${a} (${i}).`;return new te(i,o,s)}}function qs(t,e){try{let n=0,s="";for(;n<t.length;){const i=t.indexOf("{$",n);if(i===-1){s+=t.substring(n);break}const r=t.indexOf("}",i+2);if(r===-1){s+=t.substring(n);break}const a=t.substring(i+2,r),o=e[a];s+=t.substring(n,i)+(o!=null?String(o):`<${a}?>`),n=r+1}return s}catch{return t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function At(t){return JSON.parse(t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ws=function(t){let e={},n={},s={},i="";try{const r=t.split(".");e=At(je(r[0])||""),n=At(je(r[1])||""),i=r[2],s=n.d||{},delete n.d}catch{}return{header:e,claims:n,data:s,signature:i}},zs=function(t){const e=Ws(t).claims;return typeof e=="object"&&e.hasOwnProperty("iat")?e.iat:null};function Ge(t,e){if(t===e)return!0;const n=Object.keys(t),s=Object.keys(e);for(const i of n){if(!s.includes(i))return!1;const r=t[i],a=e[i];if(Tt(r)&&Tt(a)){if(!Ge(r,a))return!1}else if(r!==a)return!1}for(const i of s)if(!n.includes(i))return!1;return!0}function Tt(t){return t!==null&&typeof t=="object"}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fn(t){return t&&t._delegate?t._delegate:t}class K{constructor(e,n,s){this.name=e,this.instanceFactory=n,this.type=s,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const G="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ks{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const s=new fe;if(this.instancesDeferred.set(n,s),this.isInitialized(n)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:n});i&&s.resolve(i)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){const n=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),s=(e==null?void 0:e.optional)??!1;if(this.isInitialized(n)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:n})}catch(i){if(s)return null;throw i}else{if(s)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Js(e))try{this.getOrInitializeService({instanceIdentifier:G})}catch{}for(const[n,s]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(n);try{const r=this.getOrInitializeService({instanceIdentifier:i});s.resolve(r)}catch{}}}}clearInstance(e=G){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=G){return this.instances.has(e)}getOptions(e=G){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,s=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(s))throw Error(`${this.name}(${s}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:s,options:n});for(const[r,a]of this.instancesDeferred.entries()){const o=this.normalizeInstanceIdentifier(r);s===o&&a.resolve(i)}return i}onInit(e,n){const s=this.normalizeInstanceIdentifier(n),i=this.onInitCallbacks.get(s)??new Set;i.add(e),this.onInitCallbacks.set(s,i);const r=this.instances.get(s);return r&&e(r,s),()=>{i.delete(e)}}invokeOnInitCallbacks(e,n){const s=this.onInitCallbacks.get(n);if(s)for(const i of s)try{i(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let s=this.instances.get(e);if(!s&&this.component&&(s=this.component.instanceFactory(this.container,{instanceIdentifier:Ys(e),options:n}),this.instances.set(e,s),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(s,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,s)}catch{}return s||null}normalizeInstanceIdentifier(e=G){return this.component?this.component.multipleInstances?e:G:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Ys(t){return t===G?void 0:t}function Js(t){return t.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xs{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new Ks(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var v;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(v||(v={}));const Qs={debug:v.DEBUG,verbose:v.VERBOSE,info:v.INFO,warn:v.WARN,error:v.ERROR,silent:v.SILENT},Zs=v.INFO,ei={[v.DEBUG]:"log",[v.VERBOSE]:"log",[v.INFO]:"info",[v.WARN]:"warn",[v.ERROR]:"error"},ti=(t,e,...n)=>{if(e<t.logLevel)return;const s=new Date().toISOString(),i=ei[e];if(i)console[i](`[${s}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class rt{constructor(e){this.name=e,this._logLevel=Zs,this._logHandler=ti,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in v))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Qs[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,v.DEBUG,...e),this._logHandler(this,v.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,v.VERBOSE,...e),this._logHandler(this,v.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,v.INFO,...e),this._logHandler(this,v.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,v.WARN,...e),this._logHandler(this,v.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,v.ERROR,...e),this._logHandler(this,v.ERROR,...e)}}const ni=(t,e)=>e.some(n=>t instanceof n);let Rt,_t;function si(){return Rt||(Rt=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function ii(){return _t||(_t=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const mn=new WeakMap,qe=new WeakMap,gn=new WeakMap,_e=new WeakMap,at=new WeakMap;function ri(t){const e=new Promise((n,s)=>{const i=()=>{t.removeEventListener("success",r),t.removeEventListener("error",a)},r=()=>{n(j(t.result)),i()},a=()=>{s(t.error),i()};t.addEventListener("success",r),t.addEventListener("error",a)});return e.then(n=>{n instanceof IDBCursor&&mn.set(n,t)}).catch(()=>{}),at.set(e,t),e}function ai(t){if(qe.has(t))return;const e=new Promise((n,s)=>{const i=()=>{t.removeEventListener("complete",r),t.removeEventListener("error",a),t.removeEventListener("abort",a)},r=()=>{n(),i()},a=()=>{s(t.error||new DOMException("AbortError","AbortError")),i()};t.addEventListener("complete",r),t.addEventListener("error",a),t.addEventListener("abort",a)});qe.set(t,e)}let We={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return qe.get(t);if(e==="objectStoreNames")return t.objectStoreNames||gn.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return j(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function oi(t){We=t(We)}function ci(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const s=t.call(Ce(this),e,...n);return gn.set(s,e.sort?e.sort():[e]),j(s)}:ii().includes(t)?function(...e){return t.apply(Ce(this),e),j(mn.get(this))}:function(...e){return j(t.apply(Ce(this),e))}}function li(t){return typeof t=="function"?ci(t):(t instanceof IDBTransaction&&ai(t),ni(t,si())?new Proxy(t,We):t)}function j(t){if(t instanceof IDBRequest)return ri(t);if(_e.has(t))return _e.get(t);const e=li(t);return e!==t&&(_e.set(t,e),at.set(e,t)),e}const Ce=t=>at.get(t);function di(t,e,{blocked:n,upgrade:s,blocking:i,terminated:r}={}){const a=indexedDB.open(t,e),o=j(a);return s&&a.addEventListener("upgradeneeded",c=>{s(j(a.result),c.oldVersion,c.newVersion,j(a.transaction),c)}),n&&a.addEventListener("blocked",c=>n(c.oldVersion,c.newVersion,c)),o.then(c=>{r&&c.addEventListener("close",()=>r()),i&&c.addEventListener("versionchange",l=>i(l.oldVersion,l.newVersion,l))}).catch(()=>{}),o}const ui=["get","getKey","getAll","getAllKeys","count"],pi=["put","add","delete","clear"],ke=new Map;function Ct(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(ke.get(e))return ke.get(e);const n=e.replace(/FromIndex$/,""),s=e!==n,i=pi.includes(n);if(!(n in(s?IDBIndex:IDBObjectStore).prototype)||!(i||ui.includes(n)))return;const r=async function(a,...o){const c=this.transaction(a,i?"readwrite":"readonly");let l=c.store;return s&&(l=l.index(o.shift())),(await Promise.all([l[n](...o),i&&c.done]))[0]};return ke.set(e,r),r}oi(t=>({...t,get:(e,n,s)=>Ct(e,n)||t.get(e,n,s),has:(e,n)=>!!Ct(e,n)||t.has(e,n)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hi{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(fi(n)){const s=n.getImmediate();return`${s.library}/${s.version}`}else return null}).filter(n=>n).join(" ")}}function fi(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const ze="@firebase/app",kt="0.16.7";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const P=new rt("@firebase/app"),mi="@firebase/app-compat",gi="@firebase/analytics-compat",yi="@firebase/analytics",bi="@firebase/app-check-compat",vi="@firebase/app-check",Ei="@firebase/auth",wi="@firebase/auth-compat",Ii="@firebase/crashlytics",Si="@firebase/database",Ai="@firebase/data-connect",Ti="@firebase/database-compat",Ri="@firebase/functions",_i="@firebase/functions-compat",Ci="@firebase/installations",ki="@firebase/installations-compat",Oi="@firebase/messaging",$i="@firebase/messaging-compat",Di="@firebase/performance",Ni="@firebase/performance-compat",Li="@firebase/remote-config",Pi="@firebase/remote-config-compat",Mi="@firebase/storage",xi="@firebase/storage-compat",Fi="@firebase/firestore",Bi="@firebase/ai",Ui="@firebase/firestore-compat",Hi="firebase";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ke="[DEFAULT]",Vi={[ze]:"fire-core",[mi]:"fire-core-compat",[yi]:"fire-analytics",[gi]:"fire-analytics-compat",[vi]:"fire-app-check",[bi]:"fire-app-check-compat",[Ei]:"fire-auth",[wi]:"fire-auth-compat",[Ii]:"fire-cls",[Si]:"fire-rtdb",[Ai]:"fire-data-connect",[Ti]:"fire-rtdb-compat",[Ri]:"fire-fn",[_i]:"fire-fn-compat",[Ci]:"fire-iid",[ki]:"fire-iid-compat",[Oi]:"fire-fcm",[$i]:"fire-fcm-compat",[Di]:"fire-perf",[Ni]:"fire-perf-compat",[Li]:"fire-rc",[Pi]:"fire-rc-compat",[Mi]:"fire-gcs",[xi]:"fire-gcs-compat",[Fi]:"fire-fst",[Ui]:"fire-fst-compat",[Bi]:"fire-vertex","fire-js":"fire-js",[Hi]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ae=new Map,ji=new Map,Ye=new Map;function Ot(t,e){try{t.container.addComponent(e)}catch(n){P.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function Z(t){const e=t.name;if(Ye.has(e))return P.debug(`There were multiple attempts to register component ${e}.`),!1;Ye.set(e,t);for(const n of ae.values())Ot(n,t);for(const n of ji.values())Ot(n,t);return!0}function yn(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function Gi(t){return t==null?!1:t.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qi={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different {$mismatchedParam}. Existing: '{$oldValue}'. New: '{$newValue}'.","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},L=new it("app","Firebase",qi);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wi{constructor(e,n,s){this._isDeleted=!1,this._options={...e},this._config={...n},this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=s,this.container.addComponent(new K("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw L.create("app-deleted",{appName:this._name})}}function bn(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const s={name:Ke,automaticDataCollectionEnabled:!0,...e},i=s.name;if(typeof i!="string"||!i)throw L.create("bad-app-name",{appName:String(i)});if(n||(n=hn()),!n)throw L.create("no-options");const r=ae.get(i);if(r)if(Ge(n,r.options)){if(Ge(s,r.config))return r;throw L.create("duplicate-app",{appName:i,mismatchedParam:"config",oldValue:JSON.stringify(r.config),newValue:JSON.stringify(s)})}else throw L.create("duplicate-app",{appName:i,mismatchedParam:"options",oldValue:JSON.stringify(r.options),newValue:JSON.stringify(n)});const a=new Xs(i);for(const c of Ye.values())a.addComponent(c);const o=new Wi(n,s,a);return ae.set(i,o),o}function vn(t=Ke){const e=ae.get(t);if(!e&&t===Ke&&hn())return bn();if(!e)throw L.create("no-app",{appName:t});return e}function $t(){return Array.from(ae.values())}function z(t,e,n){let s=Vi[t]??t;n&&(s+=`-${n}`);const i=s.match(/\s|\//),r=e.match(/\s|\//);if(i||r){const a=[`Unable to register library "${s}" with version "${e}":`];i&&a.push(`library name "${s}" contains illegal characters (whitespace or "/")`),i&&r&&a.push("and"),r&&a.push(`version name "${e}" contains illegal characters (whitespace or "/")`),P.warn(a.join(" "));return}Z(new K(`${s}-version`,()=>({library:s,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zi="firebase-heartbeat-database",Ki=1,oe="firebase-heartbeat-store";let Oe=null;function En(){return Oe||(Oe=di(zi,Ki,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(oe)}catch(n){console.warn(n)}}}}).catch(t=>{throw L.create("idb-open",{originalErrorMessage:t.message})})),Oe}async function Yi(t){try{const n=(await En()).transaction(oe),s=await n.objectStore(oe).get(wn(t));return await n.done,s}catch(e){if(e instanceof te)P.warn(e.message);else{const n=L.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});P.warn(n.message)}}}async function Dt(t,e){try{const s=(await En()).transaction(oe,"readwrite");await s.objectStore(oe).put(e,wn(t)),await s.done}catch(n){if(n instanceof te)P.warn(n.message);else{const s=L.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});P.warn(s.message)}}}function wn(t){return`${t.name}!${t.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ji=1024,Xi=30;class Qi{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new er(n),this._heartbeatsCachePromise=this._storage.read().then(s=>(this._heartbeatsCache=s,s))}async triggerHeartbeat(){var e,n;try{const i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),r=Nt();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)==null?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===r||this._heartbeatsCache.heartbeats.some(a=>a.date===r))return;if(this._heartbeatsCache.heartbeats.push({date:r,agent:i}),this._heartbeatsCache.heartbeats.length>Xi){const a=tr(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(a,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(s){P.warn(s)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=Nt(),{heartbeatsToSend:s,unsentEntries:i}=Zi(this._heartbeatsCache.heartbeats),r=un(JSON.stringify({version:2,heartbeats:s}));return this._heartbeatsCache.lastSentHeartbeatDate=n,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),r}catch(n){return P.warn(n),""}}}function Nt(){return new Date().toISOString().substring(0,10)}function Zi(t,e=Ji){const n=[];let s=t.slice();for(const i of t){const r=n.find(a=>a.agent===i.agent);if(r){if(r.dates.push(i.date),Lt(n)>e){r.dates.pop();break}}else if(n.push({agent:i.agent,dates:[i.date]}),Lt(n)>e){n.pop();break}s=s.slice(1)}return{heartbeatsToSend:n,unsentEntries:s}}class er{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return st()?js().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await Yi(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const s=await this.read();return Dt(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??s.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const s=await this.read();return Dt(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??s.lastSentHeartbeatDate,heartbeats:[...s.heartbeats,...e.heartbeats]})}else return}}function Lt(t){return un(JSON.stringify({version:2,heartbeats:t})).length}function tr(t){if(t.length===0)return-1;let e=0,n=t[0].date;for(let s=1;s<t.length;s++)t[s].date<n&&(n=t[s].date,e=s);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nr(t){Z(new K("platform-logger",e=>new hi(e),"PRIVATE")),Z(new K("heartbeat",e=>new Qi(e),"PRIVATE")),z(ze,kt,t),z(ze,kt,"esm2020"),z("fire-js","")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */nr("");var sr="firebase",ir="13.4.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */z(sr,ir,"app");/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Je=new Map,In={activated:!1,tokenObservers:[]},rr={initialized:!1,enabled:!1};function R(t){return Je.get(t)||{...In}}function ar(t,e){return Je.set(t,e),Je.get(t)}function ve(){return rr}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const or="https://content-firebaseappcheck.googleapis.com/v1",cr="exchangeDebugToken",Pt={RETRIAL_MIN_WAIT:30*1e3,RETRIAL_MAX_WAIT:16*60*1e3};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lr{constructor(e,n,s,i,r){if(this.operation=e,this.retryPolicy=n,this.getWaitDuration=s,this.lowerBound=i,this.upperBound=r,this.pending=null,this.nextErrorWaitInterval=i,i>r)throw new Error("Proactive refresh lower bound greater than upper bound!")}start(){this.nextErrorWaitInterval=this.lowerBound,this.process(!0).catch(()=>{})}stop(){this.pending&&(this.pending.reject("cancelled"),this.pending=null)}isRunning(){return!!this.pending}async process(e){this.stop();try{this.pending=new fe,this.pending.promise.catch(n=>{}),await dr(this.getNextRun(e)),this.pending.resolve(),await this.pending.promise,this.pending=new fe,this.pending.promise.catch(n=>{}),await this.operation(),this.pending.resolve(),await this.pending.promise,this.process(!0).catch(()=>{})}catch(n){this.retryPolicy(n)?this.process(!1).catch(()=>{}):this.stop()}}getNextRun(e){if(e)return this.nextErrorWaitInterval=this.lowerBound,this.getWaitDuration();{const n=this.nextErrorWaitInterval;return this.nextErrorWaitInterval*=2,this.nextErrorWaitInterval>this.upperBound&&(this.nextErrorWaitInterval=this.upperBound),n}}}function dr(t){return new Promise(e=>{setTimeout(e,t)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ur={"already-initialized":"You have already called initializeAppCheck() for FirebaseApp {$appName} with different options. To avoid this error, call initializeAppCheck() with the same options as when it was originally called. This will return the already initialized instance.","use-before-activation":"App Check is being used before initializeAppCheck() is called for FirebaseApp {$appName}. Call initializeAppCheck() before instantiating other Firebase services.","fetch-network-error":"Fetch failed to connect to a network. Check Internet connection. Original error: {$originalErrorMessage}.","fetch-parse-error":"Fetch client could not parse response. Original error: {$originalErrorMessage}.","fetch-status-error":"Fetch server returned an HTTP error status. HTTP status: {$httpStatus}.","storage-open":"Error thrown when opening storage. Original error: {$originalErrorMessage}.","storage-get":"Error thrown when reading from storage. Original error: {$originalErrorMessage}.","storage-set":"Error thrown when writing to storage. Original error: {$originalErrorMessage}.","recaptcha-error":"ReCAPTCHA error.","initial-throttle":"{$httpStatus} error. Attempts allowed again after {$time}",throttled:"Requests throttled due to previous {$httpStatus} error. Attempts allowed again after {$time}"},O=new it("appCheck","AppCheck",ur);function Sn(t){if(!R(t).activated)throw O.create("use-before-activation",{appName:t.name})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function An({url:t,body:e},n){const s={"Content-Type":"application/json"},i=n.getImmediate({optional:!0});if(i){const p=await i.getHeartbeatsHeader();p&&(s["X-Firebase-Client"]=p)}const r={method:"POST",body:JSON.stringify(e),headers:s};let a;try{a=await fetch(t,r)}catch(p){throw O.create("fetch-network-error",{originalErrorMessage:p==null?void 0:p.message})}if(a.status!==200)throw O.create("fetch-status-error",{httpStatus:a.status});let o;try{o=await a.json()}catch(p){throw O.create("fetch-parse-error",{originalErrorMessage:p==null?void 0:p.message})}const c=o.ttl.match(/^([\d.]+)(s)$/);if(!c||!c[2]||isNaN(Number(c[1])))throw O.create("fetch-parse-error",{originalErrorMessage:`ttl field (timeToLive) is not in standard Protobuf Duration format: ${o.ttl}`});const l=Number(c[1])*1e3,u=Date.now();return{token:o.token,expireTimeMillis:u+l,issuedAtTimeMillis:u}}function Tn(t,e){const{projectId:n,appId:s,apiKey:i}=t.options;return{url:`${or}/projects/${n}/apps/${s}:${cr}?key=${i}`,body:{debug_token:e}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pr="firebase-app-check-database",hr=1,ce="firebase-app-check-store",Rn="debug-token";let ue=null;function _n(){return ue||(ue=new Promise((t,e)=>{try{const n=indexedDB.open(pr,hr);n.onsuccess=s=>{t(s.target.result)},n.onerror=s=>{var i;e(O.create("storage-open",{originalErrorMessage:(i=s.target.error)==null?void 0:i.message}))},n.onupgradeneeded=s=>{const i=s.target.result;switch(s.oldVersion){case 0:i.createObjectStore(ce,{keyPath:"compositeKey"})}}}catch(n){e(O.create("storage-open",{originalErrorMessage:n==null?void 0:n.message}))}}),ue)}function fr(t){return kn(On(t))}function mr(t,e){return Cn(On(t),e)}function gr(t){return Cn(Rn,t)}function yr(){return kn(Rn)}async function Cn(t,e){const s=(await _n()).transaction(ce,"readwrite"),r=s.objectStore(ce).put({compositeKey:t,value:e});return new Promise((a,o)=>{r.onsuccess=c=>{a()},s.onerror=c=>{var l;o(O.create("storage-set",{originalErrorMessage:(l=c.target.error)==null?void 0:l.message}))}})}async function kn(t){const n=(await _n()).transaction(ce,"readonly"),i=n.objectStore(ce).get(t);return new Promise((r,a)=>{i.onsuccess=o=>{const c=o.target.result;r(c?c.value:void 0)},n.onerror=o=>{var c;a(O.create("storage-get",{originalErrorMessage:(c=o.target.error)==null?void 0:c.message}))}})}function On(t){return`${t.options.appId}-${t.name}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const H=new rt("@firebase/app-check");/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function br(t){if(st()){let e;try{e=await fr(t)}catch(n){H.warn(`Failed to read token from IndexedDB. Error: ${n}`)}return e}}function $e(t,e){return st()?mr(t,e).catch(n=>{H.warn(`Failed to write token to IndexedDB. Error: ${n}`)}):Promise.resolve()}async function vr(t){let e;try{e=await yr()}catch{}if(e)return e;{const n=crypto.randomUUID();let s=`To use this token for app debugging, register it with your project.

Firebase App Check debug token: ${n}

`;const i=t==null?void 0:t.options.appId,r=t==null?void 0:t.options.projectId;return r&&i?s+=`You can do so in the Firebase Console:
https://console.firebase.google.com/project/${r}/appcheck/apps?selectedAppId=${i}

Or using the Firebase CLI:
firebase appcheck:debugtokens:create ${n} --project ${r} --app ${i}

`:s+=`You will need to add it to your app's App Check settings in the Firebase Console for it to work.

`,s+=`Note: To keep your project secure, please revoke and delete this token using the
Firebase Console or the CLI (\`firebase appcheck:debugtokens:delete\`) when you finish debugging.

Warning: This debug token is a secret and should not be shared or uploaded to source code.

Debug Token Guide: https://firebase.google.com/docs/app-check/web/debug-provider
Firebase CLI install instructions: https://firebase.google.com/docs/cli
`,console.log(s),gr(n).catch(a=>H.warn(`Failed to persist debug token to IndexedDB. Error: ${a}`)),n}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ot(){return ve().enabled}async function ct(){const t=ve();if(t.enabled&&t.token)return t.token.promise;throw Error(`
            Can't get debug token in production mode.
        `)}function Er(t){const e=nt(),n=ve();if(n.initialized=!0,typeof e.FIREBASE_APPCHECK_DEBUG_TOKEN!="string"&&e.FIREBASE_APPCHECK_DEBUG_TOKEN!==!0)return;n.enabled=!0;const s=new fe;n.token=s,typeof e.FIREBASE_APPCHECK_DEBUG_TOKEN=="string"?s.resolve(e.FIREBASE_APPCHECK_DEBUG_TOKEN):s.resolve(vr(t))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wr={error:"UNKNOWN_ERROR"};function Ir(t){return tt.encodeString(JSON.stringify(t),!1)}async function Xe(t,e=!1,n=!1){const s=t.app;Sn(s);const i=R(s);let r=i.token,a;if(r&&!X(r)&&(i.token=void 0,r=void 0),!r){const l=await i.cachedTokenPromise;l&&(X(l)?r=l:await $e(s,void 0))}if(!e&&r&&X(r))return{token:r.token};let o=!1;if(ot())try{const l=await ct();i.exchangeTokenPromise||(i.exchangeTokenPromise=An(Tn(s,l),t.heartbeatServiceProvider).finally(()=>{i.exchangeTokenPromise=void 0}),o=!0);const u=await i.exchangeTokenPromise;return await $e(s,u),i.token=u,{token:u.token}}catch(l){return l.code==="appCheck/throttled"||l.code==="appCheck/initial-throttle"?H.warn(l.message):n&&H.error(l),De(l)}try{i.exchangeTokenPromise||(i.exchangeTokenPromise=i.provider.getToken().finally(()=>{i.exchangeTokenPromise=void 0}),o=!0),r=await R(s).exchangeTokenPromise}catch(l){l.code==="appCheck/throttled"||l.code==="appCheck/initial-throttle"?H.warn(l.message):n&&H.error(l),a=l}let c;return r?a?X(r)?c={token:r.token,internalError:a}:c=De(a):(c={token:r.token},i.token=r,await $e(s,r)):c=De(a),o&&Nn(s,c),c}async function Sr(t){const e=t.app;Sn(e);const{provider:n}=R(e);if(ot()){const s=await ct(),i=Tn(e,s);i.body.limited_use=!0;const{token:r}=await An(i,t.heartbeatServiceProvider);return{token:r}}else{const{token:s}=await n.getToken(!0);return{token:s}}}function $n(t,e,n,s){const{app:i}=t,r=R(i),a={next:n,error:s,type:e};if(r.tokenObservers=[...r.tokenObservers,a],r.token&&X(r.token)){const o=r.token;Promise.resolve().then(()=>{n({token:o.token}),Mt(t)}).catch(()=>{})}r.cachedTokenPromise.then(()=>Mt(t))}function Dn(t,e){const n=R(t),s=n.tokenObservers.filter(i=>i.next!==e);s.length===0&&n.tokenRefresher&&n.tokenRefresher.isRunning()&&n.tokenRefresher.stop(),n.tokenObservers=s}function Mt(t){const{app:e}=t,n=R(e);let s=n.tokenRefresher;s||(s=Ar(t),n.tokenRefresher=s),!s.isRunning()&&n.isTokenAutoRefreshEnabled&&s.start()}function Ar(t){const{app:e}=t;return new lr(async()=>{const n=R(e);let s;if(n.token?s=await Xe(t,!0):s=await Xe(t),s.error)throw s.error;if(s.internalError)throw s.internalError},()=>!0,()=>{const n=R(e);if(n.token){let s=n.token.issuedAtTimeMillis+(n.token.expireTimeMillis-n.token.issuedAtTimeMillis)*.5+3e5;const i=n.token.expireTimeMillis-5*60*1e3;return s=Math.min(s,i),Math.max(0,s-Date.now())}else return 0},Pt.RETRIAL_MIN_WAIT,Pt.RETRIAL_MAX_WAIT)}function Nn(t,e){const n=R(t).tokenObservers;for(const s of n)try{s.type==="EXTERNAL"&&e.error!=null?s.error(e.error):s.next(e)}catch{}}function X(t){return t.expireTimeMillis-Date.now()>0}function De(t){return{token:Ir(wr),error:t}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tr{constructor(e,n){this.app=e,this.heartbeatServiceProvider=n}_delete(){const{tokenObservers:e}=R(this.app);for(const n of e)Dn(this.app,n.next);return Promise.resolve()}}function Rr(t,e){return new Tr(t,e)}function _r(t){return{getToken:e=>Xe(t,e),getLimitedUseToken:()=>Sr(t),addTokenListener:e=>$n(t,"INTERNAL",e),removeTokenListener:e=>Dn(t.app,e)}}const Cr="@firebase/app-check",kr="0.13.2";class lt{constructor(e){this._customProviderOptions=e}async getToken(){const e=await this._customProviderOptions.getToken(),n=zs(e.token),s=n!==null&&n<Date.now()&&n>0?n*1e3:Date.now();return{...e,issuedAtTimeMillis:s}}initialize(e){this._app=e}isEqual(e){return e instanceof lt?this._customProviderOptions.getToken.toString()===e._customProviderOptions.getToken.toString():!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Or(t=vn(),e){var i;t=fn(t);const n=yn(t,"app-check");if(ve().initialized||Er(t),ot()&&ct().then(r=>{console.log(`Firebase App Check debug token: ${r}`)}),n.isInitialized()){const r=n.getImmediate(),a=n.getOptions();if(a&&!!a.isTokenAutoRefreshEnabled==!!e.isTokenAutoRefreshEnabled&&((i=a.provider)!=null&&i.isEqual(e.provider)))return r;throw O.create("already-initialized",{appName:t.name})}const s=n.initialize({options:e});return $r(t,e.provider,e.isTokenAutoRefreshEnabled),R(t).isTokenAutoRefreshEnabled&&$n(s,"INTERNAL",()=>{}),s}function $r(t,e,n=!1){const s=ar(t,{...In});s.activated=!0,s.provider=e,s.cachedTokenPromise=br(t).then(i=>(i&&X(i)&&(s.token=i,Nn(t,{token:i.token})),i)),s.isTokenAutoRefreshEnabled=n&&t.automaticDataCollectionEnabled,!t.automaticDataCollectionEnabled&&n&&H.warn("`isTokenAutoRefreshEnabled` is true but `automaticDataCollectionEnabled` was set to false during `initializeApp()`. This blocks automatic token refresh."),s.provider.initialize(t)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dr="app-check",xt="app-check-internal";function Nr(){Z(new K(Dr,t=>{const e=t.getProvider("app").getImmediate(),n=t.getProvider("heartbeat");return Rr(e,n)},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((t,e,n)=>{t.getProvider(xt).initialize()})),Z(new K(xt,t=>{const e=t.getProvider("app-check").getImmediate();return _r(e)},"PUBLIC").setInstantiationMode("EXPLICIT")),z(Cr,kr)}Nr();var Ft="@firebase/ai",Qe="3.1.0";/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ee="AI",Lr="global",Pr="firebasevertexai.googleapis.com",me="v1beta",Bt=Qe,Mr="gl-js",xr="hybrid",Fr=180*1e3,Br="gemini-3.5-flash-lite";/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class m extends te{constructor(e,n,s){const i=ee,r=`${i}/${e}`,a=`${i}: ${n} (${r})`;super(e,a),this.code=e,this.customErrorData=s,Error.captureStackTrace&&Error.captureStackTrace(this,m),Object.setPrototypeOf(this,m.prototype),this.toString=()=>a}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ut=["user","model","function","system"],Ln={HARM_SEVERITY_UNSUPPORTED:"HARM_SEVERITY_UNSUPPORTED"},I={SAFETY:"SAFETY",RECITATION:"RECITATION",BLOCKLIST:"BLOCKLIST",PROHIBITED_CONTENT:"PROHIBITED_CONTENT",SPII:"SPII",MALFORMED_FUNCTION_CALL:"MALFORMED_FUNCTION_CALL",IMAGE_SAFETY:"IMAGE_SAFETY",IMAGE_PROHIBITED_CONTENT:"IMAGE_PROHIBITED_CONTENT",IMAGE_OTHER:"IMAGE_OTHER",NO_IMAGE:"NO_IMAGE",IMAGE_RECITATION:"IMAGE_RECITATION",LANGUAGE:"LANGUAGE",UNEXPECTED_TOOL_CALL:"UNEXPECTED_TOOL_CALL",TOO_MANY_TOOL_CALLS:"TOO_MANY_TOOL_CALLS",MISSING_THOUGHT_SIGNATURE:"MISSING_THOUGHT_SIGNATURE",MALFORMED_RESPONSE:"MALFORMED_RESPONSE"},S={PREFER_ON_DEVICE:"prefer_on_device",ONLY_ON_DEVICE:"only_on_device",ONLY_IN_CLOUD:"only_in_cloud",PREFER_IN_CLOUD:"prefer_in_cloud"},U={ON_DEVICE:"on_device",IN_CLOUD:"in_cloud"};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const f={ERROR:"error",REQUEST_ERROR:"request-error",RESPONSE_ERROR:"response-error",FETCH_ERROR:"fetch-error",SESSION_CLOSED:"session-closed",INVALID_CONTENT:"invalid-content",API_NOT_ENABLED:"api-not-enabled",ALREADY_INITIALIZED:"already-initialized",INVALID_SCHEMA:"invalid-schema",NO_API_KEY:"no-api-key",NO_APP_ID:"no-app-id",NO_MODEL:"no-model",NO_PROJECT_ID:"no-project-id",PARSE_FAILED:"parse-failed",UNSUPPORTED:"unsupported"};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const M={AGENT_PLATFORM:"AGENT_PLATFORM",GOOGLE_AI:"GOOGLE_AI"};/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pn{constructor(e){this.backendType=e}}class Ee extends Pn{constructor(){super(M.GOOGLE_AI)}_getModelPath(e,n){return`/${me}/projects/${e}/${n}`}_getTemplatePath(e,n){return`/${me}/projects/${e}/templates/${n}`}}class Mn extends Pn{constructor(e){super(M.AGENT_PLATFORM),this.location=Lr,e&&(this.location=e)}_getModelPath(e,n){return`/${me}/projects/${e}/locations/${this.location}/${n}`}_getTemplatePath(e,n){return`/${me}/projects/${e}/locations/${this.location}/templates/${n}`}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ur(t){if(t instanceof Ee)return`${ee}/googleai`;if(t instanceof Mn)return`${ee}/agentplatform/${t.location}`;throw new m(f.ERROR,`Invalid backend: ${JSON.stringify(t.backendType)}`)}function Hr(t){const e=t.split("/");if(e[0]!==ee)throw new m(f.ERROR,`Invalid instance identifier, unknown prefix '${e[0]}'`);switch(e[1]){case"agentplatform":const s=e[2];if(!s)throw new m(f.ERROR,`Invalid instance identifier, unknown location '${t}'`);return new Mn(s);case"googleai":return new Ee;default:throw new m(f.ERROR,`Invalid instance identifier string: '${t}'`)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const w=new rt("@firebase/ai");var N;(function(t){t.UNAVAILABLE="unavailable",t.DOWNLOADABLE="downloadable",t.DOWNLOADING="downloading",t.AVAILABLE="available"})(N||(N={}));/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xn={type:"text",languages:["en"]},Ne=[xn,{type:"image"}],Le=[xn];class _{constructor(e,n,s){this.languageModelProvider=e,this.mode=n,this.downloadPromise=null,this.onDeviceParams={createOptions:{expectedInputs:Ne,expectedOutputs:Le}},s&&(this.onDeviceParams=s,this.onDeviceParams.createOptions?(this.onDeviceParams.createOptions.expectedInputs||(this.onDeviceParams.createOptions.expectedInputs=Ne),this.onDeviceParams.createOptions.expectedOutputs||(this.onDeviceParams.createOptions.expectedOutputs=Le)):this.onDeviceParams.createOptions={expectedInputs:Ne,expectedOutputs:Le})}async isAvailable(e){var s;if(!this.mode)return w.debug("On-device inference unavailable because mode is undefined."),!1;if(this.mode===S.ONLY_IN_CLOUD)return w.debug('On-device inference unavailable because mode is "only_in_cloud".'),!1;const n=await((s=this.languageModelProvider)==null?void 0:s.availability(this.onDeviceParams.createOptions));if(this.mode===S.ONLY_ON_DEVICE){if(n===N.UNAVAILABLE)throw new m(f.API_NOT_ENABLED,"Local LanguageModel API not available in this environment.");if(n===N.DOWNLOADABLE||n===N.DOWNLOADING){w.debug("Waiting for download of LanguageModel to complete.");try{await this.downloadPromise}catch(i){throw new m(f.ERROR,i.message)}return!0}return!0}return n!==N.AVAILABLE?(w.debug(`On-device inference unavailable because availability is "${n}".`),!1):_.isOnDeviceRequest(e)?!0:(w.debug("On-device inference unavailable because request is incompatible."),!1)}async generateContent(e){const n=await this.createSession(),s=await Promise.all(e.contents.map(_.toLanguageModelMessage)),i=await n.prompt(s,this.onDeviceParams.promptOptions);return _.toResponse(i)}async generateContentStream(e){const n=await this.createSession(),s=await Promise.all(e.contents.map(_.toLanguageModelMessage)),i=n.promptStreaming(s,this.onDeviceParams.promptOptions);return _.toStreamResponse(i)}async countTokens(e){throw new m(f.REQUEST_ERROR,"Count Tokens is not yet available for on-device model.")}static isOnDeviceRequest(e){if(e.contents.length===0)return w.debug("Empty prompt rejected for on-device inference."),!1;for(const n of e.contents){if(n.parts.some(s=>"functionResponse"in s))return w.debug("Content with a function response part rejected for on-device inference."),!1;for(const s of n.parts)if("inlineData"in s&&s.inlineData&&_.SUPPORTED_MIME_TYPES.indexOf(s.inlineData.mimeType)===-1)return w.debug(`Unsupported mime type "${s.inlineData.mimeType}" rejected for on-device inference.`),!1}return!0}async downloadIfAvailable(e){var s;const n=await((s=this.languageModelProvider)==null?void 0:s.availability(this.onDeviceParams.createOptions));return(n===N.DOWNLOADABLE||n===N.DOWNLOADING)&&this.download(e),n}download(e){var s;if(this.downloadPromise)return;const n={...this.onDeviceParams.createOptions};n&&!n.monitor&&e&&(n.monitor=i=>{i.addEventListener("downloadprogress",r=>{e(r.loaded)})}),this.downloadPromise=(s=this.languageModelProvider)==null?void 0:s.create(n).finally(()=>{this.downloadPromise=null})}static async toLanguageModelMessage(e){const n=await Promise.all(e.parts.map(_.toLanguageModelMessageContent));return{role:_.toLanguageModelMessageRole(e.role),content:n}}static async toLanguageModelMessageContent(e){if("text"in e&&typeof e.text=="string")return{type:"text",value:e.text};if("inlineData"in e&&e.inlineData){const s=await(await fetch(`data:${e.inlineData.mimeType};base64,${e.inlineData.data}`)).blob();return{type:"image",value:await createImageBitmap(s)}}throw new m(f.REQUEST_ERROR,"Processing of this Part type is not currently supported.")}static toLanguageModelMessageRole(e){return e==="model"?"assistant":"user"}async createSession(){if(!this.languageModelProvider)throw new m(f.UNSUPPORTED,"Chrome AI requested for unsupported browser version.");const e=await this.languageModelProvider.create(this.onDeviceParams.createOptions);return this.oldSession&&this.oldSession.destroy(),this.oldSession=e,e}static toResponse(e){return{json:async()=>({candidates:[{content:{parts:[{text:e}]}}]})}}static toStreamResponse(e){const n=new TextEncoder;return{body:e.pipeThrough(new TransformStream({transform(s,i){const r=JSON.stringify({candidates:[{content:{role:"model",parts:[{text:s}]}}]});i.enqueue(n.encode(`data: ${r}

`))}}))}}}_.SUPPORTED_MIME_TYPES=["image/jpeg","image/png"];function Vr(t,e,n){const i=(e||nt()).LanguageModel;if(i&&t)return new _(i,t,n)}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jr{constructor(e,n,s,i,r){this.app=e,this.backend=n,this.chromeAdapterFactory=r;const a=i==null?void 0:i.getImmediate({optional:!0}),o=s==null?void 0:s.getImmediate({optional:!0});this.auth=o||null,this.appCheck=a||null}_delete(){return Promise.resolve()}set options(e){this._options=e}get options(){return this._options}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gr(t,{instanceIdentifier:e}){if(!e)throw new m(f.ERROR,"AIService instance identifier is undefined.");const n=Hr(e),s=t.getProvider("app").getImmediate(),i=t.getProvider("auth-internal"),r=t.getProvider("app-check-internal");return new jr(s,n,i,r,Vr)}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qr(t){var n,s,i,r,a,o,c;if((s=(n=t.app)==null?void 0:n.options)!=null&&s.apiKey)if((r=(i=t.app)==null?void 0:i.options)!=null&&r.projectId){if(!((o=(a=t.app)==null?void 0:a.options)!=null&&o.appId))throw new m(f.NO_APP_ID,'The "appId" field is empty in the local Firebase config. Firebase AI requires this field to contain a valid app ID.')}else throw new m(f.NO_PROJECT_ID,'The "projectId" field is empty in the local Firebase config. Firebase AI requires this field to contain a valid project ID.');else throw new m(f.NO_API_KEY,'The "apiKey" field is empty in the local Firebase config. Firebase AI requires this field to contain a valid API key.');const e={apiKey:t.app.options.apiKey,project:t.app.options.projectId,appId:t.app.options.appId,automaticDataCollectionEnabled:t.app.automaticDataCollectionEnabled,backend:t.backend};if(Gi(t.app)&&t.app.settings.appCheckToken){const l=t.app.settings.appCheckToken;e.getAppCheckToken=()=>Promise.resolve({token:l})}else t.appCheck&&((c=t.options)!=null&&c.useLimitedUseAppCheckTokens?e.getAppCheckToken=()=>t.appCheck.getLimitedUseToken():e.getAppCheckToken=()=>t.appCheck.getToken());return t.auth&&(e.getAuthToken=()=>t.auth.getToken()),e}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class re{constructor(e,n){this._apiSettings=qr(e),this.model=re.normalizeModelName(n,this._apiSettings.backend.backendType)}static normalizeModelName(e,n){return n===M.GOOGLE_AI?re.normalizeGoogleAIModelName(e):re.normalizeVertexAIModelName(e)}static normalizeGoogleAIModelName(e){return`models/${e}`}static normalizeVertexAIModelName(e){let n;return e.includes("/")?e.startsWith("models/")?n=`publishers/google/${e}`:n=e:n=`publishers/google/models/${e}`,n}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wr="Timeout has expired.",Pe="AbortError";class zr{constructor(e){this.params=e}toString(){const e=new URL(this.baseUrl);return e.pathname=this.pathname,e.search=this.queryParams.toString(),e.toString()}get pathname(){return this.params.templateId?`${this.params.apiSettings.backend._getTemplatePath(this.params.apiSettings.project,this.params.templateId)}:${this.params.task}`:`${this.params.apiSettings.backend._getModelPath(this.params.apiSettings.project,this.params.model)}:${this.params.task}`}get baseUrl(){var e;return((e=this.params.singleRequestOptions)==null?void 0:e.baseUrl)??`https://${Pr}`}get queryParams(){const e=new URLSearchParams;return this.params.stream&&e.set("alt","sse"),e}}function Kr(t){const e=[];return e.push(`${Mr}/${Bt}`),e.push(`fire/${Bt}`),(t.params.apiSettings.inferenceMode===S.PREFER_ON_DEVICE||t.params.apiSettings.inferenceMode===S.PREFER_IN_CLOUD)&&e.push(xr),e.join(" ")}async function Yr(t){const e=new Headers;if(e.append("Content-Type","application/json"),e.append("x-goog-api-client",Kr(t)),e.append("x-goog-api-key",t.params.apiSettings.apiKey),t.params.apiSettings.automaticDataCollectionEnabled&&e.append("X-Firebase-Appid",t.params.apiSettings.appId),t.params.apiSettings.getAppCheckToken){const n=await t.params.apiSettings.getAppCheckToken();n&&(e.append("X-Firebase-AppCheck",n.token),n.error&&w.warn(`Unable to obtain a valid App Check token: ${n.error.message}`))}if(t.params.apiSettings.getAuthToken){const n=await t.params.apiSettings.getAuthToken();n&&e.append("Authorization",`Firebase ${n.accessToken}`)}return e}async function dt(t,e){var l,u;const n=new zr(t);let s;const i=(l=t.singleRequestOptions)==null?void 0:l.signal,r=((u=t.singleRequestOptions)==null?void 0:u.timeout)!=null&&t.singleRequestOptions.timeout>=0?t.singleRequestOptions.timeout:Fr,a=new AbortController,o=setTimeout(()=>{a.abort(new DOMException(Wr,Pe)),w.debug(`Aborting request to ${n} due to timeout (${r}ms)`)},r),c=AbortSignal.any(i?[i,a.signal]:[a.signal]);if(i&&i.aborted)throw clearTimeout(o),new DOMException(i.reason??"Aborted externally before fetch",Pe);try{const p={method:"POST",headers:await Yr(n),signal:c,body:e};if(s=await fetch(n.toString(),p),!s.ok){let h="",y;try{const b=await s.json();h=b.error.message,b.error.details&&(h+=` ${JSON.stringify(b.error.details)}`,y=b.error.details)}catch{}throw s.status===403&&y&&y.some(b=>b.reason==="SERVICE_DISABLED")&&y.some(b=>{var A,x;return(x=(A=b.links)==null?void 0:A[0])==null?void 0:x.description.includes("Google developers console API activation")})?new m(f.API_NOT_ENABLED,`The Firebase AI SDK requires the Firebase AI API ('firebasevertexai.googleapis.com') to be enabled in your Firebase project. Enable this API by visiting the Firebase Console at https://console.firebase.google.com/project/${n.params.apiSettings.project}/ailogic/ and clicking "Get started". If you enabled this API recently, wait a few minutes for the action to propagate to our systems and then retry.`,{status:s.status,statusText:s.statusText,errorDetails:y}):new m(f.FETCH_ERROR,`Error fetching from ${n}: [${s.status} ${s.statusText}] ${h}`,{status:s.status,statusText:s.statusText,errorDetails:y})}}catch(p){let h=p;throw p.code!==f.FETCH_ERROR&&p.code!==f.API_NOT_ENABLED&&p instanceof Error&&p.name!==Pe&&(h=new m(f.ERROR,`Error fetching from ${n.toString()}: ${p.message}`),h.stack=p.stack),h}finally{clearTimeout(o)}return s}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pe(t){if(t.candidates&&t.candidates.length>0){if(t.candidates.length>1&&w.warn(`This response had ${t.candidates.length} candidates. Returning text from the first candidate only. Access response.candidates directly to use the other candidates.`),Bn(t.candidates[0]))throw new m(f.RESPONSE_ERROR,`Response error: ${q(t)}. Response body stored in error.response`,{response:t});return!0}else return!1}function $(t){return"type"in t&&t.type?t:t.text!==void 0?{...t,type:"text"}:t.inlineData!==void 0?{...t,type:"inlineData"}:t.functionCall!==void 0?{...t,type:"functionCall"}:t.functionResponse!==void 0?{...t,type:"functionResponse"}:t.fileData!==void 0?{...t,type:"fileData"}:t.executableCode!==void 0?{...t,type:"executableCode"}:t.codeExecutionResult!==void 0?{...t,type:"codeExecutionResult"}:t}function ge(t,e=U.IN_CLOUD){var s,i;if((s=t.candidates)!=null&&s[0]&&!t.candidates[0].hasOwnProperty("index")&&(t.candidates[0].index=0),t.candidates)for(const r of t.candidates)(i=r.content)!=null&&i.parts&&(r.content.parts=r.content.parts.map($));const n=Jr(t);return n.inferenceSource=e,n}function Jr(t){return t.text=()=>{if(pe(t))return Ht(t,e=>!("thought"in e&&e.thought));if(t.promptFeedback)throw new m(f.RESPONSE_ERROR,`Text not available. ${q(t)}`,{response:t});return""},t.thoughtSummary=()=>{if(pe(t)){const e=Ht(t,n=>!!("thought"in n&&n.thought));return e===""?void 0:e}else if(t.promptFeedback)throw new m(f.RESPONSE_ERROR,`Thought summary not available. ${q(t)}`,{response:t})},t.inlineDataParts=()=>{if(pe(t))return Xr(t);if(t.promptFeedback)throw new m(f.RESPONSE_ERROR,`Data not available. ${q(t)}`,{response:t})},t.functionCalls=()=>{if(pe(t))return Fn(t);if(t.promptFeedback)throw new m(f.RESPONSE_ERROR,`Function call not available. ${q(t)}`,{response:t})},t}function Ht(t,e){var s,i,r,a;const n=[];if((i=(s=t.candidates)==null?void 0:s[0].content)!=null&&i.parts)for(const o of(a=(r=t.candidates)==null?void 0:r[0].content)==null?void 0:a.parts){const c=$(o);c.type==="text"&&e(c)&&n.push(c.text)}return n.length>0?n.join(""):""}function Fn(t){var n,s,i,r;if(!t)return;const e=[];if((s=(n=t.candidates)==null?void 0:n[0].content)!=null&&s.parts)for(const a of(r=(i=t.candidates)==null?void 0:i[0].content)==null?void 0:r.parts){const o=$(a);o.type==="functionCall"&&e.push(o.functionCall)}if(e.length>0)return e}function Xr(t){var n,s,i,r;const e=[];if((s=(n=t.candidates)==null?void 0:n[0].content)!=null&&s.parts)for(const a of(r=(i=t.candidates)==null?void 0:i[0].content)==null?void 0:r.parts){const o=$(a);o.type==="inlineData"&&e.push(o)}if(e.length>0)return e}const Qr=[I.RECITATION,I.SAFETY,I.BLOCKLIST,I.PROHIBITED_CONTENT,I.SPII,I.MALFORMED_FUNCTION_CALL,I.IMAGE_SAFETY,I.IMAGE_PROHIBITED_CONTENT,I.IMAGE_OTHER,I.NO_IMAGE,I.IMAGE_RECITATION,I.LANGUAGE,I.UNEXPECTED_TOOL_CALL,I.TOO_MANY_TOOL_CALLS,I.MISSING_THOUGHT_SIGNATURE,I.MALFORMED_RESPONSE];function Bn(t){return!!t.finishReason&&Qr.some(e=>e===t.finishReason)}function q(t){var n,s,i;let e="";if((!t.candidates||t.candidates.length===0)&&t.promptFeedback)e+="Response was blocked",(n=t.promptFeedback)!=null&&n.blockReason&&(e+=` due to ${t.promptFeedback.blockReason}`),(s=t.promptFeedback)!=null&&s.blockReasonMessage&&(e+=`: ${t.promptFeedback.blockReasonMessage}`);else if((i=t.candidates)!=null&&i[0]){const r=t.candidates[0];Bn(r)&&(e+=`Candidate was blocked due to ${r.finishReason}`,r.finishMessage&&(e+=`: ${r.finishMessage}`))}return e}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ut(t){if(t!=null){if(typeof t=="string")return{role:"system",parts:[{type:"text",text:t}]};if(t.type==="text"||"text"in t&&typeof t.text=="string")return{role:"system",parts:[W($(t))]};if(t.parts){const e=t.parts.map(n=>W($(n)));return t.role?{...t,parts:e}:{role:"system",parts:e}}}}function ie(t){let e=[];if(typeof t=="string")e=[{type:"text",text:t}];else for(const n of t)typeof n=="string"?e.push({type:"text",text:n}):e.push(W($(n)));return Zr(e)}function Zr(t){const e={role:"user",parts:[]};let n=!1,s=!1;for(const i of t)i.type==="functionResponse"||"functionResponse"in i?s=!0:n=!0,e.parts.push(i);if(n&&s)throw new m(f.INVALID_CONTENT,"Within a single message, FunctionResponse cannot be mixed with other type of Part in the request for sending chat message.");if(!n&&!s)throw new m(f.INVALID_CONTENT,"No Content is provided for sending chat message.");return e}function Me(t){let e;if(t.contents){const n=t;e={...n,contents:n.contents.map(s=>({...s,parts:s.parts?s.parts.map($):[]}))}}else e={contents:[ie(t)]};return t.systemInstruction&&(e.systemInstruction=ut(t.systemInstruction)),e}function ea(t){return t.parts&&Array.isArray(t.parts)?{...t,parts:t.parts.map(pt)}:t}function pt(t){let e;if("type"in t){const{type:n,...s}=t;e=s}else e=t;return e.functionResponse&&(e={...e,functionResponse:ea(e.functionResponse)}),e}function ht(t){return t.parts?{...t,parts:t.parts.map(pt)}:t}function Un(t){return t==null||typeof t=="string"?t:"parts"in t&&Array.isArray(t.parts)?ht(t):pt(t)}function Hn(t){const e={...t};return e.contents&&(e.contents=e.contents.map(ht)),e.systemInstruction&&(e.systemInstruction=Un(e.systemInstruction)),e}function ta(t){const e={...t};return e.contents&&(e.contents=e.contents.map(ht)),e.systemInstruction&&(e.systemInstruction=Un(e.systemInstruction)),e}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vn(t){var e,n;if((e=t.safetySettings)==null||e.forEach(s=>{if(s.method)throw new m(f.UNSUPPORTED,"SafetySetting.method is not supported in the the Gemini Developer API. Please remove this property.")}),(n=t.generationConfig)!=null&&n.topK){const s=Math.round(t.generationConfig.topK);s!==t.generationConfig.topK&&(w.warn("topK in GenerationConfig has been rounded to the nearest integer to match the format for requests to the Gemini Developer API."),t.generationConfig.topK=s)}return t}function ft(t){return{candidates:t.candidates?sa(t.candidates):void 0,promptFeedback:t.promptFeedback?ia(t.promptFeedback):void 0,usageMetadata:t.usageMetadata}}function na(t,e){return{generateContentRequest:{model:e,...t}}}function sa(t){const e=[];let n;return e&&t.forEach(s=>{var a,o;let i;if(s.citationMetadata&&(i={citations:s.citationMetadata.citationSources}),s.safetyRatings&&(n=s.safetyRatings.map(c=>({...c,severity:c.severity??Ln.HARM_SEVERITY_UNSUPPORTED,probabilityScore:c.probabilityScore??0,severityScore:c.severityScore??0}))),(o=(a=s.content)==null?void 0:a.parts)!=null&&o.some(c=>"videoMetadata"in c&&c.videoMetadata))throw new m(f.UNSUPPORTED,"Part.videoMetadata is not supported in the Gemini Developer API. Please remove this property.");const r={index:s.index,content:s.content,finishReason:s.finishReason,finishMessage:s.finishMessage,safetyRatings:n,citationMetadata:i,groundingMetadata:s.groundingMetadata,urlContextMetadata:s.urlContextMetadata};e.push(r)}),e}function ia(t){const e=[];return(t.safetyRatings??[]).forEach(s=>{e.push({category:s.category,probability:s.probability,severity:s.severity??Ln.HARM_SEVERITY_UNSUPPORTED,probabilityScore:s.probabilityScore??0,severityScore:s.severityScore??0,blocked:s.blocked})}),{blockReason:t.blockReason,safetyRatings:e,blockReasonMessage:t.blockReasonMessage}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vt=/^data\: (.*)(?:\n\n|\r\r|\r\n\r\n)/;async function ra(t,e,n){const s=t.body.pipeThrough(new TextDecoderStream("utf8",{fatal:!0})),i=la(s),[r,a]=i.tee(),{response:o,firstValue:c}=await aa(a,e,n);return{stream:ca(r,e,n),response:o,firstValue:c}}async function aa(t,e,n){const[s,i]=t.tee(),r=s.getReader(),{value:a}=await r.read();return{firstValue:a,response:oa(i,e,n)}}async function oa(t,e,n){const s=[],i=t.getReader();for(;;){const{done:r,value:a}=await i.read();if(r){let o=da(s);return e.backend.backendType===M.GOOGLE_AI&&(o=ft(o)),ge(o,n)}s.push(a)}}async function*ca(t,e,n){var i,r;const s=t.getReader();for(;;){const{value:a,done:o}=await s.read();if(o)break;let c;e.backend.backendType===M.GOOGLE_AI?c=ge(ft(a),n):c=ge(a,n);const l=(i=c.candidates)==null?void 0:i[0];!((r=l==null?void 0:l.content)!=null&&r.parts)&&!(l!=null&&l.finishReason)&&!(l!=null&&l.citationMetadata)&&!(l!=null&&l.urlContextMetadata)||(yield c)}}function la(t){const e=t.getReader();return new ReadableStream({start(s){let i="";return r();function r(){return e.read().then(({value:a,done:o})=>{if(o){if(i.trim()){s.error(new m(f.PARSE_FAILED,"Failed to parse stream"));return}s.close();return}i+=a;let c=i.match(Vt),l;for(;c;){try{l=JSON.parse(c[1])}catch{s.error(new m(f.PARSE_FAILED,`Error parsing JSON response: "${c[1]}`));return}s.enqueue(l),i=i.substring(c[0].length),c=i.match(Vt)}return r()})}}})}function da(t){const e=t[t.length-1],n={promptFeedback:e==null?void 0:e.promptFeedback};for(const s of t)if(s.candidates)for(const i of s.candidates){const r=i.index||0;n.candidates||(n.candidates=[]),n.candidates[r]||(n.candidates[r]={index:i.index}),n.candidates[r].citationMetadata=i.citationMetadata,n.candidates[r].finishReason=i.finishReason,n.candidates[r].finishMessage=i.finishMessage,n.candidates[r].safetyRatings=i.safetyRatings,n.candidates[r].groundingMetadata=i.groundingMetadata;const a=i.urlContextMetadata;if(typeof a=="object"&&a!==null&&Object.keys(a).length>0&&(n.candidates[r].urlContextMetadata=a),i.content){if(!i.content.parts)continue;n.candidates[r].content||(n.candidates[r].content={role:i.content.role||"user",parts:[]});for(const o of i.content.parts){if("text"in o&&o.text==="")continue;if(Object.keys(o).length===0)throw new m(f.INVALID_CONTENT,"Part should have at least one property, but there are none. This is likely caused by a malformed response from the backend.");const c=$({...o});Object.keys(c).length>0&&n.candidates[r].content.parts.push(c)}}}return n}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ua=[f.FETCH_ERROR,f.ERROR,f.API_NOT_ENABLED];async function jn(t,e,n,s){if(!e)return{response:await s(),inferenceSource:U.IN_CLOUD};switch(e.mode){case S.ONLY_ON_DEVICE:if(await e.isAvailable(t))return{response:await n(),inferenceSource:U.ON_DEVICE};throw new m(f.UNSUPPORTED,"Inference mode is ONLY_ON_DEVICE, but an on-device model is not available.");case S.ONLY_IN_CLOUD:return{response:await s(),inferenceSource:U.IN_CLOUD};case S.PREFER_IN_CLOUD:try{return{response:await s(),inferenceSource:U.IN_CLOUD}}catch(i){if(i instanceof m&&ua.includes(i.code)&&await e.isAvailable(t))return{response:await n(),inferenceSource:U.ON_DEVICE};throw i}case S.PREFER_ON_DEVICE:return await e.isAvailable(t)?{response:await n(),inferenceSource:U.ON_DEVICE}:{response:await s(),inferenceSource:U.IN_CLOUD};default:throw new m(f.ERROR,`Unexpected infererence mode: ${e.mode}`)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function pa(t,e,n,s){return n=Hn(n),t.backend.backendType===M.GOOGLE_AI&&(n=Vn(n)),dt({task:"streamGenerateContent",model:e,apiSettings:t,stream:!0,singleRequestOptions:s},JSON.stringify(n))}async function Gn(t,e,n,s,i){const r=await jn(n,s,()=>s.generateContentStream(n),()=>pa(t,e,n,i));return ra(r.response,t,r.inferenceSource)}async function ha(t,e,n,s){return n=Hn(n),t.backend.backendType===M.GOOGLE_AI&&(n=Vn(n)),dt({model:e,task:"generateContent",apiSettings:t,stream:!1,singleRequestOptions:s},JSON.stringify(n))}async function qn(t,e,n,s,i){const r=await jn(n,s,()=>s.generateContent(n),()=>ha(t,e,n,i)),a=await fa(r.response,t);return{response:ge(a,r.inferenceSource)}}async function fa(t,e){const n=await t.json();return e.backend.backendType===M.GOOGLE_AI?ft(n):n}/**
 * @license
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jt="SILENT_ERROR",Gt=10;class ma{constructor(e,n,s){this.params=n,this.requestOptions=s,this._history=[],this._sendPromise=Promise.resolve(),this._apiSettings=e}async getHistory(){return await this._sendPromise,W(this._history).map(e=>({...e,parts:e.parts?e.parts.map($):[]}))}async _sendMessage(e,n){let s={};await this._sendPromise;const i=[];return this._sendPromise=this._sendPromise.then(async()=>{var c,l,u;let r,a=0;const o=((c=this.requestOptions)==null?void 0:c.maxSequentialFunctionCalls)??Gt;do{let p;if(r){a++;const b=await this._callFunctionsAsNeeded(r);p=ie(b)}else p=ie(e);const h=this._formatRequest(p,[...i]);i.push(p);const y=await this._callGenerateContent(h,n);if(y)if(s=y,r=this._getCallableFunctionCalls(y.response),y.response.candidates&&y.response.candidates.length>0){const b={parts:((l=y.response.candidates)==null?void 0:l[0].content.parts)||[],role:((u=y.response.candidates)==null?void 0:u[0].content.role)||"model"};i.push(W(b))}else{const b=q(y.response);b&&w.warn(`sendMessage() was unsuccessful. ${b}. Inspect response object for details.`)}else r=void 0}while(r&&a<o);r&&a>=o&&w.warn(`Automatic function calling exceeded the limit of ${o} function calls. Returning last model response.`)}),await this._sendPromise,this._history=this._history.concat(i),s}async _sendMessageStream(e,n){await this._sendPromise;const s=[],r=(async()=>{var u;let a,o=0;const c=((u=this.requestOptions)==null?void 0:u.maxSequentialFunctionCalls)??Gt;let l;do{let p;if(a){o++;const y=await this._callFunctionsAsNeeded(a);p=ie(y)}else p=ie(e);const h=this._formatRequest(p,[...s]);if(s.push(p),l=await this._callGenerateContentStream(h,n),a=this._getCallableFunctionCalls(l.firstValue),a&&l.firstValue&&l.firstValue.candidates&&l.firstValue.candidates.length>0){const y={...l.firstValue.candidates[0].content};y.role||(y.role="model"),s.push(y)}}while(a&&o<c);return a&&o>=c&&w.warn(`Automatic function calling exceeded the limit of ${c} function calls. Returning last model response.`),{stream:l.stream,response:l.response}})();return this._sendPromise=this._sendPromise.then(async()=>r).catch(a=>{throw new Error(jt)}).then(a=>a.response).then(a=>{if(a.candidates&&a.candidates.length>0){this._history=this._history.concat(s);const o={...a.candidates[0].content};o.role||(o.role="model"),this._history.push(W(o))}else{const o=q(a);o&&w.warn(`sendMessageStream() was unsuccessful. ${o}. Inspect response object for details.`)}}).catch(a=>{a.message!==jt&&a.name!=="AbortError"&&w.error(a)}),r}_getCallableFunctionCalls(e){var i,r,a;const n=(r=(i=this.params)==null?void 0:i.tools)==null?void 0:r.find(o=>o.functionDeclarations);if(!(n!=null&&n.functionDeclarations))return;const s=Fn(e);if(s){for(const o of s)if(!((a=n.functionDeclarations)==null?void 0:a.some(l=>l.name===o.name&&typeof l.functionReference=="function")))return;return s}}async _callFunctionsAsNeeded(e){var r,a;const n=[],s=[],i=(a=(r=this.params)==null?void 0:r.tools)==null?void 0:a.find(o=>o.functionDeclarations);if(i&&i.functionDeclarations){for(const c of e){const l=i.functionDeclarations.find(u=>u.name===c.name);if(l!=null&&l.functionReference){const u=Promise.resolve(l.functionReference(c.args)).catch(p=>{const h=new m(f.ERROR,`Error in user-defined function "${l.name}": ${p.message}`);throw h.stack=p.stack,h});n.push({name:c.name,id:c.id,results:u}),s.push(u)}}await Promise.all(s);const o=[];for(const{name:c,id:l,results:u}of n){const p={name:c,response:await u};l&&(p.id=l),o.push({type:"functionResponse",functionResponse:p})}return o}else throw new m(f.REQUEST_ERROR,'No function declarations were provided in "tools".')}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ga=["text","inlineData","functionCall","functionResponse","thought","thoughtSignature"],ya={user:["text","inlineData","functionResponse"],function:["functionResponse"],model:["text","functionCall","thought","thoughtSignature"],system:["text"]},qt={user:["model"],function:["model"],model:["user","function"],system:[]};function ba(t){let e=null;for(const n of t){const{role:s,parts:i}=n;if(!e&&s!=="user")throw new m(f.INVALID_CONTENT,`First Content should be with role 'user', got ${s}`);if(!Ut.includes(s))throw new m(f.INVALID_CONTENT,`Each item should include role field. Got ${s} but valid roles are: ${JSON.stringify(Ut)}`);if(!Array.isArray(i))throw new m(f.INVALID_CONTENT,"Content should have 'parts' property with an array of Parts");if(i.length===0)throw new m(f.INVALID_CONTENT,"Each Content should have at least one part");const r={text:0,inlineData:0,functionCall:0,functionResponse:0,thought:0,thoughtSignature:0,fileData:0,executableCode:0,codeExecutionResult:0};for(const o of i){if(o.type)r[o.type]+=1;else for(const c of["text","inlineData","functionCall","functionResponse","fileData","executableCode","codeExecutionResult"])c in o&&(r[c]+=1);"thought"in o&&o.thought&&(r.thought+=1),"thoughtSignature"in o&&o.thoughtSignature&&(r.thoughtSignature+=1)}const a=ya[s];for(const o of ga)if(!a.includes(o)&&r[o]>0)throw new m(f.INVALID_CONTENT,`Content with role '${s}' can't contain '${o}' part`);if(e&&!qt[s].includes(e.role))throw new m(f.INVALID_CONTENT,`Content with role '${s}' can't follow '${e.role}'. Valid previous roles: ${JSON.stringify(qt)}`);e=n}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class va extends ma{constructor(e,n,s,i,r){var a;super(e,i,r),this.model=n,this.chromeAdapter=s,this.params=i,this.requestOptions=r,i!=null&&i.history&&(ba(i.history),this._history=W(i.history)),((a=this.params)==null?void 0:a.systemInstruction)!=null&&(this.params={...this.params,systemInstruction:ut(this.params.systemInstruction)})}_formatRequest(e,n){var s,i,r,a,o;return{safetySettings:(s=this.params)==null?void 0:s.safetySettings,generationConfig:(i=this.params)==null?void 0:i.generationConfig,tools:(r=this.params)==null?void 0:r.tools,toolConfig:(a=this.params)==null?void 0:a.toolConfig,systemInstruction:(o=this.params)==null?void 0:o.systemInstruction,contents:[...this._history,...n,e]}}_callGenerateContent(e,n){return qn(this._apiSettings,this.model,e,this.chromeAdapter,{...this.requestOptions,...n})}_callGenerateContentStream(e,n){return Gn(this._apiSettings,this.model,e,this.chromeAdapter,{...this.requestOptions,...n})}async sendMessage(e,n){return this._sendMessage(e,n)}async sendMessageStream(e,n){return this._sendMessageStream(e,n)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ea(t,e,n,s){n=ta(n);let i="";if(t.backend.backendType===M.GOOGLE_AI){const a=na(n,e);i=JSON.stringify(a)}else i=JSON.stringify(n);return(await dt({model:e,task:"countTokens",apiSettings:t,stream:!1,singleRequestOptions:s},i)).json()}async function wa(t,e,n,s,i){if((s==null?void 0:s.mode)===S.ONLY_ON_DEVICE)throw new m(f.UNSUPPORTED,"countTokens() is not supported for on-device models.");return Ea(t,e,n,i)}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ia extends re{constructor(e,n,s,i){super(e,n.model),this.chromeAdapter=i,this.generationConfig=n.generationConfig||{},Sa(this.generationConfig),this.safetySettings=n.safetySettings||[],this.tools=n.tools,this.toolConfig=n.toolConfig,this.systemInstruction=ut(n.systemInstruction),this.requestOptions=s||{}}async initializeDeviceModel(e){if(!this.chromeAdapter||this.chromeAdapter.mode===S.ONLY_IN_CLOUD)return;if(await this.chromeAdapter.downloadIfAvailable(e)===N.UNAVAILABLE){const s=new m(f.API_NOT_ENABLED,"Local LanguageModel API not available in this environment.");if(this.chromeAdapter.mode===S.ONLY_ON_DEVICE)throw s;w.debug(s.message)}await this.chromeAdapter.downloadPromise}async generateContent(e,n){const s=Me(e);return qn(this._apiSettings,this.model,{generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,...s},this.chromeAdapter,{...this.requestOptions,...n})}async generateContentStream(e,n){const s=Me(e),{stream:i,response:r}=await Gn(this._apiSettings,this.model,{generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,...s},this.chromeAdapter,{...this.requestOptions,...n});return{stream:i,response:r}}startChat(e){return new va(this._apiSettings,this.model,this.chromeAdapter,{tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,generationConfig:this.generationConfig,safetySettings:this.safetySettings,...e},this.requestOptions)}async countTokens(e,n){const s=Me(e);return wa(this._apiSettings,this.model,s,this.chromeAdapter,{...this.requestOptions,...n})}}function Sa(t){var e,n;if(((e=t.thinkingConfig)==null?void 0:e.thinkingBudget)!=null&&((n=t.thinkingConfig)!=null&&n.thinkingLevel))throw new m(f.UNSUPPORTED,"Cannot set both thinkingBudget and thinkingLevel in a config.");if(t.responseSchema!=null&&t.responseJsonSchema!=null)throw new m(f.UNSUPPORTED,"Cannot set both responseSchema and responseJsonSchema in a config.");if((t.responseSchema!=null||t.responseJsonSchema!=null)&&t.responseMimeType!=="application/json"&&t.responseMimeType!=="text/x.enum")throw new m(f.UNSUPPORTED,'responseMimeType must be set to "application/json" or "text/x.enum" if responseSchema or responseJsonSchema are set.')}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Aa(t=vn(),e){t=fn(t);const n=yn(t,ee),s=(e==null?void 0:e.backend)??new Ee,i=Ur(s),r=n.getImmediate({identifier:i}),a=r.options;if(a){const o=e==null?void 0:e.useLimitedUseAppCheckTokens,c=!!a.useLimitedUseAppCheckTokens;if(o!=null&&!!o!==c)throw new m(f.ALREADY_INITIALIZED,`getAI() has already been called for app "${t.name}" and this backend with useLimitedUseAppCheckTokens: ${c}. This option cannot be changed after the AI instance has been initialized. Pass the desired options to the first getAI() call for this app and backend, or omit useLimitedUseAppCheckTokens to reuse the existing instance.`);return r}return r.options={useLimitedUseAppCheckTokens:(e==null?void 0:e.useLimitedUseAppCheckTokens)??!1},r}const Ta=["mode","onDeviceParams","inCloudParams"];function Wt(t,e,n){var o;const s=e;let i;if(s.mode){for(const c of Object.keys(e))Ta.includes(c)||w.warn(`When a hybrid inference mode is specified (mode is currently set to ${s.mode}), "${c}" cannot be configured at the top level. Configuration for in-cloud and on-device must be done separately in inCloudParams and onDeviceParams. Configuration values set outside of inCloudParams and onDeviceParams will be ignored.`);i=s.inCloudParams||{model:Br}}else i=e;if(!i.model)throw new m(f.NO_MODEL,"Must provide a model name. Example: getGenerativeModel({ model: 'my-model-name' })");const r=(o=t.chromeAdapterFactory)==null?void 0:o.call(t,s.mode,typeof window>"u"?void 0:window,s.onDeviceParams),a=new Ia(t,i,n,r);return a._apiSettings.inferenceMode=s.mode,a}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ra(){Z(new K(ee,Gr,"PUBLIC").setMultipleInstances(!0)),z(Ft,Qe),z(Ft,Qe,"esm2020")}Ra();const Wn={apiKey:"AIzaSyDTRSNOTm_Zff4qR9RU9KsWNjUB52ku1kw",authDomain:"proofgate-f1e4d.firebaseapp.com",projectId:"proofgate-f1e4d",storageBucket:"proofgate-f1e4d.firebasestorage.app",messagingSenderId:"639820381603",appId:"1:639820381603:web:671e5939afbfd3489f2e16"},_a="9e831732-efd4-481c-85b9-9e9be7db5fb9",Ca="gemini-3.8-flash";function ka(t){return!!(t&&typeof t.apiKey=="string"&&t.apiKey.length>0&&typeof t.projectId=="string"&&t.projectId.length>0&&typeof t.appId=="string"&&t.appId.length>0)}const se=Ca,Oa="gemini-nano (on-device, via Firebase AI Logic)",$a=3e4;function Da(t=Wn){return ka(t)?{configured:!0,mode:"firebase",detail:"Firebase configured. Model pass runs through Firebase AI Logic hybrid inference (on-device Gemini Nano preferred, cloud escalation when needed)."}:{configured:!1,mode:"mock",detail:"Demo mode (mock): Firebase is not configured, so the model pass is the local deterministic mock. Deterministic checks are fully real."}}function zt(t){return["You are the model pass inside ProofGate, a claim-verification tool.","Deterministic code has already checked this claim's numbers, dates, units and citations.","Your job is only to judge whether the claim's wording is supported, contradicted, or uncertain on its face.","Respond with a single JSON object and nothing else:",'{"label": "supports" | "contradicts" | "uncertain" | "not-applicable", "confidence": <number 0..1>, "rationale": "<one short sentence>"}',"",`Claim: ${t}`].join(`
`)}const Na=new Set(["supports","contradicts","uncertain","not-applicable"]);function Kt(t,e,n,s){const i=p=>({claimId:e,label:"uncertain",confidence:0,rationale:`Model response could not be used (${p}); recorded as uncertain.`,source:n,modelId:s});let r=t.trim();const a=r.match(/```(?:json)?\s*([\s\S]*?)```/);a&&(r=a[1].trim());const o=r.indexOf("{"),c=r.lastIndexOf("}");if(o===-1||c<=o)return i("no JSON object found");let l;try{l=JSON.parse(r.slice(o,c+1))}catch{return i("invalid JSON")}if(typeof l!="object"||l===null)return i("JSON was not an object");const u=l;return typeof u.label!="string"||!Na.has(u.label)?i("missing or invalid label"):typeof u.confidence!="number"||!Number.isFinite(u.confidence)?i("missing or invalid confidence"):{claimId:e,label:u.label,confidence:Math.min(1,Math.max(0,u.confidence)),rationale:typeof u.rationale=="string"?u.rationale:"",source:n,modelId:s}}function La(t){return[...Jt(t),...Qt(t),...en(t),...tn(t)].some(n=>n.status==="warn")}function ye(t){return t instanceof Error?t.message:String(t)}const Yt=new WeakSet;function Pa(t,e=_a){if(typeof globalThis.window>"u")return{outcome:"skipped-not-browser",detail:"App Check is only initialised in the browser build; this environment has no window."};if(!e)return{outcome:"skipped-no-debug-token",detail:"No App Check debug token is configured, so App Check was not initialised."};if(Yt.has(t))return{outcome:"already-initialized",detail:"App Check initialisation was already attempted for this Firebase app."};Yt.add(t);try{return globalThis.FIREBASE_APPCHECK_DEBUG_TOKEN=e,Or(t,{provider:new lt({getToken:()=>Promise.reject(new Error("ProofGate demo: App Check exchanges the registered debug token; no attestation provider is configured."))}),isTokenAutoRefreshEnabled:!0}),{outcome:"initialized",detail:"App Check initialised with the registered debug token for the public demo."}}catch(n){return{outcome:"failed",detail:`App Check failed to initialise: ${ye(n)}`}}}class Ma{constructor(e,n={}){D(this,"name","firebase-ai-logic");D(this,"app");D(this,"ai");D(this,"callTimeoutMs");D(this,"appCheckInit");this.app=$t().length>0?$t()[0]:bn(e),this.appCheckInit=Pa(this.app),this.ai=Aa(this.app,{backend:new Ee}),this.callTimeoutMs=n.callTimeoutMs??$a}async analyze(e){if(sn(e,La(e)).tier==="cloud")return this.callCloud(e);try{const s=Wt(this.ai,{mode:S.PREFER_ON_DEVICE,inCloudParams:{model:se}}),i=await Ve(s.generateContent(zt(e.text)),this.callTimeoutMs,"Firebase AI Logic on-device generateContent"),r=i.response.inferenceSource==="in_cloud",a=r?"cloud":"on-device";return Kt(i.response.text(),e.id,a,r?se:Oa)}catch(s){const i=await this.callCloud(e);return{...i,rationale:`On-device pass unavailable (${ye(s)}); escalated to cloud. ${i.rationale}`}}}async callCloud(e){try{const n=Wt(this.ai,{mode:S.ONLY_IN_CLOUD,inCloudParams:{model:se}}),s=await Ve(n.generateContent(zt(e.text)),this.callTimeoutMs,"Firebase AI Logic cloud generateContent");return Kt(s.response.text(),e.id,"cloud",se)}catch(n){return nn(e.id,"cloud",se,an(n)?`cloud model call timed out after ${this.callTimeoutMs} ms`:`cloud model call failed: ${ye(n)}`)}}}function xa(t=Wn,e={}){const n=Da(t);if(n.mode==="firebase"&&t)try{return{adapter:new Ma(t,e),status:n}}catch(s){return{adapter:new He,status:{configured:!0,mode:"mock",detail:`Demo mode (mock): Firebase is configured but failed to initialise (${ye(s)}), so the local deterministic mock is running instead.`}}}return{adapter:new He,status:n}}const{adapter:zn,status:Q}=xa(),Fa="/proofgate/logo-lockup.png",d={screen:"new",sourceType:"Invoice",inputText:"",running:!1,error:null,pipeline:["pending","pending","pending","pending","pending"],currentReport:null,currentSourceType:"Invoice",reportReplay:null,history:be(window.localStorage),historyQuery:"",historyVerdict:"ALL",historySource:"ALL",historyDays:void 0,historyReplay:null},Kn=["Split into atomic claims","Deterministic checks","On-device Gemini Nano first pass","Escalate to cloud Gemini only when needed","Generate Proof Report"],Ba={arithmetic:"Arithmetic",dates:"Dates",units:"Units",citations:"Citations","numeric-consistency":"Numbers"};function g(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Yn(t){const e=new Date(t);return Number.isNaN(e.getTime())?t:e.toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})}function Ua(t){const e=new Date(t);return Number.isNaN(e.getTime())?t:`${Yn(t)}, ${e.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"})}`}function mt(t){return`<span class="chip ${t==="PASS"?"chip-pass":t==="FAIL"?"chip-fail":"chip-review"}">${t==="PASS"?"✓":t==="FAIL"?"✕":"⚠"} ${g(t)}</span>`}function Ha(t){switch(t){case"pass":return'<span class="chip chip-pass">Pass</span>';case"fail":return'<span class="chip chip-fail">Fail</span>';case"warn":return'<span class="chip chip-review">Needs review</span>';default:return'<span class="chip chip-neutral">N/A</span>'}}function Jn(t){const e=Number.parseInt(t.replace(/\D/g,""),10);return`Claim C-${Number.isNaN(e)?t:String(e).padStart(2,"0")}`}function V(t){const e=document.querySelector(t);if(!e)throw new Error(`Missing element: ${t}`);return e}function gt(t){return t instanceof Error?t.message:String(t)}function Xn(){return d.error?`<div class="error-banner" role="alert"><strong>Something went wrong.</strong> ${g(d.error)}</div>`:""}async function Va(){const t=d.inputText;if(!t.trim()||d.running)return;d.running=!0,d.error=null,d.pipeline=["in-progress","pending","pending","pending","pending"],T();let e=0,n=0;const s=i=>{i.type==="split"?(d.pipeline[0]="done",d.pipeline[1]="in-progress"):i.type==="checks-complete"?(e=i.onDeviceClaims,n=i.cloudClaims,d.pipeline[1]="done",d.pipeline[2]=e>0?"in-progress":"done",d.pipeline[3]=n>0?e>0?"pending":"in-progress":"done",e===0&&n===0&&(d.pipeline[4]="in-progress")):i.type==="model-claim-complete"?i.tier==="on-device"?(e=Math.max(0,e-1),e===0&&(d.pipeline[2]="done",n>0&&(d.pipeline[3]="in-progress"))):i.tier==="cloud"&&(n=Math.max(0,n-1),n===0&&(d.pipeline[3]="done")):i.type==="model-complete"&&(d.pipeline[2]="done",d.pipeline[3]="done",d.pipeline[4]="in-progress"),Ka()};try{const i=await on(t,{adapter:zn,onProgress:s});d.pipeline=Kn.map(()=>"done"),d.currentReport=i,d.currentSourceType=d.sourceType,d.reportReplay=null;try{d.history=_s(window.localStorage,i,d.sourceType,new Date().toISOString())}catch{}d.screen="report"}catch(i){d.error=`Verification failed: ${gt(i)}`,d.pipeline=["pending","pending","pending","pending","pending"]}finally{d.running=!1}Y()}async function Qn(t){const e=await on(t.inputText,{adapter:zn});return Ds(t,e)}function Zn(t,e){try{const n=d.history.find(s=>s.key===t.contentHash);if(!n)return;d.history=Cs(window.localStorage,n.key,{replayCount:n.replayCount+1,lastReplayAt:new Date().toISOString(),lastReplayMatches:e.matches})}catch{}}async function ja(){if(!(!d.currentReport||d.running)){d.running=!0,d.error=null,T();try{const t=await Qn(d.currentReport);d.reportReplay=t,Zn(d.currentReport,t)}catch(t){d.error=`Replay failed: ${gt(t)}`}finally{d.running=!1}Y()}}async function Ga(t){if(!d.running){d.running=!0,d.error=null,T();try{const e=await Qn(t.report);d.historyReplay={key:t.key,title:t.title,comparison:e},Zn(t.report,e)}catch(e){d.error=`Replay failed: ${gt(e)}`}finally{d.running=!1}Y()}}function qa(t){const e=new Blob([JSON.stringify(t,null,2)],{type:"application/json"}),n=URL.createObjectURL(e),s=document.createElement("a");s.href=n,s.download=`proofgate-report-${t.id}.json`,s.click(),URL.revokeObjectURL(n)}function Y(){const t=V("#app");t.innerHTML=`
    <header class="topbar">
      <img class="lockup" src="${Fa}" alt="ProofGate" />
      <div class="spacer"></div>
      ${Q.mode==="mock"?'<span class="chip chip-review">Demo mode (mock model)</span>':'<span class="chip chip-pass">Firebase AI Logic configured</span>'}
    </header>
    <nav class="sidebar">
      <button class="nav-item ${d.screen==="new"?"active":""}" data-nav="new">▣&nbsp; New Verification</button>
      <button class="nav-item ${d.screen==="report"?"active":""}" data-nav="report">▥&nbsp; Reports</button>
      <button class="nav-item ${d.screen==="history"?"active":""}" data-nav="history">◷&nbsp; History &amp; Replay</button>
      <div class="side-note">Verify before you trust.<br />Deterministic checks first, models second, a deterministic gate decides.</div>
    </nav>
    <main class="content"><div class="content-inner" id="screen"></div></main>
  `,t.querySelectorAll("[data-nav]").forEach(e=>{e.addEventListener("click",()=>{d.screen=e.dataset.nav,Y()})}),T()}function T(){const t=document.querySelector("#screen");t&&(d.screen==="new"?Ya(t):d.screen==="report"?Qa(t):eo(t))}function Wa(){const t=e=>e==="done"?'<span class="status-tag green">Done</span>':e==="in-progress"?'<span class="status-tag blue">In progress</span>':'<span class="status-tag">Pending</span>';return Kn.map((e,n)=>{const s=d.pipeline[n];return`<li class="${s==="done"?"done":s==="in-progress"?"in-progress":""}">
      <span class="dot">${s==="done"?"✓":""}</span>
      <span class="step-name">${n+1}. ${g(e)}</span>${t(s)}
    </li>`}).join("")}function za(){return`
    <div class="runtime-row">
      <div class="grow">
        <div class="rt-title">On-device Gemini Nano</div>
        <div class="rt-sub">Private first pass via Firebase AI Logic hybrid inference</div>
      </div>
      ${Q.mode==="mock"?'<span class="status-tag amber">Demo mode (mock)</span>':'<span class="status-tag blue">Configured</span>'}
    </div>
    <div class="runtime-row">
      <div class="grow">
        <div class="rt-title">Cloud escalation</div>
        <div class="rt-sub">Triggered only for unresolved or high-stakes claims</div>
      </div>
      <span class="status-tag">On demand</span>
    </div>
    <p class="small muted" style="margin:12px 0 0">${g(Q.detail)}</p>
  `}function es(){const t=d.currentReport;return`
    <div class="card">
      <h3 style="margin-bottom:12px">Verification Pipeline</h3>
      <ol class="pipeline">${Wa()}</ol>
    </div>
    <div class="card">
      <h3 style="margin-bottom:12px">Runtime Indicators</h3>
      ${za()}
    </div>
    <div class="card">
      <h3 style="margin-bottom:12px">Expected Output</h3>
      ${t?`<div class="verdict-counts" style="margin-bottom:8px">
               ${mt(t.summary.overallVerdict)}
               <span class="chip chip-pass">Pass ${t.summary.pass}</span>
               <span class="chip chip-review">Review ${t.summary.needsReview}</span>
               <span class="chip chip-fail">Fail ${t.summary.fail}</span>
             </div>
             <p class="small muted" style="margin:0">Latest run: ${g(Ze(t))}. Open the Reports tab for the full Proof Report.</p>`:'<p class="small muted" style="margin:0">A Proof Report with a verdict and evidence for every claim: PASS, NEEDS REVIEW, or FAIL, sealed with a SHA-256 content hash so it can be replayed and re-verified.</p>'}
    </div>
  `}function Ka(){const t=document.querySelector("#side-panel");t&&(t.innerHTML=es())}function Ya(t){const e=xe(d.inputText).length;t.innerHTML=`
    <div class="page-head">
      <h1>New Verification</h1>
      <p>Paste content to extract claims and verify before you trust.</p>
    </div>
    ${Xn()}
    ${Q.mode==="mock"?`<div class="demo-banner"><strong>Demo mode (mock model).</strong> ${g(Q.detail)}</div>`:`<div class="firebase-banner">${g(Q.detail)}</div>`}
    <div class="card" style="margin-bottom:16px">
      <div class="progress-row">
        <strong class="small">Claim splitting progress</strong>
        <div class="progress-track"><div class="progress-fill" id="claim-progress" style="width:${e>0?100:0}%"></div></div>
        <span class="small muted" id="claim-count">${e} claims extracted</span>
      </div>
    </div>
    <div class="grid-main">
      <div class="card">
        <h3 style="margin-bottom:16px">Input Content</h3>
        <div class="segmented" role="tablist" aria-label="Source type">
          ${cn.map(s=>`<button class="seg-btn ${s===d.sourceType?"active":""}" data-source="${g(s)}">${g(s)}</button>`).join("")}
        </div>
        <textarea class="input-area" id="input-area" placeholder="Paste an AI answer, quote, invoice, or announcement to verify its claims…">${g(d.inputText)}</textarea>
        <p class="small faint" style="margin:8px 0 0">ProofGate will split this into atomic claims and run deterministic checks first.</p>
        <div class="input-actions">
          <button class="btn" id="btn-clear">Clear</button>
          <button class="btn" id="btn-sample">Load sample</button>
          <div class="spacer"></div>
          <button class="btn btn-primary" id="btn-verify" ${d.running?"disabled":""}>${d.running?"Verifying…":"Verify"}</button>
        </div>
      </div>
      <aside id="side-panel">${es()}</aside>
    </div>
  `,t.querySelectorAll("[data-source]").forEach(s=>{s.addEventListener("click",()=>{d.sourceType=s.dataset.source,T()})});const n=V("#input-area");n.addEventListener("input",()=>{d.inputText=n.value;const s=xe(n.value).length,i=document.querySelector("#claim-count");i&&(i.textContent=`${s} claims extracted`);const r=document.querySelector("#claim-progress");r&&(r.style.width=s>0?"100%":"0%")}),V("#btn-clear").addEventListener("click",()=>{d.inputText="",T()}),V("#btn-sample").addEventListener("click",()=>{d.inputText=As[d.sourceType],T()}),V("#btn-verify").addEventListener("click",()=>{Va()})}function Ja(t){const e=Object.entries(t);if(e.length===0)return"";const n=e.map(([s,i])=>`${s}: ${JSON.stringify(i)}`).join(" · ");return`<div class="kv">${g(n)}</div>`}function Xa(t){const e=t.modelOutput,n=t.checks.map(s=>`<div class="check-row">
        <div class="check-main">
          <span class="check-label">${g(Ba[s.validator]??s.validator)}:</span>
          ${g(s.detail)}
          ${s.status==="fail"||s.status==="warn"?Ja(s.evidence):""}
        </div>
        ${Ha(s.status)}
      </div>`).join("");return`
    <div class="card claim-card">
      <div class="claim-head">
        <span class="chip chip-tint">${g(Jn(t.claim.id))}</span>
        <span class="claim-text">${g(t.claim.text)}</span>
        ${mt(t.verdict)}
      </div>
      <div class="claim-body">
        <div class="evidence-box">
          <h4>Evidence</h4>
          <ul>${t.reasons.map(s=>`<li>${g(s)}</li>`).join("")}</ul>
          ${e?`<p style="margin:12px 0 0"><strong>Model pass</strong> (${g(e.source)} · ${g(e.modelId)})${e.failure?' <span class="chip chip-fail">Unavailable</span>':""}: ${g(e.label)}, confidence ${e.confidence.toFixed(2)}.<br />${g(e.rationale)}</p>`:'<p style="margin:12px 0 0"><strong>Model pass:</strong> not run for this claim (deterministic-only routing).</p>'}
        </div>
        <div class="checks-box">
          <h4>Deterministic checks</h4>
          ${n}
        </div>
      </div>
    </div>
  `}function ts(t){if(t.matches)return`<div class="replay-result ok"><strong>Replay matched.</strong> Re-running the pipeline reproduced every verdict (overall ${g(t.replayOverall)}).</div>`;const e=t.claims.filter(n=>n.changed);return`<div class="replay-result diff"><strong>Replay differs on ${t.changedCount} claim(s).</strong>
    <ul>${e.map(n=>`<li>${g(Jn(n.claimId))}: ${g(n.originalVerdict)} → ${g(n.replayVerdict??"missing")} — ${g(n.claimText)}</li>`).join("")}</ul></div>`}function Qa(t){const e=d.currentReport;if(!e){t.innerHTML=`
      <div class="page-head"><h1>Proof Report</h1><p>Replayable verification results for the submitted content.</p></div>
      <div class="card empty-state">
        <h3>No report yet</h3>
        <p>Run a verification first, and its Proof Report will appear here.</p>
        <button class="btn btn-primary" id="go-new">Start a verification</button>
      </div>`,V("#go-new").addEventListener("click",()=>{d.screen="new",Y()});return}const n=Es(e);t.innerHTML=`
    <div class="page-head">
      <h1>Proof Report</h1>
      <p>Replayable verification results for the submitted content.</p>
    </div>
    ${Xn()}
    <div class="card">
      <div class="report-meta">
        <div><h3>${g(Ze(e))}</h3></div>
        <div class="meta-block"><div class="caption">Source</div><span class="chip chip-outline">${g(d.currentSourceType)}</span></div>
        <div class="meta-block"><div class="caption">Created</div><span class="small">${g(Ua(e.createdAt))}</span></div>
        <div class="meta-block"><div class="caption">Processing mode</div><span class="small">${g(Ns(e))}</span></div>
        <div class="spacer"></div>
        <button class="btn btn-small" id="btn-export">Export JSON</button>
        <button class="btn btn-primary btn-small" id="btn-replay" ${d.running?"disabled":""}>${d.running?"Replaying…":"Replay report"}</button>
      </div>
      <div style="margin-top:16px; display:flex; gap:8px; flex-wrap:wrap">
        <span class="chip chip-pass">✓ Report complete</span>
        ${mt(e.summary.overallVerdict)}
        <span class="chip ${n?"chip-tint":"chip-fail"}">${n?"Seal verified (SHA-256)":"Seal broken"}</span>
        <span class="chip chip-outline mono">${g(e.id)}</span>
      </div>
      <div class="small muted mono" style="margin-top:10px; word-break:break-all">Content hash (SHA-256): ${g(e.contentHash)}</div>
      <div class="summary-grid">
        <div class="summary-card pass"><span class="chip chip-pass">✓ Pass</span><div class="count">${e.summary.pass} claims</div></div>
        <div class="summary-card review"><span class="chip chip-review">⚠ Needs review</span><div class="count">${e.summary.needsReview} claims</div></div>
        <div class="summary-card fail"><span class="chip chip-fail">✕ Fail</span><div class="count">${e.summary.fail} claims</div></div>
      </div>
      ${d.reportReplay?ts(d.reportReplay):""}
    </div>
    ${e.claims.map(Xa).join("")}
  `,V("#btn-export").addEventListener("click",()=>qa(e)),V("#btn-replay").addEventListener("click",()=>{ja()})}function Za(t){return t==="PASS"?'<span class="chip chip-pass">Complete</span>':t==="FAIL"?'<span class="chip chip-fail">Failed</span>':'<span class="chip chip-review">Needs Review</span>'}function eo(t){var r,a,o;const e=$s(d.history,new Date().toISOString()),n=Os(d.history,{query:d.historyQuery,verdict:d.historyVerdict,sourceType:d.historySource,withinDays:d.historyDays,now:new Date().toISOString()}),s=n.map(c=>{var u;const l=c.report.summary;return`<tr>
        <td>
          <div class="row-title">${g(c.title)}</div>
          <div class="row-sub">${g(((u=c.report.claims[0])==null?void 0:u.claim.text)??"")}</div>
          ${c.replayCount>0?`<div class="row-sub">Replayed ${c.replayCount}× · last replay ${c.lastReplayMatches?"matched":"differed"}</div>`:""}
        </td>
        <td><span class="chip chip-outline">${g(c.sourceType)}</span></td>
        <td>${g(Yn(c.savedAt))}</td>
        <td><div class="verdict-counts">
          <span class="chip chip-pass">Pass ${l.pass}</span>
          <span class="chip chip-review">Review ${l.needsReview}</span>
          <span class="chip chip-fail">Fail ${l.fail}</span>
        </div></td>
        <td>${Za(l.overallVerdict)}</td>
        <td><div class="row-actions">
          <button class="btn btn-small" data-view="${g(c.key)}">View</button>
          <button class="btn btn-small" data-replay="${g(c.key)}" ${d.running?"disabled":""}>▶ Replay</button>
          <button class="btn btn-small" data-delete="${g(c.key)}">Delete</button>
        </div></td>
      </tr>`}).join("");t.innerHTML=`
    <div class="page-head">
      <h1>History &amp; Replay</h1>
      <p>Search, filter, and rerun previous Proof Reports.</p>
    </div>
    <div class="card">
      <h3 style="margin-bottom:16px">Recent activity</h3>
      <div class="stats-row">
        <div class="stat-cell"><div class="stat-icon">▥</div><div><div class="stat-num">${e.reportsLast30Days}</div><div class="stat-label">Reports (last 30 days)</div></div></div>
        <div class="stat-cell"><div class="stat-icon">▶</div><div><div class="stat-num">${e.replaysRun}</div><div class="stat-label">Replays run</div></div></div>
        <div class="stat-cell"><div class="stat-icon">✓</div><div><div class="stat-num">${e.reportsPassed}</div><div class="stat-label">Reports passed (all claims)</div></div></div>
      </div>
      <div class="filter-row">
        <input type="search" id="history-search" placeholder="Search reports by title, claim, or source" value="${g(d.historyQuery)}" />
        <select id="history-verdict">
          <option value="ALL" ${d.historyVerdict==="ALL"?"selected":""}>All verdicts</option>
          <option value="PASS" ${d.historyVerdict==="PASS"?"selected":""}>PASS</option>
          <option value="NEEDS REVIEW" ${d.historyVerdict==="NEEDS REVIEW"?"selected":""}>NEEDS REVIEW</option>
          <option value="FAIL" ${d.historyVerdict==="FAIL"?"selected":""}>FAIL</option>
        </select>
        <select id="history-source">
          <option value="ALL" ${d.historySource==="ALL"?"selected":""}>All source types</option>
          ${cn.map(c=>`<option value="${g(c)}" ${d.historySource===c?"selected":""}>${g(c)}</option>`).join("")}
        </select>
        <select id="history-days">
          <option value="all" ${d.historyDays===void 0?"selected":""}>All time</option>
          <option value="7" ${d.historyDays===7?"selected":""}>Last 7 days</option>
          <option value="30" ${d.historyDays===30?"selected":""}>Last 30 days</option>
        </select>
        <div class="spacer"></div>
        <span class="chip chip-tint">${n.length} reports</span>
      </div>
    </div>
    ${d.historyReplay?`<div class="card"><h3 style="margin-bottom:8px">Replay — ${g(d.historyReplay.title)}</h3>${ts(d.historyReplay.comparison)}</div>`:""}
    <div class="card">
      ${d.history.length===0?'<div class="empty-state"><h3>No reports in history</h3><p>Reports you generate are stored locally in this browser and listed here.</p></div>':n.length===0?'<div class="empty-state"><h3>No reports match the current filters</h3><p>Try a different search or filter.</p></div>':`<table class="history-table">
                <thead><tr><th>Report title</th><th>Source type</th><th>Date</th><th>Verdict (claims)</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>${s}</tbody>
              </table>`}
    </div>
  `;const i=t.querySelector("#history-search");i==null||i.addEventListener("input",()=>{d.historyQuery=i.value,T();const c=document.querySelector("#history-search");c==null||c.focus(),c==null||c.setSelectionRange(c.value.length,c.value.length)}),(r=t.querySelector("#history-verdict"))==null||r.addEventListener("change",c=>{d.historyVerdict=c.target.value,T()}),(a=t.querySelector("#history-source"))==null||a.addEventListener("change",c=>{d.historySource=c.target.value,T()}),(o=t.querySelector("#history-days"))==null||o.addEventListener("change",c=>{const l=c.target.value;d.historyDays=l==="all"?void 0:Number.parseInt(l,10),T()}),t.querySelectorAll("[data-view]").forEach(c=>{c.addEventListener("click",()=>{const l=d.history.find(u=>u.key===c.dataset.view);l&&(d.currentReport=l.report,d.currentSourceType=l.sourceType,d.reportReplay=null,d.screen="report",Y())})}),t.querySelectorAll("[data-replay]").forEach(c=>{c.addEventListener("click",()=>{const l=d.history.find(u=>u.key===c.dataset.replay);l&&Ga(l)})}),t.querySelectorAll("[data-delete]").forEach(c=>{c.addEventListener("click",()=>{d.history=ks(window.localStorage,c.dataset.delete),T()})})}Y();
