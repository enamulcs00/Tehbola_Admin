import { MatSlideToggleChange } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormArray, FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { MoreThan } from 'src/services/moreThanValidator';
import { CommonService } from 'src/services/common.service';
import { ApiService } from 'src/services/api.service';
import { UrlService } from 'src/services/url.service';
import { async } from 'rxjs/internal/scheduler/async';
declare var $: any;

interface teaTypeModel {
  name: string;
  id: string;
}

interface sugarLevelModel {
  name: string;
  id: string;
}

interface sizerModel {
  name: string;
  id: string;
}
@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {
  name = 'Angular 4';
  urls = [];
  editProductForm: FormGroup
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
  vendorList: any;
  length: any;
  showCelebrity: boolean;
  showMerchant: boolean;
  user: any;
  sellerId: any;
  selectedSubcategory = [];
  productId: string;
  sub: any;
  id: any;
  sellerDetails: any;
  imageURl: string;
  flagImageEditted: boolean;
  previewImage: any;
  tempSelectedCategoryId: any;
  progress: boolean;
  productData: any;
  sizeList: Array<sizerModel> = [];
  teaTypeList: Array<teaTypeModel> = [];
  sugarLevelList: Array<sugarLevelModel> = [];




  constructor(private router: Router, private apiService: ApiService, private route: ActivatedRoute,
    private commonService: CommonService, private urlService: UrlService, private fb: FormBuilder) {

    this.user = JSON.parse(sessionStorage.getItem('Markat_User'))
    this.imageURl = this.urlService.imageUrl


    this.sub = this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.id = params['id'];

      });
    this.getRawItemList();
    this.getAllCategory();
    this.getTeaList();
    this.getSizeList();
    this.getSugarLevelList();
  }

  ngOnInit() {
    this.getProduct(this.id)

    $('.genral_product').hide();
    $('.genral_product.active_product').show();

    $('.add_product_list').click(function () {
      $('.genral_product').hide();
      $('.genral_product.active_product').hide();
      var product_rel = $(this).attr('rel');
      $('#' + product_rel).show();
    });


    this.editProductForm = this.fb.group({
      name: ['', [Validators.required,]],
      name_ar: ['', Validators.required],
      category: ['', Validators.required],
      subCategory: ['', Validators.required],
      purchaseQuantity: ['', [Validators.required, Validators.min(0)]],
      discount: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      teaType: [''],
      sugarLevel: ['',],
      highlights: ['',],
      highlights_ar: [''],
      // price: ['', [Validators.required, Validators.min(1)]],
      description: ['', [Validators.required,]],
      description_ar: ['', Validators.required],
      image: ['',],
      sizePrice: this.fb.array([], Validators.required),
      specification: this.fb.array([]),
      aliases: this.fb.array([
        this.fb.control('')
      ]),
      tahbolaSpecial : [false]
    }
    )



  }
  onChange($event: MatSlideToggleChange) {
    
    this.editProductForm.controls['tahbolaSpecial'].setValue($event.checked);
    console.log(this.editProductForm.value);
}
  getProduct(id) {
    this.progress = true
    this.apiService.viewProduct(id).subscribe(res => {
      if (res.success) {

        console.log(res.data);
        this.productData = res.data
        this.setValue(this.productData)
      } else {
        this.progress = false
        this.commonService.errorToast(res.message)
      }
    })


  }
  setValue(data: any) {

    this.selectedCategory = data.category._id
    this.getAllSubcategory(this.selectedCategory);
    this.productId = data.id
    this.editProductForm.get('name').setValue(data.name);
    this.editProductForm.get('name_ar').setValue(data.name_ar);
    this.editProductForm.get('purchaseQuantity').setValue(data.purchaseQuantity);
    this.editProductForm.get('discount').setValue(data.discount);
    this.editProductForm.get('highlights').setValue(data.highlights);
    this.editProductForm.get('highlights_ar').setValue(data.highlights_ar);
    //  this.editProductForm.get('price').setValue(data.price);
    this.editProductForm.get('tahbolaSpecial').setValue(data.tahbolaSpecial);
    this.editProductForm.get('category').setValue(data.category._id);
    let temp2 = []
    data.teaType.forEach(element => {
      temp2.push(element)
    });

    this.editProductForm.get('teaType').setValue(temp2);
    let temp = []
    data.sugarLevel.forEach(element => {
      temp.push(element)
    });
    this.editProductForm.get('sugarLevel').setValue(temp);

    this.editProductForm.get('description').setValue(data.description);
    this.editProductForm.get('description_ar').setValue(data.description_ar);
    this.setSpecifications(data.rawItems)
    this.setSearchKeywords(data.searchKeyword)
    this.setSizePrize(data.size)
    this.previewImage = data.images;
    this.progress = false
  }



  specification(): FormArray {
    return this.editProductForm.get('specification') as FormArray;
  }
  get aliases() {
    return this.editProductForm.get('aliases') as FormArray;
  }


  newSpecifiaction(): FormGroup {
    return this.fb.group({
      rawItem: new FormControl('', Validators.required),
      quantity: new FormControl('', [Validators.required, Validators.min(0)])
    })
  }
  addAlias() {
    this.aliases.push(this.fb.control(''));
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


  deleteLocally(i) {
    this.urls.splice(i, 1)
  }

  deletePhoto(imagePath) {

    let body = {
      imageId: imagePath
    }
    this.apiService.deleteImage(body).subscribe(res => {
      // this.commonService.successToast("Image Deleted")
      this.getProduct(this.id)
    })

  }


  getSizeList() {

    this.apiService.getSizeList().subscribe(res => {
      res.data.forEach(element => {
        this.sizeList.push({
          id: element._id,
          name: element.name,

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

        })
      });
    })
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


  setSpecifications(specification) {
    const formArray = new FormArray([]);
    for (let x of specification) {
      formArray.push(this.fb.group({
        rawItem: x.rawItem._id,
        quantity: x.quantity
      }));
    }
    this.editProductForm.setControl('specification', formArray)
  }



  setSizePrize(specification) {
    const formArray = new FormArray([]);
    for (let x of specification) {
      formArray.push(this.fb.group({
        id: x.id,
        price: x.price
      }));
    }
    this.editProductForm.setControl('sizePrice', formArray)
  }



  sizePrice(): FormArray {
    return this.editProductForm.get('sizePrice') as FormArray
  }

  newSizePrice(): FormGroup {
    return this.fb.group({
      id: new FormControl('', Validators.required),
      price: new FormControl('', [Validators.required, Validators.min(0)])
    })
  }


  addNewSizePrice() {
    this.sizePrice().push(this.newSizePrice())
  }

  removeSize(i: number) {
    this.sizePrice().removeAt(i);
  }



  setSearchKeywords(searchKeywords) {


    this.editProductForm.setControl('aliases', this.fb.array(searchKeywords || []))
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
    this.getBrand(id)
  }


  getAllSubcategory(id) {

    this.selectedSubcategory = []
    let temp = []
    this.subCategoryList = []
    if (this.selectedCategory) {
      this.categoryList.forEach(element => {
        if (element._id === id) {
          this.subCategoryList = element.subCatList
        }
      });
      this.productData.subCategory.forEach(element => {
        this.selectedSubcategory.push(element._id)
      });
      this.editProductForm.get('subCategory').setValue(this.selectedSubcategory);
    } else {
      this.commonService.errorToast("Please Select a category.");

    }

  }
  compareObjects(o1: any, o2: any) {
    if (o1.name == o2.name && o1.id == o2.id)
      return true;
    else return false
  }

  subCategorySelected(id) {


    this.selectedSubcategory = id

  }

  getBrand(id) {

    this.brandList = []
    this.apiService.getBrandListBySubcat(id).subscribe(res => {
      if (res.success) {
        if (res.data) {
          this.brandList = res.data;
        }
      }
    })
  }

  brandSelected(id) {
    this.selectedBrand = id;

  }

  onSubmit() {

    this.submitted = true;

    if (this.submitted && this.editProductForm.valid && (this.previewImage.length > 0 || this.images.length > 0)) {
      const body = new FormData();
      body.append('name', this.editProductForm.controls['name'].value);
      body.append('name_ar', this.editProductForm.controls['name_ar'].value);
      body.append('description', this.editProductForm.controls['description'].value);
      body.append('description_ar', this.editProductForm.controls['description_ar'].value);
      body.append('teaType', JSON.stringify(this.editProductForm.controls['teaType'].value));
      body.append('size', JSON.stringify(this.editProductForm.controls['sizePrice'].value));
      body.append('sugarLevel', JSON.stringify(this.editProductForm.controls['sugarLevel'].value));
      // body.append('price', this.editProductForm.controls['price'].value);
      body.append('category', this.editProductForm.controls['category'].value);
      body.append('subCategory', JSON.stringify(this.editProductForm.controls['subCategory'].value));
      body.append('purchaseQuantity', this.editProductForm.controls['purchaseQuantity'].value);
      body.append('rawItems', JSON.stringify(this.editProductForm.controls['specification'].value));
      body.append('searchKeyword', JSON.stringify(this.editProductForm.controls['aliases'].value));
      for (let i = 0; i < this.images.length; i++) {
        body.append('images', this.images[i], this.images[i].name);
      }
      body.append('highlights', this.editProductForm.controls['highlights'].value)
      body.append('highlights_ar', this.editProductForm.controls['highlights_ar'].value)
      body.append('tahbolaSpecial', JSON.stringify(this.editProductForm.controls['tahbolaSpecial'].value));
      //body.append('tahbolaSpecial', this.editProductForm.controls['tahbolaSpecial'].value)
      body.append('discount', this.editProductForm.controls['discount'].value)

      this.progress = true
      this.apiService.updateProduct(body, this.id).subscribe((res) => {
        if (res.success) {
          console.log(body);
          this.progress = false
          this.commonService.successToast("Product Successfully update")
          this.router.navigate(['/product'])

        } else {
          this.progress = false
          this.commonService.errorToast(res.message)
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
                this.flagImageEditted = true
                this.urls.push(temp);
                this.images.push(tempfile);
                this.editProductForm.controls['image'].patchValue(this.images)
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
    history.back()
  }

}
