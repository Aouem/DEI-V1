import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { TypeEvenement } from '../../../interfaces/TypeEvenement';
import { GraviteEvenement } from '../../../interfaces/GraviteEvenement';
import { IncidentService } from '../../services/incident';
import { StatutDeclaration } from '../../../interfaces/StatutDeclaration';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { EvenementCreateDto } from '../../../interfaces/EvenementCreateDto';
import { Location } from '@angular/common';

interface FormValidationError {
  field: string;
  errors: { [key: string]: any };
}

@Component({
  selector: 'app-incident-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './incident-form.html',
  styleUrls: ['./incident-form.css']
})
export class IncidentFormComponent implements OnInit {
  incidentForm!: FormGroup;
  typesEvenement = Object.values(TypeEvenement).filter(v => typeof v === 'number') as number[];
  gravites = Object.values(GraviteEvenement).filter(v => typeof v === 'number') as number[];
  errorMessage = '';
  successMessage = '';
  isSubmitting = false;
  currentUser: any;
  userRole: string | null = null;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private incidentService: IncidentService,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
      private location: Location
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.userRole = this.authService.getRole()?.toUpperCase() || null;

    this.initForm();
    this.setupConditionalFields();
    this.prefillFormWithDynamicData();
    this.lockCoordinatorSection();

