import { Component, OnInit, AfterViewInit, AfterContentChecked, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/services/common.service';
import * as moment from 'moment';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
interface Ready {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-addoffers',
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: './addoffers.component.html',
  styleUrls: ['./addoffers.component.scss']
})
export class AddoffersComponent implements OnInit, AfterContentChecked {


  showCategory: boolean
  showSubcategory: boolean
  showVendor: boolean
  showProduct: boolean
  categoryList = [];
  subCategoryList = [];
  vendorList = [];
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



  constructor(private router: Router, private apiService: ApiService, private fb: FormBuilder, private commonService: CommonService) {

    //this.getAllCategory()

    this.getAllCategory();
  }



  showMultiCategory: boolean = false


  setradio(e: string) {
    this.singleCategorySelection = true;
    this.singleSubCategorySelection = true;
    this.singleVendorSelection = true;
    this.singleProductSelection = true;
    switch (e) {
      case "category":
        this.singleCategorySelection = false;
        this.showCategory = true;
        this.showSubcategory = false;
        this.showVendor = false;
        this.showProduct = false
        console.log("category");
        break;
      case "subcategory":
        this.singleSubCategorySelection = false
        this.showCategory = true;
        this.showSubcategory = true;
        this.showVendor = false;
        this.showProduct = false
        console.log("subcategory");
        break;
      case "vendor":
        this.singleVendorSelection = false
        this.showCategory = true;
        this.showSubcategory = true;
        this.showVendor = true;
        this.showProduct = false
        this.selectedCategory = '';
        this.selectedSubCategory = '';
        console.log("vendor");
        break;
      case "product":
        this.singleProductSelection = false
        this.showCategory = true;
        this.showSubcategory = true;
        this.showVendor = false;
        this.showProduct = true
        this.selectedCategory = '';
        this.selectedSubCategory = '';
        console.log("product");
        break;
    }
  }


  // Receive user input and send to search method**
  onKeyInCategory(value) {
    // this.selectedItem = [];
    this.selectedCategory = this.searchCategory(value).toString();
  }

