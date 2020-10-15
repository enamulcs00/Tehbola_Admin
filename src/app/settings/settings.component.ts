import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/services/api.service';
import { debug } from 'util';
import { FormGroup, FormBuilder } from '@angular/forms';
import { element } from 'protractor';
import Swal from 'sweetalert2';
import { CommonService } from 'src/services/common.service';

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
  zoneFormGroup: FormGroup
  zoneEditFormGroup: FormGroup
  applyTax: any = false;
  countryList: countrylist[] = []
  selectedCountry: any;
  browser: any
  shippingChargesList: any;
  openEditform: boolean;
  result: import("sweetalert2").SweetAlertResult<unknown>;
  id: any;
  taxId: any;
  constructor(private apiService: ApiService, private fb: FormBuilder, private commonService: CommonService) { }

  ngOnInit() {
    this.getTax();
    this.getShippingRateList();
    this.zoneFormGroup = this.fb.group({
      rangePrice: [''],
      selectedCountry: [''],
      belowMinValue: [''],
      minValue: [''],
      maxValue: [''],
      aboveMaxValue: ['']
    });

    this.zoneEditFormGroup = this.fb.group({
      rangePrice: [''],
      selectedCountry: [''],
      belowMinValue: [''],
      minValue: [''],
      maxValue: [''],
      aboveMaxValue: ['']
    });

  }
  getTax() {

    this.apiService.getTax().subscribe(res => {
      console.log(res)
      if (res.success) {
        this.tax = res.data[0].tax
        this.taxId = res.data[0]._id
      }
    })
  }

  updateTax() {
    console.log(this.tax, this.applyTax)
    let body = {
      id: this.taxId,
      tax: this.tax
    }
    this.apiService.updateTax(body).subscribe(res => {
      console.log(res);
      this.getTax()

    })
  }
  saveZone() {
    console.log(this.zoneFormGroup.value);
    let selectedCountry = this.zoneFormGroup.controls['selectedCountry'].value;
    let selectedCountryObject = this.countryList.find(element => element.name === selectedCountry)
    let body = {
      'country': selectedCountry,
      'countryCode': selectedCountryObject.code,
      'countryId': selectedCountryObject._id,
      'minPrice': this.zoneFormGroup.controls['minValue'].value,
      'maxPrice': this.zoneFormGroup.controls['maxValue'].value,
      'rangePrice': this.zoneFormGroup.controls['rangePrice'].value,
      'belowPrice': this.zoneFormGroup.controls['belowMinValue'].value,
      'abovePrice': this.zoneFormGroup.controls['aboveMaxValue'].value,
    }


    this.apiService.addShippingRate(body).subscribe(res => {
      console.log(res);
      if (res.success) {
        this.commonService.successToast(res.message);
        this.getShippingRateList()
      }

    })


  }
  updateShippingRate() {
    debugger
    console.log(this.zoneEditFormGroup.value);
    // let selectedCountry = this.zoneEditFormGroup.controls['selectedCountry'].value;
    let selectedCountryObject
    for (let i = 0; i < this.countryList.length; i++) {
      if (this.countryList[i]._id === this.id) {
        selectedCountryObject = this.countryList[i]
      }
    }
    let body = {
      'country': this.zoneEditFormGroup.controls['selectedCountry'].value,
      'countryCode': selectedCountryObject.code,
      'id': this.id,
      'minPrice': this.zoneEditFormGroup.controls['minValue'].value,
      'maxPrice': this.zoneEditFormGroup.controls['maxValue'].value,
      'rangePrice': this.zoneEditFormGroup.controls['rangePrice'].value,
      'belowPrice': this.zoneEditFormGroup.controls['belowMinValue'].value,
      'abovePrice': this.zoneEditFormGroup.controls['aboveMaxValue'].value,
    }


    this.apiService.updateShippingRate(body).subscribe(res => {
      console.log(res);
      if (res.success) {
        this.commonService.successToast(res.message);
        this.getShippingRateList()

      }

    })

  }


  getShippingRateList() {
    this.apiService.getShippingRateList().subscribe(res => {
      console.log(res);
      this.shippingChargesList = res.data
      this.openPopUp()

    })
  }
  openPopUp() {

    this.apiService.getCountryList().subscribe(res => {
      console.log(res);
      for (let i = 0; i < res.data.length; i++) {
        let body: countrylist = res.data[i];
        this.countryList.push(body)
      }
      // console.log("this", this.countryList);
    }
    )
  }


  editShippingCharge(id) {

    // this.id = id
    console.log(id);
    this.apiService.getSingleShippingCharge(id).subscribe(res => {
      console.log(res);
      let data = res.data;
      this.id = data.countryId
      this.zoneEditFormGroup.controls['rangePrice'].setValue(data.rangePrice);
      this.zoneEditFormGroup.controls['selectedCountry'].setValue(data.country)
      this.zoneEditFormGroup.controls['belowMinValue'].setValue(data.belowPrice);
      this.zoneEditFormGroup.controls['minValue'].setValue(data.minPrice);
      this.zoneEditFormGroup.controls['maxValue'].setValue(data.maxPrice)
      this.zoneEditFormGroup.controls['aboveMaxValue'].setValue(data.abovePrice)
    })

  }

  deleteShippingCharge(id) {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover  this Shipping rate!!",
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
          "model": "ShippingCharges"
        }
        this.apiService.delete(data).then(res => {
          console.log(res);

          this.commonService.successToast("Successfully Deleted");
          this.getShippingRateList()
        }
        )

      } else {
        console.log("cancelled");
      }
    });
  }


}
