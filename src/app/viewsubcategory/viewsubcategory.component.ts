import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-viewsubcategory',
  templateUrl: './viewsubcategory.component.html',
  styleUrls: ['./viewsubcategory.component.scss']
})
export class ViewsubcategoryComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  goTosubcategory(){
    this.router.navigate(['subcategory'])
  }
}
