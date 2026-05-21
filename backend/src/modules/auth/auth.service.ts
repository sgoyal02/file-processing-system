import { findUser } from "./auth.repository";
import jwt from 'jsonwebtoken';


export const validateCreds = async(email:string, password:string)=>{
    const userData= await findUser(email);
    if (!userData || userData.password !== password) {
    return null;
    }
    const JWT_TOKEN = process.env.JWT_SECRET|| 'fake-token-key';
    const token = jwt.sign({ id: userData.id, email: userData.email },
                  JWT_TOKEN,{ expiresIn: '30m' });
  return {
    user: {
      id: String(userData.id),
      email: userData.email,
      token: token
    }
  };
}