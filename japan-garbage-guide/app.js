/* Japan Garbage Guide PWA interaction layer */
const navButtons = document.querySelectorAll('[data-tab]');
const panels = document.querySelectorAll('[data-panel]');
navButtons.forEach(btn => btn.addEventListener('click', () => {
  const target = btn.dataset.tab;
  navButtons.forEach(b => b.setAttribute('aria-current', String(b === btn)));
  panels.forEach(p => p.hidden = p.dataset.panel !== target);
}));
const more = document.querySelector('[data-more]');
const menu = document.querySelector('[data-more-menu]');
if (more && menu) {
  more.addEventListener('click', () => {
    const open = menu.hidden;
    menu.hidden = !open;
    more.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', e => {
    if (!menu.contains(e.target) && !more.contains(e.target)) {
      menu.hidden = true; more.setAttribute('aria-expanded', 'false');
    }
  });
}
const toast = document.querySelector('[data-toast]');
function announce(message) {
  if (!toast) return;
  toast.textContent = message; toast.hidden = false;
  clearTimeout(announce.timer); announce.timer = setTimeout(() => toast.hidden = true, 2800);
}
document.querySelector('[data-notify]')?.addEventListener('click', async () => {
  if (!('Notification' in window)) return announce('This browser does not support notifications.');
  try {
    const permission = await Notification.requestPermission();
    announce(permission === 'granted' ? 'Permission granted. Background reminders still need a push service.' : 'Notification permission was not granted.');
  } catch { announce('Notification permission could not be requested.'); }
});
document.querySelector('[data-area-form]')?.addEventListener('submit', e => {
  e.preventDefault();
  const data = new FormData(e.currentTarget);
  const city = String(data.get('city') || '').trim();
  const ward = String(data.get('ward') || '').trim();
  const town = String(data.get('town') || '').trim();
  const result = document.querySelector('[data-area-result]');
  if (!city || !ward || !town) { result.textContent = 'Enter city, ward, and town/chome.'; return; }
  result.textContent = city + ' · ' + ward + ' · ' + town + ' saved in this page session. Official schedule lookup is not connected yet; no dates will be invented.';
});
document.querySelector('[data-reminder-form]')?.addEventListener('submit', e => {
  e.preventDefault();
  const data = new FormData(e.currentTarget);
  document.querySelector('[data-reminder-result]').textContent = 'Preference: ' + data.get('time') + '. Background scheduling is not active until a push backend and scheduled job are configured.';
});
