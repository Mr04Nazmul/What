// Student Wallet Pro — Android native AdMob full-screen formats.
// Builds use Google's demo ad units until a separately reviewed production release.
// Real AdMob units (configured but NOT used by CI demo builds):
// Interstitial: ca-app-pub-3728341118830943/1198902066
// App Open:     ca-app-pub-3728341118830943/8989762173
import { Capacitor, registerPlugin } from '@capacitor/core';
const WalletAppOpen = registerPlugin('WalletAppOpen');
import { App } from '@capacitor/app';
import { AdMob, AdmobConsentStatus, InterstitialAdPluginEvents } from '@capacitor-community/admob';

const DEMO_INTERSTITIAL = 'ca-app-pub-3940256099942544/1033173712';
const DEMO_APP_OPEN = 'ca-app-pub-3940256099942544/9257395921';
const USE_DEMO = !__WALLET_PRODUCTION__; // Selected at bundle-time: debug=test, release=production.
const MIN_AD_GAP_MS = USE_DEMO ? 0 : 180000;
const INTERSTITIAL_ID = USE_DEMO ? DEMO_INTERSTITIAL : 'ca-app-pub-3728341118830943/1198902066';
const APP_OPEN_ID = USE_DEMO ? DEMO_APP_OPEN : 'ca-app-pub-3728341118830943/8989762173';
const log = (msg, data) => console.info('[Wallet AdMob] ' + msg, data || '');
let interstitialReady = false;
let appOpenReady = false;
let adShowing = false;
let initialized = false;
let foregroundCount = 0;
let lastShownAt = 0;

async function loadInterstitial() {
  try {
    await AdMob.prepareInterstitial({ adId: INTERSTITIAL_ID });
    interstitialReady = true;
    log('Interstitial loaded');
  } catch (e) {
    interstitialReady = false;
    console.warn('[Wallet AdMob] Interstitial load failed', e);
  }
}
async function loadAppOpen() {
  try {
    await WalletAppOpen.load({ adId: APP_OPEN_ID });
    appOpenReady = true;
    log('App Open loaded');
  } catch (e) {
    appOpenReady = false;
    console.warn('[Wallet AdMob] App Open load failed', e);
  }
}
async function showAppOpenWhenReady() {
  if (!appOpenReady || adShowing || document.hidden) return;
  try {
    adShowing = true;
    appOpenReady = false;
    log('App Open showing');
    await WalletAppOpen.show();
    lastShownAt = Date.now();
    log('App Open shown');
  } catch (e) {
    adShowing = false;
    console.warn('[Wallet AdMob] App Open show failed', e);
  }
}
async function showInterstitialOnNaturalBreak() {
  // Never interrupt forms, financial entries, or the first two tab transitions.
  if (!interstitialReady || adShowing || Date.now() - lastShownAt < MIN_AD_GAP_MS) { log('Interstitial skipped (not loaded, busy, or cooldown)'); return; }
  try {
    adShowing = true;
    interstitialReady = false;
    log('Interstitial showing');
    await AdMob.showInterstitial({ adId: INTERSTITIAL_ID });
    lastShownAt = Date.now();
    log('Interstitial shown');
  } catch (e) {
    adShowing = false;
    console.warn('[Wallet AdMob] Interstitial show failed', e);
  }
}
async function initAds() {
  if (Capacitor.getPlatform() !== 'android' || initialized) return;
  initialized = true;
  try {
    if (!USE_DEMO) {
      let consent = await AdMob.requestConsentInfo();
      if (consent.isConsentFormAvailable && consent.status === AdmobConsentStatus.REQUIRED) {
        consent = await AdMob.showConsentForm();
      }
      if (!consent.canRequestAds) {
        log('Production ads withheld: consent not ready');
        return;
      }
    } else {
      log('Demo-only build: Google test app/unit IDs; no live ad requests');
    }
    await AdMob.initialize();
    await AdMob.addListener(InterstitialAdPluginEvents.Closed, () => {
      adShowing = false;
      loadInterstitial();
    });
    await AdMob.addListener(InterstitialAdPluginEvents.FailedToShow, error => {
      adShowing = false; console.warn('[Wallet AdMob] Interstitial show error', error);
    });
    await AdMob.addListener(InterstitialAdPluginEvents.FailedToLoad, error => console.warn('[Wallet AdMob] Interstitial load error', error));
    await WalletAppOpen.addListener('closed', () => {
      adShowing = false;
      loadAppOpen();
    });
    await WalletAppOpen.addListener('failedToShow', error => {
      adShowing = false; console.warn('[Wallet AdMob] App Open show error', error);
    });
    await WalletAppOpen.addListener('failed', error => console.warn('[Wallet AdMob] App Open load error', error));
    await loadInterstitial();
    await loadAppOpen();
    // App Open belongs at app load / foreground return, not each tab click.
    await showAppOpenWhenReady();
    await App.addListener('appStateChange', async state => {
      if (!state.isActive) return;
      foregroundCount++;
      if (foregroundCount > 0 && Date.now() - lastShownAt > MIN_AD_GAP_MS) await showAppOpenWhenReady();
    });
    const nav = document.querySelector('.nav');
    if (nav) {
      let transitions = 0;
      nav.addEventListener('click', event => {
        if (!event.target.closest('button')) return;
        transitions++;
        if (transitions >= 3 && transitions % 4 === 3) showInterstitialOnNaturalBreak();
      });
    }
    log('Interstitial + App Open demo integration ready');
  } catch (e) {
    console.warn('[Wallet AdMob] Initialization or consent failed', e);
  }
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => setTimeout(initAds, 700), { once: true });
} else {
  setTimeout(initAds, 700);
}
