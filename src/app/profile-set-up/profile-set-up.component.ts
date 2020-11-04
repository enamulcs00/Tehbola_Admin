import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { CommonService } from 'src/services/common.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-profile-set-up',
  templateUrl: './profile-set-up.component.html',
  styleUrls: ['./profile-set-up.component.scss']
})
export class ProfileSetUpComponent implements OnInit {
  setUpProfile: FormGroup
  countryList: any;
  userDetails: any;
  categoryList = []
  categoryDropDownSettings: IDropdownSettings = {};
  selectedCategoryItem = []
  formattedaddress = " ";
  options = {
    types: [],

  }

  @ViewChild("placesRef", { static: true }) placesRef: GooglePlaceDirective;
  imageFile: any;
  profileImage: any;
  lat: any;
  lng: any;
  uploaded: boolean = false;
  document = [];
  urls = [];
  constructor(private fb: FormBuilder, private route: Router, private apiService: ApiService, private commonService: CommonService) {
    debugger
    this.readCountryCode();
    this.userDetails = JSON.parse(sessionStorage.getItem('Markat_User'));
    console.log("USer", this.userDetails);
    this.getCategoryList()
  }

  getCategoryList() {

    let temp = []
    this.categoryList = []

    this.apiService.getAllCategories().subscribe(res => {

      if (res.success) {

        console.log(res)
        if (res.data) {
          for (let i = 0; i < res.data.length; i++) {
            let body = {
              'id': res.data[i].id,
              'text': res.data[i].name
            }
            temp.push(body);
          }
        }
      }
      this.categoryList = temp;
    }
    );
  }

  readCountryCode() {
    this.apiService.getCountryCode().subscribe(res => {
      console.log(res);
      this.countryList = res;
    })
  }

  ngOnInit() {
    this.setUpProfile = this.fb.group({

      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      countryCode: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      bio: ['',],
      Specialities: [''],
      celebrityType: [''],
      profilePhoto: [''],
      gender: ['']
    })

    if (this.userDetails.phone) {
      this.setUpProfile.get('phone').setValue(this.userDetails.phone);
      this.setUpProfile.get('countryCode').setValue(this.userDetails.countryCode);
      this.setUpProfile.controls['countryCode'].disable({ onlySelf: true });
      this.setUpProfile.controls['phone'].disable({ onlySelf: true });
    } else if (this.userDetails.email) {
      this.setUpProfile.get('email').setValue(this.userDetails.email);
      this.setUpProfile.controls['email'].disable({ onlySelf: true });
    }

  }

  onCategorySelect(e) {
    console.log(e.id);
    const index = this.selectedCategoryItem.findIndex(o => o.id.toString() == e.id.toString());
    if (index < 0) this.selectedCategoryItem.push(e);
  }
  onSelectAll(e) {
    console.log(e)
    for (let i = 0; i < e.length; i++) {
      this.selectedCategoryItem.push(e[i].id)
    }
  }

  public AddressChange(address: any) {
    //setting address from API to local variable 
    console.log(address);
    this.lat = address.geometry.location.lat()
    this.lng = address.geometry.location.lng()
    this.formattedaddress = address.formatted_address
  }


  onFileChange(e) {
    console.log(e);
    let temp = []
    debugger
    if (e.target.files && e.target.files[0]) {
      for (let i = 0; i < e.target.files.length; i++) {
        var reader = new FileReader();
        let name = e.target.files[i].name;
        this.document.push(e.target.files[i]);

        reader.readAsDataURL(e.target.files[i]);
        reader.onload = (event: any) => {
          let body = {
            name: name,
            document: event.target.result
          }
          this.urls.push(body);

          this.setUpProfile.controls['profilePhoto'].patchValue(this.imageFile);
        };

      }
    }


  }

  onProfileChange(e) {
    this.uploaded = true
    if (e.target.files && e.target.files[0]) {
      this.imageFile = e.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any) => {

        this.profileImage = event.target.result;
        this.setUpProfile.controls['profilePhoto'].patchValue(this.imageFile);
      };

    }

  }


  onProfileSetUp() {
    debugger
    console.log("Form", this.setUpProfile.value);
    console.log("image", this.profileImage);
    console.log("document", this.document);
    let formData = new FormData;
    formData.append('profilePic', this.imageFile, this.imageFile.name);
    for (let item in this.document) {
      formData.append('documentOne', this.document[item], this.document[item].name);
    }
    formData.append('firstName', this.setUpProfile.get('firstName').value);
    formData.append('lastName', this.setUpProfile.get('lastName').value)
    formData.append('email', this.setUpProfile.get('email').value)
    formData.append('phone', this.setUpProfile.get('firstName').value)
    formData.append('countryCode', this.setUpProfile.get('phone').value)
    formData.append('categories', JSON.stringify(this.selectedCategoryItem))
    formData.append('celebrityType', this.setUpProfile.get('firstName').value)
    formData.append('gender', this.setUpProfile.get('firstName').value)
    formData.append('lat', this.lat)
    formData.append('lng', this.lng)

    formData.forEach((value, key) => {
      console.log(key + " " + value)
    });



  }

}
