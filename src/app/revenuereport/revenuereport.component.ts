import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { CommonService } from 'src/services/common.service';
import { ApiService } from 'src/services/api.service';
import * as moment from 'moment';
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
  startDate: any = '';
  endDate: any = '';
  maxDate: Date;
  customerPage: any = 1;
  CustomerPageSize: any = 10;
  customerStartDate: any = '';
  customerEndDate: any = '';
  customerSearch: any = '';
  customerRevenueReport: any;
  CustomerOrderlength: any;
  flagDataForCustomer: boolean;
  totalOfflinePayment: any;
  totalOnlinePayment: any;
  clearDateFlag: boolean;
  todayVal: string;
  constructor(private router: Router, private apiService: ApiService, private commonService: CommonService) { }

  ngOnInit() {

    this.getRevenueReport()
    this.getCustomerReport()
this.maxDate =new Date()


  }

  getRevenueReport() {

    this.apiService.getRevenueReport(this.page, this.pageSize, this.startDate, this.endDate, this.search).subscribe((res) => {
      if (res) {

        if (res.data.length > 0) {
          this.flagData = false
          this.revenueReport = res.data
          this.length = res.total
        } else {
          this.flagData = true
          this.length = res.total
        }
      };
    });
  }




  getCustomerReport() {
    this.apiService.getCustomerReport(this.customerPage, this.CustomerPageSize, this.customerStartDate, this.customerEndDate, this.customerSearch).subscribe((res) => {
      if (res) {
        if (res.data.length > 0) {
          this.flagDataForCustomer = false
          this.totalOnlinePayment = res.totalPaymentOnline;
          this.totalOfflinePayment = res.totalPaymentOffline;
          this.customerRevenueReport = res.data
          this.CustomerOrderlength = res.total
        } else {
          this.flagDataForCustomer = true
          this.CustomerOrderlength = res.total
        }
      };
    });
  }



  startDateChanged(e) {
    console.log(e);
    this.startDate = e.value4
    if (this.endDate == '') {
      this.startDate = moment(this.startDate).utc()

    } else {
      this.startDate = moment(this.startDate).utc()
      this.getRevenueReport()
    }

  }

  startDateChangedForCustomer(e) {
    console.log(e);
    this.customerStartDate = e.value
    if (this.customerEndDate == '') {
      this.customerStartDate = moment(this.customerStartDate).utc()

    } else {
      this.customerStartDate = moment(this.customerStartDate).utc()
      this.clearDateSelectionFlag = true
      this.getCustomerReport()
    }

  }
  clearDateSelectionFlag = false
  clearDateSelectionCustomer(eve) {

    if (eve == 'customer') {
      this.customerStartDate = '',
        this.customerEndDate = '',
        this.startDateCustomer='',
        this.endDateCustomer=''
      this.getCustomerReport()
    }

    if(eve=='vendor'){
      this.startDate='';
      this.endDate='';
      this.startDateVendor='';
      this.endDateVendor='';
      this.getRevenueReport()
    }
  }

  startDateCustomer:string
  endDateCustomer:string;
  startDateVendor:string;
  endDateVendor:string;

  endDateChanged(e) {
    console.log(e);

    if (this.startDate == '') {
      this.commonService.errorToast('Please select start date')
    } else {
      this.endDate = e.value;
      this.endDate = moment(this.endDate).utc()
      this.getRevenueReport()
    }
  }

  endDateChangedForCustomer(e) {
    console.log(e);

    if (this.customerStartDate == '') {
      this.commonService.errorToast('Please select start date')
    } else {
      this.customerEndDate = e.value;
      this.customerEndDate = moment(this.customerEndDate).utc()
      this.clearDateSelectionFlag = true
      this.getCustomerReport()
    }
  }

  flag = false



  flagSearch: boolean = true
  searchMethod() {
    this.page = 1
    this.flagSearch = false
    this.getRevenueReport()
  }


  clearSearch() {
    this.flagSearch = true
    this.search = ''
    this.getRevenueReport()
  }



  flagSearchForCustomer: boolean = true
  searchMethodForCustomer() {
    this.page = 1
    this.flagSearchForCustomer = false
    this.getCustomerReport()
  }


  clearSearchForCustomer() {
    this.flagSearchForCustomer = true
    this.customerSearch = ''
    this.getRevenueReport()
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

    this.getRevenueReport()
  }


  cusomterRevenueReportListAfterPageSizeChanged(e): any {
    //console.log(e);

    if (e.pageIndex == 0) {
      this.customerPage = 1;
      // this.page = e.pageIndex;
      //  this.srNo = e.pageIndex * e.pageSize
      this.flagUserList = false
    } else {
      if (e.previousPageIndex < e.pageIndex) {
        this.customerPage = e.pageIndex + 1;
        this.srNo = e.pageIndex * e.pageSize
        this.flagUserList = true
      } else {
        this.customerPage = e.pageIndex;
        this.srNo = e.pageIndex * e.pageSize
        this.flagUserList = true
      }

    }

    this.getCustomerReport()
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
