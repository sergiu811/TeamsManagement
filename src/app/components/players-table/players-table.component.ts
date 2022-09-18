import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { PlayersService } from 'src/app/services/players-service.service';
import { PlayerInterface, PlayerResponseInterface } from 'src/app/models/playerModel';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AddPlayerModalComponent } from '../add-player-modal/add-player-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { RemoveModalComponent } from '../remove-modal/remove-modal.component';

const COLUMNS_SCHEMA = [
  {
    key: 'STATUS',
    type: 'text',
    label: 'STATUS',
  },
  {
    key: 'ID_JUCATOR',
    type: 'number',
    label: 'ID',
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

  constructor(private playersService: PlayersService, public addDialog:MatDialog, public removeDialog:MatDialog) { }

  dataSource!: MatTableDataSource<PlayerInterface>
  displayedColumns: string[] = COLUMNS_SCHEMA.map((col) => col.key);
  columnsSchema: any = COLUMNS_SCHEMA;
  isLoadingResults = true;

  @ViewChild(MatSort)
  sort!: MatSort;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  ngAfterViewInit(): void {
   this.getPlayers();
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
      this.playersService.addPlayer(res)
      setTimeout(() => { this.getPlayers(); }, 400)
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
    this.isLoadingResults = true;
    this.playersService.restorePlayer(id)
    setTimeout(() => { this.getPlayers(); }, 400)
  }
  updatePlayer(id:number,nume:string,prenume:string,dataN:string,idEchipa:number) {
    this.isLoadingResults = true;
    this.playersService.updateTeam(id, nume,prenume,dataN, idEchipa);
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
