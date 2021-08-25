import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

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
  sub: any;
  title: string = 'Add';
  buttonText: string = 'Save';
  id: any;
  constructor(private fb: FormBuilder, private apiService: ApiService, private commonService: CommonService, private router: Router, private activatedRouter: ActivatedRoute) {


    this.sub = this.activatedRouter.queryParams.subscribe(res => {


      if (res.id) {
        this.title = 'Edit'
        this.getSinglePromoCode(res.id)
        this.id = res.id
        this.buttonText = 'Update'
      }

    })
  }

  ngOnInit() {
    
    let todaySet=new Date();
    this.today = moment(todaySet).add(1,'d').format('YYYY-MM-DD');



    this.addPromoCodeForm = this.fb.group({
      code: ['', Validators.required],
      expiry: ['', Validators.required],
      description: ['', Validators.required],
      minCartValue: ['', [Validators.required, Validators.min(0)]],
      discount: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      maxDiscount: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      discountType: ['PERCENT', Validators.required],
      freqPerUser: ['', [Validators.required, Validators.min(0)]],
      exhaustLimit: ['', Validators.required]

    },
      {
        validator: MoreThan('discount', 'maxDiscount')
      })
  }



  getSinglePromoCode(id) {

    this.apiService.getPromoCode(id).subscribe(res => {



      this.addPromoCodeForm.get('code').setValue(res.data.code);
      this.addPromoCodeForm.get('expiry').setValue(res.data.expiry)
      this.addPromoCodeForm.get('description').setValue(res.data.description)
      this.addPromoCodeForm.get('minCartValue').setValue(res.data.minCartValue)
      this.addPromoCodeForm.get('discount').setValue(res.data.discount)
      this.addPromoCodeForm.get('maxDiscount').setValue(res.data.maxDiscount)
      this.addPromoCodeForm.get('discountType').setValue(res.data.discountType)
      this.addPromoCodeForm.get('freqPerUser').setValue(res.data.freqPerUser)
      this.addPromoCodeForm.get('exhaustLimit').setValue(res.data.exhaustLimit)


    })

  }



  onSubmit() {

    if (this.addPromoCodeForm.valid) {
      let body = this.addPromoCodeForm.value;
      // code:this.addPromoCodeForm.get('').value,

      this.progress = true
      if (this.id) {
        this.apiService.updatePromoCode(body, this.id).subscribe(res => {

          if (res.success) {
            this.progress = false;
            this.commonService.successToast(res.message)
            this.router.navigate(['promo-code-management'])
          } else {
            this.progress = false;
            this.commonService.errorToast(res.message);
          }

        })
      } else {
        this.apiService.addPromoCode(body).subscribe(res => {

          if (res.success) {
            this.progress = false;
            this.commonService.successToast(res.message)
            this.router.navigate(['promo-code-management'])
          } else {
            this.progress = false;
            this.commonService.errorToast(res.message);
          }

        })
      }


    }




  }


  goToinventory() {
    history.back()
  }

}
