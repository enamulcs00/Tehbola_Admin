import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/services/api.service';
import { debug } from 'util';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { element } from 'protractor';
import Swal from 'sweetalert2';
import { CommonService } from 'src/services/common.service';
import { Observable } from 'rxjs';
import { map, startWith, debounceTime } from 'rxjs/internal/operators';

interface countrylist {
  code: string;
  name: string;
  name_ar: string;
  status: number
  _id: string;
  isDeleted: boolean
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  tax: any;
  zoneName: any
  sizeFormGroup: FormGroup;
  teaTypeGroup: FormGroup;
  sugarlevelForm: FormGroup
  sizeEditFormGroup: FormGroup;
  teaTypeEditForm: FormGroup;
  sugarLevelEditForm: FormGroup;
  updateSetting: FormGroup

  @ViewChild('wrapper', { static: true }) wrapper: ElementRef
  // applyTax: any = false;
  countryList: countrylist[] = []
  selectedCountry: any;
  browser: any
  sizeList: any;
  openEditform: boolean;
  result: any
  id: any;
  taxId: any;
  countryId: any;
  submitted: boolean;
  selectedStates = []
  filteredOptions: Observable<any[]>;
  showCountryList: any;
  teaTypeList: any;
  teaTypeId: any;
  sugarLevelList: any;
  sugarLevelId: any;
  user: any;
  constructor(private apiService: ApiService, private fb: FormBuilder, private commonService: CommonService) {

    this.user = JSON.parse(this.apiService.getUser())

   }

