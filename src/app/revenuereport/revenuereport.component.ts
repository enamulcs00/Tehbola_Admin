import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-revenuereport',
  templateUrl: './revenuereport.component.html',
  styleUrls: ['./revenuereport.component.scss']
})
export class RevenuereportComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  goToanalytics(){
    this.router.navigate(['analytics'])
  }
  goToreveuegraph(){
    this.router.navigate(['reveuegraph'])
  }
}
