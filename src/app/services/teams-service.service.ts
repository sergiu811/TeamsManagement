import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import { catchError, Observable, retry, throwError } from 'rxjs';
import { TeamInterface,ResponseInterface } from '../models/teamModel';


@Injectable({
  providedIn: 'root'
})

export class TeamsService {
  private teamsUrl: string;
  private response!:ResponseInterface
  constructor(private http: HttpClient ) { 
    this.teamsUrl='https://recrutare.compexin.ro/api/web/echipesergiu'
  }

  public  getTeams():  Observable<ResponseInterface>{
    return  this.http.get<ResponseInterface>(this.teamsUrl).pipe(retry(1), catchError(this.handleError));
  }

  public  getActiveTeams():  Observable<ResponseInterface>{
    return  this.http.get<ResponseInterface>("https://recrutare.compexin.ro/api/web/echipesergiu/active").pipe(retry(1), catchError(this.handleError));
  }

  public addTeam(team:{}){
     return this.http.post<{}>(this.teamsUrl,team).pipe(retry(1), catchError(this.handleError));
  }

  public filterTeams(denumire:string):Observable<ResponseInterface>{
    const body= {
      DENUMIRE: denumire
    }
    return this.http.post<ResponseInterface>(`${this.teamsUrl}${'/filter'}`,body).pipe(retry(1), catchError(this.handleError));
  }
  public restoreTeam(id:number){
    const team={
      ID_ECHIPA:id
    }
    return this.http.post<{}>(`${this.teamsUrl}${'/restore'}`,team).pipe(retry(1), catchError(this.handleError));
 }
  public removeTeam(id:number){
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        ID_ECHIPA:id
      },
    };
    return this.http.delete(this.teamsUrl,options).pipe(retry(1), catchError(this.handleError))
  }
  public updateTeam(id:number, name:string){
      const body= {
        ID_ECHIPA:id,
        DENUMIRE: name
      }
    return this.http.put(this.teamsUrl,body).pipe(retry(1), catchError(this.handleError))
  }
  handleError(error:any) {
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
