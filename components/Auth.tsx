import React, { useState } from 'react';
import { View, Button, TextInput, Alert } from 'react-native';
import { supabase } from '../lib/supabase';
import { useRouter } from 'expo-router'; 

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const signIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      Alert.alert(error.message);
    } else {
      console.log('dashboardpush')
      router.push('/dashboard'); 
    }

    setLoading(false);
  };

  return (
    <View>
      <TextInput
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
        value={password}
      />
      <Button onPress={signIn} title={loading ? 'Signing In...' : 'Sign In'} />
    </View>
  );
}
