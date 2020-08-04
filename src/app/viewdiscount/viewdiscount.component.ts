import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { UrlService } from 'src/services/url.service';

interface Ready {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-viewdiscount',
  templateUrl: './viewdiscount.component.html',
  styleUrls: ['./viewdiscount.component.scss']
})
export class ViewdiscountComponent implements OnInit {
  pick: Ready[] = [
    { value: 'Lorem ipsum', viewValue: 'Lorem ipsum' },
    { value: 'Lorem ipsum', viewValue: 'Lorem ipsum' },
    { value: 'Lorem ipsum', viewValue: 'Lorem ipsum' },
    { value: 'Lorem ipsum', viewValue: 'Lorem ipsum' }
  ];
  sub: any;
  id: any;

  bannerDetails: any
  imagePath: any;
  constructor(private router: Router, private route: ActivatedRoute, private apiService: ApiService, private urlService: UrlService) {

    this.imagePath = this.urlService.imageUrl;
  }

  ngOnInit() {
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.id = params['id'];
      });
    this.getDiscount(this.id)


  }
  getDiscount(id) {

    this.apiService.getDisountDetails(id).subscribe((res) => {
      if (res.success) {
        console.log(res.data);
        this.bannerDetails = {
          'name': res.data.name,
          'name_ar': res.data.name_ar,
          //'categoryName': res.data.offer.list.name,
          'type': res.data.type,
          'discount': res.data.discount + "%",
          'startDate': res.data.startDate,
          'endDate': res.data.endDate,
          'image': res.data.image,
          'status': res.data.status

        }

      }
    })
  }

  goToofferdeals() {
    this.router.navigate(['offerdeals'])
  }

}
