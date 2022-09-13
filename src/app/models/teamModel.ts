export interface TeamInterface {
  STATUS: string;
  ID_ECHIPA: number;
  DENUMIRE: string;
  ACTIV:boolean;
  DATA_CREARE:string;
  DATA_MODIFICARE:string;
  UTILIZATOR_CREARE:number;
  UTILIZATOR_MODIFICARE: number;
}
export interface ResponseInterface {
  SUCCESS:boolean;
  DATA:[TeamInterface]
}

