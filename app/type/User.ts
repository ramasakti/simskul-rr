export type Role = {
  id_role: number;
  role: string;
}

export type Kelas = {
  id_kelas: number;
  
}

export type User = {
  id: number;
  username: string;
  name: string;
  email: string;
  role: Role;
}