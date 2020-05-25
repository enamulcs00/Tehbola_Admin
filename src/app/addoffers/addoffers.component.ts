import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
interface Ready {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-addoffers',
  templateUrl: './addoffers.component.html',
  styleUrls: ['./addoffers.component.scss']
})
export class AddoffersComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  goToofferdeals(){
    this.router.navigate(['offerdeals'])
  }
  pick: Ready[] = [
    { value: 'Lorem ipsum', viewValue: 'Lorem ipsum' },
    { value: 'Lorem ipsum', viewValue: 'Lorem ipsum' },
    { value: 'Lorem ipsum', viewValue: 'Lorem ipsum' },
    { value: 'Lorem ipsum', viewValue: 'Lorem ipsum' }
  ];

}
