import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { PageEvent } from '@angular/material/paginator';
import { DomSanitizer } from '@angular/platform-browser';
import { UrlService } from 'src/services/url.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  productList: any;
  sub: any
  id: any
  name: any
  length = 100;
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent;
  filterBy = '';
  search = '';
  imageToShow: any;
  blockCheck: any;
  imageUrl: any;
  categoryId = '';
  subCategory = '';
  flagData: boolean = false;
  page: number = 1;
  flagUserList: boolean = false;
  srNo: number;
  constructor(private router: Router,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private serverUrl: UrlService

  ) {
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.id = params['id'];
        this.name = params['name'];
        if (params['categoryId']) {
          this.categoryId = params['categoryId']
          this.subCategory = params['subCategory']
        }
      });
    //alert(this.id)
  }

  ngOnInit() {

    // alert(this.id)
    this.imageUrl = this.serverUrl.imageUrl;
    this.getAllProducts()

  }
  flag: boolean = false

  filterSelected(e) {
    if (this.filterBy) {
      this.flag = true
    }
    else {
      this.flag = false

    }
    console.log(e.target.value);
    this.filterBy = e.target.value;

    this.apiService.getVendorProduct(this.id, this.page, this.pageSize, this.search, this.filterBy, this.categoryId, this.subCategory).
      subscribe(res => {
        if (res.data.length > 0) {
          this.flagData = false;
          this.productList = res.data;
          this.length = res.total
          console.log(res.data);
          // this.productList = res.data
        } else {
          this.flagData = true;
        }
      })
  }

  getAllProducts() {
    this.apiService.getVendorProduct(this.id, this.page, this.pageSize, this.search, this.filterBy, this.categoryId, this.subCategory)
      .subscribe(res => {
        if (res.data.length > 0) {
          this.flagData = false;
          this.productList = res.data;
          console.log(res.data);
          this.length = res.total
          // this.productList = res.data
        } else {
          this.flagData = true;
        }

      })
  }

  flagSearch: boolean = true
  searchMethod() {
    this.flagSearch = false
    this.apiService.getVendorProduct(this.id, this.page, this.pageSize, this.search, this.filterBy, this.categoryId, this.subCategory).subscribe(res => {
      if (res.data.length > 0) {
        this.flagData = false;
        this.productList = res.data;
        this.length = res.total
        console.log(res.data);
        this.length = res.total
        // this.productList = res.data
      } else {
        this.flagData = true;
      }
    });

  }

  clearSearch() {
    this.flagSearch = true
    this.search = ''
    this.apiService.getVendorProduct(this.id, this.page, this.pageSize, this.search, this.filterBy, this.categoryId, this.subCategory).subscribe(res => {
      if (res.data.length > 0) {
        this.flagData = false;
        this.productList = res.data;
        console.log(res.data);
        this.length = res.total
        // this.productList = res.data
      } else {
        this.flagData = true;
      }
    });
  }

  onChangeBlockStatus(id, status) {
    console.log(id, status)
    let data: any
    let temp = id
    for (let i = 0; i <= this.productList.length; i++) {
      if (this.productList[i]._id == temp) {
        if (status === 0) {

          data = {
            "model": "Product",
            "id": temp,
            "status": 1
          }
        } else {
          data = {
            "model": "Product",
            "id": temp,
            "status": 0
          }
        }
        console.log(data)
        this.apiService.changeUserStatus(data).subscribe((res) => {
          console.log(res)
          this.getAllProducts();
        });
      }
    }
  }



  vendorProductListAfterPageSizeChanged(e): any {
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



    this.apiService.getVendorProduct(this.id, this.page, e.pageSize, this.search, this.filterBy, this.categoryId, this.subCategory).subscribe(res => {
      if (res.data.length > 0) {
        this.flagData = false;
        this.productList = res.data;
        console.log(res.data);
        this.length = res.total
        // this.productList = res.data
      } else {
        this.flagData = true;
      }
    });

  }

  goToaddproduct() {
    this.router.navigate(['/addproduct'])
  }
  goToeditProduct() {
    this.router.navigate(['/editProduct'])
  }
  goToviewProduct(id: any) {
    this.router.navigate(['/viewProduct'], { queryParams: { "id": id, "name": this.name } })
  }

  goToVendorList() {
    this.router.navigate(['venderManagement']);
  }

}

