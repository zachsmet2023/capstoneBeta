import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,SafeAreaView } from 'react-native';
import words from '../assets/words/Words.json';
import { auth, db } from '../firebase';
import { collection,doc, getDoc, setDoc } from 'firebase/firestore';



// Gathers words from json file
const catOneWords = words.catONE;
const catTwoWords = words.catTWO;


const WordScreen = ({navigation}) => {

  //---------Varibles-------------
  
  let [storedSpokenWords, setStoredSpokenWords] = useState([]);
 
  //---------LISTENERS-------------
  useEffect(() => {
    fetchSpokenWords();

  }, []);
 //---------METHODS-------------
 /*
  fetches spoken words from server 
  fetch adapted from Firebase Documentation
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


 //---------MARKUP-------------
 return (
  <SafeAreaView style={styles.container}>

    <View style={styles.headerContainer}>
      <Text style={styles.header}>Word List</Text>
    </View>

    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.homeButton} onPress={() => navigation.pop()}>
        <Text style={styles.homeButtonText}>&larr;</Text>
      </TouchableOpacity>
    </View>

    <Text style={styles.catHeader}>Category: 1</Text>
    <View style={styles.catContainer}>
      {catOneWords.map((word, index) => (
        <View key={index} style={styles.word}>
          <Text
            style={[
              styles.title,
              storedSpokenWords.includes(word) && styles.strikethrough
            ]}
          >
            {word}
          </Text>
        </View>
      ))}
    </View>

    <Text style={styles.catHeader}>Category: 2</Text>
    <View style={styles.catContainer}>
      
      {catTwoWords.map((word, index) => (
        <View key={index} style={styles.word}>
          <Text
            style={[
              styles.title,
              storedSpokenWords.includes(word) && styles.strikethrough
            ]}
          >
            {word}
          </Text>
        </View>
      ))}
    </View>

   

  </SafeAreaView>
);

          }
 //---------Styles-------------
 const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#061024',
  },
  headerContainer: {
    marginBottom: 100,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
  },
  catHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  catContainer: {
    width: '90%',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 20,
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 80,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  word: {
    marginRight: 10,
    marginBottom: 5,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    textDecorationColor: 'black',
  },
  buttonContainer: {
    alignSelf: 'flex-start', // Add this line
    margin: 10, // Add this line
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
});


export default WordScreen;
