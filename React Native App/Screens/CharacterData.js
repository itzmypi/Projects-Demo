import React from 'react';
import { View, Text, Image, Dimensions, Modal, SafeAreaView, ScrollView, TouchableOpacity, Alert} from 'react-native';
import {X_API_Key} from "@env"
import SInfo from 'react-native-sensitive-info'
import DetailModal from './DetailModal';
import { eq } from 'react-native-reanimated';

const CharacterData = (props) => {

    const [maxVisible, setMaxVisible] = React.useState(false)
    const [detailVisible, setDetailVisible] = React.useState(false)
    const [detailData, setDetails] = React.useState(null)
    const [postVisible, setPostVisible] = React.useState(null);
    
    const BAD_SOCKETS = [
        2931483505, // InventoryItem "Default Ornament"
        1959648454, // InventoryItem "Default Ornament"
        702981643, // InventoryItem "Default Ornament"
        3807544519 // InventoryItem "Remove Armor Glow"
    ];
    
    const ORNAMENT_SUBTYPES = [21, 26, 27, 28, 29, 30];

    const screen = React.useRef('power')
    const index = React.useRef(null)
    const equipmentArr = React.useRef([])
    const postMaster = React.useRef([])
    
    characterEquipment = props.character_data.characterEquipment.data[Object.keys(props.character_data.characterEquipment.data)[props.num]].items;
    const gearStats = React.useRef([])
    gearCounter = 0;
    if(gearStats.current.length == 0){

        for(let i = 0; i < characterEquipment.length; i++){

            //fetches the character equipment and, when finished, continues gathering more data

            var thisItemInstance = props.character_data.itemComponents.instances.data[characterEquipment[i].itemInstanceId];
            var thisItemSockets = props.character_data.itemComponents.sockets.data[characterEquipment[i].itemInstanceId]?.sockets;
            
            if(thisItemInstance.primaryStat && (thisItemInstance.primaryStat.statHash == 1480404414 || thisItemInstance.primaryStat.statHash == 3897883278)){
                //1480404414 attack
                //3897883278 defense

                if(thisItemSockets){
                    for(let x = 0; x < thisItemSockets.length; x++){
                        if(thisItemSockets[x].plugHash){
                            
                            //Checks if the socket has the ornament type, if it is not a useless socket, and if its item type is not "Armor Mods: Glow Effects"
                            if(ORNAMENT_SUBTYPES.includes(props.DestinyInventoryItemLiteDefinition[thisItemSockets[x].plugHash].itemSubType) && !BAD_SOCKETS.includes(thisItemSockets[x].plugHash) && !props.DestinyInventoryItemLiteDefinition[thisItemSockets[x].plugHash].itemCategoryHashes.includes(1875601085)){
                                gearStats.current.push([characterEquipment[i].itemHash, thisItemInstance.primaryStat.value, props.DestinyInventoryItemLiteDefinition[thisItemSockets[x].plugHash].displayProperties.icon, characterEquipment[i].itemInstanceId, thisItemSockets[x].plugHash]);
                                
                                break;
                            }
                            
                        }

                        if(x == thisItemSockets.length - 1){
                            gearStats.current.push([characterEquipment[i].itemHash, thisItemInstance.primaryStat.value, props.DestinyInventoryItemLiteDefinition[characterEquipment[i].itemHash].displayProperties.icon, characterEquipment[i].itemInstanceId]);
                        }

                    }
                    

                    gearCounter++;
                }
            
            }

            if(gearCounter == 8){
                break;
            }

        }
    }

    if(equipmentArr.current.length == 0){

        //array to be used for all equipment: [kinetic, energy, power, head, arms, chest, legs, class]
        equipmentArr.current = [[],[],[],[],[],[],[],[]]

        switch (props.name){
            case 'Titan':
                classType = 0;
                break;
            case 'Warlock':
                classType = 2;
                break;
            case 'Hunter':
                classType = 1;
                break;
        }

        function organizeBuckets(itemInstance, itemHash, bucketHash, itemInstanceId, location){
            if(itemInstance?.primaryStat && (itemInstance.primaryStat.statHash == 1480404414 || itemInstance.primaryStat.statHash == 3897883278) && (props.DestinyInventoryItemLiteDefinition[itemHash].classType == 3 || props.DestinyInventoryItemLiteDefinition[itemHash].classType == classType)){

                switch (bucketHash){
                    case 1498876634:
                        equipmentArr.current[0].push([itemHash, itemInstance.primaryStat.value, props.DestinyInventoryItemLiteDefinition[itemHash].inventory.tierType, itemInstanceId, location])
                        break;
                    case 2465295065:
                        equipmentArr.current[1].push([itemHash, itemInstance.primaryStat.value, props.DestinyInventoryItemLiteDefinition[itemHash].inventory.tierType, itemInstanceId, location])
                        break;
                    case 953998645:
                        equipmentArr.current[2].push([itemHash, itemInstance.primaryStat.value, props.DestinyInventoryItemLiteDefinition[itemHash].inventory.tierType, itemInstanceId, location])
                        break;
                    case 3448274439:
                        equipmentArr.current[3].push([itemHash, itemInstance.primaryStat.value, props.DestinyInventoryItemLiteDefinition[itemHash].inventory.tierType, itemInstanceId, location])
                        break;
                    case 3551918588:
                        equipmentArr.current[4].push([itemHash, itemInstance.primaryStat.value, props.DestinyInventoryItemLiteDefinition[itemHash].inventory.tierType, itemInstanceId, location])
                        break;
                    case 14239492:
                        equipmentArr.current[5].push([itemHash, itemInstance.primaryStat.value, props.DestinyInventoryItemLiteDefinition[itemHash].inventory.tierType, itemInstanceId, location])
                        break;
                    case 20886954:
                        equipmentArr.current[6].push([itemHash, itemInstance.primaryStat.value, props.DestinyInventoryItemLiteDefinition[itemHash].inventory.tierType, itemInstanceId, location])
                        break;
                    case 1585787867:
                        equipmentArr.current[7].push([itemHash, itemInstance.primaryStat.value, props.DestinyInventoryItemLiteDefinition[itemHash].inventory.tierType, itemInstanceId, location])
                        break;
                    
                }

            }
        }

        //iterates through equipped items on this character and other characters
        for(let x = 0; x < 3; x++){

            characterEquipment = props.character_data.characterEquipment.data[Object.keys(props.character_data.characterEquipment.data)[x]]?.items;

            if(characterEquipment){

                for(let i = 0; i < characterEquipment.length; i++){

                    organizeBuckets(props.character_data.itemComponents.instances.data[characterEquipment[i].itemInstanceId], characterEquipment[i].itemHash, characterEquipment[i].bucketHash, characterEquipment[i].itemInstanceId, 'e'+x)

                }

            }

        }

        postMaster.current = [];

        //iterates through inventories of this character and other characters
        for(let x = 0; x < 3; x++){

            characterInventory = props.character_data.characterInventories.data[Object.keys(props.character_data.characterInventories.data)[x]]?.items;

            if(characterInventory){

                for(let i = 0; i < characterInventory.length; i++){

                    if(characterInventory[i].bucketHash == 215593132 && characterInventory[i].itemInstanceId && characterInventory[i].lockable && x == props.num){
                        postMaster.current.push([characterInventory[i].itemHash, characterInventory[i].itemInstanceId, characterInventory[i].quantity, props.DestinyInventoryItemLiteDefinition[characterInventory[i].itemHash].inventory.tierType, props.character_data.itemComponents.instances.data[characterInventory[i].itemInstanceId].primaryStat.value])
                    }else if(characterInventory[i].bucketHash == 215593132 && x == props.num){
                        postMaster.current.push([characterInventory[i].itemHash, '', characterInventory[i].quantity, props.DestinyInventoryItemLiteDefinition[characterInventory[i].itemHash].inventory.tierType, 'inventory'])
                    }

                    organizeBuckets(props.character_data.itemComponents.instances.data[characterInventory[i].itemInstanceId], characterInventory[i].itemHash, characterInventory[i].bucketHash, characterInventory[i].itemInstanceId, 'i'+x)

                }

            }

        }

        profileInventory = props.character_data.profileInventory.data.items;

        //iterates through vault
        for(let i = 0; i < profileInventory.length; i++){

            organizeBuckets(props.character_data.itemComponents.instances.data[profileInventory[i].itemInstanceId], profileInventory[i].itemHash, props.DestinyInventoryItemLiteDefinition[profileInventory[i].itemHash].inventory.bucketTypeHash, profileInventory[i].itemInstanceId, 'p')

        }
    
    }

    var equipmentTemp = equipmentArr.current
    if(!detailVisible && !maxVisible && !postVisible){
        equipmentArr.current = [];
    }

    //sorts best items
    maxItems = []

    for(let i = 0; i < 8; i++){

        equipmentTemp[i].sort((a, b) => b[1]-a[1])

        maxItems.push(equipmentTemp[i][0])
    }

    var newItemCount = 1
    while(maxItems.filter(item => item[2] == 6).length > 1){
        
        //amasses indexes of all exotics
        var indexes = [];
        maxItems.forEach((item, index) => {
            if(item[2] == 6){
                indexes.push(index);
            }
        })

        //compares power averages when you change each exotic
        var poweravgs = [];
        var tempItems;

        for(let i = 0; i < indexes.length; i++){
            tempItems = [...maxItems]

            tempItems[indexes[i]] = equipmentTemp[indexes[i]][equipmentTemp[indexes[i]].indexOf(maxItems[indexes[i]])+newItemCount]

            var total = 0;
            for(let x = 0; x < 8; x++){
                total += tempItems[x][1]
            }

            poweravgs.push(total/8)
        }
        
        //if the power averages are the same, check the items another spot ahead
        if(poweravgs.every((item) => item === poweravgs[0])){
            newItemCount++;
            continue;
        }else{
            newItemCount = 1;
        }
        
        var newIndex = indexes[poweravgs.indexOf(Math.max(...poweravgs))]
        
        maxItems[newIndex] = equipmentTemp[newIndex][equipmentTemp[newIndex].indexOf(maxItems[newIndex])+newItemCount]
    }

    //because this algorithm continually goes down the array to find legendaries, the remaining exotic needs to be changed back to the best item
    maxItems.forEach((item, index) => {
        if(item[2] == 6){
            maxItems[index] = [...equipmentTemp[index][0]]
        }
    })
    
    maxPower = 0;
    maxItems.forEach((item) => maxPower+=item[1]);
    maxPower = maxPower/8;

    maxReturn = maxItems.map((item) => {

        var thisItemSockets = props.character_data.itemComponents.sockets.data[item[3]].sockets;

        let icon = '';

        for(let x = 0; x < thisItemSockets.length; x++){
            if(thisItemSockets[x].plugHash){
                
                //Checks if the socket has the ornament type, if it is not a useless socket, and if its item type is not "Armor Mods: Glow Effects"
                if(ORNAMENT_SUBTYPES.includes(props.DestinyInventoryItemLiteDefinition[thisItemSockets[x].plugHash].itemSubType) && !BAD_SOCKETS.includes(thisItemSockets[x].plugHash) && !props.DestinyInventoryItemLiteDefinition[thisItemSockets[x].plugHash].itemCategoryHashes.includes(1875601085)){
                    icon = props.DestinyInventoryItemLiteDefinition[thisItemSockets[x].plugHash].displayProperties.icon;
                    
                    break;
                }
                
            }

            if(x == thisItemSockets.length - 1){
                icon = props.DestinyInventoryItemLiteDefinition[item[0]].displayProperties.icon;
            }

        }

        let diff = ''

        if(item[1] > Math.floor(maxPower)){
            diff = ' (+'+(item[1]-Math.floor(maxPower))+')'
        }else{
            diff = ' ('+(item[1]-Math.floor(maxPower))+')'
        }

        return(
            <View  key={item[0]} style={{padding: 5, flex: 1, flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#1d1d1d'}}>
                <Image source={{uri: 'https://www.bungie.net'+icon}} style={{width: 60, height: 60, borderRadius: 10}}/>
                <View style={{flex: 1, padding: 5, flexDirection: 'column', backgroundColor: '#1d1d1d'}}>
                    <Text style={{fontFamily: 'NHaasGroteskTXPro-65Md', fontSize: 21, color: '#ffff44'}}>{item[1]+diff}</Text>
                    <Text style={{fontFamily: 'NHaasGroteskTXPro-65Md', fontSize: 18, color: '#ffffff'}}>{props.DestinyInventoryItemLiteDefinition[item[0]].displayProperties.name}</Text>
                </View>
            </View>
        )
    })
    
    //calculates power level and displays equipped item data
    powerTotal = 0;
    for(let i = 0; i < 8; i++){
        powerTotal+=parseInt(gearStats.current[i][1], 10)
    }
    powerTotal = powerTotal / 8

    artifactPower = 0;
    characterEquipment = props.character_data.characterEquipment.data[Object.keys(props.character_data.characterEquipment.data)[props.num]].items;
    for(let i = 0; i < characterEquipment.length; i++){
        if(characterEquipment[i].bucketHash == 1506418338){
            artifactPower = props.character_data.itemComponents.instances.data[characterEquipment[i].itemInstanceId].primaryStat?.value;
        }
    }

    //sets inventory return, preserves the current value of gearStats if a modal is visible
    
    var gearTemp = gearStats.current
    if(!detailVisible && !maxVisible){
        gearStats.current = [];
    }

    inventoryReturn = gearTemp.map((gear, ind) => {
        
        if(gear[1] > Math.floor(powerTotal)){
            diff = ' (+'+(gear[1]-Math.floor(powerTotal))+')'
        }else{
            diff = ' ('+(gear[1]-Math.floor(powerTotal))+')'
        }

        if(ind % 2 == 0){
            return(
                <TouchableOpacity key={gear[2]} onPress={() => {gearStats.current = gearTemp;equipmentArr.current = equipmentTemp;screen.current = 'power';index.current = ind;setDetailVisible(true);setDetails(gear)}}>
                <View style={{padding: 5, flex: 1, flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#1d1d1d'}}>
                    <Image source={{uri: 'https://www.bungie.net'+gear[2]}} style={{width: 60, height: 60, borderRadius: 10}}/>
                    <View style={{padding: 5, flex: 1, flexDirection: 'column', backgroundColor: '#1d1d1d'}}>
                        <Text style={{fontFamily: 'NHaasGroteskTXPro-65Md', fontSize: 21, color: '#ffff44'}}>{gear[1]+diff}</Text>
                        <Text style={{fontFamily: 'NHaasGroteskTXPro-65Md', fontSize: 18, flex: 1, color: '#ffffff'}}>{props.DestinyInventoryItemLiteDefinition[gear[0]].displayProperties.name}</Text>
                    </View>
                </View>
                </TouchableOpacity>
            )
        }else{
            return(
                <TouchableOpacity key={gear[2]} onPress={() => {gearStats.current = gearTemp;equipmentArr.current = equipmentTemp;screen.current = 'power';index.current = ind;setDetailVisible(true);setDetails(gear)}}>
                <View style={{padding: 5, flex: 1, flexDirection: 'row-reverse', alignItems: 'flex-start', backgroundColor: '#1d1d1d'}}>
                    <Image source={{uri: 'https://www.bungie.net'+gear[2]}} style={{width: 60, height: 60, borderRadius: 10}}/>
                    <View style={{flex: 1, padding: 5, flexDirection: 'column', backgroundColor: '#1d1d1d', alignItems: 'flex-end'}}>
                        <Text style={{fontFamily: 'NHaasGroteskTXPro-65Md', fontSize: 21, color: '#ffff44'}}>{gear[1]+diff}</Text>
                        <Text style={{fontFamily: 'NHaasGroteskTXPro-65Md', fontSize: 18, color: '#ffffff'}}>{props.DestinyInventoryItemLiteDefinition[gear[0]].displayProperties.name}</Text>
                    </View>
                </View>
                </TouchableOpacity>
            )
        }
    })

    postList = [];
    postReturn = null;

    if(postMaster.current.length){
        let imageRow = postMaster.current.map((item, index) => {
            if(index < 5){
                return(
                    <Image key={item[0]+index} source={{uri: 'https://www.bungie.net'+props.DestinyInventoryItemLiteDefinition[item[0]].displayProperties.icon}} style={{width: 30, height: 30, borderRadius: 15, paddingRight: 5}}/>
                )
            }
        })

        postList = postMaster.current.map((item, index) => {

            if(item[1] != ''){

                const BUCKETS = {
                    1498876634: 0,
                    2465295065: 1,
                    953998645: 2,
                    3448274439: 3,
                    3551918588: 4,
                    14239492: 5,
                    20886954: 6,
                    1585787867: 7
                }

                return(
                    <TouchableOpacity key={item[1]} style={{padding: 5, flex: 1, flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#1d1d1d'}} onPress={()=>{
                        
                        SInfo.getItem('character_'+(props.num+1), {}).then((character) => {
                            SInfo.getItem('access_token', {}).then((access_token) => {
                                SInfo.getItem('membership_type', {}).then((membership_type) => {

                                    fetch('https://www.bungie.net/platform/Destiny2/Actions/Items/PullFromPostmaster/', {
                                        method: 'POST',
                                        headers: {
                                            'X-API-Key': X_API_Key,
                                            'Authorization': ('Bearer '+access_token),
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({
                                            'itemReferenceHash': item[0],
                                            'stackSize': item[2],
                                            'itemId': item[1],
                                            'characterId': character,
                                            'membershipType': membership_type
                                        })
                                    }).then((response) => {
                                        return response.json()
                                    }).then((json) => {
                                        if(json.ErrorStatus == 'Success'){
                                            Alert.alert('Item Moved Successfully')
                                            equipmentArr.current[BUCKETS[props.DestinyInventoryItemLiteDefinition[item[0]].inventory.bucketTypeHash]].push([item[0], item[4], item[3], item[1], 'i'+props.num])
                                            postMaster.current.splice(index, 1)
                                            setPostVisible(false)
                                        }else{
                                            Alert.alert('Error', json.Message)
                                        }

                                    });
                                })
                            })
                        })
                    }}>
                        <Image source={{uri: 'https://www.bungie.net'+props.DestinyInventoryItemLiteDefinition[item[0]].displayProperties.icon}} style={{width: 60, height: 60, borderRadius: 10}}/>
                        <View style={{flex: 1, padding: 5, flexDirection: 'column', backgroundColor: '#1d1d1d'}}>
                            <Text style={{fontFamily: 'NHaasGroteskTXPro-65Md', fontSize: 21, color: '#ffff44'}}>{item[4]}</Text>
                            <Text style={{fontFamily: 'NHaasGroteskTXPro-65Md', fontSize: 18, color: '#ffffff'}}>{props.DestinyInventoryItemLiteDefinition[item[0]].displayProperties.name}</Text>
                        </View>
                    </TouchableOpacity>
                )
            }else{
                return(
                    <TouchableOpacity key={item[0]+index} style={{padding: 5, flex: 1, flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#1d1d1d'}} onPress={()=>{
                        
                        SInfo.getItem('character_'+(props.num+1), {}).then((character) => {
                            SInfo.getItem('access_token', {}).then((access_token) => {
                                SInfo.getItem('membership_type', {}).then((membership_type) => {

                                    fetch('https://www.bungie.net/platform/Destiny2/Actions/Items/PullFromPostmaster/', {
                                        method: 'POST',
                                        headers: {
                                            'X-API-Key': X_API_Key,
                                            'Authorization': ('Bearer '+access_token),
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({
                                            'itemReferenceHash': item[0],
                                            'stackSize': item[2],
                                            'itemId': '0',
                                            'characterId': character,
                                            'membershipType': membership_type
                                        })
                                    }).then((response) => {
                                        return response.json()
                                    }).then((json) => {
                                        
                                        if(json.ErrorStatus == 'Success'){
                                            Alert.alert('Item Moved Successfully')
                                            postMaster.current.splice(index, 1)
                                            setPostVisible(false)
                                        }else{
                                            Alert.alert('Error', json.Message)
                                        }

                                    });
                                })
                            })
                        })
                    }}>
                        <Image source={{uri: 'https://www.bungie.net'+props.DestinyInventoryItemLiteDefinition[item[0]].displayProperties.icon}} style={{width: 60, height: 60, borderRadius: 10}}/>
                        <View style={{flex: 1, padding: 5, flexDirection: 'column', backgroundColor: '#1d1d1d'}}>
                            <Text style={{fontFamily: 'NHaasGroteskTXPro-65Md', fontSize: 21, color: '#ffff44'}}>{item[2]}</Text>
                            <Text style={{fontFamily: 'NHaasGroteskTXPro-65Md', fontSize: 18, color: '#ffffff'}}>{props.DestinyInventoryItemLiteDefinition[item[0]].displayProperties.name}</Text>
                        </View>
                    </TouchableOpacity>
                )
            }
        })

        postReturn = 
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1d1d1d', padding: 5}}>
            <TouchableOpacity style={{backgroundColor: '#373737', borderRadius: 15, padding: 15, flexDirection: 'row'}} onPress={() => {gearStats.current = gearTemp;equipmentArr.current = equipmentTemp;setPostVisible(true)}}>
                <Text style={{fontFamily: 'NHaasGroteskTXPro-75Bd', fontSize: 20, color: '#ffffff'}}>{'Postmaster('+postMaster.current.length+') '}</Text>
                {imageRow}
            </TouchableOpacity>
        </View>
        
    }

    //aggregates milestone data into milestoneArr
    var characterMilestones = props.character_data.characterProgressions.data[Object.keys(props.character_data.characterProgressions.data)[props.num]].milestones
    var characterActivities = props.character_data.characterActivities.data[Object.keys(props.character_data.characterActivities.data)[props.num]].availableActivities

    var blankIcon = props.DestinyInventoryItemLiteDefinition[73143230].displayProperties.icon

    milestoneArr = [];
    pinnacleArr = [];
    tier3Arr = [];
    tier2Arr = [];
    tier1Arr = [];
    
    for(let y = 0; y < Object.keys(characterMilestones).length; y++){
        thisMilestone = props.milestoneDefinition[characterMilestones[Object.keys(characterMilestones)[y]].milestoneHash]
        
        var name = thisMilestone.displayProperties.name;
        var description = thisMilestone.displayProperties.description;
        var icon = null
        var reward = []
        var completed = [null, null]
        var activity = []
        if(thisMilestone.displayProperties.hasIcon){

            icon = thisMilestone.displayProperties.icon;
        }else{

            icon = blankIcon;
            
        }
        
        var needToPush = true

        if(thisMilestone.rewards){
            for(let x = 0; x < Object.keys(thisMilestone.rewards[Object.keys(thisMilestone.rewards)[0]].rewardEntries).length; x++){
                
                if(Object.keys(thisMilestone.rewards[Object.keys(thisMilestone.rewards)[0]].rewardEntries).length > 1){
                    //Weekly clan rewards
                    needToPush = false
                    
                    milestoneArr.push([thisMilestone.rewards[Object.keys(thisMilestone.rewards)[0]].rewardEntries[Object.keys(thisMilestone.rewards[Object.keys(thisMilestone.rewards)[0]].rewardEntries)[x]].displayProperties.name, thisMilestone.rewards[Object.keys(thisMilestone.rewards)[0]].rewardEntries[Object.keys(thisMilestone.rewards[Object.keys(thisMilestone.rewards)[0]].rewardEntries)[x]].displayProperties.description, thisMilestone.rewards[Object.keys(thisMilestone.rewards)[0]].rewardEntries[Object.keys(thisMilestone.rewards[Object.keys(thisMilestone.rewards)[0]].rewardEntries)[x]].displayProperties.icon, [props.DestinyInventoryItemLiteDefinition[thisMilestone.rewards[Object.keys(thisMilestone.rewards)[0]].rewardEntries[Object.keys(thisMilestone.rewards[Object.keys(thisMilestone.rewards)[0]].rewardEntries)[x]].items[0].itemHash].displayProperties.name], [characterMilestones[Object.keys(characterMilestones)[y]].rewards[0].entries.find(entry => entry.rewardEntryHash == Object.keys(thisMilestone.rewards[Object.keys(thisMilestone.rewards)[0]].rewardEntries)[x]).earned, characterMilestones[Object.keys(characterMilestones)[y]].rewards[0].entries.find(entry => entry.rewardEntryHash == Object.keys(thisMilestone.rewards[Object.keys(thisMilestone.rewards)[0]].rewardEntries)[x]).redeemed], activity])
                    
                }else{

                    reward.push(props.DestinyInventoryItemLiteDefinition[thisMilestone.rewards[Object.keys(thisMilestone.rewards)[0]].rewardEntries[Object.keys(thisMilestone.rewards[Object.keys(thisMilestone.rewards)[0]].rewardEntries)[x]].items[0].itemHash].displayProperties.name)
                    if(characterMilestones[Object.keys(characterMilestones)[y]].activities[0].challenges[0].objective){
                        completed[0] = characterMilestones[Object.keys(characterMilestones)[y]].activities[0].challenges[0].objective.progress
                        completed[1] = characterMilestones[Object.keys(characterMilestones)[y]].activities[0].challenges[0].objective.completionValue
                    }else{
                        completed[0] = characterMilestones[Object.keys(characterMilestones)[y]].rewards[0].entries[0].earned
                        completed[1] = characterMilestones[Object.keys(characterMilestones)[y]].rewards[0].entries[0].redeemed
                    }

                    for(let x = 0; x < characterMilestones[Object.keys(characterMilestones)[y]].activities.length; x++){
                        activity.push(characterMilestones[Object.keys(characterMilestones)[y]].activities[x].activityHash)
                    }

                }

            }

        }else if(thisMilestone.quests && Object.keys(thisMilestone.quests)[0]){
            //only use the first reward, everything else is outdated/invalid
            if(thisMilestone.quests[Object.keys(thisMilestone.quests)[0]].questRewards){

                reward.push(props.DestinyInventoryItemLiteDefinition[thisMilestone.quests[Object.keys(thisMilestone.quests)[0]].questRewards.items[0].itemHash].displayProperties.name)

            }
            else if(props.DestinyInventoryItemLiteDefinition[Object.keys(thisMilestone.quests)[0]].value){

                reward.push(props.DestinyInventoryItemLiteDefinition[props.DestinyInventoryItemLiteDefinition[Object.keys(thisMilestone.quests)[0]].value.itemValue[0].itemHash].displayProperties.name)

            }

            completed[0] = characterMilestones[Object.keys(characterMilestones)[y]].availableQuests[0].status.stepObjectives[0].progress;
            completed[1] = characterMilestones[Object.keys(characterMilestones)[y]].availableQuests[0].status.stepObjectives[0].completionValue;
            
            icon = thisMilestone.quests[Object.keys(thisMilestone.quests)[0]].displayProperties.icon

            if(characterMilestones[Object.keys(characterMilestones)[y]].availableQuests[0].status.stepObjectives[0].activityHash){
                activity.push(characterMilestones[Object.keys(characterMilestones)[y]].availableQuests[0].status.stepObjectives[0].activityHash)
            }
        }

        if(needToPush && reward.length != 0){

            milestoneArr.push([name, description, icon, reward, completed, activity])
        }
        
    }

    for(let z = 0; z < characterActivities.length; z++){

        thisActivity = props.activityDefinition[characterActivities[z].activityHash]

        if(milestoneArr.every((milestone) => milestone[5] && !milestone[5].includes(thisActivity.hash)) && characterActivities[z].challenges && characterActivities[z].challenges.every((challenge) => challenge.objective.progress != challenge.objective.completionValue)){
            
            var name = thisActivity.displayProperties.name;
            var description = thisActivity.displayProperties.description;
            var icon = null
            var reward = []
            var completed = []

            if(thisActivity.displayProperties.hasIcon){

                icon = thisActivity.displayProperties.icon;

            }else{

                icon = blankIcon;

            }

            for(let ii = 0; ii < thisActivity.challenges.length; ii++){

                for(let yy = 0; yy < thisActivity.challenges[ii].dummyRewards.length; yy++){

                    switch(thisActivity.challenges[ii].dummyRewards[yy].itemHash){
                        case 73143230:
                            reward.push("Pinnacle Gear")
                            completed = [characterActivities[z].challenges[0].objective.progress, characterActivities[z].challenges[0].objective.completionValue]
                            break;
                        case 3114385607:
                            reward.push("Powerful Gear (Tier 3)")
                            completed = [characterActivities[z].challenges[0].objective.progress, characterActivities[z].challenges[0].objective.completionValue]
                            break;
                        case 3114385606:
                            reward.push("Powerful Gear (Tier 2)")
                            completed = [characterActivities[z].challenges[0].objective.progress, characterActivities[z].challenges[0].objective.completionValue]
                            break;
                        case 3114385605:
                            reward.push("Powerful Gear (Tier 1)")
                            completed = [characterActivities[z].challenges[0].objective.progress, characterActivities[z].challenges[0].objective.completionValue]
                            break;
                        case 4039143015:
                            reward.push("Powerful Gear")
                            completed = [characterActivities[z].challenges[0].objective.progress, characterActivities[z].challenges[0].objective.completionValue]
                            break;

                    }

                }
            }

            if(reward.length > 0){
                milestoneArr.push([name, description, icon, reward, completed])
            }

        }

    }

    //splits up the milestone data based on the reward/status type
    for(let i = 0; i < milestoneArr.length; i++){

        if(milestoneArr[i][3].find(index => index.toUpperCase().includes('PINNACLE'))){
            pinnacleArr.push(milestoneArr[i])
            
        }
        if(milestoneArr[i][3].find(index => index.includes('3'))){
            tier3Arr.push(milestoneArr[i])
            
        }
        if(milestoneArr[i][3].find(index => index.includes('2'))){
            tier2Arr.push(milestoneArr[i])
            
        }
        if(milestoneArr[i][3].find(index => index.includes('1')) || milestoneArr[i][3].find(index => index.toUpperCase() == 'POWERFUL GEAR')){
            tier1Arr.push(milestoneArr[i])
            
        }
            
    }

    //returns what to display for each type of reward

    if(pinnacleArr.length > 0){
        pinnacleReturn = pinnacleArr.map((item) => {
            completionStatus = ''
            if(typeof(item[4][0]) == 'number' && typeof(item[4][1]) == 'number'){
                completionStatus = '('+item[4][0]+'/'+item[4][1]+')'
            }else if(item[4][0] == true && item[4][1] == false){
                completionStatus = '(Not Redeemed)'
            }

            return(
                <View  key={item[0]+item[1]} style={{padding: 5, flex: 1, flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#1d1d1d'}}>
                    <Image source={{uri: 'https://www.bungie.net'+item[2]}} style={{width: 50, height: 50, borderRadius: 10}}/>
                    <View style={{padding: 5, flex: 1, flexDirection: 'column', justifyContent: 'center', backgroundColor: '#1d1d1d'}}>
                        <Text style={{fontFamily: 'NHaasGroteskTXPro-65Md', fontSize: 20, color: '#8444ab'}}>{item[0]} <Text style={{fontFamily: 'NHaasGroteskTXPro-65Md', fontSize: 22, color: '#ffffff'}}>{completionStatus}</Text></Text>
                        <Text style={{fontFamily: 'NeueHaasDisplay-ThinItalic', fontSize: 17, flex: 1, color: '#ffffff'}}>{item[1]}</Text>
                    </View>
                </View>
            )
        })
    }else{
        pinnacleReturn = <Text style={{backgroundColor: '#1d1d1d', fontFamily: 'NeueHaasDisplay-ThinItalic', fontSize: 23, fontWeight: '600', color: '#FFFFFF', paddingLeft: 20}}>None</Text>
    }

    if(tier3Arr.length > 0){
        tier3Return = tier3Arr.map((item) => {
            completionStatus = ''
            if(typeof(item[4][0]) == 'number' && typeof(item[4][1]) == 'number'){
                completionStatus = '('+item[4][0]+'/'+item[4][1]+')'
            }else if(item[4][0] == true && item[4][1] == false){
                completionStatus = '(Not Redeemed)'
            }

            return(
                <View  key={item[0]+item[1]} style={{padding: 5, flex: 1, flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#1d1d1d'}}>
                    <Image source={{uri: 'https://www.bungie.net'+item[2]}} style={{width: 50, height: 50, borderRadius: 10}}/>
                    <View style={{padding: 5, flex: 1, flexDirection: 'column', justifyContent: 'center', backgroundColor: '#1d1d1d'}}>
                        <Text style={{fontFamily: 'NHaasGroteskTXPro-65Md', fontSize: 20, color: '#8444ab'}}>{item[0]} <Text style={{fontFamily: 'NHaasGroteskTXPro-65Md', fontSize: 22, color: '#ffffff'}}>{completionStatus}</Text></Text>
                        <Text style={{fontFamily: 'NeueHaasDisplay-ThinItalic', fontSize: 17, flex: 1, color: '#ffffff'}}>{item[1]}</Text>
                    </View>
                </View>
            )
        })
    }else{
        tier3Return = <Text style={{backgroundColor: '#1d1d1d', fontFamily: 'NeueHaasDisplay-ThinItalic', fontSize: 23, fontWeight: '600', color: '#FFFFFF', paddingLeft: 20}}>None</Text>
    }

    if(tier2Arr.length > 0){
        tier2Return = tier2Arr.map((item) => {
            completionStatus = ''
            if(typeof(item[4][0]) == 'number' && typeof(item[4][1]) == 'number'){
                completionStatus = '('+item[4][0]+'/'+item[4][1]+')'
            }else if(item[4][0] == true && item[4][1] == false){
                completionStatus = '(Not Redeemed)'
            }

            return(
                <View  key={item[0]+item[1]} style={{padding: 5, flex: 1, flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#1d1d1d'}}>
                    <Image source={{uri: 'https://www.bungie.net'+item[2]}} style={{width: 50, height: 50, borderRadius: 10}}/>
                    <View style={{padding: 5, flex: 1, flexDirection: 'column', justifyContent: 'center', backgroundColor: '#1d1d1d'}}>
                        <Text style={{fontFamily: 'NHaasGroteskTXPro-65Md', fontSize: 20, color: '#8444ab'}}>{item[0]} <Text style={{fontFamily: 'NHaasGroteskTXPro-65Md', fontSize: 22, color: '#ffffff'}}>{completionStatus}</Text></Text>
                        <Text style={{fontFamily: 'NeueHaasDisplay-ThinItalic', fontSize: 17, flex: 1, color: '#ffffff'}}>{item[1]}</Text>
                    </View>
                </View>
            )
        })
    }else{
        tier2Return = <Text style={{backgroundColor: '#1d1d1d', fontFamily: 'NeueHaasDisplay-ThinItalic', fontSize: 23, fontWeight: '600', color: '#FFFFFF', paddingLeft: 20}}>None</Text>
    }

    if(tier1Arr.length > 0){
        tier1Return = tier1Arr.map((item) => {
            completionStatus = ''
            if(typeof(item[4][0]) == 'number' && typeof(item[4][1]) == 'number'){
                completionStatus = '('+item[4][0]+'/'+item[4][1]+')'
            }else if(item[4][0] == true && item[4][1] == false){
                completionStatus = '(Not Redeemed)'
            }

            return(
                <View  key={item[0]+item[1]} style={{padding: 5, flex: 1, flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#1d1d1d'}}>
                    <Image source={{uri: 'https://www.bungie.net'+item[2]}} style={{width: 50, height: 50, borderRadius: 10}}/>
                    <View style={{padding: 5, flex: 1, flexDirection: 'column', justifyContent: 'center', backgroundColor: '#1d1d1d'}}>
                        <Text style={{fontFamily: 'NHaasGroteskTXPro-65Md', fontSize: 20, color: '#8444ab'}}>{item[0]} <Text style={{fontFamily: 'NHaasGroteskTXPro-65Md', fontSize: 22, color: '#ffffff'}}>{completionStatus}</Text></Text>
                        <Text style={{fontFamily: 'NeueHaasDisplay-ThinItalic', fontSize: 17, flex: 1, color: '#ffffff'}}>{item[1]}</Text>
                    </View>
                </View>
            )
        })
    }else{
        tier1Return = <Text style={{backgroundColor: '#1d1d1d', fontFamily: 'NeueHaasDisplay-ThinItalic', fontSize: 23, fontWeight: '600', color: '#FFFFFF', paddingLeft: 20}}>None</Text>
    }

    return(
        <>
        <View style={{flex: 1, backgroundColor: '#373737', flexDirection: 'column', paddingTop: 20, paddingHorizontal: 30, paddingBottom: 10}}>
            <View style={{flex: 1, backgroundColor: '#373737', flexDirection: 'row'}}>

                <View style={{flex: 1, flexDirection: 'column', paddingTop: 20}}>
                    <View style={{backgroundColor: '#09D6CF', width: 100, height: 3}}/>
                        <Text style={{fontFamily: 'NHaasGroteskTXPro-75Bd', color: '#ffffff', fontSize: Dimensions.get('window').width/(414/55)}}>{props.name}</Text>
                    <View style={{backgroundColor: '#09D6CF', width: 50, height: 3}}/>
                </View>
                
                <Image source={{uri: 'https://www.bungie.net'+props.character_data.characters.data[Object.keys(props.character_data.characters.data)[props.num]].emblemPath}} style={{width: 96, height: 96, borderRadius: 15}}/>
            
            </View>

            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: 5, justifyContent: 'center'}}>
                <Image style={{tintColor: '#ffff44'}} source={require('../Assets/power.png')} />
                <Text style={{fontFamily: 'NHaasGroteskTXPro-75Bd', color: '#ffff44', fontSize: Dimensions.get('window').width/(414/65)}}>{Math.floor(powerTotal)}</Text>
                <View style={{flexDirection: 'column', paddingLeft: 10}}>
                    <Text style={{fontFamily: 'NHaasGroteskTXPro-75Bd', color: '#ffff44', fontSize: Dimensions.get('window').width/(414/40)}}>{(powerTotal-Math.floor(powerTotal))*8}</Text>
                    <View style={{backgroundColor: '#ffff44', width: 25, height: 5}}/>
                    <Text style={{fontFamily: 'NHaasGroteskTXPro-75Bd', color: '#ffff44', fontSize: Dimensions.get('window').width/(414/40)}}>8</Text>
                </View>
                <Text style={{marginLeft: 10, fontFamily: 'NHaasGroteskTXPro-75Bd', color: '#ffff44', fontSize: Dimensions.get('window').width/(414/65), color: '#09D6CF'}}>{'+'+artifactPower}</Text>
            </View>

            <TouchableOpacity style={{flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: 5, justifyContent: 'center'}} onPress={() => {gearStats.current = gearTemp;equipmentArr.current = equipmentTemp;setMaxVisible(true)}}>
                <Text style={{fontFamily: 'NHaasGroteskTXPro-75Bd', color: '#ffffff', textAlign: 'center', paddingRight: 20, fontSize: Dimensions.get('window').width/(414/32)}}>Maximum{'\n'}Power:</Text>
                <Image style={{tintColor: '#ffff44'}} source={require('../Assets/power.png')} />
                <Text style={{fontFamily: 'NHaasGroteskTXPro-75Bd', color: '#ffff44', fontSize: Dimensions.get('window').width/(414/52)}}>{Math.floor(maxPower)}</Text>
                <View style={{flexDirection: 'column', paddingLeft: 10}}>
                    <Text style={{fontFamily: 'NHaasGroteskTXPro-75Bd', color: '#ffff44', fontSize: Dimensions.get('window').width/(414/32)}}>{(maxPower-Math.floor(maxPower))*8}</Text>
                    <View style={{backgroundColor: '#ffff44', width: 25, height: 5}}/>
                    <Text style={{fontFamily: 'NHaasGroteskTXPro-75Bd', color: '#ffff44', fontSize: Dimensions.get('window').width/(414/32)}}>8</Text>
                </View>
            </TouchableOpacity>

            <Modal animationType='slide' visible={postVisible} onRequestClosed={() => {setPostVisible(false)}}>
                <SafeAreaView style={{backgroundColor: '#1d1d1d', flex: 1}}>
                    <ScrollView scrollIndicatorInsets={{ right: 1 }}>
                        <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#7c2c94', borderRadius: 15, margin: 10}} onPress={() => {setPostVisible(false)}}>
                            <Text style={{fontFamily: 'NHaasGroteskTXPro-75Bd', color: '#ffffff', fontSize: 20, padding: 10}}>Close</Text>
                        </TouchableOpacity>
                        {postList}
                    </ScrollView>
                </SafeAreaView>
            </Modal>

            <Modal animationType='slide' visible={maxVisible} onRequestClosed={() => {setMaxVisible(false)}}>
                <SafeAreaView style={{backgroundColor: '#1d1d1d', flex: 1}}>
                    <ScrollView scrollIndicatorInsets={{ right: 1 }}>
                        <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#7c2c94', borderRadius: 15, margin: 10}} onPress={() => {

                            maxIds1 = maxItems.map((item) =>item[3])

                            SInfo.getItem('character_'+(props.num+1), {}).then((character) => {
                                SInfo.getItem('access_token', {}).then((access_token) => {
                                    SInfo.getItem('membership_type', {}).then((membership_type) => {
                                        fetch('https://www.bungie.net/platform/Destiny2/Actions/Items/EquipItems/', {
                                            method: 'POST',
                                            headers: {
                                                'X-API-Key': X_API_Key,
                                                'Authorization': ('Bearer '+access_token),
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify({
                                                'itemIds': maxIds1,
                                                'characterId': character,
                                                'membershipType': membership_type
                                            })
                                        }).then((response) => {
                                            return response.json()
                                        }).then((json) => {

                                            for(let i = 0; i < 8; i++){

                                                if(json.Response.equipResults[i].equipStatus == 1){

                                                    let thisItemSockets = props.character_data.itemComponents.sockets.data[maxItems[i][3]]?.sockets;

                                                    if(thisItemSockets){
                                                        for(let x = 0; x < thisItemSockets.length; x++){
                                                            if(thisItemSockets[x].plugHash){
                                                                
                                                                //Checks if the socket has the ornament type, if it is not a useless socket, and if its item type is not "Armor Mods: Glow Effects"
                                                                if(ORNAMENT_SUBTYPES.includes(props.DestinyInventoryItemLiteDefinition[thisItemSockets[x].plugHash].itemSubType) && !BAD_SOCKETS.includes(thisItemSockets[x].plugHash) && !props.DestinyInventoryItemLiteDefinition[thisItemSockets[x].plugHash].itemCategoryHashes.includes(1875601085)){
                                                                    equipmentArr.current[i][equipmentArr.current[i].findIndex((item) => item[3] == gearTemp[i][3])][4] = 'i'+props.num;
                                                                    equipmentArr.current[i][equipmentArr.current[i].findIndex((item) => item[3] == maxItems[i][3])][4] = 'e'+props.num;
                                                                    gearStats.current[i] = [maxItems[i][0], maxItems[i][1], props.DestinyInventoryItemLiteDefinition[thisItemSockets[x].plugHash].displayProperties.icon, maxItems[i][3], thisItemSockets[x].plugHash];
                                                                    
                                                                    break;
                                                                }
                                                                
                                                            }

                                                            if(x == thisItemSockets.length - 1){
                                                                equipmentArr.current[i][equipmentArr.current[i].findIndex((item) => item[3] == gearTemp[i][3])][4] = 'i'+props.num;
                                                                equipmentArr.current[i][equipmentArr.current[i].findIndex((item) => item[3] == maxItems[i][3])][4] = 'e'+props.num;
                                                                gearStats.current[i] = [maxItems[i][0], maxItems[i][1], props.DestinyInventoryItemLiteDefinition[maxItems[i][0]].displayProperties.icon, maxItems[i][3]];
                                                            }

                                                        }

                                                    }

                                                }
                                    
                                            }
                                            
                                            

                                            if(json.Response.equipResults.some((eq) => eq.equipStatus != 1)){
                                                Alert.alert("Error", "Not all items could be equipped. Make sure items are moved to this character's inventory")
                                            }else{
                                                Alert.alert('Success')
                                                setMaxVisible(false)
                                            }

                                        });
                                    })
                                })
                            })
                        }}>
                            <Text style={{fontFamily: 'NHaasGroteskTXPro-75Bd', color: '#ffffff', fontSize: 20, padding: 10}}>Equip All</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#7c2c94', borderRadius: 15, margin: 10}} onPress={() => {setMaxVisible(false)}}>
                            <Text style={{fontFamily: 'NHaasGroteskTXPro-75Bd', color: '#ffffff', fontSize: 20, padding: 10}}>Close</Text>
                        </TouchableOpacity>
                        {maxReturn}
                    </ScrollView>
                </SafeAreaView>
            </Modal>

            <DetailModal key={detailData} visible={detailVisible} setVisible={setDetailVisible} num={props.num} data={detailData} screen={screen.current} power={powerTotal} equipment={equipmentArr.current[index.current]} viewNew={(item) => {setDetails(item);screen.current = 'inventory';}} changeItem={(newItem, oldLocation, oldItem) => {gearStats.current = gearTemp;gearStats.current[index.current] = newItem;equipmentArr.current = equipmentTemp;equipmentArr.current[index.current][equipmentArr.current[index.current].findIndex((item) => item[3] == oldItem[3])][4] = oldLocation;equipmentArr.current[index.current][equipmentArr.current[index.current].findIndex((item) => item[3] == newItem[3])][4] = 'e'+props.num;setDetailVisible(false)}} character_data={props.character_data} DestinyInventoryItemLiteDefinition={props.DestinyInventoryItemLiteDefinition} BAD_SOCKETS={BAD_SOCKETS} ORNAMENT_SUBTYPES={ORNAMENT_SUBTYPES}/>

        </View>
        <Text style={{fontFamily: 'NeueHaasDisplay-ThinItalic', fontSize: 19, fontWeight: '600', padding: 10, color: '#ffffff', backgroundColor: '#1d1d1d'}}>Increase the level of any item by {8-(powerTotal-Math.floor(powerTotal))*8} to gain a power level.</Text>
        {postReturn}
        {inventoryReturn}
        <Text style={{fontFamily: 'NHaasGroteskTXPro-75Bd', color: '#FFFFFF', fontSize: 30, padding: 10, paddingTop: 40, backgroundColor: '#1d1d1d'}}>Pinnacle Gear:</Text>
        {pinnacleReturn}
        <Text style={{fontFamily: 'NHaasGroteskTXPro-75Bd', color: '#FFFFFF', fontSize: 30, padding: 10, paddingTop: 40, backgroundColor: '#1d1d1d'}}>+5 Powerful Gear (Tier 3):</Text>
        {tier3Return}
        <Text style={{fontFamily: 'NHaasGroteskTXPro-75Bd', color: '#FFFFFF', fontSize: 30, padding: 10, paddingTop: 40, backgroundColor: '#1d1d1d'}}>+4 Powerful Gear (Tier 2):</Text>
        {tier2Return}
        <Text style={{fontFamily: 'NHaasGroteskTXPro-75Bd', color: '#FFFFFF', fontSize: 30, padding: 10, paddingTop: 40, backgroundColor: '#1d1d1d'}}>+3 Powerful Gear (Tier 1):</Text>
        {tier1Return}
        <View style={{padding: 20, backgroundColor: '#1d1d1d'}}/>
        </>
    )
    
}
export default CharacterData;