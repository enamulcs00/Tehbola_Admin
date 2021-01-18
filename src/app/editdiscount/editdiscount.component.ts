import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import * as moment from 'moment';

import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import { ApiService } from 'src/services/api.service';
import { CommonService } from 'src/services/common.service';
import { UrlService } from 'src/services/url.service';


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

interface Ready {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-editdiscount',
  templateUrl: './editdiscount.component.html',
  styleUrls: ['./editdiscount.component.scss']
})
export class EditdiscountComponent implements OnInit {



  showVendor: boolean
  showProduct: boolean
  categoryList = [];
  subCategoryList = [];
  vendorList: Array<vendor> = [];
  defaultVendorList: vendor[];

  productList = [];
  selectedItem = [];
  selectedCategoryItem = []
  editDiscountForm: FormGroup;
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
  discountDetails: any;
  sub: any;
  id: any;
  urlImage: boolean;
  imageUrl: any;
  ;

  constructor(private router: Router, private apiService: ApiService, private urlService: UrlService, private route: ActivatedRoute, private fb: FormBuilder, private commonService: CommonService) {

    this.userDetails = JSON.parse(sessionStorage.getItem('Markat_User'))

    this.sub = this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.id = params['id'];

      });

    this.imageUrl = this.urlService.imageUrl
  }




  setradio(e: string) {


    switch (e) {
      case "advertisment":
        this.showVendor = false
        this.showProduct = false
        this.editDiscountForm.get('category').disable()
        this.editDiscountForm.get('product').disable()
        this.editDiscountForm.get('vendor').disable()
        this.editDiscountForm.get('geofence').disable()
        break;

      case "vendor":
        this.singleVendorSelection = false
        this.showVendor = true;
        this.showProduct = false;
        this.editDiscountForm.get('category').disable()
        this.editDiscountForm.get('product').disable()
        this.editDiscountForm.get('vendor').enable()
        this.editDiscountForm.get('geofence').enable()
        break;
      case "product":

        this.showProduct = true
        this.showVendor = false;
        this.editDiscountForm.get('category').enable()
        this.editDiscountForm.get('product').enable()
        this.editDiscountForm.get('vendor').disable()
        this.editDiscountForm.get('geofence').disable()

        console.log("product");
        break;
    }
  }





  today
  endTommorow
  ngOnInit() {
    this.getAssignmentdata();
    this.getAllCategoryForAdmin()
    this.getDiscount(this.id)
    this.today = moment(new Date()).format('YYYY-MM-DD');
    let currentDate = new Date().getDate();
    let currentMonth = new Date().getMonth();
    let year = new Date().getFullYear();
    //console.log(new Date(year, currentMonth, currentDate + 1))


    this.editDiscountForm = this.fb.group({
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

    let done = moment(this.editDiscountForm.controls['startDate'].value)
    let today = done.date();
    let thisMonth = done.month();
    let thisYear = done.year()
    let temp = new Date(thisYear, thisMonth, today + 1)
    this.endTommorow = moment(temp).format('YYYY-MM-DD');


    let startTime = moment(this.editDiscountForm.get('startTime').value, 'HH:mm').format('HHmm');


  }


  vendorSearch(value) {

    console.log(value);
    if (value.length > 0) {

      this.vendorList = this.vendorList.filter((unit) => unit.name.indexOf(value) > -1);

    } else {
      this.vendorList = this.defaultVendorList
    }
  }



  geofenceSearch(value) {
    this.defaultGeofenceData = this.geofenceList
    console.log(value);
    if (value.length > 0) {
      this.geofenceList = this.geofenceList.filter((unit) => unit.name.indexOf(value) > -1);
    } else {
      this.geofenceList = this.defaultGeofenceData
    }
  }


  productSearch(value) {

    this.defaultProductList = this.productList
    console.log(value);
    if (value.length > 0) {
      this.productList = this.productList.filter((unit) => unit.name.indexOf(value) > -1);
    } else {
      this.productList = this.defaultProductList
    }
  }


  async bannerImageEvent(event) {
    debugger
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
          debugger
          var height = img.height;
          var width = img.width;
          if (this.editDiscountForm.get('type').value == 'Home') {
            if (height != width / 2) {
              this.commonService.errorToast("Image should be a Square size");
              imageOk = false
              // this.pushImage();
              return imageOk
            } else {
              this.commonService.successToast("Image Size is Ok");
              imageOk = true
              this.urlImage = false
              this.previewImage = temp.image;
              this.images = tempfile
              return imageOk
            }
          } else {
            if (height != width) {
              this.commonService.errorToast("Image should be a Square size");
              imageOk = false
              // this.pushImage();
              return imageOk
            } else {
              this.commonService.successToast("Image Size is Ok");
              imageOk = true
              this.previewImage = temp.image;
              this.images = tempfile;

              return imageOk
            }
          }

        };
        // this.previewImage = event.target.result;
        // this.editDiscountForm.controls['bannerImage'].patchValue(this.imageFile);
      };

    }




  }
  goToofferdeals() {
    this.router.navigate(['offerdeals'])
  }


  getAssignmentdata() {
    this.progress = true;
    this.apiService.getAssignementData().subscribe(res => {
      console.log(res);


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




  getDiscount(id) {


    this.apiService.getDisountDetails(id).subscribe(res => {
      if (res.success) {
        debugger
        this.discountDetails = res.data;
        console.log(this.discountDetails);
        // this.editDiscountForm.controls['dicountOn'].setValue(this.discountDetails.onModel);

        if (this.discountDetails.offer.type === "ad") {
          this.setradio('advertisment');
          this.editDiscountForm.get('dicountOn').setValue('advertisment')

        }
        if (this.discountDetails.offer.type === "seller") {
          this.setradio('vendor');
          this.editDiscountForm.get('dicountOn').setValue('vendor');
          this.editDiscountForm.get('vendor').setValue(this.discountDetails.vendor._id);
          this.editDiscountForm.get('geofence').setValue(this.discountDetails.geoFence);
        }
        if (this.discountDetails.offer.type === "product") {
          this.setradio('product');
          let productList = []
          this.categorySelected(this.discountDetails.category._id)
          this.editDiscountForm.get('dicountOn').setValue('product');
          this.discountDetails.offer.list.forEach(element => {
            productList.push(element._id)
          });
          this.editDiscountForm.get('product').setValue(productList);
          this.editDiscountForm.get('category').setValue(this.discountDetails.category._id);
        }

        this.editDiscountForm.controls['endDate'].setValue(moment(this.discountDetails.endDate).format("YYYY-MM-DD"));
        this.editDiscountForm.controls['type'].setValue(this.discountDetails.type);
        this.imageNotAccepted = false
        this.editDiscountForm.get('bannerImage').enable()
        this.editDiscountForm.get('startTime').setValue(moment(this.discountDetails.startTime, 'HHmm').format('HH:mm'))
        this.editDiscountForm.get('endTime').setValue(moment(this.discountDetails.endTime, 'HHmm').format('HH:mm'))
        this.editDiscountForm.controls['startDate'].setValue(moment(this.discountDetails.startDate).format("YYYY-MM-DD"));
        this.editDiscountForm.controls['name_ar'].setValue(this.discountDetails.name_ar);
        this.editDiscountForm.controls['name'].setValue(this.discountDetails.name);

        this.editDiscountForm.controls['dicountOn'].setValue(this.discountDetails.onModel.toLowerCase());
        // this.editDiscountForm.controls['dicountOn'].setValue(this.discountDetails.onModel);
        //  this.setradio(this.discountDetails.offer.type);
        this.urlImage = true
        this.previewImage = this.discountDetails.image;
        this.imageFile = this.discountDetails.image;
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

        console.log(res)
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

        console.log("categoryList", res)
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

    console.log("category :", id);
    this.selectedCategory = id;
    this.getAllProduct();
  }



  getAllProduct() {

    this.productList = [];
    let temp = []
    if (this.selectedCategory) {

      this.apiService.getProductsforBanner(this.selectedCategory).subscribe(res => {

        if (res.success) {
          console.log("ProductList", res);

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
    console.log("product:", id);
    this.selectedProduct = id;

  }

  typeSelected(e) {
    console.log(e);
    this.editDiscountForm.get('bannerImage').enable()

  }

  checkBanner() {
    debugger
    this.submitted = true
    console.log(this.editDiscountForm);
    let checkOffer = this.editDiscountForm.controls['dicountOn'].value;


    if (checkOffer == 'advertisment') {
      if (this.submitted && this.editDiscountForm.valid) {
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



  typeAdvertisement() {
    debugger
    let startDate = moment(this.editDiscountForm.controls['startDate'].value).toLocaleString();
    let endDate = moment(this.editDiscountForm.controls['endDate'].value).toLocaleString();
    let startTime = moment(this.editDiscountForm.get('startTime').value, 'HH:mm').format('HHmm')
    let endTime = moment(this.editDiscountForm.get('endTime').value, 'HH:mm').format('HHmm')
    console.log(startDate, endDate, startTime, endTime);

    let offer = {
      'list': [""], 'type': 'ad'
    }
    const body = new FormData();
    body.append('id', this.id);
    body.append('name', this.editDiscountForm.controls['name'].value);
    body.append('name_ar', this.editDiscountForm.controls['name_ar'].value);
    body.append('image', this.images, this.images.name);
    body.append('offer', JSON.stringify(offer));
    body.append('type', this.editDiscountForm.controls['type'].value);
    body.append('startDate', JSON.stringify(startDate));
    body.append('endDate', JSON.stringify(endDate));
    body.append('startTime', startTime);
    body.append('endTime', endTime);
    //Add banner method is getting called
    this.addbanner(body);
  }
  typeVendor() { //

    let startDate = moment(this.editDiscountForm.controls['startDate'].value).toLocaleString();
    let endDate = moment(this.editDiscountForm.controls['endDate'].value).toLocaleString();
    let startTime = moment(this.editDiscountForm.get('startTime').value, 'HH:mm').format('HHmm')
    let endTime = moment(this.editDiscountForm.get('endTime').value, 'HH:mm').format('HHmm')
    let offer = {
      'list': [this.editDiscountForm.get('vendor').value], 'type': 'seller'
    }

    const body = new FormData();
    body.append('id', this.id);
    body.append('name', this.editDiscountForm.controls['name'].value);
    body.append('name_ar', this.editDiscountForm.controls['name_ar'].value);

    body.append('image', new Blob([this.images], { type: 'image/*' }), this.images.name);

    body.append('type', this.editDiscountForm.controls['type'].value);
    body.append('offer', JSON.stringify(offer));
    body.append('geoFence', JSON.stringify(this.editDiscountForm.controls['geofence'].value));
    body.append('vendor', this.editDiscountForm.get('vendor').value);
    body.append('startDate', JSON.stringify(startDate));
    body.append('endDate', JSON.stringify(endDate));
    body.append('startTime', startTime);
    body.append('endTime', endTime);

    this.addbanner(body);
  }
  typeProduct() {


    let startDate = moment(this.editDiscountForm.controls['startDate'].value).toLocaleString();
    let endDate = moment(this.editDiscountForm.controls['endDate'].value).toLocaleString();
    let startTime = moment(this.editDiscountForm.get('startTime').value, 'HH:mm').format('HHmm')
    let endTime = moment(this.editDiscountForm.get('endTime').value, 'HH:mm').format('HHmm')
    let offer = {
      'list': this.editDiscountForm.get('product').value, 'type': 'product'
    }
    const body = new FormData();
    body.append('id', this.id);
    body.append('category', this.editDiscountForm.get('category').value);
    body.append('name', this.editDiscountForm.controls['name'].value);
    body.append('name_ar', this.editDiscountForm.controls['name_ar'].value);
    debugger
    body.append('image', this.images, this.images.name);
    body.append('type', this.editDiscountForm.controls['type'].value);
    body.append('offer', JSON.stringify(offer));
    //body.append('product', this.editDiscountForm.controls['product'].value);
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
    body.forEach((value, key) => {
      console.log(key + " " + value)
    });
    this.progress = true
    this.apiService.editBanner(body).subscribe(res => {
      console.log(res)
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






