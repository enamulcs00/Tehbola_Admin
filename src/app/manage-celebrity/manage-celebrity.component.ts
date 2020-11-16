import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { PageEvent } from '@angular/material';
import { Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { CommonService } from 'src/services/common.service';

@Component({
  selector: 'app-manage-celebrity',
  templateUrl: './manage-celebrity.component.html',
  styleUrls: ['./manage-celebrity.component.scss']
})
export class ManageCelebrityComponent implements OnInit {

  length = 100;
  pageSize = 10;
  page = 1
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent;
  filterBy = '';
  search = '';
  vendorList: any;
  status: any
  selectOption: string
  flagUserList: boolean = false;
  srNo: number = 1;
  roles: any = 'celebrity';
  categoryList: any[];
  selectedCategory = [];
  body: any;
  constructor(private router: Router, private apiService: ApiService, private commonService: CommonService) {
    this.getCategoryList()
  }

  ngOnInit() {
    this.showCelebrityList();
  }




  flag = false
  filterSelected(e) {

    if (this.filterBy) {
      this.flag = true
    }
    else {
      this.flag = false

    }
    this.showCelebrityList();

  }


  showCelebrityList() {
    console.log("inside get vendor")
    let body = {
      roles: this.roles,
      filter: this.filterBy,
      search: this.search,
      page: this.page,
      count: this.pageSize
    }
    this.apiService.getList(body).subscribe((res) => {
      if (res.success) {
        console.log(res);
        this.vendorList = res.data;
        this.length = res.total;
      }
    });
  }

  acceptVendor(id) {
    Swal.fire({
      title: "Are you sure?",
      text: "What will be the Commission percentage for the Celeberity",
      icon: "info",
      showCancelButton: true,
      input: 'number',
      confirmButtonColor: "#3085D6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
      allowOutsideClick: true
    }).then(result => {
      if (result.isConfirmed) {
        let body = {
          id: id,
          sellerProfileStatus: 1,
          commission: result.value,
        }
        this.acceptReject(body)
      } else {
        console.log("nothing changed");

      }

    })
  }
  viewDocument(id) {
    this.router.navigate(['document'], { queryParams: { 'id': id, 'role': 'celebrity' } })
  }
  declinedVendor(id) {
    Swal.fire({
      title: "Are you sure?",
      text: "Please Provide the reason to decline this request!",
      icon: "warning",
      showCancelButton: true,
      input: 'text',
      confirmButtonColor: "#3085D6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
      allowOutsideClick: true
    }).then(result => {
      if (result.isConfirmed) {
        let body = {
          id: id,
          sellerProfileStatus: 2,
          message: result.value,
        }
        this.acceptReject(body)
      } else {
        console.log("nothing changed");

      }

    })

  }
  changeUserfeatured(id, status) {

    let temp = id
    for (let i = 0; i <= this.vendorList.length; i++) {
      if (this.vendorList[i]._id == temp) {
        if (status == 1) {
          this.body = {

            "id": temp,
            "isFeatured": false
          }
        } else {
          this.body = {

            "id": temp,
            "isFeatured": true
          }
        }
        console.log(this.body)
        this.apiService.editCelebrity(this.body).subscribe((res) => {
          console.log(res)
          if (res.success) {
            this.commonService.successToast(res.message)
            this.showCelebrityList();
          }

        });
      }

    }
  }


  addCelebrity() {

  }



  changeUserStatus(id, status) {

    let temp = id
    for (let i = 0; i <= this.vendorList.length; i++) {
      if (this.vendorList[i]._id == temp) {
        if (status == 1) {
          this.body = {
            "model": "User",
            "id": temp,
            "status": 0
          }
        } else {
          this.body = {
            "model": "User",
            "id": temp,
            "status": 1
          }
        }
        console.log(this.body)
        this.apiService.changeUserStatus(this.body).subscribe((res) => {
          console.log(res)
          if (res.success) {
            this.commonService.successToast(res.message)
            this.showCelebrityList();
          }

        });
      }

    }
  }

  acceptReject(body) {
    debugger
    this.apiService.approveReject(body).subscribe(res => {
      console.log(res);
      if (res.success) {
        this.commonService.successToast(res.message)
        this.showCelebrityList();

      } else {
        this.commonService.errorToast(res.message)

      }
    })

  }

  vendorListAfterPageSizeChanged(e): any {
    console.log(e);
    if (e.pageIndex == 0) {
      this.page = 1;
      // this.page = e.pageIndex;
      //  this.srNo = e.pageIndex * e.pageSize
      this.pageSize = e.pageSize
      this.flagUserList = false
    } else {
      if (e.previousPageIndex < e.pageIndex) {
        this.page = e.pageIndex + 1;
        this.pageSize = e.pageSize
        this.srNo = e.pageIndex * e.pageSize
        this.flagUserList = true
      } else {
        this.page = e.pageIndex;
        this.pageSize = e.pageSize
        this.srNo = e.pageIndex * e.pageSize
        this.flagUserList = true
      }

    }
    this.showCelebrityList()
  }


  flagSearch: boolean = true
  searchMethod() {
    this.flagSearch = false
    console.log(this.search);
    this.showCelebrityList()
  }

  clearSearch() {
    this.flagSearch = true
    this.search = ''
    this.showCelebrityList()

  }
  deleteCelebrity(id) {

    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this User!",
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
          "model": "User"
        }

        this.apiService.delete(data).subscribe(res => {
          console.log(res);
          if (res.success) {
            //  this.getAllCategories()
            this.commonService.successToast(res.message);
            this.showCelebrityList()

          } else {
            this.commonService.errorToast(res.message)
          }

        });

      } else {
        console.log("cancellled")
      }

    });


  }


  goToaddVender() {
    this.router.navigate(['add'], { queryParams: { 'check': 'celebrity' } })
  }
  goToviewVendor(id) {
    this.router.navigate(['view'], { queryParams: { 'id': id } })

  }
  goToeditVendor(id) {
    this.router.navigate(['edit'], { queryParams: { 'id': id } })
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

  goToViewCategory(id) {
    this.selectedCategory = []
    // alert(id);
    for (let item in this.categoryList) {
      for (let category in id) {
        if (this.categoryList[item].id == id[category]) {
          this.selectedCategory.push(this.categoryList[item])
        }
      }
    }


  }

  getCategoryList() {

    let temp = []
    this.categoryList = []
    let page = 1;
    let count = 200;

    this.apiService.getAllCategories().subscribe(res => {

      if (res.success) {

        console.log(res)
        this.categoryList = res.data

      }

    }
    );
  }


  back() {
    window.history.back()
  }
}
