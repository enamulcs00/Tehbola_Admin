import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
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
  constructor(private router: Router, private formBuilder: FormBuilder, private apiService: ApiService, private commonService: CommonService) { }

  ngOnInit() {

    this.forgetPasswordForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email])
    })
  }

  get f() {
    return this.forgetPasswordForm.controls
  }


  goToLogin() {
    this.submitted = true
    var temp = this.forgetPasswordForm.get('email').value
    //console.log(temp);
    if (this.submitted && this.forgetPasswordForm.valid) {
      const email = this.forgetPasswordForm.get('email').value
      console.log(email);
      this.apiService.forgetPassword(email).subscribe((res) => {
        console.log(res)
        if (res.success) {
          this.router.navigate(['']);
          this.commonService.successToast("Reset password link sent to email, Please check your email")
        }

      })

    }



  }

}
