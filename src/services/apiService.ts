import { useAuth } from "../contexts/AuthContext";
import type { LoginCreds, LoginResult, Project, SavedFile, SavedJobs } from "./types";

const BASE_URL = 'http://localhost:4000';

export function useApiService() {
  const { authData } = useAuth();
  const token = authData?.token;

  const authHeaders = (): HeadersInit => {
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }
  const handleResponse = <T>(res: Response): Promise<T> => {
    if (res.status === 401) throw new Error('Unauthorized');
    if (res.status === 404) throw new Error('Not_found');
    if (!res.ok) throw new Error(`Request failed: ${res.statusText}`);
    return res.json() as Promise<T>;
  }

  const handleLogin = async (data: LoginCreds): Promise<LoginResult> => {
    try {
      //not seraching with id, pswd????  //que-
      // const res= await fetch(`${BASE_URL}/users?email=${encodeURIComponent(data.email)}&password=${encodeURIComponent(data.pswd)}`);
      const res = await fetch(`${BASE_URL}/users?email=${encodeURIComponent(data.email)}`);
      if (!res.ok)
        throw new Error("Request failed")
      else {
        const users = await res.json();
        if (!users.length)
          return { user: null, errTxt: "Invalid login creds. Please try again." }
        else {
          return { user: users[0], errTxt: "" };
        }
      }
    } catch {
      throw new Error("Something went wrong.")
    }
  }

  const isTokenMiss = (inpToken: string): boolean => {
    return !!inpToken
  }

  const fetchProjects = async (): Promise<Project[]> => {
    const res = await fetch(`${BASE_URL}/projects`, { headers: authHeaders() });
    return handleResponse<Project[]>(res);
  }

  const createProject = async (data: { name: string; description: string }): Promise<Project> => {
    const res = await fetch(`${BASE_URL}/projects`, {  //or ?_embed=files&_embed=jobs  ??
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        ...data, createdAt: new Date().toISOString(),
        filesCount: 0, jobsCount: 0
      }),
    });
    return handleResponse<Project>(res);
  }

  const fetchProjectById = async (id: string): Promise<Project> => {
    const res = await fetch(`${BASE_URL}/projects/${id}`,
      { headers: authHeaders() });
    return handleResponse<Project>(res);
  }

  const removeProject = async (id: string|number): Promise<void> => {
    const res = await fetch(`${BASE_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Delete fail');
  }

  const fetchFiles = async (id: string | number): Promise<SavedFile[]> => {
    const res = await fetch(`${BASE_URL}/files?projectId=${id}`, { headers: authHeaders() });
    return handleResponse<SavedFile[]>(res);
  }

  const uploadFile = async (file: File, id: string | number,
    onProgress: (percent: number) => void): Promise<SavedFile> => {
    await new Promise((resolve) => {
      let pr = 0;
      const gap = setInterval(() => {
        pr = pr + Math.floor(Math.random() * 30) + 10;
        if (pr >= 100) {
          pr = 100;
          onProgress(100);
          clearInterval(gap);
          resolve(true);
        } else {
          onProgress(pr);
        }
      }, 400);
    });
    const fileData = {
      id: crypto.randomUUID(),  //or omit<savedfiel, 'id'>
      name: file.name,
      projectId: id, size: file.size, uploadedAt: new Date().toISOString()
    }
    return addFileToProject(fileData);
  }
  const addFileToProject = async (fileData: SavedFile): Promise<SavedFile> => {
    const res = await fetch(`${BASE_URL}/files`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(fileData),
    });
    return handleResponse<SavedFile>(res);
  }

  const updateProjectDataCount = async (id: string,
    newCount: { filesCount?: number; jobsCount?: number }
  ) => {
    const res = await fetch(`${BASE_URL}/projects/${id}`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify(newCount),
    });
    return res.ok;
  };

  const delFile = async (id: string | number): Promise<void> => {
    const res = await fetch(`${BASE_URL}/files/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    console.log("res api: ", res);
    if (!res.ok) throw new Error('Delete file fail');
  }

  const fetchJobs = async (id: string | number): Promise<SavedJobs[]> => {
    const res = await fetch(`${BASE_URL}/jobs?projectId=${id}`, { headers: authHeaders() });
    return handleResponse<SavedJobs[]>(res);
  }

  const createZipJob = async (data: Omit<SavedJobs, 'id'>): Promise<SavedJobs> => {
    const res = await fetch(`${BASE_URL}/jobs`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<SavedJobs>(res);
  };

  const getJobStatus = async (id: string| number):Promise<SavedJobs> => {
    const res = await fetch(`${BASE_URL}/jobs/${id}`);
    const job = await res.json();
    if (job.status=== 'COMPLETED' || job.status=== 'ERROR') return job;
    const failProb= Math.random() <0.05;
    const newProg = failProb ? job.progress : Math.min((job.progress|| 0) + 20, 100);
    const newStatus =failProb ? 'ERROR': newProg===100? 'COMPLETED': 'PROCESSING';
    const newres = await fetch(`${BASE_URL}/jobs/${id}`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({
        progress: newProg,
        status: newStatus,
        completedAt: newStatus=== 'COMPLETED'? new Date().toISOString() : '',
        downloadUrl: newStatus=== 'COMPLETED'? `/sample-files/job-${id}.zip` : ""
      })
    });
    return newres.json();
  };

  return {
    handleLogin, isTokenMiss, createProject, fetchProjects,
    fetchProjectById, removeProject, fetchFiles,
    uploadFile, delFile, updateProjectDataCount, fetchJobs, createZipJob, getJobStatus
  }
}