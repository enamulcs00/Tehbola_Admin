import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { CommonService } from 'src/services/common.service';

@Component({
  selector: 'app-sub-admin-add',
  templateUrl: './sub-admin-add.component.html',
  styleUrls: ['./sub-admin-add.component.scss']
})
export class SubAdminAddComponent implements OnInit {
  sub: any;
  id: any;
  flagComp: any;
  title: string = 'Add'
  addAdminForm: FormGroup
  profilePic: any;
  profilePicName: any = 'Choose file';
  imagePreview: any;
  submitted: boolean;
  progress: boolean = false
  constructor(private activatedRoute: ActivatedRoute, private router: Router, private apiService: ApiService, private fb: FormBuilder, private commonService: CommonService) {

    this.sub = this.activatedRoute.queryParams.subscribe(res => {
      console.log(res);
      if (res.check == 'edit') {
        this.id = res.id;
        this.title = 'Edit'
      } else if (res.check == 'view') {
        this.id = res.id;
        this.title = 'View'

      }
      this.flagComp = res.check
    }
    )
  }


  addProfile(event) { //method is used to add logo of the vendor while adding vendor
    //this.picUploader = true

    if (event.target.files && event.target.files[0]) {
      this.profilePic = event.target.files[0];
      this.profilePicName = this.profilePic.name
      // console.log(this.imageFile);

      this.addAdminForm.get('image').setValue(this.profilePic ? this.profilePic.name : '')
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.imagePreview = event.target.result;
      };
    }
  }


  back() {
    history.back()
  }

  ngOnInit(): void {

    if (this.flagComp == 'edit' || this.flagComp == 'view') {
      this.getSingleSubAdmin()
    }

    this.addAdminForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      countryCode: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],

      //first section starts
      users: this.fb.group({
        read: [false],
        write: [false],
      }),
      product: this.fb.group({
        read: [false],
        write: [false],
      }),
      vendor: this.fb.group({
        read: [false],
        write: [false],
      }),
      category: this.fb.group({
        read: [false],
        write: [false],
      }),
      rawItemManagent: this.fb.group({
        read: [false],
        write: [false],
      }),
      inventory: this.fb.group({
        read: [false],
        write: [false],
      }),
      banner: this.fb.group({
        read: [false],
        write: [false],
      }),
      subadmin: this.fb.group({
        read: [false],
        write: [false],
      }),
      // first Section ends
      // Second Section starts
      revenue: this.fb.group({
        read: [false],
        write: [false],
      }),
      geofenceManagement: this.fb.group({
        read: [false],
        write: [false],
      }),
      AssignmentManagement: this.fb.group({
        read: [false],
        write: [false],
      }),
      EqupmentManagement: this.fb.group({
        read: [false],
        write: [false],
      }),
      orderList: this.fb.group({
        read: [false],
        write: [false],
      }),
      foodTruckManagement: this.fb.group({
        read: [false],
        write: [false],
      }),
      discount: this.fb.group({
        read: [false],
        write: [false],
      }),
      setting: this.fb.group({
        read: [false],
        write: [false],
      }),
      vendorRequestManagement: this.fb.group({
        read: [false],
        write: [false],
      }),
      reviews: this.fb.group({
        read: [false],
        write: [false],
      }),
      //second section ends
      // third section starts
      broadCast: this.fb.group({
        read: [false],
        // write: [false],
      })
    })
  }



  getSingleSubAdmin() {
    this.progress = true
    this.apiService.getSingleSubAdmin(this.id).subscribe(res => {
      console.log(res);
      if (res.success) {
        this.progress = false
        this.addAdminForm.get('firstName').setValue(res.data.firstName);
        this.addAdminForm.get('lastName').setValue(res.data.lastName);
        this.addAdminForm.get('email').setValue(res.data.email);
        this.addAdminForm.get('countryCode').setValue(res.data.countryCode);
        this.addAdminForm.get('phone').setValue(res.data.phone);
        this.addAdminForm.get('users').setValue(res.data.permissions.users);
        this.addAdminForm.get('product').setValue(res.data.permissions.product);
        this.addAdminForm.get('vendor').setValue(res.data.permissions.vendor);
        this.addAdminForm.get('category').setValue(res.data.permissions.category);
        this.addAdminForm.get('rawItemManagent').setValue(res.data.permissions.rawItemManagent);
        this.addAdminForm.get('inventory').setValue(res.data.permissions.inventory);
        this.addAdminForm.get('banner').setValue(res.data.permissions.banner);
        this.addAdminForm.get('subadmin').setValue(res.data.permissions.subadmin);
        this.addAdminForm.get('revenue').setValue(res.data.permissions.revenue);
        this.addAdminForm.get('geofenceManagement').setValue(res.data.permissions.geofenceManagement);
        this.addAdminForm.get('AssignmentManagement').setValue(res.data.permissions.AssignmentManagement);
        this.addAdminForm.get('EqupmentManagement').setValue(res.data.permissions.EqupmentManagement);
        this.addAdminForm.get('orderList').setValue(res.data.permissions.orderList);
        this.addAdminForm.get('foodTruckManagement').setValue(res.data.permissions.foodTruckManagement);
        this.addAdminForm.get('discount').setValue(res.data.permissions.discount);
        this.addAdminForm.get('setting').setValue(res.data.permissions.setting);
        this.addAdminForm.get('vendorRequestManagement').setValue(res.data.permissions.vendorRequestManagement);
        this.addAdminForm.get('reviews').setValue(res.data.permissions.reviews);
        this.addAdminForm.get('broadCast').setValue(res.data.permissions.broadCast);
        if (this.flagComp == 'edit') {
          this.addAdminForm.get('email').disable()
        }
        if (this.flagComp == 'view') {
          this.addAdminForm.disable();
        }
      } else {
        this.progress = false
        this.commonService.errorToast(res.message)
      }
    })
  }
  save() {

    console.log(this.addAdminForm.value);
    this.submitted = true
    if (this.addAdminForm.valid) {
      let permisssions = {
        'users': this.addAdminForm.get('users').value,
        'product': this.addAdminForm.get('product').value,
        'vendor': this.addAdminForm.get('vendor').value,
        'category': this.addAdminForm.get('category').value,
        'rawItemManagent': this.addAdminForm.get('rawItemManagent').value,
        'inventory': this.addAdminForm.get('inventory').value,
        'banner': this.addAdminForm.get('banner').value,
        'subadmin': this.addAdminForm.get('subadmin').value,
        'revenue': this.addAdminForm.get('revenue').value,
        'geofenceManagement': this.addAdminForm.get('geofenceManagement').value,
        'AssignmentManagement': this.addAdminForm.get('AssignmentManagement').value,
        'EqupmentManagement': this.addAdminForm.get('EqupmentManagement').value,
        'orderList': this.addAdminForm.get('orderList').value,
        'foodTruckManagement': this.addAdminForm.get('discount').value,
        'discount': this.addAdminForm.get('discount').value,
        'setting': this.addAdminForm.get('setting').value,
        'vendorRequestManagement': this.addAdminForm.get('vendorRequestManagement').value,
        'reviews': this.addAdminForm.get('reviews').value,
        'broadCast': this.addAdminForm.get('broadCast').value,
        // 'adminEndorsment': this.addAdminForm.get('adminEndorsment').value,

      }
      console.log(permisssions);


      let formData = new FormData;

      formData.append('firstName', this.addAdminForm.get('firstName').value)
      formData.append('lastName', this.addAdminForm.get('lastName').value)
      formData.append('email', this.addAdminForm.get('email').value)
      formData.append('countryCode', this.addAdminForm.get('countryCode').value)
      formData.append('phone', this.addAdminForm.get('phone').value)
      formData.append('permissions', JSON.stringify(permisssions))


      formData.forEach((value, key) => {
        console.log(key + " " + value)
      });

      if (this.id) {
        this.progress = true
        this.apiService.putSubAdmin(formData, this.id).subscribe(res => {
          console.log(res);
          if (res.success) {
            this.progress = false
            this.commonService.successToast(res.message)
            this.router.navigate(['sub-adminList'])
          } else {
            this.progress = false
            this.commonService.errorToast(res.message)
          }

        })
      } else {
        this.progress = true
        this.apiService.postSubAdmin(formData).subscribe(res => {
          console.log(res);
          if (res.success) {
            this.progress = false
            this.commonService.successToast(res.message)
            this.router.navigate(['sub-adminList'])
          } else {
            this.progress = false
            this.commonService.errorToast(res.message)
          }

        })
      }



    }



  }

}