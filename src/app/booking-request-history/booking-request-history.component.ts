import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { PageEvent } from '@angular/material/paginator';

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
  constructor(private router: Router, private route: ActivatedRoute, private apiService: ApiService) { }

  ngOnInit() {
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.id = params['id'];
        this.name = params['name']
      });

    this.getbookingHistory()


  }
  flag: boolean = false


  getbookingHistory() {
    this.apiService.viewPurchaseHistory(1, this.pageSize, this.id, this.filter, this.search).subscribe((res) => {
      if (res.status) {
        if (res.data.length > 0) {

          this.flagData = false
          this.orderHistoryList = res.data
          this.length = this.orderHistoryList.length
          console.log(res.data)
        } else {
          this.flagData = true
        }

      }
    });

  }


  filterSelected(e) {
    if (this.filter) {
      this.flag = true
    }
    else {
      this.flag = false

    }
    console.log(e.target.value)
    this.filter = e.target.value;

    this.apiService.viewPurchaseHistory(1, this.pageSize, this.id, this.filter, this.search).subscribe((res) => {
      if (res.status) {

        if (res.data.length > 0) {

          this.flagData = false
          this.orderHistoryList = res.data
          this.length = this.orderHistoryList.length
          console.log(res.data)
        } else {
          this.flagData = true
        }
      }
    });
  }



  orderHistoryListAfterPageSizeChanged(e): any {
    console.log(e);
    this.apiService.viewPurchaseHistory(1, e.pageSize, this.id, this.filter, this.search).subscribe((res) => {
      if (res.status) {
        if (res.data.length > 0) {

          this.flagData = false
          this.orderHistoryList = res.data
          this.length = this.orderHistoryList.length
          console.log(res.data)
        } else {
          this.flagData = true
        }
      }
    });
  }

  flagSearch: boolean = true
  searchSubmit() {
    this.flagSearch = false
    this.apiService.viewPurchaseHistory(1, this.pageSize, this.id, this.filter, this.search).subscribe((res) => {
      if (res.status) {

        if (res.data.length > 0) {

          this.flagData = false
          this.orderHistoryList = res.data
          this.length = this.orderHistoryList.length
          console.log(res.data)
        } else {
          this.flagData = true
        }
      }
    });
  }


  clearSearch() {
    this.search = ''
    this.flagSearch = true
    this.apiService.viewPurchaseHistory(1, this.pageSize, this.id, this.filter, this.search).subscribe((res) => {
      if (res.status) {
        if (res.data.length > 0) {

          this.flagData = false
          this.orderHistoryList = res.data
          this.length = this.orderHistoryList.length
          console.log(res.data)
        } else {
          this.flagData = true
        }
      }
    });

  }



  goTomanageUser() {
    this.router.navigate(['manageUser']);
  }
}
