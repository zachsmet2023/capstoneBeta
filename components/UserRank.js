import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {db, auth} from '../firebase';
import {
  collection,
  query,
  orderBy,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';

const UserRank = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [rank, setRank] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'sense', auth.currentUser.uid));
        setCurrentUser({
          id: userDoc.id,
          ...userDoc.data(),
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchUserRank = async () => {
      try {
        const q = query(
          collection(db, 'sense'),
          orderBy('totalSense', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const users = querySnapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        });

        const userRank = users.findIndex(
          (user) => user.id === auth.currentUser.uid
        ) + 1;

        setRank(userRank);
      } catch (error) {
        console.error('Error fetching user rank:', error);
      }
    };

    fetchUserData();
    fetchUserRank();
  }, []);

  if (!currentUser) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>

      

      <View style={styles.row}>

        <View style={styles.rankContainer}>
          <Text style={styles.rankText}>{rank}</Text>
        </View>

        <View style={styles.totalSenseContainer}>
          <Text style={styles.totalSenseText}>
            {currentUser.totalSense}
          </Text>
        </View>

      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#061024',
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#55C89F',
    borderRadius: 10,
    marginBottom: 10,
  },
  rankContainer: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  totalSenseContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  totalSenseText: {
    fontSize: 40,
    color: '#000000',
    fontWeight: 'bold',
  },
});

export default UserRank;
