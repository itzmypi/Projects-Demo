import React from 'react';
import { View, Text, Image, Dimensions, Modal, ScrollView, TouchableOpacity, SafeAreaView, TextInput, Alert} from 'react-native';
import {X_API_Key} from "@env"
import AsyncStorage from '@react-native-async-storage/async-storage';
import SInfo from 'react-native-sensitive-info'

const DetailModal = (props) => {

    const [isLoaded, setIsLoaded] = React.useState(false)
    const [pickerVisible, setPicker] = React.useState(false)
    const [searchText, setSearch] = React.useState('')

    const damageTypes = {
        1: ['/common/destiny2_content/icons/DestinyDamageTypeDefinition_3385a924fd3ccb92c343ade19f19a370.png','#FFFFFF'],
        2: ['/common/destiny2_content/icons/DestinyDamageTypeDefinition_092d066688b879c807c3b460afdd61e6.png','#7AECF3'],
        3: ['/common/destiny2_content/icons/DestinyDamageTypeDefinition_2a1773e10968f2d088b97c22b22bba9e.png','#F0631E'],
        4: ['/common/destiny2_content/icons/DestinyDamageTypeDefinition_ceb2f6197dccf3958bb31cc783eb97a0.png','#B185DF'],
        6: ['/common/destiny2_content/icons/DestinyDamageTypeDefinition_530c4c3e7981dc2aefd24fd3293482bf.png','#4D88FF']
    }


    const energyTypes = {
        1: ['/common/destiny2_content/icons/DestinyDamageTypeDefinition_092d066688b879c807c3b460afdd61e6.png','#7AECF3'],
        2: ['/common/destiny2_content/icons/DestinyDamageTypeDefinition_2a1773e10968f2d088b97c22b22bba9e.png','#F0631E'],
        3: ['/common/destiny2_content/icons/DestinyDamageTypeDefinition_ceb2f6197dccf3958bb31cc783eb97a0.png','#B185DF'],
        6: ['/common/destiny2_content/icons/DestinyDamageTypeDefinition_530c4c3e7981dc2aefd24fd3293482bf.png','#4D88FF']
    }
    
    if(props.data && !isLoaded){
        
        const statBars = {
            4043523819: 'Impact',
            1240592695: 'Range',
            155624089: 'Stability',
            943549884: 'Handling',
            4188031367: 'Reload Speed',
            3614673599: 'Blast Radius',
            2523465841: 'Velocity',
            2837207746: 'Swing Speed',
            209426660: 'Guard Resistance',
            2762071195: 'Guard Efficiency',
            3736848092: 'Guard Endurance',
            3022301683: 'Charge Rate',
            1345609583: 'Aim Assistance',
            3555269338: 'Zoom',
            1591432999: 'Accuracy'
        }

        const statValues = {
            4284893193: 'Rounds Per Minute',
            3871231066: 'Magazine',
            2961396640: 'Charge Time',
            925767036: 'Ammo Capacity',
            447667954: 'Draw Time',
            1931675084: 'Inventory Size'
        }

        const armorStats = {
            2996146975: 'Mobility',
            392767087: 'Resilience',
            1943323491: 'Recovery',
            1735777505: 'Discipline',
            144602215: 'Intellect',
            4244567218: 'Strength'
        }

        fetch('https://www.bungie.net/Platform/Destiny2/Manifest/DestinyInventoryItemDefinition/'+props.data[0], {
            headers: {
            'X-API-Key': X_API_Key,
            }
        }).then((response) => {
            return response.json()
        }).then((json) => {

            if(props.screen == 'power' || props.screen == 'inventory'){
                
                flavorText = json.Response.flavorText
                type = json.Response.itemTypeAndTierDisplayName

                if(props.screen == 'power' && props.data[4]){
                    banner = '/common/destiny2_content/screenshots/'+props.data[4]+'.jpg'
                }else if(props.screen == 'power'){
                    banner = json.Response.screenshot
                }else if(props.screen == 'inventory'){
                    var thisItemSockets = props.character_data.itemComponents.sockets.data[props.data[3]].sockets;

                    for(let x = 0; x < thisItemSockets.length; x++){
                        if(thisItemSockets[x].plugHash){
                            if(props.ORNAMENT_SUBTYPES.includes(props.DestinyInventoryItemLiteDefinition[thisItemSockets[x].plugHash].itemSubType) && !props.BAD_SOCKETS.includes(thisItemSockets[x].plugHash) && !props.DestinyInventoryItemLiteDefinition[thisItemSockets[x].plugHash].itemCategoryHashes.includes(1875601085)){
                                banner = '/common/destiny2_content/screenshots/'+thisItemSockets[x].plugHash+'.jpg'
                            }
                            if(x == thisItemSockets.length - 1){
                                banner = json.Response.screenshot
                            }
                        }
                    }
                }

                statReturn = [];

                for(x in json.Response.stats.stats){
                    if(statBars[x]){

                        if(props.character_data.itemComponents.stats.data[props.data[3]]?.stats[x]){
                            thisStat = [statBars[x], props.character_data.itemComponents.stats.data[props.data[3]]?.stats[x].value]
                        }else{
                            thisStat = [statBars[x], json.Response.stats.stats[x].value]
                        }

                        statReturn.push(
                            <View key={thisStat[0]} style={{backgroundColor: '#1d1d1d', flex: 1, flexDirection: 'row-reverse', alignItems: 'center', padding: 5}}>
                                <View style={{backgroundColor: '#373737', height: 20, width: (Dimensions.get('window').width/2)-(Dimensions.get('window').width/2)*thisStat[1]/100}}/>
                                <View style={{backgroundColor: '#ffffff', height: 20, width: (Dimensions.get('window').width/2)*thisStat[1]/100}}/>
                                <Text style={{fontFamily: 'NHaasGroteskTXPro-55Rg', fontSize: 20, color: '#ffffff', paddingRight: 5}}>{thisStat[0]+' '+thisStat[1]}</Text>
                            </View>
                        )

                    }
                    else if(statValues[x]){

                        if(props.character_data.itemComponents.stats.data[props.data[3]]?.stats[x]){
                            thisStat = [statValues[x], props.character_data.itemComponents.stats.data[props.data[3]]?.stats[x].value]
                        }else{
                            thisStat = [statValues[x], json.Response.stats.stats[x].value]
                        }

                        statReturn.push(
                            <View key={thisStat[0]} style={{backgroundColor: '#1d1d1d', flex: 1, flexDirection: 'row-reverse', alignItems: 'center', padding: 5}}>
                                <Text style={{fontFamily: 'NHaasGroteskTXPro-55Rg', fontSize: 20, color: '#ffffff', paddingRight: 5}}>{thisStat[0]+' '+thisStat[1]}</Text>
                            </View>
                        )

                    }
                    else if(armorStats[x]){

                        if(props.character_data.itemComponents.stats.data[props.data[3]]?.stats[x]){
                            thisStat = [armorStats[x], props.character_data.itemComponents.stats.data[props.data[3]]?.stats[x].value]
                        }else{
                            thisStat = [armorStats[x], json.Response.stats.stats[x].value]
                        }

                        statReturn.push(
                            <View key={thisStat[0]} style={{backgroundColor: '#1d1d1d', flex: 1, flexDirection: 'row-reverse', alignItems: 'center', padding: 5}}>
                                <View style={{backgroundColor: '#373737', height: 20, width: (Dimensions.get('window').width/2)-(Dimensions.get('window').width/2)*thisStat[1]/42}}/>
                                <View style={{backgroundColor: '#ffffff', height: 20, width: (Dimensions.get('window').width/2)*thisStat[1]/42}}/>
                                <Text style={{fontFamily: 'NHaasGroteskTXPro-55Rg', fontSize: 20, color: '#ffffff', paddingRight: 5}}>{thisStat[0]+' '+thisStat[1]}</Text>
                            </View>
                        )

                    }else if(x == 2715839340){
                        
                        thisStat = ['Recoil Direction', json.Response.stats.stats[x].value]

                        variation = Math.sin((thisStat[1] + 5) * ((2 * Math.PI) / 20)) * (100 - thisStat[1])

                        if(variation > 0){
                            statReturn.push(
                                <View key={thisStat[0]} style={{backgroundColor: '#1d1d1d', flex: 1, flexDirection: 'row-reverse', alignItems: 'center', padding: 5}}>
                                    <View style={{backgroundColor: '#373737', height: 20, width: 50-variation*(0.5)}}/>
                                    <View style={{backgroundColor: '#ffffff', height: 20, width: variation*(0.5)}}/>
                                    <View style={{backgroundColor: '#000000', height: 20, width: 5}}/>
                                    <View style={{backgroundColor: '#373737', height: 20, width: 45}}/>
                                    <Text style={{fontFamily: 'NHaasGroteskTXPro-55Rg', fontSize: 20, color: '#ffffff', paddingRight: 5}}>{thisStat[0]+' '}</Text>
                                </View>
                            )
                        }else if(variation < 0){
                            statReturn.push(
                                <View key={thisStat[0]} style={{backgroundColor: '#1d1d1d', flex: 1, flexDirection: 'row-reverse', alignItems: 'center', padding: 5}}>
                                    <View style={{backgroundColor: '#373737', height: 20, width: 45}}/>
                                    <View style={{backgroundColor: '#000000', height: 20, width: 5}}/>
                                    <View style={{backgroundColor: '#ffffff', height: 20, width: variation*-0.5}}/>
                                    <View style={{backgroundColor: '#373737', height: 20, width: 50-variation*-0.5}}/>
                                    <Text style={{fontFamily: 'NHaasGroteskTXPro-55Rg', fontSize: 20, color: '#ffffff', paddingRight: 5}}>{thisStat[0]+' '}</Text>
                                </View>
                            )
                        }else{
                            statReturn.push(
                                <View key={thisStat[0]} style={{backgroundColor: '#1d1d1d', flex: 1, flexDirection: 'row-reverse', alignItems: 'center', padding: 5}}>
                                    <View style={{backgroundColor: '#373737', height: 20, width: 45}}/>
                                    <View style={{backgroundColor: '#ffffff', height: 20, width: 10}}/>
                                    <View style={{backgroundColor: '#373737', height: 20, width: 45}}/>
                                    <Text style={{fontFamily: 'NHaasGroteskTXPro-55Rg', fontSize: 20, color: '#ffffff', paddingRight: 5}}>{thisStat[0]+' '}</Text>
                                </View>
                            )
                        }

                    }
                }
                for(x in props.character_data.itemComponents.stats.data[props.data[3]].stats){
                    if(statBars[x]){

                        if(!statReturn.some((stat) => {stat.key == statBars[x]})){
                            thisStat = [statBars[x], props.character_data.itemComponents.stats.data[props.data[3]]?.stats[x].value]

                            statReturn.push(
                            <View key={thisStat[0]} style={{backgroundColor: '#1d1d1d', flex: 1, flexDirection: 'row-reverse', alignItems: 'center', padding: 5}}>
                                <View style={{backgroundColor: '#373737', height: 20, width: (Dimensions.get('window').width/2)-(Dimensions.get('window').width/2)*thisStat[1]/100}}/>
                                <View style={{backgroundColor: '#ffffff', height: 20, width: (Dimensions.get('window').width/2)*thisStat[1]/100}}/>
                                <Text style={{fontFamily: 'NHaasGroteskTXPro-55Rg', fontSize: 20, color: '#ffffff', paddingRight: 5}}>{thisStat[0]+' '+thisStat[1]}</Text>
                            </View>
                            )
                        }

                    }
                    else if(statValues[x]){

                        if(!statReturn.some((stat) => {stat.key == statValues[x]})){
                            thisStat = [statValues[x], props.character_data.itemComponents.stats.data[props.data[3]]?.stats[x].value]
                        

                            statReturn.push(
                                <View key={thisStat[0]} style={{backgroundColor: '#1d1d1d', flex: 1, flexDirection: 'row-reverse', alignItems: 'center', padding: 5}}>
                                    <Text style={{fontFamily: 'NHaasGroteskTXPro-55Rg', fontSize: 20, color: '#ffffff', paddingRight: 5}}>{thisStat[0]+' '+thisStat[1]}</Text>
                                </View>
                            )
                        }

                    }
                    else if(armorStats[x]){

                        if(!statReturn.some((stat) => {stat.key == armorStats[x]})){
                            thisStat = [armorStats[x], props.character_data.itemComponents.stats.data[props.data[3]]?.stats[x].value]
                        

                            statReturn.push(
                                <View key={thisStat[0]} style={{backgroundColor: '#1d1d1d', flex: 1, flexDirection: 'row-reverse', alignItems: 'center', padding: 5}}>
                                    <View style={{backgroundColor: '#373737', height: 20, width: (Dimensions.get('window').width/2)-(Dimensions.get('window').width/2)*thisStat[1]/42}}/>
                                    <View style={{backgroundColor: '#ffffff', height: 20, width: (Dimensions.get('window').width/2)*thisStat[1]/42}}/>
                                    <Text style={{fontFamily: 'NHaasGroteskTXPro-55Rg', fontSize: 20, color: '#ffffff', paddingRight: 5}}>{thisStat[0]+' '+thisStat[1]}</Text>
                                </View>
                            )
                        }

                    }
                }
                
                if(json.Response.itemTypeDisplayName == 'Sword'){
                    statReturn = statReturn.filter((stat) => stat.key != 'Magazine' && stat.key != 'Zoom' && stat.key != 'Recoil Direction' && stat.key != 'Inventory Size')
                }
                
                statOrdered = [];

                for(let i = 0; i < statReturn.length; i++){
                    
                    switch(statReturn[i].key){
                        case 'Rounds Per Minute':
                            statOrdered[0] = statReturn[i]
                            break;
                        case 'Swing Speed':
                            statOrdered[0] = statReturn[i]
                            break;
                        case 'Charge Time':
                            statOrdered[0] = statReturn[i]
                            break;
                        case 'Draw Time':
                            statOrdered[0] = statReturn[i]
                            break;
                        case 'Mobility':
                            statOrdered[0] = statReturn[i]
                            break;
                        case 'Impact':
                            statOrdered[1] = statReturn[i]
                            break;
                        case 'Blast Radius':
                            statOrdered[1] = statReturn[i]
                            break;
                        case 'Resilience':
                            statOrdered[1] = statReturn[i]
                            break;
                        case 'Range':
                            statOrdered[2] = statReturn[i]
                            break;
                        case 'Velocity':
                            statOrdered[2] = statReturn[i]
                            break;
                        case 'Guard Efficiency':
                            statOrdered[2] = statReturn[i]
                            break;
                        case 'Accuracy':
                            statOrdered[2] = statReturn[i]
                            break;
                        case 'Recovery':
                            statOrdered[2] = statReturn[i]
                            break;
                        case 'Stability':
                            statOrdered[3] = statReturn[i]
                            break;
                        case 'Guard Resistance':
                            statOrdered[3] = statReturn[i]
                            break;
                        case 'Discipline':
                            statOrdered[3] = statReturn[i]
                            break;
                        case 'Handling':
                            statOrdered[4] = statReturn[i]
                            break;
                        case 'Charge Rate':
                            statOrdered[4] = statReturn[i]
                            break;
                        case 'Intellect':
                            statOrdered[4] = statReturn[i]
                            break;
                        case 'Reload Speed':
                            statOrdered[5] = statReturn[i]
                            break;
                        case 'Guard Endurance':
                            statOrdered[5] = statReturn[i]
                            break;
                        case 'Strength':
                            statOrdered[5] = statReturn[i]
                            break;
                        case 'Aim Assistance':
                            statOrdered[6] = statReturn[i]
                            break;
                        case 'Ammo Capacity':
                            statOrdered[6] = statReturn[i]
                            break;
                        case 'Zoom':
                            statOrdered[7] = statReturn[i]
                            break;
                        case 'Recoil Direction':
                            statOrdered[8] = statReturn[i]
                            break;
                        case 'Inventory Size':
                            statOrdered[9] = statReturn[i]
                            break;
                        case 'Magazine':
                            statOrdered[9] = statReturn[i]
                            break;
                    }
                }

                if(statOrdered.every((stat) => stat.key == 'Mobility' || stat.key == 'Resilience' || stat.key == 'Recovery' || stat.key == 'Discipline' || stat.key == 'Intellect' || stat.key == 'Strength')){
                    let total = 0;
                    for(x in props.character_data.itemComponents.stats.data[props.data[3]].stats){
                        total += props.character_data.itemComponents.stats.data[props.data[3]].stats[x].value
                    }
                    
                    statOrdered.push(
                        <View key={'Total'} style={{backgroundColor: '#1d1d1d', flex: 1, flexDirection: 'row-reverse', alignItems: 'center', padding: 5}}>
                            <Text style={{fontFamily: 'NHaasGroteskTXPro-55Rg', fontSize: 20, color: '#ffffff', paddingRight: 5}}>{'Total '+total}</Text>
                        </View>
                    )
                    if(energyTypes[props.character_data.itemComponents.instances.data[props.data[3]]?.energy?.energyType]){
                        damageColor = energyTypes[props.character_data.itemComponents.instances.data[props.data[3]].energy.energyType][1]
                        damageIcon = energyTypes[props.character_data.itemComponents.instances.data[props.data[3]].energy.energyType][0]
                    }else{
                        damageColor = "#ffffff"
                        damageIcon = null
                    }

                }else if (damageTypes[props.character_data.itemComponents.instances.data[props.data[3]].damageType]){
                    damageColor = damageTypes[props.character_data.itemComponents.instances.data[props.data[3]].damageType][1]
                    damageIcon = damageTypes[props.character_data.itemComponents.instances.data[props.data[3]].damageType][0]
                }else{
                    damageColor = "#ffffff"
                    damageIcon = null
                }

                perkReturn = [];

                if(props.data[1] > props.power){
                    diff = ' (+'+(props.data[1]-Math.floor(props.power))+')'
                }else{
                    diff = ' ('+(props.data[1]-Math.floor(props.power))+')'
                }

                const penaltyImages = {
                    'Mobility': '/common/destiny2_content/icons/c664ddd10920daab49cc3808dbb6a1e6.png',
                    'Resilience': '/common/destiny2_content/icons/195f4f173adb52b336b4ecd67101004d.png',
                    'Recovery': '/common/destiny2_content/icons/18054408a5fc068f2384c6c31a183423.png',
                    'Discipline': '/common/destiny2_content/icons/9d54e2149f945b2c298020da443b70fa.png',
                    'Intellect': '/common/destiny2_content/icons/9fd56c3b42923c9df23edf585b0107bf.png',
                    'Strength': '/common/destiny2_content/icons/07f2361532c79e773909220e5884ab07.png'
                }

                
                AsyncStorage.getItem('DestinySandboxPerkDefinition').then((DestinySandboxPerkDefinition) => {
                    if(props.character_data.itemComponents.perks.data[props.data[3]]?.perks){
                        DestinySandboxPerkDefinition = JSON.parse(DestinySandboxPerkDefinition)
                        for(let i = 0; i < props.character_data.itemComponents.perks.data[props.data[3]].perks.length; i++){
                            if(props.character_data.itemComponents.perks.data[props.data[3]].perks[i].visible){

                                var iconPath = ''

                                if(DestinySandboxPerkDefinition[props.character_data.itemComponents.perks.data[props.data[3]].perks[i].perkHash].displayProperties.name == 'Stat Increase' || DestinySandboxPerkDefinition[props.character_data.itemComponents.perks.data[props.data[3]].perks[i].perkHash].displayProperties.name == 'Stat Penalty'){
                                    iconPath = penaltyImages[DestinySandboxPerkDefinition[props.character_data.itemComponents.perks.data[props.data[3]].perks[i].perkHash].displayProperties.description.split(' ')[1]]
                                }else{
                                    iconPath = props.character_data.itemComponents.perks.data[props.data[3]].perks[i].iconPath
                                }

                                perkReturn.push(
                                    <View key={i+props.character_data.itemComponents.perks.data[props.data[3]].perks[i].perkHash} style={{padding: 10, flex: 1, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', backgroundColor: '#1d1d1d'}}>
                                        <Image source={{uri: 'https://www.bungie.net'+iconPath}} style={{width: 60, height: 60}}/>
                                        <View style={{paddingLeft: 10, flex: 1, flexDirection: 'column', backgroundColor: '#1d1d1d'}}>
                                            <Text style={{fontFamily: 'NHaasGroteskTXPro-65Md', fontSize: 20, color: '#ffffff'}}>{DestinySandboxPerkDefinition[props.character_data.itemComponents.perks.data[props.data[3]].perks[i].perkHash].displayProperties.name}</Text>
                                            <Text style={{fontFamily: 'NHaasGroteskTXPro-65Md', fontSize: 16, flex: 1, color: '#ffffff'}}>{DestinySandboxPerkDefinition[props.character_data.itemComponents.perks.data[props.data[3]].perks[i].perkHash].displayProperties.description}</Text>
                                        </View>
                                    </View>
                                )
                            }
                        }
                    }
                    setIsLoaded(true)
                })

            }
        
        });
        
    }

    if(!isLoaded){
        return(null)
    }else{

        pickReturn = null
        if(pickerVisible){

            equipmentModified = props.equipment.filter((item) => {
                return (props.DestinyInventoryItemLiteDefinition[item[0]].displayProperties.name.toUpperCase().includes(searchText.toUpperCase())) && item[3] != props.data[3] && item[4].split('')[0] != 'e'
            })

            pickReturn = equipmentModified.map((item) => {

                let diff = ''

                if(item[1] > Math.floor(props.power)){
                    diff = ' (+'+(item[1]-Math.floor(props.power))+')'
                }else{
                    diff = ' ('+(item[1]-Math.floor(props.power))+')'
                }
                if(energyTypes[props.character_data.itemComponents.instances.data[item[3]]?.energy?.energyType]){
                    damageColor = energyTypes[props.character_data.itemComponents.instances.data[item[3]].energy.energyType][1]
                }else if(damageTypes[props.character_data.itemComponents.instances.data[item[3]].damageType]){
                    damageColor = damageTypes[props.character_data.itemComponents.instances.data[item[3]].damageType][1]
                }else{
                    damageColor = "#ffffff"
                }

                var thisItemSockets = props.character_data.itemComponents.sockets.data[item[3]].sockets;

                let icon = '';

                for(let x = 0; x < thisItemSockets.length; x++){
                    if(thisItemSockets[x].plugHash){
                        
                        if(props.ORNAMENT_SUBTYPES.includes(props.DestinyInventoryItemLiteDefinition[thisItemSockets[x].plugHash].itemSubType) && !props.BAD_SOCKETS.includes(thisItemSockets[x].plugHash) && !props.DestinyInventoryItemLiteDefinition[thisItemSockets[x].plugHash].itemCategoryHashes.includes(1875601085)){
                            return(
                                <TouchableOpacity key={item[3]} style={{padding: 10, flex: 1, flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#1d1d1d'}} onPress={() => {props.viewNew([item[0], item[1], props.DestinyInventoryItemLiteDefinition[thisItemSockets[x].plugHash].displayProperties.icon, item[3], thisItemSockets[x].plugHash]);setSearch('');setPicker(false)}}>
                                    <Image source={{uri: 'https://www.bungie.net'+props.DestinyInventoryItemLiteDefinition[thisItemSockets[x].plugHash].displayProperties.icon}} style={{width: 60, height: 60, borderRadius: 10}}/>
                                    <View style={{flex: 1, padding: 5, flexDirection: 'column', backgroundColor: '#1d1d1d'}}>
                                        <Text style={{fontFamily: 'NHaasGroteskTXPro-65Md', fontSize: 21, color: damageColor}}>{item[1]+diff}</Text>
                                        <Text style={{fontFamily: 'NHaasGroteskTXPro-65Md', fontSize: 18, color: '#ffffff'}}>{props.DestinyInventoryItemLiteDefinition[item[0]].displayProperties.name}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        }
                        
                    }

                    if(x == thisItemSockets.length - 1){
                        return(
                            <TouchableOpacity key={item[3]} style={{padding: 10, flex: 1, flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#1d1d1d'}} onPress={() => {props.viewNew([item[0], item[1], props.DestinyInventoryItemLiteDefinition[item[0]].displayProperties.icon, item[3]]);setSearch('');setPicker(false)}}>
                                <Image source={{uri: 'https://www.bungie.net'+props.DestinyInventoryItemLiteDefinition[item[0]].displayProperties.icon}} style={{width: 60, height: 60, borderRadius: 10}}/>
                                <View style={{flex: 1, padding: 5, flexDirection: 'column', backgroundColor: '#1d1d1d'}}>
                                    <Text style={{fontFamily: 'NHaasGroteskTXPro-65Md', fontSize: 21, color: damageColor}}>{item[1]+diff}</Text>
                                    <Text style={{fontFamily: 'NHaasGroteskTXPro-65Md', fontSize: 18, color: '#ffffff'}}>{props.DestinyInventoryItemLiteDefinition[item[0]].displayProperties.name}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    }

                }

            })
        }

        if(props.screen == 'power'){

            return(
                <Modal animationType='slide' visible={props.visible} onRequestClosed={() => {props.setVisible(false)}}>
                        <ScrollView style={{backgroundColor: '#1d1d1d', flex: 1}} scrollIndicatorInsets={{ right: 1 }}>

                            <Image source={{uri: 'https://www.bungie.net'+banner}} style={{width: Dimensions.get('window').width, height: Dimensions.get('window').width*1080/1920}}/>
                            <Text style={{paddingLeft: 15, paddingTop: 10, fontFamily: 'NHaasGroteskTXPro-65Md', fontSize: Dimensions.get('window').width/(414/32), flex: 1, color: '#ffffff'}}>{props.DestinyInventoryItemLiteDefinition[props.data[0]].displayProperties.name}</Text>
                            <Text style={{paddingLeft: 15, paddingBottom: 5, fontFamily: 'NHaasGroteskTXPro-55Rg', fontSize: Dimensions.get('window').width/(414/17), flex: 1, color: '#ffffff'}}>{props.DestinyInventoryItemLiteDefinition[props.data[0]].itemTypeAndTierDisplayName}</Text>
                            <Text style={{paddingLeft: 15, paddingBottom: 5, fontFamily: 'NeueHaasDisplay-ThinItalic', fontSize: Dimensions.get('window').width/(414/20), flex: 1, color: '#ffffff'}}>{flavorText}</Text>
                            
                            <View style={{paddingVertical: 5, justifyContent: 'center', flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#1d1d1d'}}>
                                <Image style={{height: 30, width: 30, marginLeft: 15}} source={{uri: 'https://www.bungie.net'+damageIcon}} />
                                <Text style={{fontFamily: 'NHaasGroteskTXPro-65Md', fontSize: Dimensions.get('window').width/(414/45), color: damageColor}}>{props.data[1]+diff}</Text>
                            </View>

                            {statOrdered}

                            {perkReturn}

                            <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#7c2c94', borderRadius: 15, margin: 10}} onPress={() => {props.setVisible(false);}}>
                                <Text style={{fontFamily: 'NHaasGroteskTXPro-75Bd', color: '#ffffff', fontSize: 20, padding: 10}}>Close</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#7c2c94', borderRadius: 15, margin: 10}} onPress={() => {

                            newItem = props.equipment[props.equipment.findIndex((item) => item[4] == 'i'+props.num && item[2] != 6)]

                            SInfo.getItem('character_'+(props.num+1), {}).then((character) => {
                                SInfo.getItem('access_token', {}).then((access_token) => {
                                    SInfo.getItem('membership_type', {}).then((membership_type) => {

                                        fetch('https://www.bungie.net/platform/Destiny2/Actions/Items/EquipItem/', {
                                            method: 'POST',
                                            headers: {
                                                'X-API-Key': X_API_Key,
                                                'Authorization': ('Bearer '+access_token),
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify({
                                                'itemId': newItem[3],
                                                'characterId': character,
                                                'membershipType': membership_type
                                            })
                                        }).then((response) => {
                                            return response.json()
                                        }).then((json) => {

                                            if(json.ErrorStatus == 'Success'){
                                                props.changeItem([newItem[0], newItem[1], props.DestinyInventoryItemLiteDefinition[newItem[0]].displayProperties.icon, newItem[3]], 'p', props.data)
                                            
                                                fetch('https://www.bungie.net/platform/Destiny2/Actions/Items/TransferItem/', {
                                                    method: 'POST',
                                                    headers: {
                                                        'X-API-Key': X_API_Key,
                                                        'Authorization': ('Bearer '+access_token),
                                                        'Content-Type': 'application/json'
                                                    },
                                                    body: JSON.stringify({
                                                        'itemReferenceHash': props.data[0],
                                                        'stackSize': 1,
                                                        'transferToVault': true,
                                                        'itemId': props.data[3],
                                                        'characterId': character,
                                                        'membershipType': membership_type
                                                    })
                                                }).then((response) => {
                                                    return response.json()
                                                }).then((json2) => {
                                                    
                                                    if(json2.ErrorStatus == 'Success'){
                                                        Alert.alert('Item Vaulted Successfully')
                                                    }else{
                                                        Alert.alert('Error', json2.Message)
                                                    }

                                                });
                                            }else{
                                                Alert.alert('Error', json.Message)
                                            }

                                        });
                                        
                                    })
                                })
                            })

                            }}>
                                <Text style={{fontFamily: 'NHaasGroteskTXPro-75Bd', color: '#ffffff', fontSize: 20, padding: 10}}>Transfer to Vault</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#7c2c94', borderRadius: 15, margin: 10, marginBottom: 40}} onPress={() => {setPicker(true)}}>
                                <Text style={{fontFamily: 'NHaasGroteskTXPro-75Bd', color: '#ffffff', fontSize: 20, padding: 10}}>Transfer/Equip Other Items</Text>
                            </TouchableOpacity>

                            <Modal animationType='slide' visible={pickerVisible} onRequestClosed={() => {setPicker(false)}}>
                                <SafeAreaView style={{backgroundColor: '#1d1d1d', flex: 1, paddingBottom: 10}} >
                                <ScrollView scrollIndicatorInsets={{ right: 1 }}>

                                    <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#7c2c94', borderRadius: 15, margin: 10}} onPress={() => {setPicker(false)}}>
                                        <Text style={{fontFamily: 'NHaasGroteskTXPro-75Bd', color: '#ffffff', fontSize: 20, padding: 10}}>Close</Text>
                                    </TouchableOpacity>

                                    <TextInput multiline={false} value={searchText} placeholder={'Item Name'} placeholderTextColor={'#808080'} style={{padding: 5, margin: 10, borderWidth: 2, borderRadius: 10, borderColor: '#ffffff', color: '#ffffff', fontSize: 20}} onChangeText={(text) => {setSearch(text)}}/>

                                    {pickReturn}
                                
                                </ScrollView>
                                </SafeAreaView>
                            </Modal>

                        </ScrollView>
                </Modal>
            )

        }else if(props.screen == 'inventory'){

            var buttonReturn = [];

            if(props.equipment){
                var location = props.equipment[props.equipment.findIndex((it)=>it[3] == props.data[3])][4];

                if(location == 'i'+props.num){
                    buttonReturn.push(
                        <TouchableOpacity key={'button0'} style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#7c2c94', borderRadius: 15, margin: 10}} onPress={() => {

                            SInfo.getItem('character_'+(props.num+1), {}).then((character) => {
                                SInfo.getItem('access_token', {}).then((access_token) => {
                                    SInfo.getItem('membership_type', {}).then((membership_type) => {

                                        fetch('https://www.bungie.net/platform/Destiny2/Actions/Items/EquipItem/', {
                                            method: 'POST',
                                            headers: {
                                                'X-API-Key': X_API_Key,
                                                'Authorization': ('Bearer '+access_token),
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify({
                                                'itemId': props.data[3],
                                                'characterId': character,
                                                'membershipType': membership_type
                                            })
                                        }).then((response) => {
                                            return response.json()
                                        }).then((json) => {

                                            if(json.ErrorStatus == 'Success'){
                                                props.changeItem(props.data, 'i'+props.num, props.equipment[props.equipment.findIndex((item) => item[4] == 'e'+props.num)])
                                                Alert.alert('Item Equipped Successfully')
                                            }else{
                                                Alert.alert('Error', json.Message)
                                            }

                                        });

                            
                                        
                                    })
                                })
                            })

                            }}>
                                <Text style={{fontFamily: 'NHaasGroteskTXPro-75Bd', color: '#ffffff', fontSize: 20, padding: 10}}>Equip</Text>
                            </TouchableOpacity>
                    )
                }else if(location == 'p'){
                    buttonReturn.push(
                        <TouchableOpacity key={'button1'} style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#7c2c94', borderRadius: 15, margin: 10}} onPress={() => {

                            SInfo.getItem('character_'+(props.num+1), {}).then((character) => {
                                SInfo.getItem('access_token', {}).then((access_token) => {
                                    SInfo.getItem('membership_type', {}).then((membership_type) => {
                            
                                        fetch('https://www.bungie.net/platform/Destiny2/Actions/Items/TransferItem/', {
                                            method: 'POST',
                                            headers: {
                                                'X-API-Key': X_API_Key,
                                                'Authorization': ('Bearer '+access_token),
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify({
                                                'itemReferenceHash': props.data[0],
                                                'stackSize': 1,
                                                'transferToVault': false,
                                                'itemId': props.data[3],
                                                'characterId': character,
                                                'membershipType': membership_type
                                            })
                                        }).then((response) => {
                                            return response.json()
                                        }).then((json) => {

                                            if(json.ErrorStatus == 'Success'){
                                            
                                                fetch('https://www.bungie.net/platform/Destiny2/Actions/Items/EquipItem/', {
                                                    method: 'POST',
                                                    headers: {
                                                        'X-API-Key': X_API_Key,
                                                        'Authorization': ('Bearer '+access_token),
                                                        'Content-Type': 'application/json'
                                                    },
                                                    body: JSON.stringify({
                                                        'itemId': props.data[3],
                                                        'characterId': character,
                                                        'membershipType': membership_type
                                                    })
                                                }).then((response) => {
                                                    return response.json()
                                                }).then((json2) => {
                                                    
                                                    if(json2.ErrorStatus == 'Success'){
                                                        props.changeItem(props.data, 'i'+props.num, props.equipment[props.equipment.findIndex((item) => item[4] == 'e'+props.num)])
                                                        Alert.alert('Item Equipped Successfully')
                                                    }else{
                                                        Alert.alert('Error', json2.Message)
                                                    }

                                                });
                                            }else{
                                                Alert.alert('Error', json.Message)
                                            }

                                        });
                                        
                                    })
                                })
                            })

                            }}>
                                <Text style={{fontFamily: 'NHaasGroteskTXPro-75Bd', color: '#ffffff', fontSize: 20, padding: 10}}>Equip</Text>
                            </TouchableOpacity>
                    )
                }else{
                    buttonReturn.push(
                        <TouchableOpacity key={'button2'} style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#7c2c94', borderRadius: 15, margin: 10}} onPress={() => {

                            SInfo.getItem('character_'+(parseInt(location.split('')[1], 10)+1).toString(), {}).then((othercharacter) => {
                                SInfo.getItem('character_'+(props.num+1), {}).then((character) => {
                                    SInfo.getItem('access_token', {}).then((access_token) => {
                                        SInfo.getItem('membership_type', {}).then((membership_type) => {

                                            fetch('https://www.bungie.net/platform/Destiny2/Actions/Items/TransferItem/', {
                                                method: 'POST',
                                                headers: {
                                                    'X-API-Key': X_API_Key,
                                                    'Authorization': ('Bearer '+access_token),
                                                    'Content-Type': 'application/json'
                                                },
                                                body: JSON.stringify({
                                                    'itemReferenceHash': props.data[0],
                                                    'stackSize': 1,
                                                    'transferToVault': true,
                                                    'itemId': props.data[3],
                                                    'characterId': othercharacter,
                                                    'membershipType': membership_type
                                                })
                                            }).then((response) => {
                                                return response.json()
                                            }).then((json) => {

                                                if(json.ErrorStatus == 'Success'){
                                
                                                    fetch('https://www.bungie.net/platform/Destiny2/Actions/Items/TransferItem/', {
                                                        method: 'POST',
                                                        headers: {
                                                            'X-API-Key': X_API_Key,
                                                            'Authorization': ('Bearer '+access_token),
                                                            'Content-Type': 'application/json'
                                                        },
                                                        body: JSON.stringify({
                                                            'itemReferenceHash': props.data[0],
                                                            'stackSize': 1,
                                                            'transferToVault': false,
                                                            'itemId': props.data[3],
                                                            'characterId': character,
                                                            'membershipType': membership_type
                                                        })
                                                    }).then((response) => {
                                                        return response.json()
                                                    }).then((json2) => {

                                                        if(json2.ErrorStatus == 'Success'){
                                                        
                                                            fetch('https://www.bungie.net/platform/Destiny2/Actions/Items/EquipItem/', {
                                                                method: 'POST',
                                                                headers: {
                                                                    'X-API-Key': X_API_Key,
                                                                    'Authorization': ('Bearer '+access_token),
                                                                    'Content-Type': 'application/json'
                                                                },
                                                                body: JSON.stringify({
                                                                    'itemId': props.data[3],
                                                                    'characterId': character,
                                                                    'membershipType': membership_type
                                                                })
                                                            }).then((response) => {
                                                                return response.json()
                                                            }).then((json3) => {
                                                                
                                                                if(json3.ErrorStatus == 'Success'){
                                                                    props.changeItem(props.data, 'i'+props.num, props.equipment[props.equipment.findIndex((item) => item[4] == 'e'+props.num)])
                                                                    Alert.alert('Item Equipped Successfully')
                                                                }else{
                                                                    Alert.alert('Error', json3.Message)
                                                                }

                                                            });
                                                        }else{
                                                            Alert.alert('Error', json2.Message)
                                                        }

                                                    });
                                                    
                                                }else{
                                                    Alert.alert('Error', json.Message)
                                                }

                                            })

                                        })
                                    })
                                })
                            })

                            }}>
                                <Text style={{fontFamily: 'NHaasGroteskTXPro-75Bd', color: '#ffffff', fontSize: 20, padding: 10}}>Equip</Text>
                            </TouchableOpacity>
                    )
                }
                

                if(location.split('')[0] == 'i' && location != 'i'+props.num){
                    buttonReturn.push(
                        <TouchableOpacity key={'button3'} style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#7c2c94', borderRadius: 15, margin: 10}} onPress={() => {

                            SInfo.getItem('character_'+(props.num+1), {}).then((character) => {
                                SInfo.getItem('character_'+(parseInt(location.split('')[1], 10)+1).toString(), {}).then((othercharacter) => {
                                    SInfo.getItem('access_token', {}).then((access_token) => {
                                        SInfo.getItem('membership_type', {}).then((membership_type) => {

                                            fetch('https://www.bungie.net/platform/Destiny2/Actions/Items/TransferItem/', {
                                                method: 'POST',
                                                headers: {
                                                    'X-API-Key': X_API_Key,
                                                    'Authorization': ('Bearer '+access_token),
                                                    'Content-Type': 'application/json'
                                                },
                                                body: JSON.stringify({
                                                    'itemReferenceHash': props.data[0],
                                                    'stackSize': 1,
                                                    'transferToVault': true,
                                                    'itemId': props.data[3],
                                                    'characterId': othercharacter,
                                                    'membershipType': membership_type
                                                })
                                            }).then((response) => {
                                                return response.json()
                                            }).then((json) => {
                                                if(json.ErrorStatus == 'Success'){
                                                
                                                    fetch('https://www.bungie.net/platform/Destiny2/Actions/Items/TransferItem/', {
                                                        method: 'POST',
                                                        headers: {
                                                            'X-API-Key': X_API_Key,
                                                            'Authorization': ('Bearer '+access_token),
                                                            'Content-Type': 'application/json'
                                                        },
                                                        body: JSON.stringify({
                                                            'itemReferenceHash': props.data[0],
                                                            'stackSize': 1,
                                                            'transferToVault': false,
                                                            'itemId': props.data[3],
                                                            'characterId': character,
                                                            'membershipType': membership_type
                                                        })
                                                    }).then((response) => {
                                                        return response.json()
                                                    }).then((json2) => {
                                                        
                                                        if(json2.ErrorStatus == 'Success'){
                                                            props.setVisible(false)
                                                            Alert.alert('Item Moved Successfully')
                                                        }else{
                                                            Alert.alert('Error', json2.Message)
                                                        }

                                                    });
                                                }else{
                                                    Alert.alert('Error', json.Message)
                                                }

                                            });
                                            
                                        })
                                    })
                                })
                            })

                            }}>
                                <Text style={{fontFamily: 'NHaasGroteskTXPro-75Bd', color: '#ffffff', fontSize: 20, padding: 10}}>Move to This Character</Text>
                            </TouchableOpacity>
                    )
                }else if(location == 'p'){
                    buttonReturn.push(
                        <TouchableOpacity key={'button4'} style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#7c2c94', borderRadius: 15, margin: 10}} onPress={() => {

                            SInfo.getItem('character_'+(props.num+1), {}).then((character) => {
                                SInfo.getItem('access_token', {}).then((access_token) => {
                                    SInfo.getItem('membership_type', {}).then((membership_type) => {

                                        fetch('https://www.bungie.net/platform/Destiny2/Actions/Items/TransferItem/', {
                                            method: 'POST',
                                            headers: {
                                                'X-API-Key': X_API_Key,
                                                'Authorization': ('Bearer '+access_token),
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify({
                                                'itemReferenceHash': props.data[0],
                                                'stackSize': 1,
                                                'transferToVault': false,
                                                'itemId': props.data[3],
                                                'characterId': character,
                                                'membershipType': membership_type
                                            })
                                        }).then((response) => {
                                            return response.json()
                                        }).then((json) => {
                                            if(json.ErrorStatus == 'Success'){
                                                props.setVisible(false)
                                                Alert.alert('Item Moved Successfully')
                                            }else{
                                                Alert.alert('Error', json.Message)
                                            }
                                        });
                                        
                                    })
                                })
                            })

                            }}>
                                <Text style={{fontFamily: 'NHaasGroteskTXPro-75Bd', color: '#ffffff', fontSize: 20, padding: 10}}>Move to This Character</Text>
                            </TouchableOpacity>
                    )
                }

                if(location.split('')[0] == 'i'){
                    buttonReturn.push(
                        <TouchableOpacity key={'button5'} style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#7c2c94', borderRadius: 15, margin: 10}} onPress={() => {
    
                            SInfo.getItem('character_'+(props.num+1), {}).then((character) => {
                                SInfo.getItem('access_token', {}).then((access_token) => {
                                    SInfo.getItem('membership_type', {}).then((membership_type) => {
                                    
                                        fetch('https://www.bungie.net/platform/Destiny2/Actions/Items/TransferItem/', {
                                            method: 'POST',
                                            headers: {
                                                'X-API-Key': X_API_Key,
                                                'Authorization': ('Bearer '+access_token),
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify({
                                                'itemReferenceHash': props.data[0],
                                                'stackSize': 1,
                                                'transferToVault': true,
                                                'itemId': props.data[3],
                                                'characterId': character,
                                                'membershipType': membership_type
                                            })
                                        }).then((response) => {
                                            return response.json()
                                        }).then((json) => {
                                            
                                            if(json.ErrorStatus == 'Success'){
                                                props.setVisible(false)
                                                Alert.alert('Item Vaulted Successfully')
                                            }else{
                                                Alert.alert('Error', json.Message)
                                            }
    
                                        });
                                    
                                    })
                                })
                            })
    
                            }}>
                            <Text style={{fontFamily: 'NHaasGroteskTXPro-75Bd', color: '#ffffff', fontSize: 20, padding: 10}}>Transfer to Vault</Text>
                        </TouchableOpacity>
                    )
                }

            }

            return(
                <Modal animationType='slide' visible={props.visible} onRequestClosed={() => {props.setVisible(false)}}>
                        <ScrollView style={{backgroundColor: '#1d1d1d', flex: 1}} scrollIndicatorInsets={{ right: 1 }}>

                            <Image source={{uri: 'https://www.bungie.net'+banner}} style={{width: Dimensions.get('window').width, height: Dimensions.get('window').width*1080/1920}}/>
                            <Text style={{paddingLeft: 15, paddingTop: 10, fontFamily: 'NHaasGroteskTXPro-65Md', fontSize: Dimensions.get('window').width/(414/32), flex: 1, color: '#ffffff'}}>{props.DestinyInventoryItemLiteDefinition[props.data[0]].displayProperties.name}</Text>
                            <Text style={{paddingLeft: 15, paddingBottom: 5, fontFamily: 'NHaasGroteskTXPro-55Rg', fontSize: Dimensions.get('window').width/(414/17), flex: 1, color: '#ffffff'}}>{props.DestinyInventoryItemLiteDefinition[props.data[0]].itemTypeAndTierDisplayName}</Text>
                            <Text style={{paddingLeft: 15, paddingBottom: 5, fontFamily: 'NeueHaasDisplay-ThinItalic', fontSize: Dimensions.get('window').width/(414/20), flex: 1, color: '#ffffff'}}>{flavorText}</Text>
                            
                            <View style={{paddingVertical: 5, justifyContent: 'center', flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#1d1d1d'}}>
                                <Image style={{height: 30, width: 30, marginLeft: 15}} source={{uri: 'https://www.bungie.net'+damageIcon}} />
                                <Text style={{fontFamily: 'NHaasGroteskTXPro-65Md', fontSize: Dimensions.get('window').width/(414/45), color: damageColor}}>{props.data[1]+diff}</Text>
                            </View>

                            {statOrdered}

                            {perkReturn}

                            <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#7c2c94', borderRadius: 15, margin: 10}} onPress={() => {props.setVisible(false);}}>
                                <Text style={{fontFamily: 'NHaasGroteskTXPro-75Bd', color: '#ffffff', fontSize: 20, padding: 10}}>Close</Text>
                            </TouchableOpacity>

                            {buttonReturn}

                            <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#7c2c94', borderRadius: 15, margin: 10, marginBottom: 40}} onPress={() => {setPicker(true)}}>
                                <Text style={{fontFamily: 'NHaasGroteskTXPro-75Bd', color: '#ffffff', fontSize: 20, padding: 10}}>Transfer/Equip Other Items</Text>
                            </TouchableOpacity>

                            <Modal animationType='slide' visible={pickerVisible} onRequestClosed={() => {setPicker(false)}}>
                                <SafeAreaView style={{backgroundColor: '#1d1d1d', flex: 1, paddingBottom: 10}} >
                                <ScrollView scrollIndicatorInsets={{ right: 1 }}>

                                    <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#7c2c94', borderRadius: 15, margin: 10}} onPress={() => {setPicker(false)}}>
                                        <Text style={{fontFamily: 'NHaasGroteskTXPro-75Bd', color: '#ffffff', fontSize: 20, padding: 10}}>Close</Text>
                                    </TouchableOpacity>

                                    <TextInput multiline={false} value={searchText} placeholder={'Item Name'} placeholderTextColor={'#808080'} style={{padding: 5, margin: 10, borderWidth: 2, borderRadius: 10, borderColor: '#ffffff', color: '#ffffff', fontSize: 20}} onChangeText={(text) => {setSearch(text)}}/>

                                    {pickReturn}
                                
                                </ScrollView>
                                </SafeAreaView>
                            </Modal>

                        </ScrollView>
                </Modal>
            )
        }

    }
}
export default DetailModal;