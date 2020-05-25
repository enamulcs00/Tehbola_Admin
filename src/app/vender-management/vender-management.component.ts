import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vender-management',
  templateUrl: './vender-management.component.html',
  styleUrls: ['./vender-management.component.scss']
})
export class VenderManagementComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  goToaddVender(){
    this.router.navigate(['addVender'])
  }
  goToviewVendor(){
    this.router.navigate(['viewVendor'])
  }
  goToeditVendor(){
    this.router.navigate(['editVendor'])
  }
  goToproduct(){
    this.router.navigate(['product'])
  }
  
  
  
}
