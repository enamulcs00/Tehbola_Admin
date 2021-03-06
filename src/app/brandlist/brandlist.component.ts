import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/services/api.service';
import { CommonService } from 'src/services/common.service';
import Swal from 'sweetalert2';
import { UrlService } from 'src/services/url.service';
import { PageEvent } from '@angular/material/paginator';



interface rawItemtype {
  value: string,
  viewValue: string,
}

@Component({
  selector: 'app-brandlist',
  templateUrl: './brandlist.component.html',
  styleUrls: ['./brandlist.component.scss']
})
export class BrandlistComponent implements OnInit {

  addBrandForm: FormGroup;
  editBrandForm: FormGroup
  submitted: boolean
  brandList = []
  result: import("sweetalert2").SweetAlertResult<unknown>;
  editableBrandId: any;

  count: any;
  page = 1;
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent;
  imageUrl: string;
  categoryList: any;
  subcategoryList: any;
  imageFile: any = [];
  id: any;
  flagImage: boolean;
  rawFoodItemType: Array<rawItemtype> = [{
    value: 'rawFoodItem',
    viewValue: 'Raw Food Item'
  },
  {
    value: 'toppings',
    viewValue: 'Toppings'
  },
  {
    value: 'flavour',
    viewValue: 'Flavour'
  },
  {
    value: 'container',
    viewValue: 'Container'
  },
  {
    value: 'wearable',
    viewValue: 'Wearable'
  },


  ]
  previewImage: any;
  brandImage: any;
  picUploader: boolean;
  progress: boolean;
  gram: boolean;
  litre: boolean;
  search: string = '';
  flagSearch: boolean = true;
  flagUserList: boolean;
  user: any;
  constructor(private apiService: ApiService, private fb: FormBuilder, private commonService: CommonService, private urlService: UrlService) {
    this.user = JSON.parse(this.apiService.getUser())
    this.getBrandList()
    this.getCategoryList()
    
    this.imageUrl = this.urlService.imageUrl;
  }

  ngOnInit() {
    this.addBrandForm = this.fb.group({
      name: ['', [Validators.required,]],
      name_ar: ['', [Validators.required,]],
      type: ['', [Validators.required,]],

      category: ['', [Validators.required,]],
      subCategory: ['', [Validators.required]],
      image: ['', [Validators.required]],
      totalUnits: ['', [Validators.required, Validators.min(0)]],
      unitPrice: ['', [Validators.required, Validators.min(0)]],
      quantityPerUnit: ['', [Validators.required, Validators.min(0)]],
      measureTypeUnit: ['', Validators.required],
      measureTypeServing: ['', Validators.required],
      perServingSize: ['', [Validators.required, Validators.min(0)]],
      description: [''],
    });
    this.editBrandForm = this.fb.group({
      name: ['', [Validators.required,]],
      name_ar: ['', [Validators.required,]],
      type: ['', [Validators.required,]],
      category: ['', [Validators.required,]],
      subCategory: ['', [Validators.required]],
      image: ['',],
      totalUnits: ['', [Validators.required, Validators.min(0)]],
      unitPrice: ['', [Validators.required, Validators.min(0)]],
      quantityPerUnit: ['', [Validators.required, Validators.min(0)]],
      measureTypeUnit: ['', Validators.required],
      measureTypeServing: ['', Validators.required],
      perServingSize: ['', [Validators.required, Validators.min(0)]],
      description: [''],
    })
  }


  searchMethod() {
    this.flagSearch = false


    this.getBrandList()
  }

  clearSearch() {
    this.flagSearch = true
    this.search = ''
    this.getBrandList()

  }


  getBrandList() {
    //Pagination is applied in the backend. just not using in the front end because of design same as category
    this.progress = true
    this.apiService.getRawItemList(this.page, this.pageSize, this.search).subscribe(res => {

      if (res.success) {
        this.progress = false

        this.brandList = res.data
        this.length = res.total
      } else {
        this.progress = false
        this.commonService.errorToast(res.message)
      }
    })
  }

  rawListAfterPageSizeChanged(e): any {

    this.pageSize = e.pageSize
    if (e.pageIndex == 0) {
      this.page = 1;
      // this.page = e.pageIndex;
      //  this.srNo = e.pageIndex * e.pageSize
      this.flagUserList = false
    } else {
      if (e.previousPageIndex < e.pageIndex) {
        this.page = e.pageIndex + 1;

        this.flagUserList = true
      } else {
        this.page = e.pageIndex;

        this.flagUserList = true
      }

    }
    this.getBrandList()
  }


  unitSelected(e) {
    if (!this.id) {
      if (e == 'kg' || e == 'g') {
        this.gram = true
        this.litre = false
        this.addBrandForm.get('perServingSize').reset()
      } else {
        this.litre = true
        this.gram = false
        this.addBrandForm.get('perServingSize').reset()
      }
    } else {
      if (e == 'kg' || e == 'g') {
        this.gram = true
        this.litre = false
      } else {
        this.litre = true
        this.gram = false
      }
    }
  }

