import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/services/api.service';
import { CommonService } from 'src/services/common.service';
import Swal from 'sweetalert2';
import { UrlService } from 'src/services/url.service';

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
  page: any;
  count: any;
  imageUrl: string;
  categoryList: any;
  subcategoryList: any;
  imageFile: any;
  id: any;
  flagImage: boolean;
  previewImage: any;
  brandImage: any;
  picUploader: boolean;
  progress: boolean;
  gram: boolean;
  litre: boolean;
  constructor(private apiService: ApiService, private fb: FormBuilder, private commonService: CommonService, private urlService: UrlService) {
    this.getBrandList()
    this.getCategoryList()
    this.imageUrl = this.urlService.imageUrl;
  }

  ngOnInit() {
    this.addBrandForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(25)]],
      name_ar: ['', [Validators.required, Validators.maxLength(25)]],
      category: ['', [Validators.required, Validators.maxLength(25)]],
      subCategory: ['', [Validators.required, Validators.maxLength(25)]],
      image: ['', [Validators.required]],
      totalUnits: ['', Validators.required],
      unitPrice: ['', Validators.required],
      quantityPerUnit: ['', Validators.required],
      measureTypeUnit: ['', Validators.required],
      measureTypeServing: ['', Validators.required],
      perServingSize: ['', Validators.required],
      description: [''],
    });
    this.editBrandForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(25)]],
      name_ar: ['', [Validators.required, Validators.maxLength(25)]],
      category: ['', [Validators.required, Validators.maxLength(25)]],
      subCategory: ['', [Validators.required, Validators.maxLength(25)]],
      image: ['',],
      totalUnits: ['', Validators.required],
      unitPrice: ['', Validators.required],
      quantityPerUnit: ['', Validators.required],
      measureTypeUnit: ['', Validators.required],
      measureTypeServing: ['', Validators.required],
      perServingSize: ['', Validators.required],
      description: [''],
    })
  }

  getBrandList() {
    //Pagination is applied in the backend. just not using in the front end because of design same as category
    this.progress = true
    this.apiService.getRawItemList().subscribe(res => {
      console.log(res)
      if (res.success) {
        this.progress = false
        console.log(res.data);
        this.brandList = res.data
      } else {
        this.progress = false
        this.commonService.errorToast(res.message)
      }
    })
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
      console.log(res)
      if (res.success == true) {
        console.log(res.data);
        this.categoryList = res.data
      }
    })
  }


  categorySelected(e) {

    console.log(e.value);
    // let id = e
    this.apiService.getSubcategoryList(e).subscribe(res => {
      console.log(res)
      if (res.success == true) {
        this.editBrandForm.get('subCategory').reset()
        console.log(res.data);
        this.subcategoryList = res.data
      }
    })

  }

  async profilePic(event) {

    this.picUploader = true
    if (event.target.files && event.target.files[0]) {
      this.imageFile = event.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        if (this.id) {
          this.flagImage = true;
          this.brandImage = ''
          this.previewImage = event.target.result;
          this.editBrandForm.controls['image'].setValue(this.imageFile);
        } else {
          this.brandImage = event.target.result;
          this.addBrandForm.controls['image'].setValue(this.brandImage);

        }

      };
    }
  }

  editBrand(id) {
    this.id = id

    this.apiService.viewBrand(id).subscribe((res) => {
      if (res.data) {
        this.flagImage = false;
        this.apiService.getSubcategoryList(res.data.category._id).subscribe(res => {
          console.log(res)
          if (res.success == true) {
            console.log(res.data);
            this.subcategoryList = res.data
          }
        });
        debugger
        console.log(res)
        this.editableBrandId = res.data._id
        this.editBrandForm.controls['name'].setValue(res.data.name);

        this.editBrandForm.controls['name_ar'].setValue(res.data.name_ar);
        this.editBrandForm.controls['category'].setValue(res.data.category.id);
        let selectedCategory = []
        for (let i in res.data.subCategory) {

          selectedCategory.push(res.data.subCategory[i]._id)
        }
        this.editBrandForm.controls['subCategory'].setValue(selectedCategory);
        this.editBrandForm.controls['image'].setValue(res.data.image.name)
        this.editBrandForm.controls['totalUnits'].setValue(res.data.totalUnits)
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
        //  console.log(this.image);
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
        console.log(id)
        const data = {
          "id": id,
          "model": "RawItems"
        }

        console.log(data)
        this.apiService.delete(data).subscribe(res => {
          console.log(res);
          if (res.success) {
            // this.getAllCategories()
            this.commonService.successToast(res.message);
            this.getBrandList()

          } else {
            this.commonService.errorToast(res.message)
          }

        });
      } else {
        console.log("cancelled");
      }
    });

  }


  onAddBrand() {
    debugger
    this.submitted = true
    if (this.submitted && this.addBrandForm.valid) {
      let body = this.addBrandForm.value
      console.log(body);

      let formData = new FormData();
      formData.append('name', this.addBrandForm.get('name').value);
      formData.append('name_ar', this.addBrandForm.get('name_ar').value);
      formData.append('category', this.addBrandForm.get('category').value);
      formData.append('subCategory', JSON.stringify(this.addBrandForm.get('subCategory').value));
      formData.append('totalUnits', this.addBrandForm.get('totalUnits').value);
      formData.append('unitPrice', this.addBrandForm.get('unitPrice').value);
      formData.append('quantityPerUnit', this.addBrandForm.get('quantityPerUnit').value)
      formData.append('measureTypeUnit', this.addBrandForm.get('measureTypeUnit').value)
      formData.append('measureTypeServing', this.addBrandForm.get('measureTypeServing').value)
      formData.append('perServingSize', this.addBrandForm.get('perServingSize').value)
      formData.append('description', this.addBrandForm.get('description').value);
      formData.append('image', this.imageFile, this.imageFile.name);
      this.progress = true
      this.apiService.addBrand(formData).subscribe(res => {
        console.log(res)
        if (res.success == true) {
          this.progress = false
          this.commonService.successToast('SuccessFully Added')
          this.getBrandList()
          this.addBrandForm.reset();
          this.imageFile = ''
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

  }

  onUpdateBrand() {
    debugger
    this.submitted = true
    if (this.submitted && this.editBrandForm.valid) {
      let formData = new FormData();
      formData.append('id', this.editableBrandId)
      formData.append('name', this.editBrandForm.get('name').value);
      formData.append('name_ar', this.editBrandForm.get('name_ar').value);
      formData.append('category', this.editBrandForm.get('category').value);
      formData.append('subCategory', JSON.stringify(this.editBrandForm.get('subCategory').value));
      formData.append('totalUnits', this.editBrandForm.get('totalUnits').value);
      formData.append('unitPrice', this.editBrandForm.get('unitPrice').value);
      formData.append('quantityPerUnit', this.editBrandForm.get('quantityPerUnit').value)
      formData.append('measureTypeUnit', this.editBrandForm.get('measureTypeUnit').value)
      formData.append('measureTypeServing', this.editBrandForm.get('measureTypeServing').value)
      formData.append('perServingSize', this.editBrandForm.get('perServingSize').value)
      formData.append('description', this.editBrandForm.get('description').value);
      if (this.imageFile) {
        formData.append('image', this.imageFile, this.imageFile.name);
      }
      this.progress = true
      this.apiService.editBrand(formData).subscribe(res => {
        console.log(res)
        if (res.success == true) {
          this.progress = false
          this.commonService.successToast('SuccessFully Edited')
          this.getBrandList()
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
