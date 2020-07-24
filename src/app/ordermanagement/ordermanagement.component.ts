import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ordermanagement',
  templateUrl: './ordermanagement.component.html',
  styleUrls: ['./ordermanagement.component.scss']
})
export class OrdermanagementComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  goToaddordermanagement() {
    this.router.navigate(['/addordermanagement'])
  };
  goToeditOrder(){
    this.router.navigate(['/editOrder'])
  };
  goToviewOrder() {
    this.router.navigate(['/viewOrder'])
  };
 
  

}
