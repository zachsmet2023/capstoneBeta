import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, Button, View, SafeAreaView,TouchableOpacity,PanResponder,Animated } from 'react-native';
import { useEffect, useState, useRef } from 'react';

import Voice from '@react-native-voice/voice';

import SenseCounter from '../components/senseCounter';


import { auth, db } from '../firebase';
import { collection,doc, getDoc, setDoc } from 'firebase/firestore';




const HomeScreen = ({navigation}) => {


  //---------Varibles-------------
  let [started, setStarted] = useState(false); // boolean for start and stop
  let [results, setResults] = useState(['Empty']);// all words spoken
  let [spokenWords, setSpokenWords] = useState([]); // spoken words that match a catword
  let [storedSpokenWords, setStoredSpokenWords] = useState([]); // words from db
  const translateY = useRef(new Animated.Value(0)).current;

  

  //----------Listeners------------ 
  useEffect(() => {
    fetchSpokenWords();
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    }
  }, []);

  /*
  Sends the word to the server imiditaly after 
  it is said so it can reflect everywhere
  */
  useEffect(() => {
    if (started) {
      
      sendSpokenWordsToServer();
    }
  }, [spokenWords]);


 
//-----------METHODS----------------




/*
Functions handle the slide up to start and stop 
*/

const panResponder = useRef(
  PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dy) > 10;
    },
    onPanResponderMove: Animated.event(
      [null, {dy: translateY}],
      {useNativeDriver: false},
    ),
    onPanResponderRelease: (evt, gestureState) => {
      if (
        Math.abs(gestureState.dx) < Math.abs(gestureState.dy) && // vertical swipe
        gestureState.dy < -50 // swipe distance exceeds threshold
      ) {
          startSpeechToText();
      
      }
      Animated.spring(translateY, {
        toValue: 0,
        tension: 40,
        friction: 5,
        useNativeDriver: false,
      }).start();
    },
    
    
    
  }),
).current;

const panResponderFalse = useRef(
  PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dy) > 10;
    },
    onPanResponderMove: Animated.event(
      [null, {dy: translateY}],
      {useNativeDriver: false},
    ),
    onPanResponderRelease: (evt, gestureState) => {
      if (
        Math.abs(gestureState.dx) < Math.abs(gestureState.dy) && // vertical swipe
        gestureState.dy < -50 // swipe distance exceeds threshold
      ) {
     
          stopSpeechToText();
          
      }
      Animated.spring(translateY, {
        toValue: 0,
        tension: 40,
        friction: 5,
        useNativeDriver: false,
      }).start();
    },
    
    
    
  }),
).current;


/* 
Code Adapted From React Native Voice Documentation
*/
//---------------------------------------------------
  const startSpeechToText = async () => {
    await Voice.start("en-US");
    setStarted(true);
    setResults(['Empty']);
    fetchSpokenWords();
  };

 
  const stopSpeechToText = async () => {
    await Voice.stop();
    setStarted(false);
    setResults(['Empty']);
    fetchSpokenWords();
  };

 
  const onSpeechResults = (result) => {
    setResults(result.value);

  };

  const onSpeechError = (error) => {
    console.log(error);
  };
//----------------------------------------------------


/* 
When count changes in senseCounter Comp this func will update the 
sense that is stored in the db
*/
  const handleCountChange = (newCount) => {
    console.log("INCOMING SCORE: ", newCount);
    sendSenseToServer(newCount);
  };

/* 
When a valid word is spoken the senseCounter comp will send it over here
and these words will be uploaded to the db
*/
  const handleSpokenWord = (newWord) => {
    
    setSpokenWords(prevSpokenWords => [...prevSpokenWords, newWord]);
   
  };
  
  /*
    Pulls and updates sense from the db
    will store min/max/total for Week, Month, Year
    Pull and update structure adapted from Firebase documentation
  */
    let sendSenseToServer = async (newCount) => {
      try {
        const senseRef = doc(collection(db, "sense"), auth.currentUser.uid);
        const docSnapshot = await getDoc(senseRef);
        const currentDate = new Date();
        const currentWeek = getWeekNumber(currentDate);
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();
    
        let currentSense = 0;
        let sensePerWeek = {};
        let sensePerMonth = {};
        let sensePerYear = {};
        let minMaxSensePerWeek = {};
        let minMaxSensePerMonth = {};
        let minMaxSensePerYear = {};

        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          currentSense = data.totalSense || 0;
          sensePerWeek = data.sensePerWeek || {};
          sensePerMonth = data.sensePerMonth || {};
          sensePerYear = data.sensePerYear || {};
          minMaxSensePerWeek = data.minMaxSensePerWeek || {};
          minMaxSensePerMonth = data.minMaxSensePerMonth || {};
          minMaxSensePerYear = data.minMaxSensePerYear || {};
        }
        
        const newSense = newCount;
        const totalSense = currentSense + newSense;
        sensePerWeek[currentWeek] = (sensePerWeek[currentWeek] || 0) + newSense;
        sensePerMonth[currentMonth] = (sensePerMonth[currentMonth] || 0) + newSense;
        sensePerYear[currentYear] = (sensePerYear[currentYear] || 0) + newSense;
    
        minMaxSensePerWeek[currentWeek] = updateMinMax(minMaxSensePerWeek[currentWeek] || {}, newSense);
        minMaxSensePerMonth[currentMonth] = updateMinMax(minMaxSensePerMonth[currentMonth] || {}, newSense);
        minMaxSensePerYear[currentYear] = updateMinMax(minMaxSensePerYear[currentYear] || {}, newSense);
    
        await setDoc(senseRef, { totalSense, sensePerWeek, sensePerMonth, sensePerYear, minMaxSensePerWeek, minMaxSensePerMonth, minMaxSensePerYear }, { merge: true });
        console.log("Sense value updated.");
        
      } catch (e) {
        console.error("Error updating sense value: ", e);
      }
    };
    
  /* 
  Update the min and max value object 
  */
    const updateMinMax = (minMax, value) => {
      const { min, max } = minMax;
      return {
        min: min === undefined ? value : Math.min(min, value),
        max: max === undefined ? value : Math.max(max, value),
      };
    };
    
  
  //Found Online GeeksForGeeks.com
  const getWeekNumber = (date) => {
    const onejan = new Date(date.getFullYear(), 0, 1);
    return Math.ceil((((date - onejan) / 86400000) + onejan.getDay() + 1) / 7);
  };
  

