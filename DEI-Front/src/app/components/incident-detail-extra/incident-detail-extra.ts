import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IncidentService } from '../../services/incident';
import { TypeEvenement } from '../../../interfaces/TypeEvenement';
import { Subject, debounceTime } from 'rxjs';
import { ChartConfiguration, ChartData } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


export enum StatutDeclaration {
  Brouillon = 0,
  Soumis = 1,
  EnCoursAnalyse = 2,
  ActionRequise = 3,
  Resolu = 4,
  Cloture = 5
}


@Component({
  selector: 'app-incident-detail-extra',
  standalone: true,
  imports: [CommonModule, FormsModule, NgChartsModule],
  templateUrl: './incident-detail-extra.html',
  styleUrls: ['./incident-detail-extra.css']
})
export class IncidentDetailExtraComponent implements OnInit {
  incidents: any[] = [];
    familles: string[] = []; 

     isChartLoading = true;
  chartError = '';
  
  // Statistiques
  matriceCount: any = {};

  // Chart data
  matriceChartData: any;

///indicateur 5 ans
    public croissanceParAn: any[] = [];
  public croissanceChartData!: ChartData<'line'>;
  public croissanceChartOptions: ChartConfiguration['options'];



  incident: any;
  isLoading = true;
  errorMessage = '';

  currentPage = 1;
  pageSize = 10;
  public sortedGraviteLabels: string[] = [];
  totalFilteredIncidents: number = 0;
  selectedFamille: string = '';
  filterText = '';
  private filterSubject = new Subject<string>();
  sortFields: { field: string, asc: boolean }[] = [];
  totalIncidents = 0;
  statutCount: { [key: string]: number } = {};
  statutPercent: { [key: string]: number } = {};
  graviteCount: { [key: string]: number } = {};
  gravitePercent: { [key: string]: number } = {};
  familleCount: { [key: string]: number } = {};
  famillePercent: { [key: string]: number } = {};
  statsMatrix: { [statut: string]: { [gravite: string]: number } } = {};
  graviteLabels: string[] = [];
  viewMode: 'statut' | 'gravite' | 'famille' | 'matrix' = 'statut';
  selectedIncident: any;



  startDate: string = '';
endDate: string = '';
filteredCount: number = 0;
  paginatedIncidents: any[] = [];  // <-- ajout de cette ligne



  // Configuration des graphiques
  public statutChartData!: ChartData<'bar'>;
  public graviteChartData!: ChartData<'bar'>;
  public matrixChartData!: ChartData<'bar'>;

  public chartPlugins = [];

  
  // Graphiques famille
  public familleChartData!: ChartData<'bar'>;
  public familleGraviteChartData!: ChartData<'bar'>;
  public familleStatutChartData!: ChartData<'bar'>;
  public sousFamilleGraviteChartData!: ChartData<'bar'>;
  public sousFamilleStatutChartData!: ChartData<'bar'>;

  public sousFamilleChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: ''
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      }
    }
  };

  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: ''
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };
  currentYear: number;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private incidentService: IncidentService,
    private cdr: ChangeDetectorRef
  ) { this.currentYear = new Date().getFullYear();
    this.initCroissanceChartOptions();}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) this.loadIncidentById(+idParam);
      else this.loadAllIncidents();
    });

    this.filterSubject.pipe(debounceTime(300)).subscribe(() => {
      this.currentPage = 1;
      this.cdr.detectChanges();
    });
  }


   private initCroissanceChartOptions() {
  this.croissanceChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Évolution des incidents par gravité sur 5 ans'
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Nombre d\'incidents'
        },
        ticks: {
          stepSize: 1
        }
      },
      x: {
        title: {
          display: true,
          text: 'Année'
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };
}
private calculateCroissanceParAn() {
//  console.log('=== DEBUG calculateCroissanceParAn ===');
  
  // Définir une plage fixe qui inclut 2025
  const startYear = 2021;
  const endYear = 2025;
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
  
 // console.log('🔍 Plage d\'années analysée:', years);
 // console.log('🔍 Nombre total d\'incidents:', this.incidents.length);

  const graviteOrder = ['Bénin', 'Peu grave', 'Moyenne', 'Grave', 'Très grave', 'Catastrophique', 'N/A'];
  const dataByYear: { [year: number]: { [gravite: string]: number } } = {};
  
  years.forEach(year => {
    dataByYear[year] = {};
    graviteOrder.forEach(gravite => {
      dataByYear[year][gravite] = 0;
    });
  });

  // Compter les incidents avec debug détaillé
  let totalComptes = 0;
  
  this.incidents.forEach((incident, index) => {
    if (incident.dateDeclaration) {
      try {
        const incidentDate = new Date(incident.dateDeclaration);
        if (!isNaN(incidentDate.getTime())) {
          const incidentYear = incidentDate.getFullYear();
          const gravite = this.getGraviteLabel(incident.gravite);
          
          if (years.includes(incidentYear)) {
            dataByYear[incidentYear][gravite] = (dataByYear[incidentYear][gravite] || 0) + 1;
            totalComptes++;
            
            // Afficher les 5 premiers incidents pour debug
            if (totalComptes <= 5) {
           //   console.log(`✓ Incident ${index}: année ${incidentYear}, gravité ${gravite}`);
            }
          }
        }
      } catch (error) {
     //   console.error('Erreur avec l\'incident:', incident, error);
      }
    }
  });

 // console.log(`📊 Incidents comptabilisés: ${totalComptes}`);

  // Calculer les totaux et pourcentages de croissance
  this.croissanceParAn = years.map((year, index) => {
    const yearData = dataByYear[year];
    const total = Object.values(yearData).reduce((sum, count) => sum + count, 0);
    
    let croissance = 0;
    if (index > 0) {
      const previousYear = years[index - 1];
      const previousTotal = Object.values(dataByYear[previousYear]).reduce((sum, count) => sum + count, 0);
      if (previousTotal > 0) {
        croissance = ((total - previousTotal) / previousTotal) * 100;
      }
    }

   // console.log(`📅 Année ${year}: total=${total}, croissance=${croissance}%`, yearData);

    return {
      annee: year,
      data: yearData,
      total: total,
      croissance: croissance
    };
  });

//  console.log('📈 Données finales:', this.croissanceParAn);
  this.updateCroissanceChart();
}


