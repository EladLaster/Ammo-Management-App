// src/Lior/services/inventoryService.js
// Service for fetching inventory data from Supabase
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://ucalfntzdcxjmbmsglen.supabase.co";
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjYWxmbnR6ZGN4am1ibXNnbGVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3NTc1NTcsImV4cCI6MjA3MTMzMzU1N30.EAiK66E2qCx3Q763wcZm2tyxtHHthRrf1JYFfLVQR7g";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function fetchInventory() {
  const { data, error } = await supabase.from("inventory").select(`
      unit_id,
      item_id,
      quantity,
      last_updated,
      items (
        item_name,
        category
      ),
      units (
        name
      )
    `);
  if (error) throw error;
  return data;
}
