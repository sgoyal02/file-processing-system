export const formatDate=(dateParam: string): string=> {
  return new Date(dateParam).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export const formaFulltDate = (dateParam: string): string => {
  const newDate= new Date(dateParam).toLocaleString('en-US', {
    year:'numeric',
    month:'long',
    day:'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  return newDate.replace(' at ', ' ');
}

export interface User{
    id:string,
    email: string,
    password?: string,
    token: string,
}
export interface AuthData{
    user: User | null,
    token: string| null,
    isGuest: boolean,
    isLoad: boolean
}

export type ReducerAction= | {type: 'LOAD'} 
| {type: 'LOGIN_SUCCESS', payload:{user:User, token:string}} | {type: 'LOGIN_FAIL'}
| {type:'LOGOUT'}

export interface FormErr{
    email?:string,
    pswd?: string,
    res?:string
}
export interface LoginCreds{
    email: string,
    pswd: string
}
export interface LoginResult{
    user: User | null,
    errTxt:string
}
export interface Project{
    id: string|number,
    name:string,
    description:string,
    createdAt:string,
    filesCount?:number,
    jobsCount?:number
}
export interface AddProjectFormErr{
    name?:string,
    description?: string,
    res?:string
}

export interface SavedFile {
  id: string|number;
  projectId: string| number;
  name: string;
  size: number; 
  uploadedAt: string;
}
export interface FileQueue{
    id:string,
    file: File,
    progress:number,
    status:'pending'| 'completed'| 'uploading'| 'err'
}

export interface SavedJobs{
    id: string|number,
    projectId: string| number,
    fileIds:Array<string | number>,
    status:'PENDING'| 'PROCESSING'| 'COMPLETED'| 'FAILED',
    progress:number,
    createdAt:string,
    completedAt:string|null,
    downloadUrl:string| null
}