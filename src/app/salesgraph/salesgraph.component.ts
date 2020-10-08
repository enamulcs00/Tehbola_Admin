import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { chartData } from '../chartData';
import { ApiService } from 'src/services/api.service';
declare var $: any;

@Component({
  selector: 'app-salesgraph',
  templateUrl: './salesgraph.component.html',
  styleUrls: ['./salesgraph.component.scss']
})
export class SalesgraphComponent implements OnInit {

  period = 'monthly'

  history = window.history

  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  public barChartLabels: Label[]
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];

  public barChartData: ChartDataSets[]

  data: { barChartOptions: ChartOptions; barChartLabels: Label[]; barChartType: ChartType; barChartLegend: boolean; barChartPlugins: (typeof pluginDataLabels)[]; barChartData: ChartDataSets[]; };
  chartReady: boolean;

  constructor(private apiService: ApiService) {
    this.getData()
  }

  getData() {
    // debugger
    let array = [];
    let body = {
      'type': this.period
    }
    this.apiService.getSalesGraph(body).subscribe(res => {
      console.log(res);
      let data = res.data.length
      for (let i = 0; i < data; i++) {
        if (this.period == 'monthly') {

          array.push('Week' + ' ' + [i + 1]);

        }
        if (this.period == 'weekly') {

          array.push('Day' + ' ' + [i + 1]);

        }
        if (this.period == 'yearly') {

          array.push('Month' + ' ' + [i + 1]);

        }

      }
      this.barChartLabels = array;

      // public barChartData: ChartDataSets[] = [
      //     { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
      //     // { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
      //   ];
      this.barChartData = [{ data: res.data, label: this.period + " " + 'Sale' }]

      this.barChartOptions = this.barChartOptions;
      // this.barChartLabels = this.barChartLabels;
      this.barChartType = 'bar';
      this.barChartLegend = true;
      this.barChartPlugins = this.barChartPlugins;
      // this.barChartData = this.barChartData;
      console.log("labels: ", this.barChartLabels);
      console.log("data: ", this.barChartData);
      console.log("options: ", this.barChartOptions);

      this.chartReady = true


    });

  }

  periodSelected(e) {
    this.period = e.target.value;
    this.getData()
    this.history.back()

  }

  goTosales() {
    this.history.back()

  }


  ngOnInit() {

    // console.log("From sales", this.data);

  }
  // fetchData() {
  //   var jsonify = res => res.json();
  //   var dataFetch = fetch(
  //     "https://s3.eu-central-1.amazonaws.com/fusion.store/ft/data/plotting-multiple-series-on-time-axis-data.json"
  //   ).then(jsonify);
  //   var schemaFetch = fetch(
  //     "https://s3.eu-central-1.amazonaws.com/fusion.store/ft/schema/plotting-multiple-series-on-time-axis-schema.json"
  //   ).then(jsonify);

  //   Promise.all([dataFetch, schemaFetch]).then(res => {
  //     const [data, schema] = res;
  //     // First we are creating a DataStore
  //     const fusionDataStore = new FusionCharts.DataStore();
  //     // After that we are creating a DataTable by passing our data and schema as arguments
  //     const fusionTable = fusionDataStore.createDataTable(data, schema);
  //     // Afet that we simply mutated our timeseries datasource by attaching the above
  //     // DataTable into its data property.
  //     this.dataSource.data = fusionTable;
  //   });
  // }
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  // public randomize(): void {
  //   // Only Change 3 values
  //   const data = [
  //     Math.round(Math.random() * 100),
  //     59,
  //     80,
  //     (Math.random() * 100),
  //     56,
  //     (Math.random() * 100),
  //     40];
  //   this.barChartData[0].data = data;
  // 

}
