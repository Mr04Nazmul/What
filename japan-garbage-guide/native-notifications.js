/* Native-only local scheduling. Device OS delivers scheduled alarms while app is closed.
   Uses the device's local timezone; schedules should be checked when travelling. */
(()=>{"use strict";
const STORAGE="jgg-collection-rules-v1",IDS="jgg-native-reminder-ids-v1";
const plugin=()=>window.Capacitor?.Plugins?.LocalNotifications;
const labels={burnable:"Burnable",plastic:"Plastic",cans:"Bottles / Cans",paper:"Paper",nonburnable:"Non-burnable"};
const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback))}catch{return fallback}};
const matches=(d,r)=>{let ordinal=Math.ceil(d.getDate()/7);return d.getDay()===Number(r.weekday)&&(Number(r.interval)===1||(Number(r.interval)===2&&[1,3].includes(ordinal))||(Number(r.interval)===4&&ordinal===Number(r.ordinal||1)))};
let working=false;
async function sync(){const native=plugin();if(!native||working)return;working=true;
try{
 const permission=await native.checkPermissions();if(permission.display!=="granted")return;
 const oldIds=read(IDS,[]);if(oldIds.length)await native.cancel({notifications:oldIds.map(id=>({id}))});
 const rules=read(STORAGE,[]);const next=[];let count=0;const now=new Date();
 for(let day=0;day<45&&count<55;day++){
  const collection=new Date(now.getFullYear(),now.getMonth(),now.getDate()+day,8,0,0);
  for(const rule of rules){if(count>=55)break;if(!matches(collection,rule))continue;
   const morning=rule.remind==="morning",alarm=new Date(collection);
   if(!morning){alarm.setDate(alarm.getDate()-1);alarm.setHours(20,0,0,0)}
   if(alarm<=now)continue;
   const id=100001+count;next.push({id,title:"Japan Garbage Guide",body:(labels[rule.type]||"Garbage")+(morning?" collection today":" collection tomorrow")+". Please confirm your neighborhood schedule.",schedule:{at:alarm,allowWhileIdle:true},smallIcon:"ic_stat_icon_config_sample",extra:{ruleId:rule.id}});
   count++;
  }
 }
 if(next.length)await native.schedule({notifications:next});localStorage.setItem(IDS,JSON.stringify(next.map(n=>n.id)));
 const status=document.getElementById("jggNativeStatus");if(status)status.textContent=next.length+" local reminders scheduled on this phone. Open the app periodically to refresh future reminders.";
 }catch(e){console.warn("Native reminder scheduling failed",e);const status=document.getElementById("jggNativeStatus");if(status)status.textContent="Could not schedule alarms: "+(e?.message||"device error")}
 finally{working=false}
}
function mount(){if(!plugin())return;const parent=document.getElementById("plannerSetup");if(!parent||document.getElementById("jggNativeStatus"))return;
 const section=document.createElement("section");section.className="planner-panel";const heading=document.createElement("h3");heading.textContent="Automatic phone reminders";const status=document.createElement("p");status.id="jggNativeStatus";status.textContent="Enable notifications to schedule your saved garbage collection days, even when this app is closed.";const button=document.createElement("button");button.className="planner-primary";button.textContent="Enable automatic reminders";
 button.onclick=async()=>{try{const permission=await plugin().requestPermissions();if(permission.display!=="granted"){status.textContent="Notification permission denied in device settings.";return}await sync()}catch(e){status.textContent="Permission error: "+e.message}};
 section.append(heading,status,button);parent.append(section);
}
function init(){if(!plugin())return;mount();new MutationObserver(mount).observe(document.body,{childList:true,subtree:true});
 document.addEventListener("click",e=>{if(e.target?.id==="plannerAdd"||e.target?.textContent==="Remove")setTimeout(sync,300)});
 document.addEventListener("visibilitychange",()=>{if(!document.hidden)sync()});sync();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();