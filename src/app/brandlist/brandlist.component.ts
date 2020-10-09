import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/services/api.service';
import { CommonService } from 'src/services/common.service';
import Swal from 'sweetalert2';

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
  constructor(private apiService: ApiService, private fb: FormBuilder, private commonService: CommonService) {
    this.getBrandList()
  }

  ngOnInit() {
    this.addBrandForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(25)]],
      name_ar: ['', [Validators.required, Validators.maxLength(25)]]
    });
    this.editBrandForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(25)]],
      name_ar: ['', [Validators.required, Validators.maxLength(25)]]
    })
  }

  getBrandList() {
    this.apiService.getBrandList().subscribe(res => {
      console.log(res)
      if (res.success == true) {
        this.brandList = res.data
      }
    })
  }

  editBrand(id) {

    let editableBrand = this.brandList.find(ele => ele._id == id)

    console.log(editableBrand)
    this.editBrandForm.controls['name'].setValue(editableBrand.name);
    this.editBrandForm.controls['name_ar'].setValue(editableBrand.name_ar)

  }

  deleteBrand(id) {

    Swal.clickCancel();
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this Brand!",
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
          "model": "Brand"
        }

        console.log(data)


        this.apiService.delete(data).then(res => {

          this.getBrandList()
        });

      } else {
        console.log("cancelled");
      }
    });

  }


  onAddBrand() {
    this.submitted = true
    if (this.submitted && this.addBrandForm.valid) {
      let body = this.addBrandForm.value
      this.apiService.addBrand(body).subscribe(res => {
        console.log(res)
        if (res.success == true) {
          this.commonService.successToast('SuccessFully Added')
          this.getBrandList()
          this.submitted = false
        } else {
          this.commonService.errorToast(res.message)
          this.submitted = false
        }
      })
    }

  }

  cancelClicked() {

  }

  onUpdateBrand() {
    this.submitted = true
    if (this.submitted && this.editBrandForm.valid) {
      let body = this.editBrandForm.value
      this.apiService.editBrand(body).subscribe(res => {
        console.log(res)
        if (res.success == true) {
          this.commonService.successToast('SuccessFully Edited')
          this.getBrandList()
          this.submitted = false
        } else {
          this.commonService.errorToast(res.message)
          this.submitted = false
        }
      })
    }

  }

}
