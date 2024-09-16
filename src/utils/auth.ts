import base64 from "base-64";
import { NextFunction, Request, Response } from "express";

// Hardcoded username and password
const USER = 'admin';
const PASS = 'notadmin'; 

function decodeCredentials(req: Request) {
  const encodedCredentials = req.headers.authorization
    ? req.headers.authorization.trim().replace(/Basic\s+/i, "")
    : "";

  const decodedCredentials = base64.decode(encodedCredentials);

  return decodedCredentials.split(":");
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const [username, password] = decodeCredentials(req);

  if (username === USER && password === PASS) {
    return next();
  }

  res.set('WWW-Authenticate', 'Basic realm="admin_page"');
  res.status(401).send('Authentication required.');
}
