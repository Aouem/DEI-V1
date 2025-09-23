export interface Answer {
  questionId: number;
  texte: string;
  reponse: string;
  categorie?: string;
  sousCategorie?: string;
  question?: string;
}
export interface AnswersPayload {
  reponses: {
    questionId: number;
    texte: string;
    reponse: string;
    categorie?: string;
    sousCategorie?: string;
    question?: string;
  }[];
  metadata: {
    submissionDate: string; // Doit être requis
    sessionId: string;      // Doit être requis
    incidentId?: number;
    userId?: string;
  };
}