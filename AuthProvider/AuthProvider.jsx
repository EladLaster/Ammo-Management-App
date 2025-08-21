import { supabase } from "../data/supabase";
import { makeAutoObservable } from "mobx";

class AuthProvider {
  activeUser = null;

  constructor() {
    makeAutoObservable(this);
  }

  makeInternalEmail = () =>
    `u${crypto.randomUUID().replace(/-/g, "")}@example.com`;

  handleSignUp = async (username, password, name, unitId, role, location) => {
    const internalEmail = this.makeInternalEmail();
    const { data, error } = await supabase.auth.signUp({
      email: internalEmail,
      password,
      options: { data: { display_name: username } },
    });

    if (error) throw new Error(error.message);

    const userId = data.user?.id;
    if (!userId) throw new Error("Failed to create user");

    const { error: insertErr } = await supabase.from("Users").insert({
      user_id: userId,
      username,
      internal_email: internalEmail,
      name,
      unit_id: unitId,
      role,
      location,
    });

    if (insertErr) {
      await supabase.auth.signOut();
      throw new Error(
        insertErr.code === "23505"
          ? "Username already taken"
          : insertErr.message
      );
    }

    return true;
  };

  handleSignIn = async (username, password) => {
    // שליפת יוזר מהטבלה
    const { data: userRow, error } = await supabase
      .from("Users")
      .select("id, internal_email, role, name, username")
      .eq("username", username)
      .single();

    if (error || !userRow?.internal_email) {
      console.log("User not found");
      return null;
    }

    // נסיון התחברות ל-auth
    const { error: authErr } = await supabase.auth.signInWithPassword({
      email: userRow.internal_email,
      password,
    });

    if (authErr) {
      console.log("Wrong credentials");
      return null;
    }

    // Normalize role for navigation logic
    let normalizedRole = userRow.role;
    if (normalizedRole === "Admin" || normalizedRole === "User") {
      // ok
    } else if (normalizedRole === "מנהל" || normalizedRole === "admin") {
      normalizedRole = "Admin";
    } else if (normalizedRole === "משתמש" || normalizedRole === "user") {
      normalizedRole = "User";
    }
    const userWithNormalizedRole = { ...userRow, role: normalizedRole };
    console.log("User after login:", userWithNormalizedRole);
    this.activeUser = userWithNormalizedRole;
    return userWithNormalizedRole;
  };

  handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log(error);
      throw error;
    } else {
      this.activeUser = null;
    }
  };

  getActiveUser() {
    return this.activeUser;
  }
}

export const authProvider = new AuthProvider();
