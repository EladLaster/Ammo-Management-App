import { makeAutoObservable, runInAction } from "mobx";
import { supabase } from "../data/supabase";

class DBProvider {
  armorTypes = [];

  constructor() {
    makeAutoObservable(this);
  }

  loadArmorTypes = async (category) => {
    const { data, error } = await supabase
      .from("items")
      .select("item_name")
      .eq("category", category);

    if (error) {
      console.error("Error fetching item names:", error);
      return;
    }

    runInAction(() => {
      const uniqueArmorTypes = Array.from(
        new Set(data.map((item) => item.item_name))
      );
      this.armorTypes = uniqueArmorTypes;
    });
  };

  fetchArmorIdByName = async (armorName) => {
    try {
      const { data, error } = await supabase
        .from("items")
        .select("id")
        .eq("item_name", armorName)
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Error fetching armor ID:", error);
        return null;
      }

      return data ? data.id : null;
    } catch (err) {
      console.error("Unexpected error in fetchArmorIdByName:", err);
      return null;
    }
  };

  insertNewRequest = async (user_id, unit_id, item_id, quantity, status) => {
    const { data, error } = await supabase
      .from("requests")
      .insert([
        {
          user_id: Number(user_id),
          unit_id: Number(unit_id),
          item_id: Number(item_id),
          quantity: Number(quantity),
          status,
        },
      ])
      .select("id")
      .single();

    if (error) {
      console.error("Insert error:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      throw error;
    }
  };
}

export const dbProvider = new DBProvider();
