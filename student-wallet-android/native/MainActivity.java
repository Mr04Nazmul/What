package com.studentwallet.pro;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(WalletAppOpenPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
