// Native Android-only Google demo banner. Never use production ad unit IDs for smoke tests.
import { Capacitor } from '@capacitor/core';
import { AdMob, AdmobConsentStatus, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';
async function showTestBanner() {
  if (Capacitor.getPlatform() !== 'android') return;
  try {
    let consent = await AdMob.requestConsentInfo();
    if (consent.isConsentFormAvailable && consent.status === AdmobConsentStatus.REQUIRED) {
      consent = await AdMob.showConsentForm();
    }
    if (!consent.canRequestAds) {
      console.info('[Wallet Ads] Consent not ready; skipping ad');
      return;
    }
    await AdMob.initialize();
    await AdMob.showBanner({
      adId: 'ca-app-pub-3940256099942544/6300978111',
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      isTesting: true,
      margin: 0,
    });
    document.body.classList.add('android-test-banner');
    console.info('[Wallet Ads] Google demo banner requested');
  } catch (error) {
    console.warn('[Wallet Ads] Demo banner unavailable', error);
  }
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => setTimeout(showTestBanner, 700), { once: true });
} else {
  setTimeout(showTestBanner, 700);
}
