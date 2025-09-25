export interface SubmissionMetadata {
  submissionDate?: string;
  sessionId?: string;
  incidentId?: number;
}

export interface ReponseData {
  id: number;
  questionId: number;
  categorie: string;        // ← ici c’est 'categorie'
  sousCategorie: string;
  question: string;
  reponse: string;          // ← ici c’est 'reponse'
  commentaire: string;
  alarmResponseId: number;
  alarmResponse?: any;
  texte?: string;
}

export interface ReponseDataCreate {
  questionId: number;
  texte: string;
  reponse: string;
  categorie: string;
  sousCategorie: string;
  question: string;
  alarmResponseId: number;
  commentaire: string;
}

export interface SubmissionCreate {
  incidentId: number;                  // obligatoire
  reponses: ReponseDataCreate[];       // tableau de réponses
}



export interface SubmissionData {
  id: number;
  reponses: ReponseData[];
  createdAt: string;
  incidentId: number;
  metadata?: SubmissionMetadata;
}


