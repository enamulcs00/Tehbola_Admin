import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { UrlService } from 'src/services/url.service';

interface Ready {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  imagePath: any
  profileData: any



  constructor(private router: Router, private apiService: ApiService, private urlService: UrlService) { }
  pick: Ready[] = [
    { value: '10 Min-0', viewValue: 'Arabic' },
    { value: '10 Min-1', viewValue: 'English' },
  ];
  ngOnInit() {
    this.imagePath = this.urlService.imageUrl;
    
    this.apiService.getProfile().subscribe((res) => {
      console.log(res)
      this.profileData = res.data

    })

  
  }

  getProfile() {
    this
  }
  goTologin() {
    this.router.navigate(['/login'])
  }
  goTonotification() {
    this.router.navigate(['notification'])
  }
  goToprofile() {
    this.router.navigate(['profile'])
  }
  goTochangepassword() {
    this.router.navigate(['changepassword'])
  }
}
