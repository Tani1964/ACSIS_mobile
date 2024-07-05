import { View, Text, StyleSheet } from 'react-native'
import {useState} from 'react'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import { Link } from 'expo-router'

const header:any = () => {
    const [openSearch, setOpenSearch] = useState(false)
  return (
    
    <View style={styles.header}>
      <View>
        <Link href="user/notifications">
        <Ionicons name="settings-outline" size={25} color="grey"/></Link></View>
      <View style={styles.rightIcons}>
        {/* <View><AntDesign name="search1" size={25} color="grey"/></View> */}
        <View><Ionicons name="person-circle-sharp" size={37} color="lightgrey"/></View>
      </View>
    </View>
   
  )
}

const styles = StyleSheet.create({
    
    header:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        width: '100%',
        backgroundColor: 'white',
    },
    rightIcons:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 20,
    },
    
})

export default header