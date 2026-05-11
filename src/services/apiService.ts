import { useAuth } from "../contexts/AuthContext";
import type { LoginCreds, LoginResult, Project} from "./types";

const BASE_URL = 'http://localhost:4000';

export function useApiService(){
    const {authData} = useAuth();
    const token = authData?.token;

    const authHeaders = (): HeadersInit =>{
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }
  const handleResponse=<T>(res:Response): Promise<T>=> {
    if (res.status===401) throw new Error('Unauthorized');
    if (res.status===404) throw new Error('Not_found');
    if (!res.ok)throw new Error(`Request failed: ${res.statusText}`);
    return res.json() as Promise<T>;
  }
    
 const handleLogin=async(data:LoginCreds): Promise<LoginResult> =>{
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

 const isTokenMiss = (inpToken:string):boolean =>{
    return !!inpToken
}

const fetchProjects=async(): Promise<Project[]>=> {
    const res = await fetch(`${BASE_URL}/projects`, { headers: authHeaders() });
    return handleResponse<Project[]>(res);
  }

 const createProject=async(data: { name: string; description: string }): Promise<Project> =>{
    const res = await fetch(`${BASE_URL}/projects`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ ...data, createdAt: new Date().toISOString(), 
        filesCount: 0, jobsCount: 0 }),
    });
    return handleResponse<Project>(res);
  }

  const fetchProjectById=async(id:string):Promise<Project>=> {
  const res = await fetch(`${BASE_URL}/projects/${id}`, 
    { headers: authHeaders() });
  return handleResponse<Project>(res);
}

  const removeProject=async(id: string):Promise<void>=> {
    const res = await fetch(`${BASE_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Delete fail');
  }

    return {handleLogin, isTokenMiss, createProject, fetchProjects, fetchProjectById, removeProject}
}