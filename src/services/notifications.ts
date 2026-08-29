import {
  getInitialNotification,
  getMessaging,
  onNotificationOpenedApp,
  subscribeToTopic,
} from "@react-native-firebase/messaging";
import { NavigationContainerRef } from "@react-navigation/native";
import { PermissionsAndroid, Platform } from "react-native";
import { NewsStackParamList } from "../navigators/screen-stack-navigators";

/** All installs subscribe here; the server publishes one FCM message per
 *  published news item to this topic (see FcmNotifier on the backend). */
const NEWS_TOPIC = "news_all";

const navigateToArticle = (
  navigationRef: NavigationContainerRef<NewsStackParamList>,
  newsId: string | undefined
) => {
  if (!newsId || !navigationRef.isReady()) {
    return;
  }

  navigationRef.navigate("ArticleDetail", { id: newsId });
};

/**
 * Requests notification permission, subscribes to the news topic, and wires
 * up tap-to-open-article for both a backgrounded and a cold-started app.
 * Call once from the root component after the navigation container mounts.
 */
export async function initPushNotifications(
  navigationRef: NavigationContainerRef<NewsStackParamList>
): Promise<void> {
  const messaging = getMessaging();

  try {
    // @react-native-firebase/messaging's own requestPermission() is a
    // deprecated, iOS-oriented API that does not trigger Android 13+'s
    // POST_NOTIFICATIONS runtime prompt - that has to go through
    // PermissionsAndroid directly. It's a no-op resolving to "granted" on
    // older Android versions, where the permission doesn't exist.
    if (Platform.OS === "android" && Platform.Version >= 33) {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    }

    await subscribeToTopic(messaging, NEWS_TOPIC);
  } catch (error) {
    // No Play Services, permission denied, etc. - the app still works, just
    // without push notifications.
    console.warn("Push notification setup failed", error);
  }

  onNotificationOpenedApp(messaging, (remoteMessage) => {
    navigateToArticle(navigationRef, remoteMessage?.data?.newsId as string | undefined);
  });

  const initialMessage = await getInitialNotification(messaging);
  if (initialMessage) {
    navigateToArticle(navigationRef, initialMessage.data?.newsId as string | undefined);
  }
}
