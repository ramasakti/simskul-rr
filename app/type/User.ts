export type Role = {
  id_role: number;
  role: string;
}

export type Kelas = {
  id_kelas: number;

}

export type User = {
  user: DetailUser;
  iat: number;
  exp: number;
}

export type DetailUser = {
  id: number;
  username: string;
  name: string;
  email: string;
  role_id: number;
  role: string;
}