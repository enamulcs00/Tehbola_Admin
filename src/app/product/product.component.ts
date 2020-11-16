import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { PageEvent } from '@angular/material/paginator';
import { DomSanitizer } from '@angular/platform-browser';
import { UrlService } from 'src/services/url.service';
import Swal from 'sweetalert2';
import { CommonService } from 'src/services/common.service';

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
  user: any;
  sellerId: any;
  isApproved: any
    ;
  flagapproval: boolean;
  idToDelete: any;
  constructor(private router: Router,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private serverUrl: UrlService,
    private commonService: CommonService
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
    this.user = JSON.parse(sessionStorage.getItem('Markat_User'))
    console.log(this.user);

    if (this.user.roles == 'admin') {
      this.sellerId = null
    } else {
      this.sellerId = this.user._id

    }
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
    console.log(e.value);
    this.filterBy = e.value;

    this.getAllProducts()
  }

  approvedSelected(e) {

    if (this.isApproved) {
      this.flagapproval = true
    }
    else {
      this.flagapproval = false

    }
    console.log(e.value);
    this.isApproved = e.value;

    this.getAllProducts()
  }


  acceptProduct(id) {
    let body = {
      id: id,
      isApproved: true
    }
    this.apiService.editProduct(body).subscribe(res => {
      console.log(res);
      if (res.success) {
        this.commonService.successToast('Product Approved');
        this.getAllProducts();
      } else {
        this.commonService.errorToast("Opps, SOmething went wrong, Please try again later")
      }

    })





  }

  getAllProducts() {

    if (this.isApproved) { //Method if isApproved is selected for some value
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
    } else {  //method for get data with out isApproved in initial stage
      this.apiService.getProductsWithoutApproved(this.page, this.pageSize, this.filterBy, this.search,
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
  }


  flagSearch: boolean = true
  searchMethod() {
    this.flagSearch = false
    this.getAllProducts();

  }

  clearSearch() {
    this.flagSearch = true
    this.search = ''
    this.getAllProducts()
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
      this.pageSize = e.pageSize
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



    this.getAllProducts()

  }

  goToaddProduct() {
    this.router.navigate(['/addproduct'])
  }
  goToeditProduct(id) {
    this.router.navigate(['/editProduct'], { queryParams: { "id": id } })
  }
  goToviewProduct(id: any) {
    this.router.navigate(['/viewProduct'], { queryParams: { "id": id } })
  }

  deleteProduct(id) {

    this.idToDelete = id

    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this Product!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085D6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",

      allowOutsideClick: true
    }).then(result => {
      if (result.value) {
        console.log(this.idToDelete)
        //  let id: any

        const data = {
          "id": this.idToDelete,
          "model": "Product"
        }
        this.apiService.delete(data).subscribe(res => {
          console.log(res);
          if (res.success) {
            this.commonService.successToast("Succesfully Deleted")
          } else {
            this.commonService.errorToast(res.message)
          }
        })
      }
    });




  }

  goToVendorList() {
    this.router.navigate(['venderManagement']);
  }

  back() {
    window.history.back()
  }

}

