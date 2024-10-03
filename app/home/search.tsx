import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input, Layout, List, ListItem, Button, Text } from '@ui-kitten/components';

export default function Search() {
  const [search, setSearch] = useState('');
  const [foundUsers, setFoundUsers] = useState([
    { id: 2, name: 'Jane Doe', isFriend: true },
    { id: 3, name: 'Alice', isFriend: false },
    { id: 4, name: 'Bob', isFriend: true },
  ]);

  const handleAddFriend = (id: number) => {
    setFoundUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, isFriend: true } : user
      )
    );
  };

  const renderItem = ({ item }: { item: { id: number; name: string; isFriend: boolean } }) => (
    <ListItem
      title={item.name}
      accessoryRight={() => (
        !item.isFriend ? (
          <Button size="tiny" onPress={() => handleAddFriend(item.id)}>
            Add Friend
          </Button>
        ) : <View /> // Return an empty View instead of null
      )}
    />
  );

  return (
    <Layout style={styles.container}>
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
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20, // Add padding to avoid overlap with the search bar
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