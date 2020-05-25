import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-viewcategory',
  templateUrl: './viewcategory.component.html',
  styleUrls: ['./viewcategory.component.scss']
})
export class ViewcategoryComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  goTocategory() {
    this.router.navigate(['/category'])
  }
}
