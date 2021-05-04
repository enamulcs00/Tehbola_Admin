import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { CommonService } from 'src/services/common.service';
import { PageEvent } from '@angular/material/paginator';
interface readOnly {
  viewValue: string,
  value: string
}
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
  filterList: readOnly[] = [
  { viewValue: 'New', value: 'New' },
  { viewValue: 'Accepted', value: 'Accepted' },
  { viewValue: 'Cancelled', value: 'Canceled' },
  { viewValue: 'Rejected', value: 'Rejected' },
  { viewValue: 'Packing', value: 'Packing' },
  { viewValue: 'Shipped', value: 'Shipped' },
  { viewValue: 'Delivered', value: 'Delivered' },
  { viewValue: 'Unwant', value: 'UnWant' },
  { viewValue: 'Picking', value: 'Picking' },
  { viewValue: 'Rescheduled', value: 'Rescheduled' },
  { viewValue: 'Picked For Shipping', value: 'pickedShipping' },
  { viewValue: 'Picked', value: 'Picked' },
  { viewValue: 'Picked and Delivered', value: 'PickedDelivered' }]
  // page = 1;
  length = 100;
  pageSize = 10;
  pageEvent: PageEvent;
  pageSizeOptions = [5, 10, 25, 100]
  flagData: boolean;
  filterForInventory:string=''
  searchForInventory:string=''
  vendorList: any;
  inventoryReqList: any;
  inventoryPage: any=1;
  inventortoryuPageSize: any=10;
  flagFilter: boolean=false;
  flagSearchInventory=true
  lengthOfInventory: any;
  constructor(private router: Router, private apiService: ApiService, private commonService: CommonService) { }

  ngOnInit() {
    this.getVendorSaleReport(this.page, this.pageSize, )
    this.getInventoryRequestList(this.inventoryPage,this.inventortoryuPageSize)
  }


  getVendorSaleReport(page, pageSize, ) {
    this.apiService.getVendorRequestList(page,pageSize,this.search,this.filterBy ).subscribe((res) => {
      if (res.success) {
          this.flagData = false
          this.vendorList = res.data;
          this.length = res.total
          console.log(this.vendorList);
      }else{
        this.commonService.errorToast(res.message)
      }
    });
  }


  
  getInventoryRequestList(page, pageSize, ) {
    this.apiService.getInventoryrequestList(page,pageSize,this.searchForInventory,this.filterForInventory ).subscribe((res) => {
      if (res.success) {
          this.flagData = false
          this.inventoryReqList = res.data;
          this.lengthOfInventory = res.total
      }else{
        this.commonService.errorToast(res.message)
      }
    });
  }



  flag = false

  filterSelectedforEqupiment(e) {
    if (this.filterBy) {
      this.flag = true
    }
    else {
      this.flag = false
    }
    console.log(e);
    this.getVendorSaleReport(this.page, this.pageSize )
  }

// gantner



  filterSelected(e) {
    if (this.filterBy) {
      this.flagFilter = true
    }
    else {
      this.flagFilter = false
    }
    console.log(e);
    this.getInventoryRequestList(this.page, this.pageSize )
  }


  flagSearch: boolean = true
  searchMethod() {
    this.flagSearch = false
    console.log(this.search);
    this.getVendorSaleReport(this.page, this.pageSize )
  }


  searchMethodForInventory() {
    this.flagSearchInventory = false
    console.log(this.search);
    this.getInventoryRequestList(this.page, this.pageSize )
  }

  clearSearch() {

    this.flagSearch = true
    this.search = ''
    this.getVendorSaleReport(this.page, this.pageSize, )
  }


  clearSearchForInventory() {
    this.flagSearchInventory = true
    this.searchForInventory = ''
    this.getInventoryRequestList(this.page, this.pageSize, )
  }


  changeUserStatus(id, status) {
    let temp = id
    let body2
    for (let i = 0; i <= this.vendorList.length; i++) {
      if (this.vendorList[i]._id == temp) {
        if (status == 1) {
          body2 = {
            "model": "EquipmentIssue",
            "id": temp,
            "status": 0
          }
        } else {
          body2 = {
            "model": "EquipmentIssue",
            "id": temp,
            "status": 1
          }
        }
        console.log(body2)
        // this.progress = false 82186110796
        this.apiService.changeUserStatus(body2).subscribe((res) => {
          console.log(res)
          if (res.success) {
            // this.progress = false
            this.commonService.successToast(res.message)
            this.getVendorSaleReport(this.page,this.pageSize);
          } else {
            // this.progress = false
            this.commonService.errorToast(res.message)

          }

        });
      }

    }
  }

  
  changeInventoryStatus(id, status) {
    let temp = id
    let body2
    for (let i = 0; i <= this.inventoryReqList.length; i++) {
      if (this.inventoryReqList[i]._id == temp) {
        if (status == 1) {
          body2 = {
            "model": "inventoryRequest",
            "id": temp,
            "status": 0
          }
        } else {
          body2 = {
            "model": "inventoryRequest",
            "id": temp,
            "status": 1
          }
        }
        console.log(body2)
        // this.progress = false 82186110796
        this.apiService.changeUserStatus(body2).subscribe((res) => {
          console.log(res)
          if (res.success) {
            // this.progress = false
            this.commonService.successToast(res.message)
            this.getVendorSaleReport(this.page,this.pageSize);
          } else {
            // this.progress = false
            this.commonService.errorToast(res.message)

          }

        });
      }

    }
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

    this.getVendorSaleReport(this.page, this.pageSize, )
  }

  
  inventoryPageSizeChange(e): any {
    
    if (e.pageIndex == 0) {
      this.page = 1;
      this.pageSize=e.pageSize
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
    this.getInventoryRequestList(this.page, this.pageSize )
  }


}
