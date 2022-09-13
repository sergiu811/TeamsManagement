import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-add-modal',
  templateUrl: './add-modal.component.html',
  styleUrls: ['./add-modal.component.css']
})
export class AddModalComponent implements OnInit {
  constructor(private dialogRef: MatDialogRef<AddModalComponent>) { }
  denumire: string = "";

  ngOnInit(): void {
  }
  public addTeam() {
    this.dialogRef.close(this.denumire);
  }
}
