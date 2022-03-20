import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Linking, ScrollView, Dimensions, Modal, TextInput} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SInfo from 'react-native-sensitive-info'
import RNRestart from 'react-native-restart';

//returns a modal allowing you to input notes
const NoteInput = (props) => {
    const [noteTitle, setTitle] = React.useState('')
    const [noteBody, setBody] = React.useState('')

    return (
        <Modal animationType='slide' visible={props.modalVisible} onRequestClosed={() => {setTitle('');setBody('');props.setVisible(false)}}>
            <SafeAreaView style={{backgroundColor: '#373737', flex: 1}}>
                <ScrollView scrollIndicatorInsets={{ right: 1 }}>
                <Text style={{fontFamily: 'NHaasGroteskTXPro-75Bd', color: '#ffffff', fontSize: 20, paddingHorizontal: 10, paddingTop: 30}}>Note Title:</Text>
                <TextInput multiline={true} value={noteTitle} placeholder={props.title} style={{padding: 5, margin: 10, borderWidth: 2, borderRadius: 10, borderColor: '#ffffff', color: '#ffffff', fontSize: 20}} onChangeText={(text) => {setTitle(text)}}/>

                <Text style={{fontFamily: 'NHaasGroteskTXPro-75Bd', color: '#ffffff', fontSize: 20, paddingHorizontal: 10, paddingTop: 30}}>Note Body:</Text>
                <TextInput multiline={true} value={noteBody} style={{padding: 5, margin: 10, borderWidth: 2, borderRadius: 10, borderColor: '#ffffff', color: '#ffffff', fontSize: 20}} onChangeText={(text) => {setBody(text)}}/>

                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                
                    <TouchableOpacity style={{flex: 1, margin: 10, alignItems: 'center', backgroundColor: '#7c2c94', borderRadius: 15, width: Dimensions.get('window').width/3}}
                    onPress={() => {
                        setTitle('')
                        setBody('')
                        props.setVisible(false)
                    }}>
                        <Text style={{fontFamily: 'NHaasGroteskTXPro-75Bd', color: '#ffffff', fontSize: 20, paddingVertical: 10}}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{flex: 1, margin: 10, alignItems: 'center', backgroundColor: '#7c2c94', borderRadius: 15, width: Dimensions.get('window').width/3}}
                    onPress={() => {
                        AsyncStorage.getItem('Notes').then((notes) => {
                            if(notes){
                                notes = JSON.parse(notes)
                                notes.push({title: noteTitle, body: noteBody})
                                AsyncStorage.setItem('Notes', JSON.stringify(notes)).then(() => {
                                    setTitle('')
                                    setBody('')
                                    props.setIsLoaded(false)
                                    props.setVisible(false)
                                })
                                

                            }else{
                                AsyncStorage.setItem('Notes', JSON.stringify([{title: noteTitle, body: noteBody}])).then(() => {
                                    setTitle('')
                                    setBody('')
                                    props.setIsLoaded(false)
                                    props.setVisible(false)
                                })
                            }
                        })
                    }}>
                        <Text style={{fontFamily: 'NHaasGroteskTXPro-75Bd', color: '#ffffff', fontSize: 20, paddingVertical: 10}}>Save</Text>
                    </TouchableOpacity>
                    
                </View>
                </ScrollView>
            </SafeAreaView>
        </Modal>
    )
}

