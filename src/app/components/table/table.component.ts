import { Component } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TeamsServiceService } from 'src/app/services/teams-service.service';
import { TeamInterface, ResponseInterface } from 'src/app/models/teamModel';
import { AddModalComponent } from '../add-modal/add-modal.component';
import { RemoveModalComponent } from '../remove-modal/remove-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
const COLUMNS_SCHEMA = [
  {
    key: 'STATUS',
    type: 'text',
    label: 'STATUS',
  },
  {
    key: 'ID_ECHIPA',
    type: 'number',
    label: 'ID',
  },
  {
    key: 'DENUMIRE',
    type: 'text',
    label: 'Denumire',
  },
  {
    key: 'DATA_CREARE',
    type: 'date',
    label: 'Data creare',
  },
  {
    key: 'isEdit',
    type: 'isEdit',
    label: '',
  },
];

@Component({
  selector: 'Table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements AfterViewInit {
  response!: ResponseInterface;
  teams!: TeamInterface[];
  constructor(private _liveAnnouncer: LiveAnnouncer, private teamsService: TeamsServiceService, public removeDialog: MatDialog, public addDialog: MatDialog) { }
  dataSource!: MatTableDataSource<TeamInterface>
  displayedColumns: string[] = COLUMNS_SCHEMA.map((col) => col.key);
  columnsSchema: any = COLUMNS_SCHEMA;
  isLoadingResults = true;

  @ViewChild(MatSort)
  sort!: MatSort;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;



  getTeams() {
    this.teamsService.getTeams().subscribe(data => {
      this.response = data;
      if (data) {
        console.log(data)
        this.teams = this.response.DATA;
        this.dataSource = new MatTableDataSource(this.teams)
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.isLoadingResults = false;
      }
    })
  }
  getActiveTeams() {
    this.teamsService.getActiveTeams().subscribe(data => {
      this.response = data;
      if (data) {
        console.log(data)
        this.teams = this.response.DATA;
        this.dataSource = new MatTableDataSource(this.teams)
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.isLoadingResults = false;
      }
    })
  }


  ngOnInit() {
    this.getTeams();
  }

  ngAfterViewInit(): void {
    this.getTeams();
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
  }

  addRow() {
    console.log(this.dataSource.data)

    const addModalRef = this.addDialog.open(AddModalComponent)
    addModalRef.afterClosed().subscribe((res) => {
      this.teamsService.addTeam({ DENUMIRE: res })
      setTimeout(() => { this.getTeams(); }, 400)
    })
  }
  updateRow(id: number, denumire: string) {
    this.isLoadingResults = true;
    this.teamsService.updateTeam(id, denumire);
    setTimeout(() => { this.getTeams(); }, 400)
  }
  public removeRow(id: number) {
    this.removeDialog.open(RemoveModalComponent).afterClosed().subscribe((confirm) => {
      if (confirm) {
        this.isLoadingResults = true;
        this.teamsService.removeTeam(id)
        setTimeout(() => { this.getTeams(); }, 400)
      }
    })
  }

  public restoreTeam(id: number) {
    this.isLoadingResults = true;
    this.teamsService.restoreTeam(id)
    setTimeout(() => { this.getTeams(); }, 400)
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
