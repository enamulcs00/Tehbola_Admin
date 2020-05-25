import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare var $: any;
interface Ready {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }
  goTomanageUser() {
    this.router.navigate(['/manageUser'])
  }
  pick: Ready[] = [
    { value: 'Active', viewValue: 'Active' },
    { value: 'Inactive', viewValue: 'Inactive' }
   
  ];
}
