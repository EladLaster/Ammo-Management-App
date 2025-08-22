import {supabase} from '../../data/supabase'

export async function fetchInventory() {
  const { data, error } = await supabase.from("inventory_admins").select(`
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
    console.log("Inventory table data:", data); 

  return data;
}
