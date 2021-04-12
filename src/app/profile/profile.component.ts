import { Component, OnInit, AfterViewInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "src/services/api.service";
import { UrlService } from "src/services/url.service";
import { CommonService } from "src/services/common.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  sub: any;
  source: any;
  receiver: any;
  updateProfileForm: FormGroup;
  progress: boolean = false;
  submitted: boolean;
  profileData: any;
  imageUrl: any;
  id: any;

  showProfilePic;

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private router: Router,
    private apiService: ApiService,
    private urlService: UrlService,
    private route: ActivatedRoute
  ) {
    this.sub = this.route.queryParams.subscribe((params) => {
      // Defaults to 0 if no query param provided.
      this.id = params["id"];
    });

    this.apiService.getProfile().subscribe((res) => {
      this.profileData = res.data;
      this.source = this.profileData.source;
      this.receiver = this.profileData.receiver;
      this.setValue();
    });
  }

  ngOnInit() {
    this.imageUrl = this.urlService.imageUrl;
    this.apiService.getProfile().subscribe((res) => {
      console.log("profile Data", res.data);
      this.profileData = res.data;
    });

    // Validator for Referral
    this.updateProfileForm = this.fb.group({
      source: ["", [Validators.required, Validators.max(100)]],
      receiver: ["", [Validators.required, Validators.max(100)]],
    });
  }

  get f() {
    return this.updateProfileForm.controls;
  }

  // Edit Profile details Route
  goToeditprofile() {
    this.router.navigate(["editprofile"]);
  }

  // Set initial values in the Input
  setValue() {
    this.updateProfileForm.controls["source"].setValue(this.source);
    this.updateProfileForm.controls["receiver"].setValue(this.receiver);
  }

  // Update Referral Codes
  updateRef() {
    this.submitted = true;
    if (this.submitted && this.updateProfileForm.valid) {
      const data = new FormData();

      data.append("source", this.updateProfileForm.get("source").value),
        data.append("receiver", this.updateProfileForm.get("receiver").value),
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
