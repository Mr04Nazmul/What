/* Real date planner, saved locally. OS Calendar export supports recurring event alarms. */
(()=>{"use strict";
const $=id=>document.getElementById(id);
const KEY="jgg-collection-rules-v1";
const types=[
{id:"burnable",name:"Burnable",emoji:"🔥",color:"#f57763"},
{id:"plastic",name:"Plastic",emoji:"🧴",color:"#4e9fe3"},
{id:"cans",name:"Bottles / Cans",emoji:"♻️",color:"#30a781"},
{id:"paper",name:"Paper",emoji:"📦",color:"#c4904b"},
{id:"nonburnable",name:"Non-burnable",emoji:"🗑️",color:"#9187c9"}
];
const nowTokyo=()=>{const p=new Intl.DateTimeFormat("en-US",{timeZone:"Asia/Tokyo",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(new Date());const f=x=>Number(p.find(i=>i.type===x)?.value);return new Date(Date.UTC(f("year"),f("month")-1,f("day")))};
const dateKey=d=>d.toISOString().slice(0,10);
const human=d=>d.toLocaleDateString("en-US",{timeZone:"UTC",weekday:"short",month:"short",day:"numeric"});
const addDays=(d,n)=>new Date(d.getTime()+n*86400000);
const id=()=>Math.random().toString(36).slice(2)+Date.now().toString(36);
function load(){try{let s=JSON.parse(localStorage.getItem(KEY)||"[]");return Array.isArray(s)?s.filter(x=>x&&types.some(t=>t.id===x.type)&&Number.isInteger(Number(x.weekday))&&Number(x.weekday)>=0&&Number(x.weekday)<=6&&[1,2,4].includes(Number(x.interval))):[]}catch(e){return[]}}
let rules=load(),offset=0;
function save(){try{localStorage.setItem(KEY,JSON.stringify(rules))}catch(e){setStatus("Could not save on this device.")}}
function setStatus(t){const e=$("plannerStatus");if(e)e.textContent=t}
const typeFor=id=>types.find(t=>t.id===id)||types[0];
function validOn(d,rule){if(d.getUTCDay()!==Number(rule.weekday))return false;const y=d.getUTCFullYear(),m=d.getUTCMonth()+1,day=d.getUTCDate();const occurrence=Math.ceil(day/7);return Number(rule.interval)===1||Number(rule.interval)===2&&[1,3].includes(occurrence)||Number(rule.interval)===4&&occurrence===Number(rule.ordinal||1)}
function entries(d){return rules.filter(r=>validOn(d,r))}
function renderCalendar(){
 const cal=$("calendar");if(!cal)return;cal.replaceChildren();
 const today=nowTokyo();const month=new Date(Date.UTC(today.getUTCFullYear(),today.getUTCMonth()+offset,1));
 const title=$("calTitle");if(title)title.textContent=month.toLocaleDateString("en-US",{timeZone:"UTC",month:"long",year:"numeric"});
 const old=cal.parentElement?.querySelector(".month-label");if(old)old.textContent="";
 for(const w of ["Su","Mo","Tu","We","Th","Fr","Sa"]){const x=document.createElement("span");x.textContent=w;x.className="planner-weekday";cal.append(x)}
 for(let p=0;p<month.getUTCDay();p++){const x=document.createElement("span");x.className="planner-blank";cal.append(x)}
 const days=new Date(Date.UTC(month.getUTCFullYear(),month.getUTCMonth()+1,0)).getUTCDate();
 for(let d=1;d<=days;d++){const date=new Date(Date.UTC(month.getUTCFullYear(),month.getUTCMonth(),d));const events=entries(date);const b=document.createElement("button");b.type="button";b.className="planner-day"+(dateKey(date)===dateKey(today)?" is-today":"");b.textContent=String(d);b.setAttribute("aria-label",human(date)+": "+(events.length?events.map(x=>typeFor(x.type).name).join(", "):"No saved collection rule"));
 const dots=document.createElement("div");dots.className="planner-dots";for(const e of events.slice(0,4)){const dot=document.createElement("i");dot.style.background=typeFor(e.type).color;dots.append(dot)}b.append(dots);b.onclick=()=>{const x=$("plannerSelectedDay");if(x)x.textContent=human(date)+": "+(events.length?events.map(e=>typeFor(e.type).name).join(" · "):"No collection rule saved")};cal.append(b)}
 const badge=cal.closest("#schedulePanel")?.querySelector(".status");if(badge)badge.textContent=rules.length?"My saved schedule":"Set your collection days";
}
function renderRules(){
 const list=$("plannerRules");if(!list)return;list.replaceChildren();
 if(!rules.length){const p=document.createElement("p");p.className="planner-empty";p.textContent="No collection days set. Choose your actual municipality schedule below.";list.append(p);return}
 for(const r of rules){const t=typeFor(r.type);const card=document.createElement("div");card.className="planner-rule";
 const title=document.createElement("div");title.className="planner-rule-title";title.textContent=t.emoji+" "+t.name;
 const weekday=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][Number(r.weekday)];
 const sub=document.createElement("small");sub.textContent=(r.interval==1?"Every ":r.interval==2?"1st & 3rd ":""+["","1st","2nd","3rd","4th","5th"][Number(r.ordinal||1)]+" ")+weekday;
 const del=document.createElement("button");del.type="button";del.textContent="Remove";del.onclick=()=>{rules=rules.filter(x=>x.id!==r.id);save();refresh()};
 card.append(title,sub,del);list.append(card)}
}
function upcoming(){const today=nowTokyo();const out=[];for(let j=0;j<63&&out.length<8;j++){const date=addDays(today,j);for(const e of entries(date)){out.push({date,type:e.type});if(out.length>=8)break}}return out}
function renderNext(){
 const el=$("plannerUpcoming");if(!el)return;el.replaceChildren();
 const up=upcoming();if(!up.length){el.textContent="Collection days will appear after you set a schedule.";return}
 for(const e of up){const p=document.createElement("div");p.className="planner-upcoming-row";const t=typeFor(e.type);p.innerHTML="<span>"+t.emoji+" "+t.name+"</span><strong>"+human(e.date)+"</strong>";el.append(p)}
}
function refresh(){renderCalendar();renderRules();renderNext()}
const escapeICS=x=>String(x).replace(/\\/g,"\\\\").replace(/,/g,"\\,").replace(/;/g,"\\;").replace(/\r?\n/g,"\\n");
function exportCalendar(){
 if(!rules.length){setStatus("Set at least one collection day first.");return}
 const start=nowTokyo();const end=addDays(start,90),stamp=new Date().toISOString().replace(/[-:]/g,"").replace(/\.\d+/,"");
 const lines=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Japan Garbage Guide//Personal Reminders//EN","CALSCALE:GREGORIAN","METHOD:PUBLISH","X-WR-CALNAME:My Garbage Collection"];
 let count=0;
 for(let d=start;d<=end;d=addDays(d,1)){for(const r of entries(d)){
 const t=typeFor(r.type),date=dateKey(d).replace(/-/g,"");const alarm=r.remind==="morning"?"TRIGGER:-PT0M":"TRIGGER:-PT12H";
 lines.push("BEGIN:VEVENT","UID:jgg-"+r.id+"-"+date+"@japan-garbage-guide","DTSTAMP:"+stamp+"Z","DTSTART;TZID=Asia/Tokyo:"+date+"T080000","DTEND;TZID=Asia/Tokyo:"+date+"T081500","SUMMARY:"+escapeICS(t.name+" garbage collection"),"DESCRIPTION:"+escapeICS("Personal schedule entered by you. Verify collection days with your municipality."),"BEGIN:VALARM","ACTION:DISPLAY","DESCRIPTION:"+escapeICS(t.name+" garbage collection reminder"),alarm,"END:VALARM","END:VEVENT");count++;
 }}
 lines.push("END:VCALENDAR");const blob=new Blob([lines.join("\r\n")+"\r\n"],{type:"text/calendar;charset=utf-8"});
 const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="garbage-reminders.ics";a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);
 setStatus("Exported "+count+" calendar events with alarms for the next 90 days. Open/import the .ics file into your phone's Calendar and allow Calendar alerts. Changes require a new export.");
}
function create(){
 const view=$("nativeCalendar");if(!view)return;
 const official=$("verifiedSchedules");if(official)official.remove();
 const schedule=$("schedulePanel");if(schedule){const paragraphs=schedule.querySelectorAll("p.sub");for(const p of paragraphs){if(/Check your exact collection days|Local time/.test(p.textContent))p.remove()}schedule.querySelectorAll("a.geo-link").forEach(x=>x.remove())}
 view.querySelector(".native-view-sub").textContent="Your collection days, all in one place.";
 const panel=document.createElement("section");panel.className="planner-panel";panel.id="plannerSetup";
 panel.innerHTML='<div class="planner-title"><h2>Set my collection days</h2><span>PERSONAL SCHEDULE</span></div><p>Enter the exact days from your city notice. These are your saved preferences, not automatically verified city dates.</p><div class="planner-fields"><label>Garbage type<select id="plannerType"></select></label><label>Day of week<select id="plannerWeekday"></select></label><label>Frequency<select id="plannerFrequency"><option value="1">Every week</option><option value="2">1st & 3rd week</option><option value="4">A specific week</option></select></label><label id="plannerOrdinalLabel" hidden>Week number<select id="plannerOrdinal"><option value="1">First</option><option value="2">Second</option><option value="3">Third</option><option value="4">Fourth</option><option value="5">Fifth</option></select></label><label>Alert timing<select id="plannerAlarm"><option value="evening">Evening before (8 PM)</option><option value="morning">Collection day (8 AM)</option></select></label></div><button id="plannerAdd" class="planner-primary">＋ Add collection rule</button><p id="plannerStatus" aria-live="polite"></p><div id="plannerRules"></div>';
 const upcomingPanel=document.createElement("section");upcomingPanel.className="planner-panel";upcomingPanel.innerHTML='<h2>Next collections</h2><div id="plannerUpcoming"></div><div class="planner-export"><button id="plannerExport" class="planner-primary">🔔 Add reminders to phone Calendar</button><p>Exports 90 days with calendar alerts. After importing, notifications are handled by the phone Calendar—even when this website is closed. This does not create background web push notifications.</p></div>';
 const start=Array.from(view.children).find(x=>x.id==="schedulePanel");if(start)view.insertBefore(panel,start);else view.append(panel);view.append(upcomingPanel);
 const m=$("plannerType");for(const t of types){const x=document.createElement("option");x.value=t.id;x.textContent=t.emoji+" "+t.name;m.append(x)}
 for(let i=0;i<7;i++){const x=document.createElement("option");x.value=String(i);x.textContent=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][i];$("plannerWeekday").append(x)}
 $("plannerFrequency").onchange=()=>{$("plannerOrdinalLabel").hidden=$("plannerFrequency").value!=="4"};
 $("plannerAdd").onclick=()=>{rules.push({id:id(),type:m.value,weekday:Number($("plannerWeekday").value),interval:Number($("plannerFrequency").value),ordinal:Number($("plannerOrdinal").value),remind:$("plannerAlarm").value});save();setStatus("Collection rule saved on this device.");refresh()};
 $("plannerExport").onclick=exportCalendar;
 const header=document.createElement("div");header.className="planner-calnav";header.innerHTML='<button id="plannerPrev" aria-label="Previous month">‹</button><span>My collection calendar</span><button id="plannerNext" aria-label="Next month">›</button>';if(schedule)schedule.prepend(header);
 $("plannerPrev").onclick=()=>{offset--;renderCalendar()};$("plannerNext").onclick=()=>{offset++;renderCalendar()};
 const detail=document.createElement("p");detail.id="plannerSelectedDay";detail.className="planner-selected";detail.textContent="Tap a date to see scheduled categories.";schedule?.append(detail);
 // Hide obsolete faux reminder form, leave underlying data untouched for backward compatibility.
 view.querySelectorAll(".panel").forEach(x=>{if(x!==schedule&&/Official collection dates & real reminders/i.test(x.textContent))x.remove()});
 const home=$("nativeHome");if(home){const summary=document.createElement("div");summary.className="planner-home-summary";summary.innerHTML='<strong>Next garbage collection</strong><p id="plannerHomeNext">Set your collection days in Calendar</p><button id="plannerOpenCalendar">Set schedule ↗</button>';const geo=$("geoPanel");if(geo)geo.insertAdjacentElement("beforebegin",summary);$("plannerOpenCalendar").onclick=()=>{$("navCalendar")?.click()}}
 const originalRefresh=refresh;refresh=functionRef;
 function functionRef(){originalRefresh();const up=upcoming();const t=up[0]?typeFor(up[0].type):null;const el=$("plannerHomeNext");if(el)el.textContent=t?t.emoji+" "+t.name+" · "+human(up[0].date):"No schedule yet. Set your collection days."}
 functionRef();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",create);else create();
})();
