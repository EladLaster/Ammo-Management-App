import { createContext, useContext } from "react";
import { useState, useEffect} from "react";
import {useNavigate, Navigate} from 'react-router'
import { supabase } from "../data/supabase";
import { makeAutoObservable } from "mobx";

class AuthProvider
{
    activeUser;

    constructor()
    {
        makeAutoObservable(this);
    }
    makeInternalEmail = () =>  `u${crypto.randomUUID().replace(/-/g, '')}@example.com`;

    handleSignUp = async (username, password, name, unitId, role, location) =>
    {
        const internalEmail = this.makeInternalEmail();
        console.log("signup log");
       const { data, error } = await supabase.auth.signUp({
        email: internalEmail,
        password,
        options: { data: { display_name: username } } 
        });
        
        if (error) throw new Error(error.message);
        const userId = data.user?.id;
        if (!userId) throw new Error('Failed to create user');

          const { error: insertErr } = await supabase.from('Users').insert({
                user_id: userId,
                username,
                internal_email: internalEmail,
                name,
                unit_id: unitId,
                role,
                location
            });
        
              if (insertErr) {
                await supabase.auth.signOut();
                throw new Error(
                insertErr.code === '23505' ? 'Username already taken' : insertErr.message
                );
              }



    }

    handleSignIn = async(username, password) =>{
    const { data, error } = await supabase
    .from('Users')
    .select('internal_email')
    .eq('username', username)
    .single();

  if (error || !data?.internal_email) {
    console.log('Error'); 
  }

  const { error: authErr } = await supabase.auth.signInWithPassword({
    email: data.internal_email,
    password
  });

  if (authErr)console.log('Wrong credentials');
  else console.log("Log in!");
  return true;
}

    handleLogout = async() => 
    {
        const {error} = await supabase.auth.signOut();
        if(error)
        {
            console.log(error);
            throw error;
        }
        else
        {
            setActiveUser(null);
            navigate('/')
        }
    }

    getActiveUser(){
      return this.activeUser;
    }

}

export const authProvider = new AuthProvider();