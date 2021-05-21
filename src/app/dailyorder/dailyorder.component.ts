import { PageEvent } from '@angular/material/paginator';
import { ApiService } from './../../services/api.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/services/common.service';

interface readOnly {
  viewValue: string,
  value: string
}

@Component({
  selector: 'app-dailyorder',
  templateUrl: './dailyorder.component.html',
  styleUrls: ['./dailyorder.component.scss']
})
export class DailyorderComponent implements OnInit {

  page = 1;
  length = 100;
  pageSize = 10;
  filterList: readOnly[] = [{ viewValue: 'New', value: 'New' },
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
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent;
  filterBy: string = '';
  search: string = '';
  salesList = []
  status: number
 // flagSearch: boolean = true;
  flagData: any;
  flag: any
  flagUserList: boolean=false;
  srNo: number;
  progress: boolean;
  vendorList = [];
  user: any;
  id: any='';
  filter: any='';
  startDate: any='';
  endDate: any='';
  orderHistoryList: any='';
  constructor(private router: Router, private apiService: ApiService, private commonService: CommonService) {
    this.user = JSON.parse(this.apiService.getUser())
  }

  ngOnInit() {
   this.getbookingHistory()
  }



   
  getbookingHistory() {

    this.apiService.viewPurchaseHistory(this.page, this.pageSize, this.id, this.filter, this.status, this.search,this.startDate,this.endDate).subscribe((res) => {
   
      if (res.success) {
        if (res.data.length > 0) {
          this.flagData = false
          this.orderHistoryList = res.data
          this.length = res.total
        } else {
          this.flagData = true
        }
      } else {
        this.commonService.errorToast(res.message)
      }
    });
  }



 

  orderHistoryListAfterPageSizeChanged(e): any {

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
    this.getbookingHistory()

  }

  flagSearch: boolean = true
  searchSubmit() {
    this.flagSearch = false
    this.getbookingHistory()

  }


  clearSearch() {
    this.search = ''
    this.flagSearch = true
    this.getbookingHistory()


  }


  filterSelected(e) {
    if (this.status) {
      this.flag = true
    }
    else {
      this.flag = false
    }

   this.getbookingHistory()     

  }



  goToaddordermanagement() {
    this.router.navigate(['/addordermanagement'])
  };
  goToeditOrder() {
    this.router.navigate(['/editOrder'])
  };
  goToviewOrder() {
    this.router.navigate(['/viewOrder'])
  };
  // { queryParams: { "id": id } }

  back() {
    window.history.back()
  }

}
