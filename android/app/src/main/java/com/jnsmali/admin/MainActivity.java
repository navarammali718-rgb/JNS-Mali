package com.jnsmali.admin;

import android.net.Uri;
import android.os.Bundle;
import android.webkit.WebView;
import android.widget.Toast;
import androidx.activity.OnBackPressedCallback;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private long lastBackPressTime = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Native Android physical back button & gesture interceptor
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                try {
                    WebView webView = getBridge() != null ? getBridge().getWebView() : null;
                    if (webView != null) {
                        String url = webView.getUrl();
                        if (url != null) {
                            Uri uri = Uri.parse(url);
                            String path = uri.getPath();
                            if (path == null) path = "/";

                            // If inside an admin subpage, return to /admin dashboard
                            if (path.startsWith("/admin/") && !path.equals("/admin/")) {
                                webView.loadUrl(uri.getScheme() + "://" + uri.getAuthority() + "/admin");
                                return;
                            }

                            // If on admin dashboard root (/admin or /admin/), confirm exit with double-tap
                            if (path.equals("/admin") || path.equals("/admin/")) {
                                handleExitWithDoubleTap("Press back again to exit Admin");
                                return;
                            }

                            // If inside a store subpage (/product/*, /cart, /checkout, /orders, /category/*, /shop)
                            if (!path.equals("/") && !path.isEmpty()) {
                                if (webView.canGoBack()) {
                                    webView.goBack();
                                } else {
                                    webView.loadUrl(uri.getScheme() + "://" + uri.getAuthority() + "/");
                                }
                                return;
                            }

                            // If on store root (/), confirm exit with double-tap
                            if (path.equals("/") || path.isEmpty()) {
                                handleExitWithDoubleTap("Press back again to exit");
                                return;
                            }
                        }

                        if (webView.canGoBack()) {
                            webView.goBack();
                            return;
                        }
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }

                finish();
            }
        });
    }

    private void handleExitWithDoubleTap(String message) {
        long currentTime = System.currentTimeMillis();
        if (currentTime - lastBackPressTime < 2000) {
            finish();
        } else {
            lastBackPressTime = currentTime;
            Toast.makeText(this, message, Toast.LENGTH_SHORT).show();
        }
    }
}
