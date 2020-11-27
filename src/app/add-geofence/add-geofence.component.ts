import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-geofence',
  templateUrl: './add-geofence.component.html',
  styleUrls: ['./add-geofence.component.scss']
})
export class AddGeofenceComponent implements OnInit {

  lat = 51.678418;
  lng = 7.809007;
  constructor() { }

  ngOnInit() {
  }

  back() {
    history.back();
  }
}
