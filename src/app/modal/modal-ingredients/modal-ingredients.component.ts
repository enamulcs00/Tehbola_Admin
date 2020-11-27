import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-ingredients',
  templateUrl: './modal-ingredients.component.html',
  styleUrls: ['./modal-ingredients.component.scss']
})
export class ModalIngredientsComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { name: string }) { }

  ngOnInit() {
  }

}
