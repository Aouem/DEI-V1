import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule, KeyValue } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SubmissionService } from '../../services/submission-service';


enum QuestionCategory {
  Patient = 'Patient',
  Tasks = 'Tâches',
  Individual = 'Individu',
  Team = 'Équipe',
  Environment = 'Environnement',
  Organization = 'Organisation',
  Context = 'Contexte',
  Other = 'Autre'
}

enum ResponseType {
  YES = 'Oui',
  NO = 'Non',
  PARTIAL = 'Partiellement',
  NA = 'Non applicable',
  UNKNOWN = 'Non renseigné'
}

interface ReponseData {
  id: number;
  questionId: number;
  reponse: string;
  texte?: string;
  categorie?: string;
  sousCategorie?: string;
  question?: string;
  commentaire?: string;
}

interface SubmissionMetadata {
  submissionDate?: string;
  sessionId?: string;
  incidentId?: number ;
}

interface SubmissionData {
  id: number;
  createdAt: string;
  reponses: ReponseData[];
  metadata?: SubmissionMetadata;
  incidentId?: number;
}

interface QuestionData {
  id: number;
  text: string;
  category: QuestionCategory;
  subCategory: string;
}

interface QuestionResponse {
  id: number;
  question: string;
  response: string;
  category: QuestionCategory;
  subCategory: string;
  details?: string;
}

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './confirmation.html',
  styleUrls: ['./confirmation.css']
})
export class ConfirmationComponent implements OnInit {
  submissionId!: number;
  submissionData?: SubmissionData;
  responses: QuestionResponse[] = [];
  groupedResponses: { [key: string]: QuestionResponse[] } = {};
  hasData: boolean = false;
  private allQuestions: QuestionData[] = [];
  incidentId: number | null = null; 
  submission: SubmissionData | null = null;
  preserveOrder = (a: KeyValue<string, any>, b: KeyValue<string, any>): number => 0;
  errorMessage: string = '';
  submissionDate: Date = new Date();
  categoryRiskScores: { [key: string]: { total: number, yes: number, no: number, partial: number, riskLevel: string } } = {};
  questionsToInvestigate: QuestionResponse[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private submissionService: SubmissionService,
      private cdRef: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.initializeComponent();
  }

  private initializeComponent(): void {
    const submissionIdFromUrl = this.extractSubmissionId();
    const incidentIdFromUrl = this.extractIncidentIdFromUrl();

    if (submissionIdFromUrl) {
      this.fetchSubmission(submissionIdFromUrl);
    } else if (incidentIdFromUrl && incidentIdFromUrl > 0) {
      this.loadAllSubmissionsAndFilter(incidentIdFromUrl);
    } else {
      this.handleNoData();
    }
  }

  // ✅ Ajout de la méthode manquante
  private extractSubmissionId(): number | null {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) return parseInt(idParam, 10) || null;
    
    const urlMatch = window.location.href.match(/\/confirmation\/(\d+)/);
    if (urlMatch) return parseInt(urlMatch[1], 10) || null;
    
    return null;
  }

  // ✅ Ajout de la méthode manquante
  private extractIncidentIdFromUrl(): number {
    const currentUrl = window.location.href;
    const match = currentUrl.match(/\/evenement\/(\d+)/);
    if (match) return parseInt(match[1], 10) || 0;
    
    const param = new URLSearchParams(window.location.search).get('incidentId');
    if (param) return parseInt(param, 10) || 0;
    
    const routeParam = this.route.snapshot.paramMap.get('incidentId');
    if (routeParam) return parseInt(routeParam, 10) || 0;
    
    return 0;
  }
   private loadAllSubmissionsAndFilter(incidentId: number): void {
    this.submissionService.getSubmissionsByIncidentId(incidentId).subscribe({
      next: (submissions) => {
        if (submissions && submissions.length > 0) {
          const latest = submissions[submissions.length - 1];
          if (latest?.id) {
            this.fetchSubmission(latest.id);
          } else {
            this.handleNoData();
          }
        } else {
          this.handleNoData();
        }
      },
      error: () => this.handleNoData()
    });
  }
    private handleNoData(): void {
    this.submission = null;
    this.incidentId = null;
    this.hasData = false;
  //  console.warn('Aucune donnée de soumission disponible');
  }


  private fetchSubmission(submissionId: number): void {
 // console.log('🔍 Fetching submission avec ID:', submissionId);
  
  this.submissionService.getSubmissionById(submissionId).subscribe({
    next: (submission) => {
    //  console.log('📦 Submission reçu de l\'API:', submission);
      
      if (submission && submission.id) {
        this.processSubmissionData(submission);
      } else {
      //  console.error('❌ Submission null ou sans ID');
        this.handleNoData();
      }
    },
    error: (error) => {
   //   console.error('❌ Erreur fetching submission:', error);
      this.handleNoData();
    }
  });
}

