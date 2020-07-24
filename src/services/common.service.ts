import { Injectable } from "@angular/core";
//import { NgxSpinnerService } from "ngx-spinner";
import { ToastrManager } from "ng6-toastr-notifications";
import { HttpHeaders, HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class CommonService {
  baseUrl = "https://appgrowthcompany.com:3000/v1/admin";
  imageUrl = "https://appgrowthcompany.com:3000";
  // https://appgrowthcompany.com:3000/
  //http://192.168.1.98:3000
  constructor(
   // private spinner: NgxSpinnerService,
    private toaster: ToastrManager,
    // private api: ApiService,
    private http: HttpClient
  ) { }
//   showSpinner() {
//     this.spinner.show();
//   }
//   hideSpinner() {
//     this.spinner.hide();
//   }
  successToast(message) {
    this.toaster.successToastr(message, "", {
      maxShown: 1
    });
  }
  errorToast(message) {
    this.toaster.errorToastr(message);
  }
}
