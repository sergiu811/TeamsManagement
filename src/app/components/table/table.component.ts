import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
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

  @ViewChild(MatSort)
  sort!: MatSort;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  getTeams() {
    this.teamsService.getTeams().subscribe(data => {
      this.response = data;
      if (data) {
        this.teams = this.response.DATA;
        this.dataSource = new MatTableDataSource(this.teams)
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }
    })

  }
  updateTeams() {
    this.teamsService.getTeams().subscribe(data => {
      this.response = data;
      if (data) {
        console.log(this.response.DATA)
        this.dataSource.data = [...this.response.DATA]
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }
    })
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.getTeams();
  }

  addRow() {
    const addModalRef = this.addDialog.open(AddModalComponent)
    addModalRef.afterClosed().subscribe((res) => {
      if (res) {
        this.teamsService.addTeam({ DENUMIRE: res })
       
      }
      this.updateTeams();
    })
    
  }
  updateRow(id: number, denumire: string) {
    this.teamsService.updateTeam(id, denumire);
  }
  public removeRow(id: number) {
    this.removeDialog.open(RemoveModalComponent).afterClosed().subscribe((confirm) => {
      if (confirm) {
        this.dataSource.data = this.dataSource.data.filter((team) => team.ID_ECHIPA !== id);
        this.teamsService.removeTeam(id)
      }
    })
  }

  public restoreTeam(id: number) {
    this.teamsService.restoreTeam(id)
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


}
