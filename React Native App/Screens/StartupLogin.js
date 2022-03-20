import React from 'react';
import SInfo from 'react-native-sensitive-info'
import { NavigationContainer, StackActions} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigation from './TabNavigation';
import {View, Text, ActivityIndicator, Alert} from 'react-native'
import base64 from 'react-native-base64'
import { styles } from './Styles'
import moment from 'moment'
import {X_API_Key, AUTH} from "@env"
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { WebView } from 'react-native-webview';

//encodes the authorization header with client_id:client_secret
const auth = 'Basic '+ base64.encode(AUTH)

//functions and counters that keep track of how much information is collected
var readyCounter = 0;

function navigateToMain(){
  
  //navigate to main tabNavigation screen
  navigationRef.current?.dispatch(
    StackActions.replace('TabNavigation')
  );
        
}

function checkIfReady(){

  if(readyCounter == 1){
    navigateToMain();
  }else{
    readyCounter++;
  }
}

function fetchData(){

  //fetch the manifest
  fetch('https://www.bungie.net/platform/destiny2/manifest/').then((response) => {
    return response.json()
  }).then((json) => {

    if(json.Response && json.Response?.version){

      //check the stored manifest version and collect new manifest data if needed
      AsyncStorage.getItem('manifest_version').then((manifest_version) => {
        
        if(manifest_version == json.Response.version){

          checkIfReady();
          
        }else{

          var newversion = json.Response.version;

          fetch('https://www.bungie.net'+json.Response.jsonWorldComponentContentPaths.en.DestinyInventoryItemLiteDefinition).then((response) => {
            return response.json()
          }).then((json2) => {

            var chunk_count = (Math.floor(Object.keys(json2).length/1000)+1);
            for(let i = 0; i < chunk_count; i++){
              AsyncStorage.setItem('chunk_'+i, JSON.stringify(Object.entries(json2).slice(i*1000, (i+1)*1000)));
            }
            
            AsyncStorage.setItem('chunk_count', chunk_count.toString()).then(()=>{

              fetch('https://www.bungie.net'+json.Response.jsonWorldComponentContentPaths.en.DestinyMilestoneDefinition).then((response) => {
                return response.json()
              }).then((json3) => {

                AsyncStorage.setItem('DestinyMilestoneDefinition', JSON.stringify(json3)).then(()=>{

                  fetch('https://www.bungie.net'+json.Response.jsonWorldComponentContentPaths.en.DestinyActivityDefinition).then((response) => {
                    return response.json()
                  }).then((json4) => {

                    AsyncStorage.setItem('DestinyActivityDefinition', JSON.stringify(json4)).then(()=>{

                      fetch('https://www.bungie.net'+json.Response.jsonWorldComponentContentPaths.en.DestinySandboxPerkDefinition).then((response) => {
                        return response.json()
                      }).then((json5) => {

                        AsyncStorage.setItem('manifest_version', newversion)
                        AsyncStorage.setItem('DestinySandboxPerkDefinition', JSON.stringify(json5)).then(()=>{

                          checkIfReady();

                        });

                      });

                    });

                  });

                });

              });

            });

          });
        }
      });
    }
  });

  function vendorDataRequests(){

    vendorCounter = 0;
    function checkVendors(needToUpdate){

      if(vendorCounter == 2 && needToUpdate){
        SInfo.deleteItem('vendor_data_timestamp', {})
        SInfo.setItem('vendor_data_timestamp', moment.utc().format(), {}).then(() => {
          checkIfReady();
        })
      }else if(vendorCounter == 2){
        checkIfReady();
      }else{
        vendorCounter++;
      }
    }

    //fetches data for spider and banshee, then stores the data and the timestamp if the data is unique from the old data
    SInfo.getItem('destiny_membership_id', {}).then((destiny_membership_id) => {
      SInfo.getItem('membership_type', {}).then((membership_type) => {
          SInfo.getItem('access_token', {}).then((access_token) => {

            function spiderRequest(ind){
              SInfo.getItem('character_'+(ind+1), {}).then((character) => {
                fetch('https://www.bungie.net/Platform/Destiny2/'+membership_type+'/Profile/'+destiny_membership_id+'/Character/'+character+'/Vendors/863940356/?components=402', {
                    headers: {
                      'Authorization': ('Bearer '+access_token),
                      'X-API-Key': X_API_Key,
                    }
                    }).then((response) => {
                      return response.json()
                  }).then((json) => {

                    //ensures that the character has access to the vendor and changes to the next character if not
                    if(json.Response){
                      SInfo.getItem('spider_sales', {}).then((spider_sales_current) => {

                        //ensures that a new timestamp isn't set for no reason, ie. if the API isn't updated yet after 17:00
                        if(spider_sales_current == JSON.stringify(json.Response)){

                          checkVendors(false);

                        }else{

                          SInfo.deleteItem('spider_sales', {})
                          SInfo.setItem('spider_sales', JSON.stringify(json.Response), {}).then(() =>{
                            checkVendors(true);
                          });

                        }

                      });
                    }else if(ind != 2){
                      spiderRequest(ind+1)
                    }else{
                      Alert.alert('Error', 'None of your characters have access to Spider.')
                      SInfo.deleteItem('spider_sales', {}).then(()=>{
                        checkVendors(false);
                      });
                    }
                });
                
              });
            }

            function bansheeRequest(ind2){
              SInfo.getItem('character_'+(ind2+1), {}).then((character) => {
                fetch('https://www.bungie.net/Platform/Destiny2/'+membership_type+'/Profile/'+destiny_membership_id+'/Character/'+character+'/Vendors/672118013/?components=402', {
                    headers: {
                      'Authorization': ('Bearer '+access_token),
                      'X-API-Key': X_API_Key,
                    }
                    }).then((response) => {
                      return response.json()
                  }).then((json2) => {
                    
                    //ensures that the character has access to the vendor and changes to the next character if not
                    if(json2.Response){
                      SInfo.getItem('banshee_sales', {}).then((banshee_sales_current) => {

                        //ensures that a new timestamp isn't set for no reason, ie. if the API isn't updated yet after 17:00
                        if(banshee_sales_current == JSON.stringify(json2.Response)){

                          checkVendors(false);

                        }else{

                          SInfo.deleteItem('banshee_sales', {})
                          SInfo.setItem('banshee_sales', JSON.stringify(json2.Response), {}).then(() =>{
                              checkVendors(true);
                          });
                        }

                      });
                    }else if(ind2 != 2){
                      bansheeRequest(ind2+1)
                    }else{
                      Alert.alert('Error', 'None of your characters have access to Banshee.')
                      SInfo.deleteItem('banshee_sales', {}).then(()=>{
                        checkVendors(false);
                      });
                    }

                });
              });
            }

            function adaRequest(ind3){
              SInfo.getItem('character_'+(ind3+1), {}).then((character) => {
                fetch('https://www.bungie.net/Platform/Destiny2/'+membership_type+'/Profile/'+destiny_membership_id+'/Character/'+character+'/Vendors/350061650/?components=402', {
                    headers: {
                      'Authorization': ('Bearer '+access_token),
                      'X-API-Key': X_API_Key,
                    }
                    }).then((response) => {
                      return response.json()
                  }).then((json3) => {

                    //ensures that the character has access to the vendor and changes to the next character if not
                    if(json3.Response){
                      SInfo.getItem('ada_sales', {}).then((ada_sales_current) => {

                        //ensures that a new timestamp isn't set for no reason, ie. if the API isn't updated yet after 17:00
                        if(ada_sales_current == JSON.stringify(json3.Response)){

                          checkVendors(false);

                        }else{

                          SInfo.deleteItem('ada_sales', {})
                          SInfo.setItem('ada_sales', JSON.stringify(json3.Response), {}).then(() =>{
                            checkVendors(true);
                          });

                        }

                      });
                    }else if(ind3 != 2){
                      adaRequest(ind3+1)
                    }else{
                      Alert.alert('Error', 'None of your characters have access to Ada.')
                      SInfo.deleteItem('ada_sales', {}).then(()=>{
                        checkVendors(false);
                      });
                    }
                });
                
              });
            }

            spiderRequest(0)
            bansheeRequest(0)
            adaRequest(0)

          });
      });
    });
  }

  //compares current time and time of request to the next daily reset
  function vendorDataValidation(){
    SInfo.getItem('vendor_data_timestamp', {}).then((vendor_data_timestamp) => {
      
      if(vendor_data_timestamp){

        requestTime = moment.utc(vendor_data_timestamp)

        //If the current day's 17:00 is before the current time, add 1 day to get the next 17:00
        var targetTime = moment.utc().hour(17).minute(0).second(0).millisecond(0)
        if(moment.utc().diff(targetTime) > 0){
          targetTime = targetTime.add(1, 'd')
        }

        if(targetTime.diff(requestTime) < 86400000){
          checkIfReady();
        }else{
          vendorDataRequests();
        }
      }else{
        vendorDataRequests();
      }

    });
    
  }

  function getCharacterData(){
    //fetches initial data about the characters on the account, their milestones, their equipped items, collectibles, currencies, etc.
    SInfo.getItem('destiny_membership_id', {}).then((destiny_membership_id) => {
      SInfo.getItem('membership_type', {}).then((membership_type) => {
        SInfo.getItem('access_token', {}).then((access_token) => {
          fetch('https://www.bungie.net/Platform/Destiny2/'+membership_type+'/Profile/'+destiny_membership_id+'/?components=100,102,103,200,201,202,204,205,300,302,304,305,800', {
              headers: {
                'X-API-Key': X_API_Key,
                'Authorization': ('Bearer ' + access_token)
              }
              }).then((response) => {
                return response.json()
            }).then((json) => {

              for(i = 0; i < json.Response.profile.data.characterIds.length; i++){
                SInfo.deleteItem('character_'+(i+1), {})
                SInfo.setItem('character_'+(i+1), json.Response.profile.data.characterIds[i], {})
              }

              SInfo.deleteItem('character_data', {})
              SInfo.setItem('character_data', JSON.stringify(json.Response), {}).then(()=>{

                  vendorDataValidation();

                });

              });

          });
      });
    });
  }


  //fetch to get Destiny 2 membership id and characters

  SInfo.getItem('destiny_membership_id',{}).then((destiny_membership_id) => {

    if(destiny_membership_id){

      getCharacterData();

    }else{
      //Sends a request to find the Destiny 2 profiles associated with the Bungie.net membership id
      SInfo.getItem('membership_id',{}).then((membership_id) => {

        fetch('https://www.bungie.net/Platform/Destiny2/254/Profile/'+membership_id+'/LinkedProfiles/', {
          headers: {
            'X-API-Key': X_API_Key}
          }).then((response) => {
          return response.json()
        }).then((json) => {

          SInfo.deleteItem('membership_type', {})
          SInfo.deleteItem('destiny_membership_id', {})
          SInfo.setItem('membership_type', json.Response.profiles[0].membershipType.toString(), {})
          SInfo.setItem('destiny_membership_id', json.Response.profiles[0].membershipId, {}).then(() => {

            getCharacterData();

          });

        });
      });
    }


  });

}

