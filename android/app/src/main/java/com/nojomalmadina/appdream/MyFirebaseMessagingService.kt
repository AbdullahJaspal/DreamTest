package com.nojomalmadina.appdream

import android.annotation.SuppressLint
import android.content.Intent
import android.util.Log
import com.facebook.react.HeadlessJsTaskService
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage

@SuppressLint("MissingFirebaseInstanceTokenRefresh")
class MyFirebaseMessagingService : FirebaseMessagingService() {

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        super.onMessageReceived(remoteMessage)

        // Log message received
        Log.d("MyFirebaseService", "Push notification received")

        // Log notification data payload (if any)
        remoteMessage.data.let {
            Log.d("MyFirebaseService", "Message data payload: $it")
        }

        // Log notification message body (if any)
        remoteMessage.notification?.let {
            Log.d("MyFirebaseService", "Message Notification Body: ${it.body}")
        }

        // Trigger Headless JS task in both foreground and background/killed states
        val intent = Intent(this, MyFirebaseHeadlessService::class.java).apply {
            putExtra("remoteMessage", remoteMessage)
        }
        HeadlessJsTaskService.acquireWakeLockNow(this)
        startService(intent)
    }
}
