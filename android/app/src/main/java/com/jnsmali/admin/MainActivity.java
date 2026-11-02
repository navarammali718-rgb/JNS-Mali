package com.jnsmali.admin;

import android.Manifest;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.webkit.GeolocationPermissions;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.Toast;
import androidx.activity.OnBackPressedCallback;
import com.getcapacitor.BridgeActivity;
import java.util.ArrayList;
import java.util.List;

public class MainActivity extends BridgeActivity {
    private long lastBackPressTime = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Request runtime permissions on launch so Location & Notifications appear in Android App Info -> Permissions
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            List<String> perms = new ArrayList<>();
            if (checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                perms.add(Manifest.permission.ACCESS_FINE_LOCATION);
                perms.add(Manifest.permission.ACCESS_COARSE_LOCATION);
            }
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                if (checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                    perms.add(Manifest.permission.POST_NOTIFICATIONS);
                }
            }
            if (!perms.isEmpty()) {
                requestPermissions(perms.toArray(new String[0]), 1001);
            }
        }

        // Create high-importance Notification Channel for Order Alerts (Android 8.0+)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                "orders_channel",
                "Order Alerts",
                NotificationManager.IMPORTANCE_HIGH
            );
            channel.setDescription("Notifications for orders and delivery updates");
            channel.enableLights(true);
            channel.enableVibration(true);
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(channel);
            }
        }

        // Enable Geolocation and DOM storage in WebView
        try {
            WebView webView = getBridge() != null ? getBridge().getWebView() : null;
            if (webView != null) {
                WebSettings settings = webView.getSettings();
                settings.setGeolocationEnabled(true);
                settings.setDatabaseEnabled(true);
                settings.setDomStorageEnabled(true);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

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
