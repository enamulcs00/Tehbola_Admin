import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { UrlService } from 'src/services/url.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  imageUrl: any
  constructor(private router: Router, private apiService: ApiService, private urlService: UrlService) {

  }
  profileData: any;

  ngOnInit() {
    this.imageUrl = this.urlService.imageUrl
    // this.apiService.getProfile().subscribe((res) => {
    //   console.log(res.data)
    //   this.profileData = res.data

    // });

  }
  goToeditprofile(id) {
    console.log(id)
    this.router.navigate(['editprofile'], { queryParams: { 'id': id } })

  }
}
