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

  constructor(private app: AppService) { }

  ngOnInit() {
    this.canvas = document.getElementById('myChart');
    this.ctx = this.canvas.getContext('2d');

    this.app.GET_METHOD(this.app.route.api.gTCharts + this.app.account_info.organization_id).subscribe((response:any) => {
        let data = [];
        if(response.success) {
           response.data.forEach(element => {
              data.push(element.total);
           });
           let myChart = new Chart(this.ctx, {
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
                        'rgba(240, 214, 86, 1)',
                        'rgba(180, 222, 86, 1)',
                        'rgba(230, 206, 99, 1)',
                        'rgba(260, 206, 40, 1)',
                        'rgba(270, 205, 84, 1)',
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

}
