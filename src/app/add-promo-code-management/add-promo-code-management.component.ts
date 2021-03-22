import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ApiService } from 'src/services/api.service';
import { CommonService } from 'src/services/common.service';
import { MoreThan } from 'src/services/moreThanValidator';

@Component({
  selector: 'app-add-promo-code-management',
  templateUrl: './add-promo-code-management.component.html',
  styleUrls: ['./add-promo-code-management.component.scss']
})
export class AddPromoCodeManagementComponent implements OnInit {
  addPromoCodeForm: FormGroup;
  progress: boolean;
  today: string;
  constructor(private fb: FormBuilder, private apiService: ApiService, private commonService: CommonService, private router: Router) { }

  ngOnInit() {
    this.today = moment(new Date()).format('YYYY-MM-DD');



    this.addPromoCodeForm = this.fb.group({
      code: ['', Validators.required],
      expiry: ['', Validators.required],
      description: ['', Validators.required],
      minCartValue: ['', [Validators.required, Validators.min(0)]],
      discount: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      maxDiscount: ['', [Validators.required, Validators.max(100), Validators.min(0)]],
      discountType: ['', Validators.required],
      freqPerUser: ['', [Validators.required, Validators.min(0)]],
      exhaustLimit: ['', Validators.required]

    },
      {
        validator: MoreThan('discount', 'maxDiscount')
      })
  }



  onSubmit() {
    console.log(this.addPromoCodeForm.value);
    if (this.addPromoCodeForm.valid) {
      let body = this.addPromoCodeForm.value;
// code:this.addPromoCodeForm.get('').value,
       
      this.progress = true
      this.apiService.addPromoCode(body).subscribe(res => {
        console.log(res);
        if (res.success) {
          this.progress = false;
          this.commonService.successToast(res.message)
          this.router.navigate(['promoCodeList'])
        } else {
          this.progress = false;
          this.commonService.errorToast(res.message);
        }

      })

    }




  }


  goToinventory() {
    history.back()
  }

}
