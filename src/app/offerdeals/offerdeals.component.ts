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
  srNo: number = 1;
  flagUserList: boolean = false;
  length: number = 100;
  userDetails: any;
  sellerId: any = '';
  bannerType: any;
  isApproved: any;
  constructor(private router: Router, private apiService: ApiService, private urlService: UrlService, private commonService: CommonService) {
    this.imagePath = this.urlService.imageUrl;
    this.userDetails = JSON.parse(sessionStorage.getItem('Markat_User'))
    if (this.userDetails.roles != 'admin') {
      this.sellerId = this.userDetails._id

      this.bannerType = this.userDetails.roles
      this.isApproved = ''
    } else {
      this.bannerType = ''
      this.isApproved = ''
    }
  }

  ngOnInit() {
    this.getAllDiscount(this.bannerType, this.sellerId, this.isApproved, this.page, this.pageSize, this.search, this.filterBy)
  }

  getAllDiscount(bannerType, sellerId, isApproved, page, pageSize, search, filterby) {

    this.apiService.getAllDiscount(bannerType, sellerId, isApproved, page, pageSize, search, filterby).subscribe((res) => {
      if (res) {
        console.log(res);

        if (res.data.length > 0) {
          this.flagData = false
          this.bannerList = res.data

          this.length = res.total
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
    listdata = this.getDesc[0].offer;
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
    this.getAllDiscount(this.bannerType, this.sellerId, this.isApproved, this.page, this.pageSize, this.search, this.filterBy)


  }



  discountListAfterPageSizeChanged(e): any {
    //console.log(e);

    if (e.pageIndex == 0) {
      this.page = 1;
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

    this.getAllDiscount(this.bannerType, this.sellerId, this.isApproved, this.page, this.pageSize, this.search, this.filterBy)


  }


  flagSearch: boolean = true
  searchMethod() {

    this.flagSearch = false

    this.getAllDiscount(this.bannerType, this.sellerId, this.isApproved, this.page, this.pageSize, this.search, this.filterBy)


  }



  clearSearch() {

    this.flagSearch = true
    this.search = ''

    this.getAllDiscount(this.bannerType, this.sellerId, this.isApproved, this.page, this.pageSize, this.search, this.filterBy)


  }


  accept(id, name, name_ar) {
    let body = {
      id: id,
      name: name,
      name_ar: name_ar,
      isApproved: true
    }

    this.apiService.EditBanner(body).subscribe(res => {
      console.log(res);
      if (res.success) {
        this.commonService.successToast(res.message)
        this.getAllDiscount(this.bannerType, this.sellerId, this.isApproved, this.page, this.pageSize, this.search, this.filterBy)

      } else {
        this.commonService.errorToast(res.message)
      }
    })


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
          this.getAllDiscount(this.bannerType, this.sellerId, this.isApproved, this.page, this.pageSize, this.search, this.filterBy);
        });
      }

    }
  }




  deleteDiscount(id) {

    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this Banner!",
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

        this.apiService.delete(data).subscribe(res => {
          console.log(res);
          if (res.success) {
            // this.getAllCategories()
            this.commonService.successToast(res.message);
            this.getAllDiscount(this.bannerType, this.sellerId, this.isApproved, this.page, this.pageSize, this.search, this.filterBy)

          } else {
            this.commonService.errorToast(res.message)
          }

        });



      } else {
        console.log("cancellled")
      }

    });


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


  back() {
    window.history.back()
  }
}
