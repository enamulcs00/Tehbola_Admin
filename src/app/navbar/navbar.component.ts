import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Ready {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private router: Router) { }
  pick: Ready[] = [
    { value: '10 Min-0', viewValue: 'Arabic' },
    { value: '10 Min-1', viewValue: 'English' },
  ];
  ngOnInit() {
  }
  goTologin() {
    this.router.navigate(['/login'])
  }
  goTonotification(){
    this.router.navigate(['notification'])
  }  
  goToprofile(){
    this.router.navigate(['profile'])
  }  
  goTochangepassword(){
    this.router.navigate(['changepassword'])
  }  
}
