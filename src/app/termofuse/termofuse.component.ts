import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-termofuse',
  templateUrl: './termofuse.component.html',
  styleUrls: ['./termofuse.component.scss']
})
export class TermofuseComponent implements OnInit {

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