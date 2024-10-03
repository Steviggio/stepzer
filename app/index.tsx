import { Text, View } from "react-native";
import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Auth from '../components/Auth'
import { Session } from '@supabase/supabase-js'
import { TouchableOpacity } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import Register from "./auth/register";

export default function Index() {

  const [session, setSession] = useState<Session | null>(null)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <Register/>
  );
}
// steve.mothmora@gmail.com