private updateCroissanceChart() {
//  console.log('=== DEBUG updateCroissanceChart ===');
  
  if (!this.croissanceParAn || this.croissanceParAn.length === 0) {
 //   console.error('❌ Aucune donnée pour le graphique');
    return;
  }

  const graviteOrder = ['Bénin', 'Peu grave', 'Moyenne', 'Grave', 'Très grave', 'Catastrophique', 'N/A'];
  const colors = [
    '#4BC0C0', '#FFCE56', '#FF9F40', '#FF6384', '#9966FF', '#36A2EB', '#C9CBCF'
  ];

  // Vérifier qu'il y a des données à afficher
const hasData = this.croissanceParAn.some(annee => 
  Object.values(annee.data).some(count => typeof count === 'number' && count > 0)
);


  if (!hasData) {
  //  console.warn('⚠️ Aucune donnée positive pour le graphique');
    // Créer un graphique vide mais avec la structure correcte
    this.croissanceChartData = {
      labels: this.croissanceParAn.map(y => y.annee.toString()),
      datasets: graviteOrder.map((gravite, index) => ({
        label: gravite,
        data: this.croissanceParAn.map(() => 0),
        borderColor: colors[index],
        backgroundColor: colors[index] + '40',
        tension: 0.3,
        fill: false
      }))
    };
    return;
  }
  

  const datasets = graviteOrder.map((gravite, index) => {
    const data = this.croissanceParAn.map(anneeData => anneeData.data[gravite] || 0);
  //  console.log(`📊 Dataset ${gravite}:`, data);
    
    return {
      label: gravite,
      data: data,
      borderColor: colors[index],
      backgroundColor: colors[index] + '40',
      tension: 0.3,
      fill: false
    };
  });

  this.croissanceChartData = {
    labels: this.croissanceParAn.map(y => y.annee.toString()),
    datasets: datasets
  };

 // console.log('✅ Graphique mis à jour:', this.croissanceChartData);
}

private calculateCroissanceAvecFiltres() {
  const filteredIncidents = this.getFilteredIncidents();
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 4 + i);
  
  const graviteOrder = ['Bénin', 'Peu grave', 'Moyenne', 'Grave', 'Très grave', 'Catastrophique', 'N/A'];
  const dataByYear: { [year: number]: { [gravite: string]: number } } = {};
  
  years.forEach(year => {
    dataByYear[year] = {};
    graviteOrder.forEach(gravite => {
      dataByYear[year][gravite] = 0;
    });
  });

  // Utiliser les incidents filtrés
  filteredIncidents.forEach(incident => {
    if (incident.dateDeclaration) {
      const incidentYear = new Date(incident.dateDeclaration).getFullYear();
      if (years.includes(incidentYear)) {
        const gravite = this.getGraviteLabel(incident.gravite);
        dataByYear[incidentYear][gravite] = (dataByYear[incidentYear][gravite] || 0) + 1;
      }
    }
  });

  this.croissanceParAn = years.map((year, index) => {
    const yearData = dataByYear[year];
    const total = Object.values(yearData).reduce((sum, count) => sum + count, 0);
    
    let croissance = 0;
    if (index > 0) {
      const previousYear = years[index - 1];
      const previousTotal = Object.values(dataByYear[previousYear]).reduce((sum, count) => sum + count, 0);
      if (previousTotal > 0) {
        croissance = ((total - previousTotal) / previousTotal) * 100;
      }
    }

    return {
      annee: year,
      data: yearData,
      total: total,
      croissance: croissance
    };
  });

  this.updateCroissanceChart();
}
// Méthode pour calculer la tendance générale
getTendanceGenerale(): number {
  if (this.croissanceParAn.length < 2) return 0;
  
  const firstYear = this.croissanceParAn[0];
  const lastYear = this.croissanceParAn[this.croissanceParAn.length - 1];
  
  if (firstYear.total === 0) return 0;
  
  return ((lastYear.total - firstYear.total) / firstYear.total) * 100;
}

