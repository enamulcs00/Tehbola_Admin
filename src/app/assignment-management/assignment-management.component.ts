import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalIngredientsComponent } from '../modal/modal-ingredients/modal-ingredients.component';
@Component({
  selector: 'app-assignment-management',
  templateUrl: './assignment-management.component.html',
  styleUrls: ['./assignment-management.component.scss']
})
export class AssignmentManagementComponent implements OnInit {
  progress: boolean
  date = new Date()
  constructor(public dialog: MatDialog) { }

  ngOnInit() {
    console.log(this.date);

  }

  openDialog() {
    const dialogRef = this.dialog.open(ModalIngredientsComponent, {
      data: { name: 'austin' },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  editAssignment() {

  }


  deleteAssignment() {

  }

}