  getCategoryList() {
    this.apiService.getAllCategories().subscribe(res => {

      if (res.success == true) {

        this.categoryList = res.data
      }
    })
  }


  categorySelected(e) {


    // let id = e
    this.apiService.getSubcategoryList(e).subscribe(res => {

      if (res.success == true) {
        this.editBrandForm.get('subCategory').reset()

        this.subcategoryList = res.data
      }
    })

  }

  async profilePic(event) {

    this.imageFile = []
    this.picUploader = true

    {

      let imageOk: boolean = true
      var img = new Image;
      let sefl = this
      let tempfile: any
      if (event.target.files && event.target.files[0]) {
        var filesAmount = event.target.files.length;
        for (let i = 0; i < filesAmount; i++) {

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

              if (this.id) {

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
                  this.flagImage = true;
                  this.brandImage = ''
                  this.previewImage = temp;
                  this.imageFile.push(tempfile);
                  this.editBrandForm.controls['image'].setValue(temp.name);
                  return imageOk
                }
              } else {
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
                  this.brandImage = temp;
                  this.imageFile.push(tempfile);
                  this.addBrandForm.controls['image'].setValue(temp.name);
                  return imageOk
                }
              }
            };
          }
        }
      }
    }
  }

  editBrand(id) {
    this.id = id
    this.previewImage = ''
    this.brandImage = ''
    this.apiService.viewBrand(id).subscribe((res) => {
      if (res.data) {
        this.flagImage = false;
        this.apiService.getSubcategoryList(res.data.category._id).subscribe(res1 => {


          if (res1.success == true) {


            this.subcategoryList = res1.data


            this.editableBrandId = res.data._id
            this.editBrandForm.controls['name'].setValue(res.data.name);

            this.editBrandForm.controls['name_ar'].setValue(res.data.name_ar);
            this.editBrandForm.controls['type'].setValue(res.data.type);
            this.editBrandForm.controls['category'].setValue(res.data.category.id);
            let selectedCategory = []
            for (let i in res.data.subCategory) {
              selectedCategory.push(res.data.subCategory[i]._id)
            }
            this.editBrandForm.controls['subCategory'].setValue(selectedCategory);
            this.editBrandForm.controls['image'].setValue(res.data.image.name)
            
            if((res.data.measureTypeUnit==='kg' || res.data.measureTypeUnit==='l')&& res.data.availableQuantityOfUnits){
                let temp=res.data.availableQuantityOfUnits/1000;
                  let temp2=temp/res.data.quantityPerUnit;
                  this.editBrandForm.controls['totalUnits'].setValue(temp2)

            }else if((res.data.measureTypeUnit==='g' || res.data.measureTypeUnit==='ml')&& res.data.availableQuantityOfUnits){

              let temp=res.data.availableQuantityOfUnits;
              let temp2=temp/res.data.quantityPerUnit;
              this.editBrandForm.controls['totalUnits'].setValue(temp2)
            }else{
              this.editBrandForm.controls['totalUnits'].setValue(res.data.totalUnits)
            }
           
            this.editBrandForm.controls['quantityPerUnit'].setValue(res.data.quantityPerUnit)
            this.editBrandForm.controls['measureTypeUnit'].setValue(res.data.measureTypeUnit)
            this.editBrandForm.controls['measureTypeServing'].setValue(res.data.measureTypeServing)
            this.unitSelected(res.data.measureTypeUnit)
            this.editBrandForm.controls['unitPrice'].setValue(res.data.unitPrice)
            this.editBrandForm.controls['perServingSize'].setValue(res.data.perServingSize)
            this.editBrandForm.controls['description'].setValue(res.data.description)


            let data = res.data
            //  this.image = data.image
            this.brandImage = data.image;
            //   this.imageName = data.image.name

          }
        });

      }
    })

  }

  deleteBrand(id) {

    // Swal.clickCancel();
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this Raw Item!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085D6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      allowOutsideClick: false
    }).then(result => {
      if (result.value) {
        this.result = result;

        const data = {
          "id": id,
          "model": "RawItems"
        }


        this.apiService.delete(data).subscribe(res => {

          if (res.success) {
            // this.getAllCategories()
            this.commonService.successToast(res.message);
            this.getBrandList()

          } else {
            this.commonService.errorToast(res.message)
          }

        });
      } else {

      }
    });

  }


  onAddBrand() {

    this.submitted = true
    if (this.submitted && this.addBrandForm.valid && this.imageFile.length > 0) {
      let body = this.addBrandForm.value
      let formData = new FormData();
      formData.append('name', this.addBrandForm.get('name').value);
      formData.append('name_ar', this.addBrandForm.get('name_ar').value);
      formData.append('type', this.addBrandForm.get('type').value);
      formData.append('category', this.addBrandForm.get('category').value);
      formData.append('subCategory', JSON.stringify(this.addBrandForm.get('subCategory').value));
      formData.append('totalUnits', this.addBrandForm.get('totalUnits').value);
      formData.append('unitPrice', this.addBrandForm.get('unitPrice').value);
      formData.append('quantityPerUnit', this.addBrandForm.get('quantityPerUnit').value)
      formData.append('measureTypeUnit', this.addBrandForm.get('measureTypeUnit').value)
      if(this.addBrandForm.get('measureTypeUnit').value==='kg'  ||  this.addBrandForm.get('measureTypeUnit').value==='l' ){
        let totalQuantityOfUnits= this.addBrandForm.get('totalUnits').value*this.addBrandForm.get('quantityPerUnit').value*1000;
        formData.append('totalQuantityOfUnits', String(totalQuantityOfUnits));
        formData.append('availableQuantityOfUnits', String(totalQuantityOfUnits));
      }else if(this.addBrandForm.get('measureTypeUnit').value==='g'  ||  this.addBrandForm.get('measureTypeUnit').value==='ml'){
        let totalQuantityOfUnits= this.addBrandForm.get('totalUnits').value*this.addBrandForm.get('quantityPerUnit').value;
        formData.append('totalQuantityOfUnits', String(totalQuantityOfUnits));
        formData.append('availableQuantityOfUnits', String(totalQuantityOfUnits));
      }
      formData.append('measureTypeServing', this.addBrandForm.get('measureTypeServing').value)
      formData.append('perServingSize', this.addBrandForm.get('perServingSize').value)
      formData.append('description', this.addBrandForm.get('description').value);
      for (let i = 0; i < this.imageFile.length; i++) {
        formData.append('image', this.imageFile[i], this.imageFile[i].name);
      }
      
      //formData.append('image', new Blob([this.imageFile], { type: 'image/*' }), this.imageFile.name);
      this.progress = true
      this.apiService.addBrand(formData).subscribe(res => {

        if (res.success == true) {
          this.progress = false
          this.commonService.successToast('Successfully Added')
          this.getBrandList()
          this.addBrandForm.reset();
          this.imageFile = []
          this.brandImage = ''
          this.submitted = false
        } else {
          this.progress = false
          this.commonService.errorToast(res.message)
          this.submitted = false
        }
      })
    } else {
      this.commonService.errorToast('Failed to add the Item.')
    }

  }

  cancelClicked() {
    this.addBrandForm.reset();
    this.editBrandForm.reset();
    this.imageFile = ''
    this.brandImage = ''
    this.previewImage = ''
    this.id = ''

  }

  onUpdateBrand() {
    this.submitted = true
    if (this.submitted && this.editBrandForm.valid) {
      let formData = new FormData();
      formData.append('id', this.editableBrandId)
      formData.append('name', this.editBrandForm.get('name').value);
      formData.append('name_ar', this.editBrandForm.get('name_ar').value);
      formData.append('type', this.editBrandForm.get('type').value);
      formData.append('category', this.editBrandForm.get('category').value);
      formData.append('subCategory', JSON.stringify(this.editBrandForm.get('subCategory').value));
      formData.append('totalUnits', this.editBrandForm.get('totalUnits').value);
      formData.append('unitPrice', this.editBrandForm.get('unitPrice').value);
      formData.append('quantityPerUnit', this.editBrandForm.get('quantityPerUnit').value)
      formData.append('measureTypeUnit', this.editBrandForm.get('measureTypeUnit').value)
      formData.append('measureTypeServing', this.editBrandForm.get('measureTypeServing').value)
      if(this.editBrandForm.get('measureTypeUnit').value==='kg'  ||  this.editBrandForm.get('measureTypeUnit').value==='l' ){
        let totalQuantityOfUnits= this.editBrandForm.get('totalUnits').value*this.editBrandForm.get('quantityPerUnit').value*1000;
        formData.append('totalQuantityOfUnits', String(totalQuantityOfUnits));
         formData.append('availableQuantityOfUnits', String(totalQuantityOfUnits));
      }else if(this.editBrandForm.get('measureTypeUnit').value==='g'  ||  this.editBrandForm.get('measureTypeUnit').value==='ml'){
        let totalQuantityOfUnits= this.editBrandForm.get('totalUnits').value*this.editBrandForm.get('quantityPerUnit').value;
        formData.append('totalQuantityOfUnits', String(totalQuantityOfUnits));
         formData.append('availableQuantityOfUnits', String(totalQuantityOfUnits));
      }
      formData.append('perServingSize', this.editBrandForm.get('perServingSize').value)
      formData.append('description', this.editBrandForm.get('description').value);
      for (let i = 0; i < this.imageFile.length; i++) {
        formData.append('image', this.imageFile[i], this.imageFile[i].name);
      }
      this.progress = true
      this.apiService.editBrand(formData).subscribe(res => {

        if (res.success == true) {
          this.progress = false
          this.commonService.successToast('Successfully Edited')
          this.getBrandList()
          this.imageFile = ''
          this.brandImage = ''
          this.submitted = false
        } else {
          this.progress = false
          this.commonService.errorToast(res.message)
          this.submitted = false
        }
      })
    } else {
      this.commonService.errorToast('Failed to update Raw Item')
    }

  }



  back() {
    window.history.back()
  }
}
