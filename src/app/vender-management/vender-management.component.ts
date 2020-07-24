import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { ApiService } from 'src/services/api.service';
import { query } from '@angular/animations';
import Swal from "sweetalert2";
@Component({
  selector: 'app-vender-management',
  templateUrl: './vender-management.component.html',
  styleUrls: ['./vender-management.component.scss']
})
export class VenderManagementComponent implements OnInit {

  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent;
  filterBy = '';
  search = '';
  vendorList: any;
  status: any
  selectOption: string
  constructor(private router: Router, private apiService: ApiService) { }

  ngOnInit() {
    this.showVendorList();
  }

  flag = false
  filterSelected(e) {
    if (this.filterBy) {
      this.flag = true
    }
    else {
      this.flag = false

    }
    console.log(e.target.value);
    this.filterBy = e.target.value;
    this.apiService.getVendorList(1, this.pageSize, this.filterBy, this.search).subscribe((res) => {
      if (res.success) {
        console.log(res);
        this.vendorList = res.data;
      }
    });
  }


  showVendorList() {
    console.log("inside getvendor")
    this.apiService.getVendorList(1, this.pageSize, this.filterBy, this.search).subscribe((res) => {
      if (res.success) {
        console.log(res);
        this.vendorList = res.data;
      }
    });


  }
  vendorListAfterPageSizeChanged(e): any {
    console.log(e);
    this.apiService.getVendorList(1, e.pageSize, this.filterBy, this.search).subscribe((res) => {
      if (res.success) {
        this.vendorList = res.data;
        console.log(this.vendorList);
      }
    })
  }


  flagSearch: boolean = true
  searchMethod() {
    this.flagSearch = false
    console.log(this.search);
    this.apiService.getVendorList(1, this.pageSize, this.filterBy, this.search).subscribe((res) => {
      if (res.success) {
        this.vendorList = res.data;
        console.log(this.vendorList);
      }
    })

  }

  clearSearch() {
    this.flagSearch = true
    this.search = ''
    this.apiService.getVendorList(1, this.pageSize, this.filterBy, this.search).subscribe((res) => {
      if (res.success) {
        this.vendorList = res.data;
        console.log(this.vendorList);
      }
    })

  }

  deleteVendor(i) {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this Category!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085D6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",

      allowOutsideClick: true
    }).then(result => {
      if (result.value) {
        let id: any
        for (let j = 0; j <= this.vendorList.length; j++) {
          if (i == j) {
            id = this.vendorList[j]._id;
            console.log("got delete request For-", id)

          }
        }
        const data = {
          "id": id,
          "model": "User"
        }
        this.apiService.delete(data);
        this.deleteFromList(i)
      }
      else {
        console.log("cancelled");
      }
    })


  }
  deleteFromList(i) {
    setTimeout(() => {
      let temp = this.apiService.flagDelete;
      if (temp == true) {
        this.vendorList.splice(i, 1);
        console.log(this.vendorList)
      }
      else {
        console.log("error")
      }
    }, 1000);


  }



  goToaddVender() {
    this.router.navigate(['addVender'])
  }
  goToviewVendor() {
    this.router.navigate(['viewVendor'])
  }
  goToeditVendor() {
    this.router.navigate(['editVendor'])
  }
  goToproduct(i) {
    let id: any
    let name: string
    for (let j = 0; j <= this.vendorList.length; j++) {
      if (i == j) {
        id = this.vendorList[j]._id;
        name = this.vendorList[j].firstName;

      }
    }

    this.router.navigate(['product'], { queryParams: { "id": id, "name": name } })
  }

  goToViewCategory(id, name) {

    this.router.navigate(['viewcategory'], { queryParams: { "id": id, "name": name } })

  }



}
