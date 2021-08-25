import { Component, OnInit, ViewChild } from '@angular/core';
import { MapsAPILoader, AgmMap } from '@agm/core';
import { } from 'googlemaps';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { CommonService } from 'src/services/common.service';
@Component({
  selector: 'app-geofence',
  templateUrl: './geofence.component.html',
  styleUrls: ['./geofence.component.scss']
})
export class GeofenceComponent implements OnInit {

  lat: any;
  lng: any;
  count: any = 5
  page = 1
  private geoCoder;
  flagShow: boolean;
  geofenceList: any;
  Map: any;
  locationPoints: any;
  constructTriangle: any;
  drawingManager: google.maps.drawing.DrawingManager;
  polyarray: any;
  user: any;
  constructor(private router: Router, private mapsAPILoader: MapsAPILoader, private apiService: ApiService, private commonService: CommonService) {
    this.user = JSON.parse(this.apiService.getUser())
   }

  ngOnInit() {

    this.mapsAPILoader.load().then(() => {

      this.geoCoder = new google.maps.Geocoder;
    });


    this.getAllGeofence()
  }


  opened(event) {

    // alert('opened')
    console.log('test opened accordian', event);

    this.locationPoints = event
    // console.log('geoId', geoId);

    var drawPolygonArr: Array<google.maps.LatLng> = [];
    this.locationPoints.forEach(element => {

      this.lat = element.lat;
      this.lng = element.lng;
      drawPolygonArr.push(
        new google.maps.LatLng(element.lat, element.lng)
      )
    });
    console.log("drawPolygonArr", drawPolygonArr)
    if (this.constructTriangle) {
      this.constructTriangle.setMap(null)
    }
    // Construct the polygon.
    this.constructTriangle = new google.maps.Polygon({
      paths: drawPolygonArr,
      strokeColor: '#800303',
      strokeOpacity: 0.8,
      strokeWeight: 3,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      editable: false,
      draggable: false
    })
    this.constructTriangle.setMap(null);

    this.constructTriangle.setMap(this.Map);
    console.log("this.polyarray ", this.polyarray)

  }

  onMapReady(map) {
    console.log("DATA", map)

    this.Map = map;
    //this.initDrawingManager(this.Map);
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
      this.count = 5

    }
    this.getAllGeofence()

  }


  onMapReady1(map) {
    this.Map = map;
    this.initDrawingManager(this.Map);

  }

  initDrawingManager(map: any) {
    this.drawingManager = new google.maps.drawing.DrawingManager({
      drawingControl: true,

      polygonOptions: {
        draggable: true,
        editable: true
      },
      drawingMode: google.maps.drawing.OverlayType.CIRCLE
    });

    this.drawingManager.setMap(map);


    google.maps.event.addListener(this.drawingManager, 'overlaycomplete',
      (event) => {
        if (event.type === google.maps.drawing.OverlayType.POLYGON) { //this is the coordinate, you can assign it to a variable or pass into another function. 

          this.polyarray = event.overlay.getPath().getArray();
        }
      });

  }



  addGeofence() {

    this.router.navigate(['add-geofence'])

  }

  editGeofence(id) {
    this.router.navigate(['edit-geofence'], { queryParams: { 'id': id } })
  }

  deleteGeofence(id) {

    this.apiService.deleteGeofence(id).subscribe(res => {
      console.log(res);
      if (res.success) {
        this.getAllGeofence();
        this.commonService.successToast(res.message);

      } else {
        this.commonService.errorToast(res.message);
      }

    })

  }

}




// public mkSquares(value: any){
//   let squares = [];
//   this._loader.load().then(() => {
//     this.detection.getSections().subscribe(data => {
//       for (let index in data) {
//         let obj = [];
//         for (let point of value) {

//           if (data[index]['SECTION_ID'] == point.SECTION_ID) {
//             let splits = point.LAT_LON.split(",");


//             let coords = new google.maps.LatLng(parseFloat(splits[0]), parseFloat(splits[1]));
//             obj.push(coords);
//           }
//         }

//         squares.push(obj);

//       }
//       this.paths = squares;
//     })

//   })
// }