private processSubmissionData(submission: SubmissionData): void {
 // console.log('Submission complet reçu:', submission);
  
  this.submission = submission;
  this.submissionId = submission.id;
  
  // ✅ Correction : Récupérer incidentId depuis metadata OU depuis la racine
  this.incidentId = submission.metadata?.incidentId || submission.incidentId || null;
  
  // ✅ Correction : Utiliser createdAt directement
  this.submissionDate = new Date(submission.createdAt);
  
  this.initializeData(submission);
}

  private initializeData(submissionData: SubmissionData): void {
    try {
    //  console.log('Initialisation avec données:', submissionData);
      
      this.submissionId = submissionData.id;
      this.submissionDate = new Date(submissionData.createdAt);
      this.submission = submissionData;
      this.incidentId = submissionData.incidentId || null;
      
      this.hasData = true;
      this.allQuestions = this.getAllQuestions();

      this.responses = (submissionData.reponses || []).map(res => {
        const question = this.allQuestions.find(q => q.id === res.questionId);
            const details = res.texte || res.commentaire || this.extractDetailsFromResponse(res.reponse) || '';

        return {
          id: res.questionId,
          question: question?.text || res.question || `Question ${res.questionId}`,
      response: this.getMainResponse(res.reponse), // Extraire juste "oui", "non", etc.
          category: this.mapToQuestionCategory(res.categorie || ''),
          subCategory: res.sousCategorie || 'Non classée',
      details: details
        };
      });

    /*   console.log('Données transformées:', {
        submissionId: this.submissionId,
        incidentId: this.incidentId,
        hasData: this.hasData,
        responsesCount: this.responses.length
      }); */

      this.groupResponsesByCategory();
      this.categoryRiskScores = this.getCategoryRiskScores();
      this.questionsToInvestigate = this.getQuestionsToInvestigate();
      
      // ⚠️ FORCER LE CHANGEMENT DETECTION
      this.cdRef.detectChanges();
    //  console.log('✅ Changement detection forcé');
      
    } catch (error) {
    //  console.error('❌ Erreur dans initializeData:', error);
      this.hasData = false;
    }
  }
// ✅ NOUVELLE méthode pour extraire les détails de la réponse
private extractDetailsFromResponse(reponse: string): string {
  if (!reponse) return '';
  
  // Séparer la réponse principale des détails (s'il y a un saut de ligne)
  const parts = reponse.split('\n');
  if (parts.length > 1) {
    // Retourner tout sauf la première ligne (la réponse principale)
    return parts.slice(1).join('\n').trim();
  }
  
  // Si pas de saut de ligne, vérifier si c'est une réponse complexe
  const lowerReponse = reponse.toLowerCase();
  if (lowerReponse.includes('non') && reponse.length > 3) {
    // Extraire les détails après "non"
    const details = reponse.substring(3).trim();
    return details || '';
  }
  
  if (lowerReponse.includes('oui') && reponse.length > 3) {
    const details = reponse.substring(3).trim();
    return details || '';
  }
  
  return '';
}

