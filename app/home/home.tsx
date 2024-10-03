import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, List, ListItem, Layout } from '@ui-kitten/components';
import { Pedometer } from 'expo-sensors';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [email, setEmail] = useState<string | null>(null);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState<string>('checking');
  const [pastStepCount, setPastStepCount] = useState<number>(0);
  const [currentStepCount, setCurrentStepCount] = useState<number>(0);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error.message);
      } else {
        setEmail(user?.email || null);
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

      Pedometer.getStepCountAsync(start, end).then(
        (result) => {
          setPastStepCount(result.steps);
        },
        (error) => {
          console.error('Could not get stepCount: ' + error);
        }
      );

      const subscription = Pedometer.watchStepCount((result) => {
        setCurrentStepCount(result.steps);
      });

      return () => subscription.remove();
    };

    fetchUser();
    subscribe();
  }, []);

  const friends = [
    {
      name: 'mickael',
      steps: 10000
    },
    {
      name: 'julien',
      steps: 5000
    },
    {
      name: 'steve',
      steps: 2000
    }
  ];

  const renderItem = ({ item }: { item: { name: string; steps: number } }) => (
    <ListItem
      title={`${item.name}`}
      description={`Steps: ${item.steps}`}
    />
  );

  return (
    <Layout style={styles.container}>
      <Text>Bonjour <Text category='h8'>{email ? `Email: ${email}` : 'No user logged in'}</Text></Text>
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
});