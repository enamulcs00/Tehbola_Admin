import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';

@Component({
  selector: 'app-profile-set-up',
  templateUrl: './profile-set-up.component.html',
  styleUrls: ['./profile-set-up.component.scss']
})
export class ProfileSetUpComponent implements OnInit {
  setUpProfile: FormGroup
  countryList: any;
  constructor(private fb: FormBuilder, private route: Router, private apiService: ApiService) {
    this.readCountryCode()
  }


  readCountryCode() {
    this.apiService.getCountryCode().subscribe(res => {
      console.log(res);
      this.countryList = res;
    })
  }

  ngOnInit() {
    this.setUpProfile = this.fb.group({

      firstName: [''],
      lastName: [''],
      email: [''],
      countryCode: [''],
      phone: [''],
      address: [''],
      city: [''],
      state: [''],
      country: [''],
      bio: [''],
      Specialities: [''],
      celebrityType: ['sell'],
      profilePhoto: ['']
    })

  }

}
