import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/services/common.service';
import * as moment from 'moment';
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
  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private apiService: ApiService,
    private commonService: CommonService,
    private urlService: UrlService
  ) {
    this.imageUrl = this.urlService.imageUrl;
    // this.getAllCategory()
  }



  setradio(e: string) {
    debugger
    switch (e) {
      case "category":
        this.dicountOn = "category"
        this.showCategory = true;
        this.showSubcategory = false;
        this.showVendor = false;
        this.showProduct = false
        console.log("category");
        break;
      case "subcategory":
        this.dicountOn = "subcategory"
        this.showCategory = true;
        this.showSubcategory = true;
        this.showVendor = false;
        this.showProduct = false
        console.log("subcategory");
        break;
      case "vendor":
        this.dicountOn = "vendor"
        this.showCategory = true;
        this.showSubcategory = true;
        this.showVendor = true;
        this.showProduct = false
        console.log("vendor");
        break;
      case "product":
        this.dicountOn = "product"
        this.showCategory = true;
        this.showSubcategory = true;
        this.showVendor = true;
        this.showProduct = true
        console.log("product");
        break;
    }
  }

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

      name: ['', [Validators.required, Validators.maxLength(25)]],
      name_ar: ['',],
      bannerImage: ['', Validators.required]
    })

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

  getDiscount(id) {
    debugger
    this.apiService.getDisountDetails(id).subscribe(res => {
      if (res.success) {
        this.discountDetails = res.data;
        console.log(this.discountDetails);
        // this.editDiscountForm.controls['dicountOn'].setValue(this.discountDetails.onModel);

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
    console.log(this.editDiscountForm);
    let checkOffer = this.editDiscountForm.controls['dicountOn'].value;
    if (checkOffer == "category") {
      if (this.submitted && this.editDiscountForm.valid) {


        this.typeCategory(checkOffer);
      }
    }

    if (checkOffer == 'subCategory') {
      if (this.submitted && this.editDiscountForm.valid) {
        this.typeSubcategory(checkOffer)
      }

    }
    if (checkOffer == 'vendor') {
      if (this.submitted && this.editDiscountForm.valid) {
        this.typeVendor(checkOffer);
      }

    }
    if (checkOffer == 'product') {
      if (this.submitted && this.editDiscountForm.valid) {
        this.typeProduct(checkOffer);
      }

    }


  }

  typeCategory(checkOffer) {

    let startDate = moment().toISOString(this.editDiscountForm.controls['startDate'].value);
    let endDate = moment().toISOString(this.editDiscountForm.controls['endDate'].value)
    let offer = {
      'list': [this.selectedCategory], 'type': checkOffer
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


  typeSubcategory(checkOffer) {

    let startDate = moment().toISOString(this.editDiscountForm.controls['startDate'].value);
    let endDate = moment().toISOString(this.editDiscountForm.controls['endDate'].value)
    let offer = {
      'list': [this.selectedSubCategory], 'type': checkOffer
    }

    const body = new FormData();
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
  typeVendor(checkOffer) {

    let startDate = moment().toISOString(this.editDiscountForm.controls['startDate'].value);
    let endDate = moment().toISOString(this.editDiscountForm.controls['endDate'].value)
    let offer = {
      'list': [this.selectedVendor], 'type': checkOffer
    }

    const body = new FormData();
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
  typeProduct(checkOffer) {

    let startDate = moment().toISOString(this.editDiscountForm.controls['startDate'].value);
    let endDate = moment().toISOString(this.editDiscountForm.controls['endDate'].value)
    let offer = {
      'list': [this.selectedProduct], 'type': checkOffer
    }

    const body = new FormData();
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
