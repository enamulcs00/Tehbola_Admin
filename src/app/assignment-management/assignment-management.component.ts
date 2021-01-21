import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/internal/operators';
import { ApiService } from 'src/services/api.service';
import { CommonService } from 'src/services/common.service';
import Swal from 'sweetalert2';
import { ModalIngredientsComponent } from '../modal/modal-ingredients/modal-ingredients.component';




interface vendor {
  id: string;
  name: string;
}
interface foodTruck {
  id: string;
  name: string;
  truckNumber: string
}

interface goefence {
  id: string;
  name: string;
}

interface equipement {
  id: string;
  name: string;
  quantity: number
}

interface rawItem {
  id: string;
  name: string;
  quantity: number
  unit: string
}





@Component({
  selector: 'app-assignment-management',
  templateUrl: './assignment-management.component.html',
  styleUrls: ['./assignment-management.component.scss']
})
export class AssignmentManagementComponent implements OnInit {
  progress: boolean
  date = new Date();
  isCompleted: string = '';
  status = '';
  filterDate: any = '';
  assignmentForm: FormGroup;
  equipmentList: Array<equipement> = [];
  truckList: Array<foodTruck> = [];
  vendorList: Array<vendor> = [];
  geofenceList: Array<goefence> = [];
  rawItemList: Array<rawItem> = []
  getAssignmentListData: any;
  equipmentListForModel: any;
  rawItemListForModel: any;
  backDropClick: boolean;
  constructor(public dialog: MatDialog, private apiService: ApiService, private commonService: CommonService, private fb: FormBuilder) { }

  ngOnInit() {
    console.log(this.date);

    this.getAssignmentdata()
    this.assignmentForm = this.fb.group({
      selectedDate: ['', Validators.required],
      selectedVendor: ['', Validators.required],
      selectedFoodTruck: ['', Validators.required],
      selectedEquipment: ['', Validators.required],
      selectedGeofence: ['', Validators.required],
      selectedRawItems: ['', Validators.required],
    })



  }

  flag: boolean = false
  filterSelected(e) {

    if (this.isCompleted) {
      this.flag = true
    }
    else {
      this.flag = false

    }
    console.log(e.value);
    this.isCompleted = e.value;
    this.getAssignmentList()


  }

  defaultVendorList = this.vendorList
  vendorSearch(value) {

    console.log(value);
    if (value.length > 0) {

      this.vendorList = this.vendorList.filter((unit) => unit.name.indexOf(value) > -1);

    } else {
      this.vendorList = this.defaultVendorList
    }
  }

  defaultTruckData = this.truckList
  foodTruckSearch(value) {

    console.log(value);
    if (value.length > 0) {
      this.truckList = this.truckList.filter((unit) => unit.name.indexOf(value) > -1);
    } else {
      this.truckList = this.defaultTruckData
    }
  }

  defaultGeofenceData = this.geofenceList
  geofenceSearch(value) {

    console.log(value);
    if (value.length > 0) {
      this.geofenceList = this.geofenceList.filter((unit) => unit.name.indexOf(value) > -1);
    } else {
      this.geofenceList = this.defaultGeofenceData
    }
  }
  defaultEquipmentList = this.equipmentList
  equipmentSearch(value) {

    console.log(value);
    if (value.length > 0) {
      this.equipmentList = this.equipmentList.filter((unit) => unit.name.indexOf(value) > -1);
    } else {
      this.equipmentList = this.defaultEquipmentList
    }

  }
  defaultRawItemList = this.rawItemList
  rawItemSearch(value) {


    console.log(value);
    if (value.length > 0) {
      this.rawItemList = this.rawItemList.filter((unit) => unit.name.indexOf(value) > -1);
    } else {
      this.rawItemList = this.defaultRawItemList
    }
  }


  getEquipment(equipment) {
    this.equipmentListForModel = ''
    this.equipmentListForModel = equipment
    console.log("modal list", this.equipmentListForModel);

    document.getElementById('equipmentButton').click()

  }


  getRawItems(rawItemList) {

    this.rawItemListForModel = ''
    this.rawItemListForModel = rawItemList
    console.log("modal list", this.rawItemListForModel);

    document.getElementById('rawItemButton').click()
  }




  getAssignmentdata() {
    this.progress = true;
    this.apiService.getAssignementData().subscribe(res => {
      console.log(res);


      this.progress = false
      if (res.success) {
        res.data.vendor.forEach(element => {
          this.vendorList.push(
            {
              id: element._id,
              name: element.fullName
            })
        });
        res.data.foodTrucks.forEach(element => {
          this.truckList.push(
            {
              id: element._id,
              name: element.name,
              truckNumber: element.vehicleNumber
            })
        });

        res.data.equipment.forEach(element => {
          this.equipmentList.push(
            {
              id: element._id,
              name: element.name,
              quantity: element.quantity
            })
        });

        res.data.geoFence.forEach(element => {
          this.geofenceList.push(
            {
              id: element._id,
              name: element.name,

            })
        });

        res.data.rawItems.forEach(element => {
          this.rawItemList.push(
            {
              id: element._id,
              name: element.name,
              quantity: element.perServingSize,
              unit: element.measureTypeServing
            })
        });
        this.getAssignmentList()
      } else {
        this.commonService.errorToast(res.message)
      }

    })
  }

  getAssignmentList() {
    this.apiService.getAssignmentList(this.isCompleted, status).subscribe(res => {
      console.log(res);
      if (res.success) {
        this.getAssignmentListData = res.data;

      } else {
        this.commonService.errorToast(res.message)
      }

    })
  }




  openDialog() {
    console.log(this.assignmentForm.value);

    const dialogRef = this.dialog.open(ModalIngredientsComponent, {
      data: { data: this.assignmentForm.value },
    });

    dialogRef.backdropClick().subscribe((result) => {
      this.commonService.errorToast('Assignment not Complete. Need to do that again.')
      this.backDropClick = true
    })

    dialogRef.afterClosed().subscribe(result => {

      console.log(`Dialog result: ${result}`);
      let tmp = result;
      console.log(tmp);
      if (!this.backDropClick) {
        this.addAssignment(tmp)
      }

    });
  }

  addAssignment(temp) {
    console.log("data before request", temp);

    this.apiService.addAssignment(temp).subscribe(res => {
      console.log(res);
      if (res.success) {
        this.getAssignmentList()
        this.commonService.successToast(res.message)
        this.assignmentForm.reset()
      } else {
        this.commonService.errorToast(res.message)
      }
    })

  }




  deleteAssignment(id) {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this Assignmnet!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085D6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",

      allowOutsideClick: true
    }).then(result => {
      if (result.value) {
        // this.result = result;
        console.log(id)
        const data = {
          "id": id,
          "model": "Assignment"
        }

        this.apiService.delete(data).subscribe(res => {
          console.log(res);
          if (res.success) {
            this.getAssignmentList()
            this.commonService.successToast(res.message);

          } else {
            this.commonService.errorToast(res.message)
          }

        });


      } else {
        console.log("cancelled");
      }
    });
  }

}
