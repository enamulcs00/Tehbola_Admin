import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
interface Ready {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-editdiscount',
  templateUrl: './editdiscount.component.html',
  styleUrls: ['./editdiscount.component.scss']
})
export class EditdiscountComponent implements OnInit {

  pick: Ready[] = [
    { value: 'Lorem ipsum', viewValue: 'Lorem ipsum' },
    { value: 'Lorem ipsum', viewValue: 'Lorem ipsum' },
    { value: 'Lorem ipsum', viewValue: 'Lorem ipsum' },
    { value: 'Lorem ipsum', viewValue: 'Lorem ipsum' }
  ];

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goToofferdeals(){
    this.router.navigate(['offerdeals'])
  }

}
