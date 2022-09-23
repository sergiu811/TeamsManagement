import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { PlayersService } from 'src/app/services/players-service.service';
import { PlayerInterface, PlayerResponseInterface } from 'src/app/models/playerModel';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AddPlayerModalComponent } from '../add-player-modal/add-player-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { RemoveModalComponent } from '../remove-modal/remove-modal.component';
import { RestoreModalComponent } from '../restore-modal/restore-modal.component';
import { TeamsService } from 'src/app/services/teams-service.service';
import { ResponseInterface } from 'src/app/models/teamModel';
const COLUMNS_SCHEMA = [
  {
    key: 'STATUS',
    type: 'text',
    label: 'STATUS',
  },
  {
    key: 'NUME',
    type: 'text',
    label: 'Nume',
  },
  {
    key: 'PRENUME',
    type: 'text',
    label: 'Prenume',
  },
  {
    key: 'DENUMIRE_ECHIPA',
    type: 'text',
    label: 'Denumire Echipa',
  },
  {
    key: 'DATA_NASTERE',
    type: 'date',
    label: 'Data nastere',
  },
  {
    key: 'isEdit',
    type: 'isEdit',
    label: '',
  },
];

@Component({
  selector: 'PlayersTable',
  templateUrl: './players-table.component.html',
  styleUrls: ['./players-table.component.css']
})
export class PlayersTableComponent implements AfterViewInit {
  response!: PlayerResponseInterface;
  responseTeam!:ResponseInterface;
  constructor(private playersService: PlayersService,private teamService:TeamsService, public addDialog:MatDialog, public removeDialog:MatDialog,public restoreDialog:MatDialog) { }

  dataSource!: MatTableDataSource<PlayerInterface>
  displayedColumns: string[] = COLUMNS_SCHEMA.map((col) => col.key);
  columnsSchema: any = COLUMNS_SCHEMA;
  isLoadingResults = true;
  idEchipa!:number;
  teams!:any[];
  
  @ViewChild(MatSort)
  sort!: MatSort;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  ngAfterViewInit(): void {
   this.getPlayers();
   this.getTeams();
  }
  getTeams(){
    this.teamService.getActiveTeams().subscribe(data=>{
      this.responseTeam=data;
      if(data){
        this.teams=this.responseTeam.DATA
      }
     });
  }
  getPlayers() {
    this.playersService.getPlayers().subscribe(data => {
      this.response = data;
      if (data) {
        this.dataSource = new MatTableDataSource(this.response.DATA)
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.isLoadingResults = false;
      }
    })
  }
  getActivePlayers() {
    this.playersService.getActivePlayers().subscribe(data => {
      this.response = data;
      if (data) {
        this.dataSource = new MatTableDataSource(this.response.DATA)
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.isLoadingResults = false;
      }
    })
  }
  addPlayer() {
    const addModalRef = this.addDialog.open(AddPlayerModalComponent)
    addModalRef.afterClosed().subscribe((res) => {
      if(res){
        this.playersService.addPlayer(res)
        setTimeout(() => { this.getPlayers(); }, 400)
      }
    })
  }
 
  public removePlayer(id: number) {
    this.removeDialog.open(RemoveModalComponent).afterClosed().subscribe((confirm) => {
      if (confirm) {
        this.isLoadingResults = true;
        this.playersService.removePlayer(id)
        setTimeout(() => { this.getPlayers(); }, 400)
      }
    })
  }
  public restorePlayer(id: number) {
    this.removeDialog.open(RestoreModalComponent).afterClosed().subscribe((confirm) => {
      if (confirm) {
        this.isLoadingResults = true;
        this.playersService.restorePlayer(id)
        setTimeout(() => { this.getPlayers(); }, 400)
      }
    })
    
  }
  updatePlayer(id:number,nume:string,prenume:string,dataN:string) {
    this.isLoadingResults = true;
    this.playersService.updateTeam(id, nume,prenume,dataN, this.idEchipa);
    setTimeout(() => { this.getPlayers(); }, 400)
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
