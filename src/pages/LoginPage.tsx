import { useState } from 'react'
import '../styles/login.css'
import type { FormErr } from '../services/types';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useApiService } from '../services/apiService';

const LoginPage = () => {
    const [userData, setUserData] = useState({email:"", pswd:""})
    const [err, setErr] = useState<FormErr>({});
    const {authData, onLogin, setLoad,setError} = useAuth();
    const navigate= useNavigate();
    const {handleLogin} = useApiService();

    const validateForm = ():boolean =>{
        const newErr: FormErr={};
        let emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
        if(!userData.email.trim())
            newErr.email="Email is required";
        else if(!emailRegex.test(userData.email))
             newErr.email="Please enter a valid email."
        if(!userData.pswd.trim())
            newErr.pswd="Password is requird";
        setErr(newErr)

        return Object.keys(newErr).length ===0;
    }

    const handleSubmit = async(e:any)=>{
        e.preventDefault();
        if(!validateForm()){
            return ;
        } else{
            setLoad();
            try{
            const {user, errTxt} = await handleLogin(userData);
            console.log("exi: ", user, errTxt);
            if(user){
                onLogin(user, ()=>{
                    navigate('/projects');
                });
            } else{
                setTimeout(()=>{
                  setErr((prev)=>({...prev, res: errTxt}))
                  setError();
                }, 2000)
            }
            } catch(err){
              setTimeout(()=>{
            setErr((prev)=>({...prev, res: err instanceof Error ? err.message : "Something went wrong"}));
                setError();
              }, 2000);
            }
        }
    }

  return (
    <div className="login-main">
    <div className="login-container">
        <div className="app-name">
          <h3>File Processing System</h3>
        </div>
        <h4 className="login-title">Sign In</h4>
        <p className="login-subTxt">
            Please enter your email address and password to login into application.
        </p>
 
        {!!err.res && (
          <div className="res-error" role="alert">
            {err.res}
          </div>
        )}
 
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className={`inp-group ${!!err.email ? 'err' : ''}`}>
            <label htmlFor="email" className="inp-label">Email</label>
            <input id="email" type="email"
              className="user-inp"
              placeholder="abc@ex.com"
              value={userData.email}
              onChange={(e) => {
                setUserData((prev)=>({...prev, email: e.target.value}))
                setErr((p) => ({ ...p, email: "", res:"" }));
              }}
              autoComplete="email"
              disabled={authData.isLoad}
            />
            {!!err.email && <span className="inp-errTxt">{err.email}</span>}
          </div>
 
          <div className={`inp-group ${!!err.pswd ? 'err' : ''}`}>
            <label htmlFor="password" className="inp-label">Password</label>
            <input
              id="password"
              type="password"
              className="user-inp"
              value={userData.pswd}
              onChange={(e) => {
                 setUserData((prev)=>({...prev, pswd: e.target.value}))
                setErr((p) => ({ ...p, pswd: "", res:"" }));
              }}
              autoComplete="current-password"
              disabled={authData.isLoad}
            />
            {!!err.pswd && <span className="inp-errTxt">{err.pswd}</span>}
          </div>
 
          <button
            type="submit"
            className="login-btn"
            disabled={authData.isLoad}
          >
            {authData.isLoad ? (
              <>
              <span className="spinner-area spinner-btn" />
              {"Signing in…"}
              </>
            ) : 
            (
              'Sign in'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
