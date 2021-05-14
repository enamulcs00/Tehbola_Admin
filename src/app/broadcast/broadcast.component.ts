import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/services/api.service';
import { CommonService } from 'src/services/common.service';

@Component({
  selector: 'app-broadcast',
  templateUrl: './broadcast.component.html',
  styleUrls: ['./broadcast.component.scss']
})
export class BroadcastComponent implements OnInit {

  broadcastForm: FormGroup
  constructor(private fb: FormBuilder, private apiService: ApiService, private commonService: CommonService) { }

  ngOnInit() {
    this.broadcastForm = this.fb.group({
      userType: ['', Validators.required],
      title: ['', Validators.required],
      message: ['', Validators.required],

    })
  }


  sendNotification() {
debugger
    let body = this.broadcastForm.value
    this.apiService.broadcastNotification(body).subscribe(res => {

      if (res.success == true) {
        this.broadcastForm.reset();
        this.commonService.successToast(res.message);
        this.broadcastForm.reset();
      }else{
        this.commonService.errorToast(res.message);
      }
    })

  }




  back() {
    window.history.back()
  }
}
