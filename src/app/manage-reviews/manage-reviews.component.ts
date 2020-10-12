import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/services/api.service';
import { PageEvent } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { CommonService } from 'src/services/common.service';

@Component({
  selector: 'app-manage-reviews',
  templateUrl: './manage-reviews.component.html',
  styleUrls: ['./manage-reviews.component.scss']
})
export class ManageReviewsComponent implements OnInit {

  page = 1;
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent;
  filterBy: string = '';
  search: string = '';

  status: number
  flagSearch: boolean = true;
  flagData: any;
  flag: any
  flagUserList: boolean;
  srNo: number;
  reviewList: any;
  constructor(private apiService: ApiService, private commonService: CommonService) { }

  ngOnInit() {
    this.getReview(this.page, this.pageSize, this.search, this.filterBy)
  }

  getReview(page, pageSize, search, filterBy) {
    this.apiService.getReviewList(page, pageSize, search, filterBy).subscribe(res => {
      if (res.success == true) {
        console.log(res)
        this.reviewList = res.data;
        this.length = res.total
        // alert("")
      }
    })


  }

  filterSelected(e) {
    if (this.filterBy) {
      this.flag = true
    }
    else {
      this.flag = false

    }
    console.log(e.target.value);
    this.filterBy = e.target.value;
    this.getReview(this.page, this.pageSize, this.search, this.filterBy)
  }


  searchMethod() {

    this.flagSearch = false
    this.getReview(this.page, this.pageSize, this.search, this.filterBy)

  }


  clearSearch() {

    this.flagSearch = true
    this.search = ''
    this.getReview(this.page, this.pageSize, this.search, this.filterBy)
  }

  statusChnaged(e) {
    console.log(e)
  }

  reviewListAfterPageSizeChanged(e): any {
    console.log(e);

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

    this.getReview(this.page, this.pageSize, this.search, this.filterBy)
  }

  deleteReview(i) {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this Vendor!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085D6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
      allowOutsideClick: true
    }).then(result => {
      if (result.value) {
        let id = i

        const data = {
          "id": id,
          "model": "Rating"
        }
        this.apiService.deleteHard(data).then(res => {
          this.commonService.successToast("Review Deleted")
          this.getReview(this.page, this.pageSize, this.search, this.filterBy)
        });
      }
      else {
        console.log("cancelled");
      }
    })
  }

}
