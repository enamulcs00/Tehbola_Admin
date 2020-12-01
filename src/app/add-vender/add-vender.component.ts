import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/services/api.service';
import { CommonService } from 'src/services/common.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { UrlService } from 'src/services/url.service';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
interface Ready {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-add-vender',
  templateUrl: './add-vender.component.html',
  styleUrls: ['./add-vender.component.scss']
})
export class AddVenderComponent implements OnInit {
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
  selectedCategoryId = [];
  country: any;
  sub: any;
  roles: any;
  submitted: boolean;
  progress: boolean;
  constructor(private fb: FormBuilder, private route: Router, private cd: ChangeDetectorRef, private router: ActivatedRoute, private apiService: ApiService, private commonService: CommonService) {

    this.readCountryCode();
    this.userDetails = JSON.parse(sessionStorage.getItem('Markat_User'));
    console.log("USer", this.userDetails);


  }

  // getCategoryList() {

  //   let temp = []
  //   this.categoryList = []
  //   let page = 1;
  //   let count = 200;

  //   this.apiService.getAllCategories().subscribe(res => {

  //     if (res.success) {

  //       console.log(res)
  //       if (res.data) {
  //         for (let i = 0; i < res.data.length; i++) {
  //           let body = {
  //             'id': res.data[i].id,
  //             'text': res.data[i].name
  //           }
  //           temp.push(body);
  //         }
  //       }
  //     }
  //     this.categoryList = temp;
  //   }
  //   );
  // }

  readCountryCode() {
    this.apiService.getCountryCode().subscribe(res => {
      console.log(res);
      this.countryList = res;
    })
  }

  ngOnInit() {
    this.setUpProfile = this.fb.group({

      fullName: ['', Validators.required],

      email: ['', [Validators.required, Validators.email]],
      countryCode: ['', Validators.required],
      phone: ['', Validators.required],
      last4Digits: ['', [Validators.required, Validators.maxLength(4)]],
      //address: ['', Validators.required],
      //   bio: ['',],
      //  Specialities: ['', Validators.required],
      //  celebrityType: ['', Validators.required],
      profilePhoto: [''],
      gender: ['', Validators.required]
    })



  }




  public AddressChange(address: any) {

    //setting address from API to local variable 
    console.log(address);
    this.lat = address.geometry.location.lat()
    this.lng = address.geometry.location.lng()
    this.formattedaddress = address.formatted_address
    this.setUpProfile.get('address').setValue(this.formattedaddress)
    let length = address.address_components.length
    this.country = address.address_components[length - 1].long_name;

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

  deletePhoto(id) {
    console.log(id);

    let temp = [];
    let tempDoc = []
    console.log("beforeDelete", this.urls);
    console.log("beforeDelete", this.document);
    temp = this.urls.splice(id, 1);
    tempDoc = this.document.splice(id, 1);

    console.log("Deleted", temp);
    console.log("Deleted", tempDoc);



  }

  onProfileSetUp() {
    this.submitted = true

    console.log("Form", this.setUpProfile.value);
    console.log("image", this.profileImage);
    if (this.setUpProfile.valid) {
      let temp

      let formData = new FormData;
      if (this.imageFile) {
        formData.append('profilePic', this.imageFile, this.imageFile.name);
      }

      formData.append('fullName', this.setUpProfile.get('fullName').value);

      formData.append('email', this.setUpProfile.get('email').value)
      formData.append('phone', this.setUpProfile.get('phone').value);
      formData.append('last4Digits', this.setUpProfile.get('last4Digits').value)

      formData.append('countryCode', this.setUpProfile.get('countryCode').value)
      formData.append('gender', this.setUpProfile.get('gender').value)


      formData.forEach((value, key) => {
        console.log(key + " " + value)
      });
      this.progress = true
      this.apiService.addVendorCelebrity(formData).subscribe(res => {
        console.log(res);
        if (res.success) {
          this.commonService.successToast(res.message);
          this.progress = false
          this.route.navigate(['/venderManagement']);
        } else {
          this.commonService.errorToast(res.message);
          this.progress = false
        }

      })


    }


  }

  back() {
    history.back()
  }
}
