import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inventry-management',
  templateUrl: './inventry-management.component.html',
  styleUrls: ['./inventry-management.component.scss']
})
export class InventryManagementComponent implements OnInit {

  constructor(private router: Router) { 
   
    
  }
  goToviewinventory(){
    this.router.navigate(['viewinventory'])
  }
  ngOnInit() {
  }

}
