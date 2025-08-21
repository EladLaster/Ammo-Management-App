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

    handleSignUp = async (username, password) =>
    {
        const internalEmail = this.makeInternalEmail();
        console.log("signup log");
       const { data, error } = await supabase.auth.signUp({
        email: internalEmail,
        password,
        options: { data: { display_name: username } } 
        });
        
        if (error) 
        {
            throw new Error(error.message);
        }

    }

    handleLogin = async (email, password, name) =>
    {
      const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
      name: name
    })

    
    if(error)
    {
        console.log(error);
        return new Error("User not found");
    }
    else
    {
        setActiveUser(name)
        console.log(userName);
    }
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

}

export const authProvider = new AuthProvider();