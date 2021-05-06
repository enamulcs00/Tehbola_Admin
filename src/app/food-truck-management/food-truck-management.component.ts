import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { UrlService } from 'src/services/url.service';
import { CommonService } from 'src/services/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-food-truck-management',
  templateUrl: './food-truck-management.component.html',
  styleUrls: ['./food-truck-management.component.scss']
})
export class FoodTruckManagementComponent implements OnInit {
  progress: boolean
  length = 100;
  pageSize = 10;
  noDataFound = false
  page = 1
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent;
  filterBy = '';
  search = '';
  vendorList: any;
  isApproved: any
  status: any
  selectOption: string
  flagUserList: boolean = false;
  addFoodTruckForm: FormGroup
  editFoodTruckForm: FormGroup
  srNo: number = 1;
  roles: any = 'merchant';
  categoryList: any[];
  selectedCategory = [];
  body2: any;
  flagSearch: any = true
  flagapproval: boolean;
  foodTruckList: any;
  id: any;
  user: any;
  constructor(private router: Router, private apiService: ApiService,
    private route: ActivatedRoute,
    private serverUrl: UrlService,
    private commonService: CommonService, private fb: FormBuilder) { 
      this.user = JSON.parse(this.apiService.getUser())

    }

  ngOnInit() {
    this.getAllFoodTruck()
    this.addFoodTruckForm = this.fb.group({
      vehicleNumber: ['', Validators.required],
      remark: [''],
      name: ['', Validators.required],
    })

    this.editFoodTruckForm = this.fb.group({
      vehicleNumber: ['', Validators.required],
      remark: [''],
      name: ['', Validators.required],
    })
  }

  onAddFoodTruck() {

    if (this.addFoodTruckForm.valid) {
      let body = this.addFoodTruckForm.value
      console.log("add food truck form body", body);

      this.apiService.addFoodTruck(body).subscribe(res => {
        console.log(res);
        if (res.success) {
          this.commonService.successToast(res.message);
          this.getAllFoodTruck()
          this.addFoodTruckForm.reset()
          document.getElementById('closeAddFoodTruck').click()
        } else {
          this.commonService.errorToast(res.message)
        }

      })

    } else {
      this.commonService.errorToast("Please Fill All required Details")
    }
  }



  onEditFoodTruck() {

    if (this.editFoodTruckForm.valid) {
      let body = this.editFoodTruckForm.value
      this.apiService.editFoodTruck(body, this.id).subscribe(res => {
        console.log(res);
        if (res.success) {
          this.commonService.successToast(res.message);
          this.getAllFoodTruck()
          this.editFoodTruckForm.reset()
        } else {
          this.commonService.errorToast(res.message)
        }

      })
    } else {
      this.commonService.errorToast("Please Fill All required Details")
    }
  }


  cancelClicked() {
    this.addFoodTruckForm.reset()
  }
  flag: boolean
  filterSelected(e) {
    if (this.filterBy) {
      this.flag = true
    }
    else {
      this.flag = false
    }
    console.log(e.value);
    this.filterBy = e.value;
    this.getAllFoodTruck()
  }

  searchMethod() {
    this.flagSearch = false
    this.getAllFoodTruck();

  }

  clearSearch() {
    this.flagSearch = true
    this.search = ''
    this.getAllFoodTruck()
  }

  vendorListAfterPageSizeChanged(e): any {
    if (e.pageIndex == 0) {
      this.page = 1;
      this.pageSize = e.pageSize
      // this.page = e.pageIndex;
      //  this.srNo = e.pageIndex * e.pageSize
      this.flagUserList = false
    } else {
      if (e.previousPageIndex < e.pageIndex) {
        this.page = e.pageIndex + 1;
        this.srNo = e.pageIndex * e.pageSize
        this.flagUserList = true
      } else {
        this.page = e.pageIndex;
        this.srNo = e.pageIndex * e.pageSize
        this.flagUserList = true
      }

    }

    this.getAllFoodTruck()
  }


  goToViewEquipmentStatus() {

  }

  edit(id) {
    this.id = id
    this.apiService.getFoodTruck(id).subscribe(res => {
      console.log(res);
      if (res.success) {
        this.editFoodTruckForm.get('name').setValue(res.data.name);
        this.editFoodTruckForm.get('vehicleNumber').setValue(res.data.vehicleNumber)
        this.editFoodTruckForm.get('remark').setValue(res.data.remark)
      }

    })

  }

  delete(id) {


    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this Food truck!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085D6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",

      allowOutsideClick: true
    }).then(result => {
      if (result.value) {
        console.log(id)


        const data = {
          "id": id,
          "model": "FoodTrucks"
        }
        this.progress = true
        this.apiService.delete(data).subscribe(res => {
          console.log(res);
          if (res.success) {
            //  this.getAllCategories()
            this.progress = false
            this.commonService.successToast(res.message);
            this.getAllFoodTruck()

          } else {
            this.progress = false
            this.commonService.errorToast(res.message)
          }

        });

      } else {
        console.log("cancellled")
      }

    });



  }

  onChangeBlockStatus(status, id) {

    let body
    let temp = id
    for (let i = 0; i <= this.foodTruckList.length; i++) {
      if (this.foodTruckList[i]._id == temp) {
        if (status == 1) {
          body = {
            "model": "FoodTrucks",
            "id": temp,
            "status": 0
          }
        } else {
          body = {
            "model": "FoodTrucks",
            "id": temp,
            "status": 1
          }
        }
        console.log(body)
        this.progress = true
        this.apiService.updateStatus(body).subscribe((res) => {
          console.log(res)
          if (res.success) {
            this.progress = false
            this.commonService.successToast(res.message)
            this.getAllFoodTruck();
          } else {
            this.progress = false
          }

        });
      }

    }

  }




  getAllFoodTruck() {

    this.apiService.getAllFoodTruck(this.filterBy, this.search, this.pageSize, this.page).subscribe(res => {
      console.log(res);
      if (res.success) {
        this.foodTruckList = res.data;
        this.length = this.foodTruckList.length

      }


    })


  }

}
