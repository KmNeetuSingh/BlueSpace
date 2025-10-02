const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(
  process.env.SUPABASE_URL,     
  process.env.SUPABASE_SERVICE_KEY 
);
async function testSupabase() {
  try {
    const { data, error } = await supabase.from("todos").select("*").limit(1);

    if (error) {
      console.error("Supabase connection failed:", error.message);
    } else {
      console.log("Supabase connected! Sample data from 'todos':", data);
    }
  } catch (err) {
    console.error("Error connecting to Supabase:", err.message);
  }
}
testSupabase();

module.exports = supabase;
