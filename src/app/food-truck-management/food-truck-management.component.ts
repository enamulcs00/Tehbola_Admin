import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-food-truck-management',
  templateUrl: './food-truck-management.component.html',
  styleUrls: ['./food-truck-management.component.scss']
})
export class FoodTruckManagementComponent implements OnInit {
  progress: boolean
  length = 100;
  pageSize = 10;
  noDataFound = false
  page = 1
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent;
  filterBy = '';
  search = '';
  vendorList: any;
  isApproved: any
  status: any
  selectOption: string
  flagUserList: boolean = false;
  srNo: number = 1;
  roles: any = 'merchant';
  categoryList: any[];
  selectedCategory = [];
  body2: any;
  flagSearch: any
  flagapproval: boolean;
  constructor() { }

  ngOnInit() {
  }
  goToaddfoodTruck() {

  }
  flag: boolean
  filterSelected(e) {

  }

  searchMethod() {


  }

  clearSearch() {

  }

  vendorListAfterPageSizeChanged(e) {
    return e
  }


  goToViewEquipmentStatus() {

  }

}
