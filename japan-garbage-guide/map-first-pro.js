/* Map First Pro layout/navigation — no fabricated locations or distances. */
(function(){
const $=id=>document.getElementById(id);
const categories=[
{value:'paper',emoji:'📦',name:'Paper & cardboard',description:'Kobe City official recycling map'},
{value:'electronics',emoji:'📱',name:'Small electronics',description:'Municipal recycling drop-off map'},
{value:'batteries',emoji:'🔋',name:'Battery collection',description:'Check accepted battery types before visiting'},
{value:'clothes',emoji:'👕',name:'Clothes & textiles',description:'Participating collection locations'},
{value:'fluorescent',emoji:'💡',name:'Fluorescent lamps',description:'Special collection locations'}
];
function go(id){$(id)?.scrollIntoView({behavior:'smooth',block:'start'})}
function init(){
const root=document.querySelector('.app'),geo=$('geoPanel'),hero=document.querySelector('.hero'),results=$('smartResult');
if(root&&geo&&hero){hero.insertAdjacentElement('afterend',geo); if(results)geo.insertAdjacentElement('afterend',results)}
const list=document.createElement('div');list.id='nearbyList';list.innerHTML='<div class="nearby-title"><h3>Explore recycling points</h3><small>Kobe official layers</small></div>';
categories.forEach(c=>{
 const card=document.createElement('div');card.className='nearby-card';
 const icon=document.createElement('div');icon.className='nearby-icon';icon.textContent=c.emoji;
 const main=document.createElement('div');main.className='nearby-card-main';
 const heading=document.createElement('strong');heading.textContent=c.name;
 const desc=document.createElement('small');desc.textContent=c.description;
 const btn=document.createElement('button');btn.type='button';btn.textContent='View';btn.setAttribute('aria-label','Show '+c.name+' recycling locations');
 btn.onclick=()=>{$('recycleCategory').value=c.value;$('recycleCategory').dispatchEvent(new Event('change'));go('wasteMap')};
 main.append(heading,desc);card.append(icon,main,btn);list.append(card);
});
const select=document.querySelector('.geo-select');if(select)select.insertAdjacentElement('afterend',list);
const nav=document.querySelectorAll('.bottom-nav button');
nav.forEach(btn=>btn.addEventListener('click',()=>{
 nav.forEach(n=>n.removeAttribute('aria-current'));btn.setAttribute('aria-current','page');
}));
if($('navHome'))$('navHome').onclick=()=>go('geoPanel');
if($('navMap'))$('navMap').onclick=()=>go('wasteMap');
if($('navSort'))$('navSort').onclick=()=>go('query');
if($('navCalendar'))$('navCalendar').onclick=()=>go('schedulePanel');
if($('moreButton'))$('moreButton').addEventListener('click',()=>{nav.forEach(x=>x.removeAttribute('aria-current'));$('moreButton').setAttribute('aria-current','page')});
const n=document.querySelector('.notice');if(n&&/Official-date safety|Verified schedule policy/i.test(n.textContent))n.remove();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();