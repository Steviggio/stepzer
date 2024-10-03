import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { supabase } from '../lib/supabase';
import { useRouter } from 'expo-router';



// Définir le type User
export type User = {
  uid: string; 
  displayName: string | null;
  email: string; 
  phone: string | null; 
  providers: string[];
  providerType: string | null;
};

export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEdgeFunction = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('users', {
        body: { name: 'Functions' },
      });

      if (error) {
        throw new Error(error.message);
      }

      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEdgeFunction();
  }, []);

  return (
    <View>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        users.length > 0 ? (
          users.map((user) => (
            <View key={user.uid}>
              <Text>{user.displayName}</Text>
              <Text>{user.email}</Text>
              <Text>{user.phone}</Text>
              <Text>{user.providerType}</Text>
            </View>
          ))
        ) : (
          <Text>No users found</Text>
        )
      )}
    </View>
  );
}