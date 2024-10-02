import React, { useState } from 'react';
import { Alert, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { supabase } from '@/lib/supabase';
import { Button, Input } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';

export default function Register() {
  const [email, setEmail] = useState<string>('');
  const[name,setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter(); // Hook pour naviguer vers la page de connexion

  async function signUpWithEmail() {
    setLoading(true);
    const { data: { session }, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert(error.message);
      console.log('Sign up failed:', error.message);
    } else {
      console.log('User signed up:', session);
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="Email"
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={'none'}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Password"
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={'none'}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Nom d'utilisateur"
          onChangeText={(text) => setName(text)}
          value={name}
          secureTextEntry={true}
          placeholder="Nom d'utilisateur"
          autoCapitalize={'none'}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button disabled={loading} onPress={signUpWithEmail}>
          Sign up
        </Button>
      </View>

      <View style={styles.verticallySpaced}>
        <TouchableOpacity onPress={() => router.push('/auth/login')}>
          <Text style={styles.link}>Already have an account? Sign in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
  link: {
    color: '#3366FF', // Couleur du lien
    textAlign: 'center',
    marginTop: 10,
  },
});
