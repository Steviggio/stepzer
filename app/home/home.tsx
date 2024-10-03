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
      <Text category='h1'>Home</Text>
      <Text>Pedometer.isAvailableAsync(): {isPedometerAvailable}</Text>
      <Text>Steps taken in the last 24 hours: {pastStepCount}</Text>
      <Text>Walk! And watch this go up: {currentStepCount}</Text>
      <Text>{email ? `Email: ${email}` : 'No user logged in'}</Text>
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
});