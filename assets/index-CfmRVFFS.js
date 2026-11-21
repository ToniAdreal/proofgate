var gn=Object.defineProperty;var yn=(t,e,n)=>e in t?gn(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var Y=(t,e,n)=>yn(t,typeof e!="symbol"?e+"":e,n);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function n(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(i){if(i.ep)return;i.ep=!0;const a=n(i);fetch(i.href,a)}})();function Ae(t){const e=[];let n=0;const s=i=>{const a=i.trim();if(a.length===0)return;const r=t.indexOf(a,n),o=r>=0?[r,r+a.length]:[n,n+a.length];r>=0&&(n=r+a.length),e.push({id:`c${e.length+1}`,index:e.length,text:a,span:o})};for(const i of t.split(/\r?\n/)){if(i.trim().length===0)continue;const a=i.split(new RegExp(`(?<=[.!?;])\\s+(?=[A-Z0-9"“'(])`));for(const r of a)s(r)}return e}function O(t){const e=t.replace(/[$,%\s]/g,"").replace(/,/g,"").replace(/\.$/,"");if(e===""||!/^-?\d+(\.\d+)?$/.test(e))return null;const n=Number(e);return Number.isFinite(n)?n:null}const bn=.01;function me(t,e){return Math.abs(t-e)<=bn}function St(t){const e=[],n=t.text,s=/(-?[\d][\d,]*\.?\d*)\s*([+\-*/x×])\s*(-?[\d][\d,]*\.?\d*)\s*=\s*\$?(-?[\d][\d,]*\.?\d*)/g;let i;for(;(i=s.exec(n))!==null;){const o=O(i[1]),c=O(i[3]),l=O(i[4]),u=i[2];if(o===null||c===null||l===null)continue;let p=null;if(u==="+"?p=o+c:u==="-"?p=o-c:u==="*"||u==="x"||u==="×"?p=o*c:u==="/"&&(p=c===0?null:o/c),p===null)continue;const m=me(p,l);e.push({validator:"arithmetic",claimId:t.id,status:m?"pass":"fail",detail:m?`Equation ${o} ${u} ${c} = ${l} recomputes correctly.`:`Equation ${o} ${u} ${c} stated as ${l}, recomputed value is ${G(p)}.`,evidence:{kind:"equation",a:o,op:u,b:c,stated:l,expected:G(p)}})}const a=/(\d+(?:\.\d+)?)\s*(?:units?|items?|pcs|pieces)?\s*(?:at|x|×|@)\s*\$?([\d][\d,]*\.?\d*)\s*(?:each\s*)?=\s*\$?([\d][\d,]*\.?\d*)/gi;for(;(i=a.exec(n))!==null;){const o=O(i[1]),c=O(i[2]),l=O(i[3]);if(o===null||c===null||l===null||e.some(m=>m.evidence.kind==="equation"&&m.evidence.stated===l))continue;const u=o*c,p=me(u,l);e.push({validator:"arithmetic",claimId:t.id,status:p?"pass":"fail",detail:p?`Line total ${o} × ${c} = ${l} recomputes correctly.`:`Line total ${o} × ${c} stated as ${l}, recomputed value is ${G(u)}.`,evidence:{kind:"line-total",qty:o,price:c,stated:l,expected:G(u)}})}const r=/(\d+(?:\.\d+)?)%\s*of\s*\$?([\d][\d,]*\.?\d*)\s*=\s*\$?([\d][\d,]*\.?\d*)/gi;for(;(i=r.exec(n))!==null;){const o=O(i[1]),c=O(i[2]),l=O(i[3]);if(o===null||c===null||l===null)continue;const u=o/100*c,p=me(u,l);e.push({validator:"arithmetic",claimId:t.id,status:p?"pass":"fail",detail:p?`${o}% of ${c} = ${l} recomputes correctly.`:`${o}% of ${c} stated as ${l}, recomputed value is ${G(u)}.`,evidence:{kind:"percent-of",pct:o,base:c,stated:l,expected:G(u)}})}return e.length===0&&e.push({validator:"arithmetic",claimId:t.id,status:"skip",detail:"No recomputable arithmetic found in this claim.",evidence:{}}),e}function G(t){return Math.round(t*100)/100}const vn={january:0,february:1,march:2,april:3,may:4,june:5,july:6,august:7,september:8,october:9,november:10,december:11,jan:0,feb:1,mar:2,apr:3,jun:5,jul:6,aug:7,sep:8,sept:8,oct:9,nov:10,dec:11},Ye=["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];function It(t){const e=[],n=/\b(\d{4})-(\d{2})-(\d{2})\b/g;let s;for(;(s=n.exec(t))!==null;)e.push(ge(s[0],Number(s[1]),Number(s[2])-1,Number(s[3])));const i=/\b(\d{1,2})\/(\d{1,2})\/(\d{4})\b/g;for(;(s=i.exec(t))!==null;)e.push(ge(s[0],Number(s[3]),Number(s[1])-1,Number(s[2])));const a=/\b(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.?\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})\b/gi;for(;(s=a.exec(t))!==null;){const r=vn[s[1].toLowerCase()];r!==void 0&&e.push(ge(s[0],Number(s[3]),r,Number(s[2])))}return e}function ge(t,e,n,s){if(e<1900||e>2100)return{raw:t,date:null,valid:!1,reason:`Year ${e} is outside the sane range 1900-2100.`};if(n<0||n>11)return{raw:t,date:null,valid:!1,reason:`Month index ${n+1} is invalid.`};const i=new Date(Date.UTC(e,n,s));return i.getUTCFullYear()!==e||i.getUTCMonth()!==n||i.getUTCDate()!==s?{raw:t,date:null,valid:!1,reason:`${t} is not a real calendar date.`}:{raw:t,date:i,valid:!0}}function Rt(t){const e=It(t.text);if(e.length===0)return[{validator:"dates",claimId:t.id,status:"skip",detail:"No dates found in this claim.",evidence:{}}];const n=[];for(const s of e){if(!s.valid){n.push({validator:"dates",claimId:t.id,status:"fail",detail:s.reason??`Date "${s.raw}" is invalid.`,evidence:{raw:s.raw}});continue}const i=t.text.toLowerCase(),a=Ye.find(r=>i.includes(r));if(a&&s.date){const r=Ye[s.date.getUTCDay()];if(r!==a){n.push({validator:"dates",claimId:t.id,status:"fail",detail:`Claim says ${a} but ${s.raw} falls on a ${r}.`,evidence:{raw:s.raw,claimedWeekday:a,actualWeekday:r}});continue}}n.push({validator:"dates",claimId:t.id,status:"pass",detail:`Date "${s.raw}" is a real calendar date.`,evidence:{raw:s.raw,iso:s.date.toISOString().slice(0,10)}})}return n}function En(t){const e=[];let n=null,s=null;for(const i of t){const a=i.text.toLowerCase(),r=It(i.text).filter(o=>o.valid&&o.date);r.length!==0&&(/(invoice date|issued|issue date|date issued)/.test(a)&&!n&&(n={claim:i,fd:r[0]}),/(due date|due on|payment due|payable by)/.test(a)&&!s&&(s={claim:i,fd:r[0]}))}return n&&s&&n.fd.date&&s.fd.date&&(s.fd.date.getTime()<n.fd.date.getTime()?e.push({validator:"dates",claimId:s.claim.id,status:"fail",detail:`Due date ${s.fd.raw} is before the invoice/issue date ${n.fd.raw}.`,evidence:{kind:"ordering",issueDate:n.fd.date.toISOString().slice(0,10),dueDate:s.fd.date.toISOString().slice(0,10)}}):e.push({validator:"dates",claimId:s.claim.id,status:"pass",detail:`Due date ${s.fd.raw} is on or after the issue date ${n.fd.raw}.`,evidence:{kind:"ordering",issueDate:n.fd.date.toISOString().slice(0,10),dueDate:s.fd.date.toISOString().slice(0,10)}})),e}const _t=[{dimension:"length",toBase:1,aliases:["m","meter","meters","metre","metres"]},{dimension:"length",toBase:1e3,aliases:["km","kilometer","kilometers"]},{dimension:"length",toBase:.01,aliases:["cm","centimeter","centimeters"]},{dimension:"length",toBase:1609.344,aliases:["mile","miles","mi"]},{dimension:"length",toBase:.0254,aliases:["inch","inches","in"]},{dimension:"length",toBase:.3048,aliases:["foot","feet","ft"]},{dimension:"mass",toBase:1,aliases:["kg","kilogram","kilograms"]},{dimension:"mass",toBase:.001,aliases:["g","gram","grams"]},{dimension:"mass",toBase:.45359237,aliases:["lb","lbs","pound","pounds"]},{dimension:"mass",toBase:.028349523125,aliases:["oz","ounce","ounces"]},{dimension:"storage",toBase:1,aliases:["mb","megabyte","megabytes"]},{dimension:"storage",toBase:1e3,aliases:["gb","gigabyte","gigabytes"]},{dimension:"storage",toBase:1e6,aliases:["tb","terabyte","terabytes"]},{dimension:"time",toBase:1,aliases:["second","seconds","sec","s"]},{dimension:"time",toBase:60,aliases:["minute","minutes","min"]},{dimension:"time",toBase:3600,aliases:["hour","hours","hr","hrs","h"]}],Ce=new Map;for(const t of _t)for(const e of t.aliases)Ce.set(e,t);const Ke=_t.flatMap(t=>t.aliases).sort((t,e)=>e.length-t.length).map(t=>t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).join("|"),Qe=new RegExp(`([\\d][\\d,]*\\.?\\d*)\\s*(${Ke})\\b[^=()]{0,12}?(?:=|\\(|is\\s+|equals\\s+)\\s*([\\d][\\d,]*\\.?\\d*)\\s*(${Ke})\\b`,"gi"),wn=.02;function At(t){const e=[];let n;for(Qe.lastIndex=0;(n=Qe.exec(t.text))!==null;){const s=Number(n[1].replace(/,/g,"")),i=Number(n[3].replace(/,/g,"")),a=Ce.get(n[2].toLowerCase()),r=Ce.get(n[4].toLowerCase());if(!a||!r||!Number.isFinite(s)||!Number.isFinite(i))continue;if(a.dimension!==r.dimension){e.push({validator:"units",claimId:t.id,status:"fail",detail:`Units ${n[2]} (${a.dimension}) and ${n[4]} (${r.dimension}) are not convertible.`,evidence:{kind:"dimension-mismatch",from:n[2],to:n[4]}});continue}const o=s*a.toBase/r.toBase,l=(o===0?Math.abs(i):Math.abs(i-o)/Math.abs(o))<=wn;e.push({validator:"units",claimId:t.id,status:l?"pass":"fail",detail:l?`Conversion ${s} ${n[2]} = ${i} ${n[4]} is within 2% of the recomputed ${ye(o)} ${n[4]}.`:`Conversion ${s} ${n[2]} stated as ${i} ${n[4]}, recomputed value is ${ye(o)} ${n[4]}.`,evidence:{kind:"conversion",value:s,fromUnit:n[2],statedTo:i,toUnit:n[4],expected:ye(o)}})}return e.length===0&&e.push({validator:"units",claimId:t.id,status:"skip",detail:"No unit conversions found in this claim.",evidence:{}}),e}function ye(t){return Math.round(t*1e4)/1e4}function Ct(t){const e=[],n=t.text,s=/\b(?:https?:\/\/|www\.)[^\s<>"')\]]+/gi,i=n.match(s)??[];let a=!1;for(const u of i){const p=u.startsWith("www.")?`https://${u}`:u;try{const m=new URL(p);if(m.protocol!=="http:"&&m.protocol!=="https:")throw new Error("protocol");if(!m.hostname.includes("."))throw new Error("hostname");e.push({validator:"citations",claimId:t.id,status:"pass",detail:`URL ${u} is well-formed.`,evidence:{kind:"url",url:u,hostname:m.hostname}})}catch{a=!0,e.push({validator:"citations",claimId:t.id,status:"fail",detail:`URL "${u}" is malformed and cannot be resolved as written.`,evidence:{kind:"url",url:u}})}}const r=/\b10\.\d{4,9}\/[^\s<>"')\]]+/g;for(const u of n.match(r)??[])e.push({validator:"citations",claimId:t.id,status:"pass",detail:`DOI ${u} has a valid shape.`,evidence:{kind:"doi",doi:u}});const o=/(according to|study (shows|found|reports)|research (shows|suggests)|reported by|source\s*:|data from|statistics show)/i.test(n),c=/\[[^\]]{1,80}\]/.test(n)||/\([A-Z][a-z]+(?: et al\.)?,? \d{4}\)/.test(n),l=i.length>0||c||(n.match(r)??[]).length>0;return o&&!l&&!a&&e.push({validator:"citations",claimId:t.id,status:"warn",detail:"Claim attributes a fact to an external source but provides no URL, DOI, or bracketed citation.",evidence:{kind:"missing-citation"}}),e.length===0&&e.push({validator:"citations",claimId:t.id,status:"skip",detail:"No citations or source attributions in this claim.",evidence:{}}),e}function Sn(t){const e=[],n=/\$\s?([\d][\d,]*\.?\d*)/g;for(const s of t){let i;for(n.lastIndex=0;(i=n.exec(s.text))!==null;){const a=O(i[1]);if(a===null)continue;const o=s.text.slice(Math.max(0,i.index-40),i.index).match(/([A-Za-z][A-Za-z /-]{1,30})[:\-]?\s*$/);e.push({claimId:s.id,label:o?o[1].trim().toLowerCase():null,amount:a,raw:i[0]})}}return e}const Xe=.01;function In(t){const e=[],n=Sn(t),s=n.find(o=>o.label&&/^(total|amount due|grand total|balance due)/.test(o.label)),i=n.find(o=>o.label&&/subtotal/.test(o.label)),a=n.find(o=>o.label&&/(tax|vat)/.test(o.label));if(s&&i&&a){const o=i.amount+a.amount,c=Math.abs(o-s.amount)<=Xe;return e.push({validator:"numeric-consistency",claimId:s.claimId,status:c?"pass":"fail",detail:c?`Subtotal ${i.amount} + tax ${a.amount} = total ${s.amount} reconciles.`:`Subtotal ${i.amount} + tax ${a.amount} = ${K(o)}, but the stated total is ${s.amount}.`,evidence:{kind:"subtotal-tax-total",subtotal:i.amount,tax:a.amount,statedTotal:s.amount,expected:K(o)}}),e}if(s){const o=new Set([s]);i&&o.add(i),a&&o.add(a);const c=n.filter(u=>!o.has(u)&&!(u.label&&/(deposit|discount|paid)/.test(u.label))),l=c.reduce((u,p)=>u+p.amount,0);if(c.length>=2){const u=Math.abs(l-s.amount)<=Xe;e.push({validator:"numeric-consistency",claimId:s.claimId,status:u?"pass":"fail",detail:u?`Line items sum to ${K(l)}, matching the stated total ${s.amount}.`:`Line items sum to ${K(l)}, but the stated total is ${s.amount}.`,evidence:{kind:"line-item-sum",itemCount:c.length,itemSum:K(l),statedTotal:s.amount}})}}const r=new Map;for(const o of n){if(!o.label)continue;const c=o.label.replace(/\s+/g," ");r.has(c)||r.set(c,[]),r.get(c).push(o)}for(const[o,c]of r){const l=[...new Set(c.map(u=>u.amount))];c.length>=2&&l.length>=2&&/deposit|total|price|fee|amount/.test(o)&&e.push({validator:"numeric-consistency",claimId:c[c.length-1].claimId,status:"fail",detail:`Figure "${o}" appears with conflicting values: ${l.join(", ")}.`,evidence:{kind:"conflicting-figure",label:o,values:l}})}return e}function K(t){return Math.round(t*100)/100}function Rn(t,e,n){const s=[],i=e.filter(r=>r.status==="fail");if(i.length>0){for(const r of i)s.push(`[R1] ${r.validator}: ${r.detail}`);return{verdict:"FAIL",reasons:s}}if(n&&n.label==="contradicts"&&n.confidence>=.7)return s.push(`[R2] Model (${n.source}, ${n.modelId}) contradicts this claim with confidence ${n.confidence}: ${n.rationale}`),{verdict:"FAIL",reasons:s};const a=e.filter(r=>r.status==="warn");for(const r of a)s.push(`[R3] ${r.validator}: ${r.detail}`);return n&&(n.label==="contradicts"?s.push(`[R3] Model contradicts with low confidence ${n.confidence}: ${n.rationale}`):n.label==="uncertain"?s.push(`[R3] Model is uncertain: ${n.rationale}`):n.label==="supports"&&n.confidence<.5&&s.push(`[R3] Model supports but with low confidence ${n.confidence}.`)),s.length>0?{verdict:"NEEDS REVIEW",reasons:s}:(s.push("[R4] All deterministic checks passed and no model objection."),{verdict:"PASS",reasons:s})}function _n(t){return t.includes("FAIL")?"FAIL":t.includes("NEEDS REVIEW")?"NEEDS REVIEW":"PASS"}const An=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298];function Cn(t){const e=[];for(let n=0;n<t.length;n++){let s=t.charCodeAt(n);if(s<128)e.push(s);else if(s<2048)e.push(192|s>>6,128|s&63);else if(s>=55296&&s<=56319&&n+1<t.length){const i=t.charCodeAt(n+1);i>=56320&&i<=57343?(s=65536+(s-55296<<10)+(i-56320),n++,e.push(240|s>>18,128|s>>12&63,128|s>>6&63,128|s&63)):e.push(239,191,189)}else e.push(224|s>>12,128|s>>6&63,128|s&63)}return e}function C(t,e){return t>>>e|t<<32-e}function Oe(t){const e=Cn(t),n=Math.floor(e.length*8/4294967296),s=e.length*8>>>0;for(e.push(128);e.length%64!==56;)e.push(0);e.push(n>>>24&255,n>>>16&255,n>>>8&255,n&255,s>>>24&255,s>>>16&255,s>>>8&255,s&255);let i=1779033703,a=3144134277,r=1013904242,o=2773480762,c=1359893119,l=2600822924,u=528734635,p=1541459225;const m=new Array(64);for(let y=0;y<e.length;y+=64){for(let E=0;E<16;E++){const M=y+E*4;m[E]=e[M]<<24|e[M+1]<<16|e[M+2]<<8|e[M+3]|0}for(let E=16;E<64;E++){const M=C(m[E-15],7)^C(m[E-15],18)^m[E-15]>>>3,fe=C(m[E-2],17)^C(m[E-2],19)^m[E-2]>>>10;m[E]=m[E-16]+M+m[E-7]+fe|0}let b=i,A=a,k=r,pe=o,P=c,ne=l,se=u,he=p;for(let E=0;E<64;E++){const M=C(P,6)^C(P,11)^C(P,25),fe=P&ne^~P&se,Je=he+M+fe+An[E]+m[E]|0,hn=C(b,2)^C(b,13)^C(b,22),fn=b&A^b&k^A&k,mn=hn+fn|0;he=se,se=ne,ne=P,P=pe+Je|0,pe=k,k=A,A=b,b=Je+mn|0}i=i+b|0,a=a+A|0,r=r+k|0,o=o+pe|0,c=c+P|0,l=l+ne|0,u=u+se|0,p=p+he|0}return[i,a,r,o,c,l,u,p].map(y=>(y>>>0).toString(16).padStart(8,"0")).join("")}const On="0.1.0";function re(t){return t===null||typeof t!="object"?JSON.stringify(t)??"null":Array.isArray(t)?`[${t.map(re).join(",")}]`:`{${Object.entries(t).sort(([n],[s])=>n<s?-1:n>s?1:0).map(([n,s])=>`${JSON.stringify(n)}:${re(s)}`).join(",")}}`}function Dn(t){return{totalClaims:t.length,pass:t.filter(e=>e.verdict==="PASS").length,needsReview:t.filter(e=>e.verdict==="NEEDS REVIEW").length,fail:t.filter(e=>e.verdict==="FAIL").length,overallVerdict:_n(t.map(e=>e.verdict))}}function Tn(t,e,n){const s=Oe(t),i={version:"proofgate.report/1",id:`pr_${s.slice(0,16)}`,createdAt:n,inputText:t,inputHash:s,claims:e,summary:Dn(e),engine:{name:"proofgate-core",version:On}},a=Oe(re(i));return{...i,contentHash:a}}function $n(t){const{contentHash:e,...n}=t;return Oe(re(n))===e}const De=/(guarantee|guaranteed|always|never fails|100%|risk-free|proven|clinically|legally|contract|liable|certified)/i,Ze=280;function Ot(t,e){return t.text.length<40&&!De.test(t.text)?{tier:"deterministic-only",reason:"Short plain claim; deterministic checks are sufficient."}:De.test(t.text)?{tier:"cloud",reason:"Claim contains high-stakes markers (guarantee / legal / medical / absolute wording); deep cloud pass required."}:t.text.length>Ze?{tier:"cloud",reason:`Claim length ${t.text.length} exceeds the on-device comfort threshold ${Ze}.`}:e?{tier:"cloud",reason:"A deterministic check warned on this claim; cloud pass gathers more context."}:{tier:"on-device",reason:"Standard claim; private on-device first pass is sufficient."}}class Te{constructor(){Y(this,"name","mock-deterministic")}async analyze(e){const n=e.text;if(/^\s*(hello|hi|thanks|thank you)\b/i.test(n))return{claimId:e.id,label:"not-applicable",confidence:1,rationale:"Greeting or courtesy text; nothing to verify.",source:"mock",modelId:"mock-deterministic-v1"};if(De.test(n))return{claimId:e.id,label:"uncertain",confidence:.35,rationale:"Claim uses absolute or high-stakes wording that a mock pass cannot verify.",source:"mock",modelId:"mock-deterministic-v1"};const s=Math.min(.95,.6+n.length/1e3);return{claimId:e.id,label:"supports",confidence:Math.round(s*100)/100,rationale:"Mock pass: no contradiction signals detected in claim shape.",source:"mock",modelId:"mock-deterministic-v1"}}}async function Dt(t,e={}){const n=e.adapter??new Te,s=e.useModel??!0,i=e.now??new Date().toISOString(),a=Ae(t),r=new Map;for(const c of[...En(a),...In(a)])r.has(c.claimId)||r.set(c.claimId,[]),r.get(c.claimId).push(c);const o=[];for(const c of a){const l=[...St(c),...Rt(c),...At(c),...Ct(c),...r.get(c.id)??[]],u=l.some(A=>A.status==="warn"),p=Ot(c,u),m=s&&p.tier!=="deterministic-only"?await n.analyze(c):null,{verdict:y,reasons:b}=Rn(c.id,l,m);o.push({claim:c,checks:l,modelOutput:m,verdict:y,reasons:b})}return Tn(t,o,i)}const Tt=["AI Answer","Quote","Invoice","Announcement"],Nn=["Invoice Q-1042 from Acme Studio.","Invoice date: 2026-11-10.","Payment due date: 2026-12-10.","Design services: 3 units at $2,800 = $9,400.","The project lead is Maya Chen."].join(`
`),Ln={Invoice:Nn,"AI Answer":["The migration will finish in 10 days, which is 240 hours of wall-clock time.","According to a recent study, teams that adopt staged rollouts see 30% fewer incidents.","The new plan costs $49 per user per month, so 20 users cost $980 per month.","Storage grows from 500 GB to 1 TB, an increase of exactly 500 GB."].join(`
`),Quote:["Vendor quote QT-2081, issued 2026-11-05.","Implementation: 12 days at $950 = $11,400.","Training: 2 sessions at $1,500 = $3,000.","Subtotal: $14,400.","Tax (10%): $1,440.","Total: $15,840."].join(`
`),Announcement:["Northline Mobility will open its Austin facility on 15 September 2026.","The facility covers 10 km of test track, equal to 6.21 miles.","The company guarantees the service will always be available, with zero downtime.","The launch event is scheduled for Friday, September 18, 2026."].join(`
`)},$t="proofgate.history.v1";function Be(t,e=64){const s=t.inputText.split(`
`).map(i=>i.trim()).find(i=>i.length>0)??t.id;return s.length>e?`${s.slice(0,e-1)}…`:s}function kn(t,e,n){return{key:t.contentHash,report:t,sourceType:e,title:Be(t),savedAt:n,replayCount:0,lastReplayAt:null,lastReplayMatches:null}}function Pn(t){if(typeof t!="object"||t===null)return!1;const e=t;return typeof e.key=="string"&&typeof e.title=="string"&&typeof e.savedAt=="string"&&typeof e.replayCount=="number"&&typeof e.sourceType=="string"&&typeof e.report=="object"&&e.report!==null&&typeof e.report.contentHash=="string"}function de(t){try{const e=t.getItem($t);if(!e)return[];const n=JSON.parse(e);return Array.isArray(n)?n.filter(Pn):[]}catch{return[]}}function Ue(t,e){t.setItem($t,JSON.stringify(e))}function Mn(t,e,n,s){const i=de(t).filter(a=>a.key!==e.contentHash);return i.unshift(kn(e,n,s)),Ue(t,i),i}function xn(t,e,n){const s=de(t).map(i=>i.key===e?{...i,...n}:i);return Ue(t,s),s}function Fn(t,e){const n=de(t).filter(s=>s.key!==e);return Ue(t,n),n}function Bn(t,e){const n=(e.query??"").trim().toLowerCase(),s=e.now?Date.parse(e.now):Date.now();return t.filter(i=>{if(e.verdict&&e.verdict!=="ALL"&&i.report.summary.overallVerdict!==e.verdict||e.sourceType&&e.sourceType!=="ALL"&&i.sourceType!==e.sourceType)return!1;if(e.withinDays!==void 0){const a=Date.parse(i.savedAt);if(Number.isNaN(a)||s-a>e.withinDays*864e5)return!1}return!(n&&![i.title,i.sourceType,i.report.id,...i.report.claims.map(r=>r.claim.text)].join(`
`).toLowerCase().includes(n))})}function Un(t,e){const n=Date.parse(e);return{reportsLast30Days:t.filter(s=>{const i=Date.parse(s.savedAt);return!Number.isNaN(i)&&n-i<=30*864e5&&i<=n}).length,replaysRun:t.reduce((s,i)=>s+i.replayCount,0),reportsPassed:t.filter(s=>s.report.summary.overallVerdict==="PASS").length}}function Vn(t,e){const n=new Map(e.claims.map(a=>[a.claim.id,a])),s=t.claims.map(a=>{const r=n.get(a.claim.id),o=r?r.verdict:null;return{claimId:a.claim.id,claimText:a.claim.text,originalVerdict:a.verdict,replayVerdict:o,changed:o!==a.verdict}}),i=s.filter(a=>a.changed).length;return{matches:i===0&&e.summary.overallVerdict===t.summary.overallVerdict,originalOverall:t.summary.overallVerdict,replayOverall:e.summary.overallVerdict,claims:s,changedCount:i}}function Hn(t){const e=new Set(t.claims.map(s=>{var i;return(i=s.modelOutput)==null?void 0:i.source}).filter(s=>s!==void 0));if(e.has("mock"))return"Demo mode (mock model)";if(e.size===0)return"Deterministic checks only";const n=[];return e.has("on-device")&&n.push("Gemini Nano first pass"),e.has("cloud")&&n.push("cloud escalation"),n.join(" + ")}const jn=()=>{};var et={};/**
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
 */const Nt=function(t){const e=[];let n=0;for(let s=0;s<t.length;s++){let i=t.charCodeAt(s);i<128?e[n++]=i:i<2048?(e[n++]=i>>6|192,e[n++]=i&63|128):(i&64512)===55296&&s+1<t.length&&(t.charCodeAt(s+1)&64512)===56320?(i=65536+((i&1023)<<10)+(t.charCodeAt(++s)&1023),e[n++]=i>>18|240,e[n++]=i>>12&63|128,e[n++]=i>>6&63|128,e[n++]=i&63|128):(e[n++]=i>>12|224,e[n++]=i>>6&63|128,e[n++]=i&63|128)}return e},Gn=function(t){const e=[];let n=0,s=0;for(;n<t.length;){const i=t[n++];if(i<128)e[s++]=String.fromCharCode(i);else if(i>191&&i<224){const a=t[n++];e[s++]=String.fromCharCode((i&31)<<6|a&63)}else if(i>239&&i<365){const a=t[n++],r=t[n++],o=t[n++],c=((i&7)<<18|(a&63)<<12|(r&63)<<6|o&63)-65536;e[s++]=String.fromCharCode(55296+(c>>10)),e[s++]=String.fromCharCode(56320+(c&1023))}else{const a=t[n++],r=t[n++];e[s++]=String.fromCharCode((i&15)<<12|(a&63)<<6|r&63)}}return e.join("")},Lt={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,s=[];for(let i=0;i<t.length;i+=3){const a=t[i],r=i+1<t.length,o=r?t[i+1]:0,c=i+2<t.length,l=c?t[i+2]:0,u=a>>2,p=(a&3)<<4|o>>4;let m=(o&15)<<2|l>>6,y=l&63;c||(y=64,r||(m=64)),s.push(n[u],n[p],n[m],n[y])}return s.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(Nt(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):Gn(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,s=[];for(let i=0;i<t.length;){const a=n[t.charAt(i++)],o=i<t.length?n[t.charAt(i)]:0;++i;const l=i<t.length?n[t.charAt(i)]:64;++i;const p=i<t.length?n[t.charAt(i)]:64;if(++i,a==null||o==null||l==null||p==null)throw new qn;const m=a<<2|o>>4;if(s.push(m),l!==64){const y=o<<4&240|l>>2;if(s.push(y),p!==64){const b=l<<6&192|p;s.push(b)}}}return s},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class qn extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Wn=function(t){const e=Nt(t);return Lt.encodeByteArray(e,!0)},kt=function(t){return Wn(t).replace(/\./g,"")},zn=function(t){try{return Lt.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
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
 */function H(t){return Pt(void 0,t)}function Pt(t,e){if(!(e instanceof Object))return e;switch(e.constructor){case Date:const n=e;return new Date(n.getTime());case Object:t===void 0&&(t={});break;case Array:t=[];break;default:return e}for(const n in e)!e.hasOwnProperty(n)||!Jn(n)||(t[n]=Pt(t[n],e[n]));return t}function Jn(t){return t!=="__proto__"}/**
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
 */function Mt(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const Yn=()=>Mt().__FIREBASE_DEFAULTS__,Kn=()=>{if(typeof process>"u"||typeof et>"u")return;const t=et.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},Qn=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&zn(t[1]);return e&&JSON.parse(e)},Xn=()=>{try{return jn()||Yn()||Kn()||Qn()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},xt=()=>{var t;return(t=Xn())==null?void 0:t.config};/**
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
 */class Zn{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,s)=>{n?this.reject(n):this.resolve(s),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,s))}}}function es(){try{return typeof indexedDB=="object"}catch{return!1}}function ts(){return new Promise((t,e)=>{try{let n=!0;const s="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(s);i.onsuccess=()=>{i.result.close(),n||self.indexedDB.deleteDatabase(s),t(!0)},i.onupgradeneeded=()=>{n=!1},i.onerror=()=>{var a;e(((a=i.error)==null?void 0:a.message)||"")}}catch(n){e(n)}})}/**
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
 */const ns="FirebaseError";class J extends Error{constructor(e,n,s){super(n),this.code=e,this.customData=s,this.name=ns,Object.setPrototypeOf(this,J.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Ft.prototype.create)}}class Ft{constructor(e,n,s){this.service=e,this.serviceName=n,this.errors=s}create(e,...n){const s=n[0]||{},i=`${this.service}/${e}`,a=this.errors[e],r=a?ss(a,s):"Error",o=`${this.serviceName}: ${r} (${i}).`;return new J(i,o,s)}}function ss(t,e){try{let n=0,s="";for(;n<t.length;){const i=t.indexOf("{$",n);if(i===-1){s+=t.substring(n);break}const a=t.indexOf("}",i+2);if(a===-1){s+=t.substring(n);break}const r=t.substring(i+2,a),o=e[r];s+=t.substring(n,i)+(o!=null?String(o):`<${r}?>`),n=a+1}return s}catch{return t}}function $e(t,e){if(t===e)return!0;const n=Object.keys(t),s=Object.keys(e);for(const i of n){if(!s.includes(i))return!1;const a=t[i],r=e[i];if(tt(a)&&tt(r)){if(!$e(a,r))return!1}else if(a!==r)return!1}for(const i of s)if(!n.includes(i))return!1;return!0}function tt(t){return t!==null&&typeof t=="object"}/**
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
 */function is(t){return t&&t._delegate?t._delegate:t}class Z{constructor(e,n,s){this.name=e,this.instanceFactory=n,this.type=s,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
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
 */const U="[DEFAULT]";/**
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
 */class as{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const s=new Zn;if(this.instancesDeferred.set(n,s),this.isInitialized(n)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:n});i&&s.resolve(i)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){const n=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),s=(e==null?void 0:e.optional)??!1;if(this.isInitialized(n)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:n})}catch(i){if(s)return null;throw i}else{if(s)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(os(e))try{this.getOrInitializeService({instanceIdentifier:U})}catch{}for(const[n,s]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(n);try{const a=this.getOrInitializeService({instanceIdentifier:i});s.resolve(a)}catch{}}}}clearInstance(e=U){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=U){return this.instances.has(e)}getOptions(e=U){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,s=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(s))throw Error(`${this.name}(${s}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:s,options:n});for(const[a,r]of this.instancesDeferred.entries()){const o=this.normalizeInstanceIdentifier(a);s===o&&r.resolve(i)}return i}onInit(e,n){const s=this.normalizeInstanceIdentifier(n),i=this.onInitCallbacks.get(s)??new Set;i.add(e),this.onInitCallbacks.set(s,i);const a=this.instances.get(s);return a&&e(a,s),()=>{i.delete(e)}}invokeOnInitCallbacks(e,n){const s=this.onInitCallbacks.get(n);if(s)for(const i of s)try{i(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let s=this.instances.get(e);if(!s&&this.component&&(s=this.component.instanceFactory(this.container,{instanceIdentifier:rs(e),options:n}),this.instances.set(e,s),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(s,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,s)}catch{}return s||null}normalizeInstanceIdentifier(e=U){return this.component?this.component.multipleInstances?e:U:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function rs(t){return t===U?void 0:t}function os(t){return t.instantiationMode==="EAGER"}/**
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
 */class cs{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new as(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
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
 */var v;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(v||(v={}));const ls={debug:v.DEBUG,verbose:v.VERBOSE,info:v.INFO,warn:v.WARN,error:v.ERROR,silent:v.SILENT},ds=v.INFO,us={[v.DEBUG]:"log",[v.VERBOSE]:"log",[v.INFO]:"info",[v.WARN]:"warn",[v.ERROR]:"error"},ps=(t,e,...n)=>{if(e<t.logLevel)return;const s=new Date().toISOString(),i=us[e];if(i)console[i](`[${s}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Bt{constructor(e){this.name=e,this._logLevel=ds,this._logHandler=ps,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in v))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?ls[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,v.DEBUG,...e),this._logHandler(this,v.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,v.VERBOSE,...e),this._logHandler(this,v.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,v.INFO,...e),this._logHandler(this,v.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,v.WARN,...e),this._logHandler(this,v.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,v.ERROR,...e),this._logHandler(this,v.ERROR,...e)}}const hs=(t,e)=>e.some(n=>t instanceof n);let nt,st;function fs(){return nt||(nt=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function ms(){return st||(st=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Ut=new WeakMap,Ne=new WeakMap,Vt=new WeakMap,be=new WeakMap,Ve=new WeakMap;function gs(t){const e=new Promise((n,s)=>{const i=()=>{t.removeEventListener("success",a),t.removeEventListener("error",r)},a=()=>{n(B(t.result)),i()},r=()=>{s(t.error),i()};t.addEventListener("success",a),t.addEventListener("error",r)});return e.then(n=>{n instanceof IDBCursor&&Ut.set(n,t)}).catch(()=>{}),Ve.set(e,t),e}function ys(t){if(Ne.has(t))return;const e=new Promise((n,s)=>{const i=()=>{t.removeEventListener("complete",a),t.removeEventListener("error",r),t.removeEventListener("abort",r)},a=()=>{n(),i()},r=()=>{s(t.error||new DOMException("AbortError","AbortError")),i()};t.addEventListener("complete",a),t.addEventListener("error",r),t.addEventListener("abort",r)});Ne.set(t,e)}let Le={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return Ne.get(t);if(e==="objectStoreNames")return t.objectStoreNames||Vt.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return B(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function bs(t){Le=t(Le)}function vs(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const s=t.call(ve(this),e,...n);return Vt.set(s,e.sort?e.sort():[e]),B(s)}:ms().includes(t)?function(...e){return t.apply(ve(this),e),B(Ut.get(this))}:function(...e){return B(t.apply(ve(this),e))}}function Es(t){return typeof t=="function"?vs(t):(t instanceof IDBTransaction&&ys(t),hs(t,fs())?new Proxy(t,Le):t)}function B(t){if(t instanceof IDBRequest)return gs(t);if(be.has(t))return be.get(t);const e=Es(t);return e!==t&&(be.set(t,e),Ve.set(e,t)),e}const ve=t=>Ve.get(t);function ws(t,e,{blocked:n,upgrade:s,blocking:i,terminated:a}={}){const r=indexedDB.open(t,e),o=B(r);return s&&r.addEventListener("upgradeneeded",c=>{s(B(r.result),c.oldVersion,c.newVersion,B(r.transaction),c)}),n&&r.addEventListener("blocked",c=>n(c.oldVersion,c.newVersion,c)),o.then(c=>{a&&c.addEventListener("close",()=>a()),i&&c.addEventListener("versionchange",l=>i(l.oldVersion,l.newVersion,l))}).catch(()=>{}),o}const Ss=["get","getKey","getAll","getAllKeys","count"],Is=["put","add","delete","clear"],Ee=new Map;function it(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(Ee.get(e))return Ee.get(e);const n=e.replace(/FromIndex$/,""),s=e!==n,i=Is.includes(n);if(!(n in(s?IDBIndex:IDBObjectStore).prototype)||!(i||Ss.includes(n)))return;const a=async function(r,...o){const c=this.transaction(r,i?"readwrite":"readonly");let l=c.store;return s&&(l=l.index(o.shift())),(await Promise.all([l[n](...o),i&&c.done]))[0]};return Ee.set(e,a),a}bs(t=>({...t,get:(e,n,s)=>it(e,n)||t.get(e,n,s),has:(e,n)=>!!it(e,n)||t.has(e,n)}));/**
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
 */class Rs{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(_s(n)){const s=n.getImmediate();return`${s.library}/${s.version}`}else return null}).filter(n=>n).join(" ")}}function _s(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const ke="@firebase/app",at="0.16.7";/**
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
 */const N=new Bt("@firebase/app"),As="@firebase/app-compat",Cs="@firebase/analytics-compat",Os="@firebase/analytics",Ds="@firebase/app-check-compat",Ts="@firebase/app-check",$s="@firebase/auth",Ns="@firebase/auth-compat",Ls="@firebase/crashlytics",ks="@firebase/database",Ps="@firebase/data-connect",Ms="@firebase/database-compat",xs="@firebase/functions",Fs="@firebase/functions-compat",Bs="@firebase/installations",Us="@firebase/installations-compat",Vs="@firebase/messaging",Hs="@firebase/messaging-compat",js="@firebase/performance",Gs="@firebase/performance-compat",qs="@firebase/remote-config",Ws="@firebase/remote-config-compat",zs="@firebase/storage",Js="@firebase/storage-compat",Ys="@firebase/firestore",Ks="@firebase/ai",Qs="@firebase/firestore-compat",Xs="firebase";/**
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
 */const Pe="[DEFAULT]",Zs={[ke]:"fire-core",[As]:"fire-core-compat",[Os]:"fire-analytics",[Cs]:"fire-analytics-compat",[Ts]:"fire-app-check",[Ds]:"fire-app-check-compat",[$s]:"fire-auth",[Ns]:"fire-auth-compat",[Ls]:"fire-cls",[ks]:"fire-rtdb",[Ps]:"fire-data-connect",[Ms]:"fire-rtdb-compat",[xs]:"fire-fn",[Fs]:"fire-fn-compat",[Bs]:"fire-iid",[Us]:"fire-iid-compat",[Vs]:"fire-fcm",[Hs]:"fire-fcm-compat",[js]:"fire-perf",[Gs]:"fire-perf-compat",[qs]:"fire-rc",[Ws]:"fire-rc-compat",[zs]:"fire-gcs",[Js]:"fire-gcs-compat",[Ys]:"fire-fst",[Qs]:"fire-fst-compat",[Ks]:"fire-vertex","fire-js":"fire-js",[Xs]:"fire-js-all"};/**
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
 */const ee=new Map,ei=new Map,Me=new Map;function rt(t,e){try{t.container.addComponent(e)}catch(n){N.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function oe(t){const e=t.name;if(Me.has(e))return N.debug(`There were multiple attempts to register component ${e}.`),!1;Me.set(e,t);for(const n of ee.values())rt(n,t);for(const n of ei.values())rt(n,t);return!0}function ti(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function ni(t){return t==null?!1:t.settings!==void 0}/**
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
 */const si={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different {$mismatchedParam}. Existing: '{$oldValue}'. New: '{$newValue}'.","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},$=new Ft("app","Firebase",si);/**
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
 */class ii{constructor(e,n,s){this._isDeleted=!1,this._options={...e},this._config={...n},this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=s,this.container.addComponent(new Z("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw $.create("app-deleted",{appName:this._name})}}function Ht(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const s={name:Pe,automaticDataCollectionEnabled:!0,...e},i=s.name;if(typeof i!="string"||!i)throw $.create("bad-app-name",{appName:String(i)});if(n||(n=xt()),!n)throw $.create("no-options");const a=ee.get(i);if(a)if($e(n,a.options)){if($e(s,a.config))return a;throw $.create("duplicate-app",{appName:i,mismatchedParam:"config",oldValue:JSON.stringify(a.config),newValue:JSON.stringify(s)})}else throw $.create("duplicate-app",{appName:i,mismatchedParam:"options",oldValue:JSON.stringify(a.options),newValue:JSON.stringify(n)});const r=new cs(i);for(const c of Me.values())r.addComponent(c);const o=new ii(n,s,r);return ee.set(i,o),o}function ai(t=Pe){const e=ee.get(t);if(!e&&t===Pe&&xt())return Ht();if(!e)throw $.create("no-app",{appName:t});return e}function ot(){return Array.from(ee.values())}function q(t,e,n){let s=Zs[t]??t;n&&(s+=`-${n}`);const i=s.match(/\s|\//),a=e.match(/\s|\//);if(i||a){const r=[`Unable to register library "${s}" with version "${e}":`];i&&r.push(`library name "${s}" contains illegal characters (whitespace or "/")`),i&&a&&r.push("and"),a&&r.push(`version name "${e}" contains illegal characters (whitespace or "/")`),N.warn(r.join(" "));return}oe(new Z(`${s}-version`,()=>({library:s,version:e}),"VERSION"))}/**
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
 */const ri="firebase-heartbeat-database",oi=1,te="firebase-heartbeat-store";let we=null;function jt(){return we||(we=ws(ri,oi,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(te)}catch(n){console.warn(n)}}}}).catch(t=>{throw $.create("idb-open",{originalErrorMessage:t.message})})),we}async function ci(t){try{const n=(await jt()).transaction(te),s=await n.objectStore(te).get(Gt(t));return await n.done,s}catch(e){if(e instanceof J)N.warn(e.message);else{const n=$.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});N.warn(n.message)}}}async function ct(t,e){try{const s=(await jt()).transaction(te,"readwrite");await s.objectStore(te).put(e,Gt(t)),await s.done}catch(n){if(n instanceof J)N.warn(n.message);else{const s=$.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});N.warn(s.message)}}}function Gt(t){return`${t.name}!${t.options.appId}`}/**
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
 */const li=1024,di=30;class ui{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new hi(n),this._heartbeatsCachePromise=this._storage.read().then(s=>(this._heartbeatsCache=s,s))}async triggerHeartbeat(){var e,n;try{const i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),a=lt();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)==null?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===a||this._heartbeatsCache.heartbeats.some(r=>r.date===a))return;if(this._heartbeatsCache.heartbeats.push({date:a,agent:i}),this._heartbeatsCache.heartbeats.length>di){const r=fi(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(r,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(s){N.warn(s)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=lt(),{heartbeatsToSend:s,unsentEntries:i}=pi(this._heartbeatsCache.heartbeats),a=kt(JSON.stringify({version:2,heartbeats:s}));return this._heartbeatsCache.lastSentHeartbeatDate=n,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),a}catch(n){return N.warn(n),""}}}function lt(){return new Date().toISOString().substring(0,10)}function pi(t,e=li){const n=[];let s=t.slice();for(const i of t){const a=n.find(r=>r.agent===i.agent);if(a){if(a.dates.push(i.date),dt(n)>e){a.dates.pop();break}}else if(n.push({agent:i.agent,dates:[i.date]}),dt(n)>e){n.pop();break}s=s.slice(1)}return{heartbeatsToSend:n,unsentEntries:s}}class hi{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return es()?ts().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await ci(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const s=await this.read();return ct(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??s.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const s=await this.read();return ct(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??s.lastSentHeartbeatDate,heartbeats:[...s.heartbeats,...e.heartbeats]})}else return}}function dt(t){return kt(JSON.stringify({version:2,heartbeats:t})).length}function fi(t){if(t.length===0)return-1;let e=0,n=t[0].date;for(let s=1;s<t.length;s++)t[s].date<n&&(n=t[s].date,e=s);return e}/**
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
 */function mi(t){oe(new Z("platform-logger",e=>new Rs(e),"PRIVATE")),oe(new Z("heartbeat",e=>new ui(e),"PRIVATE")),q(ke,at,t),q(ke,at,"esm2020"),q("fire-js","")}/**
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
 */mi("");var gi="firebase",yi="13.4.0";/**
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
 */q(gi,yi,"app");var ut="@firebase/ai",xe="3.1.0";/**
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
 */const z="AI",bi="global",vi="firebasevertexai.googleapis.com",ce="v1beta",pt=xe,Ei="gl-js",wi="hybrid",Si=180*1e3,Ii="gemini-3.5-flash-lite";/**
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
 */class f extends J{constructor(e,n,s){const i=z,a=`${i}/${e}`,r=`${i}: ${n} (${a})`;super(e,r),this.code=e,this.customErrorData=s,Error.captureStackTrace&&Error.captureStackTrace(this,f),Object.setPrototypeOf(this,f.prototype),this.toString=()=>r}}/**
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
 */const ht=["user","model","function","system"],qt={HARM_SEVERITY_UNSUPPORTED:"HARM_SEVERITY_UNSUPPORTED"},S={SAFETY:"SAFETY",RECITATION:"RECITATION",BLOCKLIST:"BLOCKLIST",PROHIBITED_CONTENT:"PROHIBITED_CONTENT",SPII:"SPII",MALFORMED_FUNCTION_CALL:"MALFORMED_FUNCTION_CALL",IMAGE_SAFETY:"IMAGE_SAFETY",IMAGE_PROHIBITED_CONTENT:"IMAGE_PROHIBITED_CONTENT",IMAGE_OTHER:"IMAGE_OTHER",NO_IMAGE:"NO_IMAGE",IMAGE_RECITATION:"IMAGE_RECITATION",LANGUAGE:"LANGUAGE",UNEXPECTED_TOOL_CALL:"UNEXPECTED_TOOL_CALL",TOO_MANY_TOOL_CALLS:"TOO_MANY_TOOL_CALLS",MISSING_THOUGHT_SIGNATURE:"MISSING_THOUGHT_SIGNATURE",MALFORMED_RESPONSE:"MALFORMED_RESPONSE"},I={PREFER_ON_DEVICE:"prefer_on_device",ONLY_ON_DEVICE:"only_on_device",ONLY_IN_CLOUD:"only_in_cloud",PREFER_IN_CLOUD:"prefer_in_cloud"},x={ON_DEVICE:"on_device",IN_CLOUD:"in_cloud"};/**
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
 */const h={ERROR:"error",REQUEST_ERROR:"request-error",RESPONSE_ERROR:"response-error",FETCH_ERROR:"fetch-error",SESSION_CLOSED:"session-closed",INVALID_CONTENT:"invalid-content",API_NOT_ENABLED:"api-not-enabled",ALREADY_INITIALIZED:"already-initialized",INVALID_SCHEMA:"invalid-schema",NO_API_KEY:"no-api-key",NO_APP_ID:"no-app-id",NO_MODEL:"no-model",NO_PROJECT_ID:"no-project-id",PARSE_FAILED:"parse-failed",UNSUPPORTED:"unsupported"};/**
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
 */const L={AGENT_PLATFORM:"AGENT_PLATFORM",GOOGLE_AI:"GOOGLE_AI"};/**
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
 */class Wt{constructor(e){this.backendType=e}}class ue extends Wt{constructor(){super(L.GOOGLE_AI)}_getModelPath(e,n){return`/${ce}/projects/${e}/${n}`}_getTemplatePath(e,n){return`/${ce}/projects/${e}/templates/${n}`}}class zt extends Wt{constructor(e){super(L.AGENT_PLATFORM),this.location=bi,e&&(this.location=e)}_getModelPath(e,n){return`/${ce}/projects/${e}/locations/${this.location}/${n}`}_getTemplatePath(e,n){return`/${ce}/projects/${e}/locations/${this.location}/templates/${n}`}}/**
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
 */function Ri(t){if(t instanceof ue)return`${z}/googleai`;if(t instanceof zt)return`${z}/agentplatform/${t.location}`;throw new f(h.ERROR,`Invalid backend: ${JSON.stringify(t.backendType)}`)}function _i(t){const e=t.split("/");if(e[0]!==z)throw new f(h.ERROR,`Invalid instance identifier, unknown prefix '${e[0]}'`);switch(e[1]){case"agentplatform":const s=e[2];if(!s)throw new f(h.ERROR,`Invalid instance identifier, unknown location '${t}'`);return new zt(s);case"googleai":return new ue;default:throw new f(h.ERROR,`Invalid instance identifier string: '${t}'`)}}/**
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
 */const w=new Bt("@firebase/ai");var T;(function(t){t.UNAVAILABLE="unavailable",t.DOWNLOADABLE="downloadable",t.DOWNLOADING="downloading",t.AVAILABLE="available"})(T||(T={}));/**
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
 */const Jt={type:"text",languages:["en"]},Se=[Jt,{type:"image"}],Ie=[Jt];class _{constructor(e,n,s){this.languageModelProvider=e,this.mode=n,this.downloadPromise=null,this.onDeviceParams={createOptions:{expectedInputs:Se,expectedOutputs:Ie}},s&&(this.onDeviceParams=s,this.onDeviceParams.createOptions?(this.onDeviceParams.createOptions.expectedInputs||(this.onDeviceParams.createOptions.expectedInputs=Se),this.onDeviceParams.createOptions.expectedOutputs||(this.onDeviceParams.createOptions.expectedOutputs=Ie)):this.onDeviceParams.createOptions={expectedInputs:Se,expectedOutputs:Ie})}async isAvailable(e){var s;if(!this.mode)return w.debug("On-device inference unavailable because mode is undefined."),!1;if(this.mode===I.ONLY_IN_CLOUD)return w.debug('On-device inference unavailable because mode is "only_in_cloud".'),!1;const n=await((s=this.languageModelProvider)==null?void 0:s.availability(this.onDeviceParams.createOptions));if(this.mode===I.ONLY_ON_DEVICE){if(n===T.UNAVAILABLE)throw new f(h.API_NOT_ENABLED,"Local LanguageModel API not available in this environment.");if(n===T.DOWNLOADABLE||n===T.DOWNLOADING){w.debug("Waiting for download of LanguageModel to complete.");try{await this.downloadPromise}catch(i){throw new f(h.ERROR,i.message)}return!0}return!0}return n!==T.AVAILABLE?(w.debug(`On-device inference unavailable because availability is "${n}".`),!1):_.isOnDeviceRequest(e)?!0:(w.debug("On-device inference unavailable because request is incompatible."),!1)}async generateContent(e){const n=await this.createSession(),s=await Promise.all(e.contents.map(_.toLanguageModelMessage)),i=await n.prompt(s,this.onDeviceParams.promptOptions);return _.toResponse(i)}async generateContentStream(e){const n=await this.createSession(),s=await Promise.all(e.contents.map(_.toLanguageModelMessage)),i=n.promptStreaming(s,this.onDeviceParams.promptOptions);return _.toStreamResponse(i)}async countTokens(e){throw new f(h.REQUEST_ERROR,"Count Tokens is not yet available for on-device model.")}static isOnDeviceRequest(e){if(e.contents.length===0)return w.debug("Empty prompt rejected for on-device inference."),!1;for(const n of e.contents){if(n.parts.some(s=>"functionResponse"in s))return w.debug("Content with a function response part rejected for on-device inference."),!1;for(const s of n.parts)if("inlineData"in s&&s.inlineData&&_.SUPPORTED_MIME_TYPES.indexOf(s.inlineData.mimeType)===-1)return w.debug(`Unsupported mime type "${s.inlineData.mimeType}" rejected for on-device inference.`),!1}return!0}async downloadIfAvailable(e){var s;const n=await((s=this.languageModelProvider)==null?void 0:s.availability(this.onDeviceParams.createOptions));return(n===T.DOWNLOADABLE||n===T.DOWNLOADING)&&this.download(e),n}download(e){var s;if(this.downloadPromise)return;const n={...this.onDeviceParams.createOptions};n&&!n.monitor&&e&&(n.monitor=i=>{i.addEventListener("downloadprogress",a=>{e(a.loaded)})}),this.downloadPromise=(s=this.languageModelProvider)==null?void 0:s.create(n).finally(()=>{this.downloadPromise=null})}static async toLanguageModelMessage(e){const n=await Promise.all(e.parts.map(_.toLanguageModelMessageContent));return{role:_.toLanguageModelMessageRole(e.role),content:n}}static async toLanguageModelMessageContent(e){if("text"in e&&typeof e.text=="string")return{type:"text",value:e.text};if("inlineData"in e&&e.inlineData){const s=await(await fetch(`data:${e.inlineData.mimeType};base64,${e.inlineData.data}`)).blob();return{type:"image",value:await createImageBitmap(s)}}throw new f(h.REQUEST_ERROR,"Processing of this Part type is not currently supported.")}static toLanguageModelMessageRole(e){return e==="model"?"assistant":"user"}async createSession(){if(!this.languageModelProvider)throw new f(h.UNSUPPORTED,"Chrome AI requested for unsupported browser version.");const e=await this.languageModelProvider.create(this.onDeviceParams.createOptions);return this.oldSession&&this.oldSession.destroy(),this.oldSession=e,e}static toResponse(e){return{json:async()=>({candidates:[{content:{parts:[{text:e}]}}]})}}static toStreamResponse(e){const n=new TextEncoder;return{body:e.pipeThrough(new TransformStream({transform(s,i){const a=JSON.stringify({candidates:[{content:{role:"model",parts:[{text:s}]}}]});i.enqueue(n.encode(`data: ${a}

`))}}))}}}_.SUPPORTED_MIME_TYPES=["image/jpeg","image/png"];function Ai(t,e,n){const i=(e||Mt()).LanguageModel;if(i&&t)return new _(i,t,n)}/**
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
 */class Ci{constructor(e,n,s,i,a){this.app=e,this.backend=n,this.chromeAdapterFactory=a;const r=i==null?void 0:i.getImmediate({optional:!0}),o=s==null?void 0:s.getImmediate({optional:!0});this.auth=o||null,this.appCheck=r||null}_delete(){return Promise.resolve()}set options(e){this._options=e}get options(){return this._options}}/**
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
 */function Oi(t,{instanceIdentifier:e}){if(!e)throw new f(h.ERROR,"AIService instance identifier is undefined.");const n=_i(e),s=t.getProvider("app").getImmediate(),i=t.getProvider("auth-internal"),a=t.getProvider("app-check-internal");return new Ci(s,n,i,a,Ai)}/**
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
 */function Di(t){var n,s,i,a,r,o,c;if((s=(n=t.app)==null?void 0:n.options)!=null&&s.apiKey)if((a=(i=t.app)==null?void 0:i.options)!=null&&a.projectId){if(!((o=(r=t.app)==null?void 0:r.options)!=null&&o.appId))throw new f(h.NO_APP_ID,'The "appId" field is empty in the local Firebase config. Firebase AI requires this field to contain a valid app ID.')}else throw new f(h.NO_PROJECT_ID,'The "projectId" field is empty in the local Firebase config. Firebase AI requires this field to contain a valid project ID.');else throw new f(h.NO_API_KEY,'The "apiKey" field is empty in the local Firebase config. Firebase AI requires this field to contain a valid API key.');const e={apiKey:t.app.options.apiKey,project:t.app.options.projectId,appId:t.app.options.appId,automaticDataCollectionEnabled:t.app.automaticDataCollectionEnabled,backend:t.backend};if(ni(t.app)&&t.app.settings.appCheckToken){const l=t.app.settings.appCheckToken;e.getAppCheckToken=()=>Promise.resolve({token:l})}else t.appCheck&&((c=t.options)!=null&&c.useLimitedUseAppCheckTokens?e.getAppCheckToken=()=>t.appCheck.getLimitedUseToken():e.getAppCheckToken=()=>t.appCheck.getToken());return t.auth&&(e.getAuthToken=()=>t.auth.getToken()),e}/**
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
 */class X{constructor(e,n){this._apiSettings=Di(e),this.model=X.normalizeModelName(n,this._apiSettings.backend.backendType)}static normalizeModelName(e,n){return n===L.GOOGLE_AI?X.normalizeGoogleAIModelName(e):X.normalizeVertexAIModelName(e)}static normalizeGoogleAIModelName(e){return`models/${e}`}static normalizeVertexAIModelName(e){let n;return e.includes("/")?e.startsWith("models/")?n=`publishers/google/${e}`:n=e:n=`publishers/google/models/${e}`,n}}/**
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
 */const Ti="Timeout has expired.",Re="AbortError";class $i{constructor(e){this.params=e}toString(){const e=new URL(this.baseUrl);return e.pathname=this.pathname,e.search=this.queryParams.toString(),e.toString()}get pathname(){return this.params.templateId?`${this.params.apiSettings.backend._getTemplatePath(this.params.apiSettings.project,this.params.templateId)}:${this.params.task}`:`${this.params.apiSettings.backend._getModelPath(this.params.apiSettings.project,this.params.model)}:${this.params.task}`}get baseUrl(){var e;return((e=this.params.singleRequestOptions)==null?void 0:e.baseUrl)??`https://${vi}`}get queryParams(){const e=new URLSearchParams;return this.params.stream&&e.set("alt","sse"),e}}function Ni(t){const e=[];return e.push(`${Ei}/${pt}`),e.push(`fire/${pt}`),(t.params.apiSettings.inferenceMode===I.PREFER_ON_DEVICE||t.params.apiSettings.inferenceMode===I.PREFER_IN_CLOUD)&&e.push(wi),e.join(" ")}async function Li(t){const e=new Headers;if(e.append("Content-Type","application/json"),e.append("x-goog-api-client",Ni(t)),e.append("x-goog-api-key",t.params.apiSettings.apiKey),t.params.apiSettings.automaticDataCollectionEnabled&&e.append("X-Firebase-Appid",t.params.apiSettings.appId),t.params.apiSettings.getAppCheckToken){const n=await t.params.apiSettings.getAppCheckToken();n&&(e.append("X-Firebase-AppCheck",n.token),n.error&&w.warn(`Unable to obtain a valid App Check token: ${n.error.message}`))}if(t.params.apiSettings.getAuthToken){const n=await t.params.apiSettings.getAuthToken();n&&e.append("Authorization",`Firebase ${n.accessToken}`)}return e}async function He(t,e){var l,u;const n=new $i(t);let s;const i=(l=t.singleRequestOptions)==null?void 0:l.signal,a=((u=t.singleRequestOptions)==null?void 0:u.timeout)!=null&&t.singleRequestOptions.timeout>=0?t.singleRequestOptions.timeout:Si,r=new AbortController,o=setTimeout(()=>{r.abort(new DOMException(Ti,Re)),w.debug(`Aborting request to ${n} due to timeout (${a}ms)`)},a),c=AbortSignal.any(i?[i,r.signal]:[r.signal]);if(i&&i.aborted)throw clearTimeout(o),new DOMException(i.reason??"Aborted externally before fetch",Re);try{const p={method:"POST",headers:await Li(n),signal:c,body:e};if(s=await fetch(n.toString(),p),!s.ok){let m="",y;try{const b=await s.json();m=b.error.message,b.error.details&&(m+=` ${JSON.stringify(b.error.details)}`,y=b.error.details)}catch{}throw s.status===403&&y&&y.some(b=>b.reason==="SERVICE_DISABLED")&&y.some(b=>{var A,k;return(k=(A=b.links)==null?void 0:A[0])==null?void 0:k.description.includes("Google developers console API activation")})?new f(h.API_NOT_ENABLED,`The Firebase AI SDK requires the Firebase AI API ('firebasevertexai.googleapis.com') to be enabled in your Firebase project. Enable this API by visiting the Firebase Console at https://console.firebase.google.com/project/${n.params.apiSettings.project}/ailogic/ and clicking "Get started". If you enabled this API recently, wait a few minutes for the action to propagate to our systems and then retry.`,{status:s.status,statusText:s.statusText,errorDetails:y}):new f(h.FETCH_ERROR,`Error fetching from ${n}: [${s.status} ${s.statusText}] ${m}`,{status:s.status,statusText:s.statusText,errorDetails:y})}}catch(p){let m=p;throw p.code!==h.FETCH_ERROR&&p.code!==h.API_NOT_ENABLED&&p instanceof Error&&p.name!==Re&&(m=new f(h.ERROR,`Error fetching from ${n.toString()}: ${p.message}`),m.stack=p.stack),m}finally{clearTimeout(o)}return s}/**
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
 */function ie(t){if(t.candidates&&t.candidates.length>0){if(t.candidates.length>1&&w.warn(`This response had ${t.candidates.length} candidates. Returning text from the first candidate only. Access response.candidates directly to use the other candidates.`),Kt(t.candidates[0]))throw new f(h.RESPONSE_ERROR,`Response error: ${V(t)}. Response body stored in error.response`,{response:t});return!0}else return!1}function D(t){return"type"in t&&t.type?t:t.text!==void 0?{...t,type:"text"}:t.inlineData!==void 0?{...t,type:"inlineData"}:t.functionCall!==void 0?{...t,type:"functionCall"}:t.functionResponse!==void 0?{...t,type:"functionResponse"}:t.fileData!==void 0?{...t,type:"fileData"}:t.executableCode!==void 0?{...t,type:"executableCode"}:t.codeExecutionResult!==void 0?{...t,type:"codeExecutionResult"}:t}function le(t,e=x.IN_CLOUD){var s,i;if((s=t.candidates)!=null&&s[0]&&!t.candidates[0].hasOwnProperty("index")&&(t.candidates[0].index=0),t.candidates)for(const a of t.candidates)(i=a.content)!=null&&i.parts&&(a.content.parts=a.content.parts.map(D));const n=ki(t);return n.inferenceSource=e,n}function ki(t){return t.text=()=>{if(ie(t))return ft(t,e=>!("thought"in e&&e.thought));if(t.promptFeedback)throw new f(h.RESPONSE_ERROR,`Text not available. ${V(t)}`,{response:t});return""},t.thoughtSummary=()=>{if(ie(t)){const e=ft(t,n=>!!("thought"in n&&n.thought));return e===""?void 0:e}else if(t.promptFeedback)throw new f(h.RESPONSE_ERROR,`Thought summary not available. ${V(t)}`,{response:t})},t.inlineDataParts=()=>{if(ie(t))return Pi(t);if(t.promptFeedback)throw new f(h.RESPONSE_ERROR,`Data not available. ${V(t)}`,{response:t})},t.functionCalls=()=>{if(ie(t))return Yt(t);if(t.promptFeedback)throw new f(h.RESPONSE_ERROR,`Function call not available. ${V(t)}`,{response:t})},t}function ft(t,e){var s,i,a,r;const n=[];if((i=(s=t.candidates)==null?void 0:s[0].content)!=null&&i.parts)for(const o of(r=(a=t.candidates)==null?void 0:a[0].content)==null?void 0:r.parts){const c=D(o);c.type==="text"&&e(c)&&n.push(c.text)}return n.length>0?n.join(""):""}function Yt(t){var n,s,i,a;if(!t)return;const e=[];if((s=(n=t.candidates)==null?void 0:n[0].content)!=null&&s.parts)for(const r of(a=(i=t.candidates)==null?void 0:i[0].content)==null?void 0:a.parts){const o=D(r);o.type==="functionCall"&&e.push(o.functionCall)}if(e.length>0)return e}function Pi(t){var n,s,i,a;const e=[];if((s=(n=t.candidates)==null?void 0:n[0].content)!=null&&s.parts)for(const r of(a=(i=t.candidates)==null?void 0:i[0].content)==null?void 0:a.parts){const o=D(r);o.type==="inlineData"&&e.push(o)}if(e.length>0)return e}const Mi=[S.RECITATION,S.SAFETY,S.BLOCKLIST,S.PROHIBITED_CONTENT,S.SPII,S.MALFORMED_FUNCTION_CALL,S.IMAGE_SAFETY,S.IMAGE_PROHIBITED_CONTENT,S.IMAGE_OTHER,S.NO_IMAGE,S.IMAGE_RECITATION,S.LANGUAGE,S.UNEXPECTED_TOOL_CALL,S.TOO_MANY_TOOL_CALLS,S.MISSING_THOUGHT_SIGNATURE,S.MALFORMED_RESPONSE];function Kt(t){return!!t.finishReason&&Mi.some(e=>e===t.finishReason)}function V(t){var n,s,i;let e="";if((!t.candidates||t.candidates.length===0)&&t.promptFeedback)e+="Response was blocked",(n=t.promptFeedback)!=null&&n.blockReason&&(e+=` due to ${t.promptFeedback.blockReason}`),(s=t.promptFeedback)!=null&&s.blockReasonMessage&&(e+=`: ${t.promptFeedback.blockReasonMessage}`);else if((i=t.candidates)!=null&&i[0]){const a=t.candidates[0];Kt(a)&&(e+=`Candidate was blocked due to ${a.finishReason}`,a.finishMessage&&(e+=`: ${a.finishMessage}`))}return e}/**
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
 */function je(t){if(t!=null){if(typeof t=="string")return{role:"system",parts:[{type:"text",text:t}]};if(t.type==="text"||"text"in t&&typeof t.text=="string")return{role:"system",parts:[H(D(t))]};if(t.parts){const e=t.parts.map(n=>H(D(n)));return t.role?{...t,parts:e}:{role:"system",parts:e}}}}function Q(t){let e=[];if(typeof t=="string")e=[{type:"text",text:t}];else for(const n of t)typeof n=="string"?e.push({type:"text",text:n}):e.push(H(D(n)));return xi(e)}function xi(t){const e={role:"user",parts:[]};let n=!1,s=!1;for(const i of t)i.type==="functionResponse"||"functionResponse"in i?s=!0:n=!0,e.parts.push(i);if(n&&s)throw new f(h.INVALID_CONTENT,"Within a single message, FunctionResponse cannot be mixed with other type of Part in the request for sending chat message.");if(!n&&!s)throw new f(h.INVALID_CONTENT,"No Content is provided for sending chat message.");return e}function _e(t){let e;if(t.contents){const n=t;e={...n,contents:n.contents.map(s=>({...s,parts:s.parts?s.parts.map(D):[]}))}}else e={contents:[Q(t)]};return t.systemInstruction&&(e.systemInstruction=je(t.systemInstruction)),e}function Fi(t){return t.parts&&Array.isArray(t.parts)?{...t,parts:t.parts.map(Ge)}:t}function Ge(t){let e;if("type"in t){const{type:n,...s}=t;e=s}else e=t;return e.functionResponse&&(e={...e,functionResponse:Fi(e.functionResponse)}),e}function qe(t){return t.parts?{...t,parts:t.parts.map(Ge)}:t}function Qt(t){return t==null||typeof t=="string"?t:"parts"in t&&Array.isArray(t.parts)?qe(t):Ge(t)}function Xt(t){const e={...t};return e.contents&&(e.contents=e.contents.map(qe)),e.systemInstruction&&(e.systemInstruction=Qt(e.systemInstruction)),e}function Bi(t){const e={...t};return e.contents&&(e.contents=e.contents.map(qe)),e.systemInstruction&&(e.systemInstruction=Qt(e.systemInstruction)),e}/**
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
 */function Zt(t){var e,n;if((e=t.safetySettings)==null||e.forEach(s=>{if(s.method)throw new f(h.UNSUPPORTED,"SafetySetting.method is not supported in the the Gemini Developer API. Please remove this property.")}),(n=t.generationConfig)!=null&&n.topK){const s=Math.round(t.generationConfig.topK);s!==t.generationConfig.topK&&(w.warn("topK in GenerationConfig has been rounded to the nearest integer to match the format for requests to the Gemini Developer API."),t.generationConfig.topK=s)}return t}function We(t){return{candidates:t.candidates?Vi(t.candidates):void 0,promptFeedback:t.promptFeedback?Hi(t.promptFeedback):void 0,usageMetadata:t.usageMetadata}}function Ui(t,e){return{generateContentRequest:{model:e,...t}}}function Vi(t){const e=[];let n;return e&&t.forEach(s=>{var r,o;let i;if(s.citationMetadata&&(i={citations:s.citationMetadata.citationSources}),s.safetyRatings&&(n=s.safetyRatings.map(c=>({...c,severity:c.severity??qt.HARM_SEVERITY_UNSUPPORTED,probabilityScore:c.probabilityScore??0,severityScore:c.severityScore??0}))),(o=(r=s.content)==null?void 0:r.parts)!=null&&o.some(c=>"videoMetadata"in c&&c.videoMetadata))throw new f(h.UNSUPPORTED,"Part.videoMetadata is not supported in the Gemini Developer API. Please remove this property.");const a={index:s.index,content:s.content,finishReason:s.finishReason,finishMessage:s.finishMessage,safetyRatings:n,citationMetadata:i,groundingMetadata:s.groundingMetadata,urlContextMetadata:s.urlContextMetadata};e.push(a)}),e}function Hi(t){const e=[];return(t.safetyRatings??[]).forEach(s=>{e.push({category:s.category,probability:s.probability,severity:s.severity??qt.HARM_SEVERITY_UNSUPPORTED,probabilityScore:s.probabilityScore??0,severityScore:s.severityScore??0,blocked:s.blocked})}),{blockReason:t.blockReason,safetyRatings:e,blockReasonMessage:t.blockReasonMessage}}/**
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
 */const mt=/^data\: (.*)(?:\n\n|\r\r|\r\n\r\n)/;async function ji(t,e,n){const s=t.body.pipeThrough(new TextDecoderStream("utf8",{fatal:!0})),i=zi(s),[a,r]=i.tee(),{response:o,firstValue:c}=await Gi(r,e,n);return{stream:Wi(a,e,n),response:o,firstValue:c}}async function Gi(t,e,n){const[s,i]=t.tee(),a=s.getReader(),{value:r}=await a.read();return{firstValue:r,response:qi(i,e,n)}}async function qi(t,e,n){const s=[],i=t.getReader();for(;;){const{done:a,value:r}=await i.read();if(a){let o=Ji(s);return e.backend.backendType===L.GOOGLE_AI&&(o=We(o)),le(o,n)}s.push(r)}}async function*Wi(t,e,n){var i,a;const s=t.getReader();for(;;){const{value:r,done:o}=await s.read();if(o)break;let c;e.backend.backendType===L.GOOGLE_AI?c=le(We(r),n):c=le(r,n);const l=(i=c.candidates)==null?void 0:i[0];!((a=l==null?void 0:l.content)!=null&&a.parts)&&!(l!=null&&l.finishReason)&&!(l!=null&&l.citationMetadata)&&!(l!=null&&l.urlContextMetadata)||(yield c)}}function zi(t){const e=t.getReader();return new ReadableStream({start(s){let i="";return a();function a(){return e.read().then(({value:r,done:o})=>{if(o){if(i.trim()){s.error(new f(h.PARSE_FAILED,"Failed to parse stream"));return}s.close();return}i+=r;let c=i.match(mt),l;for(;c;){try{l=JSON.parse(c[1])}catch{s.error(new f(h.PARSE_FAILED,`Error parsing JSON response: "${c[1]}`));return}s.enqueue(l),i=i.substring(c[0].length),c=i.match(mt)}return a()})}}})}function Ji(t){const e=t[t.length-1],n={promptFeedback:e==null?void 0:e.promptFeedback};for(const s of t)if(s.candidates)for(const i of s.candidates){const a=i.index||0;n.candidates||(n.candidates=[]),n.candidates[a]||(n.candidates[a]={index:i.index}),n.candidates[a].citationMetadata=i.citationMetadata,n.candidates[a].finishReason=i.finishReason,n.candidates[a].finishMessage=i.finishMessage,n.candidates[a].safetyRatings=i.safetyRatings,n.candidates[a].groundingMetadata=i.groundingMetadata;const r=i.urlContextMetadata;if(typeof r=="object"&&r!==null&&Object.keys(r).length>0&&(n.candidates[a].urlContextMetadata=r),i.content){if(!i.content.parts)continue;n.candidates[a].content||(n.candidates[a].content={role:i.content.role||"user",parts:[]});for(const o of i.content.parts){if("text"in o&&o.text==="")continue;if(Object.keys(o).length===0)throw new f(h.INVALID_CONTENT,"Part should have at least one property, but there are none. This is likely caused by a malformed response from the backend.");const c=D({...o});Object.keys(c).length>0&&n.candidates[a].content.parts.push(c)}}}return n}/**
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
 */const Yi=[h.FETCH_ERROR,h.ERROR,h.API_NOT_ENABLED];async function en(t,e,n,s){if(!e)return{response:await s(),inferenceSource:x.IN_CLOUD};switch(e.mode){case I.ONLY_ON_DEVICE:if(await e.isAvailable(t))return{response:await n(),inferenceSource:x.ON_DEVICE};throw new f(h.UNSUPPORTED,"Inference mode is ONLY_ON_DEVICE, but an on-device model is not available.");case I.ONLY_IN_CLOUD:return{response:await s(),inferenceSource:x.IN_CLOUD};case I.PREFER_IN_CLOUD:try{return{response:await s(),inferenceSource:x.IN_CLOUD}}catch(i){if(i instanceof f&&Yi.includes(i.code)&&await e.isAvailable(t))return{response:await n(),inferenceSource:x.ON_DEVICE};throw i}case I.PREFER_ON_DEVICE:return await e.isAvailable(t)?{response:await n(),inferenceSource:x.ON_DEVICE}:{response:await s(),inferenceSource:x.IN_CLOUD};default:throw new f(h.ERROR,`Unexpected infererence mode: ${e.mode}`)}}/**
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
 */async function Ki(t,e,n,s){return n=Xt(n),t.backend.backendType===L.GOOGLE_AI&&(n=Zt(n)),He({task:"streamGenerateContent",model:e,apiSettings:t,stream:!0,singleRequestOptions:s},JSON.stringify(n))}async function tn(t,e,n,s,i){const a=await en(n,s,()=>s.generateContentStream(n),()=>Ki(t,e,n,i));return ji(a.response,t,a.inferenceSource)}async function Qi(t,e,n,s){return n=Xt(n),t.backend.backendType===L.GOOGLE_AI&&(n=Zt(n)),He({model:e,task:"generateContent",apiSettings:t,stream:!1,singleRequestOptions:s},JSON.stringify(n))}async function nn(t,e,n,s,i){const a=await en(n,s,()=>s.generateContent(n),()=>Qi(t,e,n,i)),r=await Xi(a.response,t);return{response:le(r,a.inferenceSource)}}async function Xi(t,e){const n=await t.json();return e.backend.backendType===L.GOOGLE_AI?We(n):n}/**
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
 */const gt="SILENT_ERROR",yt=10;class Zi{constructor(e,n,s){this.params=n,this.requestOptions=s,this._history=[],this._sendPromise=Promise.resolve(),this._apiSettings=e}async getHistory(){return await this._sendPromise,H(this._history).map(e=>({...e,parts:e.parts?e.parts.map(D):[]}))}async _sendMessage(e,n){let s={};await this._sendPromise;const i=[];return this._sendPromise=this._sendPromise.then(async()=>{var c,l,u;let a,r=0;const o=((c=this.requestOptions)==null?void 0:c.maxSequentialFunctionCalls)??yt;do{let p;if(a){r++;const b=await this._callFunctionsAsNeeded(a);p=Q(b)}else p=Q(e);const m=this._formatRequest(p,[...i]);i.push(p);const y=await this._callGenerateContent(m,n);if(y)if(s=y,a=this._getCallableFunctionCalls(y.response),y.response.candidates&&y.response.candidates.length>0){const b={parts:((l=y.response.candidates)==null?void 0:l[0].content.parts)||[],role:((u=y.response.candidates)==null?void 0:u[0].content.role)||"model"};i.push(H(b))}else{const b=V(y.response);b&&w.warn(`sendMessage() was unsuccessful. ${b}. Inspect response object for details.`)}else a=void 0}while(a&&r<o);a&&r>=o&&w.warn(`Automatic function calling exceeded the limit of ${o} function calls. Returning last model response.`)}),await this._sendPromise,this._history=this._history.concat(i),s}async _sendMessageStream(e,n){await this._sendPromise;const s=[],a=(async()=>{var u;let r,o=0;const c=((u=this.requestOptions)==null?void 0:u.maxSequentialFunctionCalls)??yt;let l;do{let p;if(r){o++;const y=await this._callFunctionsAsNeeded(r);p=Q(y)}else p=Q(e);const m=this._formatRequest(p,[...s]);if(s.push(p),l=await this._callGenerateContentStream(m,n),r=this._getCallableFunctionCalls(l.firstValue),r&&l.firstValue&&l.firstValue.candidates&&l.firstValue.candidates.length>0){const y={...l.firstValue.candidates[0].content};y.role||(y.role="model"),s.push(y)}}while(r&&o<c);return r&&o>=c&&w.warn(`Automatic function calling exceeded the limit of ${c} function calls. Returning last model response.`),{stream:l.stream,response:l.response}})();return this._sendPromise=this._sendPromise.then(async()=>a).catch(r=>{throw new Error(gt)}).then(r=>r.response).then(r=>{if(r.candidates&&r.candidates.length>0){this._history=this._history.concat(s);const o={...r.candidates[0].content};o.role||(o.role="model"),this._history.push(H(o))}else{const o=V(r);o&&w.warn(`sendMessageStream() was unsuccessful. ${o}. Inspect response object for details.`)}}).catch(r=>{r.message!==gt&&r.name!=="AbortError"&&w.error(r)}),a}_getCallableFunctionCalls(e){var i,a,r;const n=(a=(i=this.params)==null?void 0:i.tools)==null?void 0:a.find(o=>o.functionDeclarations);if(!(n!=null&&n.functionDeclarations))return;const s=Yt(e);if(s){for(const o of s)if(!((r=n.functionDeclarations)==null?void 0:r.some(l=>l.name===o.name&&typeof l.functionReference=="function")))return;return s}}async _callFunctionsAsNeeded(e){var a,r;const n=[],s=[],i=(r=(a=this.params)==null?void 0:a.tools)==null?void 0:r.find(o=>o.functionDeclarations);if(i&&i.functionDeclarations){for(const c of e){const l=i.functionDeclarations.find(u=>u.name===c.name);if(l!=null&&l.functionReference){const u=Promise.resolve(l.functionReference(c.args)).catch(p=>{const m=new f(h.ERROR,`Error in user-defined function "${l.name}": ${p.message}`);throw m.stack=p.stack,m});n.push({name:c.name,id:c.id,results:u}),s.push(u)}}await Promise.all(s);const o=[];for(const{name:c,id:l,results:u}of n){const p={name:c,response:await u};l&&(p.id=l),o.push({type:"functionResponse",functionResponse:p})}return o}else throw new f(h.REQUEST_ERROR,'No function declarations were provided in "tools".')}}/**
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
 */const ea=["text","inlineData","functionCall","functionResponse","thought","thoughtSignature"],ta={user:["text","inlineData","functionResponse"],function:["functionResponse"],model:["text","functionCall","thought","thoughtSignature"],system:["text"]},bt={user:["model"],function:["model"],model:["user","function"],system:[]};function na(t){let e=null;for(const n of t){const{role:s,parts:i}=n;if(!e&&s!=="user")throw new f(h.INVALID_CONTENT,`First Content should be with role 'user', got ${s}`);if(!ht.includes(s))throw new f(h.INVALID_CONTENT,`Each item should include role field. Got ${s} but valid roles are: ${JSON.stringify(ht)}`);if(!Array.isArray(i))throw new f(h.INVALID_CONTENT,"Content should have 'parts' property with an array of Parts");if(i.length===0)throw new f(h.INVALID_CONTENT,"Each Content should have at least one part");const a={text:0,inlineData:0,functionCall:0,functionResponse:0,thought:0,thoughtSignature:0,fileData:0,executableCode:0,codeExecutionResult:0};for(const o of i){if(o.type)a[o.type]+=1;else for(const c of["text","inlineData","functionCall","functionResponse","fileData","executableCode","codeExecutionResult"])c in o&&(a[c]+=1);"thought"in o&&o.thought&&(a.thought+=1),"thoughtSignature"in o&&o.thoughtSignature&&(a.thoughtSignature+=1)}const r=ta[s];for(const o of ea)if(!r.includes(o)&&a[o]>0)throw new f(h.INVALID_CONTENT,`Content with role '${s}' can't contain '${o}' part`);if(e&&!bt[s].includes(e.role))throw new f(h.INVALID_CONTENT,`Content with role '${s}' can't follow '${e.role}'. Valid previous roles: ${JSON.stringify(bt)}`);e=n}}/**
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
 */class sa extends Zi{constructor(e,n,s,i,a){var r;super(e,i,a),this.model=n,this.chromeAdapter=s,this.params=i,this.requestOptions=a,i!=null&&i.history&&(na(i.history),this._history=H(i.history)),((r=this.params)==null?void 0:r.systemInstruction)!=null&&(this.params={...this.params,systemInstruction:je(this.params.systemInstruction)})}_formatRequest(e,n){var s,i,a,r,o;return{safetySettings:(s=this.params)==null?void 0:s.safetySettings,generationConfig:(i=this.params)==null?void 0:i.generationConfig,tools:(a=this.params)==null?void 0:a.tools,toolConfig:(r=this.params)==null?void 0:r.toolConfig,systemInstruction:(o=this.params)==null?void 0:o.systemInstruction,contents:[...this._history,...n,e]}}_callGenerateContent(e,n){return nn(this._apiSettings,this.model,e,this.chromeAdapter,{...this.requestOptions,...n})}_callGenerateContentStream(e,n){return tn(this._apiSettings,this.model,e,this.chromeAdapter,{...this.requestOptions,...n})}async sendMessage(e,n){return this._sendMessage(e,n)}async sendMessageStream(e,n){return this._sendMessageStream(e,n)}}/**
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
 */async function ia(t,e,n,s){n=Bi(n);let i="";if(t.backend.backendType===L.GOOGLE_AI){const r=Ui(n,e);i=JSON.stringify(r)}else i=JSON.stringify(n);return(await He({model:e,task:"countTokens",apiSettings:t,stream:!1,singleRequestOptions:s},i)).json()}async function aa(t,e,n,s,i){if((s==null?void 0:s.mode)===I.ONLY_ON_DEVICE)throw new f(h.UNSUPPORTED,"countTokens() is not supported for on-device models.");return ia(t,e,n,i)}/**
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
 */class ra extends X{constructor(e,n,s,i){super(e,n.model),this.chromeAdapter=i,this.generationConfig=n.generationConfig||{},oa(this.generationConfig),this.safetySettings=n.safetySettings||[],this.tools=n.tools,this.toolConfig=n.toolConfig,this.systemInstruction=je(n.systemInstruction),this.requestOptions=s||{}}async initializeDeviceModel(e){if(!this.chromeAdapter||this.chromeAdapter.mode===I.ONLY_IN_CLOUD)return;if(await this.chromeAdapter.downloadIfAvailable(e)===T.UNAVAILABLE){const s=new f(h.API_NOT_ENABLED,"Local LanguageModel API not available in this environment.");if(this.chromeAdapter.mode===I.ONLY_ON_DEVICE)throw s;w.debug(s.message)}await this.chromeAdapter.downloadPromise}async generateContent(e,n){const s=_e(e);return nn(this._apiSettings,this.model,{generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,...s},this.chromeAdapter,{...this.requestOptions,...n})}async generateContentStream(e,n){const s=_e(e),{stream:i,response:a}=await tn(this._apiSettings,this.model,{generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,...s},this.chromeAdapter,{...this.requestOptions,...n});return{stream:i,response:a}}startChat(e){return new sa(this._apiSettings,this.model,this.chromeAdapter,{tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,generationConfig:this.generationConfig,safetySettings:this.safetySettings,...e},this.requestOptions)}async countTokens(e,n){const s=_e(e);return aa(this._apiSettings,this.model,s,this.chromeAdapter,{...this.requestOptions,...n})}}function oa(t){var e,n;if(((e=t.thinkingConfig)==null?void 0:e.thinkingBudget)!=null&&((n=t.thinkingConfig)!=null&&n.thinkingLevel))throw new f(h.UNSUPPORTED,"Cannot set both thinkingBudget and thinkingLevel in a config.");if(t.responseSchema!=null&&t.responseJsonSchema!=null)throw new f(h.UNSUPPORTED,"Cannot set both responseSchema and responseJsonSchema in a config.");if((t.responseSchema!=null||t.responseJsonSchema!=null)&&t.responseMimeType!=="application/json"&&t.responseMimeType!=="text/x.enum")throw new f(h.UNSUPPORTED,'responseMimeType must be set to "application/json" or "text/x.enum" if responseSchema or responseJsonSchema are set.')}/**
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
 */function ca(t=ai(),e){t=is(t);const n=ti(t,z),s=(e==null?void 0:e.backend)??new ue,i=Ri(s),a=n.getImmediate({identifier:i}),r=a.options;if(r){const o=e==null?void 0:e.useLimitedUseAppCheckTokens,c=!!r.useLimitedUseAppCheckTokens;if(o!=null&&!!o!==c)throw new f(h.ALREADY_INITIALIZED,`getAI() has already been called for app "${t.name}" and this backend with useLimitedUseAppCheckTokens: ${c}. This option cannot be changed after the AI instance has been initialized. Pass the desired options to the first getAI() call for this app and backend, or omit useLimitedUseAppCheckTokens to reuse the existing instance.`);return a}return a.options={useLimitedUseAppCheckTokens:(e==null?void 0:e.useLimitedUseAppCheckTokens)??!1},a}const la=["mode","onDeviceParams","inCloudParams"];function vt(t,e,n){var o;const s=e;let i;if(s.mode){for(const c of Object.keys(e))la.includes(c)||w.warn(`When a hybrid inference mode is specified (mode is currently set to ${s.mode}), "${c}" cannot be configured at the top level. Configuration for in-cloud and on-device must be done separately in inCloudParams and onDeviceParams. Configuration values set outside of inCloudParams and onDeviceParams will be ignored.`);i=s.inCloudParams||{model:Ii}}else i=e;if(!i.model)throw new f(h.NO_MODEL,"Must provide a model name. Example: getGenerativeModel({ model: 'my-model-name' })");const a=(o=t.chromeAdapterFactory)==null?void 0:o.call(t,s.mode,typeof window>"u"?void 0:window,s.onDeviceParams),r=new ra(t,i,n,a);return r._apiSettings.inferenceMode=s.mode,r}/**
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
 */function da(){oe(new Z(z,Oi,"PUBLIC").setMultipleInstances(!0)),q(ut,xe),q(ut,xe,"esm2020")}da();const sn={apiKey:"AIzaSyDTRSNOTm_Zff4qR9RU9KsWNjUB52ku1kw",authDomain:"proofgate-f1e4d.firebaseapp.com",projectId:"proofgate-f1e4d",storageBucket:"proofgate-f1e4d.firebasestorage.app",messagingSenderId:"639820381603",appId:"1:639820381603:web:671e5939afbfd3489f2e16"};function ua(t){return!!(t&&typeof t.apiKey=="string"&&t.apiKey.length>0&&typeof t.projectId=="string"&&t.projectId.length>0&&typeof t.appId=="string"&&t.appId.length>0)}const ae="gemini-2.5-flash",pa="gemini-nano (on-device, via Firebase AI Logic)";function ha(t=sn){return ua(t)?{configured:!0,mode:"firebase",detail:"Firebase configured. Model pass runs through Firebase AI Logic hybrid inference (on-device Gemini Nano preferred, cloud escalation when needed)."}:{configured:!1,mode:"mock",detail:"Demo mode (mock): Firebase is not configured, so the model pass is the local deterministic mock. Deterministic checks are fully real."}}function Et(t){return["You are the model pass inside ProofGate, a claim-verification tool.","Deterministic code has already checked this claim's numbers, dates, units and citations.","Your job is only to judge whether the claim's wording is supported, contradicted, or uncertain on its face.","Respond with a single JSON object and nothing else:",'{"label": "supports" | "contradicts" | "uncertain" | "not-applicable", "confidence": <number 0..1>, "rationale": "<one short sentence>"}',"",`Claim: ${t}`].join(`
`)}const fa=new Set(["supports","contradicts","uncertain","not-applicable"]);function wt(t,e,n,s){const i=p=>({claimId:e,label:"uncertain",confidence:0,rationale:`Model response could not be used (${p}); recorded as uncertain.`,source:n,modelId:s});let a=t.trim();const r=a.match(/```(?:json)?\s*([\s\S]*?)```/);r&&(a=r[1].trim());const o=a.indexOf("{"),c=a.lastIndexOf("}");if(o===-1||c<=o)return i("no JSON object found");let l;try{l=JSON.parse(a.slice(o,c+1))}catch{return i("invalid JSON")}if(typeof l!="object"||l===null)return i("JSON was not an object");const u=l;return typeof u.label!="string"||!fa.has(u.label)?i("missing or invalid label"):typeof u.confidence!="number"||!Number.isFinite(u.confidence)?i("missing or invalid confidence"):{claimId:e,label:u.label,confidence:Math.min(1,Math.max(0,u.confidence)),rationale:typeof u.rationale=="string"?u.rationale:"",source:n,modelId:s}}function ma(t){return[...St(t),...Rt(t),...At(t),...Ct(t)].some(n=>n.status==="warn")}function an(t){return t instanceof Error?t.message:String(t)}class ga{constructor(e){Y(this,"name","firebase-ai-logic");Y(this,"app");Y(this,"ai");this.app=ot().length>0?ot()[0]:Ht(e),this.ai=ca(this.app,{backend:new ue})}async analyze(e){if(Ot(e,ma(e)).tier==="cloud")return this.callCloud(e);try{const i=await vt(this.ai,{mode:I.PREFER_ON_DEVICE,inCloudParams:{model:ae}}).generateContent(Et(e.text)),a=i.response.inferenceSource==="in_cloud",r=a?"cloud":"on-device";return wt(i.response.text(),e.id,r,a?ae:pa)}catch(s){const i=await this.callCloud(e);return{...i,rationale:`On-device pass unavailable (${an(s)}); escalated to cloud. ${i.rationale}`}}}async callCloud(e){const s=await vt(this.ai,{mode:I.ONLY_IN_CLOUD,inCloudParams:{model:ae}}).generateContent(Et(e.text));return wt(s.response.text(),e.id,"cloud",ae)}}function ya(t=sn){const e=ha(t);if(e.mode==="firebase"&&t)try{return{adapter:new ga(t),status:e}}catch(n){return{adapter:new Te,status:{configured:!0,mode:"mock",detail:`Demo mode (mock): Firebase is configured but failed to initialise (${an(n)}), so the local deterministic mock is running instead.`}}}return{adapter:new Te,status:e}}const{adapter:rn,status:W}=ya(),d={screen:"new",sourceType:"Invoice",inputText:"",running:!1,pipeline:["pending","pending","pending","pending","pending"],currentReport:null,currentSourceType:"Invoice",reportReplay:null,history:de(window.localStorage),historyQuery:"",historyVerdict:"ALL",historySource:"ALL",historyDays:void 0,historyReplay:null},Fe=["Split into atomic claims","Deterministic checks","On-device Gemini Nano first pass","Escalate to cloud Gemini only when needed","Generate Proof Report"],ba={arithmetic:"Arithmetic",dates:"Dates",units:"Units",citations:"Citations","numeric-consistency":"Numbers"};function g(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function on(t){const e=new Date(t);return Number.isNaN(e.getTime())?t:e.toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})}function va(t){const e=new Date(t);return Number.isNaN(e.getTime())?t:`${on(t)}, ${e.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"})}`}function ze(t){return`<span class="chip ${t==="PASS"?"chip-pass":t==="FAIL"?"chip-fail":"chip-review"}">${t==="PASS"?"✓":t==="FAIL"?"✕":"⚠"} ${g(t)}</span>`}function Ea(t){switch(t){case"pass":return'<span class="chip chip-pass">Pass</span>';case"fail":return'<span class="chip chip-fail">Fail</span>';case"warn":return'<span class="chip chip-review">Needs review</span>';default:return'<span class="chip chip-neutral">N/A</span>'}}function cn(t){const e=Number.parseInt(t.replace(/\D/g,""),10);return`Claim C-${Number.isNaN(e)?t:String(e).padStart(2,"0")}`}function F(t){const e=document.querySelector(t);if(!e)throw new Error(`Missing element: ${t}`);return e}const wa=t=>new Promise(e=>setTimeout(e,t));async function Sa(){const t=d.inputText;if(!t.trim()||d.running)return;d.running=!0,d.pipeline=["in-progress","pending","pending","pending","pending"],R();const e=Dt(t,{adapter:rn});for(let s=0;s<Fe.length-1;s++)await wa(160),d.pipeline[s]="done",d.pipeline[s+1]="in-progress",Oa();const n=await e;d.pipeline=Fe.map(()=>"done"),d.running=!1,d.currentReport=n,d.currentSourceType=d.sourceType,d.reportReplay=null,d.history=Mn(window.localStorage,n,d.sourceType,new Date().toISOString()),d.screen="report",j()}async function ln(t){const e=await Dt(t.inputText,{adapter:rn});return Vn(t,e)}function dn(t,e){const n=d.history.find(s=>s.key===t.contentHash);n&&(d.history=xn(window.localStorage,n.key,{replayCount:n.replayCount+1,lastReplayAt:new Date().toISOString(),lastReplayMatches:e.matches}))}async function Ia(){if(!d.currentReport||d.running)return;d.running=!0,R();const t=await ln(d.currentReport);d.running=!1,d.reportReplay=t,dn(d.currentReport,t),j()}async function Ra(t){if(d.running)return;d.running=!0,R();const e=await ln(t.report);d.running=!1,d.historyReplay={key:t.key,title:t.title,comparison:e},dn(t.report,e),j()}function _a(t){const e=new Blob([JSON.stringify(t,null,2)],{type:"application/json"}),n=URL.createObjectURL(e),s=document.createElement("a");s.href=n,s.download=`proofgate-report-${t.id}.json`,s.click(),URL.revokeObjectURL(n)}function j(){const t=F("#app");t.innerHTML=`
    <header class="topbar">
      <img class="lockup" src="/logo-lockup.png" alt="ProofGate" />
      <div class="spacer"></div>
      ${W.mode==="mock"?'<span class="chip chip-review">Demo mode (mock model)</span>':'<span class="chip chip-pass">Firebase AI Logic connected</span>'}
    </header>
    <nav class="sidebar">
      <button class="nav-item ${d.screen==="new"?"active":""}" data-nav="new">▣&nbsp; New Verification</button>
      <button class="nav-item ${d.screen==="report"?"active":""}" data-nav="report">▥&nbsp; Reports</button>
      <button class="nav-item ${d.screen==="history"?"active":""}" data-nav="history">◷&nbsp; History &amp; Replay</button>
      <div class="side-note">Verify before you trust.<br />Deterministic checks first, models second, a deterministic gate decides.</div>
    </nav>
    <main class="content"><div class="content-inner" id="screen"></div></main>
  `,t.querySelectorAll("[data-nav]").forEach(e=>{e.addEventListener("click",()=>{d.screen=e.dataset.nav,j()})}),R()}function R(){const t=document.querySelector("#screen");t&&(d.screen==="new"?Da(t):d.screen==="report"?Na(t):ka(t))}function Aa(){const t=e=>e==="done"?'<span class="status-tag green">Done</span>':e==="in-progress"?'<span class="status-tag blue">In progress</span>':'<span class="status-tag">Pending</span>';return Fe.map((e,n)=>{const s=d.pipeline[n];return`<li class="${s==="done"?"done":s==="in-progress"?"in-progress":""}">
      <span class="dot">${s==="done"?"✓":""}</span>
      <span class="step-name">${n+1}. ${g(e)}</span>${t(s)}
    </li>`}).join("")}function Ca(){return`
    <div class="runtime-row">
      <div class="grow">
        <div class="rt-title">On-device Gemini Nano</div>
        <div class="rt-sub">Private first pass via Firebase AI Logic hybrid inference</div>
      </div>
      ${W.mode==="mock"?'<span class="status-tag amber">Demo mode (mock)</span>':'<span class="status-tag blue">Configured</span>'}
    </div>
    <div class="runtime-row">
      <div class="grow">
        <div class="rt-title">Cloud escalation</div>
        <div class="rt-sub">Triggered only for unresolved or high-stakes claims</div>
      </div>
      <span class="status-tag">On demand</span>
    </div>
    <p class="small muted" style="margin:12px 0 0">${g(W.detail)}</p>
  `}function un(){const t=d.currentReport;return`
    <div class="card">
      <h3 style="margin-bottom:12px">Verification Pipeline</h3>
      <ol class="pipeline">${Aa()}</ol>
    </div>
    <div class="card">
      <h3 style="margin-bottom:12px">Runtime Indicators</h3>
      ${Ca()}
    </div>
    <div class="card">
      <h3 style="margin-bottom:12px">Expected Output</h3>
      ${t?`<div class="verdict-counts" style="margin-bottom:8px">
               ${ze(t.summary.overallVerdict)}
               <span class="chip chip-pass">Pass ${t.summary.pass}</span>
               <span class="chip chip-review">Review ${t.summary.needsReview}</span>
               <span class="chip chip-fail">Fail ${t.summary.fail}</span>
             </div>
             <p class="small muted" style="margin:0">Latest run: ${g(Be(t))}. Open the Reports tab for the full Proof Report.</p>`:'<p class="small muted" style="margin:0">A Proof Report with a verdict and evidence for every claim: PASS, NEEDS REVIEW, or FAIL, sealed with a SHA-256 content hash so it can be replayed and re-verified.</p>'}
    </div>
  `}function Oa(){const t=document.querySelector("#side-panel");t&&(t.innerHTML=un())}function Da(t){const e=Ae(d.inputText).length;t.innerHTML=`
    <div class="page-head">
      <h1>New Verification</h1>
      <p>Paste content to extract claims and verify before you trust.</p>
    </div>
    ${W.mode==="mock"?`<div class="demo-banner"><strong>Demo mode (mock model).</strong> ${g(W.detail)}</div>`:`<div class="firebase-banner">${g(W.detail)}</div>`}
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
          ${Tt.map(s=>`<button class="seg-btn ${s===d.sourceType?"active":""}" data-source="${g(s)}">${g(s)}</button>`).join("")}
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
      <aside id="side-panel">${un()}</aside>
    </div>
  `,t.querySelectorAll("[data-source]").forEach(s=>{s.addEventListener("click",()=>{d.sourceType=s.dataset.source,R()})});const n=F("#input-area");n.addEventListener("input",()=>{d.inputText=n.value;const s=Ae(n.value).length,i=document.querySelector("#claim-count");i&&(i.textContent=`${s} claims extracted`);const a=document.querySelector("#claim-progress");a&&(a.style.width=s>0?"100%":"0%")}),F("#btn-clear").addEventListener("click",()=>{d.inputText="",R()}),F("#btn-sample").addEventListener("click",()=>{d.inputText=Ln[d.sourceType],R()}),F("#btn-verify").addEventListener("click",()=>{Sa()})}function Ta(t){const e=Object.entries(t);if(e.length===0)return"";const n=e.map(([s,i])=>`${s}: ${JSON.stringify(i)}`).join(" · ");return`<div class="kv">${g(n)}</div>`}function $a(t){const e=t.modelOutput,n=t.checks.map(s=>`<div class="check-row">
        <div class="check-main">
          <span class="check-label">${g(ba[s.validator]??s.validator)}:</span>
          ${g(s.detail)}
          ${s.status==="fail"||s.status==="warn"?Ta(s.evidence):""}
        </div>
        ${Ea(s.status)}
      </div>`).join("");return`
    <div class="card claim-card">
      <div class="claim-head">
        <span class="chip chip-tint">${g(cn(t.claim.id))}</span>
        <span class="claim-text">${g(t.claim.text)}</span>
        ${ze(t.verdict)}
      </div>
      <div class="claim-body">
        <div class="evidence-box">
          <h4>Evidence</h4>
          <ul>${t.reasons.map(s=>`<li>${g(s)}</li>`).join("")}</ul>
          ${e?`<p style="margin:12px 0 0"><strong>Model pass</strong> (${g(e.source)} · ${g(e.modelId)}): ${g(e.label)}, confidence ${e.confidence.toFixed(2)}.<br />${g(e.rationale)}</p>`:'<p style="margin:12px 0 0"><strong>Model pass:</strong> not run for this claim (deterministic-only routing).</p>'}
        </div>
        <div class="checks-box">
          <h4>Deterministic checks</h4>
          ${n}
        </div>
      </div>
    </div>
  `}function pn(t){if(t.matches)return`<div class="replay-result ok"><strong>Replay matched.</strong> Re-running the pipeline reproduced every verdict (overall ${g(t.replayOverall)}).</div>`;const e=t.claims.filter(n=>n.changed);return`<div class="replay-result diff"><strong>Replay differs on ${t.changedCount} claim(s).</strong>
    <ul>${e.map(n=>`<li>${g(cn(n.claimId))}: ${g(n.originalVerdict)} → ${g(n.replayVerdict??"missing")} — ${g(n.claimText)}</li>`).join("")}</ul></div>`}function Na(t){const e=d.currentReport;if(!e){t.innerHTML=`
      <div class="page-head"><h1>Proof Report</h1><p>Replayable verification results for the submitted content.</p></div>
      <div class="card empty-state">
        <h3>No report yet</h3>
        <p>Run a verification first, and its Proof Report will appear here.</p>
        <button class="btn btn-primary" id="go-new">Start a verification</button>
      </div>`,F("#go-new").addEventListener("click",()=>{d.screen="new",j()});return}const n=$n(e);t.innerHTML=`
    <div class="page-head">
      <h1>Proof Report</h1>
      <p>Replayable verification results for the submitted content.</p>
    </div>
    <div class="card">
      <div class="report-meta">
        <div><h3>${g(Be(e))}</h3></div>
        <div class="meta-block"><div class="caption">Source</div><span class="chip chip-outline">${g(d.currentSourceType)}</span></div>
        <div class="meta-block"><div class="caption">Created</div><span class="small">${g(va(e.createdAt))}</span></div>
        <div class="meta-block"><div class="caption">Processing mode</div><span class="small">${g(Hn(e))}</span></div>
        <div class="spacer"></div>
        <button class="btn btn-small" id="btn-export">Export JSON</button>
        <button class="btn btn-primary btn-small" id="btn-replay" ${d.running?"disabled":""}>${d.running?"Replaying…":"Replay report"}</button>
      </div>
      <div style="margin-top:16px; display:flex; gap:8px; flex-wrap:wrap">
        <span class="chip chip-pass">✓ Report complete</span>
        ${ze(e.summary.overallVerdict)}
        <span class="chip ${n?"chip-tint":"chip-fail"}">${n?"Seal verified (SHA-256)":"Seal broken"}</span>
        <span class="chip chip-outline mono">${g(e.id)}</span>
      </div>
      <div class="summary-grid">
        <div class="summary-card pass"><span class="chip chip-pass">✓ Pass</span><div class="count">${e.summary.pass} claims</div></div>
        <div class="summary-card review"><span class="chip chip-review">⚠ Needs review</span><div class="count">${e.summary.needsReview} claims</div></div>
        <div class="summary-card fail"><span class="chip chip-fail">✕ Fail</span><div class="count">${e.summary.fail} claims</div></div>
      </div>
      ${d.reportReplay?pn(d.reportReplay):""}
    </div>
    ${e.claims.map($a).join("")}
  `,F("#btn-export").addEventListener("click",()=>_a(e)),F("#btn-replay").addEventListener("click",()=>{Ia()})}function La(t){return t==="PASS"?'<span class="chip chip-pass">Complete</span>':t==="FAIL"?'<span class="chip chip-fail">Failed</span>':'<span class="chip chip-review">Needs Review</span>'}function ka(t){var a,r,o;const e=Un(d.history,new Date().toISOString()),n=Bn(d.history,{query:d.historyQuery,verdict:d.historyVerdict,sourceType:d.historySource,withinDays:d.historyDays,now:new Date().toISOString()}),s=n.map(c=>{var u;const l=c.report.summary;return`<tr>
        <td>
          <div class="row-title">${g(c.title)}</div>
          <div class="row-sub">${g(((u=c.report.claims[0])==null?void 0:u.claim.text)??"")}</div>
          ${c.replayCount>0?`<div class="row-sub">Replayed ${c.replayCount}× · last replay ${c.lastReplayMatches?"matched":"differed"}</div>`:""}
        </td>
        <td><span class="chip chip-outline">${g(c.sourceType)}</span></td>
        <td>${g(on(c.savedAt))}</td>
        <td><div class="verdict-counts">
          <span class="chip chip-pass">Pass ${l.pass}</span>
          <span class="chip chip-review">Review ${l.needsReview}</span>
          <span class="chip chip-fail">Fail ${l.fail}</span>
        </div></td>
        <td>${La(l.overallVerdict)}</td>
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
          ${Tt.map(c=>`<option value="${g(c)}" ${d.historySource===c?"selected":""}>${g(c)}</option>`).join("")}
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
    ${d.historyReplay?`<div class="card"><h3 style="margin-bottom:8px">Replay — ${g(d.historyReplay.title)}</h3>${pn(d.historyReplay.comparison)}</div>`:""}
    <div class="card">
      ${d.history.length===0?'<div class="empty-state"><h3>No reports in history</h3><p>Reports you generate are stored locally in this browser and listed here.</p></div>':n.length===0?'<div class="empty-state"><h3>No reports match the current filters</h3><p>Try a different search or filter.</p></div>':`<table class="history-table">
                <thead><tr><th>Report title</th><th>Source type</th><th>Date</th><th>Verdict (claims)</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>${s}</tbody>
              </table>`}
    </div>
  `;const i=t.querySelector("#history-search");i==null||i.addEventListener("input",()=>{d.historyQuery=i.value,R();const c=document.querySelector("#history-search");c==null||c.focus(),c==null||c.setSelectionRange(c.value.length,c.value.length)}),(a=t.querySelector("#history-verdict"))==null||a.addEventListener("change",c=>{d.historyVerdict=c.target.value,R()}),(r=t.querySelector("#history-source"))==null||r.addEventListener("change",c=>{d.historySource=c.target.value,R()}),(o=t.querySelector("#history-days"))==null||o.addEventListener("change",c=>{const l=c.target.value;d.historyDays=l==="all"?void 0:Number.parseInt(l,10),R()}),t.querySelectorAll("[data-view]").forEach(c=>{c.addEventListener("click",()=>{const l=d.history.find(u=>u.key===c.dataset.view);l&&(d.currentReport=l.report,d.currentSourceType=l.sourceType,d.reportReplay=null,d.screen="report",j())})}),t.querySelectorAll("[data-replay]").forEach(c=>{c.addEventListener("click",()=>{const l=d.history.find(u=>u.key===c.dataset.replay);l&&Ra(l)})}),t.querySelectorAll("[data-delete]").forEach(c=>{c.addEventListener("click",()=>{d.history=Fn(window.localStorage,c.dataset.delete),R()})})}j();
