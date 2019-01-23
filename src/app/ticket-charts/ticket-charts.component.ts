import { Component, OnInit } from '@angular/core';
import{AppService} from "../app.service";
import * as Chart from 'chart.js';

@Component({
  selector: 'app-ticket-charts',
  templateUrl: './ticket-charts.component.html',
  styleUrls: ['./ticket-charts.component.css']
})
export class TicketChartsComponent implements OnInit {
  canvas: any;
  ctx: any;
  myChart: any;
  listYears: Array<any> = [];

  constructor(private app: AppService) { }

  ngOnInit() {
    this.canvas = document.getElementById('myChart');
    this.ctx = this.canvas.getContext('2d');

    //Lets get the list of Years...
    this.app.GET_METHOD(this.app.route.api.gLYears).subscribe((response: any) => {
       
        if(response) {
          let date = new Date();
          this.listYears = response['years'];
          this.listYears.forEach(element => {
           
            element.active = (date.getFullYear() == element.yr) ? true : false;
          });
        }
       
    });

    this.app.GET_METHOD(this.app.route.api.gTCharts + ((this.app.account_info.organization_id)? this.app.account_info.organization_id : 6)).subscribe((response:any) => {
        let data = [];
        if(response.success) {
           response.data.forEach(element => {
              data.push(element.total);
           });
           this.myChart = new Chart(this.ctx, {
            type: 'pie',
            data: {
                labels: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEPT", "OCT", "NOV", "DEC"],
                datasets: [{
                    label: '# of Tickets',
                    data: data,
                    
                    backgroundColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(63, 127, 191, 1)',
                        'rgba(127, 63, 191, 1)',
                        'rgba(0, 0, 0, 1)',
                        'rgba(255, 255, 255, 1)',
                        'rgba(255, 255, 0, 1)',
                        'rgba(0, 121, 107, 1)',
                        'rgba(0, 188, 212, 1)',
                        'rgba(100, 122, 70, 1)',
                        'rgba(255, 150, 46, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
              responsive: false,
              display:true
            }
          });

        }

    });

        
  }

  onListClick(year) {

    this.listYears.forEach(element => {
        element.active = false;
        
    });

    year.active = true;


    var url = this.app.route.api.gChartY +  this.app.account_info.organization_id + "&y=" + year.yr;
    


    let data = [];
    
  

    this.app.GET_METHOD(url).subscribe((response: any) => {
        if(response) {
         
          response.data.forEach(element => {
            data.push(element.total);
          });

          this.myChart.config =  {
            type: 'pie',
            data: {
                labels: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEPT", "OCT", "NOV", "DEC"],
                datasets: [{
                    label: '# of Tickets',
                    data: data,
                    
                    backgroundColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(63, 127, 191, 1)',
                        'rgba(127, 63, 191, 1)',
                        'rgba(0, 0, 0, 1)',
                        'rgba(255, 255, 255, 1)',
                        'rgba(255, 255, 0, 1)',
                        'rgba(0, 121, 107, 1)',
                        'rgba(0, 188, 212, 1)',
                        'rgba(100, 122, 70, 1)',
                        'rgba(255, 150, 46, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
              responsive: false,
              display:true
            }
          }
          this.myChart.update();
          console.log(this.myChart);
            
        
        }
    });
  }

}
