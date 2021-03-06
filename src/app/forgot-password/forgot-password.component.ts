import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators, FormGroup, FormBuilder, RequiredValidator } from '@angular/forms';
import { ApiService } from 'src/services/api.service';
import { CommonService } from 'src/services/common.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  forgetPasswordForm: FormGroup
  email: FormControl;
  submitted: boolean
  countryList: any;
  gotPhoneNumber: boolean = false
  showPage: boolean = true
  otp: any;
  progress: boolean;

  constructor(private router: Router, private formBuilder: FormBuilder, private apiService: ApiService, private commonService: CommonService) { }
  binding: string

  ngOnInit() {
    this.forgetPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      countryCode: ['']
    })

    this.readCountryCode()
    this.binding = 'email'

  }


  clickOnCheckBox(e) {

    this.binding = e.value
    if (e.value == 'number') {
      this.forgetPasswordForm.get('phone').setValidators([Validators.required])
      this.forgetPasswordForm.get('countryCode').setValidators([Validators.required])
      this.forgetPasswordForm.get('email').clearValidators()
      this.forgetPasswordForm.get('phone').updateValueAndValidity();
      this.forgetPasswordForm.get('countryCode').updateValueAndValidity()
      this.forgetPasswordForm.get('email').updateValueAndValidity()

    }
    if (e.value === 'email') {
      this.forgetPasswordForm.get('email').setValidators([Validators.required]);
      this.forgetPasswordForm.get('phone').clearValidators();
      this.forgetPasswordForm.get('countryCode').clearValidators()
      this.forgetPasswordForm.get('phone').updateValueAndValidity();
      this.forgetPasswordForm.get('countryCode').updateValueAndValidity()
      this.forgetPasswordForm.get('email').updateValueAndValidity()
    }
  }

  get f() {
    return this.forgetPasswordForm.controls
  }
  readCountryCode() {
    this.apiService.getCountryCode().subscribe(res => {
      console.log(res);
      this.countryList = res;
    })
  }

  goToLogin() {

    this.submitted = true
    let data
    if (this.submitted && this.forgetPasswordForm.valid) {
      data = {
        email: this.forgetPasswordForm.controls['email'].value
      }

      this.progress = true
      this.apiService.forgetPassword(data).subscribe((res) => {
        console.log(res)
        if (res.success) {
          this.progress = false
          this.router.navigate(['']);
          this.commonService.successToast(res.message)




        } else {
          this.progress = false
          this.commonService.errorToast(res.message)
        }
      })
    }
  }


  onOtpChange(e) {
    this.otp = e
  }

  onOTPSubmit() {
    let body = {
      phone: this.forgetPasswordForm.controls['phone'].value,
      countryCode: this.forgetPasswordForm.controls['countryCode'].value,
      otp: this.otp,
      type: 'normal'
    }
    console.log(body);
    this.progress = true
    this.apiService.verifyPhone(body).subscribe(res => {
      console.log(res);
      if (res.success) {
        this.progress = false
        this.commonService.successToast(res.message)
        this.router.navigate(['resetPassword'], { queryParams: { 'phone': body.phone, 'countryCode': body.countryCode } })
      } else {
        this.progress = false
        this.commonService.errorToast(res.message)
      }
    })
  }

}
