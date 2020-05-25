import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking-request-history',
  templateUrl: './booking-request-history.component.html',
  styleUrls: ['./booking-request-history.component.scss']
})
export class BookingRequestHistoryComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  goTomanageUser() {
    this.router.navigate(['manageUser']);
  }
}
