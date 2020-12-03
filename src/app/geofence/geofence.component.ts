import { Component, OnInit } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { } from 'googlemaps';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
@Component({
  selector: 'app-geofence',
  templateUrl: './geofence.component.html',
  styleUrls: ['./geofence.component.scss']
})
export class GeofenceComponent implements OnInit {

  lat: any;
  lng: any;
  count: any = 10
  page = 1
  private geoCoder;
  flagShow: boolean;
  geofenceList: any;
  Map: any;
  locationPoints: any;
  constructTriangle: any;
  constructor(private router: Router, private mapsAPILoader: MapsAPILoader, private apiService: ApiService) { }

  ngOnInit() {

    this.mapsAPILoader.load().then(() => {

      this.geoCoder = new google.maps.Geocoder;
    });


    this.getAllGeofence()
  }


  opened(event) {
    debugger
    alert('opened')
    console.log('test opened accordian', event);
    this.locationPoints = event.coordinates[0]
    // console.log('geoId', geoId);

    var drawPolygonArr = [];
    this.locationPoints.forEach(element => {
      debugger
      this.lat = element[0];
      this.lng = element[1];
      drawPolygonArr.push({
        lat: element[0],
        lng: element[1]
      })
    });
    console.log("drawPolygonArr", drawPolygonArr)
    if (this.constructTriangle) {
      this.constructTriangle.setMap(null)
    }
    // Construct the polygon.
    this.constructTriangle = new google.maps.Polygon({
      paths: drawPolygonArr,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 3,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      editable: false,
      draggable: false
    })
    // this.constructTriangle.setMap(null);

    this.constructTriangle.setMap(this.Map);


  }

  onMapReady(map) {
    console.log("DATA")
    this.Map = map;
  }

  getAllGeofence() {
    let body = {
      page: this.page,
      count: this.count
    }

    this.apiService.getAllGeofence(body).subscribe(res => {

      if (res.success) {
        this.geofenceList = res.data
        console.log(this.geofenceList);
      }

    })
  }


  countChanged(event) {
    console.log(event);

    if (event.value) {
      this.flagShow = true
      this.count = event.value
    } else {
      this.flagShow = true
      this.count = 10

    }
    this.getAllGeofence()

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
