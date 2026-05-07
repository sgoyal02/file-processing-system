

import { useAuth } from '../contexts/AuthContext'
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoutes = () => {
    const {authData} = useAuth();

  return (
    authData.isLoad ?
    <div className='screen-div'>
        <span className='spinner-area'></span>
    </div>
    : !!authData.token ?
        <Outlet/>
    : <Navigate to={'/login'} replace/>
  )
}

export default PrivateRoutes
