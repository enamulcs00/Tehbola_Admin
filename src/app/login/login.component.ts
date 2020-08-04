import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormGroupDirective,
  NgForm
} from "@angular/forms";
import { ApiService } from 'src/services/api.service';
import { CommonService } from 'src/services/common.service';
import { ErrorStateMatcher } from '@angular/material';



/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted: boolean = false;
  matcher = new MyErrorStateMatcher();

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private commonService: CommonService) { }


  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [Validators.required]),
    });
  }

  goToforgotPassword() {
    this.router.navigate(['forgotPassword']);
  }
  goTodashboard() {
    this.router.navigate(['dashboard']);
  }
  onLogin() {
    
    this.submitted = true;
    if (this.loginForm.valid && this.submitted) {
      const data = this.loginForm.value;
      this, this.apiService.singIn(data).subscribe(res => {
        if (res.success) {
          this.router.navigate(['dashboard']);
          this.commonService.successToast(res.message);
          this.apiService.setUser(JSON.stringify(res));
          this.apiService.sendToken(res.data.accessToken);
          
        
        }
      })
    }
  }
}
