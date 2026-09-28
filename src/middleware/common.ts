import type { Request, Response, NextFunction } from 'express';

export interface HttpError extends Error {
  status?: number;
}

export function logger(req: Request, _res: Response, next: NextFunction): void {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
}

export function notFound(_req: Request, res: Response, _next: NextFunction): void {
  res.status(404).json({ error: 'Not Found' });
}

export function errorHandler(err: HttpError, _req: Request, res: Response, _next: NextFunction): void {
  console.error(err);
  const status = err.status ?? 500;
  res.status(status).json({ error: err.message || 'Internal Server Error' });
}
