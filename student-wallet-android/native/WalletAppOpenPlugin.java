package com.studentwallet.pro;

import android.app.Activity;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.FullScreenContentCallback;
import com.google.android.gms.ads.AdError;
import com.google.android.gms.ads.appopen.AppOpenAd;

@CapacitorPlugin(name = "WalletAppOpen")
public class WalletAppOpenPlugin extends Plugin {
    private AppOpenAd ad;
    @PluginMethod
    public void load(PluginCall call) {
        final String id = call.getString("adId");
        if (id == null || id.isEmpty()) { call.reject("Missing adId"); return; }
        getActivity().runOnUiThread(() -> AppOpenAd.load(getContext(), id, new AdRequest.Builder().build(),
            new AppOpenAd.AppOpenAdLoadCallback() {
                @Override public void onAdLoaded(AppOpenAd loaded) {
                    ad = loaded;
                    notifyListeners("loaded", new JSObject());
                    call.resolve();
                }
                @Override public void onAdFailedToLoad(LoadAdError error) {
                    JSObject details = new JSObject(); details.put("error", error.toString()); notifyListeners("failed", details);
                    call.reject(error.toString());
                }
            }));
    }
    @PluginMethod
    public void show(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            if (ad == null) { call.reject("App Open ad not loaded"); return; }
            final AppOpenAd current = ad;
            ad = null;
            current.setFullScreenContentCallback(new FullScreenContentCallback() {
                @Override public void onAdDismissedFullScreenContent() {
                    notifyListeners("closed", new JSObject());
                }
                @Override public void onAdFailedToShowFullScreenContent(AdError error) {
                    JSObject details = new JSObject(); details.put("error", error.toString()); notifyListeners("failedToShow", details);
                }
                @Override public void onAdShowedFullScreenContent() {
                    notifyListeners("shown", new JSObject());
                }
            });
            current.show(getActivity());
            call.resolve();
        });
    }
}
