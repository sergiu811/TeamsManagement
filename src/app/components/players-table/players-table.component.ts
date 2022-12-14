import { AfterViewInit, Component, OnInit, SimpleChanges, ViewChild } from '@angular/core';
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
import { TeamInterface } from 'src/app/models/teamModel';
import { DatePipe } from '@angular/common'
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
  responseTeam!: ResponseInterface;
  constructor(public datepipe: DatePipe, private playersService: PlayersService, private teamService: TeamsService, public addDialog: MatDialog, public removeDialog: MatDialog, public restoreDialog: MatDialog) { }

  dataSource!: MatTableDataSource<PlayerInterface>
  displayedColumns: string[] = COLUMNS_SCHEMA.map((col) => col.key);
  columnsSchema: any = COLUMNS_SCHEMA;
  isLoadingResults = true;
  idEchipa!: number;
  idEchipaSearch!: any;
  teams!: TeamInterface[];
  errorMessage = '';
  successMessage = "";
  nume: string = "";
  prenume: string = "";
  searchActive: boolean = false;

  @ViewChild(MatSort)
  sort!: MatSort;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  setSuccessMessage(message: string) {
    this.successMessage = message;
    setTimeout(() => { this.successMessage = "" }, 3000)
  }

  allClear() {
    if (this.nume == "" && this.prenume == "" && this.idEchipaSearch == null) {
      this.getPlayers();
    }
    else
      this.searchPlayer()
  }
  deleteFilters() {
    this.nume = "";
    this.prenume = "";
    this.idEchipaSearch = null;
    this.allClear();
  }
  ngAfterViewInit(): void {
    this.getPlayers();
    this.getTeams();
  }

  getTeams() {
    this.teamService.getTeams().subscribe({
      next: (data) => {
        this.responseTeam = data;
        if (data) {
          this.teams = this.responseTeam.DATA
        }
      },
      error: (error) => {
        this.dataSource = new MatTableDataSource()
        this.errorMessage = error;
        this.isLoadingResults = false;
      }
    });
  }
  getTeamName(id: number) {
    if (this.teams) {
      let team!: TeamInterface[];
      team = this.teams.filter(x => x.ID_ECHIPA === id);
      return team[0].DENUMIRE
    }
    return null;
  }
  getPlayers() {

    this.playersService.getPlayers().subscribe({
      next: (data) => {
        this.response = data;
        if (data) {
          this.dataSource = new MatTableDataSource(this.response.DATA)
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.isLoadingResults = false;
        }
      }, error: (error) => {
        this.dataSource = new MatTableDataSource()
        this.errorMessage = error;
        this.isLoadingResults = false;
      }
    })
  }

  getActivePlayers() {
    this.playersService.getActivePlayers().subscribe({
      next: (data) => {
        this.response = data;
        if (data) {
          this.dataSource = new MatTableDataSource(this.response.DATA)
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.isLoadingResults = false;
        }
      },
      error: (error) => {
        this.dataSource = new MatTableDataSource()
        this.errorMessage = error;
        this.isLoadingResults = false;
      }
    })
  }

  addPlayer() {
    const addModalRef = this.addDialog.open(AddPlayerModalComponent)
    addModalRef.afterClosed().subscribe((res) => {
      if (res) {
        this.playersService.addPlayer(res).subscribe({
          next: () => {
            setTimeout(() => { this.getPlayers(); }, 400)
            this.setSuccessMessage("Jucator adaugat cu succes!")
          },
          error: (error) => {
            this.dataSource = new MatTableDataSource()
            this.errorMessage = error;
            this.isLoadingResults = false;
          }
        })
      }
    })
  }

  public removePlayer(id: number) {
    this.removeDialog.open(RemoveModalComponent).afterClosed().subscribe((confirm) => {
      if (confirm) {
        this.isLoadingResults = true;
        this.playersService.removePlayer(id).subscribe({
          next: () => {
            setTimeout(() => { this.getPlayers(); }, 400)
            this.setSuccessMessage("Jucator dezactivat cu succes!")
          },
          error: (error) => {
            this.dataSource = new MatTableDataSource()
            this.errorMessage = error;
            this.isLoadingResults = false;
          }
        })
      }
    })
  }

  public restorePlayer(id: number) {
    this.removeDialog.open(RestoreModalComponent).afterClosed().subscribe((confirm) => {
      if (confirm) {
        this.isLoadingResults = true;
        this.playersService.restorePlayer(id).subscribe({
          next: () => {
            setTimeout(() => { this.getPlayers(); }, 400)
            this.setSuccessMessage("Jucator activat cu succes!")
          },
          error: (error) => {
            this.dataSource = new MatTableDataSource()
            this.errorMessage = error;
            this.isLoadingResults = false;
          }
        })
      }
    })

  }
  getDate(date: any) {
    return this.datepipe.transform(date, 'yyyy-MM-dd')
  }

  updatePlayer(id: number, nume: string, prenume: string, dataN: string, idE: number) {
    this.isLoadingResults = true;
    this.playersService.updatePlayer(id, nume, prenume, dataN, idE).subscribe({
      next: () => {
        setTimeout(() => { this.getPlayers(); }, 400)
        this.setSuccessMessage("Jucator actualizat cu succes!")
      },
      error: (error) => {
        this.dataSource = new MatTableDataSource()
        this.errorMessage = error;
        this.isLoadingResults = false;
      }
    });

  }

  filterPlayers(nume: string, prenume: string, idEchipa: number) {
    (this.playersService.filterPlayers(nume, prenume, idEchipa).subscribe(data => {
      this.response = data;
      if (data) {
        this.dataSource = new MatTableDataSource(this.response.DATA)
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.isLoadingResults = false;
      }
    }))
  }
  searchPlayer() {
    this.filterPlayers(this.nume, this.prenume, this.idEchipaSearch)
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
