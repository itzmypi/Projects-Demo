import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    SmallText: {
        fontFamily: 'NHaasGroteskTXPro-55Rg',
        color: '#ffffff',
    },
    RegularText: {
        fontFamily: 'NHaasGroteskTXPro-65Md',
        color: '#ffffff',
        padding: 5,
        fontSize: 17
    },
    HeaderText: {
        fontFamily: 'NHaasGroteskTXPro-75Bd',
        color: '#ffffff',
        fontSize: 20,
        padding: 10
    },
    Screen: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1d1d1d'
    }
})

export { styles }