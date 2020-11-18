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
@Component({
  selector: 'app-editdiscount',
  templateUrl: './editdiscount.component.html',
  styleUrls: ['./editdiscount.component.scss']
})
export class EditdiscountComponent implements OnInit {

  editDiscountForm: FormGroup;

  sub: any;
  id: any;
  showCategory: boolean;
  showSubcategory: boolean;
  showVendor: boolean;
  showProduct: boolean;
  discountDetails: any;
  selectedItem = [];
  categoryList: any[];
  parentId = ''
  subCategoryList: any[];
  vendorList: any[];
  productList: any[];
  selectedProduct: any;
  submitted: boolean;
  imageFile: any;
  previewImage: any;
  dicountOn: any;
  imageUrl: any
  categoryDropDownSettings: IDropdownSettings = {};
  subcategoryDropDownSettings: IDropdownSettings = {};
  vendorDropDownSettings: IDropdownSettings = {};
  productDropDownSettings: IDropdownSettings = {};
  singleCategorySelection: boolean;
  singleSubCategorySelection: boolean
  singleVendorSelection: boolean;
  singleProductSelection: boolean;
  selectedCategoryItem: any;
  selectedSubcategoryItem: any;
  selectedVendorItem: any;
  selectedProductItem: any;
  today: string;
  endTommorow: string;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private apiService: ApiService,
    private commonService: CommonService,
    private urlService: UrlService
  ) {
    this.imageUrl = this.urlService.imageUrl;
    this.getAllCategory()
  }



  setradio(e: string) {

    this.singleCategorySelection = true;
    this.singleSubCategorySelection = true;
    this.singleVendorSelection = true;
    this.singleProductSelection = true;
    switch (e) {
      case "category":
        this.dicountOn = 'category'
        this.singleCategorySelection = false
        this.showCategory = true;
        this.showSubcategory = false;
        this.showVendor = false;
        this.showProduct = false
        console.log("category");
        break;
      case "subCategory":
        this.dicountOn = 'subCategory';
        this.singleSubCategorySelection = false
        this.showCategory = true;
        this.showSubcategory = true;
        this.showVendor = false;
        this.showProduct = false
        console.log("subCategory");
        break;
      case "seller":
        this.dicountOn = 'seller'
        this.singleVendorSelection = false
        this.showCategory = true;
        this.showSubcategory = true;
        this.showVendor = true;
        this.showProduct = false
        console.log("vendor");
        break;
      case "product":
        this.dicountOn = 'product'
        this.singleProductSelection = false;
        this.showCategory = true;
        this.showSubcategory = true;
        this.showVendor = false;
        this.showProduct = true
        console.log("product");
        break;
    }
  }

  onKeyInCategory(value) {
    this.selectedItem = [];
    this.selectedCategory = this.searchCategory(value).toString();
  }

  onKeyInSubCategory(value) {
    this.selectedItem = [];
    this.selectedSubCategory = this.searchSubcategory(value).toString();
  }
  onKeyInVendor(value) {
    this.selectedItem = [];
    this.selectedVendor = this.searchVendor(value).toString();
  }
  onKeyInProduct(value) {
    this.selectedItem = [];
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
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.id = params['id'];
      });
    this.getDiscount(this.id);

    this.today = moment(new Date()).format('YYYY-MM-DD');
    // let currentDate = new Date().getDate();
    // let currentMonth = new Date().getMonth();
    // let year = new Date().getFullYear();
    // //console.log(new Date(year, currentMonth, currentDate + 1))

    // this.endTommorow = moment(new Date(year, currentMonth, currentDate + 1)).format('YYYY-MM-DD');


    this.editDiscountForm = this.fb.group({
      disount: ['', [Validators.required, Validators.min(0)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      type: ['', Validators.required],
      dicountOn: ['',],
      name: ['', [Validators.required, Validators.maxLength(25)]],
      name_ar: ['',],
      bannerImage: ['',]
    })




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

  ngAfterViewChecked(): void {
    //Called after every check of the component's view. Applies to components only.
    //Add 'implements AfterViewChecked' to the class.

    let done = moment(this.editDiscountForm.controls['startDate'].value)
    let today = done.date();
    let thisMonth = done.month();
    let thisYear = done.year()
    let temp = new Date(thisYear, thisMonth, today + 1)
    this.endTommorow = moment(temp).format('YYYY-MM-DD')

  }

  type: Ready[] = [
    { value: 'Home', viewValue: 'Home' },
    { value: 'Coupon', viewValue: 'Coupon' },
    { value: 'Offer', viewValue: 'Offer' },
    { value: 'Deal', viewValue: 'Deal' },
    { value: 'Deal Slider', viewValue: 'Deal Slider' }
  ];

  flagImage: boolean = false
  async bannerImageEvent(event) {
    this.flagImage = true
    if (event.target.files && event.target.files[0]) {
      this.imageFile = event.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.previewImage = event.target.result;

      };
      this.editDiscountForm.controls['bannerImage'].patchValue(this.imageFile);
    }
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
      this.selectedItem.push(items[i].id)
    }
  }




  getDiscount(id) {

    this.apiService.getDisountDetails(id).subscribe(res => {
      if (res.success) {
        this.discountDetails = res.data;
        console.log(this.discountDetails);
        // this.editDiscountForm.controls['dicountOn'].setValue(this.discountDetails.onModel);
        if (this.discountDetails.offer.type === "category") {
          let lookForCategory = []
          for (let i = 0; i < this.discountDetails.offer.list.length; i++) {
            lookForCategory.push(this.discountDetails.offer.list[i].id)

          }

          this.lookUpForCategory(lookForCategory);
        }
        if (this.discountDetails.offer.type === "subCategory") {
          let lookForSubCategory = []
          for (let i = 0; i < this.discountDetails.offer.list.length; i++) {
            lookForSubCategory.push(this.discountDetails.offer.list[i].id)

          }
          this.lookUpForSubCategory(lookForSubCategory, this.discountDetails.category);
        }
        if (this.discountDetails.offer.type === "seller") {
          let lookForVendor = []
          for (let i = 0; i < this.discountDetails.offer.list.length; i++) {
            lookForVendor.push(this.discountDetails.offer.list[i]._id)

          }

          this.lookUpForVendor(lookForVendor, this.discountDetails.subCategory.id, this.discountDetails.category.id);
        }
        if (this.discountDetails.offer.type === "product") {
          let lookForProduct = []
          for (let i = 0; i < this.discountDetails.offer.list.length; i++) {
            lookForProduct.push(this.discountDetails.offer.list[i].id)

          }
          this.lookUpForProduct(lookForProduct, this.discountDetails.subCategory.id, this.discountDetails.category.id);

        }





        this.editDiscountForm.controls['endDate'].setValue(moment(this.discountDetails.endDate).format("YYYY-MM-DD"));
        this.editDiscountForm.controls['type'].setValue(this.discountDetails.type);
        this.editDiscountForm.controls['startDate'].setValue(moment(this.discountDetails.startDate).format("YYYY-MM-DD"));
        this.editDiscountForm.controls['disount'].setValue(this.discountDetails.discount);
        this.editDiscountForm.controls['name_ar'].setValue(this.discountDetails.name_ar);
        this.editDiscountForm.controls['name'].setValue(this.discountDetails.name);
        // this.editDiscountForm.controls['dicountOn'].setValue(this.discountDetails.onModel);
        // this.editDiscountForm.controls['dicountOn'].setValue(this.discountDetails.onModel);
        this.setradio(this.discountDetails.offer.type);
        this.previewImage = this.discountDetails.image;
        this.imageFile = this.discountDetails.image;
      }
    })



  }

  lookUpForCategory(selectedList) {

    console.log(selectedList)
    let temp = []

    for (let i = 0; i < this.categoryList.length; i++) {
      for (let j = 0; j < selectedList.length; j++) {
        if (selectedList[j] === this.categoryList[i].id) {
          let body = {
            'id': this.categoryList[i].id,
            'name': this.categoryList[i].name,
          }
          temp.push(body);
        }

      }


    }
    this.selectedCategoryItem = temp;
  }

  categoryId: any
  selectedSubcategoryList: any
  lookUpForSubCategory(ls, la) {

    this.selectedSubcategoryList = ls
    this.categoryId = la.id
    this.getAllSubcategory(this.categoryId);
    this.selectedCategory = la


  }
  subCategoryId: any
  selectedVendorList: any
  lookUpForVendor(ls, subcategoryId, categoryId) {
    console.log(ls);
    this.selectedVendorList = ls
    this.categoryId = categoryId;
    this.subCategoryId = subcategoryId;
    this.getAllSubcategory(categoryId)
    this.getAllVendor();
    this.selectedCategory = categoryId;
    this.selectedSubCategory = subcategoryId

  }
  selectedProductList: any
  lookUpForProduct(ls, subcategoryId, categoryId) {
    console.log(ls)
    this.selectedProductList = ls;
    this.categoryId = categoryId;
    this.subCategoryId = subcategoryId;
    this.getAllSubcategory(categoryId)
    this.getAllProduct();
    this.selectedCategory = categoryId;
    this.selectedSubCategory = subcategoryId;
  }

  getAllCategory() {

    this.categoryList = []
    let temp = []
    this.apiService.getAllCategoriesForPanel().subscribe(res => {
      if (res.success) {
        // console.log(res)
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
      this.categoryList = temp

    });
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

    this.apiService.getAllSubCategoriesForDiscount(id).subscribe(res => {
      if (res.success) {
        //  console.log(res)
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
      this.subCategoryList = temp

      if (this.categoryId) {
        let temp1 = []

        for (let i = 0; i < this.subCategoryList.length; i++) {
          for (let j = 0; j < this.selectedSubcategoryList.length; j++) {
            if (this.selectedSubcategoryList[j] === this.subCategoryList[i].id) {
              let body = {
                'id': this.subCategoryList[i].id,
                'name': this.subCategoryList[i].name,
              }
              temp1.push(body);
            }

          }


        }
        this.selectedSubcategoryItem = temp1;
      }




    });


  }

  selectedSubCategory = ''
  subCategorySelected(id) {
    console.log("subcategory:", id)
    this.selectedSubCategory = id

    this.getAllVendor();


  }


  getAllVendor() {
    this.vendorList = []
    let body: any
    let temp = []
    if (this.selectedSubCategory) {
      body = {
        'categories': [this.selectedCategory],
        'subCategories': [this.selectedSubCategory]
      }
    }
    if (this.subCategoryId) {
      body = {
        'categories': [this.categoryId],
        'subCategories': [this.subCategoryId]
      }
    }

    this.apiService.getBrandListbyCat(this.selectedCategory, this.selectedSubCategory).subscribe(res => {

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
      this.vendorList = temp;
      if (this.subCategoryId) {
        let temp1 = []

        for (let i = 0; i < this.vendorList.length; i++) {
          for (let j = 0; j < this.selectedVendorList.length; j++) {
            if (this.selectedVendorList[j] === this.vendorList[i].id) {
              let body = {
                'id': this.vendorList[i].id,
                'name': this.vendorList[i].name,
              }
              temp1.push(body);
            }

          }


        }
        this.selectedVendorItem = temp1;

      }
    });


  }

  selectedVendor = ''
  vendorSelected(e) {

    console.log("vendor:", e)
    this.selectedVendor = e
    // this.getAllProduct()
  }

  getAllProduct() {
    let body: any
    this.productList = [];
    let temp = []
    if (this.selectedSubCategory) {
      body = {
        'categories': [this.selectedCategory],
        'subCategories': [this.selectedSubCategory],

      }
    }
    if (this.subCategoryId) {
      body = {
        'categories': [this.categoryId],
        'subCategories': [this.subCategoryId]
      }
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
      if (this.subCategoryId) {
        let temp1 = []

        for (let i = 0; i < this.productList.length; i++) {
          for (let j = 0; j < this.selectedProductList.length; j++) {
            if (this.selectedProductList[j] === this.productList[i].id) {
              let body = {
                'id': this.productList[i].id,
                'name': this.productList[i].name,
              }
              temp1.push(body);
            }

          }


        }
        this.selectedProductItem = temp1;

      }


    });
  }


  productSelected(id) {
    console.log("product:", id);
    this.selectedProduct = id;

  }



  checkBanner() {

    this.submitted = true
    console.log(this.editDiscountForm);
    let checkOffer = this.dicountOn;
    if (checkOffer == "category") {
      if (this.submitted && this.editDiscountForm.valid) {

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
      if (this.submitted && this.editDiscountForm.valid) {
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
    if (checkOffer == 'seller') {
      if (this.submitted && this.editDiscountForm.valid) {
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
      if (this.submitted && this.editDiscountForm.valid) {
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

    let startDate = moment(this.editDiscountForm.controls['startDate'].value).toLocaleString();
    let endDate = moment(this.editDiscountForm.controls['endDate'].value).toLocaleString();
    let offer = {
      'list': selectedCategoryItem, 'type': checkOffer
    }

    const body = new FormData();
    body.append('id', this.id);
    body.append('name', this.editDiscountForm.controls['name'].value);
    body.append('name_ar', this.editDiscountForm.controls['name_ar'].value);
    if (this.flagImage) {
      body.append('image', this.imageFile, this.imageFile.name);

    }
    body.append('type', this.editDiscountForm.controls['type'].value);
    body.append('discount', this.editDiscountForm.controls['disount'].value);
    body.append('offer', JSON.stringify(offer));
    body.append('startDate', JSON.stringify(startDate));
    body.append('endDate', JSON.stringify(endDate));


    this.editbanner(body);
  }


  typeSubcategory(checkOffer, selectedSubcategoryItem) {


    let startDate = moment(this.editDiscountForm.controls['startDate'].value).toLocaleString();
    let endDate = moment(this.editDiscountForm.controls['endDate'].value).toLocaleString();
    let offer = {
      'list': selectedSubcategoryItem, 'type': checkOffer
    }

    const body = new FormData();
    body.append('id', this.id);
    body.append('category', this.categoryId)
    body.append('name', this.editDiscountForm.controls['name'].value);
    body.append('name_ar', this.editDiscountForm.controls['name_ar'].value);
    if (this.flagImage) {
      body.append('image', this.imageFile, this.imageFile.name);

    }
    body.append('type', this.editDiscountForm.controls['type'].value);
    body.append('discount', this.editDiscountForm.controls['disount'].value);
    body.append('offer', JSON.stringify(offer));
    body.append('startDate', JSON.stringify(startDate));
    body.append('endDate', JSON.stringify(endDate));

    this.editbanner(body);
  }
  typeVendor(checkOffer, selectedVendorItem) {


    let startDate = moment(this.editDiscountForm.controls['startDate'].value).toLocaleString();
    let endDate = moment(this.editDiscountForm.controls['endDate'].value).toLocaleString();
    let offer = {
      'list': selectedVendorItem, 'type': 'seller'
    }

    const body = new FormData();
    body.append('id', this.id);
    body.append('category', this.categoryId);
    body.append('subCategory', this.subCategoryId);
    body.append('name', this.editDiscountForm.controls['name'].value);
    body.append('name_ar', this.editDiscountForm.controls['name_ar'].value);
    if (this.flagImage) {
      body.append('image', this.imageFile, this.imageFile.name);

    }
    body.append('type', this.editDiscountForm.controls['type'].value);
    body.append('discount', this.editDiscountForm.controls['disount'].value);
    body.append('offer', JSON.stringify(offer));
    body.append('startDate', JSON.stringify(startDate));
    body.append('endDate', JSON.stringify(endDate));

    this.editbanner(body);
  }
  typeProduct(checkOffer, selectedItem) {


    let startDate = moment(this.editDiscountForm.controls['startDate'].value).toLocaleString();
    let endDate = moment(this.editDiscountForm.controls['endDate'].value).toLocaleString();
    let offer = {
      'list': selectedItem, 'type': checkOffer
    }

    const body = new FormData();
    body.append('id', this.id);
    body.append('category', this.categoryId);
    body.append('subCategory', this.subCategoryId);
    body.append('name', this.editDiscountForm.controls['name'].value);
    body.append('name_ar', this.editDiscountForm.controls['name_ar'].value);
    if (this.flagImage) {
      body.append('image', this.imageFile, this.imageFile.name);

    }
    body.append('type', this.editDiscountForm.controls['type'].value);
    body.append('discount', this.editDiscountForm.controls['disount'].value);
    body.append('offer', JSON.stringify(offer));
    body.append('startDate', JSON.stringify(startDate));
    body.append('endDate', JSON.stringify(endDate));

    this.editbanner(body);
  }



  editbanner(body) {

    //  console.log(body)
    body.forEach((value, key) => {
      console.log(key + " " + value)
    });

    this.apiService.updateBanner(body).subscribe(res => {
      console.log(res)
      if (res.success) {
        this.commonService.successToast("Updated Successfully")
        this.router.navigateByUrl('offerdeals');
      }
    })


  }

  goToofferdeals() {
    this.router.navigate(['offerdeals'])
  }

}
