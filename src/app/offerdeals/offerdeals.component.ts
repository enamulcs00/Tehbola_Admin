import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { PageEvent } from '@angular/material/paginator';
import { UrlService } from 'src/services/url.service';

@Component({
  selector: 'app-offerdeals',
  templateUrl: './offerdeals.component.html',
  styleUrls: ['./offerdeals.component.scss']
})
export class OfferdealsComponent implements OnInit {

  page = 1
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent;
  filterBy: string = '';
  search: string = '';
  flagData: boolean
  bannerList: any
  imagePath:any
  constructor(private router: Router, private apiServce: ApiService,private urlService:UrlService) { 
this.imagePath=this.urlService.imageUrl;

  }

  ngOnInit() {
    this.getAllDiscount()
  }

  getAllDiscount() {
    debugger
    this.apiServce.getAllDiscount(this.page, this.pageSize, this.filterBy, this.search).subscribe((res) => {
      if (res) {
        if (res.data.length > 0) {
          this.flagData = false
          this.bannerList = res.data
          console.log(this.bannerList)
        } else {
          this.flagData = true
        }
      };

    })

  }
  goToaddoffers() {
    this.router.navigate(['addoffers'])
  }
  goToviewdiscount() {
    this.router.navigate(['viewdiscount'])
  }
  goToeditdiscount() {
    this.router.navigate(['editdiscount'])
  }
}
