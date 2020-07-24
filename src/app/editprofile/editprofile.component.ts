import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/services/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-editprofile',
  templateUrl: './editprofile.component.html',
  styleUrls: ['./editprofile.component.scss']
})
export class EditprofileComponent implements OnInit, AfterViewInit {
  //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
  //Add 'implements AfterViewInit' to the class.



  updateProfileForm: FormGroup
  imageFile: any;
  sub: any;
  id: any;
  profileData
  submitted: boolean;
  firstname: any;
  lastName: any;
  address: any;
  countryCode: any;
  phone: any;


  constructor(private fb: FormBuilder, private apiService: ApiService, private route: ActivatedRoute) {
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.id = params['id'];
      });


    this.apiService.getProfile().subscribe((res) => {
      console.log(res.data)
      this.profileData = res.data

      this.firstname = this.profileData.firstName
      this.lastName = this.profileData.lastName
      this.address = this.profileData.address
      this.countryCode = this.profileData.countryCode
      this.phone = this.profileData.phone
      this.imagePreview = this.profileData.profilePic
    });

  }



  imagePreview: any
  ngOnInit() {

    this.updateProfileForm = this.fb.group({
      firstName: [this.firstname, Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      countryCode: ['', Validators.required],
      phone: ['', Validators.required],
      profilePic1: ['', Validators.required],
      profilePic: []
    });



  }
  ngAfterViewInit(): void {

    this.setValue()
  }

  get f() {
    return this.updateProfileForm.controls
  }

  setValue() {



    this.updateProfileForm.controls['firstName'].setValue(this.firstname)
    this.updateProfileForm.controls['lastName'].setValue(this.lastName)
    this.updateProfileForm.controls['address'].setValue(this.address)
    this.updateProfileForm.controls['countryCode'].setValue(this.countryCode)
    this.updateProfileForm.controls['phone'].setValue(this.phone)
    this.updateProfileForm.controls['profilePic1'].setValue(this.imagePreview)
    var reader = new FileReader();
    reader.readAsDataURL(this.imagePreview);
    reader.onload = (event: any) => {
      this.imagePreview = event.target.result;
    }
  }

  async profilePic(event) {
    if (event.target.files && event.target.files[0]) {
      this.imageFile = event.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.imagePreview = event.target.result;

        this.updateProfileForm.controls['profilePic1'].patchValue(this.imageFile);
      };
    }
  }

  submit() {

    this.submitted = true

    if (this.submitted && this.updateProfileForm.valid) {

      const data = new FormData();



      data.append('firstName', this.updateProfileForm.get('firstName').value),
        data.append('lastName', this.updateProfileForm.get('lastName').value),
        data.append('email', this.profileData.email),
        data.append('address', this.updateProfileForm.get('address').value),
        data.append('countryCode', this.updateProfileForm.get('countryCode').value),
        data.append('phone', this.updateProfileForm.get('phone').value),
        data.append('profilePic', this.imageFile, this.imageFile.name)

      this.apiService.updateProfile(data).subscribe((res) => {
        console.log(res)
      });
    } else {
      console.log("invalid")

    }
  }



}
