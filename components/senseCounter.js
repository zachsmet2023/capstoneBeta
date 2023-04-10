import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import words from '../assets/words/Words.json';



const catOneWords = words.catONE;
const catTwoWords = words.catTWO;

const SenseCounter = React.memo(({ wordList, onCountChange, resetCount,onSpokenWord,storedSpoken }) => {

  //---------Varibles-------------
  const [count, setCount] = useState(0);
  let [currentSpoken,setCurrentSpoken] = useState(['Empty']);

  


  //---------LISTENERS-------------
  useEffect(() => {
    
    let words = wordList[0].split(' ');
    const newCount = countWordsInList(words);
    if (newCount!=0){
    setCount((prevCount) => prevCount + newCount);
    onCountChange(newCount);
    }
    
   
  }, [wordList]);

  useEffect(() => {
    
    setCount(0);
      
    
  }, [resetCount]);

  //---------METHODS-------------
  const countWordsInList = useCallback((list) => {
    let count = 0;
    console.log("LIST O WORDS: ", list);
    list.forEach((word) => {
      let lowCaseWord = word.toLowerCase();
      if (catOneWords.includes(lowCaseWord) && !storedSpoken.includes(lowCaseWord) && !currentSpoken.includes(lowCaseWord)) {
        console.log("INCOMING WORD: ", word);
        onSpokenWord(lowCaseWord); // adds to list to be sent to server
        setCurrentSpoken(prevSpokenWords => [...prevSpokenWords, lowCaseWord]); // adds to local list to check against
        count++;
      }
      if (catTwoWords.includes(lowCaseWord) && !storedSpoken.includes(lowCaseWord)&& !currentSpoken.includes(lowCaseWord)) {
        onSpokenWord(lowCaseWord);
        setCurrentSpoken(prevSpokenWords => [...prevSpokenWords,lowCaseWord]);
        count += 2;
      }
      

    });

    
    return count;
  }, [onSpokenWord, storedSpoken, onCountChange]);
  




  
 //---------MARKUP-------------
  return (
    <View>
      <Text style={styles.counter}>{`Current Sense: ${count}`}</Text>
    </View>
  );
});
 //---------STYLES-------------
const styles = StyleSheet.create({
  counter: {
    color: '#fff',
    fontSize: 20,
  },
});

export default SenseCounter;
