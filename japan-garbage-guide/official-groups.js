/* Official Kobe published neighborhood resource collections (not a household station map). */
(()=>{"use strict";
const source="kobe-community-collections.json";
const escape=(s)=>String(s||"");
function node(tag,text,cl){const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cl)e.className=cl;return e}
function create(){
 const host=document.getElementById("nativeHome")||document.getElementById("liveSection")?.parentElement;
 if(!host||document.getElementById("kobeOfficialGroups"))return;
 const block=node("section",undefined,"official-groups");block.id="kobeOfficialGroups";
 const head=node("div",undefined,"official-groups-head");head.append(node("h3","Kobe official neighborhood collections"),node("span","OFFICIAL SOURCES"));
 block.append(head,node("p","Real municipal listings for community recycling days and locations. These are area-restricted collections—not ordinary household garbage stations and not automatically within 100 m."));
 const search=node("input",undefined,"official-groups-search");search.id="officialGroupSearch";search.type="search";search.placeholder="Search Japanese town name (e.g. 二葉町, 久保町)";search.setAttribute("aria-label","Search official community collection area");block.append(search);
 const count=node("p","Loading verified listings…","official-groups-count");count.id="officialGroupCount";block.append(count);
 const list=node("div",undefined,"official-groups-list");list.id="officialGroupList";block.append(list);
 const link=node("a","Browse all Nagata-ku group collection areas ↗","official-groups-mainlink");link.href="https://www.city.kobe.lg.jp/life/recycle/waketon/shirumanabu/gyouseiku/ku_F.html";link.target="_blank";link.rel="noopener noreferrer";block.append(link);
 const panel=document.getElementById("liveSection");if(panel)panel.insertAdjacentElement("afterend",block);else host.append(block);
 let groups=[];
 const refresh=()=>{
   const q=search.value.trim().normalize("NFKC");list.replaceChildren();
   const filtered=groups.filter(g=>!q||g.name.includes(q)||g.eligibility.includes(q)||g.ward.includes(q)||g.areas.some(t=>t.includes(q)||q.includes(t))||g.locations.some(t=>t.includes(q)));
   count.textContent=filtered.length+" verified community groups · "+filtered.reduce((n,g)=>n+g.locations.length,0)+" described places"+(q?" matching your search":" in this partial dataset");
   for(const g of filtered){
     const card=node("article",undefined,"official-group-card");
     card.append(node("strong",g.name),node("p","Eligible area: "+g.eligibility),node("p","Collection: "+g.schedule+" · "+g.materials));
     const details=node("details");details.append(node("summary",g.locations.length+" official location descriptions"));
     const ul=node("ul");
     for(const place of g.locations){
       const li=node("li");li.append(node("span",place+" "));
       const map=node("a","Locate ↗");map.href="https://www.google.com/maps/search/?api=1&query="+encodeURIComponent("神戸市 "+g.ward+" "+place);map.rel="noopener noreferrer";map.target="_blank";li.append(map);ul.append(li);
     }
     details.append(ul);card.append(details);
     const a=node("a","View Kobe City record ↗");a.href=g.source;a.target="_blank";a.rel="noopener noreferrer";card.append(a);
     const note=node("small","Area eligibility, accepted materials and collection times must be checked on the official page. Google Maps search is only approximate: no geocoded pin or 100m proximity is claimed.");
     card.append(note);list.append(card);
   }
   if(!filtered.length)list.append(node("p","No entry in this partial official dataset. Use the all-Nagata index or your area's waste office."));
 };
 search.addEventListener("input",refresh);
 fetch(source,{cache:"no-store"}).then(r=>{if(!r.ok)throw Error("HTTP "+r.status);return r.json()}).then(d=>{groups=Array.isArray(d.groups)?d.groups:[];refresh()}).catch(()=>{count.textContent="Official source data temporarily unavailable";});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",create);else create();
})();
