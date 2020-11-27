import { Component, OnInit } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { } from 'googlemaps';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-geofence',
  templateUrl: './geofence.component.html',
  styleUrls: ['./geofence.component.scss']
})
export class GeofenceComponent implements OnInit {

  lat = 51.678418;
  lng = 7.809007;
  constructor(private router: Router) { }

  ngOnInit() {
  }

  addGeofence() {
    debugger
    this.router.navigate(['add-geofence'])

  }

  editGeofence() {
    this.router.navigate(['add-geofence'])
  }

  deleteGeofence() { }

}
