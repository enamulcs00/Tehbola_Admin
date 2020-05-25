import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addinventory',
  templateUrl: './addinventory.component.html',
  styleUrls: ['./addinventory.component.scss']
})
export class AddinventoryComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  goToinventory() {
    this.router.navigate(['/inventory'])
  };
}
