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
  pageSize: any;

  constructor() { }

  ngOnInit() {
    this.getReview(this.page, this.pageSize, this.search, this.filterBy)
  }

  getReview(page, pageSize, search, filterBy) {

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
    this.getReview(this.page, this.pageSize, this.search, this.filterBy)
  }

  flagSearch: boolean = true
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

    this.getReview(this.page, this.pageSize, this.search, this.filterBy)
  }



}
