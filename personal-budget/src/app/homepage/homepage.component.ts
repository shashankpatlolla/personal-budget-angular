import { AfterViewInit, ElementRef,OnInit, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js/auto';
//import { select } from 'd3';
import * as d3 from 'd3';
import { DataService } from '../data.service';


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

  constructor(private http: HttpClient,private el: ElementRef, private dataService: DataService){  }

  ngOnInit(): void {
    this.fetchData(); // Fetch data from the service
  }

  fetchData(): void {
    this.dataService.fetchData().subscribe((res: any) => {
      this.dataSource.labels = res.myBudget.map((item: any) => item.title);
      this.dataSource.datasets[0].data = res.myBudget.map((item: any) => item.budget);
      this.createChart();
    });
    this.renderPieChart();
  }
  ngAfterViewInit(): void {
    /* this.http.get('http://localhost:3005/budget')
    .subscribe((res: any) => {
      //console.log(res);
      for (var i = 0; i < res.myBudget.length; i++) {
        this.dataSource.datasets[0].data[i] = res.myBudget[i].budget;
        this.dataSource.labels[i] = res.myBudget[i].title;
        this.createChart();
      }
    }); */
    //this.renderPieChart();
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




  renderPieChart(){
    const container = this.el.nativeElement.querySelector('#chart-container');
    var width = 600;
    var height = 400;
    var radius = 180;
    //const pie = d3.pie<number>();

    this.dataService.fetchData().subscribe((data: any) => {
      console.log(data.myBudget);

      const pie = d3.pie<{ title: string; budget: number }>().value((d) =>{ return d.budget});

      const arc = d3.arc<{ title: string; budget: number }>() // Specify the types for arc
      .innerRadius(0)
      .outerRadius(radius);

      var svg = d3.select(container)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


      var colorScale = d3.scaleOrdinal<string>()
        .domain(data.myBudget.map((d :{title : string}) =>{ d.title; }))
        .range(['#ffcd56',
        '#ff6384',
        '#36a2eb',]);
        //.range(['#FF5733','#3498DB','#27AE60','#9B59B6','#F1C40F','#34495E','#E74C3C']);

      const data_ready = pie(data.myBudget);

      // Create arcs for each data point
      var arcs = svg.selectAll(".arc")
          .data(data_ready)
          .enter()
          .append("g")
          .attr("class", "arc");

      arcs.append("path")
          .attr("d", (d : any) => arc(d) || '')
          .attr("fill", (d) => colorScale(d.data.title || ''));

      arcs.append("polyline")
          .attr("opacity",0.2)
          .attr("stroke", "black") // Line color
          .attr("stroke-width", 2) // Line width
          .attr("fill", "none") // No fill
          .attr("points", (d : any) => {
              var centroid = arc.centroid(d);
              var labelX = centroid[0]; // X-coordinate of the label
              var labelY = centroid[1]; // Y-coordinate of the label
              var midAngle = Math.atan2(labelY, labelX); // Calculate the midpoint angle

              var startX = 0;
              var startY = 0;
              var endX = Math.cos(midAngle) * (radius + 20); // Adjust the distance for the label outside the pie
              var endY = Math.sin(midAngle) * (radius + 20);
              return [startX, startY, endX, endY];
          });

      arcs.append("text")
          .attr("transform", (d : any) => {
              var centroid = arc.centroid(d);

              var labelX = centroid[0]; // X-coordinate of the label
              var labelY = centroid[1]; // Y-coordinate of the label
              var midAngle = Math.atan2(labelY, labelX); // Calculate the midpoint angle
              // Calculate the ending point of the polyline (outside the pie)
              var endX = Math.cos(midAngle) * (radius+20); // Adjust the distance for the label outside the pie
              var endY = Math.sin(midAngle) * (radius+20);

              // Calculate the new label position at the end of the polyline
              var labelPositionX = endX;
              var labelPositionY = endY;

              // Adjust the horizontal positioning to move the label outside the pie chart
              var textAnchor = labelPositionX > 0 ? "start" : "end";

              return "translate(" + labelPositionX + "," + labelPositionY + ")";
          })
          .attr("dy", "-0.5em")
          .attr("text-anchor", function(d) {
          return "end";})
          .text(function(d) { return d.data.title;});
  });
}
}
