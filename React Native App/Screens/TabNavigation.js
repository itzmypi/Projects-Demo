import React, { Component } from 'react';
import {
  Image,
  Dimensions,
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Vendors from '../Screens/Vendors'
import Power from '../Screens/Power'
import Notepad from '../Screens/Notepad'

//Creates the navigator
const Tab = createMaterialTopTabNavigator();

function TabNavigation({ route }) {

    return (
        //Creates the navigator component and sets its properties and stylings; the inactiveTintColor is how the inactive labels disappear
      <Tab.Navigator
        initialRouteName="Vendors"
        tabBarPosition="bottom"
        tabBarOptions={{
          activeTintColor: '#ffffff',
          inactiveTintColor: 'rgba(0, 0, 0, 0)',
          labelStyle: { fontSize: 10, fontFamily: 'NHaasGroteskTXPro-75Bd' },
          showIcon: true,
          showLabel: true,
          tabStyle: { alignItems: 'center' },
          iconStyle: { justifyContent: 'center' },
          indicatorStyle: { backgroundColor: '#ffffff', width: 10, marginLeft: Dimensions.get('window').width/6-4.5, borderWidth: 2, bottom: 3, borderRadius: 100, borderColor: '#ffffff'},
          style: {
            backgroundColor: '#373737',
            height: '8%',
            justifyContent: 'center',
          },
        }}>
        <Tab.Screen //All the screens of the navigator
          name="Vendors"
          component={Vendors}
          options={{
            tabBarLabel: 'Vendors',
            tabBarIcon: ({ color, focused }) => {
              if (focused) {
                
                return (
                  <Image
                    style={{//Makes the image smaller but also moves it around to be centered, base size is 26
                      width: 30,
                      height: 30,
                      position: 'relative',
                      right: 2,
                      top: 2,
                      resizeMode: 'cover',
                    }}
                    source={require('../Assets/ghost-edited.png')}></Image>
                );
              }
              
              return (
                <Image
                  style={{//Makes the image larager but also moves it around to be centered, base size is 26
                    width: 34,
                    height: 34,
                    position: 'relative',
                    right: 4,
                    top: 4,
                    resizeMode: 'cover',
                  }}
                  source={require('../Assets/ghost-edited.png')}></Image>
              );
            },
          }}
        />
        <Tab.Screen
          name="Power"
          component={Power}
          options={{
            tabBarLabel: 'Power',
            tabBarIcon: ({ color, focused }) => {
              if (focused) {
                return(
                    <Image
                        style={{
                            width: 30,
                            height: 30,
                            position: 'relative',
                            right: 2,
                            top: 2,
                            resizeMode: 'cover',
                        }}
                    source={require('../Assets/power.png')}></Image>
                );
              }
              return (
                <Image
                  style={{
                    width: 36,
                    height: 36,
                    position: 'relative',
                    right: 5,
                    top: 5,
                    resizeMode: 'cover',
                  }}
                source={require('../Assets/power.png')}></Image>
              );
            },
          }}
        />
        <Tab.Screen
          name="Notepad"
          component={Notepad}
          options={{
            tabBarLabel: 'Notepad',
            tabBarIcon: ({ color, focused }) => {
              if (focused) {
                return(
                    <Image
                        style={{
                            width: 30,
                            height: 30,
                            position: 'relative',
                            right: 2,
                            top: 2,
                            resizeMode: 'cover',
                        }}
                    source={require('../Assets/notepad-edited.png')}></Image>
                );
              }
              return (
                <Image
                  style={{
                    width: 34,
                    height: 34,
                    position: 'relative',
                    right: 4,
                    top: 4,
                    resizeMode: 'cover',
                  }}
                source={require('../Assets/notepad-edited.png')}></Image>
              );
            },
          }}
        />
      </Tab.Navigator>
    );
  }

export default TabNavigation;