//returns a modal allowing you to edit existing notes
const NoteEdit = (props) => {
    const [noteTitle, setTitle] = React.useState(null)
    const [noteBody, setBody] = React.useState(null)

    return (
        <Modal animationType='slide' visible={props.modalVisible} onRequestClosed={() => {props.setVisible(false)}}>
            <SafeAreaView style={{backgroundColor: '#373737', flex: 1}}>
                <ScrollView scrollIndicatorInsets={{ right: 1 }}>
                <Text style={{fontFamily: 'NHaasGroteskTXPro-75Bd', color: '#ffffff', fontSize: 20, paddingHorizontal: 10, paddingTop: 30}}>Note Title:</Text>
                <TextInput multiline={true} value={noteTitle} defaultValue={props.title} style={{padding: 5, margin: 10, borderWidth: 2, borderRadius: 10, borderColor: '#ffffff', color: '#ffffff', fontSize: 20}} onChangeText={(text) => {setTitle(text)}}/>

                <Text style={{fontFamily: 'NHaasGroteskTXPro-75Bd', color: '#ffffff', fontSize: 20, paddingHorizontal: 10, paddingTop: 30}}>Note Body:</Text>
                <TextInput multiline={true} value={noteBody} defaultValue={props.body} style={{padding: 5, margin: 10, borderWidth: 2, borderRadius: 10, borderColor: '#ffffff', color: '#ffffff', fontSize: 20}} onChangeText={(text) => {setBody(text)}}/>

                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity style={{flex: 1, margin: 10, alignItems: 'center', backgroundColor: '#7c2c94', borderRadius: 15, width: Dimensions.get('window').width/4}}
                    onPress={() => {
                        props.setVisible(false)
                    }}>
                        <Text style={{fontFamily: 'NHaasGroteskTXPro-75Bd', color: '#ffffff', fontSize: 20, paddingVertical: 10}}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{flex: 1, margin: 10, alignItems: 'center', backgroundColor: '#7c2c94', borderRadius: 15, width: Dimensions.get('window').width/4}}
                    onPress={() => {
                        AsyncStorage.getItem('Notes').then((notes) => {
                            notes = JSON.parse(notes)
                            notes.splice(props.index, 1)
                            AsyncStorage.setItem('Notes', JSON.stringify(notes)).then(() => {
                                props.setIsLoaded(false)
                                props.setVisible(false)
                            })
                        })
                    }}>
                        <Text style={{fontFamily: 'NHaasGroteskTXPro-75Bd', color: '#ffffff', fontSize: 20, paddingVertical: 10}}>Delete</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{flex: 1, margin: 10, alignItems: 'center', backgroundColor: '#7c2c94', borderRadius: 15, width: Dimensions.get('window').width/4}}
                    onPress={() => {
                        AsyncStorage.getItem('Notes').then((notes) => {
                            notes = JSON.parse(notes)
                            if(noteTitle == null){
                                titleReturn = props.title
                            }else{
                                titleReturn = noteTitle
                            }
                            if(noteBody == null){
                                bodyReturn = props.body
                            }else{
                                bodyReturn = noteBody
                            }
                            notes[props.index] = ({title: titleReturn, body: bodyReturn})
                            AsyncStorage.setItem('Notes', JSON.stringify(notes)).then(() => {
                                props.setIsLoaded(false)
                                props.setVisible(false)
                            })

                        })
                    }}>
                        <Text style={{fontFamily: 'NHaasGroteskTXPro-75Bd', color: '#ffffff', fontSize: 20, paddingVertical: 10}}>Save</Text>
                    </TouchableOpacity>
                </View>
                </ScrollView>
            </SafeAreaView>
        </Modal>
    )
}

