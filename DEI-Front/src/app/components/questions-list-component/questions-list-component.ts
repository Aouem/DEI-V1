import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SubmissionService } from '../../services/submission-service';
import { QuestionsService } from '../../services/questions';
import { IncidentStateService } from '../../services/IncidentStateService';
import { ReponseDataCreate, SubmissionCreate } from '../../../interfaces/SubmissionData';

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

  @Input() incidentId!: number;

  constructor(
    private fb: FormBuilder,
    private questionsService: QuestionsService,
    private router: Router,
    private route: ActivatedRoute,
    private submissionService: SubmissionService,
    private incidentState: IncidentStateService
  ) {}

  ngOnInit(): void {
    // Si l'ID de l'incident vient de l'URL
    this.route.queryParams.subscribe(params => {
      const incidentId = params['incidentId'];
      if (incidentId) {
        this.incidentId = parseInt(incidentId, 10);
        this.submissionService.setCurrentIncident({ id: this.incidentId });
      }
    });
    this.loadQuestions();
    this.buildForm();
  }

  private loadQuestions(): void {
    // Exemple de questions; remplacer par ton service réel
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

  const answersPayload: ReponseDataCreate[] = Object.entries(this.answers).map(([key, value]) => ({
    questionId: this.extractQuestionId(key),
    texte: value,
    reponse: value,
    categorie: this.getCategoryFromQuestionId(this.extractQuestionId(key)),
    sousCategorie: this.getSubCategoryFromQuestionId(this.extractQuestionId(key)),
    question: this.getQuestionText(this.extractQuestionId(key)),
    alarmResponseId: this.incidentId, // ou null si tu veux le backend crée un nouvel ID
    commentaire: ''
  }));

  // 🔹 Inclure incidentId dans le payload
  const payload: SubmissionCreate = { 
    incidentId: this.incidentId, 
    reponses: answersPayload 
  };

  this.submissionService.createSubmission(payload).subscribe({
    next: () => {
      this.successMessage = 'Submission enregistrée avec succès';
      this.router.navigate(['/admin/confirmation'], { queryParams: { incidentId: this.incidentId } });
    },
    error: (err) => {
   //   console.error('Erreur SubmissionService:', err);
      this.errorMessage = 'Erreur lors de l’enregistrement de la submission';
      this.isSubmitting = false;
    }
  });
}


  private extractQuestionId(controlName: string): number {
    const parts = controlName.split('-');
    if (parts.length === 3) {
      return parseInt(parts[1], 10) * 100 + parseInt(parts[2], 10);
    }
    return 0;
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
}
