import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { NgForOf } from '@angular/common';
import { DatePipe } from '@angular/common';

declare var $: any;
interface Ready {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  sub: any
  id: any;

  firstName: string;
  lastName: string;
  UserEmail: string;
  userCountryCode: string;
  UserPhoneNumber: string;
  status: string;
  numberOfOrder: string;
  completedOrder: string;
  rejectedOrder: string;
  totalAmountPaid: string;

  constructor(private router: Router, private route: ActivatedRoute, private apiService: ApiService,
    private datePipe: DatePipe) {


  }

  ngOnInit() {
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.id = params['id'];
      });

    this.apiService.viewUser(this.id).subscribe((res) => {
      if (res.success) {
        console.log(res.data);
        this.firstName = res.data.firstName;
        this.lastName = res.data.lastName;
        this.userCountryCode = res.data.countryCode;
        this.UserEmail = res.data.email;
        this.UserPhoneNumber = res.data.phone;
        this.status = res.data.status;
        this.numberOfOrder = res.data.totalOrders;
        this.completedOrder = res.data.completedOrders;
        this.rejectedOrder = res.data.rejectedOrders;
        this.totalAmountPaid = res.data.totalPaid

        if (this.status === "0") {
          this.status = this.pick[1].value
        } else {
          this.status = this.pick[0].value
        }


      }
    });
  }



  updateUser() {

    console.log(this.id)
    let temp: number
    if (this.status == "active") {
      temp = 1
    } else {
      temp = 0
    }
    let userUpdate = {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.UserEmail,
      phone: this.UserPhoneNumber,
      status: temp,
      totalOrders: this.numberOfOrder,
      completedOrders: this.completedOrder,
      rejectedOrders: this.rejectedOrder,
      totalPaid: this.totalAmountPaid,
    }
    this.apiService.editUser(userUpdate).subscribe((res) => {
      console.log(res);
      this.goTomanageUser()
    });
  }
  goTomanageUser() {
    this.router.navigate(['/manageUser'])
  }
  pick: Ready[] = [
    { value: "active", viewValue: 'Active' },
    { value: "inactive", viewValue: 'Inactive' }

  ];
}
