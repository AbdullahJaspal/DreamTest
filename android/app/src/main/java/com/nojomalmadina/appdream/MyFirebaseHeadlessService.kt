package com.nojomalmadina.appdream

import android.content.Intent
import com.facebook.react.HeadlessJsTaskService
import com.facebook.react.bridge.Arguments
import com.facebook.react.jstasks.HeadlessJsTaskConfig
import com.google.firebase.messaging.RemoteMessage

class MyFirebaseHeadlessService : HeadlessJsTaskService() {

    override fun getTaskConfig(intent: Intent): HeadlessJsTaskConfig? {
        val remoteMessage = intent.getParcelableExtra<RemoteMessage>("remoteMessage")
        val extras = remoteMessage?.data?.let { data ->
            Arguments.createMap().apply {
                data.forEach { (key, value) ->
                    putString(key, value)
                }
            }
        }

        return HeadlessJsTaskConfig(
            "RNFirebaseBackgroundMessage",
            extras,
            5000,
            true
        )
    }
}
