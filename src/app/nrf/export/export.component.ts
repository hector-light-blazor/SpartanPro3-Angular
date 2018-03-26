import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.css']
})
export class ExportComponent implements OnInit {
  showDate: boolean = false;
  nrfs:any = [];
  from: string = "";
  to: string = "";

  constructor(private app: AppService) { 

  }

  ngOnInit() {
    
    // Download All information from database..
    this.app.GET_METHOD(this.app.route.api.gANRF).subscribe((response: any) => {
        this.nrfs = response;
    });
  }

  onFilterDate() {
     
    this.app.GET_METHOD(this.app.route.api.fNRF + this.from + "&t=" + this.to).subscribe((response:any) => {
      this.nrfs = response;
      this.showDate = false;
    });
    
  }
  onDownloadCurrent() {
    if(this.from && this.to) { // Download from filter
      window.open(this.app.url + this.app.route.api.dFNRF + this.from + "&t=" + this.to, "_self");
    }else { // Download ALL 
      window.open(this.app.url + this.app.route.api.dANRF, "_self");
    }

  }

}
