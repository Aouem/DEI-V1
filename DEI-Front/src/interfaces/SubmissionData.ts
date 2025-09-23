// interfaces/SubmissionData.ts

export interface ReponseData {
  questionId: number;
  reponse: string;
  texte?: string;
  categorie?: string;
  sousCategorie?: string;
  question?: string;
}

export interface SubmissionData {
  id: number;
  createdAt: string;
  reponses: ReponseData[];
  metadata?: {
    submissionDate: string;
    sessionId: string;
    incidentId?: number;
    userId?: string;  // Ajoutez cette ligne si nécessaire
  };
}