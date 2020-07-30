import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { PageEvent } from '@angular/material/paginator';
import { UrlService } from 'src/services/url.service';
import { CommonService } from 'src/services/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-offerdeals',
  templateUrl: './offerdeals.component.html',
  styleUrls: ['./offerdeals.component.scss']
})
export class OfferdealsComponent implements OnInit {

  page = 1
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent;
  filterBy: string = '';
  search: string = '';
  flagData: boolean;
  bannerList: any;
  imagePath: any;
  getDesc;
  modalData: any
  constructor(private router: Router, private apiService: ApiService, private urlService: UrlService, private commonService: CommonService) {
    this.imagePath = this.urlService.imageUrl;

  }

  ngOnInit() {
    this.getAllDiscount()
  }

  getAllDiscount() {

    this.apiService.getAllDiscount(this.page, this.pageSize, this.search, this.filterBy).subscribe((res) => {
      if (res) {
        if (res.data.length > 0) {
          this.flagData = false
          this.bannerList = res.data
          console.log(this.bannerList)
        } else {
          this.flagData = true
        }
      };

    })

  }

  getDAta(elm) {
    let listdata;
    this.getDesc = this.bannerList.filter(data => data._id == elm);
    listdata = this.getDesc[0].offer.list;
    this.modalData = listdata;
    console.log(listdata);
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
    this.apiService.getAllDiscount(this.page, this.pageSize, this.search, this.filterBy).subscribe((res) => {
      if (res) {
        if (res.data.length > 0) {
          this.flagData = false
          this.bannerList = res.data
          console.log(this.bannerList)
        } else {
          this.flagData = true
        }
      };
    });

  }



  discountListAfterPageSizeChanged(e): any {
    //console.log(e);
    this.apiService.getAllDiscount(1, e.pageSize, this.search, this.filterBy).subscribe((res) => {
      if (res.success) {
        if (res.data.length > 0) {
          this.flagData = false
          this.bannerList = res.data;
          console.log(this.bannerList);
        } else {
          this.flagData = true
        }
      }
    })
  }


  flagSearch: boolean = true
  searchMethod() {
    debugger
    this.flagSearch = false
    // console.log(this.search);
    this.apiService.getAllDiscount(this.page, this.pageSize, this.search, this.filterBy).subscribe((res) => {
      if (res.success) {
        if (res.data.length > 0) {
          this.flagData = false
          this.bannerList = res.data;
          console.log(this.bannerList);
        } else {
          this.flagData = true
        }
      }
    })

  }


  clearSearch() {

    this.flagSearch = true
    this.search = ''
    this.apiService.getAllDiscount(this.page, this.pageSize, this.search, this.filterBy).subscribe((res) => {
      if (res.success) {
        if (res.data.length > 0) {
          this.flagData = false
          this.bannerList = res.data;
          console.log(this.bannerList);
        } else {
          this.flagData = true
        }
      }
    });
  }



  changeDiscountStatus(id, status) {


    let temp = id
    let body
    for (let i = 0; i <= this.bannerList.length; i++) {
      if (this.bannerList[i]._id == temp) {
        if (status == 1) {
          body = {
            "model": "Banner",
            "id": temp,
            "status": 0
          }
        } else {
          body = {
            "model": "Banner",
            "id": temp,
            "status": 1
          }
        }
        console.log(body)
        this.apiService.changeUserStatus(body).subscribe((res) => {
          console.log(res)
          this.getAllDiscount();
        });
      }

    }
  }




  async deleteDiscount(id) {
    debugger
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
        // let id: any

        const data = {
          "id": id,
          "model": "Banner"
        }
        this.apiService.delete(data)

        this.deleteFromList()
      } else {
        console.log("cancellled")
      }

    });


  }

  deleteFromList() {
    setTimeout(() => {
      let temp = this.apiService.flagDelete;
      if (temp == true) {
        // this.userList.splice(i, 1);
        // console.log(this.userList)
        // alert("deleted")
        this.commonService.successToast('User deleted');
        this.getAllDiscount();
      }
      else {
        console.log("error")
      }
    }, 2000);


  }


  goToaddoffers() {
    this.router.navigate(['addoffers'])
  }
  goToviewdiscount(id) {

    this.router.navigate(['viewdiscount'], { queryParams: { "id": id } })
  }
  goToeditdiscount(id) {
    this.router.navigate(['editdiscount'], { queryParams: { "id": id } })
  }
}
