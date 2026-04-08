export interface User {
  id: number;
  username: string;
  status: "active" | "inactive" | "banned";
}