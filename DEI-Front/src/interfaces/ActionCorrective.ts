export interface ActionCorrective {
  id?: number;
  description: string;
  dateEcheance: Date;
  estTerminee: boolean;
  responsableId?: string;
  responsableNom?:string;
  pilote?:string;
  evenementIndesirableId?: number;
}
