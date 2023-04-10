import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,SafeAreaView } from 'react-native';
import { collection,doc, getDoc} from 'firebase/firestore';
import { signOut } from "firebase/auth";
import { auth,db } from '../firebase';



const ProfileScreen = ({navigation}) => {

   //---------Varibles-------------
   const [data, setData] = useState(null);
   const [total, setTotal] = useState();
   const [selectedButton, setSelectedButton] = useState(null);

   
 //---------LISTENERS-------------
   useEffect(() => {
    fetchTotal();
    
  });



 //---------METHODS-------------

 /*
  Fetch totalsense from db
  fetch code adapted from Firebase Documentation
 */
    const fetchTotal = async () => {
      try{
        const senseRef = doc(collection(db, "sense"), auth.currentUser.uid);
        const docSnapshot = await getDoc(senseRef);
        if (docSnapshot.exists()) {
            const fetchedTotal = docSnapshot.data()['totalSense']||0;

            setTotal(fetchedTotal);
        }
        else{
            setTotal(0);
        }
      }catch(e){
        console.error("Error fetching data: ", e);
      }
    }

 /*
  takes in a period of time (Week, Month, or Year)
  will return the appropriate data from db
  fetch code adapted from Firebase Documentation
 */
   const fetchData = async (period) => {
     try {
       const senseRef = doc(collection(db, "sense"), auth.currentUser.uid);
       const docSnapshot = await getDoc(senseRef);
       const currentDate = new Date();
       const currentWeek = getWeekNumber(currentDate);
       const currentMonth = currentDate.getMonth() + 1;
       const currentYear = currentDate.getFullYear();

        if (docSnapshot.exists()) {
         let periodKey;
         if (period === 'Week') {
           periodKey = currentWeek;
         } else if (period === 'Month') {
           periodKey = currentMonth;
         } else {
           periodKey = currentYear;
         }
         const fetchedData = docSnapshot.data()[`sensePer${period}`][periodKey] || 0;
         const minMaxData = docSnapshot.data()[`minMaxSensePer${period}`][periodKey] || { min: 0, max: 0 };
         setData({ sense: fetchedData, minMax: minMaxData });
         
       } else {
         setData(null);
       }
     } catch (e) {
       console.error("Error fetching data: ", e);
     }
   };

 /*
  From geeksforgeeks.com
 */
   const getWeekNumber = (date) => {
       const onejan = new Date(date.getFullYear(), 0, 1);
       return Math.ceil((((date - onejan) / 86400000) + onejan.getDay() + 1) / 7);
     };

  /*
     Adapted from Firebase Auth Documentation
 */
     let logOut = () =>{
      signOut(auth).then(() => {
        navigation.popToTop();
      }).catch((error) => {
        // An error happened.
      });
    }
    
    const handleButtonClick = (button) => {
      fetchData(button);
      setSelectedButton(button);
    };
  
    const getButtonBackgroundColor = (button) => {
      return selectedButton === button ? '#55C89F' : '#fff';
    };

/*
<TouchableOpacity style={styles.logoutButton} onPress={logOut}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
*/

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Profile</Text>
        </View>

        
       
        <Text style={styles.totalHeaderText}>Total Sense</Text>
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>{total}</Text>
        </View>
    


        <View style={styles.statContainer}>
          <View style={styles.dataSpacer}>
          {data && (
            <View style={styles.dataContainer}>
              <Text style={styles.dataText}>Sense: {data.sense}</Text>
              <Text style={styles.dataText}>Min: {data.minMax.min}</Text>
              <Text style={styles.dataText}>Max: {data.minMax.max}</Text>
            </View>
          )}
           {!data && (
            <View style={styles.dataContainer}>
              <Text style={styles.dataText}>Sense: </Text>
              <Text style={styles.dataText}>Min: </Text>
              <Text style={styles.dataText}>Max: </Text>
            </View>
          )}
          </View>
          <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: getButtonBackgroundColor('Week') }]}
            onPress={() => handleButtonClick('Week')}
          >
            <Text style={styles.buttonText}>Week</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: getButtonBackgroundColor('Month') }]}
            onPress={() => handleButtonClick('Month')}
          >
            <Text style={styles.buttonText}>Month</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: getButtonBackgroundColor('Year') }]}
            onPress={() => handleButtonClick('Year')}
          >
            <Text style={styles.buttonText}>Year</Text>
          </TouchableOpacity>
      </View>
        </View>
    
        

    

        <View style={styles.homeButtonContainer}>
        <TouchableOpacity style={styles.homeButton} onPress={() => navigation.pop()}>
          <Text style={styles.homeButtonText}>Home</Text>
        </TouchableOpacity>
        </View>

        

        


      </SafeAreaView>
    );
    
 };
 const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 10,
    paddingHorizontal: 10,
    backgroundColor: '#061024',
  },
  headerContainer: {
    marginBottom: 60,
  },
  header: {
    paddingTop: 10,
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
  },
  homeButtonContainer: {
    alignSelf: 'center', 
    margin: 10, 

  },
  homeButton: {
    backgroundColor: '#55C89F',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalHeaderText:{
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  totalContainer:{
    backgroundColor: '#55C89F',
    width: 150,
    height: 150,
    borderRadius: 150/2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 70,
  },
  totalText: {
    fontSize: 20,
    marginBottom: 5,
    color: '#fff',
    fontWeight: 'bold',
  },
  statContainer:{
    marginTop: 20,
    width: '100%',
    height: '40%',
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  dataText: {
    fontSize: 18,
    marginBottom: 5,
    color: '#000000',
    fontWeight: 'bold',
  },
  dataContainer: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
   
    
  },
  dataSpacer:{
    paddingTop: 40,
    paddingBottom:125,

  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '65%',
    height: '15%',
    backgroundColor: '#061024',
    borderRadius: 10
  },
  button: {
    backgroundColor: '#1E90FF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    margin: 5,
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
 
  logoutButton: {
    backgroundColor: '#ff4d4d',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 50,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

 


export default ProfileScreen;



