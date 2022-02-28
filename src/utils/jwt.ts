import jwt from "jsonwebtoken";
import fs from 'fs';

const privateKey = fs.readFileSync(process.cwd() + '/config/jwtRS256.key');
const publicKey = fs.readFileSync(process.cwd() + '/config/jwtRS256.key.pub');

export function signJWT(object: Object, options?: jwt.SignOptions | undefined) {
  return jwt.sign(object, privateKey, {
    ...(options && options),
    algorithm: "RS256",
  });
}

export function verifyJWT(token: string) {
    try {
        const decoded = jwt.verify(token, publicKey);
        return  {
            valid: true,
            expired: false,
            decoded
        }
    } catch (e: any) {
        console.log(e);
        if(e.message !== 'jwt expired') return { message: e.message };
        return  {
            valid: false,
            expired: e.message === 'jwt expired',
            decoded: null
        }
    }
}