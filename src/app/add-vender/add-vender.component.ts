import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
interface Ready {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-add-vender',
  templateUrl: './add-vender.component.html',
  styleUrls: ['./add-vender.component.scss']
})
export class AddVenderComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  goTovendermanagement(){
    this.router.navigate(['venderManagement'])
  }

  pick: Ready[] = [
    { value: 'Pending', viewValue: 'Pending' },
    { value: 'Active ', viewValue: 'Active' },
    { value: 'Inactive', viewValue: 'Inactive' }

  ];
}