  ngOnInit() {
    this.getTax();

    this.getSizeList();
    this.getTeaList();
    this.getSugarLevelList()
    this.sizeFormGroup = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(30)]],
      name_ar: ['', Validators.required],
    });

    this.teaTypeGroup = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(30)]],
      name_ar: ['', Validators.required],
    });

    this.sugarlevelForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(30)]],
      name_ar: ['', Validators.required],
    });

    this.sizeEditFormGroup = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(30)]],
      name_ar: ['', Validators.required],
    });

    this.teaTypeEditForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(30)]],
      name_ar: ['', Validators.required],
    });
    this.sugarLevelEditForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(30)]],
      name_ar: ['', Validators.required],
    });
    this.updateSetting = this.fb.group({
      facebook: ['', Validators.required],
      twitter: ['', Validators.required],
      instagram: ['', Validators.required],
      linkedIn: ['', Validators.required],
      appStoreLink: ['', Validators.required],
      googlePlayLink: ['', Validators.required],
      tax: ['', Validators.required],
    })

  }
  getTax() {

    this.apiService.getTax().subscribe(res => {
      console.log(res)
      if (res.success) {
        let data = res.data[0];
        this.taxId = data._id
        this.updateSetting.controls['tax'].setValue(data.tax);
        this.updateSetting.controls['applyTax'].setValue(data.taxApplicable);
        this.updateSetting.controls['facebook'].setValue(data.facebook);
        this.updateSetting.controls['twitter'].setValue(data.twitter);
        this.updateSetting.controls['instagram'].setValue(data.instagram);
        this.updateSetting.controls['linkedIn'].setValue(data.linkedin);
        this.updateSetting.controls['appStoreLink'].setValue(data.appStore);
        this.updateSetting.controls['googlePlayLink'].setValue(data.playStore);

      }
    })
  }


  focus() {

    var box = document.getElementById('addSizeButton');
    console.log(box);
    box.classList.remove('cdk-program-focused')
  }


  updateTax() {

    console.log(this.tax, this.updateSetting.controls['applyTax'].value)
    let body = {
      id: this.taxId,
      tax: this.updateSetting.controls['tax'].value,
      facebook: this.updateSetting.controls['facebook'].value,
      instagram: this.updateSetting.controls['instagram'].value,
      linkedin: this.updateSetting.controls['linkedIn'].value,
      playStore: this.updateSetting.controls['googlePlayLink'].value,
      twitter: this.updateSetting.controls['twitter'].value,
      taxApplicable: this.updateSetting.controls['applyTax'].value,
      appStore: this.updateSetting.controls['appStoreLink'].value

      //taxApplicable: this.applyTax
    }
    this.apiService.updateTax(body).subscribe(res => {
      console.log(res);
      if (res.success) {
        this.commonService.successToast(res.message)
        this.getTax()
      }
    })
  }




  saveSize() {
    console.log(this.sizeFormGroup.value);
    if (this.sizeFormGroup.valid) {

      let body = {
        'name': this.sizeFormGroup.get('name').value,
        'name_ar': this.sizeFormGroup.get('name_ar').value,
      }


      this.apiService.addSize(body).subscribe(res => {
        console.log(res);
        if (res.success) {
          this.commonService.successToast(res.message);
          document.getElementById('closeAddSizeForm').click()
          this.getSizeList()

        }

      })
    }

  }

  saveTeaType() {
    console.log(this.teaTypeGroup.value);
    if (this.teaTypeGroup.valid) {

      let body = {
        'name': this.teaTypeGroup.get('name').value,
        'name_ar': this.teaTypeGroup.get('name_ar').value,
      }


      this.apiService.addTeaType(body).subscribe(res => {
        console.log(res);
        if (res.success) {
          this.commonService.successToast(res.message);
          document.getElementById('closeAddTeaTypeForm').click()
          this.getTeaList()

        }

      })
    }

  }

  saveSugarLevel() {
    console.log(this.sugarlevelForm.value);
    if (this.sugarlevelForm.valid) {

      let body = {
        'name': this.sugarlevelForm.get('name').value,
        'name_ar': this.sugarlevelForm.get('name_ar').value,
      }


      this.apiService.addSugarLevel(body).subscribe(res => {
        console.log(res);
        if (res.success) {
          this.commonService.successToast(res.message);
          document.getElementById('closeSugarLevelForm').click()
          this.getSugarLevelList()

        }

      })
    }

  }
  updateSize() {

    console.log(this.sizeEditFormGroup.value);
    if (this.sizeEditFormGroup.valid) {
      // let selectedCountry = this.sizeEditFormGroup.controls['selectedCountry'].value;

      let body = {
        'name': this.sizeEditFormGroup.get('name').value,
        'name_ar': this.sizeEditFormGroup.get('name_ar').value,
      }

      this.apiService.updateSize(body, this.id).subscribe(res => {
        console.log(res);
        if (res.success) {
          this.commonService.successToast(res.message);
          this.getSizeList()

        }

      })
    }
  }


  updateTeaType() {

    console.log(this.teaTypeEditForm.value);
    if (this.teaTypeEditForm.valid) {
      // let selectedCountry = this.sizeEditFormGroup.controls['selectedCountry'].value;

      let body = {
        'name': this.teaTypeEditForm.get('name').value,
        'name_ar': this.teaTypeEditForm.get('name_ar').value,
      }

      this.apiService.updateTeaType(body, this.teaTypeId).subscribe(res => {
        console.log(res);
        if (res.success) {
          this.commonService.successToast(res.message);
          this.getTeaList()

        }

      })
    }
  }

  updateSugarLevel() {

    console.log(this.sugarLevelEditForm.value);
    if (this.sugarLevelEditForm.valid) {
      // let selectedCountry = this.sizeEditFormGroup.controls['selectedCountry'].value;

      let body = {
        'name': this.sugarLevelEditForm.get('name').value,
        'name_ar': this.sugarLevelEditForm.get('name_ar').value,
      }

      this.apiService.updateSugarLevel(body, this.sugarLevelId).subscribe(res => {
        console.log(res);
        if (res.success) {
          this.commonService.successToast(res.message);
          this.getSugarLevelList()

        }

      })
    }
  }

  getSizeList() {
    this.apiService.getSizeList().subscribe(res => {
      console.log(res);
      this.sizeList = res.data


    })
  }

  getTeaList() {
    this.apiService.getTeaList().subscribe(res => {
      console.log(res);
      this.teaTypeList = res.data


    })
  }

  getSugarLevelList() {
    this.apiService.getSugarLevelList().subscribe(res => {
      console.log(res);
      this.sugarLevelList = res.data


    })
  }





  editTeaType(id) {

    this.teaTypeId = id
    console.log(id);
    this.apiService.getSingleTeaType(id).subscribe(res => {
      console.log(res);
      let data = res.data;
      this.teaTypeEditForm.get('name').setValue(data.name)
      this.teaTypeEditForm.get('name_ar').setValue(data.name_ar)
    })

  }


  editSugarLevel(id) {

    this.sugarLevelId = id
    console.log(id);
    this.apiService.getSingleSugarLevel(id).subscribe(res => {
      console.log(res);
      let data = res.data;
      this.sugarLevelEditForm.get('name').setValue(data.name)
      this.sugarLevelEditForm.get('name_ar').setValue(data.name_ar)
    })

  }


  editSize(id) {

    this.id = id
    console.log(id);
    this.apiService.getSingleSize(id).subscribe(res => {
      console.log(res);
      let data = res.data;
      this.sizeEditFormGroup.get('name').setValue(data.name)
      this.sizeEditFormGroup.get('name_ar').setValue(data.name_ar)
    })

  }

  deleteTeaType(id) {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover  this Tea Type!!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085D6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",

      allowOutsideClick: true
    }).then(result => {
      if (result.value) {
        this.result = result;
        console.log(id)
        const data = {
          "id": id,
          "model": "TeaTypes"
        }

        this.apiService.delete(data).subscribe(res => {
          console.log(res);
          if (res.success) {
            //  this.getAllCategories()
            this.commonService.successToast(res.message);
            this.getTeaList()
          } else {
            this.commonService.errorToast(res.message)
          }

        });


      } else {
        console.log("cancelled");
      }
    });
  }


  deleteSize(id) {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover  this Size!!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085D6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",

      allowOutsideClick: true
    }).then(result => {
      if (result.value) {
        this.result = result;
        console.log(id)
        const data = {
          "id": id,
          "model": "Sizes"
        }

        this.apiService.delete(data).subscribe(res => {
          console.log(res);
          if (res.success) {
            //  this.getAllCategories()
            this.commonService.successToast(res.message);
            this.getSizeList()
          } else {
            this.commonService.errorToast(res.message)
          }

        });


      } else {
        console.log("cancelled");
      }
    });
  }

  deleteSugarLevel(id) {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover  this Sugar level!!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085D6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",

      allowOutsideClick: true
    }).then(result => {
      if (result.value) {
        this.result = result;
        console.log(id)
        const data = {
          "id": id,
          "model": "SugarLevel"
        }

        this.apiService.delete(data).subscribe(res => {
          console.log(res);
          if (res.success) {
            //  this.getAllCategories()
            this.commonService.successToast(res.message);
            this.getSugarLevelList()
          } else {
            this.commonService.errorToast(res.message)
          }

        });


      } else {
        console.log("cancelled");
      }
    });
  }


  back() {
    window.history.back()
  }

}
