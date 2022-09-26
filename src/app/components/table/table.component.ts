import { Component } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TeamsService } from 'src/app/services/teams-service.service';
import { TeamInterface, ResponseInterface } from 'src/app/models/teamModel';
import { AddModalComponent } from '../add-modal/add-modal.component';
import { RemoveModalComponent } from '../remove-modal/remove-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { RestoreModalComponent } from '../restore-modal/restore-modal.component';
const COLUMNS_SCHEMA = [
  {
    key: 'STATUS',
    type: 'text',
    label: 'STATUS',
  },
  {
    key: 'DENUMIRE',
    type: 'text',
    label: 'Denumire',
  },
  {
    key: 'isEdit',
    type: 'isEdit',
    label: '',
  },
];

@Component({
  selector: 'TeamsTable',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements AfterViewInit {
  response!: ResponseInterface;
  constructor(private _liveAnnouncer: LiveAnnouncer, private teamsService: TeamsService, public removeDialog: MatDialog, public addDialog: MatDialog, public restoreDialog: MatDialog) { }
  dataSource!: MatTableDataSource<TeamInterface>
  displayedColumns: string[] = COLUMNS_SCHEMA.map((col) => col.key);
  columnsSchema: any = COLUMNS_SCHEMA;
  isLoadingResults = true;
  errorMessage = '';
  successMessage = "";

  @ViewChild(MatSort)
  sort!: MatSort;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  setSuccessMessage(message: string) {
    this.successMessage = message;
    setTimeout(() => { this.successMessage = "" }, 3000)
  }


  getTeams() {
    this.teamsService.getTeams().subscribe({
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
  getActiveTeams() {
    this.teamsService.getActiveTeams().subscribe({
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

  ngAfterViewInit(): void {
    this.getTeams();
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
  }
  filterTeams(denumire: string) {
    (this.teamsService.filterTeams(denumire).subscribe({
      next: data => {
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
    }))
  }

  addTeam() {
    console.log(this.dataSource.data)
    const addModalRef = this.addDialog.open(AddModalComponent)
    addModalRef.afterClosed().subscribe((res) => {
      this.teamsService.addTeam({ DENUMIRE: res }).subscribe({
        next: () => {
          this.setSuccessMessage("Echipa adaugata cu succes!")
        },
        error: (error) => {
          this.errorMessage = error;
          this.isLoadingResults = false;
        }
      });
      setTimeout(() => { this.getTeams(); }, 400)

    })
  }
  updateTeam(id: number, denumire: string) {
    this.isLoadingResults = true;
    this.teamsService.updateTeam(id, denumire).subscribe({
      next: () => {
        this.setSuccessMessage("Echipa actualizata cu succes!")
      },
      error: (error) => {
        this.errorMessage = error;
        this.isLoadingResults = false;
      }
    });
    setTimeout(() => { this.getTeams(); }, 400)
  }
  public removeTeam(id: number) {
    this.removeDialog.open(RemoveModalComponent).afterClosed().subscribe((confirm) => {
      if (confirm) {
        this.isLoadingResults = true;
        this.teamsService.removeTeam(id).subscribe({
          next: () => {
            this.setSuccessMessage("Echipa dezactivata cu succes!")
          },
          error: (error) => {
            this.errorMessage = error;
            this.isLoadingResults = false;
          }
        })
        setTimeout(() => { this.getTeams(); }, 400)
      }
    })
  }

  public restoreTeam(id: number) {
    this.removeDialog.open(RestoreModalComponent).afterClosed().subscribe((confirm) => {
      if (confirm) {
        this.isLoadingResults = true;
        this.teamsService.restoreTeam(id).subscribe({
          next: () => {
            this.setSuccessMessage("Echipa activata cu succes!")
          },
          error: (error) => {
            this.errorMessage = error;
            this.isLoadingResults = false;
          }
        })
        setTimeout(() => { this.getTeams(); }, 400)
      }
    })
  }

  searchTeam(event: Event) {
    const denumire = (event.target as HTMLInputElement).value;
    this.filterTeams(denumire)
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
