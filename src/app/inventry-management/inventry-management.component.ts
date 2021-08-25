import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material';
import { ApiService } from 'src/services/api.service';
import { CommonService } from 'src/services/common.service';
import { UrlService } from 'src/services/url.service';
import { of } from 'rxjs';

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
  flagData: boolean = false;
  productList: any;
  isApproved: any = true;
  imageUrl: string;
  progress: boolean;
  brandList: any;
  flagEdit: boolean=false;
  debounce: NodeJS.Timer;
  //debounce: number;

  constructor(private router: Router, private apiService: ApiService, private commonService: CommonService, private urlService: UrlService) {

    this.user = JSON.parse(sessionStorage.getItem('Markat_User'))
   this.imageUrl=this.urlService.imageUrl;  
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


  goToViewIngredient() {

  }
  goToviewinventory() {
    this.router.navigate(['viewinventory'])
  }
  ngOnInit() {
this.getInventory();
  }


inventoryChanged(eve,id){
  console.log(eve.target.value, id );4
  var inventory=eve.target.value
  clearTimeout(this.debounce)
this.debounce=setTimeout(()=>{
  this.UpdateInventory(inventory,id)
},1000)

}



UpdateInventory(value,id){

  let temp
  if(id.measureTypeUnit==='kg' || id.measureTypeUnit==='l' ){
      temp=value*id.quantityPerUnit*1000
  }else if(id.measureTypeUnit==='g' || id.measureTypeUnit==='ml')
  {
    temp=value*id.quantityPerUnit
  }
  let body=new FormData();
  body.append('id',id._id)
  body.append('availableQuantityOfUnits',temp)

  this.apiService.editBrand(body).subscribe(res => {

    if (res.success == true) {
      this.progress = false
      this.commonService.successToast('Successfully Edited')
      this.getInventory()
     
    } else {
      this.progress = false
      this.commonService.errorToast(res.message)
     
    }
  })
}



 



  getInventory() {
    //Pagination is applied in the backend. just not using in the front end because of design same as category
    this.progress = true
    this.apiService.getRawItemList(this.page, this.pageSize, this.search).subscribe(res => {

      if (res.success) {
        this.progress = false

        this.brandList = res.data
        this.brandList.map((ele)=>{
          // console.log('before',ele);
          if(ele.measureTypeUnit==='kg' || ele.measureTypeUnit=='l'){
          let availbaleInventory=ele.availableQuantityOfUnits/ele.quantityPerUnit;
          availbaleInventory=availbaleInventory/1000
          ele.availbaleInventory=Math.round(availbaleInventory);
        }else if(ele.measureTypeUnit==='g' || ele.measureTypeUnit=='ml'){
          let availbaleInventory=ele.availableQuantityOfUnits/ele.quantityPerUnit;
          // availbaleInventory=availbaleInventory/1000
          ele.availbaleInventory=Math.round(availbaleInventory);
        }
        // console.log('after',ele);
        })
        this.length = res.total
      } else {
        this.progress = false
        this.commonService.errorToast(res.message)
      }
    })
  }


  gotoUpdateInventory(id) {
    this.router.navigate(['addinventory'], { queryParams: { id: id } })
  }



  checkClick(){
    this.flagEdit=true
    console.log('clicked')
  }

}