//returns a menu with the existing notes and a credit to Bungie at the bottom
function Notepad (){

    const [noteVisible, setNoteVisible] = React.useState(false)
    const [editVisible, setEditVisible] = React.useState(false)
    const [isLoaded, setIsLoaded] = React.useState(false)
    const [noteEditText, setText] = React.useState(['','', null])
    
    //after new data is saved and isLoaded is set to false, it gathers the new note data for displaying
    if(!isLoaded){
        AsyncStorage.getItem('Notes').then((notes) => {

            if(notes){
                notes = JSON.parse(notes)
                noteReturn = notes.map((noteInfo) => {

                    return(
                        <View key={noteInfo.title+noteInfo.body+notes.indexOf(noteInfo)} style={{flex: 1, margin: 10, padding: 5, borderRadius: 15, backgroundColor: '#7c2c94'}}>
                            <TouchableOpacity onPress={() => {setText([noteInfo.title, noteInfo.body, notes.indexOf(noteInfo)]);setEditVisible(true)}}>
                                <Text style={{fontFamily: 'NHaasGroteskTXPro-75Bd', color: '#ffffff', fontSize: 25, paddingTop: 10, paddingBottom: 5, paddingHorizontal: 10}}>{noteInfo.title}</Text>
                                <Text style={{fontFamily: 'NHaasGroteskTXPro-55Rg', color: '#ffffff', fontSize: 17, paddingTop: 5, paddingBottom: 10, paddingHorizontal: 10}}>{noteInfo.body}</Text>
                            </TouchableOpacity>
                        </View>
                    )
                })
            }else{
                noteReturn = null
            }
            setIsLoaded(true)
    
        })
        return(
            null
        )
    }

    return (
        <ScrollView style={{backgroundColor: '#1d1d1d'}} scrollIndicatorInsets={{ right: 1 }}>
            <SafeAreaView style={{flex: 1}}>
                <View style={{alignItems: 'center'}}>
                    <Text style={{flex: 1, fontFamily: 'NHaasGroteskTXPro-75Bd', color: '#ffffff', fontSize: 25, paddingVertical: 20}}>Notepad</Text>
                    <TouchableOpacity style={{flex: 1, alignItems: 'center', backgroundColor: '#09d6cf', borderRadius: 15, marginBottom: 10, width: Dimensions.get('window').width*(3/4)}} onPress={() => {setNoteVisible(true)}}>
                        <Text style={{fontFamily: 'NHaasGroteskTXPro-75Bd', color: '#ffffff', fontSize: 20, paddingVertical: 10}}>Create New Note</Text>
                    </TouchableOpacity>
                </View>

                {noteReturn}

                <View style={{flex: 1, alignItems: 'center', backgroundColor: '#1d1d1d', paddingVertical: 20}}>
                    <Text style={{fontFamily: 'NeueHaasDisplay-ThinItalic', fontSize: 16, color: '#ffffff'}}>All content is the property of Bungie</Text>
                    <TouchableOpacity style={{paddingBottom: 10}} onPress={() => {Linking.openURL('https://www.bungie.net/en/News')}}>
                        <Text style={{fontFamily: 'NHaasGroteskTXPro-55Rg', fontSize: 16, color: '#09d6cf'}}>Bungie News</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{borderRadius: 10, backgroundColor: '#09d6cf'}} onPress={() => {
                        SInfo.deleteItem('vendor_data_timestamp', {}).then(() => {
                            SInfo.deleteItem('spider_sales', {}).then(() => {
                                SInfo.deleteItem('banshee_sales', {}).then(() => {
                                    SInfo.deleteItem('character_1', {}).then(() => {
                                        SInfo.deleteItem('character_2', {}).then(() => {
                                            SInfo.deleteItem('character_3', {}).then(() => {
                                                SInfo.deleteItem('character_data', {}).then(() => {
                                                    SInfo.deleteItem('membership_type', {}).then(() => {
                                                        SInfo.deleteItem('destiny_membership_id', {}).then(() => {
                                                            SInfo.deleteItem('access_token', {}).then(() => {
                                                                SInfo.deleteItem('membership_id', {}).then(() => {
                                                                    SInfo.deleteItem('refresh_token', {}).then(() => {
                                                                        AsyncStorage.removeItem('Notes').then(() => {
                                                                            RNRestart.Restart();
                                                                        })
                                                                    })
                                                                })
                                                            })
                                                        })
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    }}>
                        <Text style={{fontFamily: 'NHaasGroteskTXPro-75Bd', color: '#ffffff', fontSize: 18, padding: 8}}>Log Out (Erase User Data)</Text>
                    </TouchableOpacity>
                </View>
                
            </SafeAreaView>
            
            <NoteEdit modalVisible={editVisible} setVisible={setEditVisible} setIsLoaded={setIsLoaded} title={noteEditText[0]} body={noteEditText[1]} index={noteEditText[2]}/>

            <NoteInput modalVisible={noteVisible} setVisible={setNoteVisible} setIsLoaded={setIsLoaded}/>

        </ScrollView>
    )
}
export default Notepad;