import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-salesreport',
  templateUrl: './salesreport.component.html',
  styleUrls: ['./salesreport.component.scss']
})
export class SalesreportComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goToanalytics(){
    this.router.navigate(['analytics'])
  }
  goTosalesgraph(){
    this.router.navigate(['salesgraph'])
  }
}
