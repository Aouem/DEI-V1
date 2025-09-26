import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IncidentService } from '../../services/incident';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { TypeEvenement } from '../../../interfaces/TypeEvenement';
import { StatutDeclaration } from '../../../interfaces/StatutDeclaration';
import { SubmissionService } from '../../services/submission-service';
import { IncidentGrilleService } from '../../services/incident-grille.service';
import { SchemaService } from '../../services/schema-service';
import { SubmissionData } from '../../../interfaces/SubmissionData';
import { map } from 'rxjs';

interface CategoryField {
  field: string;
  label: string;
  hasPrecision?: string;
}

@Component({
  selector: 'app-evenement-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './evenement-detail.html',
  styleUrls: ['./evenement-detail.css'],
  providers: [DatePipe]
})
export class EvenementDetailComponent implements OnInit {
  incidentForm!: FormGroup;
  incident: any;
  isLoading = true;
  errorMessage = '';
  grillesAlarme: any[] = [];
  submissions: any[] = [];
  selectedFile: File | null = null;
  showGrille = false;
  showArbre = false;

  categories: { [key: string]: CategoryField[] } = {
    "Accueil": [
      { field: "natureAccueilManqueInfo", label: "Manque d'information" },
      { field: "natureAccueilCommViolente", label: "Communication violente" },
      { field: "natureAccueilComportement", label: "Comportement inapproprié" },
      { field: "natureAccueilAbsenceEcoute", label: "Absence d'écoute" },
      { field: "natureAccueilErreurOrientation", label: "Erreur d'orientation" },
      { field: "natureAccueilAutre", label: "Autre", hasPrecision: "natureAccueilAutrePrecision" }
    ],
    "Organisation": [
      { field: "orgRuptureStock", label: "Rupture de stock" },
      { field: "orgDefaillanceInfo", label: "Défaillance informationnelle" },
      { field: "orgInterruptionAppro", label: "Interruption approvisionnement" },
      { field: "orgErreurCommande", label: "Erreur de commande" },
      { field: "orgGestionStock", label: "Mauvaise gestion du stock" },
      { field: "orgRetardLivraison", label: "Retard de livraison" },
      { field: "orgAutre", label: "Autre", hasPrecision: "orgAutrePrecision" }
    ],
    "Soins": [
      { field: "natureSoinsChutePatient", label: "Chute patient" },
      { field: "natureSoinsComplication", label: "Complication" },
      { field: "natureSoinsDefautTransmission", label: "Défaut de transmission" },
      { field: "natureSoinsErreurMedicamenteuse", label: "Erreur médicamenteuse" },
      { field: "natureSoinsEscarre", label: "Escarre" },
      { field: "natureSoinsFugue", label: "Fugue" },
      { field: "natureSoinsInfection", label: "Infection" },
      { field: "natureSoinsRetardPEC", label: "Retard PEC" },
      { field: "natureSoinsRetardTraitement", label: "Retard traitement" },
      { field: "natureSoinsAutre", label: "Autre", hasPrecision: "natureSoinsAutrePrecision" }
    ],
    "Dossier": [
      { field: "dossierPatient", label: "Dossier patient", hasPrecision: "dossierPatientPrecision" },
      { field: "dossierPerte", label: "Perte du dossier" },
      { field: "dossierIncomplet", label: "Dossier incomplet" },
      { field: "dossierInfoManquante", label: "Informations manquantes" },
      { field: "dossierAccesNonAutorise", label: "Accès non autorisé" },
      { field: "dossierMalRedige", label: "Dossier mal rédigé" },
      { field: "dossierAutre", label: "Autre", hasPrecision: "dossierAutrePrecision" }
    ],
    "Droits": [
      { field: "droitDignite", label: "Dignité" },
      { field: "droitReligion", label: "Religion" },
      { field: "droitInfoAbsente", label: "Information absente" },
      { field: "droitAccesDossier", label: "Accès au dossier" },
      { field: "droitChoixMedecin", label: "Choix du médecin" },
      { field: "droitConfidentialite", label: "Confidentialité" },
      { field: "droitConsentement", label: "Consentement" },
      { field: "droitAutre", label: "Autre", hasPrecision: "droitAutrePrecision" }
    ],
    "Risque": [
      { field: "risqueAES", label: "AES" },
      { field: "risqueInfection", label: "Infection" },
      { field: "risqueMaladiePro", label: "Maladie professionnelle" },
      { field: "risqueChute", label: "Chute" },
      { field: "risqueTMS", label: "TMS" },
      { field: "risqueChimique", label: "Chimique" },
      { field: "risqueRadioactif", label: "Radioactif" },
      { field: "risquePsycho", label: "Psychologique" },
      { field: "risqueBlessure", label: "Blessure" },
      { field: "risqueHarcelement", label: "Harcèlement" },
      { field: "risqueAutre", label: "Autre", hasPrecision: "risqueAutrePrecision" }
    ],
    "Technique": [
      { field: "techElectricite", label: "Électricité" },
      { field: "techPlomberie", label: "Plomberie" },
      { field: "techClimatisation", label: "Climatisation" },
      { field: "techFluides", label: "Fluides" },
      { field: "techAscenseur", label: "Ascenseur" },
      { field: "techEquipement", label: "Équipement" },
      { field: "techAutre", label: "Autre", hasPrecision: "techAutrePrecision" }
    ],
    "Sécurité": [
      { field: "secuExplosion", label: "Explosion" },
      { field: "secuEffondrement", label: "Effondrement" },
      { field: "secuAgression", label: "Agression" },
      { field: "secuChantier", label: "Chantier" },
      { field: "secuAutre", label: "Autre", hasPrecision: "secuAutrePrecision" }
    ],
    "Bien": [
      { field: "bienPerte", label: "Perte" },
      { field: "bienDeterioration", label: "Détérioration" },
      { field: "bienConfusion", label: "Confusion" },
      { field: "bienVol", label: "Vol" },
      { field: "bienAutre", label: "Autre", hasPrecision: "bienAutrePrecision" }
    ],
    "Environnement": [
      { field: "envPollution", label: "Pollution" },
      { field: "envDechets", label: "Déchets" },
      { field: "envEau", label: "Eau" },
      { field: "envAir", label: "Air" },
      { field: "envOdeur", label: "Odeur" },
      { field: "envAnimaux", label: "Animaux" },
      { field: "envInsectes", label: "Insectes" },
      { field: "envAutre", label: "Autre", hasPrecision: "envAutrePrecision" }
    ],
    "Restauration": [
      { field: "restoIntoxication", label: "Intoxication" },
      { field: "restoAvarie", label: "Avarie" },
      { field: "restoDegoutant", label: "Dégoûtant" },
      { field: "restoRegime", label: "Régime" },
      { field: "restoRetard", label: "Retard" },
      { field: "restoVaisselle", label: "Vaisselle" },
      { field: "restoAutre", label: "Autre", hasPrecision: "restoAutrePrecision" }
    ],
    "Hotel": [
      { field: "hotelLit", label: "Lit" },
      { field: "hotelDouche", label: "Douche" },
      { field: "hotelLingeSale", label: "Linge sale" },
      { field: "hotelChambreSale", label: "Chambre sale" },
      { field: "hotelPoubelle", label: "Poubelle non vidée" },
      { field: "hotelAutre", label: "Autre", hasPrecision: "hotelAutrePrecision" }
    ],
    "Transport": [
      { field: "transportAbsence", label: "Absence" },
      { field: "transportCollision", label: "Collision" },
      { field: "transportDefectueux", label: "Défectueux" },
      { field: "transportNonEquipe", label: "Non équipé" },
      { field: "transportPanne", label: "Panne" },
      { field: "transportRetard", label: "Retard" },
      { field: "transportAutre", label: "Autre", hasPrecision: "transportAutrePrecision" }
    ],
    "Personnel": [
      { field: "personnel", label: "Personnel concerné", hasPrecision: "personnelPrecision" }
    ],
    "Usager / Visiteur": [
      { field: "usager", label: "Usager", hasPrecision: "usagerPrecision" },
      { field: "visiteur", label: "Visiteur", hasPrecision: "visiteurPrecision" }
    ],
    "Identité": [
      { field: "identiteDoublon", label: "Doublon" },
      { field: "identiteAutre", label: "Autre", hasPrecision: "identiteAutrePrecision" }
    ],
    "Autres": [
      { field: "autreElement", label: "Autre élément", hasPrecision: "autreElementPrecision" }
    ]
  };

