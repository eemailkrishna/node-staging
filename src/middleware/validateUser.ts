import type { Request, Response, NextFunction } from 'express';
import type { HttpError } from './common.js';

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function badRequest(message: string): HttpError {
  const err = new Error(message) as HttpError;
  err.status = 400;
  return err;
}

export function validateUserCreate(req: Request, _res: Response, next: NextFunction): void {
  const { name, email } = (req.body ?? {}) as { name?: unknown; email?: unknown };
  if (!name || typeof name !== 'string' || !name.trim()) {
    return next(badRequest('name is required (non-empty string)'));
  }
  if (!email || typeof email !== 'string' || !emailRe.test(email)) {
    return next(badRequest('email is required (valid email)'));
  }
  next();
}

export function validateUserUpdate(req: Request, _res: Response, next: NextFunction): void {
  const { name, email } = (req.body ?? {}) as { name?: unknown; email?: unknown };
  if (name !== undefined && (typeof name !== 'string' || !name.trim())) {
    return next(badRequest('name must be a non-empty string'));
  }
  if (email !== undefined && (typeof email !== 'string' || !emailRe.test(email))) {
    return next(badRequest('email must be a valid email'));
  }
  if (name === undefined && email === undefined) {
    return next(badRequest('provide at least one of: name, email'));
  }
  next();
}
