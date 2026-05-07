import type { LoginCreds, LoginResult} from "./types";

const BASE_URL = 'http://localhost:4000';

export const handleLogin=async(data:LoginCreds): Promise<LoginResult> =>{
    try{
        //not seraching with id, pswd????  //que-
        // const res= await fetch(`${BASE_URL}/users?email=${encodeURIComponent(data.email)}&password=${encodeURIComponent(data.pswd)}`);
        const res= await fetch(`${BASE_URL}/users?email=${encodeURIComponent(data.email)}`);
        if(!res.ok)
            throw new Error("Request failed")
        else{
            const users= await res.json();
            if(!users.length)
                return {user:null, errTxt:"Invalid login creds. Please try again."}
            else{
                return {user: users[0], errTxt:""};
            }
        }
    } catch{
        throw new Error("Something went wrong.")
    }
}

export const isTokenMiss = (inpToken:string):boolean =>{
    return !!inpToken
}