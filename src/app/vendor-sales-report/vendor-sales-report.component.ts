import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { CommonService } from 'src/services/common.service';

@Component({
  selector: 'app-vendor-sales-report',
  templateUrl: './vendor-sales-report.component.html',
  styleUrls: ['./vendor-sales-report.component.scss']
})
export class VendorSalesReportComponent implements OnInit {
  flagUserList: boolean = false;
  srNo: number;
  page: any = 1;
  search: string = '';
  filterBy: any = '';
  // page = 1;
  length = 100;
  pageSize = 10;

  pageSizeOptions = [5, 10, 25, 100]
  flagData: boolean;
  vendorList: any;
  constructor(private router: Router, private apiService: ApiService, private commonService: CommonService) { }

  ngOnInit() {
    this.getVendorSaleReport(this.page, this.pageSize, this.search, this.filterBy)
  }


  getVendorSaleReport(page, pageSize, search, filterBy) {
    this.apiService.getVendorList(page, pageSize, search, filterBy).subscribe((res) => {
      if (res.success) {
        if (res.data.length > 0) {
          this.flagData = false
          this.vendorList = res.data;
          this.length = res.total
          console.log(this.vendorList);
        } else {
          this.flagData = true
        }
      }
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
    this.getVendorSaleReport(this.page, this.pageSize, this.search, this.filterBy)
  }

  flagSearch: boolean = true
  searchMethod() {

    this.flagSearch = false
    this.getVendorSaleReport(this.page, this.pageSize, this.search, this.filterBy)

  }


  clearSearch() {

    this.flagSearch = true
    this.search = ''
    this.getVendorSaleReport(this.page, this.pageSize, this.search, this.filterBy)
  }

  statusChnaged(e) {
    console.log(e)
  }

  vendorSalesReportListAfterPageSizeChanged(e): any {
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

    this.getVendorSaleReport(this.page, this.pageSize, this.search, this.filterBy)
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

  goToreportGraph() {
    this.router.navigate(['reportGraph'])
  }
}
