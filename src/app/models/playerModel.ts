import { TeamInterface } from "./teamModel";
export interface PlayerInterface {
    ACTIVE: boolean,
    DATA_CREARE: string,
    DATA_MODIFICARE: string,
    DATA_NASTERE: string;
    ECHIPA: TeamInterface,
    ID_ECHIPA: number,
    ID_JUCATOR: number,
    STATUS: string,
    NUME: string,
    PRENUME: string,
    ACTIV: boolean;
    UTILIZATOR_CREARE: number;
    UTILIZATOR_MODIFICARE: number;
}

export interface PlayerResponseInterface {
    SUCCESS:boolean;
    DATA:[PlayerInterface]
  }
  