// Méthode pour trouver la gravité la plus fréquente
getGravitePlusFrequente(): string {
  try {
    if (!this.croissanceParAn || this.croissanceParAn.length === 0) {
      return 'Aucune donnée disponible';
    }
    
    // Créer un objet pour stocker les totaux
    const totals: { [key: string]: number } = {};
    
    // Liste complète des gravités possibles
    const allGravites = ['Bénin', 'Peu grave', 'Moyenne', 'Grave', 'Très grave', 'Catastrophique', 'N/A'];
    
    // Initialiser tous les totaux à 0
    allGravites.forEach(gravite => {
      totals[gravite] = 0;
    });
    
    // Calculer les totaux sur toutes les années
    this.croissanceParAn.forEach(anneeData => {
      allGravites.forEach(gravite => {
        if (anneeData.data && anneeData.data[gravite]) {
          totals[gravite] += anneeData.data[gravite];
        }
      });
    });
    
    // Trouver la gravité avec le total maximum
    let maxGravite = 'N/A';
    let maxCount = 0;
    
    allGravites.forEach(gravite => {
      if (totals[gravite] > maxCount) {
        maxCount = totals[gravite];
        maxGravite = gravite;
      }
    });
    
    if (maxCount === 0) {
      return 'Aucun incident recensé sur la période';
    }
    
    return `${maxGravite} (${maxCount} incident${maxCount > 1 ? 's' : ''})`;
    
  } catch (error) {
  //  console.error('Erreur dans getGravitePlusFrequente:', error);
    return 'Erreur de calcul';
  }
}
// Méthode de debug temporaire
debugCroissanceData() {
 // console.log('Données de croissance:', this.croissanceParAn);
 // console.log('Labels de gravité triés:', this.sortedGraviteLabels);
  
  if (this.croissanceParAn && this.croissanceParAn.length > 0) {
    this.croissanceParAn.forEach(annee => {
  //    console.log(`Année ${annee.annee}:`, annee.data);
    });
  }
}

  private loadIncidentById(id: number) {
    this.incidentService.getIncidentById(id).subscribe({
      next: data => {
        this.incident = Array.isArray(data) ? data.find(i => i.id === id) : data;
        this.isLoading = false;
        this.updateStats();
        this.cdr.detectChanges();
      },
      error: err => {
        this.errorMessage = err.message || 'Erreur lors du chargement';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private loadAllIncidents() {
    this.incidentService.getIncidents().subscribe({
      next: data => {
        this.incidents = (Array.isArray(data) ? data : []).map(inc => ({
          ...inc,
          hasGrille: !!inc['grille'],
          hasArbre: !!inc['arbre']
        }));
        this.isLoading = false;
        this.updateStats();
        this.updateFamilleChart(this.incidents);
        this.updateFamilleCharts(this.incidents);
              this.calculateCroissanceParAn(); // ← Ajouter cette ligne

        this.cdr.detectChanges();
      },
      error: err => {
        this.errorMessage = err.message || 'Erreur lors du chargement';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // --------------------- Filtrage ---------------------
filterByFamille() {
  const filtered = this.getFilteredIncidents();
  this.totalFilteredIncidents = filtered.length;
  
  this.currentPage = 1;

  // Mettre à jour la pagination
  this.paginatedIncidents = filtered.slice(
    (this.currentPage - 1) * this.pageSize,
    this.currentPage * this.pageSize
  );

  // Mettre à jour toutes les statistiques avec les nouvelles données filtrées
  this.updateStats();
  this.calculateCroissanceAvecFiltres(); // ← Ajouter cette ligne

  this.cdr.detectChanges();
}


getFilteredByFamille(): any[] {
  let filtered = this.incidents;

  // 🔎 Filtre famille
  if (this.selectedFamille && this.selectedFamille !== 'Toutes') {
    filtered = filtered.filter(i =>
      this.detectFamille(i).some(fs => fs.famille === this.selectedFamille)
    );
  }

  // 🔎 Filtre période
  if (this.startDate) {
    const start = new Date(this.startDate);
    filtered = filtered.filter(i => new Date(i.dateDeclaration) >= start);
  }
  if (this.endDate) {
    const end = new Date(this.endDate);
    filtered = filtered.filter(i => new Date(i.dateDeclaration) <= end);
  }

  return filtered;
}


getPagedFamilleIncidents(): any[] {
  const filtered = this.getFilteredIncidents();
  const sorted = [...filtered].sort((a, b) => {
    const ta = a?.dateDeclaration ? new Date(a.dateDeclaration).getTime() : 0;
    const tb = b?.dateDeclaration ? new Date(b.dateDeclaration).getTime() : 0;
    return tb - ta;
  });
  const start = (this.currentPage - 1) * this.pageSize;
  return sorted.slice(start, start + this.pageSize);
}

  getFamilles(includeToutes: boolean = false): string[] {
    const familles = Array.from(new Set(
      this.incidents.flatMap(i => this.detectFamille(i).map(fs => fs.famille))
    ));
    return includeToutes ? ['Toutes', ...familles] : familles;
  }

  // ----- Pagination -----
  get totalFamillePages(): number {
    return Math.ceil(this.totalFilteredIncidents / this.pageSize) || 1;
  }

  get totalFamillePagesArray(): number[] {
    return Array.from({ length: this.totalFamillePages }, (_, i) => i + 1);
  }

  goToPage(page: number) {
    if (page < 1) page = 1;
    if (page > this.totalFamillePages) page = this.totalFamillePages;
    this.currentPage = page;
  }



  updateStats() {
  const filteredIncidents = this.getFilteredIncidents(); // Utiliser les données filtrées
  
  this.statutCount = {};
  this.graviteCount = {};
  this.statsMatrix = {};
  this.graviteLabels = [];
  this.familleCount = {};
  this.famillePercent = {};

  // Comptage et matrice
  filteredIncidents.forEach(inc => {
    const statutNum = inc.statut ?? -1;
    const graviteNum = inc.gravite ?? -1;

    const statut = this.getStatusLabel(statutNum);
    const gravite = this.getGraviteLabel(graviteNum);

    // Comptage
    this.statutCount[statut] = (this.statutCount[statut] || 0) + 1;
    this.graviteCount[gravite] = (this.graviteCount[gravite] || 0) + 1;

    // Matrice
    if (!this.statsMatrix[statut]) this.statsMatrix[statut] = {};
    this.statsMatrix[statut][gravite] = (this.statsMatrix[statut][gravite] || 0) + 1;

    // Labels gravité uniques
    if (!this.graviteLabels.includes(gravite)) this.graviteLabels.push(gravite);

    // Comptage par famille
    this.detectFamille(inc).forEach(fs => {
      this.familleCount[fs.famille] = (this.familleCount[fs.famille] || 0) + 1;
    });
  });

  // Tri gravité selon ordre croissant
  const graviteOrderAsc = ['Bénin', 'Peu grave', 'Moyenne', 'Grave', 'Très grave', 'Catastrophique', 'N/A'];
  this.sortedGraviteLabels = this.graviteLabels.slice().sort((a, b) => graviteOrderAsc.indexOf(a) - graviteOrderAsc.indexOf(b));

  const total = filteredIncidents.length || 1;
  
  // Calcul des pourcentages
  Object.keys(this.statutCount).forEach(k => this.statutPercent[k] = Math.round(this.statutCount[k] / total * 100));
  Object.keys(this.graviteCount).forEach(k => this.gravitePercent[k] = Math.round(this.graviteCount[k] / total * 100));
  Object.keys(this.familleCount).forEach(k => this.famillePercent[k] = Math.round(this.familleCount[k] / total * 100));

  this.totalFilteredIncidents = filteredIncidents.length;
  this.totalIncidents = filteredIncidents.length;

  

  // Mise à jour des graphiques avec les données filtrées
  this.updateChartData();
  this.updateFamilleChart(filteredIncidents);
  this.updateFamilleCharts(filteredIncidents);
    this.calculateCroissanceAvecFiltres(); // ← Ajouter cette ligne

}
// Ajoutez cette méthode dans la classe IncidentDetailExtraComponent
getTendanceGeneraleAbsolue(): number {
  return Math.abs(this.getTendanceGenerale());
}

  private updateChartData() {
    // Graphique pour les statuts
    this.statutChartData = {
      labels: Object.keys(this.statutCount),
      datasets: [
        {
          label: 'Nombre d\'incidents',
          data: Object.values(this.statutCount),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
          borderColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
          borderWidth: 1
        }
      ]
    };

    // Graphique pour la gravité
    this.graviteChartData = {
      labels: this.sortedGraviteLabels,
      datasets: [
        {
          label: 'Nombre d\'incidents',
          data: this.sortedGraviteLabels.map(label => this.graviteCount[label] || 0),
          backgroundColor: ['#4BC0C0', '#FFCE56', '#FF9F40', '#FF6384', '#9966FF', '#36A2EB', '#C9CBCF'],
          borderColor: ['#4BC0C0', '#FFCE56', '#FF9F40', '#FF6384', '#9966FF', '#36A2EB', '#C9CBCF'],
          borderWidth: 1
        }
      ]
    };

    // Graphique pour la matrice statut/gravité
    const statutLabels = Object.keys(this.statsMatrix).sort();
    const datasets = this.sortedGraviteLabels.map((gravite, index) => {
      const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF'];
      return {
        label: gravite,
        data: statutLabels.map(statut => this.statsMatrix[statut][gravite] || 0),
        backgroundColor: colors[index % colors.length],
        borderColor: colors[index % colors.length],
        borderWidth: 1
      };
    });

    this.matrixChartData = {
      labels: statutLabels,
      datasets: datasets
    };
  }

  private updateFamilleChart(filteredIncidents: any[]) {
    // Comptage par famille
    const familleCount: { [key: string]: number } = {};
    filteredIncidents.forEach(inc => {
      this.detectFamille(inc).forEach(fs => {
        familleCount[fs.famille] = (familleCount[fs.famille] || 0) + 1;
      });
    });

    // Labels uniques
    const labels = Object.keys(familleCount);

    this.familleChartData = {
      labels,
      datasets: [
        {
          label: 'Nombre d\'incidents',
          data: labels.map(f => familleCount[f]),
          backgroundColor: labels.map((_, i) => `hsl(${i * 40 % 360}, 70%, 60%)`),
          borderColor: labels.map((_, i) => `hsl(${i * 40 % 360}, 70%, 40%)`),
          borderWidth: 1
        }
      ]
    };
  }

  private updateFamilleCharts(filteredIncidents: any[]) {
    // Famille par gravité
    const familleGraviteData: { [famille: string]: { [gravite: string]: number } } = {};
    const familleStatutData: { [famille: string]: { [statut: string]: number } } = {};
    const sousFamilleGraviteData: { [sousFamille: string]: { [gravite: string]: number } } = {};
    const sousFamilleStatutData: { [sousFamille: string]: { [statut: string]: number } } = {};

    filteredIncidents.forEach(inc => {
      const gravite = this.getGraviteLabel(inc.gravite);
      const statut = this.getStatusLabel(inc.statut);

      this.detectFamille(inc).forEach(fs => {
        // Famille par gravité
        if (!familleGraviteData[fs.famille]) familleGraviteData[fs.famille] = {};
        familleGraviteData[fs.famille][gravite] = (familleGraviteData[fs.famille][gravite] || 0) + 1;

        // Famille par statut
        if (!familleStatutData[fs.famille]) familleStatutData[fs.famille] = {};
        familleStatutData[fs.famille][statut] = (familleStatutData[fs.famille][statut] || 0) + 1;

        // Sous-famille par gravité
        if (!sousFamilleGraviteData[fs.sousFamille]) sousFamilleGraviteData[fs.sousFamille] = {};
        sousFamilleGraviteData[fs.sousFamille][gravite] = (sousFamilleGraviteData[fs.sousFamille][gravite] || 0) + 1;

        // Sous-famille par statut
        if (!sousFamilleStatutData[fs.sousFamille]) sousFamilleStatutData[fs.sousFamille] = {};
        sousFamilleStatutData[fs.sousFamille][statut] = (sousFamilleStatutData[fs.sousFamille][statut] || 0) + 1;
      });
    });

    // Préparer les données pour les graphiques
    this.prepareFamilleGraviteChart(familleGraviteData);
    this.prepareFamilleStatutChart(familleStatutData);
    this.prepareSousFamilleGraviteChart(sousFamilleGraviteData);
    this.prepareSousFamilleStatutChart(sousFamilleStatutData);
  }

  private prepareFamilleGraviteChart(data: { [famille: string]: { [gravite: string]: number } }) {
    const familles = Object.keys(data);
    const gravites = this.sortedGraviteLabels;

    const datasets = gravites.map((gravite, index) => {
      const colors = ['#4BC0C0', '#FFCE56', '#FF9F40', '#FF6384', '#9966FF', '#36A2EB', '#C9CBCF'];
      return {
        label: gravite,
        data: familles.map(famille => data[famille][gravite] || 0),
        backgroundColor: colors[index % colors.length],
        borderColor: colors[index % colors.length],
        borderWidth: 1
      };
    });

    this.familleGraviteChartData = {
      labels: familles,
      datasets: datasets
    };
  }

  private prepareFamilleStatutChart(data: { [famille: string]: { [statut: string]: number } }) {
    const familles = Object.keys(data);
    const statuts = Object.keys(this.statutCount).sort();

    const datasets = statuts.map((statut, index) => {
      const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
      return {
        label: statut,
        data: familles.map(famille => data[famille][statut] || 0),
        backgroundColor: colors[index % colors.length],
        borderColor: colors[index % colors.length],
        borderWidth: 1
      };
    });

    this.familleStatutChartData = {
      labels: familles,
      datasets: datasets
    };
  }

  private prepareSousFamilleGraviteChart(data: { [sousFamille: string]: { [gravite: string]: number } }) {
    const sousFamilles = Object.keys(data).slice(0, 10); // Limiter à 10 pour éviter la surcharge
    const gravites = this.sortedGraviteLabels;

    const datasets = gravites.map((gravite, index) => {
      const colors = ['#4BC0C0', '#FFCE56', '#FF9F40', '#FF6384', '#9966FF', '#36A2EB', '#C9CBCF'];
      return {
        label: gravite,
        data: sousFamilles.map(sousFamille => data[sousFamille][gravite] || 0),
        backgroundColor: colors[index % colors.length],
        borderColor: colors[index % colors.length],
        borderWidth: 1
      };
    });

    this.sousFamilleGraviteChartData = {
      labels: sousFamilles,
      datasets: datasets
    };
  }

  private prepareSousFamilleStatutChart(data: { [sousFamille: string]: { [statut: string]: number } }) {
    const sousFamilles = Object.keys(data).slice(0, 10); // Limiter à 10 pour éviter la surcharge
    const statuts = Object.keys(this.statutCount).sort();

    const datasets = statuts.map((statut, index) => {
      const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
      return {
        label: statut,
        data: sousFamilles.map(sousFamille => data[sousFamille][statut] || 0),
        backgroundColor: colors[index % colors.length],
        borderColor: colors[index % colors.length],
        borderWidth: 1
      };
    });

    this.sousFamilleStatutChartData = {
      labels: sousFamilles,
      datasets: datasets
    };
  }

  // ----- Labels -----
  public getTypeLabel(type: number): string {
    const labels: { [key: number]: string } = {
      [TypeEvenement.ErreurMedicamenteuse]: 'Erreur médicamenteuse',
      [TypeEvenement.ChutePatient]: 'Chute patient',
      [TypeEvenement.InfectionNosocomiale]: 'Infection nosocomiale',
      [TypeEvenement.DefaillanceEquipement]: 'Défaillance équipement',
      [TypeEvenement.ErreurDocumentation]: 'Erreur de documentation',
      [TypeEvenement.ProblemeAdministratif]: 'Problème administratif',
      [TypeEvenement.Autre]: 'Autre',
      [TypeEvenement.Incident]: 'Incident'
    };
    return labels[type] || 'Incident';
  }

  public getGraviteLabel(gravite: number): string {
    const labels: { [key: number]: string } = {
      1: 'Bénin',
      2: 'Peu grave',
      3: 'Moyenne',
      4: 'Grave',
      5: 'Très grave',
      6: 'Catastrophique'
    };
    return labels[gravite] || 'N/A';
  }

  public getStatusLabel(status: number): string {
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

// ----- Familles -----
public detectFamille(incident: any): { elementsConcernees: string, famille: string, sousFamille: string }[] {
  const result: { elementsConcernees: string, famille: string, sousFamille: string }[] = [];




  // ----- Accueil -----
  if (incident.natureAccueilManqueInfo) result.push({ elementsConcernees: '', famille: 'Accueil', sousFamille: 'Manque d\'information' });
  if (incident.natureAccueilCommViolente) result.push({ elementsConcernees: '', famille: 'Accueil', sousFamille: 'Communication violente' });
  if (incident.natureAccueilComportement) result.push({ elementsConcernees: '', famille: 'Accueil', sousFamille: 'Comportement inadéquat' });
  if (incident.natureAccueilAbsenceEcoute) result.push({ elementsConcernees: '', famille: 'Accueil', sousFamille: 'Absence d\'écoute active' });
  if (incident.natureAccueilErreurOrientation) result.push({ elementsConcernees: '', famille: 'Accueil', sousFamille: 'Erreur d\'orientation' });
  if (incident.natureAccueilAutre) result.push({ elementsConcernees: '', famille: 'Accueil', sousFamille: 'Autre' });

  // ----- Prestations de soins/PEC -----
  if (incident.natureSoinsRetardPEC) result.push({ elementsConcernees: '', famille: 'Prestations de soins/PEC', sousFamille: 'Retard de prise en charge' });
  if (incident.natureSoinsComplication) result.push({ elementsConcernees: '', famille: 'Prestations de soins/PEC', sousFamille: 'Complication liée aux soins' });
  if (incident.natureSoinsErreurMedicamenteuse) result.push({ elementsConcernees: '', famille: 'Prestations de soins/PEC', sousFamille: 'Erreur médicamenteuse' });
  if (incident.natureSoinsRetardTraitement) result.push({ elementsConcernees: '', famille: 'Prestations de soins/PEC', sousFamille: 'Retard du traitement' });
  if (incident.natureSoinsInfection) result.push({ elementsConcernees: '', famille: 'Prestations de soins/PEC', sousFamille: 'Infection associée aux soins' });
  if (incident.natureSoinsChutePatient) result.push({ elementsConcernees: '', famille: 'Prestations de soins/PEC', sousFamille: 'Chute du patient' });
  if (incident.natureSoinsFugue) result.push({ elementsConcernees: '', famille: 'Prestations de soins/PEC', sousFamille: 'Fugue' });
  if (incident.natureSoinsEscarre) result.push({ elementsConcernees: '', famille: 'Prestations de soins/PEC', sousFamille: 'Apparition d\'escarre' });
  if (incident.natureSoinsDefaultTransmission) result.push({ elementsConcernees: '', famille: 'Prestations de soins/PEC', sousFamille: 'Défaut de transmission ciblée' });
  if (incident.natureSoinsAutre) result.push({ elementsConcernees: '', famille: 'Prestations de soins/PEC', sousFamille: 'Autre' });

  // ----- Droit du patient -----
  if (incident.droitDignite) result.push({ elementsConcernees: '', famille: 'Droit du patient', sousFamille: 'Non-respect de la dignité' });
  if (incident.droitReligion) result.push({ elementsConcernees: '', famille: 'Droit du patient', sousFamille: 'Non-respect des convictions religieuses' });
  if (incident.droitInfoAbsente) result.push({ elementsConcernees: '', famille: 'Droit du patient', sousFamille: 'Absence d\'information' });
  if (incident.droitAccesDossier) result.push({ elementsConcernees: '', famille: 'Droit du patient', sousFamille: 'Accès au dossier non autorisé' });
  if (incident.droitChoixMedecin) result.push({ elementsConcernees: '', famille: 'Droit du patient', sousFamille: 'Choix du médecin non permis' });
  if (incident.droitConfidentialite) result.push({ elementsConcernees: '', famille: 'Droit du patient', sousFamille: 'Non-respect de la confidentialité' });
  if (incident.droitConsentement) result.push({ elementsConcernees: '', famille: 'Droit du patient', sousFamille: 'Non-respect du consentement' });
  if (incident.droitAutre) result.push({ elementsConcernees: '', famille: 'Droit du patient', sousFamille: 'Autre' });

  // ----- Dossier patient -----
  if (incident.dossierPerte) result.push({ elementsConcernees: '', famille: 'Dossier patient', sousFamille: 'Perte du dossier médical' });
  if (incident.dossierIncomplet) result.push({ elementsConcernees: '', famille: 'Dossier patient', sousFamille: 'Dossier incomplet' });
  if (incident.dossierInfosManquantes) result.push({ elementsConcernees: '', famille: 'Dossier patient', sousFamille: 'Informations manquantes' });
  if (incident.dossierAccesNonAutorise) result.push({ elementsConcernees: '', famille: 'Dossier patient', sousFamille: 'Accès non autorisé au dossier' });
  if (incident.dossierMalRedige) result.push({ elementsConcernees: '', famille: 'Dossier patient', sousFamille: 'Dossier mal rédigé/mal structuré' });
  if (incident.dossierAutre) result.push({ elementsConcernees: '', famille: 'Dossier patient', sousFamille: 'Autre' });

  // ----- Transport sanitaire -----
  if (incident.transportAbsence) result.push({ elementsConcernees: '', famille: 'Transport sanitaire', sousFamille: 'Absence ambulance' });
  if (incident.transportRetard) result.push({ elementsConcernees: '', famille: 'Transport sanitaire', sousFamille: 'Retard ambulance' });
  if (incident.transportDefectueux) result.push({ elementsConcernees: '', famille: 'Transport sanitaire', sousFamille: 'Véhicule défectueux' });
  if (incident.transportPanne) result.push({ elementsConcernees: '', famille: 'Transport sanitaire', sousFamille: 'Panne en route' });
  if (incident.transportNonEquipe) result.push({ elementsConcernees: '', famille: 'Transport sanitaire', sousFamille: 'Ambulance non équipée' });
  if (incident.transportCollision) result.push({ elementsConcernees: '', famille: 'Transport sanitaire', sousFamille: 'Collision/choc' });
  if (incident.transportAutre) result.push({ elementsConcernees: '', famille: 'Transport sanitaire', sousFamille: 'Autre' });

  // ----- Risque professionnel -----
  if (incident.risqueAES) result.push({ elementsConcernees: '', famille: 'Risque professionnel', sousFamille: 'Accident d\'Exposition au Sang' });
  if (incident.risqueInfection) result.push({ elementsConcernees: '', famille: 'Risque professionnel', sousFamille: 'Infection liée aux soins' });
  if (incident.risqueMaladiePro) result.push({ elementsConcernees: '', famille: 'Risque professionnel', sousFamille: 'Maladie professionnelle' });
  if (incident.risqueChute) result.push({ elementsConcernees: '', famille: 'Risque professionnel', sousFamille: 'Chute/heurt' });
  if (incident.risqueTMS) result.push({ elementsConcernees: '', famille: 'Risque professionnel', sousFamille: 'Trouble musculo-squelettique' });
  if (incident.risqueChimique) result.push({ elementsConcernees: '', famille: 'Risque professionnel', sousFamille: 'Risque chimique toxique' });
  if (incident.risqueRadioactif) result.push({ elementsConcernees: '', famille: 'Risque professionnel', sousFamille: 'Risque radioactif' });
  if (incident.risquePsycho) result.push({ elementsConcernees: '', famille: 'Risque professionnel', sousFamille: 'Risque psycho-social (Anxiété/dépression)' });
  if (incident.risqueBlessure) result.push({ elementsConcernees: '', famille: 'Risque professionnel', sousFamille: 'Blessure/coupure/brûlure' });
  if (incident.risqueHarcelement) result.push({ elementsConcernees: '', famille: 'Risque professionnel', sousFamille: 'Harcèlement' });
  if (incident.risqueAutre) result.push({ elementsConcernees: '', famille: 'Risque professionnel', sousFamille: 'Autre' });

  // ----- Identité du patient -----
  if (incident.identiteConfusion) result.push({ elementsConcernees: '', famille: 'Identité du patient', sousFamille: 'Confusion lors d\'intervention médicale' });
  if (incident.identiteEchangeErrone) result.push({ elementsConcernees: '', famille: 'Identité du patient', sousFamille: 'Echange d\'informations erronées' });
  if (incident.identiteDoublons) result.push({ elementsConcernees: '', famille: 'Identité du patient', sousFamille: 'Doublons de dossier' });
  if (incident.identiteAutre) result.push({ elementsConcernees: '', famille: 'Identité du patient', sousFamille: 'Autre' });

  // ----- Prestations hôtelières -----
  if (incident.prestationChambreSale) result.push({ elementsConcernees: '', famille: 'Prestations hôtelières', sousFamille: 'Chambre sale' });
  if (incident.prestationLingeSale) result.push({ elementsConcernees: '', famille: 'Prestations hôtelières', sousFamille: 'Linge sale' });
  if (incident.prestationPoubelleNonVide) result.push({ elementsConcernees: '', famille: 'Prestations hôtelières', sousFamille: 'Poubelle non vidée' });
  if (incident.prestationLitEndommage) result.push({ elementsConcernees: '', famille: 'Prestations hôtelières', sousFamille: 'Lit endommagé' });
  if (incident.prestationDouchePanne) result.push({ elementsConcernees: '', famille: 'Prestations hôtelières', sousFamille: 'Douche/WC en panne' });
  if (incident.prestationAutre) result.push({ elementsConcernees: '', famille: 'Prestations hôtelières', sousFamille: 'Autre' });

  // ----- Organisation/Logistique -----
  if (incident.orgRuptureStock) result.push({ elementsConcernees: '', famille: 'Organisation/Logistique', sousFamille: 'Rupture de stock' });
  if (incident.orgDefaillanceInfo) result.push({ elementsConcernees: '', famille: 'Organisation/Logistique', sousFamille: 'Défaillance informatique' });
  if (incident.orgInterruptionChaine) result.push({ elementsConcernees: '', famille: 'Organisation/Logistique', sousFamille: 'Interruption de la chaîne d\'approvisionnement' });
  if (incident.orgErreurCommande) result.push({ elementsConcernees: '', famille: 'Organisation/Logistique', sousFamille: 'Erreur de commande' });
  if (incident.orgErreurStock) result.push({ elementsConcernees: '', famille: 'Organisation/Logistique', sousFamille: 'Erreur de gestion des stocks' });
  if (incident.orgRetardLivraison) result.push({ elementsConcernees: '', famille: 'Organisation/Logistique', sousFamille: 'Retard de livraison' });
  if (incident.orgAutre) result.push({ elementsConcernees: '', famille: 'Organisation/Logistique', sousFamille: 'Autre' });

  // ----- Sécurité des personnes -----
  if (incident.secIncendie) result.push({ elementsConcernees: '', famille: 'Sécurité des personnes', sousFamille: 'Incendie' });
  if (incident.secInondation) result.push({ elementsConcernees: '', famille: 'Sécurité des personnes', sousFamille: 'Inondation' });
  if (incident.secExplosion) result.push({ elementsConcernees: '', famille: 'Sécurité des personnes', sousFamille: 'Explosion' });
  if (incident.secEffondrement) result.push({ elementsConcernees: '', famille: 'Sécurité des personnes', sousFamille: 'Effondrement d\'objets' });
  if (incident.secAgression) result.push({ elementsConcernees: '', famille: 'Sécurité des personnes', sousFamille: 'Agression/violence' });
  if (incident.secChantierSansBalisage) result.push({ elementsConcernees: '', famille: 'Sécurité des personnes', sousFamille: 'Chantier sans balisage' });
  if (incident.secAutre) result.push({ elementsConcernees: '', famille: 'Sécurité des personnes', sousFamille: 'Autre' });

  // ----- Bien du patient -----
  if (incident.bienPerteEffets) result.push({ elementsConcernees: '', famille: 'Bien du patient', sousFamille: 'Perte d\'effets personnels' });
  if (incident.bienDeteriore) result.push({ elementsConcernees: '', famille: 'Bien du patient', sousFamille: 'Détérioration des biens du patient' });
  if (incident.bienConfusion) result.push({ elementsConcernees: '', famille: 'Bien du patient', sousFamille: 'Confusion entre les effets des patients' });
  if (incident.bienVol) result.push({ elementsConcernees: '', famille: 'Bien du patient', sousFamille: 'Vol des objets de valeur' });
  if (incident.bienAutre) result.push({ elementsConcernees: '', famille: 'Bien du patient', sousFamille: 'Autre' });

  // ----- Restauration -----
  if (incident.restIntoxication) result.push({ elementsConcernees: '', famille: 'Restauration', sousFamille: 'Intoxication alimentaire' });
  if (incident.restRepasAvarie) result.push({ elementsConcernees: '', famille: 'Restauration', sousFamille: 'Repas avarié' });
  if (incident.restRepasDegoutant) result.push({ elementsConcernees: '', famille: 'Restauration', sousFamille: 'Repas dégoûtant' });
  if (incident.restRegimeNonRespecte) result.push({ elementsConcernees: '', famille: 'Restauration', sousFamille: 'Non-respect du régime prescrit' });
  if (incident.restRetardLivraison) result.push({ elementsConcernees: '', famille: 'Restauration', sousFamille: 'Retard de livraison des repas' });
  if (incident.restVaisselleSale) result.push({ elementsConcernees: '', famille: 'Restauration', sousFamille: 'Vaisselle non propre' });
  if (incident.restAutre) result.push({ elementsConcernees: '', famille: 'Restauration', sousFamille: 'Autre' });

  return result;
}



  printTable(tableId: string, title: string) {
    const table = document.getElementById(tableId);
    if (!table) return;

    const newWin = window.open('', '', 'width=900,height=700');
    if (!newWin) return;

    const style = `
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h2 { text-align: center; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        table, th, td { border: 1px solid #000; }
        th, td { padding: 8px; text-align: center; }
        th { background-color: #f2f2f2; }
      </style>
    `;

    const clonedTable = table.cloneNode(true) as HTMLElement;

    newWin.document.write('<html><head><title>Impression</title>');
    newWin.document.write(style);
    newWin.document.write('</head><body>');
    newWin.document.write(`<h2>${title}</h2>`);
    newWin.document.write(clonedTable.outerHTML);
    newWin.document.write('</body></html>');

    newWin.document.close();
    newWin.focus();
    newWin.print();
    newWin.close();
  }

  graviteOrder(label: string): number {
    const map: { [key: string]: number } = {
      'Bénin': 1,
      'Peu grave': 2,
      'Moyenne': 3,
      'Grave': 4,
      'Très grave': 5,
      'Catastrophique': 6,
      'N/A': 99
    };
    return map[label] ?? 100;
  }

  
  getGraviteTotal(gravite: string): number {
  const filtered = this.getFilteredIncidents();
  return filtered.filter(i => this.getGraviteLabel(i.gravite) === gravite).length;
}

getStatutTotal(statut: string): number {
  const filtered = this.getFilteredIncidents();
  return filtered.filter(i => this.getStatusLabel(i.statut) === statut).length;
}

///////////status//////filtre

// Méthode pour filtrer les incidents par période
getFilteredByPeriod(): any[] {
  let filtered = this.incidents; // ton tableau d'incidents complet

  if (this.startDate) {
    const start = new Date(this.startDate);
    filtered = filtered.filter(i => new Date(i.dateDeclaration) >= start);
  }

  if (this.endDate) {
    const end = new Date(this.endDate);
    filtered = filtered.filter(i => new Date(i.dateDeclaration) <= end);
  }

  return filtered;
}

// FILTRAGE GLOBAL
  // -----------------------
getFilteredIncidents(): any[] {
  let filtered = this.incidents || [];

  // Filtre par famille
 if (this.selectedFamille && this.selectedFamille !== 'Toutes') {
    filtered = filtered.filter(i =>
      this.detectFamille(i).some(fs => fs.famille === this.selectedFamille)
    );
  }
  // Filtre par période
  if (this.startDate) {
    const start = new Date(this.startDate);
    filtered = filtered.filter(i => new Date(i.dateDeclaration) >= start);
  }
  if (this.endDate) {
    const end = new Date(this.endDate);
    filtered = filtered.filter(i => new Date(i.dateDeclaration) <= end);
  }

  return filtered;
}
  // -----------------------
  // Mise à jour statistiques
  // -----------------------
  updateStatutStats() {
    const filtered = this.getFilteredIncidents();
    this.statutCount = {};
    filtered.forEach(i => {
      const key = i.statut;
      this.statutCount[key] = (this.statutCount[key] || 0) + 1;
    });
    this.totalIncidents = filtered.length;

    this.statutChartData = {
      labels: Object.keys(this.statutCount).sort(),
      datasets: [{ label: 'Nombre d\'incidents', data: Object.keys(this.statutCount).sort().map(k => this.statutCount[k]), backgroundColor: '#007bff' }]
    };
  }

  updateGraviteStats() {
    const filtered = this.getFilteredIncidents();
    this.graviteCount = {};
    filtered.forEach(i => {
      const key = i.gravite;
      this.graviteCount[key] = (this.graviteCount[key] || 0) + 1;
    });

    this.graviteChartData = {
      labels: Object.keys(this.graviteCount).sort(),
      datasets: [{ label: 'Nombre d\'incidents', data: Object.keys(this.graviteCount).sort().map(k => this.graviteCount[k]), backgroundColor: '#dc3545' }]
    };
  }

  updateMatriceStats() {
    const filtered = this.getFilteredIncidents();
    this.matriceCount = {};
    filtered.forEach(i => {
      const key = i.famille + ' | ' + i.gravite;
      this.matriceCount[key] = (this.matriceCount[key] || 0) + 1;
    });

    this.matriceChartData = {
      labels: Object.keys(this.matriceCount).sort(),
      datasets: [{ label: 'Nombre d\'incidents', data: Object.keys(this.matriceCount).sort().map(k => this.matriceCount[k]), backgroundColor: '#28a745' }]
    };
  }

  updateAllStats() {
    this.updateStatutStats();
    this.updateGraviteStats();
    this.updateMatriceStats();
  }

  keys(obj: any) {
    return Object.keys(obj);
  }

// Méthode pour effacer tous les filtres
clearFilters() {
  this.selectedFamille = '';
  this.startDate = '';
  this.endDate = '';
  this.filterByFamille(); // Cela va recalculer avec tous les incidents
}
  


/////////////////////excel///////////////



// Statistiques à calculer depuis tes incidents
incidentsParStatut: { [key: string]: number } = {};
incidentsParGravite: { [key: string]: number } = {};
incidentsParFamille: { [key: string]: { sousFamille: string, count: number } } = {};


exportToExcelMulti(): void {
  // 1️⃣ Onglet : Incidents détaillés
  const incidentsData = this.incidents.map(inc => ({
    ID: inc.id,
    Date: inc.dateDeclaration,
    Statut: this.getStatusLabel(inc.statut),
    Gravité: this.getGraviteLabel(inc.gravite),
    Familles: this.detectFamille(inc).map(f => f.famille).join(', '),
    SousFamilles: this.detectFamille(inc).map(f => f.sousFamille).join(', '),
    Description: inc.description || ''
  }));
  const wsIncidents = XLSX.utils.json_to_sheet(incidentsData);

  // 2️⃣ Onglet : Statut
  const statusData = Object.entries(this.incidentsParStatut).map(([key, value]) => ({
    Statut: key,
    Nombre: value
  }));
  const wsStatus = XLSX.utils.json_to_sheet(statusData);

  // 3️⃣ Onglet : Gravité
  const graviteData = Object.entries(this.incidentsParGravite).map(([key, value]) => ({
    Gravité: key,
    Nombre: value
  }));
  const wsGravite = XLSX.utils.json_to_sheet(graviteData);

  // 4️⃣ Onglet : Familles / Sous-familles
  const familleData = Object.entries(this.incidentsParFamille).map(([key, value]) => ({
    Famille: key,
    SousFamille: value.sousFamille,
    Nombre: value.count
  }));
  const wsFamille = XLSX.utils.json_to_sheet(familleData);

  // Créer le classeur avec tous les onglets
  const workbook: XLSX.WorkBook = {
    Sheets: {
      'Incidents': wsIncidents,
      'Statut': wsStatus,
      'Gravité': wsGravite,
      'Famille': wsFamille
    },
    SheetNames: ['Incidents', 'Statut', 'Gravité', 'Famille']
  };

  // Générer et sauvegarder le fichier
  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(blob, `Incidents_Multi_${new Date().toISOString().slice(0,10)}.xlsx`);
}
computeStats() {
  // Réinitialiser
  this.incidentsParStatut = {};
  this.incidentsParGravite = {};
  this.incidentsParFamille = {};

  this.incidents.forEach(inc => {
    // Statut
    const stat = inc.statut || 'Non défini';
    this.incidentsParStatut[stat] = (this.incidentsParStatut[stat] || 0) + 1;

    // Gravité
    const grav = inc.gravite || 'Non défini';
    this.incidentsParGravite[grav] = (this.incidentsParGravite[grav] || 0) + 1;

    // Famille
    const fam = inc.famille || 'Non défini';
    const sous = inc.sousFamille || '';
    this.incidentsParFamille[fam] = { 
      sousFamille: sous, 
      count: (this.incidentsParFamille[fam]?.count || 0) + 1 
    };
  });
}


}
// Définir le type minimal pour un incident



