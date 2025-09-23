export interface AlarmResponse {
  id: number;
  reponses: Reponse[];
}

export interface Reponse {
  id: number;
  questionId: number;
  categorie: string;
  sousCategorie: string;
  question: string;
  reponse: string;
  commentaire?: string;
  alarmResponseId: number;
  alarmResponse?: AlarmResponse | null;
}
