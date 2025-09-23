export enum GraviteEvenement {
  Benin = 1,
  PeuGrave = 2,
  Moyenne = 3,
  Grave = 4,
  TresGrave = 5,
  Catastrophique = 6,
  
}

export function getGraviteLabel(gravite: GraviteEvenement | number): string {
  switch (gravite) {
    case GraviteEvenement.Benin: return 'Bénin';
    case GraviteEvenement.PeuGrave: return 'Peu grave';
    case GraviteEvenement.Moyenne: return 'Moyenne';
    case GraviteEvenement.Grave: return 'Grave';
    case GraviteEvenement.TresGrave: return 'Très grave';
    case GraviteEvenement.Catastrophique: return 'Catastrophique';
    default: return 'Gravité inconnue';
  }
}
