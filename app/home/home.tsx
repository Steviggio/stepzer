import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { supabase } from '@/lib/supabase';
import GoogleFit, { Scopes } from 'react-native-google-fit';

export default function Home() {
  const [email, setEmail] = useState<string | null>(null);
  const [steps, setSteps] = useState<number | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error.message);
      } else {
        setEmail(user?.email || null);
      }
    };

    console.log('\n\n FETCHING STEPS \n\n')

    GoogleFit.checkIsAuthorized().then(() => {
      console.log(GoogleFit.isEnabled) // Then you can simply refer to `GoogleFit.isAuthorized` boolean.
  })

    const fetchSteps = async () => {
      const options = {
        scopes: [
          Scopes.FITNESS_ACTIVITY_READ,
          Scopes.FITNESS_ACTIVITY_WRITE,
        ],
      };

      GoogleFit.authorize(options)
        .then(authResult => {
          if (authResult.success) {
            console.log('Authorization successful');
            const today = new Date();
            const options = {
              startDate: today.setHours(0, 0, 0, 0).toISOString(), // Min time for today
              endDate: new Date().toISOString(), // Max time for today
            };

            GoogleFit.getDailyStepCountSamples(options).then(res => {
              console.log('Step count samples:', res);
              if (res.length > 0) {
                const stepsToday = res[0].steps.reduce((total, step) => total + step.value, 0);
                setSteps(stepsToday);
              } else {
                console.log('No step count samples available');
              }
            }).catch(error => {
              console.error('Error fetching step count samples:', error);
            });
          } else {
            console.error('AUTH_DENIED', authResult.message);
          }
        })
        .catch(error => {
          console.error('AUTH_ERROR', error);
        });
    };

    fetchUser();
    fetchSteps();
  }, []);

  return (
    <View style={styles.container}>
      <Text>home</Text>
      <Text>{email ? `Email: ${email}` : 'No user logged in'}</Text>
      <Text>{steps !== null ? `Nombre de pas aujourd'hui : ${steps}` : 'Pas de données de pas disponibles'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});