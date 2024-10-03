import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, List, ListItem, Layout } from '@ui-kitten/components';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error.message);
      } else {
        setEmail(user?.email || null);
      }
    };

    fetchUser();
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