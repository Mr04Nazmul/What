/* Live public map: GPS + OpenStreetMap Overpass. Never guesses disposal sites. */
(function(){
"use strict";
const byId=id=>document.getElementById(id);
const R=100;
const endpoints=["https://overpass.kumi.systems/api/interpreter","https://overpass.private.coffee/api/interpreter","https://overpass.nchc.org.tw/api/interpreter","https://overpass-api.de/api/interpreter","https://overpass.ultra-trail.de/api/interpreter"];
let map=null, layer=null, circle=null, centerMarker=null, privateMarker=null, lastCoords=null, busy=false, reqNo=0, watchId=null, lastFetchAt=0, lastFetchPosition=null, placing=false;
function distance(a,b,c,d){const rad=Math.PI/180,Rm=6371000,p=(c-a)*rad,q=(d-b)*rad;const v=Math.sin(p/2)**2+Math.cos(a*rad)*Math.cos(c*rad)*Math.sin(q/2)**2;return 2*Rm*Math.asin(Math.sqrt(v))}
function labelFor(t){if(t.name&&/ごみステーション|ゴミステーション|クリーンステーション|ごみ集積所|ゴミ集積所|ごみ置き場|ゴミ置き場|資源回収|集団回収/.test(t.name))return "🏠 Named waste collection station (verify permission)";if(t.amenity==="recycling")return "♻️ Recycling drop-off";if(t.amenity==="waste_basket")return "🗑️ Public litter bin";if(t.amenity==="waste_disposal")return "🚮 Waste disposal point";return "Collection point"}
function types(t){const keys=Object.keys(t).filter(k=>k.startsWith("recycling:")&&t[k]==="yes").map(k=>k.slice(10).replace(/_/g," "));return keys.slice(0,5).join(", ")}
function status(text){if(byId("locationState"))byId("locationState").textContent=text;const x=byId("liveMapStatus");if(x)x.textContent=text}
function toNumber(n){return Number(n).toFixed(6)}
function osmQuery(lat,lon){const around="(around:"+R+","+toNumber(lat)+","+toNumber(lon)+")";return '[out:json][timeout:18];(nwr'+around+'["amenity"~"^(recycling|waste_basket|waste_disposal)$"];nwr'+around+'["name"~"ごみ|ゴミ|クリーンステーション|資源回収|集積所"];nwr'+around+'["recycling_type"];);out center tags;'}
let hyugaDataPromise=null;
function isHyuga(lat,lon){return lat>=32.2&&lat<=32.65&&lon>=131.3&&lon<=131.85}
function officialData(){if(!hyugaDataPromise)hyugaDataPromise=fetch("./hyuga-clean-stations.json",{cache:"no-store"}).then(x=>{if(!x.ok)throw Error("official data failed");return x.json()}).catch(e=>{hyugaDataPromise=null;throw e});return hyugaDataPromise}
async function findOfficialHyuga(lat,lon,my){
 status("Checking official Hyūga City stations within 100m…");
 try{
 const data=await officialData();if(my!==reqNo)return;
 const results=(data.stations||[]).map(p=>({...p,meters:Math.round(distance(lat,lon,p.lat,p.lon))})).filter(p=>p.meters<=R).sort((a,b)=>a.meters-b.meters);
 if(layer)layer.clearLayers();
 const list=byId("livePoints");if(list)list.replaceChildren();
 const count=results.length;
 status(count?count+" official Hyūga clean station"+(count===1?"":"s")+" within 100 m":"No official Hyūga clean station within 100 m in current dataset");
 if(!count){renderMessage("No clean station in this 100m radius in Hyūga City official dataset. You may have a different assigned station; check your municipality.");return}
 for(const p of results){
   if(layer){const marker=L.circleMarker([p.lat,p.lon],{radius:8,color:"#fff",weight:2,fillColor:"#ed9c28",fillOpacity:1}).addTo(layer);marker.bindPopup(escapeHTML(p.name)+"<br>"+p.meters+"m · Hyūga official data");}
   if(!list)continue;const card=document.createElement("article");card.className="live-point-card";
   const head=document.createElement("div");head.className="live-point-head";
   const strong=document.createElement("strong");strong.textContent=p.name||"クリーンステーション";
   const span=document.createElement("span");span.textContent=p.meters+" m";head.append(strong,span);
   const detail=document.createElement("small");detail.textContent="燃やせるごみ: "+(p.burnable||"未掲載")+" · 燃やせないごみ: "+(p.nonburnable||"未掲載")+" · プラ: "+(p.plastic||"未掲載");
   const source=document.createElement("small");source.textContent="Official Hyūga City open data · Not a guarantee this is your assigned station.";
   const link=document.createElement("a");link.textContent="Walking directions ↗";link.href=linkDirections(p);link.target="_blank";link.rel="noopener noreferrer";
   card.append(head,detail,source,link);list.append(card);
 }
 }catch(e){status("Hyūga official data temporarily unavailable");renderMessage("Official station dataset unavailable. Try again later.")}
}
async function find(lat,lon){
 const my=++reqNo;busy=true;if(isHyuga(lat,lon)){await findOfficialHyuga(lat,lon,my);busy=false;return}const q=osmQuery(lat,lon);status("Checking live map data within 100 m…");
 let data=null,lastError=null;
 // Most public Overpass servers rate-limit POST, and some reject cross-origin requests.
 // Attempt standard form POST then short encoded GET against multiple independent mirrors.
 for(const endpoint of endpoints){
  if(my!==reqNo)return;
  for(const method of ["POST","GET"]){
   const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),8500);
   try{
    const url=method==="GET"?endpoint+"?data="+encodeURIComponent(q):endpoint;
    const response=await fetch(url,{
     method,
     ...(method==="POST"?{body:new URLSearchParams({data:q}),headers:{"Content-Type":"application/x-www-form-urlencoded"}}:{}),
     signal:controller.signal,cache:"no-store",mode:"cors"
    });
    if(!response.ok)throw new Error("Overpass "+response.status);
    const candidate=await response.json();
    if(!candidate||!Array.isArray(candidate.elements))throw new Error("Unexpected Overpass response");
    data=candidate;break;
   }catch(e){lastError=e}finally{clearTimeout(timer)}
  }
  if(data)break;
 }

 if(my!==reqNo)return;
 busy=false;
 if(!data){status("Map data providers unavailable. Your GPS is working.");renderMessage("Nearby lookup is temporarily offline (not zero places). Try again later or use Google Maps search. Unlisted residential stations cannot be detected automatically.");const open=byId("openNearbyMap");if(open){open.hidden=false;open.textContent="↗ Search nearby in Google Maps"}return}
 const seen=new Set();
 const items=(data.elements||[]).map(e=>{
  const lat2=e.lat??e.center?.lat,lon2=e.lon??e.center?.lon;
  if(!Number.isFinite(lat2)||!Number.isFinite(lon2))return null;
  const meters=Math.round(distance(lat,lon,lat2,lon2));
  const key=e.type+":"+e.id;if(meters>R||seen.has(key))return null;seen.add(key);
  return {lat:lat2,lon:lon2,meters,tags:e.tags||{},id:key};
 }).filter(Boolean).sort((a,b)=>a.meters-b.meters);
 draw(items,lat,lon);status(items.length?items.length+" mapped location"+(items.length===1?"":"s")+" within 100 m · updated now":"No matching places mapped within 100 m (not proof none exist)");
}
function renderMessage(message){const parent=byId("livePoints");if(!parent)return;parent.replaceChildren();const p=document.createElement("p");p.className="live-empty";p.textContent=message;parent.append(p)}
function linkDirections(item){return 'https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(item.lat+","+item.lon)+'&travelmode=walking'}
function draw(items,lat,lon){
 if(layer)layer.clearLayers();
 const list=byId("livePoints");if(!list)return;list.replaceChildren();
 if(!items.length){renderMessage("No matching locations are mapped in OpenStreetMap within 100m. Your real neighborhood station may not be recorded. If you know your assigned station, save its position privately below.");return}
 for(const item of items){
  const label=item.tags.name||item.tags["name:en"]||labelFor(item.tags);
  const cat=labelFor(item.tags);
  if(layer){const marker=L.circleMarker([item.lat,item.lon],{radius:8,color:"#fff",weight:2,fillColor:"#0b795a",fillOpacity:1}).addTo(layer);marker.bindPopup('<strong>'+escapeHTML(label)+'</strong><br>'+item.meters+' m · '+escapeHTML(cat));}
  const article=document.createElement("article");article.className="live-point-card";
  const head=document.createElement("div");head.className="live-point-head";
  const title=document.createElement("strong");title.textContent=label;const dist=document.createElement("span");dist.textContent=item.meters+" m";head.append(title,dist);
  const details=document.createElement("small");details.textContent=cat+(types(item.tags)?" · "+types(item.tags):"")+" · OpenStreetMap data, access not verified";
  const a=document.createElement("a");a.textContent="Walking directions ↗";a.href=linkDirections(item);a.target="_blank";a.rel="noopener noreferrer";
  article.append(head,details,a);list.append(article);
 }
}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
const PRIVATE_KEY="jgg-private-assigned-station-v1";
function savedStation(){try{const x=JSON.parse(localStorage.getItem(PRIVATE_KEY)||"null");return x&&Number.isFinite(x.lat)&&Number.isFinite(x.lon)?x:null}catch(e){return null}}
function renderPrivate(){
 const x=savedStation();const box=byId("privateStationStatus");if(box)box.textContent=x?"Your confirmed station is saved on this device only. It is not shared or public.":"No personal station saved.";
 if(privateMarker&&map){map.removeLayer(privateMarker);privateMarker=null}
 if(x&&map){privateMarker=L.circleMarker([x.lat,x.lon],{radius:10,color:"#fff",weight:3,fillColor:"#ec9f27",fillOpacity:1}).addTo(map).bindPopup("Your privately saved, personally confirmed station");}
}
function setMarkMode(){if(!map){status("Map not ready");return}placing=true;const b=byId("privateStationMark");if(b)b.textContent="Tap your assigned station on map";status("Tap your own confirmed garbage station on the map to save it privately.");}
function saveAt(lat,lon){
 if(!placing)return;placing=false;
 try{localStorage.setItem(PRIVATE_KEY,JSON.stringify({lat,lon}))}catch(e){status("Could not save private station");return}
 const b=byId("privateStationMark");if(b)b.textContent="Mark my confirmed station";const quick=byId("quickMarkStation");if(quick)quick.textContent="✓ My station saved";renderPrivate();status("Personal station saved on this device, not sent to a public database");
}
function ensureMap(lat,lon){
 const frame=byId("wasteMap"),holder=byId("liveMap");if(!holder)return false;
 if(!window.L){status("Map tiles are still loading. Try again.");return false}
 document.body.classList.add("live-map-active");if(frame)frame.hidden=true;holder.hidden=false;
 if(!map){
  map=L.map(holder,{zoomControl:true}).setView([lat,lon],18);map.on("click",e=>saveAt(e.latlng.lat,e.latlng.lng));
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',maxZoom:20}).addTo(map);
  layer=L.layerGroup().addTo(map);renderPrivate();
 }
 if(circle)map.removeLayer(circle);if(centerMarker)map.removeLayer(centerMarker);
 circle=L.circle([lat,lon],{radius:R,color:"#087a59",fillColor:"#12aa80",fillOpacity:0.10,weight:2}).addTo(map);
 centerMarker=L.circleMarker([lat,lon],{radius:9,color:"#fff",weight:3,fillColor:"#2987ff",fillOpacity:1}).addTo(map).bindPopup("Your approximate GPS location");
 map.setView([lat,lon],18);setTimeout(()=>map.invalidateSize(),90);
 return true;
}
function onPosition(p){
 const lat=p.coords.latitude,lon=p.coords.longitude,accuracy=Math.round(p.coords.accuracy);
 lastCoords={lat,lon};byId("useLocation").disabled=false;
 byId("useLocation").textContent="↻ Refresh 100 m nearby";
 const hint=byId("liveAccuracy");if(hint)hint.textContent="GPS accuracy ±"+accuracy+" m. Distances are straight-line, not walking distances.";
 const link=byId("openNearbyMap");if(link){link.href="https://www.google.com/maps/search/?api=1&query="+encodeURIComponent("recycling center near "+lat+","+lon)}
 if(!ensureMap(lat,lon))return;
 lastFetchAt=Date.now();lastFetchPosition={lat,lon};find(lat,lon);
 if(watchId===null){watchId=navigator.geolocation.watchPosition(next=>{
   const a=next.coords.latitude,b=next.coords.longitude;
   if(lastFetchPosition&&distance(a,b,lastFetchPosition.lat,lastFetchPosition.lon)<25)return;
   if(Date.now()-lastFetchAt<30000||busy)return;
   onPosition(next);
 },()=>{}, {enableHighAccuracy:true,maximumAge:15000,timeout:15000});}
}
function start(){
 if(!navigator.geolocation){status("This device does not support GPS.");return}
 status("Requesting GPS permission…");const btn=byId("useLocation");if(btn)btn.disabled=true;
 navigator.geolocation.getCurrentPosition(onPosition,e=>{
  if(btn)btn.disabled=false;
  status(e.code===1?"Location permission denied. Enable GPS for this site in browser settings.":e.code===2?"GPS position unavailable.":"GPS timed out. Try again.");
 },{enableHighAccuracy:true,maximumAge:0,timeout:15000});
}
function init(){
 const frame=byId("wasteMap"),wrapper=frame?.parentElement;if(!wrapper)return;
 const holder=document.createElement("div");holder.id="liveMap";holder.hidden=false;holder.setAttribute("aria-label","Interactive map. Enable location to see public recycling points within 100 meters");wrapper.append(holder);if(frame)frame.hidden=true;document.body.classList.add("live-map-active");if(window.L){map=L.map(holder,{zoomControl:true}).setView([34.69,135.195],12);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',maxZoom:20}).addTo(map);layer=L.layerGroup().addTo(map);map.on("click",e=>saveAt(e.latlng.lat,e.latlng.lng));renderPrivate();setTimeout(()=>map.invalidateSize(),300);}
 const panel=document.createElement("section");panel.className="live-point-section";panel.id="liveSection";
 const header=document.createElement("div");header.className="live-point-heading";
 const title=document.createElement("h3");title.textContent="Within 100 meters";
 const tag=document.createElement("span");tag.textContent="LIVE MAP DATA";
 header.append(title,tag);
 const sub=document.createElement("p");sub.textContent="Nearby mapped recycling drop-offs and public bins, not private residential garbage stations.";
 const accuracy=document.createElement("p");accuracy.id="liveAccuracy";accuracy.className="live-accuracy";accuracy.textContent="Tap Use My Location to search live map data.";
 const st=document.createElement("p");st.id="liveMapStatus";st.setAttribute("role","status");st.className="live-accuracy";
 const list=document.createElement("div");list.id="livePoints";
 const note=document.createElement("p");note.className="live-disclaimer";note.textContent="100 m is measured straight-line from GPS to mapped point. OpenStreetMap is community-maintained, so absence of results does not prove absence of a location. Availability, opening hours, accepted materials and disposal permission are not real-time verified.";
 panel.append(header,sub,accuracy,st,list,note);
 const privateBox=document.createElement("div");privateBox.className="private-station-controls";
 const heading=document.createElement("strong");heading.textContent="Your home garbage station (private)";
 const help=document.createElement("p");help.textContent="Already know the residential station your building/neighbors assigned you? Tap Mark, then tap the spot on the map. Do not mark a place unless you are permitted to use it.";
 const mark=document.createElement("button");mark.id="privateStationMark";mark.type="button";mark.textContent="Mark my confirmed station";mark.onclick=setMarkMode;
 const clear=document.createElement("button");clear.id="privateStationClear";clear.type="button";clear.textContent="Remove saved pin";clear.onclick=()=>{try{localStorage.removeItem(PRIVATE_KEY)}catch(e){}renderPrivate()};
 const stPriv=document.createElement("p");stPriv.id="privateStationStatus";
 privateBox.append(heading,help,mark,clear,stPriv);panel.append(privateBox);
 renderPrivate();
 wrapper.insertAdjacentElement("afterend",panel);
 const quick=document.createElement("button");
 quick.type="button";quick.id="quickMarkStation";quick.className="quick-mark-station";
 quick.textContent="＋ Save my station";
 quick.title="Mark your personally confirmed residential garbage station on the map, stored only on this device";
 quick.addEventListener("click",()=>{setMarkMode();const b=byId("privateStationMark");if(b)b.textContent="Tap map to save your station";quick.textContent="Tap your station on map…";});
 wrapper.append(quick);

 window.JGGNearby100m={start,refresh:()=>lastCoords?find(lastCoords.lat,lastCoords.lon):start()};
 const button=byId("useLocation");if(button){button.textContent="◎ Show real places within 100 m";}
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
