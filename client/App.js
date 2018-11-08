import React from 'react';
import { StyleSheet, Text, View, Button, AsyncStorage } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import LandingScreen from './screens/LandingScreen.js';
import SignUpScreen from './screens/SignUpScreen.js';
import LogInScreen from './screens/LogInScreen.js';
import UserHomeScreen from './screens/UserHomeScreen.js';
import AdminLogInScreen from './screens/AdminLogInScreen.js';
import AdminSelectionScreen from './screens/AdminSelectionScreen.js';
import AdminChatScreen from './screens/AdminChatScreen.js';
import AdminSignUpScreen from './screens/AdminSignUpScreen.js';
import SurveyScreen from './screens/SurveyScreen.js';
import ResultsScreen from './screens/ResultsScreen.js';
import InfoScreen from './screens/InfoScreen.js';

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
        navigationOptions: ({ navigation }) => {
          return {
            headerTitle: 'User Home',
            headerRight: (
              <Button
                onPress={()=>{
                  AsyncStorage.clear()
                  navigation.navigate('LandingScreen')
                }}
                title="Log Out"
              />
            ),
          };
        }
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
        navigationOptions: ({ navigation }) => {
          return {
            headerTitle: 'Channel Selector',
            headerRight: (
              <Button
                onPress={() => {
                  AsyncStorage.clear()
                  navigation.navigate('LandingScreen')
                }}
                title="Log Out"
              />
            ),
          };
        }
      },
    AdminChatScreen:
      {
        screen: AdminChatScreen,
        navigationOptions: ({ navigation }) => {
          return {
            headerTitle: 'Admin Chat Home',
            headerRight: (
              <Button
                onPress={() => {
                  AsyncStorage.clear()
                  navigation.navigate('LandingScreen')
                }}
                title="Log Out"
              />
            ),
          };
        }
      },
    AdminSignUpScreen:
      {
        screen: AdminSignUpScreen,
        navigationOptions: ({ navigation }) => ({
          title: 'Admin Sign Up',
        })
      },
    SurveyScreen:
      {
        screen: SurveyScreen,
        navigationOptions: ({ navigation }) => ({
          title: 'Survey',
        })
      },
    ResultsScreen:
      {
        screen: ResultsScreen,
        navigationOptions: ({ navigation }) => ({
          title: 'Results',
        })
      },
    InfoScreen:
      {
        screen: InfoScreen,
        navigationOptions: ({ navigation }) => ({
          title: 'Info',
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