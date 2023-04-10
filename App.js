import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignUpScreen from './screens/SignUpScreen';
import LoginScreen from './screens/LoginScreen'
import HomeScreen from './screens/HomeScreen'
import ProfileScreen from './screens/ProfileScreen';
import WordsScreen from './screens/WordsScreen'
import LeaderBoardScreen from './screens/LeaderBoardScreen';



const Stack = createNativeStackNavigator();



export default function App() {

  // ------------- MARKUP -------------------
  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} options={{headerShown:false}}/>
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{headerShown:false}}/>
        
        <Stack.Screen name="Home" component={HomeScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Profile" component={ProfileScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Words" component={WordsScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Leader" component={LeaderBoardScreen} options={{headerShown:false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ------------ STYLES ---------------

 
