import React, { createContext, useCallback, useContext, useEffect, useReducer } from "react";
import type { AuthData, User } from "../services/types";
import { actionReducer, initData } from "../hooks/actionReducer";

interface AuthContextType {
    authData: AuthData;
    onLogin:(user: User, next?:()=>void)=>void;
    onLogout:()=>void;
    setLoad:()=>void;
    setError:()=>void
}
const AuthContext = createContext<AuthContextType | null>(null);


const AuthContextProvider = ({children}:{children: React.ReactNode}) =>{
    const [state, dispatch] = useReducer(actionReducer, initData);

    useEffect(()=>{
        const authToken= localStorage.getItem("authToken");
        const authUser= localStorage.getItem("authUser");
        if(authToken && authUser){
            dispatch({type: 'LOGIN_SUCCESS', 
                payload:{user: JSON.parse(authUser), token:  authToken}});
        }else{
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser')
            dispatch({type:'LOGOUT'})
        }
    },[])

    const onLogin = useCallback((data:User, next?:()=>void) =>{
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('authUser', JSON.stringify(data));
        dispatch({type:'LOGIN_SUCCESS', payload:{user: data, token: data.token}})
        if(next) next();
    },[]);

    const onLogout = useCallback(()=>{
         localStorage.removeItem('authToken');
            localStorage.removeItem('authUser')
            dispatch({type:'LOGOUT'})
    },[])
    const setLoad = useCallback(()=>{
        dispatch({type:'LOAD'});
    },[])

    const setError = useCallback(()=>{
        dispatch({type:'LOGIN_FAIL'})
    },[])

    return <AuthContext.Provider value={{setError, setLoad, authData: state, onLogin, onLogout}}>{children}</AuthContext.Provider>
}
export default AuthContextProvider;

// export const useAuth = useContext(AuthContext);  //not working

export const useAuth= () =>{
    let c= useContext(AuthContext);
    if(!c) throw new Error('useauth must be in context')
    return c;
}