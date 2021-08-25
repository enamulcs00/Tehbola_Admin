import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-delivery-address',
  templateUrl: './delivery-address.component.html',
  styleUrls: ['./delivery-address.component.scss']
})
export class DeliveryAddressComponent implements OnInit {
  sub: any;
  id: any
  constructor(private apiService: ApiService, private route: ActivatedRoute, private router: Router) {

    this.sub = this.route
    .queryParams
    .subscribe(params => {
      // Defaults to 0 if no query param provided.
      this.id = params['id'];

    });
   }
  addressList: any
  address: any;
  city: any;
  country: any;
  postalCode: any;
  streetName: any;
  addressType: any;
  flag: boolean = false;
  editId: any;
  phone: any;
  flagData: boolean = false;
  ngOnInit() {
  

    this.getUserAddresses();

  }

  getUserAddresses() {

    this.apiService.getUserAddress(this.id).subscribe((res) => {
      if (res.data.length > 0) {
        this.flagData = true
        this.addressList = res.data
      } else {
        this.flagData = false
      }


    });

  }


  back() {
    window.history.back();
  }

  editAddress(item) {
    this.flag=true
    this.editId=item._id;
    this.address=item.address;
    this.streetName=item.streetName;
    this.addressType=item.addressType;
    this.postalCode=item.postalCode

      
    
  }


  UpdateAddress() {

    const body = {
      'id': this.editId,
      'address': this.address,
      'streetName': this.streetName,
      'addressType': this.addressType,
      'postalCode': this.postalCode,
    }


    this.apiService.updateAddress(body).subscribe((res) => {
      if(res.success){
        this.getUserAddresses()
        this.flag = false
      }
    });
   
   


  }



  goTomanageUser() {
    this.router.navigate(['manageUser']);
  }



}



