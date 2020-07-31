import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/services/common.service';
import * as moment from 'moment';
import { UrlService } from 'src/services/url.service';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import { debug } from 'console';

interface Ready {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-editdiscount',
  templateUrl: './editdiscount.component.html',
  styleUrls: ['./editdiscount.component.scss']
})
export class EditdiscountComponent implements OnInit ,AfterViewInit {

  editDiscountForm: FormGroup;
  pick: Ready[] = [
    { value: 'Lorem ipsum', viewValue: 'Lorem ipsum' },
    { value: 'Lorem ipsum', viewValue: 'Lorem ipsum' },
    { value: 'Lorem ipsum', viewValue: 'Lorem ipsum' },
    { value: 'Lorem ipsum', viewValue: 'Lorem ipsum' }
  ];
  sub: any;
  id: any;
  showCategory: boolean;
  showSubcategory: boolean;
  showVendor: boolean;
  showProduct: boolean;
  discountDetails: any;
  selectedItem: any[];
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
  singleCategorySelection:boolean;
  singleSubCategorySelection:boolean
  singleVendorSelection:boolean;
  singleProductSelection:boolean;
  selectedCategoryItem: any;
  selectedSubcategoryItem: any;
  selectedVendorItem: any;
  selectedProductItem: any;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private apiService: ApiService,
    private commonService: CommonService,
    private urlService: UrlService
  ) {
    this.imageUrl = this.urlService.imageUrl;
   //  this.getAllCategory()
  }



  setradio(e: string) {
    debugger
    this.singleCategorySelection = true;
    this.singleSubCategorySelection = true;
    this.singleVendorSelection = true;
    this.singleProductSelection = true;
    switch (e) {
      case "category":
        this.dicountOn = 'category'
        this.singleCategorySelection=false
        this.showCategory = true;
        this.showSubcategory = false;
        this.showVendor = false;
        this.showProduct = false
        console.log("category");
        break;
      case "subCategory":
        this.dicountOn = 'subCategory';
        this.singleSubCategorySelection=false
        this.showCategory = true;
        this.showSubcategory = true;
        this.showVendor = false;
        this.showProduct = false
        console.log("subCategory");
        break;
      case "vendor":
        this.dicountOn = 'vendor'
        this.singleVendorSelection=false
        this.showCategory = true;
        this.showSubcategory = true;
        this.showVendor = true;
        this.showProduct = false
        console.log("vendor");
        break;
      case "product":
        this.dicountOn = 'product'
        this.singleProductSelection=false;
        this.showCategory = true;
        this.showSubcategory = true;
        this.showVendor = false;
        this.showProduct = true
        console.log("product");
        break;
    }
  }

  onKeyInCategory(value) {
   // this.selectedItem = [];
    this.selectedCategory = this.searchCategory(value).toString();
  }

  onKeyInSubCategory(value) {
  //  this.selectedItem = [];
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
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.id = params['id'];
      });
    this.getDiscount(this.id);
    this.getAllCategory()


    this.editDiscountForm = this.fb.group({
      disount: ['', [Validators.required, Validators.min(0)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      type: ['', Validators.required],
      dicountOn:['',],
      name: ['', [Validators.required, Validators.maxLength(25)]],
      name_ar: ['',],
      bannerImage: ['', Validators.required]
    })

  }

  ngAfterViewInit(){

    
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
      this.selectedItem.push(items.id)
    }
  }

  


  getDiscount(id) {
    debugger
    this.apiService.getDisountDetails(id).subscribe(res => {
      if (res.success) {
        this.discountDetails = res.data;
        console.log(this.discountDetails);
        // this.editDiscountForm.controls['dicountOn'].setValue(this.discountDetails.onModel);
        if(this.discountDetails.offer.type==="category"){
         let lookForCategory=[]
          for(let i=0;i<this.discountDetails.offer.list.length;i++){
             lookForCategory.push(this.discountDetails.offer.list[i].id)
           
          }
          this.lookUpForCategory(lookForCategory);
        }
        if(this.discountDetails.offer.type==="subCategory"){
          let lookForSubCategory=[]
          for(let i=0;i<this.discountDetails.offer.list.length;i++){
            lookForSubCategory.push(this.discountDetails.offer.list[i].id)
           
          }
          this.lookUpForSubCategory(lookForSubCategory,this.discountDetails.category);
        }
        if(this.discountDetails.offer.type==="seller"){
          let lookForVendor=[]
          for(let i=0;i<this.discountDetails.offer.list.length;i++){
            lookForVendor.push(this.discountDetails.offer.list[i].id)
           
          }

          this.lookUpForVendor(lookForVendor);
        }
        if(this.discountDetails.offer.type==="seller"){
          let lookForProduct=[]
          for(let i=0;i<this.discountDetails.offer.list.length;i++){
            lookForProduct.push(this.discountDetails.offer.list[i].id)
           
          }
          this.lookUpForProduct(lookForProduct);
        }
        
        



        this.editDiscountForm.controls['endDate'].setValue(this.discountDetails.endDate);
        this.editDiscountForm.controls['type'].setValue(this.discountDetails.type);
        this.editDiscountForm.controls['startDate'].setValue(this.discountDetails.startDate);
        this.editDiscountForm.controls['disount'].setValue(this.discountDetails.discount);
        this.editDiscountForm.controls['name_ar'].setValue(this.discountDetails.name_ar);
        this.editDiscountForm.controls['name'].setValue(this.discountDetails.name);
        // this.editDiscountForm.controls['dicountOn'].setValue(this.discountDetails.onModel);
        // this.editDiscountForm.controls['dicountOn'].setValue(this.discountDetails.onModel);
        this.setradio(this.discountDetails.offer.type);
        this.previewImage = this.discountDetails.image
      }
    })



  }

  lookUpForCategory(l){
    console.log(l)
  }

  lookUpForSubCategory(ls,la){
  
    console.log(la)
  }
  lookUpForVendor(ls){
    console.log(ls);

  }
  lookUpForProduct(ls){
console.log(ls)
  }

  getAllCategory() {
    debugger
    this.categoryList = []
    let temp=[]
    this.apiService.getAllCategoriesForDiscount(this.parentId).subscribe(res => {
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
      this.categoryList=temp

    });
  }

  selectedCategory = ''
  categorySelected(id) {
    console.log("category :", id);
    this.selectedCategory = id;
    this.getAllSubcategory(id);
  }

  getAllSubcategory(id) {
    let temp=[]
    this.subCategoryList = []
    if (this.selectedCategory) {
      this.apiService.getAllCategoriesForDiscount(id).subscribe(res => {
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
        this.subCategoryList= temp
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
    }  }


  getAllVendor() {
    this.vendorList = []
    let temp=[]
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
                'firstname': res.data[i].firstName,
                'lastname': res.data[i].lastName
              }
              temp.push(body)
            }
          }
        }
        this.vendorList= temp;
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
    this.productList = [];
    let temp=[]
    if (this.selectedVendor) {
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
        this.productList=temp
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
    console.log(this.editDiscountForm);
    let checkOffer = this.editDiscountForm.controls['dicountOn'].value;
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
        }      }
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
    if (checkOffer == 'vendor') {
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

    let startDate = moment().toISOString(this.editDiscountForm.controls['startDate'].value);
    let endDate = moment().toISOString(this.editDiscountForm.controls['endDate'].value)
    let offer = {
      'list': selectedCategoryItem, 'type': checkOffer
    }

    const body = new FormData();
    body.append('name', this.editDiscountForm.controls['name'].value);
    body.append('name_ar', this.editDiscountForm.controls['name_ar'].value);
    body.append('image', this.imageFile, this.imageFile.name);
    body.append('type', this.editDiscountForm.controls['type'].value);
    body.append('discount', this.editDiscountForm.controls['disount'].value);
    body.append('offer', JSON.stringify(offer));
    body.append('startDate', startDate);
    body.append('endDate', endDate)


    this.editbanner(body);
  }


  typeSubcategory(checkOffer,selectedSubcategoryItem) {

    let startDate = moment().toISOString(this.editDiscountForm.controls['startDate'].value);
    let endDate = moment().toISOString(this.editDiscountForm.controls['endDate'].value)
    let offer = {
      'list': selectedSubcategoryItem, 'type': checkOffer
    }

    const body = new FormData();
    body.append('category', this.selectedCategory)
    body.append('name', this.editDiscountForm.controls['name'].value);
    body.append('name_ar', this.editDiscountForm.controls['name_ar'].value);
    body.append('image', this.imageFile, this.imageFile.name);
    body.append('type', this.editDiscountForm.controls['type'].value);
    body.append('discount', this.editDiscountForm.controls['disount'].value);
    body.append('offer', JSON.stringify(offer));
    body.append('startDate', startDate);
    body.append('endDate', endDate);

    this.editbanner(body);
  }
  typeVendor(checkOffer,selectedVendorItem) {

    let startDate = moment().toISOString(this.editDiscountForm.controls['startDate'].value);
    let endDate = moment().toISOString(this.editDiscountForm.controls['endDate'].value)
    let offer = {
      'list': selectedVendorItem, 'type': 'seller'
    }

    const body = new FormData();
    body.append('category', this.selectedCategory);
    body.append('subCategory', this.selectedSubCategory);
    body.append('name', this.editDiscountForm.controls['name'].value);
    body.append('name_ar', this.editDiscountForm.controls['name_ar'].value);
    body.append('image', this.imageFile, this.imageFile.name);
    body.append('type', this.editDiscountForm.controls['type'].value);
    body.append('discount', this.editDiscountForm.controls['disount'].value);
    body.append('offer', JSON.stringify(offer));
    body.append('startDate', startDate);
    body.append('endDate', endDate);

    this.editbanner(body);
  }
  typeProduct(checkOffer,selectedItem) {

    let startDate = moment().toISOString(this.editDiscountForm.controls['startDate'].value);
    let endDate = moment().toISOString(this.editDiscountForm.controls['endDate'].value)
    let offer = {
      'list': selectedItem, 'type': checkOffer
    }

    const body = new FormData();
    body.append('category', this.selectedCategory);
    body.append('subCategory', this.selectedSubCategory);
    body.append('name', this.editDiscountForm.controls['name'].value);
    body.append('name_ar', this.editDiscountForm.controls['name_ar'].value);
    body.append('image', this.imageFile, this.imageFile.name);
    body.append('type', this.editDiscountForm.controls['type'].value);
    body.append('discount', this.editDiscountForm.controls['disount'].value);
    body.append('offer', JSON.stringify(offer));
    body.append('startDate', startDate);
    body.append('endDate', endDate);

    this.editbanner(body);
  }



  editbanner(body) {
    //  console.log(body)
    body.forEach((value, key) => {
      console.log(key + " " + value)
    });

    // this.apiService.addBanner(body).subscribe(res => {
    //   console.log(res)
    //   if (res.success) {
    //     this.router.navigateByUrl('offerdeals');
    //   }
    // })


  }

  goToofferdeals() {
    this.router.navigate(['offerdeals'])
  }

}
