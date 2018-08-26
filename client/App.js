import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import LandingScreen from './screens/LandingScreen.js'
import SignUpScreen from './screens/SignUpScreen.js'
import LogInScreen from './screens/LogInScreen.js'


const RootStack = createStackNavigator(
  {
    LandingScreen: LandingScreen,
    SignUpScreen: SignUpScreen,
    LogInScreen: LogInScreen
  },
  {
    initialRouteName: "LandingScreen"
  }

)

export default class App extends React.Component {
  render() {
    return (
      <RootStack/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


// <View style={styles.container}>
//   {/* <Text>Open up App.js to start working on your app!</Text>
//         <Text>Changes you make will automatically reload.</Text>
//         <Text>Shake your phone to open the developer menu.</Text> */}
//   <LandingScreen />
// </View>