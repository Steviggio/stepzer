// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js'

const supabaseUrl = Deno.env.get("_SUPABASE_URL")!
const supabaseAnonKey = Deno.env.get("_SUPABASE_SERVICE_KEY")!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

Deno.serve(async (req) => {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Missing userId. Please provide userId in the request body.' }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Récupérer les amis
    const { data: friends, error: friendsError } = await supabase
      .from('friends')
      .select('id_user2')
      .eq('id_user1', userId);

    if (friendsError) {
      return new Response(
        JSON.stringify({ error: `Database error: ${friendsError.message}.` }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const friendIds = friends.map(friend => friend.id_user2);

    // Récupérer les utilisateurs
    const { data: users, error: usersError } = await supabase
      .from('utilisateur')
      .select('id, nom')
      .in('id', friendIds);

    if (usersError) {
      return new Response(
        JSON.stringify({ error: `Database error: ${usersError.message}.` }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Récupérer les pas
    const { data: steps, error: stepsError } = await supabase
      .from('steps')
      .select('id_user, amount')
      .in('id_user', friendIds);

    if (stepsError) {
      return new Response(
        JSON.stringify({ error: `Database error: ${stepsError.message}.` }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Combiner les utilisateurs et leurs pas
    const usersWithSteps = users.map(user => {
      const userSteps = steps.find(step => step.id_user === user.id);
      return {
        ...user,
        steps: userSteps ? userSteps.amount : 0,
      };
    });

    return new Response(
      JSON.stringify(usersWithSteps),
      { headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: `Invalid request: ${error.message}.` }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

curl -i --location --request GET 'http://127.0.0.1:54321/functions/v1/friends-steps' \
  --header 'Authorization: Bearer YOUR_SUPABASE_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"userId":"USER_ID"}'

*/