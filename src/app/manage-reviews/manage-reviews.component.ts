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
  reportList: any;
  lengthforReport: any;
  pageForReport: any=1;
  pageSizeForReport: any=10;
  searchForReport: any='';
  filterByForReport: any;
  flagForReport: boolean;
  flagSearchForReport: boolean=true;
  constructor(private apiService: ApiService, private commonService: CommonService) { }

  ngOnInit() {
    this.getReview(this.page, this.pageSize, this.search, this.filterBy)
    this.getReportedIssue()
  }

  getReview(page, pageSize, search, filterBy) {
    this.apiService.getReviewList(page, pageSize, search, filterBy).subscribe(res => {
      if (res.success == true) {
        console.log(res)
        this.reviewList = res.data;
        this.reviewList.forEach(ele=>{
          let temp=[]
          for(let i=1;i<=5;i++){
            if(i<=ele.rating){
              temp.push(true)
            }else{
              temp.push(false)
            }
          }
          ele.rating=temp
        });
        this.length = res.total
        // alert("")
      }
    })


  }



  
  getReportedIssue() {
    this.apiService.getReportedIssue(this.pageForReport, this.pageSizeForReport, this.searchForReport, ).subscribe(res => {
      if (res.success == true) {
        console.log(res)
        this.reportList = res.data;
      
        this.lengthforReport = res.total
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
    console.log(e);

    this.getReview(this.page, this.pageSize, this.search, this.filterBy)
  }





  searchMethod() {

    this.flagSearch = false
    this.getReview(this.page, this.pageSize, this.search, this.filterBy)

  }


  
  searchMethodForReport() {

    this.flagSearchForReport = false
    this.getReportedIssue()

  }


  clearSearch() {

    this.flagSearch = true
    this.search = ''
    this.getReview(this.page, this.pageSize, this.search, this.filterBy)
  }

  
  clearSearchForReport() {

    this.flagSearchForReport = true
    this.searchForReport = ''
    this.getReportedIssue()
  }

  statusChnaged(e) {
    console.log(e)
  }

  reviewListAfterPageSizeChanged(e): any {
    console.log(e);
    this.pageSize=e.pageSize
    if (e.pageIndex == 0) {
      this.page = 1;
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



  reportListPageSizeChanged(e): any {
    console.log(e);
    this.pageSizeForReport=e.pageSize
    if (e.pageIndex == 0) {
      this.page = 1;
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

    this.getReportedIssue()
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
        // this.apiService.deleteHard(data).subscribe(res => {
        //   this.commonService.successToast("Review Deleted")
        //   this.getReview(this.page, this.pageSize, this.search, this.filterBy)
        // });
      }
      else {
        console.log("cancelled");
      }
    })
  }


  back() {
    window.history.back()
  }

}
