import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

    constructor(private router: Router) { }

  ngOnInit() {
  }
 
 goToaddcategory() {
    this.router.navigate(['addcategory'])
  }
   goToviewcategory() {
    this.router.navigate(['viewcategory'])
  }
     goToeditcategory() {
    this.router.navigate(['editcategory'])
  }
  //   goTosubcategory() {
  //   this.router.navigate(['/subcategory'])
  // }
 
}
