import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-returnpolicy',
  templateUrl: './returnpolicy.component.html',
  styleUrls: ['./returnpolicy.component.scss']
})
export class ReturnpolicyComponent implements OnInit {

  name = 'ng4-ckeditor';
  ckeConfig: any;
  mycontent: string;
  log: string = '';
  constructor() { 
    this.mycontent = `<p>Lorem ipsum Lorem ipsum</p>`;
  }

  ngOnInit() {
    this.ckeConfig = {
      allowedContent: false,
      extraPlugins: 'divarea',
      forcePasteAsPlainText: true
    };
  }
  onChange($event: any): void {
    console.log("onChange");
    //this.log += new Date() + "<br />";
  }

  onPaste($event: any): void {
    console.log("onPaste");
    //this.log += new Date() + "<br />";
  }

}
