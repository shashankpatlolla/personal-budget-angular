import { AfterViewInit, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js/auto';
@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements AfterViewInit{

  // public dataSource ={
  //   datasets: [
  //     {
  //         data: [],
  //         backgroundColor: [
  //             '#ffcd56',
  //             '#ff6384',
  //             '#36a2eb',
  //             '#fd6b19',
  //         ]
  //     }
  // ],
  // labels: []
  // };
  public dataSource: { datasets: { data: number[]; backgroundColor: string[] }[]; labels: string[] } = {
    datasets: [
      {
        data: [],
        backgroundColor: [
          '#ffcd56',
          '#ff6384',
          '#36a2eb',
          '#fd6b19',
        ]
      }
    ],
    labels: []
  };

  constructor(private http: HttpClient){  }

  ngAfterViewInit(): void {
    this.http.get('http://localhost:3005/budget')
    .subscribe((res: any) => {
      //console.log(res);
      for (var i = 0; i < res.myBudget.length; i++) {
        this.dataSource.datasets[0].data[i] = res.myBudget[i].budget;
        this.dataSource.labels[i] = res.myBudget[i].title;
        this.createChart();
      }
    });
  }
  createChart()
  {
    var ctx = <HTMLCanvasElement>document.getElementById('myChart');
    //when calling Chart below, getting an error that canvas is already in use with the chartID.
    if (ctx && Chart.getChart(ctx)?.destroy) {
      Chart.getChart(ctx)?.destroy(); // Destroy the existing chart
    }
    var myPieChart = new Chart(ctx,
      {
        type: 'pie',
        data: this.dataSource
    });
  }
}
