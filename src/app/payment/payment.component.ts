import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }
  goTomanageEarning(){
    this.router.navigate(['manageEarning'])
  }
  goTorefund(){
    this.router.navigate(['refund'])
  }

  
}
