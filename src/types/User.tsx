export interface User {
  id: string;
  username: string;
  password: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateUserInput = Omit<User, "id" | "createdAt" | "updatedAt">;
export type UpdateUserInput = Partial<Omit<User, "id" | "createdAt" | "updatedAt">>;