// ✅ Méthode pour extraire seulement la réponse principale
private getMainResponse(reponse: string): string {
  if (!reponse) return '';
  
  // Prendre seulement la première ligne ou le premier mot
  const firstLine = reponse.split('\n')[0].trim();
  const lowerFirstLine = firstLine.toLowerCase();
  
  // Simplifier la réponse
  if (lowerFirstLine.includes('oui') || lowerFirstLine === 'o') return 'oui';
  if (lowerFirstLine.includes('non') || lowerFirstLine === 'n') return 'non';
  if (lowerFirstLine.includes('partiel')) return 'partiellement';
  if (lowerFirstLine.includes('applicable') || lowerFirstLine === 'na') return 'non applicable';
  
  return firstLine;
}

  // Ajoutez cette méthode pour debugger l'état du composant
private checkComponentState(): void {
 /*  console.log('🔍 État du composant:', {
    hasData: this.hasData,
    submissionId: this.submissionId,
    incidentId: this.incidentId,
    submissionDate: this.submissionDate,
    responsesLength: this.responses.length,
    submission: this.submission
  }); */
  
  // Test direct dans le template
  setTimeout(() => {
    const testElement = document.querySelector('.submission-info');
 //   console.log('📋 Élément template:', testElement?.innerHTML);
  }, 100);
}

  private mapToQuestionCategory(categorie: string): QuestionCategory {
    const map: { [key: string]: QuestionCategory } = {
      'Patient': QuestionCategory.Patient,
      'Tâches': QuestionCategory.Tasks,
      'Individu': QuestionCategory.Individual,
      'Équipe': QuestionCategory.Team,
      'Environnement': QuestionCategory.Environment,
      'Organisation': QuestionCategory.Organization,
      'Contexte': QuestionCategory.Context
    };
    return map[categorie] || QuestionCategory.Other;
  }

  private groupResponsesByCategory(): void {
    this.groupedResponses = this.responses.reduce((acc, response) => {
      const key = response.category.toString();
      if (!acc[key]) acc[key] = [];
      acc[key].push(response);
      return acc;
    }, {} as Record<string, QuestionResponse[]>);
  }

  getCategoryDisplayName(key: string): string { return key; }

  getCategoryStats(responses: QuestionResponse[]): string {
    const total = responses.length;
    const yes = responses.filter(r => this.getResponseDisplay(r.response) === ResponseType.YES).length;
    const no = responses.filter(r => this.getResponseDisplay(r.response) === ResponseType.NO).length;
    const partial = responses.filter(r => this.getResponseDisplay(r.response) === ResponseType.PARTIAL).length;
    return `Total: ${total}, Oui: ${yes}, Non: ${no}, Partiel: ${partial}`;
  }

  getSubCategories(responses: QuestionResponse[]): { name: string, responses: QuestionResponse[] }[] {
    const groups: { [key: string]: QuestionResponse[] } = {};
    responses.forEach(r => {
      const key = r.subCategory || 'Non classée';
      if (!groups[key]) groups[key] = [];
      groups[key].push(r);
    });
    return Object.keys(groups).map(key => ({ name: key, responses: groups[key] }));
  }

  getSubCategoryStats(responses: QuestionResponse[]): string { return this.getCategoryStats(responses); }

  getQuestionNumber(questionId: number): string { return `Q${questionId}`; }

  getResponseDisplay(response: string): string {
    if (!response) return ResponseType.UNKNOWN;
    const lower = response.toLowerCase();
    if (lower.includes('oui') || lower === 'o') return ResponseType.YES;
    if (lower.includes('non') || lower === 'n') return ResponseType.NO;
    if (lower.includes('partiel')) return ResponseType.PARTIAL;
    if (lower.includes('applicable') || lower === 'na') return ResponseType.NA;
    return ResponseType.UNKNOWN;
  }

  getCategoryRiskScores(): { [key: string]: { total: number, yes: number, no: number, partial: number, riskLevel: string } } {
    const scores: { [key: string]: { total: number, yes: number, no: number, partial: number, riskLevel: string } } = {};
    Object.entries(this.groupedResponses).forEach(([category, responses]) => {
      const total = responses.length;
      const yes = responses.filter(r => this.getResponseDisplay(r.response) === ResponseType.YES).length;
      const no = responses.filter(r => this.getResponseDisplay(r.response) === ResponseType.NO).length;
      const partial = responses.filter(r => this.getResponseDisplay(r.response) === ResponseType.PARTIAL).length;
      let riskLevel = 'Faible';
      const negativeRatio = (no + partial) / total;
      if (negativeRatio > 0.6) riskLevel = 'Élevé';
      else if (negativeRatio > 0.3) riskLevel = 'Moyen';
      scores[category] = { total, yes, no, partial, riskLevel };
    });
    return scores;
  }

  getQuestionsToInvestigate(): QuestionResponse[] {
    return this.responses.filter(r => {
      const display = this.getResponseDisplay(r.response);
      return display === ResponseType.NO || display === ResponseType.PARTIAL || display === ResponseType.UNKNOWN;
    });
  }

  private getAllQuestions(): QuestionData[] {
    return [
      // 1. Facteurs liés au patient
      {
        id: 101,
        text: "Les antécédents médicaux du patient ont-ils influencé le cours de l'événement ?",
        subCategory: "1.1 Antécédents médicaux, habitus",
        category: QuestionCategory.Patient
      },
      {
        id: 102,
        text: "Est-ce que l'âge du patient, la gravité de son état ou la complexité de son cas ont pu contribuer à la survenue de cet événement ? Quel était le pronostic vital ou fonctionnel du patient au moment de l'acte ?",
        subCategory: "1.2 État de santé (pathologies, co-morbidités)",
        category: QuestionCategory.Patient
      },
      {
        id: 103,
        text: "Le patient présentait-il un risque connu ayant influencé l'événement (ex : un traitement particulier) ?",
        subCategory: "1.3 Traitements",
        category: QuestionCategory.Patient
      },
      {
        id: 104,
        text: "Le patient avait-il des problèmes d'expression ? Une communication difficile ? La langue parlée et comprise par le patient était-elle une difficulté lors de la prise en charge ? Des facteurs sociaux ont-ils participé à la survenue de l'événement ? Est-ce que le patient/son entourage était utile et coopératif ?",
        subCategory: "1.4 Personnalité, facteurs sociaux ou familiaux",
        category: QuestionCategory.Patient
      },
      {
        id: 105,
        text: "Quelle était la relation du patient avec les soignants et les soins ? Quelle était l'implication du patient dans la prise en charge thérapeutique (indifférent, opposant, ...) ?",
        subCategory: "1.5 Relations conflictuelles",
        category: QuestionCategory.Patient
      },

      // 2. Facteurs liés aux tâches
      {
        id: 201,
        text: "Existe-t-il des protocoles en rapport avec les actes ou le processus en cause dans l'événement ? Si les protocoles existent, sont-ils connus, disponibles et utilisés ? Les protocoles sont-ils toujours d'actualité ?",
        subCategory: "2.1 Protocoles (indisponibles, non adaptés ou non utilisés)",
        category: QuestionCategory.Tasks
      },
      {
        id: 202,
        text: "Les examens complémentaires ont-ils été réalisés et les résultats disponibles en temps utile ? Existe-il un accord (consensus) concernant l'interprétation des résultats d'examens ?",
        subCategory: "2.2 Résultats d'examens complémentaires",
        category: QuestionCategory.Tasks
      },
      {
        id: 203,
        text: "Les moyens nécessaires à une prise de décision existent-ils ? Sont-ils disponibles ? Ont-ils été utilisés ?",
        subCategory: "2.3 Aides à la décision",
        category: QuestionCategory.Tasks
      },
      {
        id: 204,
        text: "Les tâches concernées étaient-elles bien définies ? La définition des tâches prend-t-elle en compte les compétences des différentes professions ? La définition des tâches est-elle connue, partagée, respectée dans l'équipe ? Existe-t-il une incompréhension de la part du personnel sur les tâches à effectuer ?",
        subCategory: "2.4 Définition des tâches",
        category: QuestionCategory.Tasks
      },
      {
        id: 205,
        text: "Les tâches concernées étaient-elles planifiées ? L'intervention était-elle programmée ? Le programme a-t-il été respecté, modifié ? La personne appropriée a-t-elle été consultée quand cela était nécessaire pour le déroulement des soins ?",
        subCategory: "2.5 Programmation, planification",
        category: QuestionCategory.Tasks
      },

      // 3. Facteurs liés à l'individu (soignant)
      {
        id: 301,
        text: "Pensez-vous que vous aviez suffisamment de connaissances et d'expérience pour prendre en charge ce problème, cette complication ? Aviez-vous déjà réalisé ce geste, cette procédure ?",
        subCategory: "3.1 Qualifications, compétences",
        category: QuestionCategory.Individual
      },
      {
        id: 302,
        text: "Vous sentiez-vous fatigué, affamé ou malade ? Etiez-vous stressé ?",
        subCategory: "3.2 Facteurs de stress physique ou psychologique",
        category: QuestionCategory.Individual
      },

      // 4. Facteurs liés à l'équipe
      {
        id: 401,
        text: "La communication entre vous-même et les autres membres de l'équipe est-elle effective ? La communication est-elle précise, complète et non ambigüe ? Utilise-t-elle un vocabulaire standard (commun) et pas de jargon ? Est-il possible d'exprimer des désaccords ou des préoccupations au sein de l'équipe ? Existe-t-il un temps ou un espace pour cela ? La collaboration et l'ambiance sont-elles satisfaisantes ? Comment qualifieriez-vous la qualité relationnelle dans l'équipe de travail (ambiance, existence de conflits...) ? Est-ce que la communication entre votre service (département ou pôle) et les autres services (départements ou pôles) est effective ?",
        subCategory: "4.1 Communication entre professionnels",
        category: QuestionCategory.Team
      },
      {
        id: 402,
        text: "L'équipe a t'elle eu (passé) suffisamment de temps avec le patient pour lui expliquer les procédures et les conséquences possibles ou complications ? Ya t-il eu des difficultés linguistiques, culturelles ou des incompréhensions entre l'équipe et le patient et son entourage ? Quelles-sont les habitudes du service en termes d'information du patient et de son entourage ?",
        subCategory: "4.2 Communication vers le patient et son entourage",
        category: QuestionCategory.Team
      },
      {
        id: 403,
        text: "Les dossiers des patients (supports d'informations) sont-ils accessibles, lisibles, identifiés, et complets ? Les dossiers des patients (supports d'informations) mettent-ils suffisamment en évidence les facteurs de risques ? Quel est le niveau de partage des informations écrites dans l'équipe (nombre de supports, confidentialité...) ?",
        subCategory: "4.3 Informations écrites (dossier patient...)",
        category: QuestionCategory.Team
      },
      {
        id: 404,
        text: "Comment sont rapportées et partagées les informations cruciales pour la prise en charge du patient entre professionnels ? Les informations sur l'évaluation des patients sont-elles partagées et utilisées par les membres de l'équipe de soins en temps utile ?",
        subCategory: "4.4 Transmissions et alertes",
        category: QuestionCategory.Team
      },
      {
        id: 405,
        text: "Comment s'organise le travail entre les membres de l'équipe ? L'équipe est-elle d'accord sur la répartition des tâches ? A-t-il été défini qui prend en charge le patient ou réalise un acte particulier ?",
        subCategory: "4.5 Répartition des tâches",
        category: QuestionCategory.Team
      },
      {
        id: 406,
        text: "Avez-vous eu un encadrement (supervision) ou un soutien suffisant ? Un conseil ou l'aide d'un autre membre de l'équipe étaient-ils disponibles tout le temps ? La communication entre le management/supervision et l'équipe de soins est-elle adéquate ? Les coordonnées des spécialistes à appeler en cas d'urgence vitale sont-elles disponibles dans le secteur d'activité ?",
        subCategory: "4.6 Encadrement, Supervision",
        category: QuestionCategory.Team
      },
      {
        id: 407,
        text: "Quels soutiens sont disponibles en cas de problèmes ? Avez-vous eu un soutien suffisant ? Existe-t-il un soutien effectif dans l'équipe ?",
        subCategory: "4.7 Demandes de soutien ou comportements face aux incidents",
        category: QuestionCategory.Team
      },

      // 5. Facteurs liés à l'environnement de travail
      {
        id: 501,
        text: "Est-ce que les règlements et les procédures administratifs sont communiqués de façon adéquate ?",
        subCategory: "5.1 Administration",
        category: QuestionCategory.Environment
      },
      {
        id: 502,
        text: "Est-ce que votre pratique a été affectée par l'environnement de travail (chaleur, bruit..) ? Est-ce que les locaux sont adaptés au type de prise en charge ?",
        subCategory: "5.2 Locaux (fonctionnalité, maintenance, hygiène...)",
        category: QuestionCategory.Environment
      },
      {
        id: 503,
        text: "Les modalités de déplacement du patient ont-elles participé à la survenue de l'événement ? Des circuits et des modes de transport spécifiques ont-ils été définis pour les différents types de prise en charge (hospitalisation complète programmée, chirurgie ambulatoire, urgences immédiates, urgences différées).",
        subCategory: "5.3 Déplacements, transferts de patients",
        category: QuestionCategory.Environment
      },
      {
        id: 504,
        text: "Avez-vous disposé des fournitures ou des matériels médicaux nécessaires ? Est-ce que tous les équipements que vous avez utilisé ont fonctionné de façon adéquate et efficacement ? Est-ce qu'il y avait une information suffisante et fiable concernant tous les équipements ? Comment a été assurée la formation des professionnels à l'utilisation de ce matériel ? L'établissement dispose t-il d'un programme de maintenance ? Comment est assuré le dépannage d'urgence des équipements en panne, notamment concernant les dispositifs biomédicaux critiques ? Cette procédure est-elle connue des professionnels ?",
        subCategory: "5.4 Fournitures ou équipements",
        category: QuestionCategory.Environment
      },
      {
        id: 505,
        text: "Le système d'information est-il adapté aux orientations stratégiques de l'établissement, du service ? Le système d'information facilite t-il l'accès en temps utile à des informations valides ? Le système d'information aide t-il les professionnels dans leur processus de décision ? Existe-t-il des difficultés de fonctionnement du système d'information ? Existe-t-il plusieurs systèmes d'information ? Le système d'information du bloc opératoire est-il intégré au système d'information hospitalier ?",
        subCategory: "5.5 Informatique",
        category: QuestionCategory.Environment
      },
      {
        id: 506,
        text: "La composition de l'équipe était-elle appropriée ? Des règles de présence ainsi qu'un système de gardes et astreintes sont-ils définis afin d'assurer la permanence des soins 24h/24 ? Si oui, ces informations sont-elles connues des professionnels ?",
        subCategory: "5.6 Effectifs",
        category: QuestionCategory.Environment
      },
      {
        id: 507,
        text: "Avez-vous eu une augmentation de la charge de travail non prévue ou soudaine ? Avez-vous dû faire face à (ou hiérarchiser) plus d'un cas en même temps ? Deviez-vous passer du temps à des activités non cliniques ?",
        subCategory: "5.7 Charge de travail, temps de travail",
        category: QuestionCategory.Environment
      },
      {
        id: 508,
        text: "Y a-t-il eu des retards dans la mise en œuvre des procédures de soins ?",
        subCategory: "5.8 Retards, délais",
        category: QuestionCategory.Environment
      },

      // 6. Facteurs liés à l'organisation et au management
      {
        id: 601,
        text: "Comment la structure hiérarchique ou des niveaux décisionnels trop nombreux ont-ils influencés négativement le cours de l'événement ? Les circuits de décision et de délégation sont-ils définis, diffusés et connus des professionnels ?",
        subCategory: "6.1 Structure hiérarchique",
        category: QuestionCategory.Organization
      },
      {
        id: 602,
        text: "Les compétences nécessaires à une fonction ou à un service sont elles identifiées ? Existe-t-il une organisation afin d'intégrer tout nouvel arrivant dans l'établissement (information sur l'établissement et le secteur d'activité, lui permettant l'exercice de sa fonction) ? Pensez-vous que votre période d'adaptation à l'hôpital/spécialité/service vous a préparé à cette situation ? Avez-vous du collaborer avec un nouveau médecin ou personnel de soins (intérim) avec qui vous n'aviez jamais travaillé ?",
        subCategory: "6.2 Gestion des ressources humaines",
        category: QuestionCategory.Organization
      },
      {
        id: 603,
        text: "Existe-t-il un plan de formation continue établi en accord avec les besoins des services ? Les actes ou procédures de soins nécessitant une formation ou un entrainement sont-ils identifiés ?",
        subCategory: "6.3 Politique de formation continue",
        category: QuestionCategory.Organization
      },
      {
        id: 604,
        text: "Comment la fonction sous-traitée est-elle intégrée dans le fonctionnement du service et de l'équipe ?",
        subCategory: "6.4 Gestion de la sous-traitance",
        category: QuestionCategory.Organization
      },
      {
        id: 605,
        text: "Existe-t-il une politique d'achat ou d'approvisionnement prenant en compte les besoins des services, des utilisateurs et des patients ? Comment sont assurés les approvisionnements en situation normale, en urgence, les jours fériés, les week-ends ?",
        subCategory: "6.5 Politique d'achat",
        category: QuestionCategory.Organization
      },
      {
        id: 606,
        text: "Comment qualifieriez-vous la culture sécurité de l'établissement ? Existe-t-il une politique d'amélioration de la qualité et de la sécurité des soins diffusée dans l'établissement et connue des professionnels ? L'établissement évalue t-il et hiérarchise t'il les risques dans les secteurs d'activité ? Existe-t-il des plans d'actions d'amélioration de la qualité et de la sécurité des soins mis en oeuvre dans le secteur d'activité ? Existe-t-il une gestion documentaire dans l'établissement ? Si oui, la gestion documentaire définit-elle les modalités de rédaction, de diffusion et de révision des documents ? Les situations mettant en jeu la sécurité des biens et des personnes sont-elles identifiées ? Existe-t-il un document unique établi sur les conditions de travail des personnels ? Si oui, un plan d'amélioration des conditions de travail est-il défini ?",
        subCategory: "6.6 Management de la qualité",
        category: QuestionCategory.Organization
      },
      {
        id: 607,
        text: "Question manquante précédemment - à compléter selon vos besoins",
        subCategory: "6.7 Autre sous-catégorie",
        category: QuestionCategory.Organization
      },
      // 7. Facteurs liés au contexte institutionnel
      {
        id: 701,
        text: "L'établissement fait-il l'objet actuellement de mesures de la part d'un organe de l'état ? Existe-t-il des contraintes réglementaires en vigueur pour cet établissement ayant influencé le déroulement de l'événement ? (CPOM,…)",
        subCategory: "7.1 Politique de santé publique nationale",
        category: QuestionCategory.Context
      },
      {
        id: 702,
        text: "L'établissement a-t-il mis en place des partenariats en cohérence avec les pathologies qu'il prend en charge ? L'établissement est-il organisé en relation avec d'autres établissements pour le type de prise en charge concerné par l'événement ? Dans l'affirmative, le personnel connaît-il les modalités de cette organisation ?",
        subCategory: "7.2 Politique de santé publique régionale",
        category: QuestionCategory.Context
      },
      {
        id: 703,
        text: "L'événement s'est-il déjà produit dans l'établissement ? Le personnel déclare-t-il les événements qu'il rencontre ? Comment est organisé l'établissement pour recueillir et analyser les événements indésirables ?",
        subCategory: "7.3 Systèmes de signalement",
        category: QuestionCategory.Context
      }
    ];
  }

    printPage(): void { window.print(); }
  goToAllSubmissions(): void { this.router.navigate(['/admin/all-submissions']); }

  getResponseClass(response: string): string {
    const display = this.getResponseDisplay(response);
    switch (display) {
      case ResponseType.YES: return 'response-yes';
      case ResponseType.NO: return 'response-no';
      case ResponseType.PARTIAL: return 'response-partial';
      case ResponseType.NA: return 'response-na';
      case ResponseType.UNKNOWN: return 'response-unknown';
      default: return '';
    }
  }
}