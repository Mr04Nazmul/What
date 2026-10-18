/* Smart multilingual waste guide and real month calendar.
   Advisory only: never synthesizes municipal pickup schedules. */
(()=>{
const el=id=>document.getElementById(id);
const items=[
{keys:['battery','batteries','電池','乾電池','ব্যাটারি','बैटरी','pin','pin sạc'],title:'Battery / 電池',category:'Special collection',advice:'Keep batteries out of ordinary burnable waste. Check the city collection box or hazardous-waste procedure. Tape exposed contacts where your municipality instructs.'},
{keys:['power bank','モバイルバッテリー','lithium','リチウム','পাওয়ার ব্যাংক'],title:'Lithium battery / power bank',category:'Special handling',advice:'Do not dispose of lithium batteries or power banks with ordinary household garbage. Follow local collection/recycling instructions.'},
{keys:['pet bottle','plastic bottle','ペットボトル','প্লাস্টিক বোতল','प्लास्टिक बोतल','chai nhựa'],title:'PET bottle / ペットボトル',category:'Recyclable (location-dependent)',advice:'Empty and rinse. Caps and labels may have a different category. Check your municipality before putting items out.'},
{keys:['plastic bag','レジ袋','袋','পলিথিন','plastic wrapper','包装プラスチック'],title:'Plastic bag / packaging',category:'Packaging plastic or burnable (location-dependent)',advice:'Plastic packaging rules differ by municipality; remove contents, and check the official sorting list.'},
{keys:['can','aluminum','アルミ缶','スチール缶','缶','ক্যান','lon'],title:'Metal can / 缶',category:'Recyclable (location-dependent)',advice:'Empty and rinse. Metal spray cans and gas cartridges follow separate safety instructions.'},
{keys:['spray','スプレー缶','カセットボンベ','gas can'],title:'Spray or gas canister',category:'Special handling',advice:'Follow the exact local instructions for spray cans and gas canisters. Do not mix with regular metal cans.'},
{keys:['cardboard','段ボール','কার্টন','paper','新聞','雑誌','কাগজ','紙','carton','कागज़'],title:'Paper / cardboard',category:'Paper recycling (location-dependent)',advice:'Keep clean and dry; follow your city instructions for bundling, contamination, and collection days.'},
{keys:['glass','ガラス','びん','瓶','কাচ','शीशा','chai thủy tinh'],title:'Glass / bottle',category:'Bottle recycling or non-burnable',advice:'Reusable bottles, broken glass, and ceramics may need different collection methods. Confirm your city rule.'},
{keys:['food waste','kitchen scraps','生ごみ','食べ残し','খাবারের বর্জ্য','जैविक'],title:'Food scraps / 生ごみ',category:'Usually burnable (location-dependent)',advice:'Drain excess water. Collection bags and permitted contents depend on your municipality.'},
{keys:['clothes','clothing','衣類','服','কাপড়','कपड़े'],title:'Clothes / 衣類',category:'Reuse or textile collection',advice:'Consider reuse or textile pickup; dirty or damaged clothing may follow a separate city rule.'},
{keys:['umbrella','傘','ছাতা','छाता'],title:'Umbrella / 傘',category:'Non-burnable or oversized (location-dependent)',advice:'Size limits and disassembly rules vary by municipality. Check the official city list.'},
{keys:['furniture','sofa','mattress','家具','粗大ごみ','সোফা','ফার্নিচার'],title:'Furniture / oversized waste',category:'Bulky waste reservation',advice:'Bulky waste often requires a booking and fee. Use the municipality official bulky waste service.'},
{keys:['phone','smartphone','携帯電話','スマホ','ফোন','mobile'],title:'Mobile phone / smartphone',category:'Electronics collection',advice:'Use approved electronics recycling or retailer take-back where available. Remove your personal data before handover.'},
{keys:['light bulb','fluorescent','蛍光灯','電球','বাল্ব'],title:'Light bulb / fluorescent tube',category:'Varies by bulb type',advice:'Fluorescent and LED lamps may use different categories. Follow local hazardous and non-burnable rules.'}
];
function runSearch(){
 const q=(el('query')?.value||'').trim();
 if(!q){window.toast?.('Enter an item to search.');el('query')?.focus();return}
 const needle=q.toLocaleLowerCase().normalize('NFKC');
 const matches=items.filter(x=>x.keys.some(k=>needle.includes(k.toLocaleLowerCase())||k.toLocaleLowerCase().includes(needle)));
 const result=el('smartResult')||el('areaResult');if(!result)return;
 result.classList.add('show');result.replaceChildren();
 const wrap=document.createElement('div');
 const h=document.createElement('strong');h.textContent=matches.length?'Sorting assistant · '+matches[0].title:'Sorting assistant · '+q;wrap.append(h);
 const desc=document.createElement('p');desc.textContent=matches.length?matches[0].category+' — '+matches[0].advice:'This item is not in the built-in guide yet. Use your municipality’s official item lookup; do not assume the disposal category.';wrap.append(desc);
 if(matches.length>1){const p=document.createElement('p');p.textContent='Other possible matches: '+matches.slice(1,4).map(x=>x.title).join(', ');wrap.append(p)}
 const city=el('city')?.value;const official={Kobe:'https://www.city.kobe.lg.jp/a04164/kurashi/recycle/gomi/dashikata/calendar/index.html',Osaka:'https://www.city.osaka.lg.jp/kankyo/page/0000370521.html',Kyoto:'https://kogomi.city.kyoto.lg.jp/areas/'};
 const link=document.createElement('a');link.href=official[city]||'https://www.google.com/search?q=Japan+municipality+official+garbage+sorting';link.target='_blank';link.rel='noopener noreferrer';link.textContent='Verify with official municipality ↗';link.style.color='#bba6ff';wrap.append(link);
 const foot=document.createElement('p');foot.style.fontSize='12px';foot.style.opacity='.75';foot.textContent='Category guidance, not AI-generated municipal confirmation. Actual pickup days depend on your precise address.';wrap.append(foot);
 result.append(wrap);result.scrollIntoView({behavior:'smooth',block:'center'});
}
function monthCalendar(offset=0){
 const target=el('calendar');if(!target)return;
 const now=new Date();const tokyo=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
 const parts=tokyo.split('-').map(Number);const yr=parts[0],month=parts[1],today=parts[2];
 const first=new Date(Date.UTC(yr,month-1+offset,1));
 const y=first.getUTCFullYear(),m=first.getUTCMonth();
 const days=new Date(Date.UTC(y,m+1,0)).getUTCDate();const start=first.getUTCDay();
 target.replaceChildren();
 ['Su','Mo','Tu','We','Th','Fr','Sa'].forEach(x=>{let cell=document.createElement('span');cell.textContent=x;target.append(cell)});
 for(let i=0;i<start;i++){let cell=document.createElement('span');cell.textContent='';target.append(cell)}
 for(let i=1;i<=days;i++){let cell=document.createElement('span');cell.textContent=String(i);if(y===yr&&m===month-1&&i===today)cell.className='today';cell.setAttribute('aria-label',y+'-'+String(m+1).padStart(2,'0')+'-'+String(i).padStart(2,'0')+' — collection schedule unverified');target.append(cell)}
 const title=el('calTitle');if(title){let label=title.parentElement.querySelector('.month-label');if(!label){label=document.createElement('p');label.className='sub month-label';title.insertAdjacentElement('afterend',label)}label.textContent=first.toLocaleDateString('en-US',{month:'long',year:'numeric',timeZone:'UTC'})}
}
const ready=()=>{
 const search=el('searchBtn'),q=el('query');
 if(search)search.onclick=runSearch;
 if(q)q.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();runSearch()}});
 monthCalendar();
 const city=el('city');if(city)city.addEventListener('change',()=>{let info=document.querySelector('.verified-warning');if(!info){info=document.createElement('p');info.className='sub verified-warning';el('calendar')?.insertAdjacentElement('afterend',info)}info.textContent='Official collection dates for '+(city.value||'your city')+' require a verified ward and town match. No pickup days are invented.'});
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready);else ready();
})();