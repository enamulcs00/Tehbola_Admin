import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/services/api.service';
import { CommonService } from 'src/services/common.service';
import { UrlService } from 'src/services/url.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-equipment-management',
  templateUrl: './equipment-management.component.html',
  styleUrls: ['./equipment-management.component.scss']
})
export class EquipmentManagementComponent implements OnInit {

  addEquipmentForm: FormGroup;
  editEquipmentForm: FormGroup;
  addEquipmentCategory: FormGroup
  editEquipmentCategory: FormGroup
  submitted: boolean
  equipmentList = []
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
  editableCategory: any;
  constructor(private apiService: ApiService, private fb: FormBuilder, private commonService: CommonService, private urlService: UrlService) {

    this.imageUrl = this.urlService.imageUrl;
  }

  ngOnInit() {
    this.getEquipmentList()
    this.getAllEquipmentCategories()
    this.addEquipmentForm = this.fb.group({
      name: ['', [Validators.required,]],
      name_ar: ['', [Validators.required,]],
      category: ['', [Validators.required,]],
      image: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
      description: [''],
    });

    this.editEquipmentForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(25)]],
      name_ar: ['', [Validators.required, Validators.maxLength(25)]],
      category: ['', [Validators.required, Validators.maxLength(25)]],
      image: ['',],
      quantity: ['', [Validators.required]],
      description: [''],
    });

    this.addEquipmentCategory = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(25)]],
      name_ar: ['', [Validators.required, Validators.maxLength(25)]],
      description: [''],
    });

    this.editEquipmentCategory = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(25)]],
      name_ar: ['', [Validators.required, Validators.maxLength(25)]],
      description: [''],
    });

  }

  getEquipmentList() {

    //Pagination is applied in the backend. just not using in the front end because of design same as category
    this.progress = true
    this.apiService.getEquipmentList().subscribe(res => {
      console.log(res)

      if (res.success) {
        this.progress = false
        console.log(res.data);
        this.equipmentList = res.data
      } else {
        this.progress = false
        this.commonService.errorToast(res.message)
      }
    })
  }

  getAllEquipmentCategories() {
    this.apiService.getAllEquipmentCategories().subscribe(res => {
      console.log(res)
      if (res.success == true) {
        console.log(res.data);
        this.categoryList = res.data
      }
    })
  }

  editEquipmentCat(id) {

    this.submitted = true
    if (this.submitted && this.editEquipmentCategory.valid) {
      let body = this.editEquipmentCategory.value
      console.log(body);
      let formData = new FormData();
      formData.append('id', this.editableCategory)
      formData.append('name', this.editEquipmentCategory.get('name').value);
      formData.append('name_ar', this.editEquipmentCategory.get('name_ar').value);
      formData.append('description', this.editEquipmentCategory.get('description').value);

      this.progress = true
      this.apiService.EditEquipmentCategory(formData).subscribe(res => {
        console.log(res)
        if (res.success == true) {
          this.progress = false
          this.commonService.successToast('SuccessFully Added')
          this.getAllEquipmentCategories()
          this.addEquipmentForm.reset();
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
          this.editEquipmentForm.controls['image'].setValue(this.imageFile);
        } else {
          this.brandImage = event.target.result;
          this.addEquipmentForm.controls['image'].setValue(this.brandImage);

        }

      };
    }
  }

  editEquipment(id) {
    this.id = id

    this.apiService.viewEquipment(id).subscribe((res) => {
      if (res.data) {
        this.flagImage = false;
        console.log(res)
        this.editableBrandId = res.data._id
        this.editEquipmentForm.get('name').setValue(res.data.name);
        this.editEquipmentForm.get('name_ar').setValue(res.data.name_ar);
        this.editEquipmentForm.get('category').setValue(res.data.category.id);
        this.editEquipmentForm.get('image').setValue('')
        this.editEquipmentForm.get('quantity').setValue(res.data.quantity)
        this.editEquipmentForm.get('description').setValue(res.data.description)


        let data = res.data
        this.brandImage = data.image;
      }
    })

  }


  editEquipmentCategoryMethod(id, name, name_ar, description) {
    this.id = id

    this.editableCategory = id
    this.editEquipmentCategory.get('name').setValue(name);
    this.editEquipmentCategory.get('name_ar').setValue(name_ar);
    this.editEquipmentCategory.get('description').setValue(description)
  }

  deleteEquipment(id) {

    // Swal.clickCancel();
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this Equipment!",
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
          "model": "Equipment"
        }

        console.log(data)
        this.apiService.delete(data).subscribe(res => {
          console.log(res);
          if (res.success) {
            // this.getAllCategories()
            this.commonService.successToast(res.message);
            this.getEquipmentList()

          } else {
            this.commonService.errorToast(res.message)
          }

        });
      } else {
        console.log("cancelled");
      }
    });

  }


  deleteEquipmentCat(id) {

    // Swal.clickCancel();
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this Equipment Category!",
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
          "model": "EquipmentCategory"
        }

        console.log(data)
        this.apiService.delete(data).subscribe(res => {
          console.log(res);
          if (res.success) {
            this.commonService.successToast(res.message);
            this.getAllEquipmentCategories()
          } else {
            this.commonService.errorToast(res.message)
          }

        });
      } else {
        console.log("cancelled");
      }
    });

  }
  onAddEquipmentCategory() {

    this.submitted = true
    if (this.submitted && this.addEquipmentCategory.valid) {
      let body = this.addEquipmentCategory.value
      console.log(body);
      let formData = new FormData();
      formData.append('name', this.addEquipmentCategory.get('name').value);
      formData.append('name_ar', this.addEquipmentCategory.get('name_ar').value);
      formData.append('description', this.addEquipmentCategory.get('description').value);
      this.progress = true
      this.apiService.addEquipmentCategory(formData).subscribe(res => {
        console.log(res)
        if (res.success == true) {
          this.progress = false
          this.commonService.successToast('SuccessFully Added')
          this.getAllEquipmentCategories()
          this.addEquipmentForm.reset();
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



  onAddEquipment() {

    this.submitted = true
    if (this.submitted && this.addEquipmentForm.valid) {
      let body = this.addEquipmentForm.value
      console.log(body);

      let formData = new FormData();
      formData.append('name', this.addEquipmentForm.get('name').value);
      formData.append('name_ar', this.addEquipmentForm.get('name_ar').value);
      formData.append('category', this.addEquipmentForm.get('category').value);
      formData.append('quantity', this.addEquipmentForm.get('quantity').value);
      formData.append('description', this.addEquipmentForm.get('description').value);
      formData.append('image', this.imageFile, this.imageFile.name);
      this.progress = true
      this.apiService.addEquipment(formData).subscribe(res => {
        console.log(res)
        if (res.success == true) {
          this.progress = false
          this.commonService.successToast('SuccessFully Added')
          this.getEquipmentList()
          this.addEquipmentForm.reset();
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
    this.addEquipmentForm.reset();
    this.editEquipmentForm.reset();
    this.imageFile = ''
    this.brandImage = ''

  }

  onUpdateBrand() {
    
    this.submitted = true
    if (this.submitted && this.editEquipmentForm.valid) {
      let formData = new FormData();

      formData.append('name', this.editEquipmentForm.get('name').value);
      formData.append('name_ar', this.editEquipmentForm.get('name_ar').value);
      formData.append('category', this.editEquipmentForm.get('category').value);
      formData.append('quantity', this.editEquipmentForm.get('quantity').value);
      formData.append('description', this.editEquipmentForm.get('description').value);
      if (this.imageFile) {
        formData.append('image', this.imageFile, this.imageFile.name);
      }
      this.progress = true
      this.apiService.editEquipment(formData, this.editableBrandId).subscribe(res => {
        console.log(res)
        if (res.success == true) {
          this.progress = false
          this.commonService.successToast('SuccessFully Edited')
          this.getEquipmentList()
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
