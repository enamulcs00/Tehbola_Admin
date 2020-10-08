import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/services/api.service';
import { CommonService } from 'src/services/common.service';
import * as moment from 'moment';
interface Ready {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrls: ['./view-order.component.scss']
})
export class ViewOrderComponent implements OnInit {
  sub: any;
  id: any;

  editSaleForm: FormGroup
  deliveryAddressId: any;
  constructor(private router: Router, private route: ActivatedRoute, private apiService: ApiService, private commonService: CommonService, private fb: FormBuilder) {

    this.sub = this.route.queryParams.subscribe(params => {
      this.id = params['id']
      console.log(this.id)
    });

    this.getSale(this.id)
  }
  getSale(id) {
    this.apiService.getSale(id).subscribe(res => {
      console.log(res)
      if (res.status == true) {
        let object = res.data[0]
        console.log(object)
        this.deliveryAddressId = object.deliveryAddress._id
        this.editSaleForm.controls['orderID'].setValue(object.orderId)
        this.editSaleForm.controls['productName'].setValue(object.productId.name)
        this.editSaleForm.controls['productCategory'].setValue(object.productId.category.name)
        this.editSaleForm.controls['productSubcategory'].setValue(object.productId.subCategory.name)
        this.editSaleForm.controls['sku'].setValue(object.productId.sku)
        this.editSaleForm.controls['quantity'].setValue(object.quantity)
        this.editSaleForm.controls['price'].setValue(object.totalAmount)
        let name = object.userId.firstName + ' ' + object.userId.lastName
        this.editSaleForm.controls['userName'].setValue(name)
        this.editSaleForm.controls['userAddress1'].setValue(object.deliveryAddress.address1)
        this.editSaleForm.controls['userAddress2'].setValue(object.deliveryAddress.address2)
        this.editSaleForm.controls['userCity'].setValue(object.deliveryAddress.city)
        this.editSaleForm.controls['userState'].setValue(object.deliveryAddress.state)
        // this.editSaleForm.controls['userCountry'].setValue(object.deliveryAddress)
        this.editSaleForm.controls['userPostalCode'].setValue(object.deliveryAddress.postalCode)
        this.editSaleForm.controls['orderDate'].setValue(moment(object.createdAt).format('YYYY-MM-DD'))
        if (object.deliveredDate) {
          this.editSaleForm.controls['deliveryDate'].setValue(moment(object.deliveredDate).format('YYYY-MM-DD'))
        } else {
          this.editSaleForm.controls['deliveryDate'].setValue("Not delivered yet")
        }
      }
    })
  }

  ngOnInit() {

    this.editSaleForm = this.fb.group({
      orderID: [''],
      productName: [''],
      productCategory: [''],
      productSubcategory: [''],
      sku: [''],
      quantity: [''],
      price: [''],
      userName: [''],
      userAddress1: ['', Validators.required],
      userAddress2: ['', Validators.required],
      userCity: ['', Validators.required],
      userState: ['', Validators.required],
      // userCountry: ['', Validators.required],
      userPostalCode: ['', Validators.required],
      orderDate: [''],
      deliveryDate: [''],


    })
  }
  goToordermanagement() {
    this.router.navigate(['ordermanagement'])
  }
}
