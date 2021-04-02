import { Component, OnInit, AfterViewInit, AfterContentChecked, ChangeDetectionStrategy, SimpleChanges, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/services/common.service';
import * as moment from 'moment';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import { GreaterDateMatch } from 'src/services/greatDateValidator';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
interface Ready {
  value: string;
  viewValue: string;
}

interface goefence {
  id: string;
  name: string;
}

interface vendor {
  id: string;
  name: string;
}
@Component({
  selector: 'app-addoffers',
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: './addoffers.component.html',
  styleUrls: ['./addoffers.component.scss']
})
export class AddoffersComponent implements OnInit, AfterViewChecked {



  showVendor: boolean
  showProduct: boolean
  categoryList = [];
  subCategoryList = [];
  vendorList: Array<vendor> = [];
  defaultVendorList: vendor[];

  productList = [];
  selectedItem = [];
  selectedCategoryItem = []
  addDiscountForm: FormGroup;
  parentId = ''
  imageFile: any;
  previewImage: any;
  submitted: boolean;
  selectedProduct: any;
  categoryDropDownSettings: IDropdownSettings = {};
  subcategoryDropDownSettings: IDropdownSettings = {};
  vendorDropDownSettings: IDropdownSettings = {};
  productDropDownSettings: IDropdownSettings = {};
  singleCategorySelection: boolean;
  singleSubCategorySelection: boolean;
  singleVendorSelection: boolean;
  singleProductSelection: boolean;
  selectedSubcategoryItem: any;
  selectedVendorItem: any;
  selectedProductItem: any;
  userDetails: any;
  sellerId: string;
  imageNotAccepted: boolean = true
  tempArray: any[];
  images: any = [];
  progress: boolean;
  geofenceList: Array<goefence> = [];
  defaultGeofenceData: goefence[];
  defaultProductList: any[];
  limitTime: string;
  ;

  constructor(private router: Router, private apiService: ApiService, private fb: FormBuilder, private commonService: CommonService) {

    this.userDetails = JSON.parse(sessionStorage.getItem('Markat_User'))

  }




  setradio(e: string) {


    switch (e) {
      case "advertisment":
        this.showVendor = false
        this.showProduct = false
        this.addDiscountForm.get('category').disable()
        this.addDiscountForm.get('product').disable()
        this.addDiscountForm.get('vendor').disable()
        this.addDiscountForm.get('geofence').disable()
        break;

      case "vendor":
        this.singleVendorSelection = false
        this.showVendor = true;
        this.showProduct = false;
        this.addDiscountForm.get('category').disable()
        this.addDiscountForm.get('product').disable()
        this.addDiscountForm.get('vendor').enable()
        this.addDiscountForm.get('geofence').enable()
        break;
      case "product":

        this.showProduct = true
        this.showVendor = false;
        this.addDiscountForm.get('category').enable()
        this.addDiscountForm.get('product').enable()
        this.addDiscountForm.get('vendor').disable()
        this.addDiscountForm.get('geofence').disable()


        break;
    }
  }





  today
  endTommorow
  ngOnInit() {
    this.getAssignmentdata();
    this.getAllCategoryForAdmin()

    this.today = moment(new Date()).format('YYYY-MM-DD');
    let currentDate = new Date().getDate();
    let currentMonth = new Date().getMonth();
    let year = new Date().getFullYear();
    //console.log(new Date(year, currentMonth, currentDate + 1))


    this.addDiscountForm = this.fb.group({
      // disount: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      type: ['Home', Validators.required],
      dicountOn: ['', Validators.required],
      name: ['', [Validators.required, Validators.maxLength(25)]],
      name_ar: ['', Validators.required],
      vendor: ['', Validators.required],
      geofence: ['', Validators.required],
      category: ['', Validators.required],
      product: ['', Validators.required],
      //   gender: ['', Validators.required],
      bannerImage: ['',]
    })
  }

  ngAfterViewChecked(): void {

    let done = moment(this.addDiscountForm.controls['startDate'].value)
    let today = done.date();
    let thisMonth = done.month();
    let thisYear = done.year()
    let temp = new Date(thisYear, thisMonth, today + 1)
    this.endTommorow = moment(temp).format('YYYY-MM-DD');





  }

  startTimeSelected() {

    let startTime = moment(this.addDiscountForm.get('startTime').value, 'HH:mm');
    let hours = startTime.hour();
    let minute = startTime.minute();
    let nextMinute = minute + 1
    this.limitTime = hours + ':' + nextMinute;

  }


  vendorSearch(value) {


    if (value.length > 0) {

      this.vendorList = this.vendorList.filter((unit) => unit.name.indexOf(value) > -1);

    } else {
      this.vendorList = this.defaultVendorList
    }
  }



  geofenceSearch(value) {
    this.defaultGeofenceData = this.geofenceList

    if (value.length > 0) {
      this.geofenceList = this.geofenceList.filter((unit) => unit.name.indexOf(value) > -1);
    } else {
      this.geofenceList = this.defaultGeofenceData
    }
  }


  productSearch(value) {

    this.defaultProductList = this.productList

    if (value.length > 0) {
      this.productList = this.productList.filter((unit) => unit.name.indexOf(value) > -1);
    } else {
      this.productList = this.defaultProductList
    }
  }


  async bannerImageEvent(event) {
    let tempfile: any
    let imageOk: boolean = true
    var img = new Image;
    let sefl = this
    if (event.target.files && event.target.files[0]) {
      tempfile = event.target.files[0];
      let name = event.target.files[0].name;
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        img.src = event.target.result;

        let temp = {
          name: name,
          image: event.target.result
        }
        img.onload = () => {
          var height = img.height;
          var width = img.width;
          if (this.addDiscountForm.get('type').value == 'Home') {
            if (width / height != 5 / 2) {
              this.commonService.errorToast("Image Should be in the size of 5:2");
              imageOk = false
              // this.pushImage();
              return imageOk
            } else {
              this.commonService.successToast("Image Size is Ok");
              imageOk = true
              this.previewImage = temp.image;
              this.images = tempfile
              return imageOk
            }
          }
          //else {
          //   if (height != width) {
          //     this.commonService.errorToast("Image should be a Square size");
          //     imageOk = false
          //     // this.pushImage();
          //     return imageOk
          //   } else {
          //     this.commonService.successToast("Image Size is Ok");
          //     imageOk = true
          //     this.previewImage = temp.image;
          //     this.images = tempfile;

          //     return imageOk
          //   }
          // }

        };
        // this.previewImage = event.target.result;
        // this.addDiscountForm.controls['bannerImage'].patchValue(this.imageFile);
      };

    }




  }
  goToofferdeals() {
    this.router.navigate(['offerdeals'])
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




        res.data.geoFence.forEach(element => {
          this.geofenceList.push(
            {
              id: element._id,
              name: element.name,

            })
        });

        this.defaultVendorList = this.vendorList
        this.defaultGeofenceData = this.geofenceList

      } else {
        this.commonService.errorToast(res.message)
      }

    })
  }






  type: Ready[] = [
    { value: 'Home Banner', viewValue: 'Home Banner' },
    { value: 'Home', viewValue: 'Banner' },
    { value: 'Offer', viewValue: 'Offer' },
    // { value: 'Deal', viewValue: 'Deal' },
    // { value: 'Deal Slider', viewValue: 'Deal Slider' }
  ];

  getAllCategoryForAdmin() {
    let temp = []
    this.categoryList = []

    this.apiService.getAllCategories().subscribe(res => {

      if (res.success) {


        if (res.data) {
          for (let i = 0; i < res.data.length; i++) {
            let body = {
              'id': res.data[i].id,
              'name': res.data[i].name
            }
            this.categoryList.push(body)


          }

        }
      }
    });



  }

  getAllCategory() {

    let temp = []
    this.categoryList = []

    this.apiService.getAllCategoriesForPanel().subscribe(res => {

      if (res.success) {


        if (res.data) {
          for (let i = 0; i < res.data.length; i++) {
            let body = {
              'id': res.data[i]._id,
              'name': res.data[i].name
            }
            temp.push(body);

          }

          this.setradio('product')

        }
      }
    });

    this.categoryList = temp;

  }


  selectedCategory = ''
  categorySelected(id) {


    this.selectedCategory = id;
    this.getAllProduct();
  }



  getAllProduct() {

    this.productList = [];
    let temp = []
    if (this.selectedCategory) {

      this.apiService.getProductsforBanner(this.selectedCategory).subscribe(res => {

        if (res.success) {


          if (res.data) {
            this.productList = res.data
            this.defaultProductList = this.productList;
          }
        }

      });
    } else {
      this.commonService.errorToast("PLease select a vendor First")
    }

  }

  productSelected(id) {

    this.selectedProduct = id;

  }

  typeSelected(e) {

    this.addDiscountForm.get('bannerImage').enable()

  }

  checkBanner() {

    this.submitted = true

    let checkOffer = this.addDiscountForm.controls['dicountOn'].value;
    // if (checkOffer == "category") {

    //   if (this.submitted && this.addDiscountForm.valid) {
    //     if (this.selectedItem.length > 0) {
    //       this.typeCategory(checkOffer, this.selectedItem);
    //     } else {
    //       if (this.selectedCategoryItem.length > 0) {
    //         let selectedCategory = []
    //         for (let i = 0; i < this.selectedCategoryItem.length; i++) {
    //           selectedCategory.push(this.selectedCategoryItem[i].id)
    //         }
    //         this.typeCategory(checkOffer, selectedCategory);
    //       } else {
    //         this.commonService.errorToast("Please Select a Category ")
    //       }

    //     }
    //   }
    // }

    if (checkOffer == 'advertisment') {
      if (this.submitted && this.addDiscountForm.valid) {
        this.typeAdvertisement();
      }
    }
    if (checkOffer == 'vendor') {
      this.typeVendor();
    }
    if (checkOffer == 'product') {
      this.typeProduct();
    }


  }


  // typeCategory(checkOffer, selectedCategoryItem) {


  //   let startDate = moment(this.addDiscountForm.controls['startDate'].value).toLocaleString();
  //   let endDate = moment(this.addDiscountForm.controls['endDate'].value).toLocaleString()
  //   let offer = {
  //     'list': selectedCategoryItem, 'type': checkOffer
  //   }

  //   const body = new FormData();
  //   body.append('name', this.addDiscountForm.controls['name'].value);
  //   body.append('name_ar', this.addDiscountForm.controls['name_ar'].value);

  //   body.append('image', this.images, this.images.name);
  //   body.append('gender', JSON.stringify(this.addDiscountForm.controls['gender'].value));

  //   body.append('type', this.addDiscountForm.controls['type'].value);
  //   body.append('discount', this.addDiscountForm.controls['disount'].value);
  //   body.append('offer', JSON.stringify(offer));
  //   body.append('startDate', JSON.stringify(startDate));
  //   body.append('endDate', JSON.stringify(endDate))


  //   this.addbanner(body);
  // }


  typeAdvertisement() {

    let startDate = moment(this.addDiscountForm.controls['startDate'].value).toLocaleString();
    let endDate = moment(this.addDiscountForm.controls['endDate'].value).toLocaleString();
    let startTime = moment(this.addDiscountForm.get('startTime').value, 'HH:mm').format('HHmm')
    let endTime = moment(this.addDiscountForm.get('endTime').value, 'HH:mm').format('HHmm')


    let offer = {
      'list': [""], 'type': 'ad'
    }
    const body = new FormData();
    body.append('name', this.addDiscountForm.controls['name'].value);
    body.append('name_ar', this.addDiscountForm.controls['name_ar'].value);
    body.append('image', this.images, this.images.name);
    body.append('offer', JSON.stringify(offer));
    body.append('type', this.addDiscountForm.controls['type'].value);
    body.append('startDate', JSON.stringify(startDate));
    body.append('endDate', JSON.stringify(endDate));
    body.append('startTime', startTime);
    body.append('endTime', endTime);
    //Add banner method is getting called
    this.addbanner(body);
  }
  typeVendor() { //

    let startDate = moment(this.addDiscountForm.controls['startDate'].value).toLocaleString();
    let endDate = moment(this.addDiscountForm.controls['endDate'].value).toLocaleString();
    let startTime = moment(this.addDiscountForm.get('startTime').value, 'HH:mm').format('HHmm')
    let endTime = moment(this.addDiscountForm.get('endTime').value, 'HH:mm').format('HHmm')
    let offer = {
      'list': [this.addDiscountForm.get('vendor').value], 'type': 'seller'
    }

    const body = new FormData();
    body.append('name', this.addDiscountForm.controls['name'].value);
    body.append('name_ar', this.addDiscountForm.controls['name_ar'].value);

    body.append('image', this.images, this.images.name);

    body.append('type', this.addDiscountForm.controls['type'].value);
    body.append('offer', JSON.stringify(offer));
    body.append('geoFence', JSON.stringify(this.addDiscountForm.controls['geofence'].value));
    body.append('vendor', this.addDiscountForm.get('vendor').value);
    body.append('startDate', JSON.stringify(startDate));
    body.append('endDate', JSON.stringify(endDate));
    body.append('startTime', startTime);
    body.append('endTime', endTime);

    this.addbanner(body);
  }
  typeProduct() {


    let startDate = moment(this.addDiscountForm.controls['startDate'].value).toLocaleString();
    let endDate = moment(this.addDiscountForm.controls['endDate'].value).toLocaleString();
    let startTime = moment(this.addDiscountForm.get('startTime').value, 'HH:mm').format('HHmm')
    let endTime = moment(this.addDiscountForm.get('endTime').value, 'HH:mm').format('HHmm')
    let offer = {
      'list': this.addDiscountForm.get('product').value, 'type': 'product'
    }
    const body = new FormData();
    body.append('category', this.addDiscountForm.get('category').value);
    body.append('name', this.addDiscountForm.controls['name'].value);
    body.append('name_ar', this.addDiscountForm.controls['name_ar'].value);
    body.append('image', this.images, this.images.name);
    body.append('type', this.addDiscountForm.controls['type'].value);
    body.append('offer', JSON.stringify(offer));
    //body.append('product', this.addDiscountForm.controls['product'].value);
    body.append('startDate', JSON.stringify(startDate));
    body.append('endDate', JSON.stringify(endDate));
    body.append('startTime', startTime);
    body.append('endTime', endTime);

    this.addbanner(body);
  }





  addbanner(body) {

    this.tempArray = []
    this.tempArray.push(body);
    //  console.log(body)

    this.progress = true
    this.apiService.addBanner(body).subscribe(res => {

      if (res.success) {
        this.progress = false
        this.router.navigateByUrl('offerdeals');

      } else {
        this.commonService.errorToast(res.message)
        this.progress = false
      }
    })


  }

}

