import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  goToaddproduct() {
    this.router.navigate(['/addproduct'])
  }
  goToeditProduct() {
    this.router.navigate(['/editProduct'])
  }
  goToviewProduct() {
    this.router.navigate(['/viewProduct'])
  }
  goTovenderManagement(){
    this.router.navigate(['venderManagement'])
  }
  
}

