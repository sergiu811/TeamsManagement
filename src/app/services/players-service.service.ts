import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PlayerResponseInterface } from '../models/playerModel';

@Injectable({
  providedIn: 'root'
})
export class PlayersService {
  private playersURL: string;
  constructor(private http: HttpClient ) { 
    this.playersURL='https://recrutare.compexin.ro/api/web/jucatorisergiu'
  }

  public  getPlayers():  Observable<PlayerResponseInterface>{
    return  this.http.get<PlayerResponseInterface>(this.playersURL)
  }
  public  getActivePlayers():  Observable<PlayerResponseInterface>{
    return  this.http.get<PlayerResponseInterface>(`${this.playersURL}/active`)
  }
  public addPlayer(player:{}){
    return this.http.post<{}>(this.playersURL,player).subscribe()
 }
 public removePlayer(id:number){
  const options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
    body: {
      ID_JUCATOR:id
    },
  };
  return this.http.delete(this.playersURL,options).subscribe()
}
public restorePlayer(id:number){
  const player={
    ID_JUCATOR:id
  }
  return this.http.post<{}>(`${this.playersURL}${'/restore'}`,player).subscribe()
}
public updateTeam(id:number, name:string, prenume:string, data:string, idEchipa:number){
  const body= {
    ID_JUCATOR:id,
    NUME: name,
    PRENUME: prenume,
    DATA_NASTERE:data,
    ID_ECHIPA:idEchipa
  }
return this.http.put(this.playersURL,body).subscribe()
}
}
