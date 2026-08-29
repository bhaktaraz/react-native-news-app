import {AppRegistry} from 'react-native';
import {getMessaging, setBackgroundMessageHandler} from '@react-native-firebase/messaging';
import App from './App';
import {name as appName} from './app.json';

// Must be registered outside the React tree - this is what lets FCM deliver
// data messages while the app is backgrounded or killed on Android.
setBackgroundMessageHandler(getMessaging(), async () => {});

AppRegistry.registerComponent(appName, () => App);
