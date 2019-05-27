package org.revolutionrobotics.softnav;

import android.view.View;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

public class SoftNavModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public SoftNavModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Nonnull
    @Override
    public String getName() {
        return "SofNavModule";
    }

    @ReactMethod
    public void startSoftNavListener() {
        final View decorView = reactContext.getCurrentActivity().getWindow().getDecorView();

        getCurrentActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                decorView.setOnSystemUiVisibilityChangeListener(new View.OnSystemUiVisibilityChangeListener() {
                    @Override
                    public void onSystemUiVisibilityChange(int visibility) {
                        boolean softNavHidden = (visibility & View.SYSTEM_UI_FLAG_HIDE_NAVIGATION) == 0;

                        WritableMap params = Arguments.createMap();
                        params.putBoolean("softNavHidden", softNavHidden);

                        sendEvent(reactContext, "softNavDisplayEvent", params);
                    }
                });
            }
        });
    }

    private void sendEvent(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("softNavDisplayEvent", params);
    }
}
