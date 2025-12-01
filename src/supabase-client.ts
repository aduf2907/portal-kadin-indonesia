import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://abktksgonbstfurvbhay.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFia3Rrc2dvbmJzdGZ1cnZiaGF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5OTc0NzAsImV4cCI6MjA3ODU3MzQ3MH0.njMF1HnEuGLDkL_YQXLtU45kFFHuIyACxpC_6ceq3m8";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

if (typeof window !== "undefined") {
  // expose to browser for debugging
  // @ts-ignore
  window.supabase = supabase;
}
export default supabase;
