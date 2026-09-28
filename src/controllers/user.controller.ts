import { asyncHandler } from '../utils/asyncHandler.js';
import * as store from '../models/user.store.js';
import type { HttpError } from '../middleware/common.js';

function notFoundError(): HttpError {
  const err = new Error('User not found') as HttpError;
  err.status = 404;
  return err;
}

export const list = asyncHandler(async (_req, res) => {
  res.json({ data: store.listUsers() });
});

export const getById = asyncHandler(async (req, res, next) => {
  const user = store.getUser(req.params.id as string);
  if (!user) {
    return next(notFoundError());
  }
  res.json({ data: user });
});

export const create = asyncHandler(async (req, res) => {
  const { name, email } = req.body as { name: string; email: string };
  const user = store.createUser({ name: name.trim(), email: email.trim() });
  res.status(201).json({ data: user });
});

export const update = asyncHandler(async (req, res, next) => {
  const body = req.body as { name?: string; email?: string };
  const payload: { name?: string; email?: string } = {};
  if (body.name !== undefined) payload.name = body.name.trim();
  if (body.email !== undefined) payload.email = body.email.trim();
  const user = store.updateUser(req.params.id as string, payload);
  if (!user) {
    return next(notFoundError());
  }
  res.json({ data: user });
});

export const remove = asyncHandler(async (req, res, next) => {
  const ok = store.deleteUser(req.params.id as string);
  if (!ok) {
    return next(notFoundError());
  }
  res.status(204).end();
});
