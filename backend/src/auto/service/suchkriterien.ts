import { GetriebeType, HerstellerType } from 'src/auto/entity/auto.entity';

export interface Suchkriterien {
  readonly modellbezeichnung?: string;
  readonly hersteller: HerstellerType;
  readonly getriebeArt: GetriebeType;
  readonly istAktuellesModell: boolean;
  readonly eigentuemer: string;
  readonly verfuegbar: boolean;
}
