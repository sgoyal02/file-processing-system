export interface User{
    id:string,
    email: string,
    password: string,
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
    id: string,
    name:string,
    description:string,
    createdAt:string,
    filesCount:number,
    jobsCount:number
}
export interface AddProjectFormErr{
    name?:string,
    description?: string,
    res?:string
}