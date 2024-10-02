import { Stack } from "expo-router";
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text } from '@ui-kitten/components';
import Login from "./auth/login";

export default function RootLayout() {
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Register' }} />
        <Stack.Screen name="auth/login" options={{ title: 'Login' }} />
        <Stack.Screen name="auth/register" options={{ title: 'Register' }} />
      </Stack>
    </ApplicationProvider>
  );
}
