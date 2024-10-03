// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js'


const supabaseUrl = Deno.env.get("_SUPABASE_URL")!
const supabaseAnonKey = Deno.env.get("_SUPABASE_SERVICE_KEY")!
const supabase = createClient(supabaseUrl, supabaseAnonKey)


console.log("Hello from Functions!")

Deno.serve(async (req) => {
  const { name } = await req.json()

  let { data: users, error } = await supabase.from('utilisateur').select('*')

  return new Response(
    JSON.stringify(
      users,
    ),
    { headers: { "Content-Type": "application/json" } },
  )
  console.log(users)
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

curl -i --location --request GET 'http://127.0.0.1:54321/functions/v1/users' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qbmJuc2VsdHBjbXRyenN4cGVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc4NzA2OTQsImV4cCI6MjA0MzQ0NjY5NH0.NvybgQO7wAeHezfDftTBIyLpdHB4E1wnLhwGTHGjQSU' \
  --header 'Content-Type: application/json' \
  --data '{"name":"Functions"}'

*/
