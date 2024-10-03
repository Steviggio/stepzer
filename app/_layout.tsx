import { Stack, useRouter } from "expo-router";
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry, Layout, Text } from '@ui-kitten/components';
import Login from "./auth/login";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { EvaIconsPack } from "@ui-kitten/eva-icons";

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (session) {
        // Si une session existe, rediriger vers /home
        const { data: { user }, error } = await supabase.auth.getUser();
        if (user){
          router.replace('/home/home');
        }
      }
    };

    checkSession();
  }, []);

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <Stack>
          <Stack.Screen name="index" options={{ title: 'Register' }} />
          <Stack.Screen name="auth/login" options={{ title: 'Login' }} />
          <Stack.Screen name="auth/register" options={{ title: 'Register' }} />
          <Stack.Screen name="home/home" options={{ title: 'Home' }} />
        </Stack>
      </ApplicationProvider>
    </>
  );
}