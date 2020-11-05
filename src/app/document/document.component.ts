import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { UrlService } from 'src/services/url.service';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit {
  sub: any;
  id: any;
  documentList: any;
  baseUrl: string;
  userType: string

  constructor(private apiService: ApiService, private route: ActivatedRoute, private urlService: UrlService) {
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.id = params['id'];
        this.userType = params['role']
      });

    this.baseUrl = this.urlService.imageUrl
  }

  ngOnInit() {

    this.getDocuement()
  }

  getDocuement() {
    let body = {
      userId: this.id
    }
    this.apiService.getDocument(body).subscribe(res => {
      console.log(res);
      if (res.success) {
        this.documentList = res.data
      }
    })
  }

  back() {
    window.history.back()
  }

}
