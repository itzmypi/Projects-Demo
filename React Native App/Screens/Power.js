import React from 'react';
import { styles } from './Styles'
import { View, Text, ActivityIndicator, ScrollView, RefreshControl, SafeAreaView, Dimensions} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SInfo from 'react-native-sensitive-info'
import {X_API_Key} from "@env"
import CharacterData from './CharacterData'

const Tab = createMaterialTopTabNavigator();

//gathers manifest data and displays the character screens
function Power ({route}){
    const [refreshing, setRefreshing] = React.useState(false);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const DestinyInventoryItemLiteDefinition = React.useRef({});

    if(!isLoaded){

        SInfo.getItem('character_data', {}).then((characterjson) => {
            AsyncStorage.getItem('chunk_count').then((chunk_count)=>{
            
                for(let i = 0; i < parseInt(chunk_count, 10); i ++){
                    AsyncStorage.getItem('chunk_'+i).then((this_chunk) => {
                        Object.assign(DestinyInventoryItemLiteDefinition.current, Object.fromEntries(JSON.parse(this_chunk)))
            
                        if(i == chunk_count -1){

                            AsyncStorage.getItem('DestinyMilestoneDefinition').then((milestonejson) => {
                                AsyncStorage.getItem('DestinyActivityDefinition').then((activityjson) => {
                
                                    DestinyMilestoneDefinition = JSON.parse(milestonejson)
                                    DestinyActivityDefinition = JSON.parse(activityjson)
                                    character_data = JSON.parse(characterjson)
                                    
                                    setIsLoaded(true);
                
                                });
                
                            });  
                            
                        }
                    })
                }
            })
        });
        
    }

    const onRefresh = () => {

        setRefreshing(true)

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

                            character_data = json.Response

                            setRefreshing(false)

                        });
            
                    });
                });
            });
        });
    }
    if(!isLoaded){
        return (
        <View style={styles.Screen}>
            <Text style={styles.HeaderText}>
                Fetching Leveling Data
            </Text>
            <ActivityIndicator size='large' color='#09D7D0'/>
        </View>
        );
    }else{
        var characterNames = [];
        for(var x in character_data.characters.data){
            switch(character_data.characters.data[x.toString()].classType){
                case 0:
                    characterNames.push('Titan')
                    break;
                case 1:
                    characterNames.push('Hunter')
                    break;
                case 2:
                    characterNames.push('Warlock')
                    break;
            }
        }
        switch(character_data.profile.data.characterIds.length){
            case 1:
                return(
                    <SafeAreaView style={{flex: 1, backgroundColor: '#1d1d1d'}}>
                            <Tab.Navigator
                            swipeEnabled={true}
                            tabBarOptions={{
                                activeTintColor: '#ffffff',
                                inactiveTintColor: '#373737',
                                labelStyle: { fontSize: 20, fontFamily: 'NHaasGroteskTXPro-75Bd' },
                                showIcon: true,
                                showLabel: true,
                                tabStyle: { alignItems: 'center' },
                                style: {
                                backgroundColor: '#1d1d1d',
                                },
                                indicatorStyle: {backgroundColor: '#09D6CF', borderWidth: 2, borderColor: '#09D6CF'}
                            }}>
                            <Tab.Screen name={characterNames[0]}>
                                {(props) => 
                                <ScrollView style={{backgroundColor: '#1d1d1d'}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={'#FFFFFF'} />} scrollIndicatorInsets={{ right: 1 }}>
                                    <CharacterData key={'Character1'} num={0} name={characterNames[0]} activityDefinition={DestinyActivityDefinition} milestoneDefinition={DestinyMilestoneDefinition} character_data={character_data} DestinyInventoryItemLiteDefinition={DestinyInventoryItemLiteDefinition.current} />
                                </ScrollView>
                                }
                            </Tab.Screen>
                            </Tab.Navigator>
                    </SafeAreaView>
                )
                break;
            case 2:
                return(
                    <SafeAreaView style={{flex: 1, backgroundColor: '#1d1d1d'}}>
                            <Tab.Navigator
                            swipeEnabled={true}
                            tabBarOptions={{
                                activeTintColor: '#ffffff',
                                inactiveTintColor: '#373737',
                                labelStyle: { fontSize: 20, fontFamily: 'NHaasGroteskTXPro-75Bd' },
                                showIcon: true,
                                showLabel: true,
                                tabStyle: { alignItems: 'center' },
                                style: {
                                backgroundColor: '#1d1d1d',
                                },
                                indicatorStyle: {backgroundColor: '#09D6CF', borderWidth: 2, borderColor: '#09D6CF'}
                            }}>
                            <Tab.Screen name={characterNames[0]}>
                                {(props) => 
                                <ScrollView style={{backgroundColor: '#1d1d1d'}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={'#FFFFFF'} />} scrollIndicatorInsets={{ right: 1 }}>
                                    <CharacterData key={'Character1'} num={0} name={characterNames[0]} activityDefinition={DestinyActivityDefinition} milestoneDefinition={DestinyMilestoneDefinition} character_data={character_data} DestinyInventoryItemLiteDefinition={DestinyInventoryItemLiteDefinition.current} />
                                </ScrollView>
                                }
                            </Tab.Screen>
                            <Tab.Screen name={characterNames[1]}>
                                {(props) => 
                                <ScrollView style={{backgroundColor: '#1d1d1d'}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={'#FFFFFF'} />} scrollIndicatorInsets={{ right: 1 }}>
                                    <CharacterData key={'Character2'} num={1} name={characterNames[1]} activityDefinition={DestinyActivityDefinition} milestoneDefinition={DestinyMilestoneDefinition} character_data={character_data} DestinyInventoryItemLiteDefinition={DestinyInventoryItemLiteDefinition.current} />
                                </ScrollView>
                                }
                            </Tab.Screen>
                            </Tab.Navigator>
                    </SafeAreaView>
                )
                break;
            case 3:
                return(
                    <SafeAreaView style={{flex: 1, backgroundColor: '#1d1d1d'}}>
                            <Tab.Navigator
                            swipeEnabled={true}
                            tabBarOptions={{
                                activeTintColor: '#ffffff',
                                inactiveTintColor: '#373737',
                                labelStyle: { fontSize: Dimensions.get('window').width/20.7, fontFamily: 'NHaasGroteskTXPro-75Bd' },
                                showIcon: true,
                                showLabel: true,
                                tabStyle: { alignItems: 'center' },
                                style: {
                                backgroundColor: '#1d1d1d',
                                },
                                indicatorStyle: {backgroundColor: '#09D6CF', borderWidth: 2, borderColor: '#09D6CF'}
                            }}
                            >
                            <Tab.Screen name={characterNames[0]}>
                                {(props) => 
                                <ScrollView style={{backgroundColor: '#1d1d1d'}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={'#FFFFFF'} />} scrollIndicatorInsets={{ right: 1 }}>
                                    <CharacterData key={'Character1'} num={0} name={characterNames[0]} activityDefinition={DestinyActivityDefinition} milestoneDefinition={DestinyMilestoneDefinition} character_data={character_data} DestinyInventoryItemLiteDefinition={DestinyInventoryItemLiteDefinition.current} />
                                </ScrollView>
                                }
                            </Tab.Screen>
                            <Tab.Screen name={characterNames[1]}>
                                {(props) => 
                                <ScrollView style={{backgroundColor: '#1d1d1d'}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={'#FFFFFF'} />} scrollIndicatorInsets={{ right: 1 }}>
                                    <CharacterData key={'Character2'} num={1} name={characterNames[1]} activityDefinition={DestinyActivityDefinition} milestoneDefinition={DestinyMilestoneDefinition} character_data={character_data} DestinyInventoryItemLiteDefinition={DestinyInventoryItemLiteDefinition.current} />
                                </ScrollView>
                                }
                            </Tab.Screen>
                            <Tab.Screen name={characterNames[2]}>
                                {(props) => 
                                <ScrollView style={{backgroundColor: '#1d1d1d'}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={'#FFFFFF'} />} scrollIndicatorInsets={{ right: 1 }}>
                                    <CharacterData key={'Character3'} num={2} name={characterNames[2]} activityDefinition={DestinyActivityDefinition} milestoneDefinition={DestinyMilestoneDefinition} character_data={character_data} DestinyInventoryItemLiteDefinition={DestinyInventoryItemLiteDefinition.current} />
                                </ScrollView>
                                }
                            </Tab.Screen>
                            </Tab.Navigator>
                    </SafeAreaView>
                )
                break;
        }
    }
}
export default Power;