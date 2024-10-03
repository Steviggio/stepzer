import React, { useState } from 'react';
import { Alert, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { supabase } from '@/lib/supabase';
import { Button, Input } from '@ui-kitten/components';
import { useRouter } from 'expo-router';

export default function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter(); // Hook pour naviguer vers la page de connexion

  async function signInWithEmail() {
    setLoading(true);
    const { data: { session }, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    
    if (error) {
      Alert.alert(error.message);
      console.log('Sign in failed:', error.message);
    } else {
      console.log('User signed in:', session);
      console.log('Access token:', session?.access_token); // Affiche le token d'accès
      // Naviguer vers une autre page ou effectuer d'autres actions
      router.push('/home/home'); // Exemple de navigation vers une page "home"
    }

    setLoading(false);
  }

  return (
    <View style={styles.container}>
      {/* Champs centré */}
      <View style={styles.formContainer}>
        <View style={styles.verticallySpaced}>
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
      </View>

      {/* Bouton et lien en bas */}
      <View style={styles.buttonContainer}>
        <Button
          disabled={loading}
          onPress={signInWithEmail}
          style={styles.fullWidthButton} // Prendre toute la largeur
        >
          Sign in
        </Button>

        <TouchableOpacity onPress={() => router.replace('/auth/register')}>
          <Text style={styles.link}>Don't have an account? Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Remplir tout l'espace
    justifyContent: 'center', // Centrer verticalement les champs
    padding: 12,
  },
  formContainer: {
    flex: 1, // Remplir l'espace vertical disponible pour centrer les champs
    justifyContent: 'center', // Centrer verticalement
  },
  buttonContainer: {
    justifyContent: 'flex-end', // Positionner le bouton et lien en bas
    paddingBottom: 20, // Padding en bas pour espacer du bord
    width: '100%',
    alignItems: 'center', // Centrer horizontalement
  },
  verticallySpaced: {
    paddingTop: 8,
    paddingBottom: 8,
    width: '100%',
  },
  fullWidthButton: {
    width: '100%', // Prendre toute la largeur
    marginBottom: 10, // Espacer le bouton du lien
  },
  link: {
    color: '#3366FF',
    textAlign: 'center',
  },
});
