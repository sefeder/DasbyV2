import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import LandingScreen from './screens/LandingScreen.js';
import SignUpScreen from './screens/SignUpScreen.js';
import LogInScreen from './screens/LogInScreen.js';
import UserHomeScreen from './screens/UserHomeScreen.js';
import AdminLogInScreen from './screens/AdminLogInScreen.js';
import AdminSelectionScreen from './screens/AdminSelectionScreen.js';
import AdminChatScreen from './screens/AdminChatScreen.js';
import AdminSignUpScreen from './screens/AdminSignUpScreen.js';

const RootStack = createStackNavigator(
  {
    LandingScreen: 
      {
        screen: LandingScreen,
        navigationOptions: ({ navigation }) => ({
          title: 'Welcome to Dasby',
        })
      },
    SignUpScreen:
      {
        screen: SignUpScreen,
        navigationOptions: ({ navigation }) => ({
          title: 'Sign Up',
        })
      },
    LogInScreen:
      {
        screen: LogInScreen,
        navigationOptions: ({ navigation }) => ({
          title: 'Log In',
        })
      },
    UserHomeScreen:
      {
        screen: UserHomeScreen,
        navigationOptions: ({ navigation }) => ({
          title: 'User Home',
        })
      },
    AdminLogInScreen:
      {
        screen: AdminLogInScreen,
        navigationOptions: ({ navigation }) => ({
          title: 'Admin Log In',
        })
      },
    AdminSelectionScreen:
      {
        screen: AdminSelectionScreen,
        navigationOptions: ({ navigation }) => ({
          title: 'Channel Selector',
        })
      },
    AdminChatScreen:
      {
        screen: AdminChatScreen,
        navigationOptions: ({ navigation }) => ({
          title: 'Admin Chat Home',
        })
      },
    AdminSignUpScreen:
      {
        screen: AdminSignUpScreen,
        navigationOptions: ({ navigation }) => ({
          title: 'Admin Sign Up',
        })
      },
    
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