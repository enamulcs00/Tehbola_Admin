import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/services/api.service';
declare var $: any;
@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.scss']
})
export class ViewProductComponent implements OnInit {
  name = 'Angular 4';
  name1: any
  url: any;
  id: any;
  sub: any
  readUrl(event: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.url = (<FileReader>event.target).result;
      }

      reader.readAsDataURL(event.target.files[0]);
      console.log(reader);
    }
  }
  constructor(private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService) {
    // this.id = this.route.snapshot.params['id'];
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.id = params['id'];
        this.name1 = params['name']
      });
    alert(this.id)
    this.apiService.viewProduct(this.id).subscribe(res => {
      console.log(res);
    })
  }

  ngOnInit() {
    $('.genral_product').hide();
    $('.genral_product.active_product').show();

    $('.add_product_list').click(function () {
      $('.genral_product').hide();
      $('.genral_product.active_product').hide();
      var product_rel = $(this).attr('rel');
      $('#' + product_rel).show();
    });
  }
  goToproduct() {
    // alert(this.id)
    this.router.navigate(['/product'])
  }
}


