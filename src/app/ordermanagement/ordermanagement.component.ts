import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { ApiService } from 'src/services/api.service';
import { CommonService } from 'src/services/common.service';

interface readOnly {
  viewValue: string,
  value: string
}
@Component({
  selector: 'app-ordermanagement',
  templateUrl: './ordermanagement.component.html',
  styleUrls: ['./ordermanagement.component.scss']
})
export class OrdermanagementComponent implements OnInit {

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
  flagSearch: boolean = true;
  flagData: any;
  flag: any
  flagUserList: boolean;
  srNo: number;
  progress: boolean;
  vendorList = [];
  user: any;
  constructor(private router: Router, private apiService: ApiService, private commonService: CommonService) {
    this.user = JSON.parse(this.apiService.getUser())
  }

  ngOnInit() {
    this.getSaleslist(this.page, this.pageSize, this.search, this.filterBy)
    this.getAssignmentdata()
  }



  getAssignmentdata() {
    this.progress = true;
    this.apiService.getAssignementData().subscribe(res => {



      this.progress = false
      if (res.success) {
        res.data.vendor.forEach(element => {
          this.vendorList.push(
            {
              id: element._id,
              name: element.fullName
            })
        });

        console.log(this.vendorList);


      } else {
        this.commonService.errorToast(res.message)
      }

    })
  }


  approveReject(e, id) {

    let body = {
      'orderId': id
    }
    console.log(e);
    if (e === 'true') {

      this.apiService.approveEvent(body).subscribe(res => {
        console.log(res);
        this.commonService.successToast(res.message)
        this.getSaleslist(this.page, this.pageSize, this.search, this.filterBy)
      })
    } else if (e === 'false') {
      this.apiService.declineEvent(body).subscribe(res => {
        console.log(res);
        this.commonService.successToast(res.message)
        this.getSaleslist(this.page, this.pageSize, this.search, this.filterBy)
      })
    }



  }


  AssignVendor(e, id) {

    let body = {
      'orderId': id,
      'vendorId': e
    }
    console.log(body);


    this.apiService.assignVendor(body).subscribe(res => {
      console.log(res);
      this.commonService.successToast(res.message)
      this.getSaleslist(this.page, this.pageSize, this.search, this.filterBy)
    })
  }

  getSaleslist(page, pageSize, search, filterBy) {

    let body = {
      page: page,
      search: search,
      count: pageSize
    }
    this.apiService.getSaleList(body).subscribe(res => {
      console.log(res)
      if (res.success) {
        this.flagData = false
        this.salesList = res.data;
        this.length = res.data.length
      } else {
        this.flagData = true
      }
    })

  }

  filterSelected(e) {
    console.log(e);
    if (this.filterBy) {
      this.flag = true
    }
    else {
      this.flag = false
    }
    console.log(e.target.value);
    this.filterBy = e.target.value
    this.getSaleslist(this.page, this.pageSize, this.search, this.filterBy)

  }

  searchMethod() {
    this.flagSearch = false

    this.getSaleslist(this.page, this.pageSize, this.search, this.filterBy)
  }
  clearSearch() {
    this.flagSearch = true
    this.search = ''
    this.getSaleslist(this.page, this.pageSize, this.search, this.filterBy)
  }
  statusChanged(value, id) {
    console.log("value", value, "ID", id);
    let body = {
      id: id,
      status: value
    }
    this.apiService.updateStatus(body).subscribe(res => {
      console.log(res);
      if (res.success) {
        this.commonService.successToast('Updated Succesfully')
        this.getSaleslist(this.page, this.pageSize, this.search, this.filterBy)
      } else {
        this.commonService.errorToast('Error: Please Try again  after some time')
        this.getSaleslist(this.page, this.pageSize, this.search, this.filterBy)
      }
    })

  }

  productListAfterPageSizeChanged(e): any {

    console.log(e)
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
    this.getSaleslist(this.page, e.pageSize, this.search, this.filterBy)
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
