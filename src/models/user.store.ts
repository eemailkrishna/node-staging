export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
}

// In-memory user store (swap with DB later without changing controllers).
const users = new Map<number, User>();
let nextId = 1;

export function resetStore(): void {
  users.clear();
  nextId = 1;
}

export function listUsers(): User[] {
  return [...users.values()];
}

export function getUser(id: string | number): User | null {
  return users.get(Number(id)) ?? null;
}

export function createUser({ name, email }: CreateUserInput): User {
  const now = new Date().toISOString();
  const user: User = {
    id: nextId++,
    name,
    email,
    createdAt: now,
    updatedAt: now,
  };
  users.set(user.id, user);
  return user;
}

export function updateUser(id: string | number, { name, email }: UpdateUserInput): User | null {
  const existing = getUser(id);
  if (!existing) return null;
  const updated: User = {
    ...existing,
    ...(name !== undefined ? { name } : {}),
    ...(email !== undefined ? { email } : {}),
    updatedAt: new Date().toISOString(),
  };
  users.set(updated.id, updated);
  return updated;
}

export function deleteUser(id: string | number): boolean {
  return users.delete(Number(id));
}
