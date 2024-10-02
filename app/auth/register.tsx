import React, { useState } from 'react';
import { Alert, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { supabase } from '@/lib/supabase';
import { Button, Input } from '@ui-kitten/components';
import { useRouter } from 'expo-router';

export default function Register() {
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
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
      <View style={styles.formContainer}>
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
            placeholder="Nom d'utilisateur"
            autoCapitalize={'none'}
          />
        </View>
      </View>

      {/* Boutons en bas */}
      <View style={styles.buttonContainer}>
        <Button disabled={loading} onPress={signUpWithEmail}>
          Sign up
        </Button>
        <TouchableOpacity onPress={() => router.push('/auth/login')}>
          <Text style={styles.link}>Already have an account? Sign in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Remplir tout l'espace disponible
    justifyContent: 'center', // Centrer verticalement les champs
    padding: 12,
  },
  formContainer: {
    flex: 1, // Remplir l'espace vertical disponible pour centrer les champs
    justifyContent: 'center', // Centrer verticalement les champs
  },
  buttonContainer: {
    justifyContent: 'flex-end', // Positionner les boutons en bas
    alignItems: 'stretch', // Centrer horizontalement
    paddingBottom: 20,
    width: '100%',
    // Ajouter du padding en bas
  },
  verticallySpaced: {
    paddingTop: 8,
    paddingBottom: 8,
    width: '100%',
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
