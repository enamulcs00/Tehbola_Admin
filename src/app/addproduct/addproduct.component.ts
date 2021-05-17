import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormGroup, FormArray, Validators, FormBuilder, FormControl } from '@angular/forms';
import { ApiService } from 'src/services/api.service';
import { CommonService } from 'src/services/common.service';
import { UrlService } from 'src/services/url.service';
import { MoreThan } from 'src/services/moreThanValidator';
import { validateHorizontalPosition } from '@angular/cdk/overlay';
import { MatSlideToggleChange } from '@angular/material';
declare var $: any;
interface teaTypeModel {
  name: string;
  name_ar: string
  id: string;
}

interface sugarLevelModel {
  name: string;
  name_ar: string
  id: string;
}

interface sizeModel {
  name: string;
  name_ar: string
  id: string;
}


@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.scss']
})
export class AddproductComponent implements OnInit {

  urls = [];
  addProductForm: FormGroup
  images = [];
  parentId = ''
  categoryList: any[];
  selectedCategory: any;
  subCategoryList: any[]
  brandList: any;
  selectedBrand: any;

  submitted: boolean;
  showCommission: boolean = false;
  commission: any;
  tax: any;
  taxId: any;
  applyTax: any;
  vendorList: any;
  length: any;
  showCelebrity: boolean;
  showMerchant: boolean;
  user: any;
  sellerId: any;
  selectedSubcategory: any;
  productId: string;
  sizeList: Array<sizeModel> = [];
  teaTypeList: Array<teaTypeModel> = [];
  sugarLevelList: Array<sugarLevelModel> = [];




  constructor(private router: Router, private apiService: ApiService,
    private commonService: CommonService, private urlService: UrlService, private fb: FormBuilder) {

    this.user = JSON.parse(sessionStorage.getItem('Markat_User'))

    this.getAllCategory()
    this.getRawItemList();
    this.getSizeList();
    this.getSugarLevelList();
    this.getTeaList();


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


    this.addProductForm = this.fb.group({

      name: ['', [Validators.required,]],
      name_ar: ['', Validators.required],
      category: ['', Validators.required],
      subCategory: ['', Validators.required],
      purchaseQuantity: ['', [Validators.required, Validators.min(0)]],
      discount: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      teaType: [''],
      sugarLevel: ['',],
      //  size: ['', Validators.required],
      highlights: ['',],
      highlights_ar: [''],
      // price: ['', [Validators.required, Validators.min(1)]],
      description: ['', [Validators.required,]],
      description_ar: ['', Validators.required],
      image: ['', [Validators.required]],
      specification: this.fb.array([], Validators.required),
      sizePrice: this.fb.array([], Validators.required),
      aliases: this.fb.array([
        this.fb.control('', Validators.required)
      ]),
      tabolaSpecial :[false]
    })



  }
  
  onChange($event: MatSlideToggleChange) {
    
    this.addProductForm.controls['tabolaSpecial'].setValue($event.checked);
    console.log(this.addProductForm.value);
}
  getTax() {

    this.apiService.getTax().subscribe(res => {

      if (res.success) {
        this.tax = res.data[0].tax
        this.taxId = res.data[0]._id
        this.applyTax = res.data[0].taxApplicable
      }
    })
  }
  specification(): FormArray {
    return this.addProductForm.get('specification') as FormArray;
  }



  get aliases() {
    return this.addProductForm.get('aliases') as FormArray;
  }


  newSpecifiaction(): FormGroup {

    return this.fb.group({
      rawItem: new FormControl('', Validators.required),
      size: this.fb.array(this.loadSize())

    })
  }


  setSizeArray() { }
  sizeQuantity(): FormArray {
    return this.specification().get("size") as FormArray
  }


  loadSize(): any {
    let controls = [];
    let controlsList = this.sizePrice().value
    for (let y in controlsList) {
      controls.push(new FormGroup({
        id: new FormControl(controlsList[y].id),
        rawitemSizeQuantity: new FormControl('', [Validators.required])
      }))
    }
    return controls;
  }




  sizePrice(): FormArray {
    return this.addProductForm.get('sizePrice') as FormArray
  }

