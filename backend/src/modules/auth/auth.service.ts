import { findUser } from "./auth.repository";


export const validateCreds = async(email:string, password:string)=>{
    const userData= await findUser(email);
    if (!userData || userData.password !== password) {
    return null;
    }
  return {
    user: {
      id: String(userData.id),
      email: userData.email,
      token: userData.token
    }
  };
}