import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormGroup, FormArray, Validators, FormBuilder } from '@angular/forms';
import { ApiService } from 'src/services/api.service';
import { CommonService } from 'src/services/common.service';
import { UrlService } from 'src/services/url.service';
import { MoreThan } from 'src/services/moreThanValidator';
declare var $: any;

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.scss']
})
export class AddproductComponent implements OnInit {
  name = 'Angular 4';
  urls = [];
  addProductForm: FormGroup
  images = [];
  parentId = ''
  categoryList: any[];
  selectedCategory: any;
  subCategoryList: any[];
  brandList: any;
  selectedBrand: any;

  submitted: boolean;
  showCommission: boolean = false;
  commission: any;
  tax: any;
  taxId: any;
  applyTax: any;



  readUrl(event: any) {
    let imageOk: boolean = true
    var img = new Image;
    let sefl = this
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        let name = event.target.files[i].name;
        console.log("check image", event.target.files[i].size);
        var reader = new FileReader();
        let toasterService = this.commonService

        reader.readAsDataURL(event.target.files[i])
        reader.onload = (event: any) => {
          img.src = event.target.result;
          console.log(event.target.result);

          let temp = {
            name: name,
            image: event.target.result
          }

          img.onload = () => {

            var height = img.height;
            var width = img.width;
            if (height != width) {
              toasterService.errorToast("Image should be a Square size");
              imageOk = false
              // this.pushImage();
              return imageOk
            } else {
              toasterService.successToast("Image Size is Ok");
              imageOk = true
              this.urls.push(temp);
              this.images.push(event.target.files[i]);
              this.addProductForm.controls['image'].patchValue(this.images)
              return imageOk
            }

          };
        }
      }
    }
  }


  constructor(private router: Router, private apiService: ApiService,
    private commonService: CommonService, private urlService: UrlService, private fb: FormBuilder) { }


  getTax() {

    this.apiService.getTax().subscribe(res => {
      console.log(res)
      if (res.success) {
        this.tax = res.data[0].tax
        this.taxId = res.data[0]._id
        this.applyTax = res.data[0].taxApplicable
      }
    })
  }

  ngOnInit() {
    this.getTax()
    $('.genral_product').hide();
    $('.genral_product.active_product').show();

    $('.add_product_list').click(function () {
      $('.genral_product').hide();
      $('.genral_product.active_product').hide();
      var product_rel = $(this).attr('rel');
      $('#' + product_rel).show();
    });
    this.getAllCategory();
    this.getBrand();

    this.addProductForm = this.fb.group({
      name: ['', [Validators.required,]],
      name_ar: ['', Validators.required],
      category: ['', Validators.required],
      subCategory: ['', Validators.required],
      skuNumber: ['', [Validators.required, Validators.min(0)]],
      isbnNumber: ['', [Validators.required, Validators.min(0)]],
      quantity: ['', [Validators.required, Validators.min(0)]],
      normalStock: ['', [Validators.required, Validators.min(0)]],
      overStock: ['', [Validators.required, Validators.min(0)]],
      purchaseQuantity: ['', [Validators.required, Validators.min(0)]],
      discount: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      highlights: ['',],
      highlights_ar: [''],

      isfeatured: ['', Validators.required],
      brand: ['', [Validators.required,]],
      price: ['', [Validators.required, Validators.min(0)]],
      description: ['', [Validators.required,]],
      description_ar: ['', Validators.required],
      image: ['', [Validators.required]],
      // isbnNumber: ['', [Validators.required, Validators.min(0)]],
      // isbnNumber: ['', [Validators.required, Validators.min(0)]],
      specification: this.fb.array([]),
      trustedShipping: [false],
      easyReturn: [false],
      secureShopping: [false],
      specification_ar: this.fb.array([]),
      aliases: this.fb.array([
        this.fb.control('')
      ])
    },
      {
        validator: MoreThan('quantity', 'purchaseQuantity')
      }
    )



  }
  specification(): FormArray {
    return this.addProductForm.get('specification') as FormArray;
  }
  get aliases() {
    return this.addProductForm.get('aliases') as FormArray;
  }

  specification_ar(): FormArray {
    return this.addProductForm.get('specification_ar') as FormArray;
  }
  newSpecifiaction(): FormGroup {
    return this.fb.group({
      title: '',
      value: ''
    })
  }
  addAlias() {
    this.aliases.push(this.fb.control(''));
  }

  newSpecifiaction_ar(): FormGroup {
    return this.fb.group({
      title: '',
      value: ''
    })
  }
  addNewSpecification_ar() {
    this.specification_ar().push(this.newSpecifiaction_ar())
  }
  addNewSpecification() {
    this.specification().push(this.newSpecifiaction())
  }

  // addNewSearchKeywrods() {
  //   this.seacrhKeywords().push(this.newSearchKeywords())
  // }
  removeSpecification(i: number) {
    this.specification().removeAt(i);

  }

  removeSearchKeywords(i: number) {
    this.aliases.removeAt(i);

  }
  removeSpecification_ar(i: number) {
    this.specification_ar().removeAt(i);

  }


  getAllCategory() {

    let temp = []
    this.categoryList = []

    // this.apiService.getAllCategoriesForProduct(this.parentId).subscribe(res => {

    //   if (res.success) {

    //     console.log(res)
    //     if (res.data) {
    //       for (let i = 0; i < res.data.length; i++) {
    //         let body = {
    //           'id': res.data[i].id,
    //           'name': res.data[i].name,
    //           'commission': res.data[i].commission
    //         }
    //         temp.push(body);

    //       }

    //     }
    //   }
    // });

    this.categoryList = temp;

  }

  categorySelected(id) {

    this.selectedCategory = id;
    this.commission = this.categoryList.find(ele => ele.id === id);
    Swal.fire({
      title: "Are you sure?",
      text: "This category will add " + this.commission.commission + "%  Commission in your base price",
      icon: "question",
      showCancelButton: false,
      confirmButtonColor: "#3085D6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",

      allowOutsideClick: true
    }).then(result => {
      if (result.value) {
        console.log(result)
        //  let id: any
        this.showCommission = true

      } else {

      }

    });




    this.getAllSubcategory(id);
  }


  getAllSubcategory(id) {

    let temp = []
    this.subCategoryList = []
    if (this.selectedCategory) {
      // this.apiService.getAllCategoriesForProduct(id).subscribe(res => {
      //   if (res.success) {

      //     console.log(res)
      //     if (res.data) {

      //       for (let i = 0; i < res.data.length; i++) {
      //         let body = {
      //           'id': res.data[i].id,
      //           'name': res.data[i].name
      //         }
      //         temp.push(body)
      //       }

      //     }
      //   }
      //   this.subCategoryList = temp;
      // });

    } else {
      this.commonService.errorToast("Please Select a category.");

    }

  }

  getBrand() {
    let temp = []
    this.brandList = []
    // this.apiService.getBrand().subscribe(res => {
    //   if (res.success) {
    //     console.log(res)
    //     if (res.data) {

    //       for (let i = 0; i < res.data.length; i++) {
    //         let body = {
    //           'id': res.data[i]._id,
    //           'name': res.data[i].name
    //         }
    //         temp.push(body)
    //       }

    //     }
    //   }
    //   this.brandList = temp;
    // })
  }

  brandSelected(id) {
    this.selectedBrand = id;
    console.log(id);

  }

  onSubmit() {

    console.log("check", this.addProductForm)
    this.submitted = true;

    if (this.submitted && this.addProductForm.valid) {
      const body = new FormData();
      body.append('name', this.addProductForm.controls['name'].value);
      body.append('name_ar', this.addProductForm.controls['name_ar'].value);
      body.append('description', this.addProductForm.controls['description'].value);
      body.append('description_ar', this.addProductForm.controls['description_ar'].value);
      body.append('price', this.addProductForm.controls['price'].value);
      body.append('category', this.addProductForm.controls['category'].value);
      body.append('subCategory', this.addProductForm.controls['subCategory'].value);
      body.append('brand', this.addProductForm.controls['brand'].value);
      body.append('purchaseQuantity', this.addProductForm.controls['purchaseQuantity'].value);
      body.append('productQuantity', this.addProductForm.controls['quantity'].value);
      body.append('normalStock', this.addProductForm.controls['normalStock'].value);
      body.append('overStock', this.addProductForm.controls['overStock'].value);
      body.append('specifications', JSON.stringify(this.addProductForm.controls['specification'].value));
      body.append('trustedShipping', JSON.stringify(this.addProductForm.controls['trustedShipping'].value));
      body.append('easyReturn', JSON.stringify(this.addProductForm.controls['easyReturn'].value));
      body.append('secureShopping', JSON.stringify(this.addProductForm.controls['secureShopping'].value));

      body.append('searchKeyword', JSON.stringify(this.addProductForm.controls['aliases'].value));

      body.append('specifications_ar', JSON.stringify(this.addProductForm.controls['specification_ar'].value));
      for (let i = 0; i < this.images.length; i++) {
        body.append('images', this.images[i], this.images[i].name);
      }
      body.append('highlights', this.addProductForm.controls['highlights'].value)
      body.append('highlights_ar', this.addProductForm.controls['highlights_ar'].value)
      body.append('sku', this.addProductForm.controls['skuNumber'].value)
      body.append('isbn', this.addProductForm.controls['isbnNumber'].value)
      body.append('discount', this.addProductForm.controls['discount'].value)

      body.forEach((value, key) => {
        console.log(key + " " + value)
      });

      // this.apiService.AddProduct(body).subscribe((res) => {
      //   if (res.success) {
      //     this.commonService.successToast("Product Successfully added")
      //     this.router.navigate(['/product'])
      //     console.log(res)
      //   } else {
      //     this.commonService.errorToast(res.message)
      //   }
      // })
    }
  }

  goToproduct() {

    this.router.navigate(['/product'])
  }
}
