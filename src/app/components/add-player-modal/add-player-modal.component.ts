import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ResponseInterface } from 'src/app/models/teamModel';
import { TeamsService } from 'src/app/services/teams-service.service';
@Component({
  selector: 'app-add-player-modal',
  templateUrl: './add-player-modal.component.html',
  styleUrls: ['./add-player-modal.component.css']
})
export class AddPlayerModalComponent implements AfterViewInit {
  teams!:any[];
  response!:ResponseInterface
  constructor(private dialogRef: MatDialogRef<AddPlayerModalComponent>, private teamsService:TeamsService) { }
  ngAfterViewInit(): void {
    this.teamsService.getActiveTeams().subscribe(data=>{
      this.response=data;
      if(data){
        this.teams=this.response.DATA
      }
     });
  }
  nume: string = "";
  prenume: string = "";
  dataNasterii:string=""
  idEchipa!:number;
  ngOnInit(): void {
  
  }
  public addTeam() {
   this.dialogRef.close({NUME:this.nume,PRENUME:this.prenume,DATA_NASTERE:this.dataNasterii,ID_ECHIPA:this.idEchipa});
  }


}
