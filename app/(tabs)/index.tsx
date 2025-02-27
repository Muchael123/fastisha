import Colors from '@/constants/Colors';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useState } from 'react';
import {  View, Text, Platform, TouchableOpacity } from 'react-native';


export default function Home(){
const [alarm, setAlarm] = useState(false);

  return (
  <View
style={{
  flex: 1,
  width: "100%",
  backgroundColor: alarm ? Colors.grey100 : Colors.white 
}}
>
<View
  style={{
    backgroundColor: alarm ? Colors.red400 : Colors.blue400,
    flex: 7,
    gap: 15,
    padding:4,
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? 50 : 0,
  }}
>
  <Text
    style={{
      fontWeight: "300",
      fontSize: 18,
      color: Colors.white,
    }}
  >
   Muchael123
  </Text>
  <Text
    style={{
      color: Colors.white,
      borderBottomWidth: 1,
      borderColor: Colors.white,
      borderStyle: "dashed",
      paddingBottom: 4,
      borderRadius: 1,
    }}
  >
    <Ionicons name="location" size={24} color={Colors.white} />
    Kakamega, Kenya
  </Text>
</View>
<View
  style={{
    backgroundColor: Colors.white,
    flex: 5,
  }}
></View>
<TouchableOpacity
  onPress={()=> setAlarm(prev => !prev)}
  style={{
    position: "absolute",
    padding: 10,
    top: "38%",
    left: 30,
    width: 300,
    height: 300,
    borderRadius: 150,
    borderColor: Colors.white,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  }}
>
  <View
    style={{
      backgroundColor: alarm ? Colors.red500 : Colors.grey300,
      width: "100%",
      borderColor: Colors.white,
      borderWidth: 10,
      height: "100%",
      borderRadius: 140,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <AntDesign name="Safety" size={80} color={Colors.white} />
    <Text
      style={{
        fontSize: 30,
        fontWeight: "bold",
        color: Colors.white,
      }}
    >
     {alarm ? "Cancel Call" : "Call Emergency"}
    </Text>
  </View>
</TouchableOpacity>
<Link href="/chat" asChild>
<TouchableOpacity style={{
  position: 'absolute',
  top: '80%',
  right: '10%',
  elevation: 5,
  backgroundColor: Colors.blue100,
  padding: 10,
  borderRadius: 5
}}>
  <Text>Can't Talk?</Text>
  <Text style={{
    fontWeight: 'bold'
  }}>Chat with Joe instead</Text>
</TouchableOpacity>
</Link>
</View>
);
}

