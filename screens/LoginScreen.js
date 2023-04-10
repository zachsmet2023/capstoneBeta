import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { useEffect, useState } from 'react';
import { signInWithEmailAndPassword,onAuthStateChanged } from "firebase/auth";
import {auth} from '../firebase'



export default function LoginScreen({ navigation, route }) {
  
   //---------Varibles-------------
let [ Email, setEmail] = useState("");
let [ password, setPassword] = useState("");
let [ errorMessage, setErrorMessage] = useState("");

    //---------Methods-------------

/*
  Adapted from Firebase Auth documentation
  If the user has signed in previously this will auto login 
*/
    if (auth.currentUser) { 
      navigation.navigate("Home");
    } else {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          navigation.navigate("Home");
        }
      });
    }

/*
  Adapted from Firebase Auth documentation
*/
let login = () =>{
  if (Email != "" && password != ""){
    signInWithEmailAndPassword(auth, Email, password)
      .then((userCredential) => {
        navigation.navigate("Home",{user: userCredential.user})
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  }

}




   //---------MARKUP-------------
  return (
    <View style={styles.container}>

        <View style={styles.menu}>
            <Text style={styles.menuheader}>Login</Text>
            <Text style={styles.errormessage}>{errorMessage}</Text>
            <TextInput style={styles.textinput} placeholder='Email' 
            placeholderTextColor='#BEBEBE'
             
            value={Email} 
            onChangeText={setEmail}/>

            <TextInput style={styles.textinput} placeholder='Password'
             placeholderTextColor='#BEBEBE' 
             secureTextEntry={true} 
             value={password} 
             onChangeText={setPassword}/>
            <Button title='Continue' color='#fff' onPress={login}/>
        </View>
        <Button title='Register Here' onPress={() => navigation.push("SignUp")}/>
    </View>
  );
}


 //---------STYLES-------------
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#061024',
        alignItems: 'center',
        justifyContent: 'center',
      },
    menu: {
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundcolor: '#fff',
        padding: 40,
        

        },
    menuheader: {
        color: '#fff',
        fontSize: 40,

  },
  textinput: {
        color: '#BEBEBE',
        alignSelf: 'stretch',
        padding: 10,
        borderBottomColor: '#55C89F',
        borderBottomWidth: 1
  },
  errormessage: {
    color: 'red',
    fontSize: 20
  },
});