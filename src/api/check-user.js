import { createClient } from "@supabase/supabase-js";

// Vercel serverless API route
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const supabase = createClient(
    "https://ecsxlejygxvgpjxkcrja.supabase.co", // Replace with your Supabase URL
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjc3hsZWp5Z3h2Z3BqeGtjcmphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2MDY4NjIsImV4cCI6MjA2MTE4Mjg2Mn0.67Z9aO1aXX3eXQYnZuSNni5bHy0YhCY6JFzu2tES2gY" // Replace with Service Role Key (safe on backend only)
  );

  try {
    const { data, error } = await supabase
      .from("users") // or 'auth.users' if you have direct access
      .select("email")
      .eq("email", email)
      .maybeSingle(); // won't throw error if not found

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ exists: false });
    }

    return res.status(200).json({ exists: true });
  } catch (err) {
    console.error("Supabase error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
}
