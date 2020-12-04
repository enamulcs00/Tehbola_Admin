import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { CommonService } from 'src/services/common.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-geofence',
  templateUrl: './edit-geofence.component.html',
  styleUrls: ['./edit-geofence.component.scss']
})
export class EditGeofenceComponent implements OnInit {
  sub: any;
  id: any;
  locationPoints: any;
  private geoCoder;
  name: any;
  @ViewChild("AgmMap", { static: true }) Map: any;
  geofenceName = new FormControl('', Validators.required);
  addgeofence: boolean = true;

  mapsAPILoader: any;
  lat: number;
  lng: number;
  zoom: number;
  constructTriangle: any;
  progress: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router, private apiService: ApiService, private commonService: CommonService) { }

  ngOnInit() {
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.id = params['id'];

      });
    this.mapsAPILoader.load().then(() => {

      this.geoCoder = new google.maps.Geocoder;
    });

    this.getGeonfece()
  }


  onMapReady(map) {
    console.log("DATA")
    this.Map = map;
  }

  getGeonfece() {
    this.progress = true
    this.apiService.getGeofencing(this.id).subscribe((res) => {
      if (res['success'] == true) {
        this.progress = false
        debugger
        console.log(res);
        this.locationPoints = res['geoFencing'].locationPoints;
        this.name = res['geoFencing'].name
        console.log(res, this.locationPoints, this.name);
        this.geofenceName.setValue(this.name)
      } else {
        this.progress = false
      }
      this.onEdit(this.locationPoints)
    });

  }

  onEdit(locationPoints) {
    debugger

    // console.log('geoId', geoId);


    var drawPolygonArr = [];
    locationPoints.forEach(element => {
      drawPolygonArr.push({
        lat: element.lat,
        lng: element.lng
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
      editable: true,
      draggable: true
    })
    this.constructTriangle.setMap(null);

    this.constructTriangle.setMap(this.Map);


    // google.maps.event.addListener(this.constructTriangle, 'dragend',(event) => {
    // this.polyarray = event.overlay.getPath().getArray();


    // polygon.setPath(arrCoords);
    // (event) => {
    //   console.log(event,"ecehkjjk")
    //  this.polyarray = event.latLng.lat()

    //console.log("this.polyarray ", this.polyarray)
    //   // }
    // });
    // })
  }


  setCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        // console.log("name", position);
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.zoom = 11;
        this.getAddress(this.lat, this.lng);
      });
    }
  }

  markerDragEnd(ev) {
    // console.log(ev);
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {

    });
  }

  back() {
    history.back();
  }


  save() {
    this.getPolygonCoordinates(this.constructTriangle);
  }



  getPolygonCoordinates(draggablePolygon) {
    const len = draggablePolygon.getPath().getLength();
    const polyArrayLatLng = [];

    for (let i = 0; i < len; i++) {
      const vertex = draggablePolygon.getPath().getAt(i);
      const vertexLatLng = { lat: vertex.lat(), lng: vertex.lng() };
      polyArrayLatLng.push(vertexLatLng);
    }
    console.log(polyArrayLatLng);

    if (this.geofenceName.valid) {
      this.addgeofence = false;
      var geofenceData = {
        "geoId": this.id,
        "name": this.geofenceName.value,
        "locationPoints": polyArrayLatLng
      }
      console.log("geofencedata", geofenceData)
      this.apiService.updateGeofencing(geofenceData).subscribe((res) => {

        if (res['success'] == true) {
          this.addgeofence = false;
          this.commonService.successToast(res.message)

          this.router.navigate(['/admin/geofencing'])
        } else {
          this.commonService.errorToast(res.message)
        }

      });
    }

  }



}
