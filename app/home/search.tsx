import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native';
import { Input, Layout, List, ListItem, Button } from '@ui-kitten/components';
import { supabase } from '@/lib/supabase';
import { User as SupabaseUser } from '@supabase/auth-js';
import { FunctionsFetchError, FunctionsHttpError, FunctionsRelayError } from '@supabase/supabase-js';

// Définir le type User correctement
interface User extends SupabaseUser {
  nom: string;
  isFriend: boolean;
}

export default function Search() {
  const [user, setUser] = useState<User | null>(null);
  const [search, setSearch] = useState('');
  const [foundUsers, setFoundUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error);
      } else {
        setUser(user as User);
      }
    };

    fetchUser();
  }, []);

  const fetchEdgeFunction = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('users', {
        body: { name: 'Functions' },
      });

      if (error) {
        throw new Error(error.message);
      }

      setFoundUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEdgeFunction();
  }, []);

  // Function to handle adding a friend
  const handleAddFriend = async (friendId: string) => {
    if (!user) {
      Alert.alert('Error', 'User not logged in');
      return;
    }
  
    try {
      // Call the Supabase Edge Function "add-friend"
      const { data, error } = await supabase.functions.invoke('add-friend', {
        body: { id_user1: user.id, id_user2: friendId }, // Update to send id_user1 and id_user2
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
  
      setFoundUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === friendId ? { ...user, isFriend: true } : user
        )
      );
  
      Alert.alert('Success', 'Friend added successfully!');
    } catch (error) {
      console.error('Error adding friend:', error);
      Alert.alert('Error', 'Failed to add friend');
    }
  };

  const renderItem = ({ item }: { item: User }) => (
    <ListItem
      title={item.nom}
      accessoryRight={() => (
        !item.isFriend ? (
          <Button size="tiny" onPress={() => handleAddFriend(item.id)}>
            Add Friend
          </Button>
        ) : <View /> 
      )}
    />
  );

  return (
    <Layout style={styles.container}>
      {loading ? (
        <View><Text>Loading...</Text></View>
      ) : (
        <>
          <List
            data={foundUsers}
            renderItem={renderItem}
            style={styles.list}
          />
          <Input
            placeholder="Type Here..."
            value={search}
            onChangeText={setSearch}
            style={styles.searchBar}
          />
        </>
      )}
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  list: {
    width: '100%',
  },
  searchBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: 10,
  },
});