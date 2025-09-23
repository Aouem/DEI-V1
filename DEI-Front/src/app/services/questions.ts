import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Question {
  id: number;
  text: string;
  category?: string;
  subCategory?: string;
  recommendation?: string;
}

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
  metadata?: {
    submissionDate?: string;
    userId?: string;
    sessionId?: string;
    incidentId?: number; // ← Cette ligne doit être présente
  };
}

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {
  private readonly apiUrl = environment.apiUrl;
  private readonly questionsEndpoint = 'questions';
  private readonly answersEndpoint = 'api/AlarmResponse';
  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  // ✅ Cache local des questions
  private cachedQuestions: Question[] = [];

  constructor(private http: HttpClient) { }

  // ✅ Appelé pour charger les questions depuis le backend
  getQuestions(): Observable<Question[]> {
    return this.http.get<string[]>(
      `${this.apiUrl}/${this.questionsEndpoint}`,
      this.httpOptions
    ).pipe(
      map((data: string[]) => {
        const questions = data.map((text, index) => ({
          id: index + 1,
          text: text,
          category: this.getCategoryFromText(text),
          subCategory: this.getSubCategoryFromText(text)
        }));
        this.cachedQuestions = questions; // ✅ Stockage dans le cache
        return questions;
      }),
      catchError(this.handleError)
    );
  }

  // ✅ Méthode accessible dans AllSubmissionsComponent
  getAllQuestions(): Question[] {
    return this.cachedQuestions;
  }

  // Soumettre les réponses au backend
  submitAnswers(payload: AnswersPayload): Observable<any> {
    const backendPayload = {
      reponses: payload.reponses.map(item => ({
        questionId: item.questionId,
        reponse: item.reponse,
        texte: item.texte,
        categorie: item.categorie || this.getCategoryFromQuestionId(item.questionId),
        sousCategorie: item.sousCategorie || this.getSubCategoryFromQuestionId(item.questionId),
        question: item.question || this.getQuestionText(item.questionId)
      })),
      metadata: {
        ...payload.metadata,
        submissionDate: new Date().toISOString(),
        sessionId: payload.metadata?.sessionId || this.generateSessionId()
      }
    };

    console.log('Envoi des réponses:', backendPayload);

    return this.http.post(
      `${this.apiUrl}/${this.answersEndpoint}`,
      backendPayload,
      this.httpOptions
    ).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur inconnue est survenue';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      errorMessage = `Code ${error.status}: ${error.message}`;

      if (error.status === 0) {
        errorMessage = 'Impossible de se connecter au serveur';
      } else if (error.status === 404) {
        errorMessage = 'Endpoint non trouvé. Vérifiez la configuration du serveur.';
      } else if (error.status >= 400 && error.status < 500) {
        errorMessage = `Erreur de requête: ${error.error?.message || error.message}`;
      }

      console.error('Détails de l\'erreur:', error.error);
    }

    console.error('[QuestionsService]', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  private generateSessionId(): string {
    return 'sess-' + Math.random().toString(36).substring(2, 9);
  }

  private getCategoryFromText(text: string): string {
    const match = text.match(/^(\d+)\..+? - \d+\.\d+/);
    return match ? match[1] : '';
  }

  private getSubCategoryFromText(text: string): string {
    const match = text.match(/ - (\d+\.\d+ .+?):/);
    return match ? match[1] : '';
  }

  private getCategoryFromQuestionId(id: number): string {
    return `Catégorie-${Math.floor(id / 10)}`;
  }

  private getSubCategoryFromQuestionId(id: number): string {
    return `SousCatégorie-${id}`;
  }

  private getQuestionText(id: number): string {
    const question = this.cachedQuestions.find(q => q.id === id);
    return question?.text || `Question ${id}`;
  }
}
