export interface SubmissionMetadata {
  submissionDate?: string;
  sessionId?: string;
  incidentId?: number;
}

export interface ReponseData {
  id: number;
  questionId: number;
  reponse: string;
  texte?: string;
  categorie?: string;
  sousCategorie?: string;
  question?: string;
  commentaire?: string;
  alarmResponseId?: number;
  alarmResponse?: any;
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
  createdAt: string;
  reponses: ReponseData[];
  incidentId?: number; // ✅ Même type partout
  metadata?: SubmissionMetadata;
}

