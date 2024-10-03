import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, List, ListItem, Layout } from '@ui-kitten/components';
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

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error);
      } else {
        setUser(user as User | null);
      }
    };

    fetchUser();
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

  const renderItem = ({ item }: { item: Friend }) => (
    <ListItem
      title={`${item.nom}`}
      description={`Steps: ${item.steps}`}
    />
  );

  return (
    <Layout style={styles.container}>
      <Text category='h1'>Home</Text>
      <Text>{user ? `Email: ${user.email}` : 'No user logged in'}</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <List
          data={friends}
          renderItem={renderItem}
          style={styles.list}
        />
      )}
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