  onKeyInSubCategory(value) {
    // this.selectedItem = [];
    this.selectedSubCategory = this.searchSubcategory(value).toString();
  }
  onKeyInVendor(value) {
    // this.selectedItem = [];
    this.selectedVendor = this.searchVendor(value).toString();
  }
  onKeyInProduct(value) {
    //  this.selectedItem = [];
    this.selectedProduct = this.searchProduct(value).toString();
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

  ngAfterContentChecked() {

    this.categoryDropDownSettings = {

      singleSelection: this.singleCategorySelection,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 10,
      allowSearchFilter: true
    }

    this.subcategoryDropDownSettings = {

      singleSelection: this.singleSubCategorySelection,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 10,
      allowSearchFilter: true
    }

    this.vendorDropDownSettings = {

      singleSelection: this.singleVendorSelection,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 10,
      allowSearchFilter: true
    }

    this.productDropDownSettings = {

      singleSelection: this.singleProductSelection,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 10,
      allowSearchFilter: true
    }

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

  onCategorySelect(item: any) {
    console.log(item.id);
    const index = this.selectedCategoryItem.findIndex(o => o._id.toString() == item.id.toString());
    if (index < 0) this.selectedCategoryItem.push(item);

  }

  onSubcategorySelect(item: any) {
    const index = this.selectedSubcategoryItem.findIndex(o => o._id.toString() == item.id.toString());
    if (index < 0) this.selectedSubcategoryItem.push(item)
  }

  onVendorSelect(item: any) {
    const index = this.selectedVendorItem.findIndex(o => o._id.toString() == item.id.toString());
    if (index < 0) this.selectedVendorItem.push(item)
  }

  onProductSelect(item: any) {
    const index = this.selectedProductItem.findIndex(o => o._id.toString() == item.id.toString());
    if (index < 0) this.selectedProductItem.push(item)
  }
  onSelectAll(items: any) {
    console.log(items)
    for (let i = 0; i < items.length; i++) {
      this.selectedItem.push(items.id)
    }
  }
  type: Ready[] = [
    { value: 'Home', viewValue: 'Home' },
    { value: 'Coupon', viewValue: 'Coupon' },
    { value: 'Offer', viewValue: 'Offer' },
    { value: 'Deal', viewValue: 'Deal' },
    { value: 'Deal Slider', viewValue: 'Deal Slider' }
  ];


  getAllCategory() {

    let temp = []
    this.categoryList = []

    this.apiService.getAllCategoriesForDiscount(this.parentId).subscribe(res => {

      if (res.success) {

        console.log(res)
        if (res.data) {
          for (let i = 0; i < res.data.length; i++) {
            let body = {
              'id': res.data[i].id,
              'name': res.data[i].name
            }
            temp.push(body);

          }

        }
      }
    });

    this.categoryList = temp;

  }


  selectedCategory = ''
  categorySelected(id) {
    console.log("category :", id);
    this.selectedCategory = id;
    this.getAllSubcategory(id);
  }

  getAllSubcategory(id) {

    let temp = []
    this.subCategoryList = []
    if (this.selectedCategory) {
      this.apiService.getAllCategoriesForDiscount(id).subscribe(res => {
        if (res.success) {

          console.log(res)
          if (res.data) {

            for (let i = 0; i < res.data.length; i++) {
              let body = {
                'id': res.data[i].id,
                'name': res.data[i].name
              }
              temp.push(body)
            }

          }
        }
        this.subCategoryList = temp;
      });

    } else {
      this.commonService.errorToast("Please Select a category.");

    }

  }


  selectedSubCategory = ''
  subCategorySelected(id) {
    console.log("subcategory:", id)
    this.selectedSubCategory = id
    if (this.showVendor) {
      this.getAllVendor();
    } else {
      this.getAllProduct()
    }
  }

  getAllVendor() {
    debugger
    this.vendorList = []
    let temp = []
    if (this.selectedSubCategory) {
      let body = {
        'categories': [this.selectedCategory],
        'subCategories': [this.selectedSubCategory]
      }

      this.apiService.getVendorListbyCat(body).subscribe(res => {

        if (res.success) {
          // console.log(res)
          if (res.data) {
            for (let i = 0; i < res.data.length; i++) {
              let body = {
                'id': res.data[i]._id,
                'name': res.data[i].firstName + res.data[i].lastName,

              }
              temp.push(body)
            }
          }

        }
        this.vendorList = temp
      });
    } else {
      this.commonService.errorToast("Please Select a sub category first")
    }
  }

  selectedVendor = ''
  vendorSelected(e) {

    console.log("vendor:", e)
    this.selectedVendor = e
    // this.getAllProduct()
  }

  getAllProduct() {
    debugger
    this.productList = [];
    let temp = []
    if (this.selectedSubCategory) {
      let body = {
        'categories': [this.selectedCategory],
        'subCategories': [this.selectedSubCategory],

      }

      this.apiService.getProductByVendor(body).subscribe(res => {

        if (res.success) {
          if (res.data) {
            for (let i = 0; i < res.data.length; i++) {
              let body = {
                'id': res.data[i].id,
                'name': res.data[i].name,

              }
              temp.push(body)
            }
          }
        }
        this.productList = temp
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
        if (this.selectedItem.length > 0) {
          this.typeCategory(checkOffer, this.selectedItem);
        } else {
          let selectedCategory = []
          for (let i = 0; i < this.selectedCategoryItem.length; i++) {
            selectedCategory.push(this.selectedCategoryItem[i].id)
          }
          this.typeCategory(checkOffer, selectedCategory);
        }
      }
    }

    if (checkOffer == 'subCategory') {
      if (this.submitted && this.addDiscountForm.valid) {

        if (this.selectedItem.length > 0) {
          this.typeSubcategory(checkOffer, this.selectedItem);
        } else {
          let selectedSubCategory = [];
          for (let i = 0; i < this.selectedSubcategoryItem.length; i++) {
            selectedSubCategory.push(this.selectedSubcategoryItem[i].id)
          }
          this.typeSubcategory(checkOffer, selectedSubCategory);
        }
      }

    }
    if (checkOffer == 'vendor') {
      if (this.submitted && this.addDiscountForm.valid) {
        if (this.selectedItem.length > 0) {
          this.typeVendor(checkOffer, this.selectedItem);
        } else {
          let selectedVendor = [];
          for (let i = 0; i < this.selectedVendorItem.length; i++) {
            selectedVendor.push(this.selectedVendorItem[i].id)
          }

          this.typeVendor(checkOffer, selectedVendor);
        }
      }

    }
    if (checkOffer == 'product') {
      if (this.submitted && this.addDiscountForm.valid) {
        if (this.selectedItem.length > 0) {
          this.typeProduct(checkOffer, this.selectedItem);
        } else {
          let selectedProduct = [];
          for (let i = 0; i < this.selectedProductItem.length; i++) {
            selectedProduct.push(this.selectedProductItem[i].id)
          }
          this.typeProduct(checkOffer, selectedProduct);
        }
      }

    }


  }


  typeCategory(checkOffer, selectedCategoryItem) {

    let startDate = moment().toISOString(this.addDiscountForm.controls['startDate'].value);
    let endDate = moment().toISOString(this.addDiscountForm.controls['endDate'].value)
    let offer = {
      'list': selectedCategoryItem, 'type': checkOffer
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


  typeSubcategory(checkOffer, selectedSubcategoryItem) {

    let startDate = moment().toISOString(this.addDiscountForm.controls['startDate'].value);
    let endDate = moment().toISOString(this.addDiscountForm.controls['endDate'].value)
    let offer = {
      'list': selectedSubcategoryItem, 'type': checkOffer
    }

    const body = new FormData();
    body.append('category', this.selectedCategory)
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
  typeVendor(checkOffer, selectedVendorItem) {

    let startDate = moment().toISOString(this.addDiscountForm.controls['startDate'].value);
    let endDate = moment().toISOString(this.addDiscountForm.controls['endDate'].value)
    let offer = {
      'list': selectedVendorItem, 'type': 'seller'
    }

    const body = new FormData();
    body.append('category', this.selectedCategory);
    body.append('subCategory', this.selectedSubCategory);
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
  typeProduct(checkOffer, selectedItem) {

    let startDate = moment().toISOString(this.addDiscountForm.controls['startDate'].value);
    let endDate = moment().toISOString(this.addDiscountForm.controls['endDate'].value)
    let offer = {
      'list': selectedItem, 'type': checkOffer
    }

    const body = new FormData();
    body.append('category', this.selectedCategory);
    body.append('subCategory', this.selectedSubCategory);
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
    //  console.log(body)
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

