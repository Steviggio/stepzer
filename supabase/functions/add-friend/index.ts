import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js';

const supabaseUrl = Deno.env.get("_SUPABASE_URL")!;
const supabaseAnonKey = Deno.env.get("_SUPABASE_SERVICE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

Deno.serve(async (req) => {
  try {
    const { id_user1, id_user2 } = await req.json();
    console.log(id_user1, id_user2);

    if (!id_user1 || !id_user2) {
      console.log("Missing id_user1 or id_user2");
      return new Response(
        JSON.stringify({ error: 'Missing id_user1 or id_user2. Please provide both id_user1 and id_user2 in the request body.' }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Insert the friendship into the 'friends' table
    const { data, error } = await supabase
      .from('friends')
      .insert({ id_user1, id_user2 });

    if (error) {
      return new Response(
        JSON.stringify({ error: `Database error: ${error.message}. Please check the provided IDs and try again.` }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: `Invalid request: ${error.message}. Please ensure the request body is a valid JSON.` }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
