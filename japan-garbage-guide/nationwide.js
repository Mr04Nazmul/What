/* Nationwide municipality gateway: no invented collection dates or unverified station pins. */
(()=>{"use strict";
const PREFS=["北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県","茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県","新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県","静岡県","愛知県","三重県","滋賀県","京都府","大阪府","兵庫県","奈良県","和歌山県","鳥取県","島根県","岡山県","広島県","山口県","徳島県","香川県","愛媛県","高知県","福岡県","佐賀県","長崎県","熊本県","大分県","宮崎県","鹿児島県","沖縄県"];
const KEY="jgg-nationwide-area-v1";
const cityLinks={"神戸市":"https://www.city.kobe.lg.jp/a04164/kurashi/recycle/gomi/dashikata/calendar/index.html","大阪市":"https://www.city.osaka.lg.jp/kankyo/","京都市":"https://www.city.kyoto.lg.jp/kankyo/"};
function el(t,c){const a=document.createElement(t);if(c)a.className=c;return a}
function init(){const home=document.getElementById("nativeHome");if(!home||document.getElementById("nationwidePanel"))return;
const panel=el("section","nationwide-card");panel.id="nationwidePanel";
const eyebrow=el("div","nationwide-eyebrow");eyebrow.textContent="JAPAN · 47 PREFECTURES";
const h=el("h2");h.textContent="Your city. Your collection rules.";
const p=el("p");p.textContent="Choose your municipality to find its official garbage collection calendar. Collection dates and disposal stations can differ by address.";
const grid=el("div","nationwide-grid");const pref=el("select"),city=el("input"),area=el("input");
pref.setAttribute("aria-label","Prefecture");const blank=el("option");blank.value="";blank.textContent="Select prefecture";pref.append(blank);
for(const name of PREFS){const o=el("option");o.textContent=name;o.value=name;pref.append(o)}
city.placeholder="City / 市区町村 (e.g. 神戸市)";city.setAttribute("aria-label","Municipality");city.autocomplete="address-level2";city.maxLength=70;
area.placeholder="Town / 町名 (optional)";area.setAttribute("aria-label","Town");area.maxLength=100;
grid.append(pref,city,area);
const action=el("button","nationwide-action");action.textContent="Find official collection calendar ↗";
const note=el("div","nationwide-result");note.setAttribute("aria-live","polite");
let saved={};try{saved=JSON.parse(localStorage.getItem(KEY)||"{}")}catch{}
pref.value=PREFS.includes(saved.prefecture)?saved.prefecture:"";city.value=saved.city||"";area.value=saved.area||"";
function persist(){const v={prefecture:pref.value,city:city.value.trim(),area:area.value.trim()};localStorage.setItem(KEY,JSON.stringify(v));return v}
[pref,city,area].forEach(f=>f.addEventListener("change",persist));
action.onclick=()=>{const v=persist();note.replaceChildren();if(!v.prefecture||!v.city){note.textContent="Choose a prefecture and enter your city or municipality first.";return}
const search=[v.prefecture,v.city,v.area,"ごみ 収集日 カレンダー 公式"].filter(Boolean).join(" ");const link=el("a","nationwide-official-link");link.href=cityLinks[v.city]||"https://www.google.com/search?q="+encodeURIComponent(search);link.target="_blank";link.rel="noopener noreferrer";link.textContent=cityLinks[v.city]?"Open city collection information ↗":"Search for the municipality's official calendar ↗";
const caution=el("small");caution.textContent="Only use dates confirmed for your exact address. Search results are not verified official collection dates.";note.append(link,caution)};
panel.append(eyebrow,h,p,grid,action,note);
const summary=home.querySelector(".planner-home-summary");if(summary)summary.insertAdjacentElement("afterend",panel);else home.prepend(panel);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();