    this.incidentForm.valueChanges.subscribe(() => this.updateStatut());
    this.incidentForm.statusChanges.subscribe(status => {
      if (status === 'INVALID') {
        console.log('Champs invalides :', this.getFormValidationErrors().map(e => e.field));



        // Écoute des changements pour mettre à jour le statut
this.incidentForm.valueChanges.subscribe(() => this.updateStatut());

// Écoute spécifique des champs importants
['causesImmediates', 'causesProfondes', 'gravite', 'evitable', 'dateCloture', 
 'evaluationDate', 'evaluationResponsable'].forEach(field => {
  this.incidentForm.get(field)?.valueChanges.subscribe(() => this.updateStatut());
});

// Écoute des changements sur le FormArray des actions correctives
this.actionsCorrectives.valueChanges.subscribe(() => {
  this.updateStatut();
});
      }
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.incidentService.getIncidentById(+id).subscribe({
          next: (incident) => {
            const incidentString = JSON.stringify(incident);
            const incidentData = JSON.parse(incidentString);

            const dateSurvenue = new Date(incidentData.dateSurvenue);
            const dateEvenement = dateSurvenue.toISOString().split('T')[0];
            const heureEvenement = `${dateSurvenue.getHours().toString().padStart(2, '0')}:${dateSurvenue.getMinutes().toString().padStart(2, '0')}`;

            const formData = {
              ...incidentData,
              descriptionFaits: incidentData.description || '',
              mesuresImmediates: incidentData.mesureImmediat || '',
              numeroEnregistrement: incidentData.code || '',
              causesImmediates: incidentData.causesImmediates || '',
              causesProfondes: incidentData.causesProfondes || '',
              gravite: incidentData.gravite,
              evaluationEfficace: incidentData.evaluationEfficace || false,
              evaluationInefficace: incidentData.evaluationInefficace || false,
              evaluationDate: incidentData.evaluationDate ? new Date(incidentData.evaluationDate).toISOString().split('T')[0] : null,
              evaluationResponsable: incidentData.evaluationResponsable || '',
              dateCloture: incidentData.dateCloture ? new Date(incidentData.dateCloture).toISOString().split('T')[0] : null,
              concernePatient: Boolean(incidentData.dossierPatient),
              concernePersonnel: Boolean(incidentData.personnel),
              concerneVisiteur: Boolean(incidentData.visiteur),
              concerneFournisseur: Boolean(incidentData.fournisseur),
              concerneMateriel: Boolean(incidentData.materielConcerne),
              concerneOrganisation: Boolean(incidentData.organisation),
              evenement: {
                dateEvenement: dateEvenement,
                heureEvenement: heureEvenement,
                type: incidentData.type,
                localisation: incidentData.localisation
              }
            };

            this.actionsCorrectives.clear();
            incidentData.actionsCorrectives.forEach((action: any) => {
              const date = action.dateEcheance ? new Date(action.dateEcheance) : null;
              const formattedDate = date
                ? `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2,'0')}-${date.getDate().toString().padStart(2,'0')}`
                : '';
              this.addActionCorrective({
                description: action.description,
                responsableNom: action.responsableNom,
                responsableId: action.responsableId || 'manual',
                dateEcheance: action.dateEcheance,
                estTerminee: action.estTerminee || false
              });
            });

            this.incidentForm.patchValue(formData);
          },
          error: (error) => {
            console.error('Erreur lors du chargement de l\'incident:', error);
          }
        });
      }
    });
  }

  private initForm(): void {
    this.incidentForm = this.fb.group({
      code: ['', Validators.required],
      type: [TypeEvenement.Incident, Validators.required],
      gravite: [GraviteEvenement.Moyenne, Validators.required],
      statut: [StatutDeclaration.Brouillon],
      evitable: [false, Validators.required],
      mesuresImmediates: ['', Validators.required],
      causesImmediates: [''],
      causesProfondes: [''],
      evaluationEfficace: [false],
      evaluationInefficace: [false],
      evaluationDate: [''],
      evaluationResponsable: [''],
      dateCloture: [''],

      // Concernés
      concernePatient: [false],
      concernePersonnel: [false],
      concerneVisiteur: [false],
      concerneFournisseur: [false],
      concerneMateriel: [false],
      concerneOrganisation: [false],
      concerneBatiment: [false],

      // Nature Accueil
      natureAccueilManqueInfo: [false],
      natureAccueilCommViolente: [false],
      natureAccueilComportement: [false],
      natureAccueilAbsenceEcoute: [false],
      natureAccueilErreurOrientation: [false],
      natureAccueilAutre: [false],
      natureAccueilAutrePrecision: [''],

      // Nature Soins
      natureSoinsRetardPEC: [false],
      natureSoinsComplication: [false],
      natureSoinsErreurMedicamenteuse: [false],
      natureSoinsRetardTraitement: [false],
      natureSoinsInfection: [false],
      natureSoinsChutePatient: [false],
      natureSoinsFugue: [false],
      natureSoinsEscarre: [false],
      natureSoinsDefautTransmission: [false],
      natureSoinsAutre: [false],
      natureSoinsAutrePrecision: [''],

      // Droits
      droitDignite: [false],
      droitReligion: [false],
      droitInfoAbsente: [false],
      droitAccesDossier: [false],
      droitChoixMedecin: [false],
      droitConfidentialite: [false],
      droitConsentement: [false],
      droitAutre: [false],
      droitAutrePrecision: [''],

      // Dossier
      dossierPerte: [false],
      dossierIncomplet: [false],
      dossierInfoManquante: [false],
      dossierAccesNonAutorise: [false],
      dossierMalRedige: [false],
      dossierAutre: [false],
      dossierAutrePrecision: [''],

      // Transport
      transportAbsence: [false],
      transportRetard: [false],
      transportDefectueux: [false],
      transportPanne: [false],
      transportNonEquipe: [false],
      transportCollision: [false],
      transportAutre: [false],
      transportAutrePrecision: [''],

      // Risques
      risqueAES: [false],
      risqueInfection: [false],
      risqueMaladiePro: [false],
      risqueChute: [false],
      risqueTMS: [false],
      risqueChimique: [false],
      risqueRadioactif: [false],
      risquePsycho: [false],
      risqueBlessure: [false],
      risqueHarcelement: [false],
      risqueAutre: [false],
      risqueAutrePrecision: [''],

      // Identité
      identiteConfusion: [false],
      identiteEchange: [false],
      identiteDoublon: [false],
      identiteAutre: [false],
      identiteAutrePrecision: [''],

      // Sécurité
      secuIncendie: [false],
      secuInondation: [false],
      secuExplosion: [false],
      secuEffondrement: [false],
      secuAgression: [false],
      secuChantier: [false],
      secuAutre: [false],
      secuAutrePrecision: [''],

      // Biens
      bienPerte: [false],
      bienDeterioration: [false],
      bienConfusion: [false],
      bienVol: [false],
      bienAutre: [false],
      bienAutrePrecision: [''],

      // Restauration
      restoIntoxication: [false],
      restoAvarie: [false],
      restoDegoutant: [false],
      restoRegime: [false],
      restoRetard: [false],
      restoVaisselle: [false],
      restoAutre: [false],
      restoAutrePrecision: [''],

      // Technique
      techElectricite: [false],
      techPlomberie: [false],
      techClimatisation: [false],
      techFluides: [false],
      techAscenseur: [false],
      techEquipement: [false],
      techAutre: [false],
      techAutrePrecision: [''],

      // Environnement
      envPollution: [false],
      envDechets: [false],
      envEau: [false],
      envAir: [false],
      envOdeur: [false],
      envAnimaux: [false],
      envInsectes: [false],
      envAutre: [false],
      envAutrePrecision: [''],

      // Hotellerie
      hotelChambreSale: [false],
      hotelLingeSale: [false],
      hotelPoubelle: [false],
      hotelLit: [false],
      hotelDouche: [false],
      hotelAutre: [false],
      hotelAutrePrecision: [''],

      // Organisation
      orgRuptureStock: [false],
      orgDefaillanceInfo: [false],
      orgInterruptionAppro: [false],
      orgErreurCommande: [false],
      orgGestionStock: [false],
      orgRetardLivraison: [false],
      orgAutre: [false],
      orgAutrePrecision: [''],




      // Evenement imbriqué
      evenement: this.fb.group({
        dateEvenement: ['', Validators.required],
        heureEvenement: ['', Validators.required],
        type: [TypeEvenement.Incident, Validators.required],
        gravite: [GraviteEvenement.Moyenne, Validators.required],
        localisation: [this.currentUser?.service?.nom || '']
      }),

      descriptionFaits: ['', Validators.required],
      dateReception: ['', Validators.required],
      numeroEnregistrement: [''],
      localisation: ['', Validators.required],
      actionsCorrectives: this.fb.array([])
    });

      // Écoute les changements sur le FormArray des actions correctives
  this.actionsCorrectives.valueChanges.subscribe(() => {
    this.updateStatut();
  });
   // Écoute les changements sur dateCloture, evitable ou gravite
  this.incidentForm.get('dateCloture')?.valueChanges.subscribe(() => this.updateStatut());
  this.incidentForm.get('evitable')?.valueChanges.subscribe(() => this.updateStatut());
  this.incidentForm.get('gravite')?.valueChanges.subscribe(() => this.updateStatut());

  }

  private lockCoordinatorSection(): void {
    const coordinatorFields = [
      'causesImmediates', 'causesProfondes', 'evaluationEfficace', 'evaluationInefficace',
      'evaluationDate', 'evaluationResponsable', 'dateCloture', 'gravite', 'evitable'
    ];

    const isAdmin = this.userRole === 'ADMIN';
    coordinatorFields.forEach(field => {
      const control = this.incidentForm.get(field);
      control ? (isAdmin ? control.enable() : control.disable()) : null;
    });

    if (!isAdmin) this.actionsCorrectives.disable();
    else this.actionsCorrectives.enable();
  }

  private setupConditionalFields(): void {
    const conditionalFields: Record<string, string> = {
      natureAccueilAutre: 'natureAccueilAutrePrecision',
      natureSoinsAutre: 'natureSoinsAutrePrecision',
      droitAutre: 'droitAutrePrecision',
      dossierAutre: 'dossierAutrePrecision',
      transportAutre: 'transportAutrePrecision',
      risqueAutre: 'risqueAutrePrecision',
      identiteAutre: 'identiteAutrePrecision',
      hotelAutre: 'hotelAutrePrecision',
      orgAutre: 'orgAutrePrecision',
      secuAutre: 'secuAutrePrecision',
      bienAutre: 'bienAutrePrecision',
      restoAutre: 'restoAutrePrecision',
      techAutre: 'techAutrePrecision',
      envAutre: 'envAutrePrecision'
    };

    Object.entries(conditionalFields).forEach(([trigger, field]) => {
      this.incidentForm.get(trigger)?.valueChanges.subscribe(checked => {
        const control = this.incidentForm.get(field);
        if (checked) { control?.enable(); control?.setValidators([Validators.required]); }
        else { control?.disable(); control?.clearValidators(); control?.setValue(''); }
        control?.updateValueAndValidity();
      });
    });
  }

  private prefillFormWithDynamicData(incident?: any): void {
  const now = new Date();
  const currentDate = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-${now.getDate().toString().padStart(2,'0')}`;
  const currentTime = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
  const localisation = this.currentUser?.service?.nom || 'Service non spécifié';

  if (incident) {
    const dateSurvenue = new Date(incident.dateSurvenue);
    const dateEvenement = dateSurvenue.toISOString().split('T')[0];
    const heureEvenement = `${dateSurvenue.getHours().toString().padStart(2,'0')}:${dateSurvenue.getMinutes().toString().padStart(2,'0')}`;

    const formData = {
      ...incident,
      descriptionFaits: incident.description || '',
      mesuresImmediates: incident.mesureImmediat || '',
      numeroEnregistrement: incident.code || '',
      causesImmediates: incident.causesImmediates || '',
      causesProfondes: incident.causesProfondes || '',
      gravite: incident.gravite,   // ✅ gravité à la racine
      concernePatient: Boolean(incident.dossierPatient),
      concernePersonnel: Boolean(incident.personnel),
      concerneVisiteur: Boolean(incident.visiteur),
      concerneFournisseur: Boolean(incident.fournisseur),
      concerneMateriel: Boolean(incident.materielConcerne),
      concerneOrganisation: Boolean(incident.organisation),
      evenement: {
        dateEvenement,
        heureEvenement,
        type: incident.type,
        localisation: incident.localisation || localisation
      }
    };

    this.incidentForm.patchValue(formData);

  } else if (!this.isEditMode) {
    const generatedCode = this.generateEventCode();
    this.incidentForm.patchValue({
      code: generatedCode,
      localisation,
      gravite: GraviteEvenement.Moyenne,   // ✅ valeur par défaut à la racine
      
      evitable: true,
      mesuresImmediates: '',
      causesImmediates: '',
      causesProfondes: '',
      evenement: {
        dateEvenement: currentDate,
        heureEvenement: currentTime,
        type: TypeEvenement.Incident,
        localisation
      }
    });
  }

  this.markPrefilledFields();
}


  private generateEventCode(): string {
    const datePart = new Date().toISOString().slice(0,10).replace(/-/g,'');
    const randomPart = Math.random().toString(36).substring(2,6).toUpperCase();
    return `EI-${datePart}-${randomPart}`;
  }

  get actionsCorrectives(): FormArray {
    return this.incidentForm.get('actionsCorrectives') as FormArray;
  }

  addActionCorrective(action?: any) {
    const actionGroup = this.fb.group({
      description: [action?.description || '', Validators.required],
      responsableNom: [action?.responsableNom || '', Validators.required],
      responsableId: [action?.responsableId || 'manual'],
      dateEcheance: [action?.dateEcheance || '', Validators.required],
      estTerminee: [action?.estTerminee || false]
    });
    
    this.actionsCorrectives.push(actionGroup);
  }
  
  removeActionCorrective(index: number): void { 
    this.actionsCorrectives.removeAt(index); 
  }

  private markFormGroupTouched(group: FormGroup | FormArray): void {
    Object.values(group.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup || control instanceof FormArray) this.markFormGroupTouched(control);
    });
  }

  loading = false;
  async onSubmit(): Promise<void> {
    this.markFormGroupTouched(this.incidentForm);
    this.showValidationErrors();

    if (this.incidentForm.invalid) {
      this.errorMessage = 'Veuillez corriger les erreurs du formulaire';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    try {
      const payload = this.prepareFormData();
      console.log('Payload complet:', JSON.stringify(payload, null, 2));
      
      const result = await this.incidentService.createIncident(payload).toPromise();
      this.successMessage = 'Incident enregistré avec succès!';
       if (result?.id) {
    window.dispatchEvent(new CustomEvent('newIncidentCreated', { detail: result.id }));
  }
    setTimeout(() => this.location.back(), 2000);
    } catch (error: any) {
      console.error('Erreur détaillée:', error);
      if (error.error) {
        console.error('Réponse du serveur:', error.error);
      }
      this.errorMessage = error.message || 'Erreur lors de l\'enregistrement';
    } finally {
      this.isSubmitting = false;
    }
  }

  navigateToList(): void {
  this.location.back();  // ✅ 
}

  private prepareFormData(): EvenementCreateDto {
    const formValues = this.incidentForm.getRawValue();
    
    const convertToISODate = (dateStr: string, timeStr: string) => {
      if (!dateStr) return new Date().toISOString();
      const date = new Date(dateStr);
      if (timeStr) { 
        const [hours, minutes] = timeStr.split(':').map(Number); 
        date.setHours(hours, minutes); 
      }
      return date.toISOString();
    };
    
    const toBoolean = (value: any): boolean => value === true || value === 'true' || value === 1;

    // Préparer les actions correctives avec responsableId
    const preparedActions = this.actionsCorrectives.controls.map(control => {
      const actionValue = control.value;
      return {
        description: actionValue.description,
        responsableNom: actionValue.responsableNom,
        responsableId: actionValue.responsableId || 'manual', // Assurer que responsableId n'est pas null
        dateEcheance: new Date(actionValue.dateEcheance).toISOString(),
        estTerminee: actionValue.estTerminee || false,
      };
    });

    return {
      code: formValues.code,
      type: Number(formValues.type),
      gravite: Number(formValues.gravite),
      statut: StatutDeclaration.Brouillon,
      description: formValues.descriptionFaits || '',
      dateSurvenue: convertToISODate(formValues.evenement.dateEvenement, formValues.evenement.heureEvenement),
      dateDetection: new Date().toISOString(),
      dateDeclaration: new Date().toISOString(),
      localisation: formValues.localisation,
      mesureImmediat: formValues.mesuresImmediates,
      evitable: toBoolean(formValues.evitable),

      causesImmediates: formValues.causesImmediates || '', 
      causesProfondes: formValues.causesProfondes || '',
      evaluationEfficace: toBoolean(formValues.evaluationEfficace),
      evaluationInefficace: toBoolean(formValues.evaluationInefficace),
      evaluationDate: formValues.evaluationDate ? new Date(formValues.evaluationDate).toISOString() : null,
      evaluationResponsable: formValues.evaluationResponsable || '',
      dateCloture: formValues.dateCloture ? new Date(formValues.dateCloture).toISOString() : null,

      dossierPatient: toBoolean(formValues.concernePatient),
      dossierPatientPrecision: toBoolean(formValues.concernePatient) ? 'Patient concerné' : '',
      personnel: toBoolean(formValues.concernePersonnel),
      personnelPrecision: toBoolean(formValues.concernePersonnel) ? 'Personnel concerné' : '',
      usager: toBoolean(formValues.concerneVisiteur),
      usagerPrecision: toBoolean(formValues.concerneVisiteur) ? 'Usager concerné' : '',
      visiteur: toBoolean(formValues.concerneVisiteur),
      visiteurPrecision: toBoolean(formValues.concerneVisiteur) ? 'Visiteur concerné' : '',
      fournisseur: toBoolean(formValues.concerneFournisseur),
      fournisseurPrecision: toBoolean(formValues.concerneFournisseur) ? 'Fournisseur concerné' : '',
      materielConcerne: toBoolean(formValues.concerneMateriel),
      materielConcernePrecision: toBoolean(formValues.concerneMateriel) ? 'Matériel concerné' : '',
      organisation: toBoolean(formValues.concerneOrganisation),          // ✅ le champ correct
      organisationPrecision: toBoolean(formValues.concerneOrganisation) ? 'Organisation concernée' : '',
      autreElement: toBoolean(formValues.concerneOrganisation),
      autreElementPrecision: toBoolean(formValues.concerneOrganisation) ? 'Autre élément concerné' : '',

      // Toutes les autres sections du formulaire...
      natureAccueilManqueInfo: toBoolean(formValues.natureAccueilManqueInfo),
      natureAccueilCommViolente: toBoolean(formValues.natureAccueilCommViolente),
      natureAccueilComportement: toBoolean(formValues.natureAccueilComportement),
      natureAccueilAbsenceEcoute: toBoolean(formValues.natureAccueilAbsenceEcoute),
      natureAccueilErreurOrientation: toBoolean(formValues.natureAccueilErreurOrientation),
      natureAccueilAutre: toBoolean(formValues.natureAccueilAutre),
      natureAccueilAutrePrecision: formValues.natureAccueilAutrePrecision || '',

      natureSoinsRetardPEC: toBoolean(formValues.natureSoinsRetardPEC),
      natureSoinsComplication: toBoolean(formValues.natureSoinsComplication),
      natureSoinsErreurMedicamenteuse: toBoolean(formValues.natureSoinsErreurMedicamenteuse),
      natureSoinsRetardTraitement: toBoolean(formValues.natureSoinsRetardTraitement),
      natureSoinsInfection: toBoolean(formValues.natureSoinsInfection),
      natureSoinsChutePatient: toBoolean(formValues.natureSoinsChutePatient),
      natureSoinsFugue: toBoolean(formValues.natureSoinsFugue),
      natureSoinsEscarre: toBoolean(formValues.natureSoinsEscarre),
      natureSoinsDefautTransmission: toBoolean(formValues.natureSoinsDefautTransmission),
      natureSoinsAutre: toBoolean(formValues.natureSoinsAutre),
      natureSoinsAutrePrecision: formValues.natureSoinsAutrePrecision || '',

      droitDignite: toBoolean(formValues.droitDignite),
      droitReligion: toBoolean(formValues.droitReligion),
      droitInfoAbsente: toBoolean(formValues.droitInfoAbsente),
      droitAccesDossier: toBoolean(formValues.droitAccesDossier),
      droitChoixMedecin: toBoolean(formValues.droitChoixMedecin),
      droitConfidentialite: toBoolean(formValues.droitConfidentialite),
      droitConsentement: toBoolean(formValues.droitConsentement),
      droitAutre: toBoolean(formValues.droitAutre),
      droitAutrePrecision: formValues.droitAutrePrecision || '',

      dossierPerte: toBoolean(formValues.dossierPerte),
      dossierIncomplet: toBoolean(formValues.dossierIncomplet),
      dossierInfoManquante: toBoolean(formValues.dossierInfoManquante),
      dossierAccesNonAutorise: toBoolean(formValues.dossierAccesNonAutorise),
      dossierMalRedige: toBoolean(formValues.dossierMalRedige),
      dossierAutre: toBoolean(formValues.dossierAutre),
      dossierAutrePrecision: formValues.dossierAutrePrecision || '',

      transportAbsence: toBoolean(formValues.transportAbsence),
      transportRetard: toBoolean(formValues.transportRetard),
      transportDefectueux: toBoolean(formValues.transportDefectueux),
      transportPanne: toBoolean(formValues.transportPanne),
      transportNonEquipe: toBoolean(formValues.transportNonEquipe),
      transportCollision: toBoolean(formValues.transportCollision),
      transportAutre: toBoolean(formValues.transportAutre),
      transportAutrePrecision: formValues.transportAutrePrecision || '',

      risqueAES: toBoolean(formValues.risqueAES),
      risqueInfection: toBoolean(formValues.risqueInfection),
      risqueMaladiePro: toBoolean(formValues.risqueMaladiePro),
      risqueChute: toBoolean(formValues.risqueChute),
      risqueTMS: toBoolean(formValues.risqueTMS),
      risqueChimique: toBoolean(formValues.risqueChimique),
      risqueRadioactif: toBoolean(formValues.risqueRadioactif),
      risquePsycho: toBoolean(formValues.risquePsycho),
      risqueBlessure: toBoolean(formValues.risqueBlessure),
      risqueHarcelement: toBoolean(formValues.risqueHarcelement),
      risqueAutre: toBoolean(formValues.risqueAutre),
      risqueAutrePrecision: formValues.risqueAutrePrecision || '',

      identiteConfusion: toBoolean(formValues.identiteConfusion),
      identiteEchange: toBoolean(formValues.identiteEchange),
      identiteDoublon: toBoolean(formValues.identiteDoublon),
      identiteAutre: toBoolean(formValues.identiteAutre),
      identiteAutrePrecision: formValues.identiteAutrePrecision || '',

      hotelChambreSale: toBoolean(formValues.hotelChambreSale),
      hotelLingeSale: toBoolean(formValues.hotelLingeSale),
      hotelPoubelle: toBoolean(formValues.hotelPoubelle),
      hotelLit: toBoolean(formValues.hotelLit),
      hotelDouche: toBoolean(formValues.hotelDouche),
      hotelAutre: toBoolean(formValues.hotelAutre),
      hotelAutrePrecision: formValues.hotelAutrePrecision || '',

      orgRuptureStock: toBoolean(formValues.orgRuptureStock),
      orgDefaillanceInfo: toBoolean(formValues.orgDefaillanceInfo),
      orgInterruptionAppro: toBoolean(formValues.orgInterruptionAppro),
      orgErreurCommande: toBoolean(formValues.orgErreurCommande),
      orgGestionStock: toBoolean(formValues.orgGestionStock),
      orgRetardLivraison: toBoolean(formValues.orgRetardLivraison),
      orgAutre: toBoolean(formValues.orgAutre),
      orgAutrePrecision: formValues.orgAutrePrecision || '',

      secuIncendie: toBoolean(formValues.secuIncendie),
      secuInondation: toBoolean(formValues.secuInondation),
      secuExplosion: toBoolean(formValues.secuExplosion),
      secuEffondrement: toBoolean(formValues.secuEffondrement),
      secuAgression: toBoolean(formValues.secuAgression),
      secuChantier: toBoolean(formValues.secuChantier),
      secuAutre: toBoolean(formValues.secuAutre),
      secuAutrePrecision: formValues.secuAutrePrecision || '',

      bienPerte: toBoolean(formValues.bienPerte),
      bienDeterioration: toBoolean(formValues.bienDeterioration),
      bienConfusion: toBoolean(formValues.bienConfusion),
      bienVol: toBoolean(formValues.bienVol),
      bienAutre: toBoolean(formValues.bienAutre),
      bienAutrePrecision: formValues.bienAutrePrecision || '',

      restoIntoxication: toBoolean(formValues.restoIntoxication),
      restoAvarie: toBoolean(formValues.restoAvarie),
      restoDegoutant: toBoolean(formValues.restoDegoutant),
      restoRegime: toBoolean(formValues.restoRegime),
      restoRetard: toBoolean(formValues.restoRetard),
      restoVaisselle: toBoolean(formValues.restoVaisselle),
      restoAutre: toBoolean(formValues.restoAutre),
      restoAutrePrecision: formValues.restoAutrePrecision || '',

      techElectricite: toBoolean(formValues.techElectricite),
      techPlomberie: toBoolean(formValues.techPlomberie),
      techClimatisation: toBoolean(formValues.techClimatisation),
      techFluides: toBoolean(formValues.techFluides),
      techAscenseur: toBoolean(formValues.techAscenseur),
      techEquipement: toBoolean(formValues.techEquipement),
      techAutre: toBoolean(formValues.techAutre),
      techAutrePrecision: formValues.techAutrePrecision || '',

      envPollution: toBoolean(formValues.envPollution),
      envDechets: toBoolean(formValues.envDechets),
      envEau: toBoolean(formValues.envEau),
      envAir: toBoolean(formValues.envAir),
      envOdeur: toBoolean(formValues.envOdeur),
      envAnimaux: toBoolean(formValues.envAnimaux),
      envInsectes: toBoolean(formValues.envInsectes),
      envAutre: toBoolean(formValues.envAutre),
      envAutrePrecision: formValues.envAutrePrecision || '',

      actionsCorrectives: preparedActions,
      
      declarantId: this.currentUser?.id?.toString() || '',
      familleEvenementIndesirableId: 1
    };
  }

  private getFormValidationErrors(): FormValidationError[] {
    const errors: FormValidationError[] = [];
    const recursiveCheck = (group: FormGroup | FormArray, path = '') => {
      Object.entries(group.controls).forEach(([key, control]) => {
        const fullPath = path ? `${path}.${key}` : key;
        if (control.invalid && control instanceof FormControl) errors.push({ field: fullPath, errors: control.errors! });
        else if (control instanceof FormGroup || control instanceof FormArray) recursiveCheck(control, fullPath);
      });
    };
    recursiveCheck(this.incidentForm);
    return errors;
  }

  get evitableControl(): FormControl { 
    return this.incidentForm.get('evitable') as FormControl; 
  }

  get evenementGroup(): FormGroup { 
    return this.incidentForm.get('evenement') as FormGroup; 
  }

  showValidationErrors(): void {
    const errors = this.getFormValidationErrors();
    console.log('Erreurs de validation:', errors);
    
    const mesuresError = this.incidentForm.get('mesuresImmediates')?.errors;
    if (mesuresError) {
      console.log('Erreur mesuresImmediates:', mesuresError);
    }
  }

  private lockAllExceptCoordinator(): void {
    const coordinatorFields = [
      'causesImmediates', 'causesProfondes', 'evaluationEfficace', 'evaluationInefficace',
      'evaluationDate', 'evaluationResponsable', 'dateCloture', 'gravite', 'evitable'
    ];

    this.incidentForm.disable();

    coordinatorFields.forEach(field => {
      const control = this.incidentForm.get(field);
      if (control) control.enable();
    });

    const dateControl = this.incidentForm.get('evenement.dateEvenement');
    if (dateControl) {
      dateControl.enable();
    }

    const receptionDateControl = this.incidentForm.get('dateReception');
    if (receptionDateControl) {
      receptionDateControl.enable();
    }

    this.actionsCorrectives.enable();
  }

  private markPrefilledFields(): void {
    Object.keys(this.incidentForm.controls).forEach(field => {
      const control = this.incidentForm.get(field);
      const element = document.querySelector(`[formControlName="${field}"]`);

      if (control && element) {
        if (control.value !== null && control.value !== '' && (element as HTMLInputElement).type !== 'checkbox') {
          element.classList.add('prefilled');
        }

        if ((element as HTMLInputElement).type === 'checkbox' && control.value === true) {
          const parent = element.parentElement;
          if (parent) {
            parent.classList.add('prefilled-checkbox');
            const span = parent.querySelector('label span');
            if (span) span.classList.add('prefilled-label');
          }
        }
      }
    });

    const evenementGroup = this.incidentForm.get('evenement') as FormGroup;
    Object.keys(evenementGroup.controls).forEach(field => {
      const control = evenementGroup.get(field);
      const element = document.querySelector(`[formControlName="${field}"]`);
      if (control && control.value && element) element.classList.add('prefilled');
    });
  }

   // ------------------ LOGIQUE STATUT AUTOMATIQUE ------------------
private updateStatut(): void {
  const form = this.incidentForm.getRawValue();
  let nouveauStatut = StatutDeclaration.Brouillon;

  // Si l'incident est clôturé
  if (form.dateCloture) {
    nouveauStatut = StatutDeclaration.Cloture;
  }
  // Si l'évaluation est faite
  else if (form.evaluationDate && form.evaluationResponsable) {
    nouveauStatut = StatutDeclaration.Resolu;
  }
  // Si des actions correctives sont présentes
  else if (form.actionsCorrectives && form.actionsCorrectives.length > 0) {
    // Vérifie si toutes les actions sont terminées
    const toutesTerminees = form.actionsCorrectives.every((a: any) => a.estTerminee);
    nouveauStatut = toutesTerminees ? StatutDeclaration.Resolu : StatutDeclaration.ActionRequise;
  }
  // Si les champs du coordinateur sont remplis
  else if (form.causesImmediates || form.causesProfondes || form.gravite || form.evitable !== null) {
    nouveauStatut = StatutDeclaration.EnCoursAnalyse;
  }
  // Si le formulaire est soumis (tous les champs obligatoires remplis)
  else if (this.incidentForm.valid) {
    nouveauStatut = StatutDeclaration.Soumis;
  }

  // Mise à jour du statut
  if (this.incidentForm.value.statut !== nouveauStatut) {
    this.incidentForm.patchValue({ statut: nouveauStatut }, { emitEvent: false });
  }
}

getStatutLabel(statut: number): string {
  switch (statut) {
    case StatutDeclaration.Brouillon: return 'Brouillon';
    case StatutDeclaration.Soumis: return 'Soumis';
    case StatutDeclaration.EnCoursAnalyse: return 'En cours d\'analyse';
    case StatutDeclaration.ActionRequise: return 'Action requise';
    case StatutDeclaration.Resolu: return 'Résolu';
    case StatutDeclaration.Cloture: return 'Clôturé';
    default: return 'Inconnu';
  }
}
getBadgeClass(statut: number): string {
  switch(statut) {
    case 0: return 'bg-secondary text-white';
    case 1: return 'bg-primary text-white';
    case 2: return 'bg-info text-dark';
    case 3: return 'bg-warning text-dark';
    case 4: return 'bg-success text-white';
    case 5: return 'bg-dark text-white';
    default: return 'bg-light text-dark';
  }
}

getProgressBarClass(statut: number): string {
  switch(statut) {
    case 0: return 'bg-secondary';
    case 1: return 'bg-primary';
    case 2: return 'bg-info';
    case 3: return 'bg-warning';
    case 4: return 'bg-success';
    case 5: return 'bg-dark';
    default: return 'bg-light';
  }
}

getStatutIcon(statut: number): string {
  switch(statut) {
    case 0: return 'bi bi-pencil-square';      // Brouillon
    case 1: return 'bi bi-send';               // Soumis
    case 2: return 'bi bi-search';             // En cours d'analyse
    case 3: return 'bi bi-exclamation-triangle'; // Action requise
    case 4: return 'bi bi-check-circle';       // Résolu
    case 5: return 'bi bi-lock';               // Clôturé
    default: return 'bi bi-question-circle';
  }
}

}