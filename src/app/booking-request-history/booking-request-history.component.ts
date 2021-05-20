import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { PageEvent } from '@angular/material/paginator';
import { Toastr } from 'ng6-toastr-notifications';
import { CommonService } from 'src/services/common.service';

@Component({
  selector: 'app-booking-request-history',
  templateUrl: './booking-request-history.component.html',
  styleUrls: ['./booking-request-history.component.scss']
})
export class BookingRequestHistoryComponent implements OnInit {
  sub: any;
  id: any;
  name: string;
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent;
  orderHistoryList: any;
  flagData: boolean
  optionList = ['New', 'Accepted', 'Canceled', 'Rejected', 'Packing', 'Shipped', 'Delivered', 'UnWant', 'Picking', 'Rescheduled', 'pickedShipping', 'Picked', 'PickedDelivered'];
  filter: string = ""
  search: string = ""
  page: number = 1;
  flagUserList: boolean = false;
  srNo: number;
  status: any='';
  constructor(private router: Router, private route: ActivatedRoute, private apiService: ApiService, private toster: CommonService) { }

  ngOnInit() {
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.id = params['id'];

      });

    this.getbookingHistory()


  }
  flag: boolean = false


  getbookingHistory() {

    this.apiService.viewPurchaseHistory(this.page, this.pageSize, this.id, this.filter, this.status, this.search).subscribe((res) => {
      if (res.success) {
        if (res.data.length > 0) {
          this.flagData = false
          this.orderHistoryList = res.data
          this.length = res.total
        } else {
          this.flagData = true
        }
      } else {
        this.toster.errorToast(res.message)
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



  back() {
    this.router.navigate(['manageUser']);
  }
}
