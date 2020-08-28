import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-manage-reviews',
  templateUrl: './manage-reviews.component.html',
  styleUrls: ['./manage-reviews.component.scss']
})
export class ManageReviewsComponent implements OnInit {
  filterBy: any;
  search: string;
  page: number;
  flagUserList: boolean;
  srNo: number;
  length = 100
  pageSizeOptions = [5, 10, 25, 100]

  constructor() { }

  ngOnInit() {
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
    // this.apiService.getAllDiscount(this.page, this.pageSize, this.search, this.filterBy).subscribe((res) => {
    //   if (res) {
    //     if (res.data.length > 0) {
    //       this.flagData = false
    //       this.bannerList = res.data
    //       this.length = res.total
    //       console.log(this.bannerList)
    //     } else {
    //       this.flagData = true
    //     }
    //   };
    // });

  }

  flagSearch: boolean = true
  searchMethod() {

    this.flagSearch = false
    // console.log(this.search);
    // this.apiService.getAllDiscount(this.page, this.pageSize, this.search, this.filterBy).subscribe((res) => {
    //   if (res.success) {
    //     if (res.data.length > 0) {
    //       this.flagData = false
    //       this.bannerList = res.data;
    //       this.length = res.total
    //       console.log(this.bannerList);
    //     } else {
    //       this.flagData = true
    //     }
    //   }
    // })

  }


  clearSearch() {

    this.flagSearch = true
    this.search = ''
    // this.apiService.getAllDiscount(this.page, this.pageSize, this.search, this.filterBy).subscribe((res) => {
    //   if (res.success) {
    //     if (res.data.length > 0) {
    //       this.flagData = false
    //       this.bannerList = res.data;
    //       this.length = res.total
    //       console.log(this.bannerList);
    //     } else {
    //       this.flagData = true
    //     }
    //   }
    // });
  }

  statusChnaged(e) {
    console.log(e)
  }

  reviewListAfterPageSizeChanged(e): any {
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

    // this.apiService.getAllDiscount(this.page, e.pageSize, this.search, this.filterBy).subscribe((res) => {
    //   if (res.success) {
    //     if (res.data.length > 0) {
    //       this.flagData = false
    //       this.bannerList = res.data;
    //       this.length = res.total
    //       console.log(this.bannerList);
    //     } else {
    //       this.flagData = true
    //     }
    //   }
    // });
  }



}
