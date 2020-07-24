import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/services/api.service';
interface Ready {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-add-vender',
  templateUrl: './add-vender.component.html',
  styleUrls: ['./add-vender.component.scss']
})
export class AddVenderComponent implements OnInit {
  addVendorForm: FormGroup
  submitted: boolean;
  constructor(private router: Router, private fb: FormBuilder, private apiService: ApiService) { }
  selectedFile: File
  ngOnInit() {
    this.addVendorForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
      email: ['', [Validators.required, Validators.email]],
      countryCode: ['', Validators.required],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required, Validators.maxLength(200)]],
      city: ['', [Validators.required, Validators.maxLength(50)]],
      state: ['', [Validators.required, Validators.maxLength(50)]],
      country: ['', [Validators.required, Validators.maxLength(50)]],
      vatNumber: ['', Validators.required],
      brnNumber: ['', Validators.required],
      vendorFile: ['', Validators.required],
      documentOne: [],
      company: ['', [Validators.required, Validators.maxLength(50)]],
    })

  }
  goTovendermanagement() {
    this.router.navigate(['venderManagement'])
  }

  countryCode(item) {
    this.addVendorForm.get('countryCode').setValue = item
    console.log(item)
  }
  get f() {
    return this.addVendorForm.controls
  }

  onFileChange(e) {
    if (e.target.files.length > 0) {
      this.selectedFile = e.target.files[0];
      // var reader = new FileReader();
      // var temp = reader.readAsDataURL(e.target.files[0]);
      // console.log(temp)
      this.addVendorForm.get('vendorFile').patchValue(this.selectedFile);
      // this.addVendorForm.patchValue({
      //   fileSource: file
      // });
      console.log(this.selectedFile)
    }
  }

  pick: Ready[] = [
    { value: 'Pending', viewValue: 'Pending' },
    { value: 'Active ', viewValue: 'Active' },
    { value: 'Inactive', viewValue: 'Inactive' }

  ];


  addVendor() {

    this.submitted = true
    if (this.submitted && this.addVendorForm.valid) {
      const data = new FormData();
      // console.log(body)
      data.append('firstName', this.addVendorForm.get('firstName').value),
        data.append('lastName', this.addVendorForm.get('lastName').value),
        data.append('email', this.addVendorForm.get('email').value),
        data.append('phone', this.addVendorForm.get('phone').value),
        data.append('countryCode', this.addVendorForm.get('countryCode').value),
        data.append('address', this.addVendorForm.get('address').value),
        data.append('city', this.addVendorForm.get('city').value),
        data.append('state', this.addVendorForm.get('state').value),
        data.append('country', this.addVendorForm.get('country').value),
        data.append('vatNumber', this.addVendorForm.get('vatNumber').value),
        data.append('brnNumber', this.addVendorForm.get('brnNumber').value),
        data.append('company', this.addVendorForm.get('company').value),
        data.append('documentOne', this.selectedFile, this.selectedFile.name)



      this.apiService.addVendor(data).subscribe((res) => {
        if (res) {
          console.log(res)
          this.router.navigate(['venderManagement'])
        }
      });
    } else {

      this.addVendorForm.reset
    }



  }

}
