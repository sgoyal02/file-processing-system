

import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../contexts/AuthContext'
import { Navigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';

const PrivateRoutes = () => {
    const {authData, onLogout} = useAuth();
    console.log("authda: ", authData);

    useEffect(() => {
        if (!authData.token) return;
        try {
            const decoded:{exp:number} = jwtDecode(authData.token);
            const timeRemain =(decoded.exp*1000)-Date.now();
            if (timeRemain<=0) {
              onLogout();
            } else {
              const timer = setTimeout(() => {
                    onLogout();
                }, timeRemain);
                return() => clearTimeout(timer);
            }
        } catch (err) {
            onLogout();
        }
    }, [authData.token, onLogout]);

    if(authData.isLoad){
      return(
        <div className='screen-div'>
        <span className='spinner-area'></span>
    </div>
      )
    }

    if (authData.token) {
    try {
      const decoded:{exp: number} = jwtDecode(authData.token);
      const isExpire=Date.now() >= decoded.exp * 1000;
      if (isExpire) {
        console.warn("token limit expire.");
        onLogout();
        return <Navigate to={'/login'} replace/>;
      }
    } catch (err) {
      onLogout();
      return <Navigate to={'/login'} replace/>;
    }
  }

  return (
    authData.token ?
        <Outlet/>
    : <Navigate to={'/login'} replace/>
  )
}

export default PrivateRoutes
