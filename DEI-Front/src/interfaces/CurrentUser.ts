export interface CurrentUser {
  id: string;
  userName: string;
  role: string;
  service?: string; // Optionnel si nécessaire
}