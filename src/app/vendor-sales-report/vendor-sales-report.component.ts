import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vendor-sales-report',
  templateUrl: './vendor-sales-report.component.html',
  styleUrls: ['./vendor-sales-report.component.scss']
})
export class VendorSalesReportComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  goToproduct(){
    this.router.navigate(['product'])
  }
  goToreportGraph(){
    this.router.navigate(['reportGraph'])
  }
}
