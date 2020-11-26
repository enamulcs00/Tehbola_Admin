import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { CommonService } from 'src/services/common.service';
import { ApiService } from 'src/services/api.service';
@Component({
  selector: 'app-revenuereport',
  templateUrl: './revenuereport.component.html',
  styleUrls: ['./revenuereport.component.scss']
})
export class RevenuereportComponent implements OnInit {
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
  flagData: boolean;
  revenueReport: any;
  today: any;
  tommorow: any
  constructor(private router: Router, private apiService: ApiService, private commonService: CommonService) { }

  ngOnInit() {

    this.getRevenueReport(this.page, this.pageSize, this.search, this.filterBy)

  }

  getRevenueReport(page, pageSize, search, filterBy) {
    this.apiService.getRevenueReport(page, pageSize, search, filterBy).subscribe((res) => {
      if (res) {
        if (res.data.length > 0) {
          this.flagData = false
          this.revenueReport = res.data
          this.length = res.total
          console.log(this.revenueReport)
        } else {
          this.flagData = true
        }
      };
    });


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
    this.getRevenueReport(this.page, this.pageSize, this.search, this.filterBy)

  }

  flagSearch: boolean = true
  searchMethod() {
    this.page = 1
    this.flagSearch = false
    this.getRevenueReport(this.page, this.pageSize, this.search, this.filterBy)

  }


  clearSearch() {

    this.flagSearch = true
    this.search = ''
    this.getRevenueReport(this.page, this.pageSize, this.search, this.filterBy)
  }

  statusChnaged(e) {
    console.log(e)
  }

  revenueReportListAfterPageSizeChanged(e): any {
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

    this.getRevenueReport(this.page, this.pageSize, this.search, this.filterBy)
  }


  goToanalytics() {
    this.router.navigate(['analytics'])
  }
  goToreveuegraph() {
    this.router.navigate(['reveuegraph'])
  }


  back() {
    window.history.back()
  }
}
