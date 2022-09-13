import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import { Observable } from 'rxjs';
import { TeamInterface,ResponseInterface } from '../models/teamModel';


@Injectable({
  providedIn: 'root'
})

export class TeamsServiceService {
  private teamsUrl: string;
  constructor(private http: HttpClient ) { 
    this.teamsUrl='https://recrutare.compexin.ro/api/web/echipesergiu'
  }

  public  getTeams():  Observable<ResponseInterface>{
    return  this.http.get<ResponseInterface>(this.teamsUrl)
  }

  public addTeam(team:{}){
     return this.http.post<{}>(this.teamsUrl,team).subscribe()
  }

  public restoreTeam(id:number){
    const team={
      ID_ECHIPA:id
    }
    return this.http.post<{}>(`${this.teamsUrl}${'/restore'}`,team).subscribe()
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
    return this.http.delete(this.teamsUrl,options).subscribe()
  }
  public updateTeam(id:number, name:string){
      const body= {
        ID_ECHIPA:id,
        DENUMIRE: name
      }
    return this.http.put(this.teamsUrl,body).subscribe()
  }
}
