import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NitroList } from 'react-native-nitro-list';

function App(): React.JSX.Element {
  return (
    <View style={styles.container}>
        <NitroList isRed={true} style={styles.view} testID="nitro-list" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  view: {
    width: 200,
    height: 200
  }});

export default App;