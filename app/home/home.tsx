import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, List, ListItem, Layout, Button } from '@ui-kitten/components'; // Ajout du Button
import { Pedometer } from 'expo-sensors';
import { supabase } from '@/lib/supabase';
import { User } from '../../constants/User';
import { FunctionsFetchError, FunctionsHttpError, FunctionsRelayError } from '@supabase/supabase-js';

interface Friend {
  id: string;
  nom: string;
  steps: number;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState<string>('checking');
  const [pastStepCount, setPastStepCount] = useState<number>(0);
  const [currentStepCount, setCurrentStepCount] = useState<number>(0);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error);
      } else {
        setUser(user as User | null);
      }
    };

    const subscribe = () => {
      Pedometer.isAvailableAsync().then(
        (result) => {
          setIsPedometerAvailable(String(result));
        },
        (error) => {
          setIsPedometerAvailable('Could not get isPedometerAvailable: ' + error);
        }
      );

      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 1);

      const subscription = Pedometer.watchStepCount((result) => {
        setCurrentStepCount(result.steps);
      });

      return () => subscription.remove();
    };

    fetchUser();
    subscribe();
  }, []);

  const fetchFriendsAndSteps = async () => {
    if (!user) {
      console.error('User is null');
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('fetch-friends', {
        body: { userId: user.id },
      });

      if (error) {
        if (error instanceof FunctionsHttpError) {
          const errorMessage = await error.context.json();
          console.log('Function returned an error', errorMessage);
        } else if (error instanceof FunctionsRelayError) {
          console.log('Relay error:', error.message);
        } else if (error instanceof FunctionsFetchError) {
          console.log('Fetch error:', error.message);
        } else {
          console.log('Unknown error:', error.message);
        }
        throw new Error(error.message);
      }

      setFriends(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des amis et des pas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchFriendsAndSteps();
    }
  }, [user]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error during sign out:', error);
    } else {
      setUser(null);
      setEmail(null);
    }
  };

  const renderItem = ({ item }: { item: Friend }) => (
    <ListItem
      title={`${item.nom}`}
      description={`Steps: ${item.steps}`}
    />
  );

  return (
    <Layout style={styles.container}>
      <Text>Bonjour <Text category='h8'>{email ? `Email: ${email}` : 'Alexandre'}</Text></Text>
      
      <Layout style={styles.roundedContainer}>
        <View style={styles.topContainer}>
          <View style={[styles.group, styles.scaled]}>
            <Text style={styles.largeText}>15 000</Text>
            <Text style={styles.smallText}>Objectif</Text>
          </View>
          <View style={styles.group}>
            <Text style={[styles.largeText, styles.boldText]}>4 978</Text>
            <Text style={styles.smallText}>Pas</Text>
          </View>
          <View style={[styles.group, styles.scaled]}>
            <Text style={styles.largeText}>5.79 km</Text>
            <Text style={styles.smallText}>Distance</Text>
          </View>
        </View>
        <View style={styles.progressBar}>
          <View style={styles.innerBar}/>
        </View>
        <Text style={styles.percentageText}>+25% par rapport à hier</Text>
      </Layout>

      <List
        data={friends}
        renderItem={renderItem}
        style={styles.list}
      />

      <Button onPress={handleLogout} style={styles.logoutButton}>
        Se déconnecter
      </Button>

    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  list: {
    marginTop: 16,
    width: '100%',
  },
  progressBar:{
    backgroundColor: '#B8B8B8',
    borderRadius: 10,
    width: '100%',
    height: 8,
    padding: 0,
  },
  innerBar : {
    backgroundColor: '#000000',
    borderRadius: 10,
    height: '100%',
    width: '50%',
  },
  roundedContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 26,
    marginTop: 16,
    gap: 16,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topContainer:{
    flexDirection: 'row',
    gap: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  group: {
    alignItems: 'center',
  },
  scaled: {
    transform: [{ scale: 0.8 }],
  },
  largeText: {
    fontSize: 18,
    textAlign: 'center',
  },
  smallText: {
    fontSize: 14,
    textAlign: 'center',
  },
  boldText: {
    fontWeight: 'bold',
  },
  logoutButton: {
    marginTop: 20,
  },
});
