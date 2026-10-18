/* Reduce home clutter without deleting underlying features/data. */
(()=>{"use strict";
function init(){
 const home=document.getElementById("nativeHome"),more=document.getElementById("nativeMore");
 if(!home||!more)return;
 const groups=document.getElementById("kobeOfficialGroups");
 if(groups){more.append(groups);groups.style.display="block";}
 const panel=document.getElementById("liveSection");
 if(panel){const h=panel.querySelector("h3");if(h)h.textContent="Nearby waste points";}
 const section=home.querySelector(".native-section-top strong");if(section)section.textContent="Explore nearby";
 const desc=home.querySelector(".native-section-top small");if(desc)desc.textContent="Your neighborhood · 100m radius";
 const chip=home.querySelector(".native-live-chip");if(chip)chip.textContent="● GPS MAP";
 const location=document.getElementById("useLocation");if(location)location.textContent="⌖ Use my location";
 const status=document.getElementById("liveMapStatus");if(status&&!status.textContent)status.textContent="Use GPS to discover mapped collection locations.";
 const wrapper=document.querySelector(".geo-map-frame");
 if(wrapper){const mark=document.getElementById("quickMarkStation");if(mark)mark.textContent="＋ My station";}
 const note=panel?.querySelector(".live-disclaimer");if(note)note.textContent="Mapped data may be incomplete. Household collection stations can have restricted access.";
 const settings=document.querySelector("#nativeMore .native-more-links");
 if(settings){const a=document.createElement("a");a.href="https://www.city.kobe.lg.jp/a04164/kurashi/recycle/gomi/dashikata/calendar/index.html";a.target="_blank";a.rel="noopener noreferrer";a.textContent="Kobe collection calendar ↗";settings.append(a);}
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();