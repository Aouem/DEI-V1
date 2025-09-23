export interface ActionCorrectiveDto {
  description: string;
  dateEcheance: string | Date;
  estTerminee: boolean;
  responsableId: string | null; // ✅ Permettre null
  responsableNom: string; // ✅ Rendre obligatoire (enlever ?)
  pilote?: string; // ✅ Garder optionnel si nécessaire
}