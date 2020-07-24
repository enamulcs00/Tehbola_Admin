import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-vendor',
  templateUrl: './edit-vendor.component.html',
  styleUrls: ['./edit-vendor.component.scss']
})
export class EditVendorComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  goTovendermanagement(){
    this.router.navigate(['venderManagement'])
  }
}
