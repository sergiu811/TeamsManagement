import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { PlayerResponseInterface } from '../models/playerModel';

@Injectable({
  providedIn: 'root'
})
export class PlayersService {
  private playersURL: string;
  constructor(private http: HttpClient) {
    this.playersURL = 'https://recrutare.compexin.ro/api/web/jucatorisergiu'
  }

  public getPlayers(): Observable<PlayerResponseInterface> {
    return this.http.get<PlayerResponseInterface>(this.playersURL).pipe(retry(1), catchError(this.handleError))
  }
  public getActivePlayers(): Observable<PlayerResponseInterface> {
    return this.http.get<PlayerResponseInterface>(`${this.playersURL}/active`).pipe(retry(1), catchError(this.handleError))
  }
  public filterPlayers(nume: string,prenume: string,idEchipa: number): Observable<PlayerResponseInterface> {
    const body = {
      NUME: nume,
      PRENUME: prenume,
      ID_ECHIPA: idEchipa
    }
    return this.http.post<PlayerResponseInterface>(`${this.playersURL}${'/filter'}`, body).pipe(retry(1), catchError(this.handleError))
  }
  public addPlayer(player: {}) {
    return this.http.post<{}>(this.playersURL, player).pipe(retry(1), catchError(this.handleError))
  }
  public removePlayer(id: number) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        ID_JUCATOR: id
      },
    };
    return this.http.delete(this.playersURL, options).pipe(retry(1), catchError(this.handleError))
  }
  public restorePlayer(id: number) {
    const player = {
      ID_JUCATOR: id
    }
    return this.http.post<{}>(`${this.playersURL}${'/restore'}`, player).pipe(retry(1), catchError(this.handleError))
  }
  public updateTeam(id: number, name: string, prenume: string, data: string, idEchipa: number) {
    const body = {
      ID_JUCATOR: id,
      NUME: name,
      PRENUME: prenume,
      DATA_NASTERE: data,
      ID_ECHIPA: idEchipa
    }
    return this.http.put(this.playersURL, body).pipe(retry(1), catchError(this.handleError))
  }

  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => {
      return errorMessage;
    });
  }
}
