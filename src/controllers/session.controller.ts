import { Request, Response } from "express";
import logger from "../utils/logger";
import { createSession, findSessions, updateSession } from "../services/session.service";
import { validatePassword } from "../services/user.service";
import { signJWT } from "../utils/jwt";
import config from 'config';

export async function createSessionHandler(req: Request, res: Response) {
  try {
      const user = await validatePassword(req.body);

      if(!user) return res.status(401).send('invalid email or password.');

      const session = await createSession(user._id, req.get('user-agent') || '');

      const accessToken  = signJWT({
          ...user,
          session: session._id,
      }, {
          expiresIn: config.get('accessTokenTTL')
      })

      const refreshToken = signJWT({
        ...user,
        session: session._id,
    }, {
        expiresIn: config.get('refreshTokenTTL')
    })
    return res.send({ accessToken, refreshToken });

  } catch (e: any) {
    logger.error(e);
    return res.status(409).send(e.message);
  }
}

export async function getUserSessionsHandler(req: Request, res: Response) {
  const userId = res.locals.user;
  const sessions = await findSessions({
    user: userId, valid: true
  })
  return res.send(sessions);
}

export async function deleteSessionHandler(req: Request, res: Response) {
  const sessionId = res.locals.user.session;
  await updateSession({ _id: sessionId }, { valid: false });
  return res.send({
    accessToken: null,
    refreshToken: null
  })
} 