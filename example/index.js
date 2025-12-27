// /**
//  * @format
//  */

// import { AppRegistry } from 'react-native';
// import App from './App';
// import { name as appName } from './app.json';

// AppRegistry.registerComponent(appName, () => App);

/**
 * @format
 */

import { AppRegistry } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import App from './App'
import { name as appName } from './app.json'

const Root = () => {
  return (
    <SafeAreaProvider>
      <App />
    </SafeAreaProvider>
  )
}

AppRegistry.registerComponent(appName, () => Root)
