export interface User {
  id?: number;
  fullName: string;
  username: string;
  password: string;
  email: string;
  phone: string;
  gender: number;
  birthYear: number;
  facebookLink?: string;
  province: string;
  school: string;
  created_at?: Date;
  refresh_token?: string;
}
