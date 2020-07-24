import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-view-vendor',
  templateUrl: './view-vendor.component.html',
  styleUrls: ['./view-vendor.component.scss']
})
export class ViewVendorComponent implements OnInit {

  constructor(private router: Router, private apiService: ApiService) { }

  ngOnInit() {

  }




  goTovendermanagement() {
    this.router.navigate(['venderManagement'])
  }



}