  newSizePrice(): FormGroup {
    return this.fb.group({
      id: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required)
    })
  }


  addNewSizePrice() {
    this.sizePrice().push(this.newSizePrice())
  }

  removeSize(i: number) {
    this.sizePrice().removeAt(i);

  }

  addAlias() {
    this.aliases.push(this.fb.control(''));
  }




  addNewSpecification() {
    this.specification().push(this.newSpecifiaction())
  }


  removeSpecification(i: number) {
    this.specification().removeAt(i);


  }




  removeSearchKeywords(i: number) {
    this.aliases.removeAt(i);

  }



  getAllCategory() {


    this.categoryList = []

    this.apiService.getCategoryList().subscribe(res => {

      if (res.success) {

        if (res.data) {
          this.categoryList = res.data
        }
      }

    }
    );
  }

  categorySelected(id) {

    this.selectedCategory = id
    this.getAllSubcategory(id);

  }

  getRawItemList() {
    //Pagination is applied in the backend. just not using in the front end because of design same as category
    // this.progress = true
    this.apiService.getRawItemList(1, 10000000, '').subscribe(res => {

      if (res.success) {
        this.progress = false

        this.brandList = res.data
      } else {
        this.progress = false
        this.commonService.errorToast(res.message)
      }
    })
  }



  getSizeList() {

    this.apiService.getSizeList().subscribe(res => {

      res.data.forEach(element => {
        this.sizeList.push({
          id: element._id,
          name: element.name,
          name_ar: element.name_ar
        })
      });

    })
  }

  getTeaList() {
    this.apiService.getTeaList().subscribe(res => {

      res.data.forEach(element => {
        this.teaTypeList.push({
          id: element._id,
          name: element.name,
          name_ar: element.name_ar
        })
      });

    })
  }

  getSugarLevelList() {
    this.apiService.getSugarLevelList().subscribe(res => {

      res.data.forEach(element => {
        this.sugarLevelList.push({
          id: element._id,
          name: element.name,
          name_ar: element.name_ar
        })
      });
    })
  }


  getAllSubcategory(id) {

    let temp = []
    this.subCategoryList = []
    if (this.selectedCategory) {
      this.categoryList.forEach(element => {
        if (element._id === id) {
          this.subCategoryList = element.subCatList
        }
      });
    } else {
      this.commonService.errorToast("Please Select a category.");

    }

  }

  subCategorySelected(id) {



    this.selectedSubcategory = id

  }



  progress: boolean
  onSubmit() {


    this.submitted = true;

    if (this.submitted && this.addProductForm.valid && (this.images.length > 0)) {
      const body = new FormData();
      body.append('name', this.addProductForm.controls['name'].value);
      body.append('name_ar', this.addProductForm.controls['name_ar'].value);
      body.append('description', this.addProductForm.controls['description'].value);
      body.append('description_ar', this.addProductForm.controls['description_ar'].value);
      body.append('sugarLevel', JSON.stringify(this.addProductForm.controls['sugarLevel'].value));
      body.append('teaType', this.addProductForm.controls['teaType'].value ? JSON.stringify(this.addProductForm.controls['teaType'].value) : JSON.stringify([]));
      body.append('size', JSON.stringify(this.addProductForm.controls['sizePrice'].value));
      body.append('category', this.addProductForm.controls['category'].value);
      body.append('subCategory', JSON.stringify(this.addProductForm.controls['subCategory'].value));
      body.append('purchaseQuantity', this.addProductForm.controls['purchaseQuantity'].value);
      body.append('rawItems', JSON.stringify(this.addProductForm.controls['specification'].value));
      body.append('searchKeyword', JSON.stringify(this.addProductForm.controls['aliases'].value));
      for (let i = 0; i < this.images.length; i++) {
        body.append('images', this.images[i], this.images[i].name);
      }
      // body.append('price', this.addProductForm.controls['price'].value)
      body.append('highlights', this.addProductForm.controls['highlights'].value)
      body.append('highlights_ar', this.addProductForm.controls['highlights_ar'].value)
      body.append('discount', this.addProductForm.controls['discount'].value)
      body.append('tehbolaSpecial', this.addProductForm.controls['tabolaSpecial'].value)

      this.progress = true
      this.apiService.AddProduct(body).subscribe((res) => {
        if (res.success) {
          this.commonService.successToast("Product Successfully added")
          this.router.navigate(['/product'])

          this.progress = false
        } else {
          this.commonService.errorToast(res.message)
          this.progress = false
        }
      })
    }
  }
  goToproduct() {
    this.router.navigate(['/product'])
  }

  readUrl(event: any) {

    let imageOk: boolean = true
    var img = new Image;
    let sefl = this
    let tempfile: any
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        if (this.images.length <= 4) {
          let name = event.target.files[i].name;
          tempfile = event.target.files[i]


          var reader = new FileReader();
          let toasterService = this.commonService

          reader.readAsDataURL(event.target.files[i])
          reader.onload = (event: any) => {
            img.src = event.target.result;


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
                this.images.push(tempfile);
                this.addProductForm.controls['image'].patchValue(this.images)
                return imageOk
              }

            };
          }
        } else {
          this.commonService.errorToast('Product image limit has been reached')
        }
      }
    }
  }


  back() {
    history.back();
  }

}
