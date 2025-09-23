import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  questionId: number;
  reponse: string;
  texte?: string;
  categorie?: string;
  sousCategorie?: string;
  question?: string;
}

interface SubmissionData {
  id: number;
  createdAt: string;
  reponses: ReponseData[];
  metadata?: {
    submissionDate: string;
    sessionId: string;
        incidentId?: number; // ← ajouter ici

  };
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
  submissionId: number = 0;
  submissionDate: Date = new Date();
  responses: QuestionResponse[] = [];
  groupedResponses: { [key: string]: QuestionResponse[] } = {};
  hasData: boolean = false;
  private allQuestions: QuestionData[] = [];
  incidentId!: number; // ← nouveau


  // Ajout pour analyse
  categoryRiskScores: { [category: string]: { total: number, yes: number, no: number, partial: number, riskLevel: string } } = {};
  questionsToInvestigate: QuestionResponse[] = [];

  constructor(
  private route: ActivatedRoute,
  private router: Router,
  private submissionService: SubmissionService
  ) {}
ngOnInit(): void {
  this.loadSubmissionData();
}

private loadSubmissionData(): void {
  // Récupération ID depuis paramMap ou queryParams
  const idParam = this.route.snapshot.paramMap.get('id');
  const incidentIdParam = this.route.snapshot.queryParams['incidentId'];

  // Si ID présent dans paramMap
  if (idParam) {
    const id = parseInt(idParam, 10);
    if (!isNaN(id)) {
      this.fetchSubmission(id);
      return;
    }
  }

  // Si ID présent dans queryParams
  if (incidentIdParam) {
    const incidentId = parseInt(incidentIdParam, 10);
    if (!isNaN(incidentId)) {
      this.fetchSubmission(incidentId);
      return;
    }
  }

  // Fallback: état de navigation
  const navigation = this.router.getCurrentNavigation();
  const submissionFromState = navigation?.extras?.state?.['submissionData'];
  if (submissionFromState) {
    console.log('Chargement depuis state navigation');
    this.initializeData(submissionFromState);
    return;
  }

  // Si aucune donnée trouvée
  console.error('Aucune donnée de soumission disponible');
  this.router.navigate(['/admin']);
}

// Méthode pour récupérer la soumission via le service
private fetchSubmission(submissionId: number): void {
  this.submissionService.getSubmissionById(submissionId).subscribe({
    next: (submission: SubmissionData) => this.initializeData(submission),
    error: (err) => {
      console.error('Erreur lors de la récupération de la soumission', err);
      this.router.navigate(['/admin']);
    }
  });
}

// Initialisation des données
private initializeData(submissionData: SubmissionData): void {
  this.submissionId = submissionData.id;
  this.submissionDate = new Date(submissionData.createdAt);
  this.incidentId = submissionData.metadata?.incidentId ?? 0;
  this.hasData = true;

  this.allQuestions = this.getAllQuestions();

  this.responses = submissionData.reponses.map(res => {
    const question = this.allQuestions.find(q => q.id === res.questionId);
    return {
      id: res.questionId,
      question: question?.text || `Question ${res.questionId}`,
      response: res.reponse,
      category: question?.category || QuestionCategory.Other,
      subCategory: question?.subCategory || 'Non classée',
      details: res.texte
    };
  });

  this.groupResponsesByCategory();

  // Analyse des risques
  this.categoryRiskScores = this.getCategoryRiskScores();
  this.questionsToInvestigate = this.getQuestionsToInvestigate();
}


  getCategoryDisplayName(category: string): string {
    return category;
  }

  getSubCategories(responses: QuestionResponse[]): {name: string, responses: QuestionResponse[]}[] {
    const subCategories = new Map<string, QuestionResponse[]>();

    responses.forEach(response => {
      if (!subCategories.has(response.subCategory)) {
        subCategories.set(response.subCategory, []);
      }
      subCategories.get(response.subCategory)?.push(response);
    });

    return Array.from(subCategories.entries()).map(([name, responses]) => ({
      name,
      responses: responses.sort((a, b) => a.id - b.id)
    }));
  }

  getQuestionNumber(questionId: number): string {
    const question = this.allQuestions.find(q => q.id === questionId);
    if (question) {
      return `${Math.floor(question.id / 100)}.${question.id % 100}`;
    }
    return '?';
  }

  getResponseDisplay(response: string): string {
    if (!response) return ResponseType.UNKNOWN;

    const lowerResponse = response.toLowerCase();
    if (lowerResponse.includes('oui') || lowerResponse === 'o') return ResponseType.YES;
    if (lowerResponse.includes('non') || lowerResponse === 'n') return ResponseType.NO;
    if (lowerResponse.includes('partiel')) return ResponseType.PARTIAL;
    if (lowerResponse.includes('applicable') || lowerResponse === 'na') return ResponseType.NA;

    return response;
  }

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

  getCategoryStats(responses: QuestionResponse[]): string {
    const total = responses.length;
    const yes = responses.filter(r => this.getResponseDisplay(r.response) === ResponseType.YES).length;
    const no = responses.filter(r => this.getResponseDisplay(r.response) === ResponseType.NO).length;

    return `${yes} ✓ / ${no} ✗ / ${total} total`;
  }

  getSubCategoryStats(responses: QuestionResponse[]): string {
    const yes = responses.filter(r => this.getResponseDisplay(r.response) === ResponseType.YES).length;
    return `${yes}/${responses.length} positifs`;
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

  private groupResponsesByCategory(): void {
    this.groupedResponses = this.responses.reduce((acc, response) => {
      const categoryKey = response.category.toString();
      if (!acc[categoryKey]) {
        acc[categoryKey] = [];
      }
      acc[categoryKey].push(response);
      return acc;
    }, {} as Record<string, QuestionResponse[]>);

    this.sortGroupedResponses();
  }

  private sortGroupedResponses(): void {
    const orderedCategories = Object.values(QuestionCategory);
    this.groupedResponses = Object.keys(this.groupedResponses)
      .sort((a, b) => {
        const catA = this.parseQuestionCategory(a);
        const catB = this.parseQuestionCategory(b);
        return orderedCategories.indexOf(catA) - orderedCategories.indexOf(catB);
      })
      .reduce((acc, key) => {
        acc[key] = this.groupedResponses[key].sort((a, b) => a.id - b.id);
        return acc;
      }, {} as Record<string, QuestionResponse[]>);
  }

  private parseQuestionCategory(category: string): QuestionCategory {
    const validCategory = Object.values(QuestionCategory)
      .find(c => c.toString() === category) as QuestionCategory;
    return validCategory || QuestionCategory.Other;
  }

  getSubcategory(questionId: number): string {
    const question = this.allQuestions.find(q => q.id === questionId);
    if (question) {
      return `${Math.floor(question.id / 100)}.${question.id % 100}`;
    }
    return 'Non classée';
  }

  printPage(): void {
    window.print();
  }

  goToAllSubmissions() {
    this.router.navigate(['/admin/all-submissions']);
  }

  // Méthode analyse des risques par catégorie
  getCategoryRiskScores(): { [category: string]: { total: number, yes: number, no: number, partial: number, riskLevel: string } } {
    const scores: { [category: string]: { total: number, yes: number, no: number, partial: number, riskLevel: string } } = {};

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

  // Questions à investiguer
  getQuestionsToInvestigate(): QuestionResponse[] {
    return this.responses.filter(r => {
      const display = this.getResponseDisplay(r.response);
      return display === ResponseType.NO || display === ResponseType.PARTIAL || display === ResponseType.UNKNOWN;
    });
  }
}
