import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UrlService } from 'src/services/url.service';
import { ApiService } from 'src/services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { CommonService } from 'src/services/common.service';

@Component({
  selector: 'app-edit-vendor',
  templateUrl: './edit-vendor.component.html',
  styleUrls: ['./edit-vendor.component.scss']
})
export class EditVendorComponent implements OnInit {



  editVendor: FormGroup;
  uploaded: boolean;
  imageFile: any;
  profileImage: any;
  lat: any;
  lng: any;
  formattedaddress: any;
  categoryDropDownSettings: IDropdownSettings = {};
  country: any;
  options = {
    types: [],

  }
  genderModel = [{
    'value': 'M',
    'viewValue': 'Male'
  },
  {
    'value': 'F',
    'viewValue': 'Female'
  }
  ]

  celebrityTypeModel = [{
    'value': 2,
    'viewValue': 'Sell'
  },
  {
    'value': 1,
    'viewValue': 'Endorse'
  },
  {
    'value': 3,
    'viewValue': 'Both'
  },]
  userDetails: any;
  roles: any;
  sub: any;
  id: any;
  categoryList: any;
  imageUrl: string;
  matchedCategory = [];
  categories: any;
  userRole: any;
  celebrityType: any;
  countryList: any;
  selectedCategoryItem: any;
  selectedCategoryId: any;
  gender: any;
  Userid: any;
  gotProfile: boolean;
  progress: boolean;
  dontShowPurpose: boolean = false;
  constructor(private route: Router, private router: ActivatedRoute, private commonService: CommonService, private urlService: UrlService, private apiService: ApiService, private fb: FormBuilder) {
    this.userDetails = JSON.parse(sessionStorage.getItem('Markat_User'));
    console.log("USer", this.userDetails);
    this.roles = this.userDetails.roles
    this.imageUrl = this.urlService.imageUrl
    this.getCategoryList()

    this.sub = this.router
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.id = params['id'];

      });

    this.readCountryCode()

  }

  ngOnInit() {

    this.editVendor = this.fb.group({

      fullName: ['', Validators.required],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      countryCode: ['', Validators.required],
      phone: ['', Validators.required],
      profilePhoto: ['',],
      last4Digits: ['', [Validators.required, Validators.maxLength(4)]]


    });
    this.getProfile();

  }

  getCategoryList() {

    let temp = []
    this.categoryList = []
    let page = 1;
    let count = 200;

    this.apiService.getAllCategories().subscribe(res => {

      if (res.success) {
        this.categoryList = res.data;
        // console.log(res)
        // if (res.data) {
        //   for (let i = 0; i < res.data.length; i++) {
        //     let body = {
        //       'id': res.data[i].id,
        //       'text': res.data[i].name
        //     }
        //     temp.push(body);
        //   }
        // }
      }

    }
    );
  }

  readCountryCode() {
    this.apiService.getCountryCode().subscribe(res => {
      console.log(res);
      this.countryList = res;
    })
  }

  onCategorySelect(e) {

    console.log(e.id);
    let temp
    const index = this.selectedCategoryItem.findIndex(o => o.id.toString() == e.id.toString());
    if (index < 0) {
      this.selectedCategoryItem.push(e.id);
    }
    for (let item in this.selectedCategoryItem) {
      this.selectedCategoryId.push(this.selectedCategoryItem[item].id)

    }
    this.editVendor.get('Specialities').setValue(this.selectedCategoryId)
  }
  onSelectAll(e) {

    let temp
    console.log(e)
    for (let i = 0; i < e.length; i++) {
      this.selectedCategoryId.push(e[i].id)
    }

    this.editVendor.get('Specialities').setValue(this.selectedCategoryId)
  }


  getProfile() {

    this.apiService.viewUser(this.id).subscribe(res => {
      console.log(res);
      if (res.success) {

        this.Userid = res.data._id
        if (res.data.roles == 'merchant') {
          this.dontShowPurpose = true
          this.editVendor.controls['celebrityType'].disable({ onlySelf: true });
        }
        this.editVendor.get('fullName').setValue(res.data.fullName);
        if (res.data.gender == 'M') {
          this.gender = res.data.gender
          this.editVendor.get('gender').setValue('M');
        } else {
          this.gender = res.data.gender
          this.editVendor.get('gender').setValue('F');
        }
        this.editVendor.get('email').setValue(res.data.email),
          this.editVendor.get('countryCode').setValue(res.data.countryCode),
          this.editVendor.get('phone').setValue(res.data.phone),
          this.editVendor.get('last4Digits').setValue(res.data.last4Digits);
        //  this.viewVendor.get('fullName').setValue(res.data.fullName),
        this.userRole = res.data.roles
        if (res.data.profilePic) {
          this.profileImage = res.data.profilePic;
          this.gotProfile = true
          //  this.editVendor.controls['profilePhoto'].setValue(this.gotProfile);
        }


      } else {

      }

    })
  }



  public AddressChange(address: any) {

    //setting address from API to local variable 
    console.log(address);
    this.lat = address.geometry.location.lat()
    this.lng = address.geometry.location.lng()
    this.formattedaddress = address.formatted_address
    //  this.editVendor.get('address').setValue(this.formattedaddress)
    let length = address.address_components.length
    this.country = address.address_components[length - 1].long_name;

  }

  onProfileChange(e) {
    this.uploaded = true
    this.gotProfile = false
    if (e.target.files && e.target.files[0]) {
      this.imageFile = e.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any) => {

        this.profileImage = event.target.result;
        this.editVendor.controls['profilePhoto'].patchValue(this.imageFile);
      };

    }
  }

  onUpdate() {

    console.log("Form", this.editVendor.value);
    console.log("image", this.profileImage);
    if (this.editVendor.valid) {
      let temp = []


      let formData = new FormData;
      if (this.imageFile) {
        formData.append('profilePic', this.imageFile, this.imageFile.name);
      }
      formData.append('id', this.Userid);

      formData.append('fullName', this.editVendor.get('fullName').value);

      formData.append('email', this.editVendor.get('email').value)
      formData.append('phone', this.editVendor.get('phone').value);
      formData.append('country', this.country)
      formData.append('address', this.formattedaddress)
      formData.append('countryCode', this.editVendor.get('countryCode').value)
      formData.append('gender', this.editVendor.get('gender').value)
      formData.append('last4Digits', this.editVendor.get('last4Digits').value)


      formData.forEach((value, key) => {
        console.log(key + " " + value)
      });
      this.progress = true
      this.apiService.editUser(formData).subscribe(res => {
        console.log(res);
        if (res.success) {
          this.progress = false
          this.commonService.successToast(res.message);

          this.apiService.back();
        } else {
          this.progress = false
          this.commonService.errorToast(res.message);
        }

      })


    }

  }




  goTovendermanagement() {
    this.route.navigate(['venderManagement'])
  }


  back() {
    history.back()
  }
}
