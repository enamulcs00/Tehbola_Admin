import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-vendor',
  templateUrl: './view-vendor.component.html',
  styleUrls: ['./view-vendor.component.scss']
})
export class ViewVendorComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  goTovendermanagement(){
    this.router.navigate(['venderManagement'])
  }
}
