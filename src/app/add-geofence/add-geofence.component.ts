import { Component, OnInit, ViewChild } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { ApiService } from 'src/services/api.service';
import { FormControl, Validators } from '@angular/forms';
import { CommonService } from 'src/services/common.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-geofence',
  templateUrl: './add-geofence.component.html',
  styleUrls: ['./add-geofence.component.scss']
})
export class AddGeofenceComponent implements OnInit {

  lat = 51.678418;
  lng = 7.809007;
  latitude: number;
  @ViewChild("AgmMap", { static: true }) Map: any;
  longitude: number;
  zoom: number;
  geoCoder: google.maps.Geocoder;
  drawingManager: google.maps.drawing.DrawingManager;
  polyarray: any = [];

  geofenceName = new FormControl('', Validators.required);
  progress: boolean;
  sub: any;

  constructor(private mapsAPILoader: MapsAPILoader, private router: Router, private apiService: ApiService, private commonService: CommonService) {
    this.setCurrentLocation()
  }

  ngOnInit() {




    this.mapsAPILoader.load().then(() => {

      this.geoCoder = new google.maps.Geocoder;
    });
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


  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {

    });
  }


  onMapReady(map) {
    this.Map = map;
    this.initDrawingManager(this.Map);
  }


  initDrawingManager(map: any) { // method is used to create POLYGON
    debugger
    const options = {
      drawingControl: true,
      drawingControlOptions: {

        drawingModes: [google.maps.drawing.OverlayType.POLYGON]
      },
      polygonOptions: {
        draggable: true,
        editable: true
      },
      drawingMode: google.maps.drawing.OverlayType.POLYGON
    };


    this.drawingManager = new google.maps.drawing.DrawingManager(options);
    this.drawingManager.setMap(map);


    google.maps.event.addListener(this.drawingManager, 'overlaycomplete',
      (event) => {
        debugger
        if (event.type === google.maps.drawing.OverlayType.POLYGON) { //this is the coordinate, you can assign it to a variable or pass into another function. 
          this.polyarray = event.overlay.getPath().getArray();
          console.log(this.polyarray);

        }
      });

  }



  save() {
    debugger
    if (this.geofenceName.valid && this.polyarray.length > 0) {

      this.progress = true
      var geofenceData = {
        "name": this.geofenceName.value,
        "locationPoints": this.polyarray
      }

      this.apiService.createGeoFencing(geofenceData).subscribe((res) => {
        if (res.success) {
          this.progress = false
          console.log(res);
          this.commonService.successToast(res.message)
          this.router.navigate(['geofence'])
        } else {
          this.progress = false
          this.commonService.errorToast(res.message)
        }
      });
    } else {
      this.commonService.errorToast('Make Sure you have typed in the name and selected the area for geofence')

    }

  }

  back() {
    history.back();
  }
}
