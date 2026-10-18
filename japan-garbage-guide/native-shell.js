/* Actual Map First Pro native-feeling multi-screen shell, preserving existing functions. */
(function(){
const el=id=>document.getElementById(id);
function mount(){
const root=document.querySelector("main.app");if(!root||root.dataset.shellReady)return;root.dataset.shellReady="1";
document.body.classList.add("native-app");
const oldTop=root.querySelector(".top"),oldHero=root.querySelector(".hero"),geo=el("geoPanel"),sortCards=root.querySelector(".cards"),calendar=el("schedulePanel"),official=el("verifiedSchedules"),smart=el("smartResult");
const header=document.createElement("header");header.className="native-topbar";
header.innerHTML='<div class="native-brand"><span class="native-symbol">♻</span><div><strong>Japan Garbage Guide</strong><small>Map-first local waste assistant</small></div></div>';
const language=el("lang");if(language)header.append(language);
root.prepend(header);
const home=document.createElement("section");home.className="native-view";home.id="nativeHome";
const sort=document.createElement("section");sort.className="native-view native-view-panel";sort.id="nativeSort";
const cal=document.createElement("section");cal.className="native-view native-view-panel";cal.id="nativeCalendar";
const more=document.createElement("section");more.className="native-view native-view-panel";more.id="nativeMore";
home.innerHTML='<div class="native-section-top"><div><strong>Explore around you</strong><br><small>Nearby public recycling points</small></div><span class="native-live-chip">● LIVE · 100m</span></div>';
const search=document.querySelector(".hero .search");if(search){const holder=document.createElement("div");holder.className="native-home-search";holder.append(search);home.prepend(holder)}
if(geo)home.append(geo);
const live=el("liveSection");if(live){const handle=document.createElement("div");handle.className="native-handle";live.prepend(handle)}
sort.innerHTML='<h1 class="native-view-title">Sort it right ♻</h1><p class="native-view-sub">Search items and see waste categories. Official city rules always take priority.</p><div class="native-sort-search"><input id="nativeSortInput" placeholder="Search battery, bottle, paper…" aria-label="Search waste items"><button id="nativeSortGo">Search</button></div>';
if(sortCards)sort.append(sortCards);if(smart)sort.append(smart);
cal.innerHTML='<h1 class="native-view-title">Collection calendar</h1><p class="native-view-sub">Check local municipal schedules and collection reminders.</p>';
if(calendar)cal.append(calendar);if(official)cal.append(official);
more.innerHTML='<h1 class="native-view-title">More & settings</h1><p class="native-view-sub">Your preferences, trusted sources and local guidance.</p><div class="native-more-links"><a href="https://www.google.com/maps/search/?api=1&query=recycling+drop-off+near+me" target="_blank" rel="noopener noreferrer">Google Maps search <span>↗</span></a><a href="https://www.city.kobe.lg.jp/a25748/kurashi/recycle/gomi/genryo/3r/shigenmap.html" target="_blank" rel="noopener noreferrer">Official Kobe recycling map <span>↗</span></a><a href="https://lin.ee/3TT6shh" target="_blank" rel="noopener noreferrer">Official Kobe reminder LINE <span>↗</span></a></div>';
root.append(home,sort,cal,more);
const remains=[...root.children].filter(n=>n.classList?.contains("grid"));for(const g of remains)more.append(g);
const entries={navHome:home,navMap:home,navSort:sort,navCalendar:cal,moreButton:more};
const nav=document.querySelector(".bottom-nav");
const labels={navHome:"⌂<br>Home",navMap:"⌖<br>Map",navSort:"♻<br>Sort",navCalendar:"▦<br>Calendar",moreButton:"⋯<br>More"};
function choose(id){
 for(const v of [home,sort,cal,more]){v.dataset.active=String(v===entries[id]);}
 for(const btn of nav.querySelectorAll("button")){btn.removeAttribute("aria-current");}
 el(id)?.setAttribute("aria-current","page");
 document.body.classList.toggle("native-map-expanded",id==="navMap");
 if(id==="navMap"||id==="navHome"){setTimeout(()=>{window.dispatchEvent(new Event("resize"))},150)}
 window.scrollTo({top:0,behavior:"instant"});
 try{history.replaceState(null,"",location.pathname+"#"+({navHome:"home",navMap:"map",navSort:"sort",navCalendar:"calendar",moreButton:"more"}[id]))}catch(e){}
}
Object.keys(entries).forEach(id=>{const btn=el(id);if(!btn)return;btn.innerHTML=labels[id];btn.onclick=null;btn.addEventListener("click",e=>{e.preventDefault();e.stopImmediatePropagation();choose(id)},true)});
const sortInput=el("nativeSortInput");el("nativeSortGo")?.addEventListener("click",()=>{const q=el("query");if(q){q.value=sortInput.value;el("searchBtn")?.click()}});
sortInput?.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();el("nativeSortGo").click()}});
el("searchBtn")?.addEventListener("click",()=>{setTimeout(()=>choose("navSort"),60)});
const selected=location.hash.slice(1),key={home:"navHome",map:"navMap",sort:"navSort",calendar:"navCalendar",more:"moreButton"}[selected]||"navHome";choose(key);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount);else mount();
})();
