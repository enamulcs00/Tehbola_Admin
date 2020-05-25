import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss']
})
export class ManageUserComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  goToadduser() {
    this.router.navigate(['adduser'])
  };
  goTobookingRequestHistory(){
    this.router.navigate(['bookingRequestHistory'])
  };
  goToviewUser(){
    this.router.navigate(['viewUser'])
  };
  goToeditUser(){
    this.router.navigate(['editUser'])
  };
  
}
