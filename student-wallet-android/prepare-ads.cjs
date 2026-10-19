// Executed by CI after `npx cap add android`; preserves the hosted website source.
const fs = require('node:fs');
const path = require('node:path');
const base = __dirname;
const manifest = path.join(base, 'android/app/src/main/AndroidManifest.xml');
let xml = fs.readFileSync(manifest, 'utf8');
const appId = 'ca-app-pub-3728341118830943~5026466433'; // Student Wallet Pro official AdMob Android App ID
if (!xml.includes('com.google.android.gms.ads.APPLICATION_ID')) {
  xml = xml.replace(/<application\b/, '<application android:usesCleartextTraffic="false"');
  // AndroidManifest may already contain usesCleartextTraffic; avoid duplicate attributes.
  xml = xml.replace(/(<application[^>]*?)\sandroid:usesCleartextTraffic="false"(?=[^>]*android:usesCleartextTraffic=)/, '$1');
  xml = xml.replace(/(<application\b[^>]*>)/, '$1\n        <meta-data android:name="com.google.android.gms.ads.APPLICATION_ID" android:value="' + appId + '" />');
  fs.writeFileSync(manifest, xml);
}
const htmlPath = path.join(base, 'www/index.html');
let html = fs.readFileSync(htmlPath, 'utf8');
if (!html.includes('/admob.js')) {
  const inject = '<script defer src="/admob.js"></script>';
  html = html.replace('</head>', inject + '</head>');
  fs.writeFileSync(htmlPath, html);
}
console.log('Android AdMob App ID + App Open / Interstitial demo script configured');
