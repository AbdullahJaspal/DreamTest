import notifee, {AndroidImportance, AndroidStyle} from '@notifee/react-native';

// Helper function to map string to AndroidImportance enum
function getAndroidImportance(importance: string): AndroidImportance {
  // Remove the 'AndroidImportance.' prefix if present
  if (importance.startsWith('AndroidImportance.')) {
    importance = importance.replace('AndroidImportance.', '');
  }
  // Return the corresponding enum value or DEFAULT if not found
  return (
    AndroidImportance[importance as keyof typeof AndroidImportance] ||
    AndroidImportance.DEFAULT
  );
}

async function onMessageReceived(message: any) {
  try {
    let data = message?.data;

    // Identify if the notification is for an admin
    const isAdmin = data.hasOwnProperty('isAdmin');

    if (isAdmin) {
      data = JSON.parse(JSON.stringify(data));
    }
    if (!data) {
      console.warn('No data received in the message');
      return;
    }

    // Regular user notification handling
    if (!isAdmin && data?.username && data?.body) {
      const channelId = await notifee.createChannel({
        id: `${Date.now()}`,
        name: `default`,
        badge: true,
        importance: AndroidImportance.HIGH,
        sound: 'sound',
        vibrationPattern: [300, 500],
      });

      await notifee.displayNotification({
        title: data?.username,
        body: data?.body,
        android: {
          channelId,
          sound: 'sound',
          vibrationPattern: [300, 500],
          largeIcon: data.profile_pic,
        },
      });
    }
    const channelIdAdmin = isAdmin ? JSON.parse(data?.channelId || '{}') : null;
    const notifeeDataAdmin = isAdmin ? JSON.parse(data?.notifee || '{}') : null;

    // Admin notification handling
    if (isAdmin && channelIdAdmin?.id) {
      let vibration: boolean | undefined = undefined;
      if (typeof channelIdAdmin.vibration === 'string') {
        vibration = channelIdAdmin.vibration.toLowerCase() === 'true';
      } else if (typeof channelIdAdmin.vibration === 'boolean') {
        vibration = channelIdAdmin.vibration;
      }

      // Create admin notification channel
      await notifee.createChannel({
        id: channelIdAdmin.id,
        name: channelIdAdmin.name || channelIdAdmin.id,
        badge: channelIdAdmin.badge !== undefined ? channelIdAdmin.badge : true,
        importance: getAndroidImportance(
          channelIdAdmin.importance || 'DEFAULT',
        ),
        sound: channelIdAdmin.sound || 'default',
        vibration: vibration !== undefined ? vibration : true,
        vibrationPattern: channelIdAdmin.vibrationPattern || [300, 500],
      });

      // Determine admin importance
      let adminImportance: AndroidImportance = AndroidImportance.DEFAULT;
      if (notifeeDataAdmin?.android?.importance) {
        adminImportance = getAndroidImportance(
          notifeeDataAdmin.android.importance,
        );
      }

      // Display admin notification
      await notifee.displayNotification({
        title: notifeeDataAdmin?.title || 'Admin Notification Title',
        subtitle: notifeeDataAdmin?.subtitle || 'Admin Notification Subtitle',
        body: notifeeDataAdmin?.bot || 'Admin Notification Body',
        android: {
          channelId: notifeeDataAdmin?.android?.channelId || channelIdAdmin.id,
          largeIcon: notifeeDataAdmin?.android?.largeIcon,
          importance: adminImportance,
          // color: notifeeDataAdmin?.android?.color || '#020202',
          sound: notifeeDataAdmin?.android?.sound || 'default',
          vibrationPattern: notifeeDataAdmin?.android?.vibrationPattern || [
            300, 500,
          ],
          style: {
            type: AndroidStyle.BIGPICTURE,
            picture:
              notifeeDataAdmin?.android?.style?.picture || 'default_picture',
          },

          pressAction: {
            id: 'click-picture',
          },
          actions: notifeeDataAdmin?.buttonlink
            ? [
                {
                  pressAction: {
                    id: 'click-button',
                  },
                  title: notifeeDataAdmin?.buttontext
                    ? `<p style="backgroundcolor:#2b60b5; "> ${notifeeDataAdmin?.buttontext}</p>`
                    : `<p style="color: #51cf4a; "> ${notifeeDataAdmin?.buttonlink} </p>`,
                },
              ]
            : [],
        },
        data: {
          pictureLink: notifeeDataAdmin?.picturelink,

          buttonLink: notifeeDataAdmin?.buttonlink,
        },
      });
    }
  } catch (error) {
    console.error('Error processing the notification:', error);
  }
}

export {onMessageReceived};
