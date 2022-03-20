import React from 'react';
import { styles } from './Styles'
import { View, Text, RefreshControl, ActivityIndicator, SafeAreaView, ScrollView, Image, Alert, TouchableOpacity, StyleSheet} from 'react-native';
import SInfo from 'react-native-sensitive-info'
import moment from 'moment'
import {X_API_Key} from "@env"
import AsyncStorage from '@react-native-async-storage/async-storage';

//returns a row containing all the data for that specific sale
const SalesRow  = (props) => {

    //gathers data to display in the row
    if(props.names != null){

        var mod = false;
        if(props.vendor == 'banshee'  && props.names[0][props.index]){

            var saletemp = props.names[0][props.index]
            var pricetemp = props.names[1][props.index]
            try {
                var priceamount = props.character_data.profileInventory.data.items.find(item=>item.itemHash == props.hashes[1][props.index]).quantity
            } catch {
                var priceamount = 0
            }
            var saleImage = props.DestinyInventoryItemLiteDefinition[props.hashes[0][props.index]].displayProperties.icon
            var priceImage = props.DestinyInventoryItemLiteDefinition[props.hashes[1][props.index]].displayProperties.icon

            //if spider's sale items contains the 1st or 2nd word in banshee's price item, highlight the row
            if(!props.names[2].includes(undefined) && (props.names[2].some(item => item.includes(pricetemp.split(' ')[0])) || props.names[2].some(item => item.includes(pricetemp.split(' ')[1])))){
                var color = '#D91A1A'
            }else {
                var color = '#FFFFFF'
            }
            
            //formatting options specific to mods
            if(props.index === 0 || props.index === 1){
                mod = true;
                if(props.character_data.profileCollectibles.data.collectibles[props.DestinyInventoryItemLiteDefinition[props.hashes[0][props.index]].collectibleHash.toString()].state === 64){
                    owned = '(owned)'
                }else{
                    owned = '(NOT OWNED)'
                }
                var modDescription = '';
                for(let i = 0; i < props.DestinyInventoryItemLiteDefinition[props.hashes[0][props.index]].perks.length; i++){
                    AsyncStorage.getItem('DestinySandboxPerkDefinition').then((DestinySandboxPerkDefinition) => {
                        DestinySandboxPerkDefinition = JSON.parse(DestinySandboxPerkDefinition)
                        if(DestinySandboxPerkDefinition[props.DestinyInventoryItemLiteDefinition[props.hashes[0][props.index]].perks[i].perkHash].displayProperties.description){
                            if(modDescription == ''){
                                modDescription += DestinySandboxPerkDefinition[props.DestinyInventoryItemLiteDefinition[props.hashes[0][props.index]].perks[i].perkHash].displayProperties.description
                            }else{
                                modDescription += ('\n\n'+DestinySandboxPerkDefinition[props.DestinyInventoryItemLiteDefinition[props.hashes[0][props.index]].perks[i].perkHash].displayProperties.description)
                            }
                        }
                    });
                }
                
            }

        }
        else if(props.vendor == 'ada'  && props.names[0][props.index]){

            var saletemp = props.names[4][props.index]
            var pricetemp = props.names[5][props.index]
            try {
                var priceamount = props.character_data.profileInventory.data.items.find(item=>item.itemHash == props.hashes[5][props.index]).quantity
            } catch {
                var priceamount = 0
            }
            var saleImage = props.DestinyInventoryItemLiteDefinition[props.hashes[4][props.index]].displayProperties.icon
            var priceImage = props.DestinyInventoryItemLiteDefinition[props.hashes[5][props.index]].displayProperties.icon

            //if spider's sale items contains the 1st or 2nd word in ada's price item, highlight the row
            if(!props.names[2].includes(undefined) && (props.names[2].some(item => item.includes(pricetemp.split(' ')[0])) || props.names[2].some(item => item.includes(pricetemp.split(' ')[1])))){
                var color = '#D91A1A'
            }else {
                var color = '#FFFFFF'
            }
            
            //formatting options specific to mods
            if(props.index === 0 || props.index === 1){
                mod = true;
                if(props.character_data.profileCollectibles.data.collectibles[props.DestinyInventoryItemLiteDefinition[props.hashes[4][props.index]].collectibleHash.toString()].state === 64){
                    owned = '(owned)'
                }else{
                    owned = '(NOT OWNED)'
                }
                var modDescription = '';
                for(let i = 0; i < props.DestinyInventoryItemLiteDefinition[props.hashes[4][props.index]].perks.length; i++){
                    AsyncStorage.getItem('DestinySandboxPerkDefinition').then((DestinySandboxPerkDefinition) => {
                        DestinySandboxPerkDefinition = JSON.parse(DestinySandboxPerkDefinition)
                        if(DestinySandboxPerkDefinition[props.DestinyInventoryItemLiteDefinition[props.hashes[4][props.index]].perks[i].perkHash].displayProperties.description){
                            if(modDescription == ''){
                                modDescription += DestinySandboxPerkDefinition[props.DestinyInventoryItemLiteDefinition[props.hashes[4][props.index]].perks[i].perkHash].displayProperties.description
                            }else{
                                modDescription += ('\n\n'+DestinySandboxPerkDefinition[props.DestinyInventoryItemLiteDefinition[props.hashes[4][props.index]].perks[i].perkHash].displayProperties.description)
                            }
                        }
                    });
                }
                
            }

        }
        else if(props.vendor == 'spider' && props.names[2][props.index]){

            var saletemp = props.names[2][props.index]
            var pricetemp = props.names[3][props.index]
            var saleImage = props.DestinyInventoryItemLiteDefinition[props.hashes[2][props.index]].displayProperties.icon
            var priceImage = props.DestinyInventoryItemLiteDefinition[props.hashes[3][props.index]].displayProperties.icon

            //some price items are inventory items (planetary materials) or currencies (glimmer)
            try {
                var priceamount = props.character_data.profileInventory.data.items.find(item=>item.itemHash == props.hashes[3][props.index]).quantity
            } catch {
                try {
                    var priceamount = props.character_data.profileCurrencies.data.items.find(item=>item.itemHash == props.hashes[3][props.index]).quantity
                } catch {
                    var priceamount = 0;
                }
            }

            //if banshee's price items contains the 1st or 2nd word in spider's sale item, highlight the row
            if(!props.names[1].includes(undefined) && (props.names[1].some(item => item.includes(saletemp.split(' ')[1])) || props.names[1].some(item => item.includes(saletemp.split(' ')[2])))){
                var color = '#3131FF'
            }else {
                var color = '#FFFFFF'
            }
        }else{
            return(null)
        }
    }else{
        return(null)
    }
    const s = StyleSheet.create({
        saleItem: {
            fontFamily: 'NHaasGroteskTXPro-75Bd',
            fontSize: 20,
            padding: 10,
            color: color,
            flex: 1,
            flexWrap: 'wrap'
        },
        priceItem: {
            fontFamily: 'NHaasGroteskTXPro-65Md',
            color: color,
            padding: 5,
            fontSize: 17
        }
    })
    if(mod){
        return(
            <>
            <TouchableOpacity onPress={() => {Alert.alert(saletemp, modDescription)}}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: 10}}>
            <Image source={{uri: 'https://www.bungie.net'+saleImage}} style={{width: 50, height: 50, borderRadius: 10}}/>
            <Text style={s.saleItem}>{saletemp} {owned}</Text>
            </View>
            <View style={{flex: 1, flexDirection: 'row-reverse', paddingBottom: 20, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={s.priceItem}>{pricetemp} ({priceamount})</Text>
            <Image source={{uri: 'https://www.bungie.net'+priceImage}} style={{width: 25, height: 25, borderRadius: 5}}/>
            </View>
            </TouchableOpacity>
            </>
        );
    }else{
        return(
            <>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: 10}}>
            <Image source={{uri: 'https://www.bungie.net'+saleImage}} style={{width: 50, height: 50, borderRadius: 10}}/>
            <Text style={s.saleItem}>{saletemp}</Text>
            </View>
            <View style={{flex: 1, flexDirection: 'row-reverse', paddingBottom: 20, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={s.priceItem}>{pricetemp} ({priceamount})</Text>
            <Image source={{uri: 'https://www.bungie.net'+priceImage}} style={{width: 25, height: 25, borderRadius: 5}}/>
            </View>
            </>
        );
    }

}

