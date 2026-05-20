import { Request, Response, NextFunction } from 'express';
import {validateCreds } from './auth.service';

export const login= async(req:Request, res:Response, next:NextFunction):Promise<void>=> {
    try {
      const {email, password } = req.body;
      if (!email||!password) {
        res.status(400).json({error: 'Request invalid: email, pswd fields are required.' });
        return;
      }
      const authRes = await validateCreds(email, password);

      if (!authRes) {
        res.status(401).json({ error: 'Invalid login creds.Please try again.' });
        return;
      }
      res.json(authRes);
    } catch (err) {
      next(err);
    }
  }