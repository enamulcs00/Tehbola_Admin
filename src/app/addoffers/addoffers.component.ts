import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/services/common.service';
import * as moment from 'moment';
interface Ready {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-addoffers',
  templateUrl: './addoffers.component.html',
  styleUrls: ['./addoffers.component.scss']
})
export class AddoffersComponent implements OnInit {


  showCategory: boolean
  showSubcategory: boolean
  showVendor: boolean
  showProduct: boolean
  categoryList = [];
  subCategoryList = [];
  vendorList = [];
  productList = [];
  selectedItem = [];
  addDiscountForm: FormGroup;
  parentId = ''
  imageFile: any;
  previewImage: any;
  submitted: boolean;
  selectedProduct: any;
  constructor(private router: Router, private apiService: ApiService, private fb: FormBuilder, private commonService: CommonService) {

    this.getAllCategory()


  }


  setradio(e: string) {
    switch (e) {
      case "category":
        this.showCategory = true;
        this.showSubcategory = false;
        this.showVendor = false;
        this.showProduct = false
        console.log("category");
        break;
      case "subcategory":

        this.showCategory = true;
        this.showSubcategory = true;
        this.showVendor = false;
        this.showProduct = false
        console.log("subcategory");
        break;
      case "vendor":

        this.showCategory = true;
        this.showSubcategory = true;
        this.showVendor = true;
        this.showProduct = false
        console.log("vendor");
        break;
      case "product":

        this.showCategory = true;
        this.showSubcategory = true;
        this.showVendor = true;
        this.showProduct = true
        console.log("product");
        break;
    }
  }


  // Receive user input and send to search method**
  onKeyInCategory(value) {
    this.selectedItem = [];
    this.selectedItem = this.searchCategory(value);
  }

  onKeyInSubCategory(value) {
    this.selectedItem = [];
    this.selectedItem = this.searchSubcategory(value);
  }
  onKeyInVendor(value) {
    this.selectedItem = [];
    this.selectedItem = this.searchVendor(value);
  }
  onKeyInProduct(value) {
    this.selectedItem = [];
    this.selectedItem = this.searchProduct(value);
  }


  searchCategory(value: string) {
    let filter = value.toLowerCase();
    return this.categoryList.filter(option => option.toLowerCase().startsWith(filter));
  }
  searchSubcategory(value: string) {
    let filter = value.toLowerCase();
    return this.subCategoryList.filter(option => option.toLowerCase().startsWith(filter));
  }
  searchVendor(value: string) {
    let filter = value.toLowerCase();
    return this.vendorList.filter(option => option.toLowerCase().startsWith(filter));
  }
  searchProduct(value: string) {
    let filter = value.toLowerCase();
    return this.productList.filter(option => option.toLowerCase().startsWith(filter));
  }