function Vendors ({route}) {

    const [refreshing, setRefreshing] = React.useState(false);
    const [hashesAndNames, setHN] = React.useState(null);
    const DestinyInventoryItemLiteDefinition = React.useRef({});

    //uses the available vendor data to populate hashesAndNames
    function loadVendorData () {

        SInfo.getItem('banshee_sales', {}).then((banshee_sales) => {
            SInfo.getItem('spider_sales', {}).then((spider_sales) => {
                SInfo.getItem('ada_sales', {}).then((ada_sales) => {
                
                    if(banshee_sales){
                        banshee_sales = JSON.parse(banshee_sales);
                    }

                    if(spider_sales){
                        spider_sales = JSON.parse(spider_sales);
                    }

                    if(ada_sales){
                        ada_sales = JSON.parse(ada_sales);
                    }

                    var bansheeSoldArr = [];
                    var bansheePriceArr = [];
                    var adaSoldArr = [];
                    var adaPriceArr = [];
                    var spiderSoldArr = [];
                    var spiderPriceArr = [];

                    for(var x in banshee_sales?.sales.data){

                        if(!banshee_sales.sales.data[x.toString()].costs.length){
                            continue;
                        }

                        if(banshee_sales.sales.data[x.toString()].costs[0].itemHash == 4046539562){
                            bansheeSoldArr.push(banshee_sales.sales.data[x.toString()].itemHash)
                            bansheePriceArr.push(4046539562) // mod components
                        }
                        else if(banshee_sales.sales.data[x.toString()].costs.length > 1){
                            for(i = 0; i < banshee_sales.sales.data[x.toString()].costs.length; i++){

                                if(banshee_sales.sales.data[x.toString()].costs[i].quantity == 100 || banshee_sales.sales.data[x.toString()].costs[i].quantity == 25){
                                    bansheeSoldArr.push(banshee_sales.sales.data[x.toString()].itemHash)
                                    bansheePriceArr.push(banshee_sales.sales.data[x.toString()].costs[i].itemHash)
                                }

                            }
                        }

                    }

                    for(var x in ada_sales?.sales.data){

                        if(!ada_sales.sales.data[x.toString()].costs.length){
                            continue;
                        }

                        if(ada_sales.sales.data[x.toString()].costs[0].itemHash == 4046539562){
                            adaSoldArr.push(ada_sales.sales.data[x.toString()].itemHash)
                            adaPriceArr.push(4046539562)
                        }
                        else if(ada_sales.sales.data[x.toString()].costs.length > 1){
                            for(i = 0; i < ada_sales.sales.data[x.toString()].costs.length; i++){

                                if(ada_sales.sales.data[x.toString()].costs[i].quantity == 100){
                                    adaSoldArr.push(ada_sales.sales.data[x.toString()].itemHash)
                                    adaPriceArr.push(ada_sales.sales.data[x.toString()].costs[i].itemHash)
                                }else if(ada_sales.sales.data[x.toString()].costs[i].quantity == 5000 || ada_sales.sales.data[x.toString()].costs[i].quantity == 10000){
                                    adaSoldArr.push(ada_sales.sales.data[x.toString()].itemHash)
                                    adaPriceArr.push(ada_sales.sales.data[x.toString()].costs[ada_sales.sales.data[x.toString()].costs.findIndex((costItem) => costItem.quantity == 25)].itemHash)
                                }

                            }
                        }
                        
                    }

                    for(var x in spider_sales?.sales.data){
                        
                        if(!spider_sales.sales.data[x.toString()].costs.length){
                            continue;
                        }

                        if(spider_sales.sales.data[x.toString()].costs[0].quantity != 250 && spider_sales.sales.data[x.toString()].costs[0].itemHash != 4114204995){
                            spiderSoldArr.push(spider_sales.sales.data[x.toString()].itemHash)
                            spiderPriceArr.push(spider_sales.sales.data[x.toString()].costs[0].itemHash)
                        }

                    }

                    var hashes = [bansheeSoldArr, bansheePriceArr, spiderSoldArr, spiderPriceArr, adaSoldArr, adaPriceArr]
                    var completeNames = [ [], [], [], [], [], []]
                    for(i = 0; i < 6; i++){
                        for(z = 0; z < hashes[i].length; z++){
                            completeNames[i].push(DestinyInventoryItemLiteDefinition.current[hashes[i][z]]?.displayProperties.name)
                        }
                    }

                    setHN([hashes, completeNames])

                });
            });
        });

    }
    
    //initially fills hashesAndNames
    if(!hashesAndNames){

        SInfo.getItem('character_data', {}).then((characterjson) => {
            AsyncStorage.getItem('chunk_count').then((chunk_count)=>{
            
                for(let i = 0; i < parseInt(chunk_count, 10); i ++){
                    AsyncStorage.getItem('chunk_'+i).then((this_chunk) => {
                        Object.assign(DestinyInventoryItemLiteDefinition.current, Object.fromEntries(JSON.parse(this_chunk)))
            
                        if(i == parseInt(chunk_count, 10) -1){
                            character_data = JSON.parse(characterjson)
                            loadVendorData();
                        }
                    })
                }
            })
        });
    }
       

    const onRefresh = () => {
        
        setRefreshing(true)

        fetchCounter = 0;
        vendorCounter = 0;
        function checkFetches(setTimestamp){

            if(setTimestamp && vendorCounter == 2){
                SInfo.deleteItem('vendor_data_timestamp', {})
                SInfo.setItem('vendor_data_timestamp', moment.utc().format(), {})
            }else if(setTimestamp){
                vendorCounter++;
            }

            if(fetchCounter == 3){
                setRefreshing(false)
                loadVendorData();
            }else{
                fetchCounter++;
            }
        }

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

                                    if(json.Response){
                                        SInfo.deleteItem('spider_sales', {})
                                        SInfo.setItem('spider_sales', JSON.stringify(json.Response), {}).then(() =>{
                                            checkFetches(true);
                                        });
                                    }else if(ind != 2){
                                        spiderRequest(ind+1)
                                    }else{
                                        Alert.alert('Error', 'None of your characters have access to Spider.')
                                        SInfo.deleteItem('spider_sales', {}).then(()=>{
                                            checkFetches(false);
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

                                    if(json2.Response){
                                        SInfo.deleteItem('banshee_sales', {})
                                        SInfo.setItem('banshee_sales', JSON.stringify(json2.Response), {}).then(() =>{           
                                            checkFetches(true);
                                        });
                                    }else if(ind2 != 2){
                                        bansheeRequest(ind2+1)
                                    }else{
                                        Alert.alert('Error', 'None of your characters have access to Banshee.')
                                        SInfo.deleteItem('banshee_sales', {}).then(()=>{
                                            checkFetches(false);
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

                                    if(json3.Response){
                                        SInfo.deleteItem('ada_sales', {})
                                        SInfo.setItem('ada_sales', JSON.stringify(json3.Response), {}).then(() =>{           
                                            checkFetches(true);
                                        });
                                    }else if(ind3 != 2){
                                        adaRequest(ind3+1)
                                    }else{
                                        Alert.alert('Error', 'None of your characters have access to Ada.')
                                        SInfo.deleteItem('ada_sales', {}).then(()=>{
                                            checkFetches(false);
                                        });
                                    }

                                });
                        });
                    }

                    spiderRequest(0)
                    bansheeRequest(0)
                    adaRequest(0)

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
                            checkFetches(false)

                        });
            
                    });

                });
            });
          });

    }

    if(!hashesAndNames){

        return(
        <View style={styles.Screen}>
            <ActivityIndicator size='large' color='#09D7D0'/>
        </View>
        
        );
    }
    else{

        bansheeReturn = hashesAndNames[0][0].map((sale, index) => {
            return(<SalesRow key={'banshee'+index} vendor={'banshee'} index={index} hashes={hashesAndNames[0]} names={hashesAndNames[1]} DestinyInventoryItemLiteDefinition={DestinyInventoryItemLiteDefinition.current} character_data={character_data}/>)
        })
        adaReturn = hashesAndNames[0][4].map((sale, index) => {
            return(<SalesRow key={'ada'+index} vendor={'ada'} index={index} hashes={hashesAndNames[0]} names={hashesAndNames[1]} DestinyInventoryItemLiteDefinition={DestinyInventoryItemLiteDefinition.current} character_data={character_data}/>)
        })
        spiderReturn = hashesAndNames[0][2].map((sale, index) => {
            return(<SalesRow key={'spider'+index} vendor={'spider'} index={index} hashes={hashesAndNames[0]} names={hashesAndNames[1]} DestinyInventoryItemLiteDefinition={DestinyInventoryItemLiteDefinition.current} character_data={character_data}/>)
        })

        return (
        
            <ScrollView style={{backgroundColor: '#1d1d1d'}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={'#FFFFFF'} />} scrollIndicatorInsets={{ right: 1 }}>
                <SafeAreaView style={{flex: 1, padding: 20, marginTop: 20}}>
                
                <View style={{paddingBottom: 20, paddingTop: 20, paddingLeft: 20, flex: 1, justifyContent: 'flex-start'}}>
                    <TouchableOpacity onPress={() => {Alert.alert('Banshee-44', 'Items sold by Banshee-44 will be highlighted in red if Spider is selling an item it can be purchased for.')}} style={{flex: 1, alignItems: 'center', paddingBottom: 10, justifyContent: 'flex-start', flexDirection: 'row'}}>
                        <Text style={{alignItems: 'center', fontFamily: 'NHaasGroteskTXPro-75Bd', color: '#FFFFFF', fontSize: 30, paddingRight: 10}}>Banshee-44</Text>
                        <Image source={require('../Assets/info-24-red.png')} style={{alignItems: 'center', width: 20, height: 20}} />
                    </TouchableOpacity >
                    <Text style={{fontFamily: 'NeueHaasDisplay-ThinItalic', fontSize: 18, fontWeight: '600', color: '#FFFF', paddingRight: 10}}>Banshee-44 has lived many lives. As master weaponsmith for the Tower, he supplies Guardians with only the best.</Text>
                </View>
                
                {bansheeReturn}

                <View style={{paddingBottom: 20, paddingTop: 20, paddingLeft: 20, flex: 1, justifyContent: 'flex-start'}}>
                    <TouchableOpacity onPress={() => {Alert.alert('Ada-1', 'Items sold by Ada-1 will be highlighted in red if Spider is selling an item it can be purchased for.')}} style={{flex: 1, alignItems: 'center', paddingBottom: 10, justifyContent: 'flex-start', flexDirection: 'row'}}>
                        <Text style={{alignItems: 'center', fontFamily: 'NHaasGroteskTXPro-75Bd', color: '#FFFFFF', fontSize: 30, paddingRight: 10}}>Ada-1</Text>
                        <Image source={require('../Assets/info-24-red.png')} style={{alignItems: 'center', width: 20, height: 20}} />
                    </TouchableOpacity >
                    <Text style={{fontFamily: 'NeueHaasDisplay-ThinItalic', fontSize: 18, fontWeight: '600', color: '#FFFF', paddingRight: 10}}>Advanced Prototype Exo and warden of the Black Armory.</Text>
                </View>
                
                {adaReturn}

                <View style={{paddingBottom: 20, paddingTop: 10, paddingLeft: 20, flex: 1, justifyContent: 'flex-start'}}>
                    <TouchableOpacity onPress={() => {Alert.alert('Spider', 'Items sold by Spider will be highlighted in blue if Banshee-44 or Ada-1 are selling an item that can be purchased for it.')}} style={{flex: 1, alignItems: 'center', paddingBottom: 10, justifyContent: 'flex-start', flexDirection: 'row'}}>
                        <Text style={{alignItems: 'center', fontFamily: 'NHaasGroteskTXPro-75Bd', color: '#FFFFFF', fontSize: 30, paddingRight: 10}}>Spider</Text>
                        <Image source={require('../Assets/info-24-blue.png')} style={{alignItems: 'center', width: 20, height: 20}} />
                    </TouchableOpacity >
                    <Text style={{fontFamily: 'NeueHaasDisplay-ThinItalic', fontSize: 18, fontWeight: '600', color: '#FFFFFF', paddingRight: 10}}>Unlike his Fallen brethren, the clever Spider prefers to negotiate instead of fight.</Text>
                </View>
                
                {spiderReturn}

                </SafeAreaView>
                
            </ScrollView>

        );
    }
}
export default Vendors;