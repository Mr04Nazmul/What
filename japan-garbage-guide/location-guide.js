/* Google My Maps official recycling maps; location is processed only on-device. */
(function(){
const maps={
 paper:"1MSVeSHQ1YYBcWkHnoWmnP65GvcEaxWw",
 electronics:"1XB4NRVfV47VFCnyLwyybxmh7fW5JpOc",
 batteries:"13fmx-6ZDXNCpRA6_nbJLvviFFbK2rMw",
 clothes:"1V0eQwCg3ZPlFWwS-X6eAtD2wjJANgU4",
 fluorescent:"1iIxDLNmnm-s0_oaJyAvYFTSQUb7Otwk"
};
const $=id=>document.getElementById(id);
function setMap(){const mid=maps[$('recycleCategory').value]||maps.paper;const frame=$('wasteMap');if(frame && !document.body.classList.contains('live-map-active'))frame.src='https://www.google.com/maps/d/embed?mid='+encodeURIComponent(mid);$('openOfficialMap').href='https://www.google.com/maps/d/viewer?mid='+encodeURIComponent(mid)}
function geo(){if(window.JGGNearby100m){window.JGGNearby100m.start();return;}
const status=$('locationState');if(!navigator.geolocation){status.textContent='GPS is not supported by this browser';return}
status.textContent='Requesting location…';$('useLocation').disabled=true;
navigator.geolocation.getCurrentPosition(pos=>{
 const lat=pos.coords.latitude,lon=pos.coords.longitude,accuracy=Math.round(pos.coords.accuracy);
 const q=lat+','+lon;
 status.textContent='Location found (±'+accuracy+'m)';
 $('openNearbyMap').href='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent('recycling drop-off near '+q);
 $('openNearbyMap').textContent='↗ Nearby places in Google Maps';
 const note=$('geoNote');note.innerHTML='<strong>Location enabled.</strong> The map above is Kobe City’s official recycling layer (Kobe only), not a GPS-generated list. The nearby search opens Google Maps around your actual position, but those search results are <strong>not verified municipal disposal permissions</strong>. Never use another neighborhood’s residential garbage station without authorization.';
 $('useLocation').textContent='✓ Refresh location';$('useLocation').disabled=false;
},err=>{status.textContent=err.code===1?'Location denied — allow it in browser settings':err.code===2?'Location unavailable':'GPS timed out — try again';$('useLocation').disabled=false},{enableHighAccuracy:true,timeout:13000,maximumAge:60000});
}
function start(){
if($('recycleCategory')){$('recycleCategory').addEventListener('change',setMap);setMap()}
if($('useLocation'))$('useLocation').addEventListener('click',geo);
const n=document.querySelector('.notice');if(n&&/Verified schedule policy|Official-date safety/i.test(n.textContent))n.remove();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
