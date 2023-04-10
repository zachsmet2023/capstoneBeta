import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, SafeAreaView} from 'react-native';
import Leaderboard from '../components/LeaderBoard';
import UserRank from '../components/UserRank';


const LeaderBoardScreen = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.headerContianer}>
        <Text style={styles.headerText}>LeaderBoard</Text>
      </View>

      <View style={styles.lbContainer}>
        <Leaderboard />
      </View>

      <View style={styles.rankContainer}>
        <Text style={styles.rankHeader}>Personal</Text>
       <UserRank />
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
    backgroundColor: '#061024',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  headerContianer: {
    alignItems: 'center',
    paddingVertical: 15,

  
  },
  headerText: {
    paddingTop: 10,
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
  },
  lbContainer:{
    width: '80%',
    height: '60%',
    
  },
  rankContainer:{
    width: '80%',
    height: '20%',
    alignItems: 'center'
  },
  rankHeader:{
    padding: 10,
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
  },

  homeButtonContainer: {
    alignSelf: 'center', // Add this line
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

export default LeaderBoardScreen;
