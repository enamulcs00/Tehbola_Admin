import { Component, OnInit, AfterViewInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "src/services/api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { UrlService } from "src/services/url.service";
import { CommonService } from "src/services/common.service";

@Component({
  selector: "app-editprofile",
  templateUrl: "./editprofile.component.html",
  styleUrls: ["./editprofile.component.scss"],
})
export class EditprofileComponent implements OnInit, AfterViewInit {
  //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
  //Add 'implements AfterViewInit' to the class.

  imagePath: any;
  updateProfileForm: FormGroup;
  imageFile: any;
  sub: any;
  id: any;
  profileData;
  submitted: boolean;
  firstname: any;
  lastName: any;
  address: any;
  countryCode: any;
  phone: any;
  showProfilePic;
  progress: boolean = false;

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private urlService: UrlService,
    private router: Router
  ) {
    this.sub = this.route.queryParams.subscribe((params) => {
      // Defaults to 0 if no query param provided.
      this.id = params["id"];
    });

    this.imagePath = this.urlService.imageUrl;

    this.apiService.getProfile().subscribe((res) => {
      this.profileData = res.data;

      this.firstname = this.profileData.firstName;
      this.lastName = this.profileData.lastName;
      this.countryCode = this.profileData.countryCode;
      this.phone = this.profileData.phone;
      this.showProfilePic = this.profileData.profilePic;

      this.setValue();
    });
  }

  imagePreview: any;
  ngOnInit() {
    this.updateProfileForm = this.fb.group({
      firstName: ["", [Validators.required, Validators.maxLength(25)]],
      lastName: ["", [Validators.required, Validators.maxLength(25)]],
      countryCode: ["", Validators.required],
      phone: ["", Validators.required],
      profilePic1: [""],
      profilePic: [],
    });
  }
  ngAfterViewInit(): void {}

  get f() {
    return this.updateProfileForm.controls;
  }

  setValue() {
    this.updateProfileForm.controls["firstName"].setValue(this.firstname);
    this.updateProfileForm.controls["lastName"].setValue(this.lastName);
    this.updateProfileForm.controls["countryCode"].setValue(this.countryCode);
    this.updateProfileForm.controls["phone"].setValue(this.phone);
    this.updateProfileForm.controls["profilePic1"].setValue(
      this.showProfilePic
    );
  }

  picUploader: boolean;
  async profilePic(event) {
    this.picUploader = true;
    if (event.target.files && event.target.files[0]) {
      this.imageFile = event.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.imagePreview = event.target.result;

        this.updateProfileForm.controls["profilePic1"].patchValue(
          this.imageFile
        );
      };
    }
  }

  submit() {
    this.submitted = true;
    if (this.submitted && this.updateProfileForm.valid) {
      const data = new FormData();
      if (this.picUploader === true) {
        data.append("profilePic", this.imageFile, this.imageFile.name);
      }
      data.append("firstName", this.updateProfileForm.get("firstName").value),
        data.append("lastName", this.updateProfileForm.get("lastName").value),
        data.append("email", this.profileData.email),
        data.append(
          "countryCode",
          this.updateProfileForm.get("countryCode").value
        ),
        data.append("phone", this.updateProfileForm.get("phone").value),
        (this.progress = true);
      this.apiService.updateProfile(data).subscribe((res) => {
        if (res.success) {
          this.progress = false;
          this.commonService.successToast(res.message);
          this.router.navigate(["profile"]);
        } else {
          this.progress = false;
          this.commonService.errorToast(res.message);
        }
      });
    } else {
      console.log("invalid");
    }
  }
}
