import { useAuth } from "../contexts/AuthContext";
import type { LoginCreds, LoginResult, Project, SavedFile, SavedJobs } from "./types";

const BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

export function useApiService() {
  const { authData } = useAuth();
  const token = authData?.token;

  const authHeaders = (): HeadersInit => {
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  //as per backend res format
  const handleResponse = async<T>(res: Response):Promise<T> => {
  const resData = await res.json();
  if (!res.ok||!resData?.success) {
    if (res.status=== 401) {
      throw new Error('Unauthorized');
    } else
    throw new Error(resData?.msg||resData?.err|| 'Request fail');
  }
  return resData.data as T;
};
  
  const handleLogin = async (data: LoginCreds): Promise<LoginResult> => {
    try {
      const res= await fetch(`${BASE_URL}/auth/login`, {
        method:'POST',
        headers: authHeaders(),
        body: JSON.stringify({email: data.email, password:data.pswd})
      });
      const resData= await res.json();
      if(!resData.success){
        return {user:null, errTxt: resData.msg || 'Reuqest fail'}
      }
      return { user: resData.data.user, errTxt: "" };
    } catch(err) {
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

  const createProject = async (data:{ name: string; description: string }): Promise<Project> => {
    const res = await fetch(`${BASE_URL}/projects`, {  //or ?_embed=files&_embed=jobs  ??
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({...data}),
    });
    return handleResponse<Project>(res);
  }

  const updateProject= async(id:string|number, data:{name:string; description:string }): Promise<Project> => {
  const res = await fetch(`${BASE_URL}/projects/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
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
    await handleResponse<null>(res);  //success, msg, data:-null
  }

  const fetchFiles = async (id: string | number): Promise<SavedFile[]> => {
    const res = await fetch(`${BASE_URL}/projects/${id}/files`, { headers: authHeaders() });
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
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${BASE_URL}/projects/${id}/files`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
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

  const delFile = async (projectId: string | number, fileId: string | number): Promise<void> => {
  const res = await fetch(`${BASE_URL}/projects/${projectId}/files/${fileId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  await handleResponse<null>(res);
}

  const fetchJobs = async (id: string | number): Promise<SavedJobs[]> => {
    const res = await fetch(`${BASE_URL}/projects/${id}/jobs`, { headers: authHeaders() });
    return handleResponse<SavedJobs[]>(res);
  }

  const createZipJob = async (projectId:string|number, fileIds: (string | number)[]): Promise<SavedJobs> => {
    const res = await fetch(`${BASE_URL}/projects/${projectId}/jobs`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({fileIds}),
    });
    return handleResponse<SavedJobs>(res);
  };

  const getJobStatus = async (projectId:string|number, id: string| number):Promise<SavedJobs> => {
    const res = await fetch(`${BASE_URL}/projects/${projectId}/jobs/${id}`,{
      method:"GET",
      headers: authHeaders()
    });
    return handleResponse<SavedJobs>(res);
  };

  const downloadZip= async(data:SavedJobs) => {
    const fullUrl = `${import.meta.env.VITE_API_URL}${data.downloadUrl}`;
    const res = await fetch(fullUrl, {
      method:"HEAD",
      headers: authHeaders()
    })
    if (!res.ok) {
    if (res.status === 404) throw new Error('zip no longer exists.');
    throw new Error('Download failed.');
  }
  window.open(fullUrl, '_blank');
  };

  return {
    handleLogin, isTokenMiss, createProject, fetchProjects,
    fetchProjectById, removeProject, fetchFiles,
    uploadFile, delFile, updateProjectDataCount, fetchJobs, createZipJob, getJobStatus,
    downloadZip, updateProject
  }
}