  ngOnInit() {
    this.getAllCategory();
    this.addDiscountForm = this.fb.group({
      disount: ['', [Validators.required, Validators.min(0)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      type: ['', Validators.required],
      dicountOn: ['', Validators.required],
      name: ['', [Validators.required, Validators.maxLength(25)]],
      name_ar: ['',],
      bannerImage: ['', Validators.required]
    })



  }

  async bannerImageEvent(event) {
    if (event.target.files && event.target.files[0]) {
      this.imageFile = event.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.previewImage = event.target.result;
        this.addDiscountForm.controls['bannerImage'].patchValue(this.imageFile);
      };

    }
  }
  goToofferdeals() {
    this.router.navigate(['offerdeals'])
  }
  type: Ready[] = [
    { value: 'Home', viewValue: 'Home' },
    { value: 'Coupon', viewValue: 'Coupon' },
    { value: 'Offer', viewValue: 'Offer' },
    { value: 'Deal', viewValue: 'Deal' },
    { value: 'Deal Slider', viewValue: 'Deal Slider' }
  ];


  getAllCategory() {

    this.categoryList = []

    this.apiService.getAllCategoriesForDiscount(this.parentId).subscribe(res => {
      if (res.success) {
        // console.log(res)
        if (res.data) {
          for (let i = 0; i <= res.data.length; i++) {
            let body = {
              'id': res.data[i].id,
              'name': res.data[i].name
            }
            this.categoryList.push(body);

          }
        }
      }
    })
  }


  selectedCategory = ''
  categorySelected(id) {
    console.log("category :", id);
    this.selectedCategory = id;
    this.getAllSubcategory(id);
  }


  getAllSubcategory(id) {

    this.subCategoryList = []
    if (this.selectedCategory) {
      this.apiService.getAllCategoriesForDiscount(id).subscribe(res => {
        if (res.success) {
          //  console.log(res)
          if (res.data) {
            for (let i = 0; i <= res.data.length; i++) {
              let body = {
                'id': res.data[i].id,
                'name': res.data[i].name
              }
              this.subCategoryList.push(body)
            }
          }
        }
      });
    } else {
      this.commonService.errorToast("Please Select a category.");

    }

  }


  selectedSubCategory = ''
  subCategorySelected(id) {
    console.log("subcategory:", id)
    this.selectedSubCategory = id
    this.getAllVendor();
  }

  getAllVendor() {
    this.vendorList = []
    if (this.selectedSubCategory) {
      let body = {
        'categories': [this.selectedCategory],
        'subCategories': [this.selectedSubCategory]
      }

      this.apiService.getVendorListbyCat(body).subscribe(res => {

        if (res.success) {
          // console.log(res)
          if (res.data) {
            for (let i = 0; i <= res.data.length; i++) {
              let body = {
                'id': res.data[i]._id,
                'firstname': res.data[i].firstName,
                'lastname': res.data[i].lastName
              }
              this.vendorList.push(body)
            }
          }
        }
      });
    } else {
      this.commonService.errorToast("Please Select a sub category first")
    }
  }

  selectedVendor = ''
  vendorSelected(e) {

    console.log("vendor:", e)
    this.selectedVendor = e
    this.getAllProduct()
  }

  getAllProduct() {
    this.productList = [];
    if (this.selectedVendor) {
      let body = {
        'categories': [this.selectedCategory],
        'subCategories': [this.selectedSubCategory],
        'vendors': [this.selectedVendor]
      }

      this.apiService.getProductByVendor(body).subscribe(res => {

        if (res.success) {
          if (res.data) {
            for (let i = 0; i <= res.data.length; i++) {
              let body = {
                'id': res.data[i].id,
                'name': res.data[i].name,

              }
              this.productList.push(body)
            }
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

  checkBanner() {
    debugger
    this.submitted = true
    console.log(this.addDiscountForm);
    let checkOffer = this.addDiscountForm.controls['dicountOn'].value;
    if (checkOffer == "category") {
      if (this.submitted && this.addDiscountForm.valid) {


        this.typeCategory(checkOffer);
      }
    }

    if (checkOffer == 'subCategory') {
      if (this.submitted && this.addDiscountForm.valid) {
        this.typeSubcategory(checkOffer)
      }

    }
    if (checkOffer == 'vendor') {
      if (this.submitted && this.addDiscountForm.valid) {
        this.typeVendor(checkOffer);
      }

    }
    if (checkOffer == 'product') {
      if (this.submitted && this.addDiscountForm.valid) {
        this.typeProduct(checkOffer);
      }

    }


  }

  typeCategory(checkOffer) {

    let startDate = moment().toISOString(this.addDiscountForm.controls['startDate'].value);
    let endDate = moment().toISOString(this.addDiscountForm.controls['endDate'].value)
    let offer = {
      'list': [this.selectedCategory], 'type': checkOffer
    }

    const body = new FormData();
    body.append('name', this.addDiscountForm.controls['name'].value);
    body.append('name_ar', this.addDiscountForm.controls['name_ar'].value);
    body.append('image', this.imageFile, this.imageFile.name);
    body.append('type', this.addDiscountForm.controls['type'].value);
    body.append('discount', this.addDiscountForm.controls['disount'].value);
    body.append('offer', JSON.stringify(offer));
    body.append('startDate', startDate);
    body.append('endDate', endDate)


    this.addbanner(body);
  }


  typeSubcategory(checkOffer) {

    let startDate = moment().toISOString(this.addDiscountForm.controls['startDate'].value);
    let endDate = moment().toISOString(this.addDiscountForm.controls['endDate'].value)
    let offer = {
      'list': [this.selectedSubCategory], 'type': checkOffer
    }

    const body = new FormData();
    body.append('name', this.addDiscountForm.controls['name'].value);
    body.append('name_ar', this.addDiscountForm.controls['name_ar'].value);
    body.append('image', this.imageFile, this.imageFile.name);
    body.append('type', this.addDiscountForm.controls['type'].value);
    body.append('discount', this.addDiscountForm.controls['disount'].value);
    body.append('offer', JSON.stringify(offer));
    body.append('startDate', startDate);
    body.append('endDate', endDate);

    this.addbanner(body);
  }
  typeVendor(checkOffer) {

    let startDate = moment().toISOString(this.addDiscountForm.controls['startDate'].value);
    let endDate = moment().toISOString(this.addDiscountForm.controls['endDate'].value)
    let offer = {
      'list': [this.selectedVendor], 'type': checkOffer
    }

    const body = new FormData();
    body.append('name', this.addDiscountForm.controls['name'].value);
    body.append('name_ar', this.addDiscountForm.controls['name_ar'].value);
    body.append('image', this.imageFile, this.imageFile.name);
    body.append('type', this.addDiscountForm.controls['type'].value);
    body.append('discount', this.addDiscountForm.controls['disount'].value);
    body.append('offer', JSON.stringify(offer));
    body.append('startDate', startDate);
    body.append('endDate', endDate);

    this.addbanner(body);
  }
  typeProduct(checkOffer) {

    let startDate = moment().toISOString(this.addDiscountForm.controls['startDate'].value);
    let endDate = moment().toISOString(this.addDiscountForm.controls['endDate'].value)
    let offer = {
      'list': [this.selectedProduct], 'type': checkOffer
    }

    const body = new FormData();
    body.append('name', this.addDiscountForm.controls['name'].value);
    body.append('name_ar', this.addDiscountForm.controls['name_ar'].value);
    body.append('image', this.imageFile, this.imageFile.name);
    body.append('type', this.addDiscountForm.controls['type'].value);
    body.append('discount', this.addDiscountForm.controls['disount'].value);
    body.append('offer', JSON.stringify(offer));
    body.append('startDate', startDate);
    body.append('endDate', endDate);

    this.addbanner(body);
  }



  addbanner(body) {
    console.log(body)
    body.forEach((value, key) => {
      console.log(key + " " + value)
    });

    this.apiService.addBanner(body).subscribe(res => {
      console.log(res)
      if (res.success) {
        this.router.navigateByUrl('offerdeals');
      }
    })


  }

}

