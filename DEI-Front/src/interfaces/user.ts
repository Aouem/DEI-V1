// interfaces/user.ts
// interfaces/user.ts
export interface User {
  id: string;
  userName: string;
  email?: string;
  role?: string;
  service?: Service;
  fonction?: string;
  tel?: string;
  // Ajouter les propriétés avec différentes casses possibles
  Id?: string;        // Pour compatibilité backend
  UserName?: string;  // Pour compatibilité backend
}

export interface Service {
  id: number;
  nom: string;
}