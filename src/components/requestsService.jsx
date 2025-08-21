// src/services/requestsService.js
import { supabase } from "../services/inventoryService";
import {authProvider} from "../../AuthProvider/AuthProvider"

const activeUser = authProvider.getActiveUser();

export async function fetchRequests() {
  const { data, error } = await supabase.from("requests").select(`
      id,
      user_id,
      unit_id,
      item_id,
      quantity,
      status,
      created_at,
      last_updated,
      items:item_id (
        item_name,
        category
      ),
      units:unit_id (
        name,
        location
      ),
      users:user_id (
        name,
        role
      )
    `);

  if (error) throw error;
  return data;
}


export async function updateRequestStatus(requestId, status) {
  const { data, error } = await supabase
    .from("requests")
    .where()
    .update({ status, last_updated: new Date().toISOString() })
    .eq("id", requestId)
    .select();
  
  if (error) throw error;
  return data;
}

export async function createRequest(requestData) {
  const { data, error } = await supabase
    .from("requests")
    .insert([{
      ...requestData,
      created_at: new Date().toISOString(),
      last_updated: new Date().toISOString()
    }])
    .select();
  
  if (error) throw error;
  return data;
}