/* 
Pulls and updates spoken words from db
Pull and update structure adapted from Firebase documentation
*/
  const sendSpokenWordsToServer = async () => {
    try {
      const wordsRef = doc(collection(db, "spokenWords"), auth.currentUser.uid);
      const docSnapshot = await getDoc(wordsRef);

      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        const currentWords = data.words || [];
        const newWords = spokenWords;
        
      
        //The Cure to the double words
        let filteredNewWords = newWords.filter(word => !currentWords.includes(word));

        await setDoc(wordsRef, { words: [...currentWords, ...filteredNewWords] }, { merge: true });
        console.log("Spoken words updated.");
        setResults(['Empty']);
      } else {
        await setDoc(wordsRef, { words: spokenWords }, { merge: true });
        console.log("Spoken words created.");
      }
    } catch (e) {
      console.error("Error updating spoken words: ", e);
    }
  };

/* 
Fetches stored spoken words from db used in the senseCounter comp
for checking if word has been said already
*/
  const fetchSpokenWords = async () => {
    try {
      const wordsRef = doc(collection(db, "spokenWords"), auth.currentUser.uid);
      const docSnapshot = await getDoc(wordsRef);

      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        const fetchedWords = data.words || [];
        setStoredSpokenWords(fetchedWords);
        console.log("Spoken words fetched.");
      } else {
        console.log("No spoken words data found.");
      }
    } catch (e) {
      console.error("Error fetching spoken words: ", e);
    }
  };


  // ------------- MARKUP -------------------
  return (
    <SafeAreaView style={styles.container}>

    <View style={styles.headerContainer}> 
      <Text style={styles.headerText}>SpeakSence</Text>
    </View>

    <View style={styles.linkContainer}>

      <TouchableOpacity style={styles.button} onPress={() => navigation.push("Profile")}>
        <Text style={styles.linkText}>Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.push("Words")}>
        <Text style={styles.linkText}>Words</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.push("Leader")}>
        <Text style={styles.linkText}>Score</Text>
      </TouchableOpacity>
        
        
    </View>

    
    <View style={styles.counterContainer}>
    


    {started ? 
      <View style={styles.stopBtnContainer}>
      <SenseCounter  wordList={results} onCountChange={handleCountChange} 
      resetCount={started} onSpokenWord={handleSpokenWord} storedSpoken={storedSpokenWords}/>
     </View>
    : <View style={styles.startBtnContainer}></View>
      }

     </View>

      {!started ?  <Animated.View
          style={[
            styles.swiperContainer,
            { transform: [{ translateY: translateY }] },
          ]}
          {...panResponder.panHandlers} // attach panHandlers here
        >
          <Text style={styles.swiperText}>Swipe Up To Start</Text>
    </Animated.View>: <Animated.View
          style={[
            styles.swiperContainer,
            { transform: [{ translateY: translateY }] },
          ]}
          {...panResponderFalse.panHandlers} // attach panHandlers here
        >
          <Text style={styles.swiperText}>Swipe Up To Stop</Text>
    </Animated.View> }

    




      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

// ------------ STYLES ---------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#061024',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  headerContainer: {
    marginBottom: 90,
  },
  headerText: {
    paddingTop: 10,
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',

  },

  linkContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 70
  },
  button:{
    backgroundColor: '#55C89F',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  linkText: {
    color: '#fff'
  },
  startBtnContainer: {
    backgroundColor: '#55C89F',
    width: 200,
    height: 200,
    borderRadius: 200/2,
    alignItems: 'center',
    justifyContent: 'center',

  },
  stopBtnContainer: {
    backgroundColor: '#FF0000',
    width: 200,
    height: 200,
    borderRadius: 200/2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  counterContainer:{
    
    alignItems: 'center',
    padding: 20,
    width: '50%',
    height: '40%'
  },
  counter: {
    color: '#fff',
    fontSize: 20,
  },
  swiperContainer:{
    alignItems: 'center',
    backgroundColor:'#fff',
    width: '100%',
    height: '50%',
    borderRadius: 40,
    backgroundColor: '#141B30'
  },
  swiperText:{
    paddingTop: 10,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },

 
});

export default HomeScreen;