/* Progressive visual/navigation enhancements. Existing municipality logic is untouched. */
(function(){
const ready=()=>{
 const hero=document.querySelector('.hero'),search=document.querySelector('.search'),query=document.getElementById('query'),more=document.getElementById('moreMenu'),moreButton=document.getElementById('moreButton'),nav=document.querySelector('.bottom-nav');
 if(hero){const h=hero.querySelector('h1');if(h){h.textContent='Know your waste. Love your city.';}const eyebrow=hero.querySelector('.eyebrow');if(eyebrow)eyebrow.textContent='✦ Your smart sorting companion';const p=hero.querySelector('p');if(p)p.textContent='Search what goes where, select your city and follow official collection rules — all in one place.';const caption=document.createElement('div');caption.className='ai-caption';caption.innerHTML='<span class="ai-dot"></span><span>Smart item search · Official municipal dates only</span>';hero.append(caption);}
 if(search){const btn=search.querySelector('button');if(btn){btn.textContent='Search ↗';btn.setAttribute('aria-label','Search waste sorting guidance');}}
 if(query)query.placeholder='Search bottles, cans, batteries…';
 const notice=document.querySelector('.notice');if(notice){notice.innerHTML='🔒 <b>Verified schedule policy:</b> Collection dates appear only when confirmed for your exact municipal area.';}
 const cards=document.querySelector('.cards');if(cards){const heading=document.createElement('h2');heading.className='section-heading';heading.textContent='Explore waste categories';cards.parentElement.insertBefore(heading,cards);}
 if(nav){const btns=[...nav.querySelectorAll('button')];const sections=[hero,document.querySelector('.grid'),cards];btns.forEach((btn,i)=>{if(i<4){btn.addEventListener('click',()=>{btns.forEach(b=>b.removeAttribute('aria-current'));btn.setAttribute('aria-current','page');});}else{btn.setAttribute('aria-label','More settings');}});
 }
 if(more&&moreButton){const close=()=>{more.hidden=true;moreButton.setAttribute('aria-expanded','false');};document.addEventListener('click',e=>{if(!more.hidden&&!more.contains(e.target)&&!moreButton.contains(e.target))close()});document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});}
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready);else ready();
})();