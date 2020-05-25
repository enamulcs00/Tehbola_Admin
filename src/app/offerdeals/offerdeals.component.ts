import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-offerdeals',
  templateUrl: './offerdeals.component.html',
  styleUrls: ['./offerdeals.component.scss']
})
export class OfferdealsComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  goToaddoffers(){
    this.router.navigate(['addoffers'])
  }
  goToviewdiscount(){
    this.router.navigate(['viewdiscount'])
  }
  goToeditdiscount(){
    this.router.navigate(['editdiscount'])
  }
}
