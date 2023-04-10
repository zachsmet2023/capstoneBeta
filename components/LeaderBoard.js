import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {db} from '../firebase';
import {
  collection,
  query,
  orderBy,
  getDocs,
  limit
} from 'firebase/firestore';

const LeaderBoard = () => {


  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        const q = query(
          collection(db, 'sense'),
          orderBy('totalSense', 'desc'),
          limit(5)
        );
        const querySnapshot = await getDocs(q);

        const topUsers = querySnapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        });

        setUsers(topUsers);
      } catch (error) {
        console.error('Error fetching top users:', error);
      }
    };

    fetchTopUsers();
  }, []);

  const renderItem = ({item, index}) => {
    return (
      <View style={styles.itemContainer}>

        <View style={styles.rankCircle}>
          <Text style={styles.rank}>{index + 1}</Text>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.totalSense}>{item.totalSense}</Text>
        </View>

      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingTop: 10,
    paddingHorizontal: 10,
    backgroundColor: '#061024',
    
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#55C89F',
    borderRadius: 10,
    marginBottom: 10,
   
  },
  rankCircle: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  rank: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  detailsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  
  totalSense: {
    fontSize: 40,
    color: '#000000',
    fontWeight: 'bold',
  },
});


export default LeaderBoard;
