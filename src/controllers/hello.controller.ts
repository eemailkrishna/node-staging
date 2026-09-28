import type { Request, Response } from 'express';

export function hello(req: Request, res: Response): void {
  const name = typeof req.query.name === 'string' && req.query.name ? req.query.name : 'World';
  res.json({ message: `Hello, ${name}!` });
}

export function root(_req: Request, res: Response): void {
  res.json({ message: 'Hello API running. Try GET /hello?name=Node and /api/users' });
}
