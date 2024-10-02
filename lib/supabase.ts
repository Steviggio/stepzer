import { AppState } from 'react-native';
import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://njnbnseltpcmtrzsxpeq.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qbmJuc2VsdHBjbXRyenN4cGVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc4NzA2OTQsImV4cCI6MjA0MzQ0NjY5NH0.NvybgQO7wAeHezfDftTBIyLpdHB4E1wnLhwGTHGjQSU"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

// Indique à Supabase Auth de rafraîchir continuellement la session automatiquement
// si l'application est au premier plan. Lorsque cela est ajouté, vous continuerez
// à recevoir des événements `onAuthStateChange` avec les événements `TOKEN_REFRESHED` ou
// `SIGNED_OUT` si la session de l'utilisateur est terminée. Cela ne doit
// être enregistré qu'une seule fois.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})