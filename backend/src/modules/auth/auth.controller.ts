import { Request, Response, NextFunction } from 'express';
import {validateCreds } from './auth.service';
import { sendError, sendSuccess } from '../../response';

export const login= async(req:Request, res:Response, next:NextFunction):Promise<void>=> {
    try {
      const {email, password} = req.body;
      if (!email||!password) {
        return sendError(res, 'Request invalid: email, pswd fields are required.', 400);
      }
      const authRes = await validateCreds(email, password);
      if (!authRes) {
        return sendError(res, 'Invalid login creds.Please try again.', 401);
      }
      return sendSuccess(res, authRes,'Login success')
    } catch (err) {
      next(err);
    }
  }