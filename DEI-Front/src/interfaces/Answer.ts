export interface Answer {
  questionId: number;
  texte: string;
  reponse: string;
  categorie?: string;
  sousCategorie?: string;
  question?: string;
}

export interface AnswersPayload {
  reponses: Answer[];
  metadata: {
    submissionDate: string; // requis
    sessionId: string;      // requis
    incidentId?: number;    // optionnel
    userId?: string;        // optionnel
  };
}