  constructor(
    private route: ActivatedRoute,
    private incidentService: IncidentService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private router: Router,
    private incidentGrilleService: IncidentGrilleService,
    private schemaService: SchemaService,
    private submissionService: SubmissionService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (!idParam) {
        this.errorMessage = 'ID invalide dans l\'URL';
        this.isLoading = false;
        this.cdr.detectChanges();
        return;
      }

      const id = +idParam;

      this.incidentService.getIncidentById(id).subscribe({
        next: data => {
          const incidentData = Array.isArray(data) ? data.find(i => i.id == id) : data;
          if (!incidentData) {
            this.errorMessage = `Incident avec l'ID ${id} introuvable`;
            this.isLoading = false;
            this.cdr.detectChanges();
            return;
          }

          this.incident = this.normalizeIncidentForForm(incidentData);
          this.initForm(this.incident);

          const concerneGroup = this.getConcerneGroup();
concerneGroup.patchValue({
  patient: !!this.incident.dossierPatient,           // ou le champ correct du backend
  personnel: !!this.incident.personnel,
  visiteur: !!this.incident.visiteur,
  fournisseur: !!this.incident.fournisseur,
  materiel: !!this.incident.materielConcerne,
  organisation: !!this.incident.organisation       // au lieu de 'autreElement'
});


       // Charger les soumissions liées à cet incident et créer les grilles
this.chargerGrillesAlarme();

          
          // Charger les grilles d'alarme
          this.chargerGrillesAlarme();

          // Optionnel : navigation ou état courant
          this.submissionService.setCurrentIncident(this.incident);

          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: err => {
          this.errorMessage = err.message || 'Erreur lors du chargement';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    });
  }

  toggleGrille() {
    this.showGrille = !this.showGrille;
    if (this.showGrille) this.showArbre = false;
  }

  toggleArbre() {
    this.showArbre = !this.showArbre;
    if (this.showArbre) this.showGrille = false;
  }

  private normalizeIncidentForForm(incident: any): any {
    const normalized = { ...incident };
    const booleanFields = Object.values(this.categories).flat().map(f => f.field);

    booleanFields.forEach(field => {
      if (normalized[field] === null || normalized[field] === undefined) {
        normalized[field] = false;
      }
    });

    Object.keys(normalized).forEach(key => {
      if ((normalized[key] === null || normalized[key] === undefined) && !booleanFields.includes(key)) {
        normalized[key] = '';
      }
    });

    // Gestion du statut
    if (normalized.dateCloture) {
      normalized.statut = StatutDeclaration.Cloture;
    } else if (normalized.evaluationDate && normalized.evaluationResponsable) {
      normalized.statut = StatutDeclaration.Resolu;
    } else if (normalized.actionsCorrectives && normalized.actionsCorrectives.length > 0) {
      const toutesTerminees = normalized.actionsCorrectives.every((a: any) => a.estTerminee);
      normalized.statut = toutesTerminees ? StatutDeclaration.Resolu : StatutDeclaration.ActionRequise;
    } else if (normalized.causesImmediates || normalized.causesProfondes || normalized.gravite || normalized.evitable !== null) {
      normalized.statut = StatutDeclaration.EnCoursAnalyse;
    } else if (normalized.id && normalized.dateDeclaration) {
      normalized.statut = StatutDeclaration.Soumis;
    }

    // Déclarant
    if (normalized.declarant) {
      normalized.declarantId = normalized.declarant.id;
      normalized.declarantUserName = normalized.declarant.userName;
      normalized.declarantEmail = normalized.declarant.email;
      normalized.declarantFonction = normalized.declarant.fonction;
      normalized.declarantTel = normalized.declarant.tel;
    }

    ['dateDeclaration', 'dateDetection', 'dateSurvenue', 'dateCloture', 'evaluationDate'].forEach(field => {
      const value = normalized[field];
      if (value) {
        const parsedDate = new Date(value);
        normalized[field] = isNaN(parsedDate.getTime()) ? null : parsedDate;
      }
    });

    return normalized;
  }

  private initForm(incident: any): void {
    this.incidentForm = this.fb.group({});
    Object.keys(incident).forEach(key => {
      this.incidentForm.addControl(key, this.fb.control(incident[key]));
    });

    this.incidentForm.addControl('showConcerne', this.fb.control(false));
    this.incidentForm.addControl('concerne', this.fb.group({
      patient: false,
      personnel: false,
      visiteur: false,
      fournisseur: false,
      materiel: false,
      organisation: false
    }));
  }

  formatDate(date: Date | string | null): string {
    if (!date) return 'N/A';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return this.datePipe.transform(dateObj, 'short') || 'N/A';
  }

  getIncidentField(fieldName: string): any {
    return this.incidentForm.get(fieldName)?.value;
  }

  getTypeLabel(type: number): string {
    const typeLabels: { [key: number]: string } = {
      [TypeEvenement.ErreurMedicamenteuse]: 'Erreur médicamenteuse',
      [TypeEvenement.ChutePatient]: 'Chute patient',
      [TypeEvenement.InfectionNosocomiale]: 'Infection nosocomiale',
      [TypeEvenement.DefaillanceEquipement]: 'Défaillance équipement',
      [TypeEvenement.ErreurDocumentation]: 'Erreur de documentation',
      [TypeEvenement.ProblemeAdministratif]: 'Problème administratif',
      [TypeEvenement.Autre]: 'Autre',
      [TypeEvenement.Incident]: 'Incident'
    };
    return typeLabels[type] || 'Incident';
  }

  getGraviteLabel(gravite: number): string {
    const labels: any = { 1: 'Benin', 2: 'PeuGrave', 3: 'Moyenne', 4: 'Grave', 5: 'TresGrave', 6:'Catastrophique' };
    return labels[gravite] || 'N/A';
  }

  getCategoryKeys(): string[] {
    return Object.keys(this.categories);
  }

  hasDefinedField(catKey: string): boolean {
    return this.categories[catKey] && this.categories[catKey].length > 0;
  }

  isFieldVisible(field: any): boolean {
    const value = this.getIncidentField(field.field);
    if (value === true) return true;
    if (field.hasPrecision && this.getIncidentField(field.hasPrecision)?.trim()) return true;
    return false;
  }

  isCategoryVisible(catKey: string): boolean {
    return this.categories[catKey].some(f => this.isFieldVisible(f));
  }

  getStatusLabel(status: number): string {
    switch (status) {
      case StatutDeclaration.Brouillon: return 'Brouillon';
      case StatutDeclaration.Soumis: return 'Soumis';
      case StatutDeclaration.EnCoursAnalyse: return 'En cours d\'analyse';
      case StatutDeclaration.ActionRequise: return 'Action requise';
      case StatutDeclaration.Resolu: return 'Résolu';
      case StatutDeclaration.Cloture: return 'Clôturé';
      default: return 'N/A';
    }
  }

  getConcerneGroup(): FormGroup {
    return this.incidentForm.get('concerne') as FormGroup;
  }

  ouvrirGrilleAlarme(): void {
    this.router.navigate(['/admin/questions'], { queryParams: { incidentId: this.incident.id } });
  }

chargerGrillesAlarme(): void {
  this.submissionService.getSubmissionsByIncidentId(this.incident.id)
    .pipe(
      map((submissions: SubmissionData[]) => {
        this.submissions = submissions; // assigner pour utilisation ailleurs
        return submissions.map((sub: SubmissionData) => ({
          id: sub.id,
          dateCreation: sub.createdAt,
          nombreReponses: sub.reponses.length
        }));
      })
    )
    .subscribe({
      next: (grilles) => {
        this.grillesAlarme = grilles;
      },
      error: (err) => {
      //  console.error('Erreur chargement grilles:', err);
      }
    });
}


voirGrille(grilleId: number) {
   // console.log('ID de la grille:', grilleId);
    this.router.navigate([`/admin/confirmation/${grilleId}`]);
}


  voirSubmission(submission: any) {
  //  console.log('Voir submission:', submission);
  }

  imprimerSubmission(submission: any) {
   // console.log('Imprimer submission:', submission);
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file && this.incident?.id) {
      const extension = file.name.substring(file.name.lastIndexOf('.'));
      this.selectedFile = new File([file], `${this.incident.id}${extension}`, { type: file.type });
     // console.log('Fichier sélectionné pour l\'incident :', this.selectedFile.name);
    }
  }

  uploadImage() {
    if (!this.selectedFile || !this.incident?.id) return;

    const extension = this.selectedFile.name.split('.').pop();
    const renamedFile = new File([this.selectedFile], `${this.incident.id}.${extension}`, { type: this.selectedFile.type });

    const formData = new FormData();
    formData.append('file', renamedFile);

    this.schemaService.uploadFile(renamedFile, this.incident.id).subscribe({
      next: res => {
  //      console.log('Image uploadée avec succès !', res);
        this.incident.schemaUrl = res.url;
        alert('Image ajoutée à l\'incident.');
      },
      error: err => {
   //     console.error('Erreur upload image', err);
        alert('Erreur lors de l\'upload.');
      }
    });
  }

  // Getter pour vérifier si une grille existe pour cet incident
  get hasGrille(): boolean {
    if (!this.incident?.id || !this.grillesAlarme) return false;
    return this.grillesAlarme.length > 0;
  }

  // Getter pour vérifier si un arbre existe pour cet incident
  get hasArbre(): boolean {
    return !!this.incident?.schemaUrl && this.incident.schemaUrl.trim() !== '';
  }

  // Vérifie si des grilles existent pour cet incident
  grillesAlarmeExistantes(incidentId: number | undefined): boolean {
    if (!incidentId || !this.grillesAlarme) return false;
    return this.grillesAlarme.some(g => g.incidentId === incidentId);
  }

  // Vérifie si un arbre existe pour cet incident
  arbreExistants(incidentId: number | undefined): boolean {
    if (!incidentId || !this.incident?.imageUrl) return false;
    return this.incident.id === incidentId && !!this.incident.imageUrl;
  }
}