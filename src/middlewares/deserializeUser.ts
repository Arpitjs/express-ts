import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../utils/jwt";
import { get } from "lodash";
import { reIssueAccessToken } from "../services/session.service";

export const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.headers.authorization)
      return res.status(400).json({ msg: "NOT Authorized. " });
    const accessToken = req.headers.authorization.split(" ")[1];
    const refreshToken = get(req, "headers.x-refresh");
  
    const { decoded, expired, message } = verifyJWT(accessToken);
    if(message) return res.status(400).json({ message });
    if (decoded && !expired) {
      res.locals.user = decoded;
      return next();
    }
    if (expired && refreshToken) {
      const newAccessToken = await reIssueAccessToken({ refreshToken });
      if (newAccessToken) {
        res.setHeader("x-access-token", newAccessToken);
      }
      const result = verifyJWT(newAccessToken);
      res.locals.user = result.decoded;
      return next();
    }
  } catch (e) {
    res.status(400).send(e);
  }
};
