import 'react-native-gesture-handler';
import React from 'react';
import {AppRegistry, LogBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {Provider as PaperProvider} from 'react-native-paper';
import {Provider as StoreProvider} from 'react-redux';
import {store, persistor} from './src/redux/store';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {PersistGate} from 'redux-persist/integration/react';
import './src/constants/IMLocalize';
import {ChatMessageCountProvider} from './src/context/chatCountProvider';
import {NotificationCountProvider} from './src/context/notificationCountProvider';
import {UserProfileProvider} from './src/context/UserProfileProvider';
import {SocketProvider} from './src/context/SocketProvider';

LogBox.ignoreAllLogs();
export default function Main() {
  return (
    <StoreProvider store={store}>
      <PersistGate persistor={persistor}>
        <PaperProvider>
          <SafeAreaProvider>
            <NotificationCountProvider>
              <UserProfileProvider>
              <ChatMessageCountProvider>
                <SocketProvider>
                  <App />
                </SocketProvider>
              </ChatMessageCountProvider>
              </UserProfileProvider>
            </NotificationCountProvider>
          </SafeAreaProvider>
        </PaperProvider>
      </PersistGate>
    </StoreProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
