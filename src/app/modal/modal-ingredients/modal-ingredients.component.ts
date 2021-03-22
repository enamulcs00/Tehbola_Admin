import { Component, OnInit, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { CommonService } from 'src/services/common.service';
import { MoreThan } from 'src/services/moreThanValidator';


@Component({
  selector: 'app-modal-ingredients',
  templateUrl: './modal-ingredients.component.html',
  styleUrls: ['./modal-ingredients.component.scss']
})
export class ModalIngredientsComponent implements OnInit {

  dataForm: FormGroup
  constructor(public dialogRef: MatDialogRef<ModalIngredientsComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private commonService: CommonService) { }

  ngOnInit() {
    console.log("data on dialog", this.data);

    this.dataForm = this.fb.group({
      equipment: this.fb.array([]),
      rawitems: this.fb.array([])
    })

    this.setEquipment(this.data.data.selectedEquipment);
    this.setRawItems(this.data.data.selectedRawItems)
  }


  equipments(): FormArray {
    return this.dataForm.get('equipment') as FormArray;
  }

  rawItems(): FormArray {
    return this.dataForm.get('rawitems') as FormArray;
  }


  setEquipment(specification) {

    const formArray = new FormArray([]);
    for (let x of specification) {
      formArray.push(this.fb.group({
        id: new FormControl(x.id, Validators.required),
        name: new FormControl(x.name, Validators.required),
        quantity: new FormControl(x.quantity),
        assignedQuantity: new FormControl('', Validators.required),
      }, {
        validator: MoreThan('quantity', 'assignedQuantity')
      }));
    }
    this.dataForm.setControl('equipment', formArray)
  }

  setRawItems(specification) {
    const formArray = new FormArray([]);
    for (let x of specification) {
      formArray.push(this.fb.group({
        rawItem: new FormControl(x.id, Validators.required),
        name: new FormControl(x.name, Validators.required),
        assignedQuantity: new FormControl('', Validators.required),
        thresHoldQuantity: new FormControl('', Validators.required),
      }, Validators.required));
    }
    this.dataForm.setControl('rawitems', formArray)
  }


  submit() {

    // alert('submit method')
    console.log("value", this.dataForm.value, this.dataForm.invalid);
    console.log("data", this.data);


    if (!this.dataForm.invalid) {
      let data = this.data
      delete data.data.selectedEquipment;
      delete data.data.selectedRawItems
      let data2 = {};
      data2['date'] = moment(data.data.selectedDate).utc().valueOf()
      data2['vendor'] = data.data.selectedVendor.id;
      data2['foodTruck'] = data.data.selectedFoodTruck.id;
      data2['geoFence'] = data.data.selectedGeofence
      data2['equipment'] = this.dataForm.get('equipment').value
      data2['rawItems'] = this.dataForm.get('rawitems').value
      console.log(data2);


      this.dialogRef.close(data2)
    } else {
      this.commonService.errorToast('PLease Fill all the details')
    }

  }
}