function webLogin(url, stateKey){

  if(url.split('state=')[1] === stateKey){

    //fetches tokens
    fetch('https://www.bungie.net/platform/app/oauth/token/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': auth
    },
    body: new URLSearchParams({
      'grant_type': 'authorization_code',
      'code': url.substr(36)
    }).toString()
    }).then((response) => {
      return response.json()
    }).then((json) => {
      SInfo.deleteItem('access_token', {})
      SInfo.deleteItem('refresh_token', {})
      SInfo.deleteItem('membership_id', {})
      SInfo.setItem('access_token', json.access_token, {})
      SInfo.setItem('membership_id', json.membership_id, {})
      SInfo.setItem('refresh_token', json.refresh_token, {}).then(()=>{
        //ensures that the variables are set

        fetchData();

      })

    });

  }

}

function InitialLogin(){
  
  const [useWeb, setWeb] = React.useState(false)

  if(useWeb){
    var stateKey = uuidv4();

    return(
      <WebView
        source={{uri: 'https://www.bungie.net/en/oauth/authorize?client_id=33016&response_type=code&state='+stateKey}}
        incognito={true}
        onShouldStartLoadWithRequest={(request) => {
          if(request.url.substr(0,30) == 'https://www.bungie.net/en/News'){
            webLogin(request.url, stateKey)
            return false;
          }else{
            return true;
          }
        }}
        style={{backgroundColor: '#1d1d1d', color: '#1d1d1d'}}
        containerStyle={{backgroundColor: '#1d1d1d', color: '#1d1d1d'}}
      />
    )
  }

  //Get the refresh token
  SInfo.getItem('refresh_token', {}).then((refresh_token_existing) => {

    //If the refresh token exists, send a fetch request for the new set of tokens, otherwise log in and get the tokens from scratch
    if(refresh_token_existing){

      //fetch new token pair using refresh tokens
      fetch('https://www.bungie.net/platform/app/oauth/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': auth
      },
      body: new URLSearchParams({
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token_existing,
      }).toString()
      }).then((response) => {
        return response.json()
      }).then((json) => {
        
        if(json.refresh_token){
          SInfo.deleteItem('access_token', {})
          SInfo.deleteItem('refresh_token', {})
          SInfo.setItem('access_token', json.access_token, {})
          SInfo.setItem('refresh_token', json.refresh_token, {}).then(()=>{

            fetchData();

          })
        }else{
          
          setWeb(true)
          
        }
      });

    }else{
      
      setWeb(true)

    }
  });

  return (
    <View style={styles.Screen}>
      <Text style={styles.HeaderText}>Fetching Data From Bungie.net</Text>
      <ActivityIndicator size='large' color='#09D7D0' style={{padding: 20}}/>
    </View>
  );
}

const navigationRef = React.createRef();

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator headerMode='none'>
      <Stack.Screen name="InitialLogin" component={InitialLogin} />
      <Stack.Screen name="TabNavigation" component={TabNavigation} />
    </Stack.Navigator>
  );
}

export default function StartupLogin () {

  return (
      <NavigationContainer ref={navigationRef}>
        <MyStack />
      </NavigationContainer>
  );
}