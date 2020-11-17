import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material';
import { ApiService } from 'src/services/api.service';
import { CommonService } from 'src/services/common.service';
import { UrlService } from 'src/services/url.service';

@Component({
  selector: 'app-inventry-management',
  templateUrl: './inventry-management.component.html',
  styleUrls: ['./inventry-management.component.scss']
})
export class InventryManagementComponent implements OnInit {
  filterBy: any = '';
  user: any;
  sellerId: any;
  search: any = '';
  flagUserList: boolean = false;
  srNo: number = 1;
  length = 100;
  pageSize = 10;
  page = 1
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent;
  flagData: boolean;
  productList: any;
  isApproved: any = true;
  imageUrl: string;

  constructor(private router: Router, private apiService: ApiService, private commonService: CommonService, private urlService: UrlService) {
    debugger
    this.user = JSON.parse(sessionStorage.getItem('Markat_User'))
    this.imageUrl = this.urlService.imageUrl
    if (this.user.roles != 'admin') {
      this.sellerId = this.user._id
    } else {
      this.sellerId = null
    }
  }

  flag = false
  filterSelected(e) {



    if (this.filterBy) {
      this.flag = true
    }
    else {
      this.flag = false

    }
    this.getInventory()

  }

  flagSearch: boolean = true
  searchMethod() {
    this.flagSearch = false
    console.log(this.search);

    this.getInventory()
  }

  clearSearch() {
    this.flagSearch = true
    this.search = ''
    this.getInventory();

  }


  ListAfterPageSizeChanged(e): any {
    console.log(e);
    if (e.pageIndex == 0) {
      this.page = 1;
      // this.page = e.pageIndex;
      //  this.srNo = e.pageIndex * e.pageSize
      this.pageSize = e.pageSize
      this.flagUserList = false
    } else {
      if (e.previousPageIndex < e.pageIndex) {
        this.page = e.pageIndex + 1;
        this.pageSize = e.pageSize
        this.srNo = e.pageIndex * e.pageSize
        this.flagUserList = true
      } else {
        this.page = e.pageIndex;
        this.pageSize = e.pageSize
        this.srNo = e.pageIndex * e.pageSize
        this.flagUserList = true
      }

    }
    this.getInventory()

  }
  goToviewinventory() {
    this.router.navigate(['viewinventory'])
  }
  ngOnInit() {
    this.getInventory()
  }

  getInventory() {
    let body = {
      roles: this.user.roles,
      filter: this.filterBy,
      search: this.search,
      page: this.page,
      count: this.pageSize
    }
    this.apiService.getProducts(this.page, this.pageSize, this.filterBy, this.isApproved, this.search,
      this.sellerId)
      .subscribe(res => {
        if (res.success) {
          if (res.data.length > 0) {
            this.flagData = false;
            this.productList = res.data;
            console.log(res.data);
            this.length = res.total
            // this.productList = res.data
          } else {
            this.flagData = true;
          }
        } else {
          this.commonService.errorToast(res.message)
          this.flagData = true
        }

      })

  }


  gotoUpdateInventory(id) {
    this.router.navigate(['addinventory'], { queryParams: { id: id } })
  }


}
