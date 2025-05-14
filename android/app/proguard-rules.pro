# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:
# Existing rules for React Native and libraries
-keep class com.facebook.react.** { *; }
-dontwarn com.facebook.react.**

# Fresco specific warnings
-dontwarn com.facebook.imagepipeline.cache.AnimatedCache
-dontwarn com.facebook.imagepipeline.cache.AnimationFrames

# Stripe Push Provisioning warnings
-dontwarn com.stripe.android.pushProvisioning.PushProvisioningActivity$g
-dontwarn com.stripe.android.pushProvisioning.PushProvisioningActivityStarter$Args
-dontwarn com.stripe.android.pushProvisioning.PushProvisioningActivityStarter$Error
-dontwarn com.stripe.android.pushProvisioning.PushProvisioningActivityStarter
-dontwarn com.stripe.android.pushProvisioning.PushProvisioningEphemeralKeyProvider

# General suppression of warnings for third-party libraries
-dontwarn javax.annotation.**
-dontwarn org.chromium.**
-dontwarn kotlin.**
