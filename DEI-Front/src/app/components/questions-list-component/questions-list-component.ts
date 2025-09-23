import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionsService, AnswersPayload } from '../../services/questions';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SubmissionService } from '../../services/submission-service';
import { IncidentStateService } from '../../services/IncidentStateService';

@Component({
  selector: 'app-questions-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './questions-list-component.html',
  styleUrls: ['./questions-list-component.css']
})
export class QuestionsListComponent implements OnInit {
  currentPage = 1;
  totalPages = 7;
  form!: FormGroup;
  answers: { [key: string]: string } = {};
  isSubmitting = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  allQuestions: any[] = [];

  constructor(
    private fb: FormBuilder,
    private questionsService: QuestionsService,
    private router: Router,
    private route: ActivatedRoute,
    private submissionService: SubmissionService,
      private incidentState: IncidentStateService, // <-- nouveau service

  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const incidentId = params['incidentId'];
      if (incidentId) {
        this.submissionService.setCurrentIncident({ id: incidentId });
      }
    });
    this.loadQuestions();
    this.buildForm();
  }

  private loadQuestions(): void {
    this.allQuestions = [
      { id: 101, text: "Question 1.1" },
      { id: 102, text: "Question 1.2" },
    ];
  }

  private buildForm(): void {
    const group: { [key: string]: any } = {};
    for (let i = 1; i <= this.getPageQuestionsCount(); i++) {
      const key = `reponse-${this.currentPage}-${i}`;
      group[key] = [this.answers[key] || '', Validators.required];
    }
    this.form = this.fb.group(group);
  }

  private getPageQuestionsCount(): number {
    const questionsPerPage: { [key: number]: number } = {
      1: 5, 2: 5, 3: 2, 4: 7, 5: 8, 6: 7, 7: 3
    };
    return questionsPerPage[this.currentPage] || 0;
  }

  nextPage(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMessage = 'Veuillez répondre à toutes les questions de la page avant de continuer.';
      return;
    }
    this.saveAnswers();
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.buildForm();
      this.errorMessage = null;
      window.scrollTo(0, 0);
    }
  }

  previousPage(): void {
    this.saveAnswers();
    if (this.currentPage > 1) {
      this.currentPage--;
      this.buildForm();
      this.errorMessage = null;
      window.scrollTo(0, 0);
    }
  }

  private saveAnswers(): void {
    this.answers = { ...this.answers, ...this.form.value };
  }

  onSubmit(): void {
    if (this.isSubmitting || this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMessage = 'Veuillez répondre à toutes les questions avant de soumettre.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;
    this.successMessage = null;
    this.saveAnswers();

    const incidentId = this.getCurrentIncidentId();

    // CORRECTION: Assurez-vous que submissionDate et sessionId sont toujours des strings
    const answersPayload: AnswersPayload = {
      reponses: Object.entries(this.answers).map(([key, value]) => ({
        questionId: this.extractQuestionId(key),
        texte: value,
        reponse: value,
        categorie: this.getCategoryFromQuestionId(this.extractQuestionId(key)),
        sousCategorie: this.getSubCategoryFromQuestionId(this.extractQuestionId(key)),
        question: this.getQuestionText(this.extractQuestionId(key))
      })),
      metadata: {
        submissionDate: new Date().toISOString(), // Toujours défini
        sessionId: this.generateSessionId(),      // Toujours défini
        incidentId: incidentId
      }
    };

    this.questionsService.submitAnswers(answersPayload).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        
        // CORRECTION: Création de l'objet avec les métadonnées garanties
        const submissionData = {
          incidentId: incidentId,
          reponses: answersPayload.reponses,
          metadata: {
            submissionDate: answersPayload.metadata?.submissionDate!, // Utilisation de ! pour indiquer que c'est toujours défini
            sessionId: answersPayload.metadata?.sessionId!,           // Utilisation de ! pour indiquer que c'est toujours défini
            incidentId: incidentId
          }
        };
        
        const addedSubmission = this.submissionService.createSubmission(submissionData);

        this.router.navigate(['/admin/confirmation'], {
          state: {
            submissionData: addedSubmission,
            questionsData: this.allQuestions
          }
        });
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.errorMessage = this.getErrorMessage(err);
        this.isSubmitting = false;
      }
    });
  }

  private getCurrentIncidentId(): number {
    const incidentId = this.route.snapshot.queryParams['incidentId'];
    if (incidentId) return parseInt(incidentId);

    const currentIncident = this.submissionService.getCurrentIncident();
    if (currentIncident && currentIncident.id) {
      return currentIncident.id;
    }

    return 0;
  }

  private extractQuestionId(controlName: string): number {
    const parts = controlName.split('-');
    if (parts.length === 3) {
      return (parseInt(parts[1]) * 100 + parseInt(parts[2]));
    }
    return 0;
  }

  private generateSessionId(): string {
    return 'sess-' + Math.random().toString(36).substring(2, 9);
  }

  private getCategoryFromQuestionId(id: number): string {
    const categories: Record<number, string> = {
      1: 'Patient', 2: 'Tâches', 3: 'Individu',
      4: 'Équipe', 5: 'Environnement',
      6: 'Organisation', 7: 'Contexte'
    };
    return categories[Math.floor(id / 100)] || 'Autre';
  }

  private getSubCategoryFromQuestionId(id: number): string {
    const subCategories: Record<number, string> = {
      101: 'Antécédents', 102: 'État de santé',
    };
    return subCategories[id] || 'Général';
  }

  private getQuestionText(id: number): string {
    const question = this.allQuestions.find(q => q.id === id);
    return question?.text || `Question ${id}`;
  }

  private getErrorMessage(error: any): string {
    if (error.status === 0) return 'Erreur de connexion';
    if (error.status === 404) return 'Service indisponible';
    if (error.status >= 500) return 'Erreur serveur';
    return 'Erreur lors de la soumission';
  }
}