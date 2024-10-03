import { Stack } from "expo-router";
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';

SplashScreen.preventAutoHideAsync(); // Empêche le splash screen de se cacher automatiquement

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simule un temps de préparation (2 secondes)
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true); // Indique que l'application est prête
        await SplashScreen.hideAsync(); // Cache le splash screen une fois prêt
      }
    }

    prepare();
  }, []);

  if (!appIsReady) {
    return null; // Tant que l'application n'est pas prête, le splash screen reste visible
  }

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <Stack>
        <Stack.Screen name="auth/login" options={{ title: 'Login' }} />
        <Stack.Screen name="auth/register" options={{ title: 'Register' }} />
        <Stack.Screen name="pedometer/index" options={{ title: 'Pedometer' }} /> {/* Ajout du pédomètre */}
      </Stack>
    </ApplicationProvider>
  );
}
