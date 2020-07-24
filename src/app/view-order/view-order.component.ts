import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
interface Ready {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrls: ['./view-order.component.scss']
})
export class ViewOrderComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  goToordermanagement() {
    this.router.navigate(['/ordermanagement'])
  }
  pick: Ready[] = [
    { value: 'lorem ipsum', viewValue: 'lorem ipsum' },
    { value: 'lorem ipsum', viewValue: 'lorem ipsum' },
    { value: 'lorem ipsum', viewValue: 'lorem ipsum' },
    { value: 'lorem ipsum', viewValue: 'lorem ipsum' }
  ];

}
