import { Component, OnInit } from '@angular/core';
import * as FusionCharts from "fusioncharts";
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { ApiService } from 'src/services/api.service';
declare var $: any;

interface readOnly {
  viewValue: string,
  value: string
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  page = 1;
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent;
  filterBy: string = '';
  search: string = '';
  salesList = []
  status: number
  flagSearch: boolean = true;
  flagData: any;
  flag: any
  flagUserList: boolean = false;
  filterList: readOnly[] = [{ viewValue: 'New', value: 'New' },
  { viewValue: 'Accepted', value: 'Accepted' },
  { viewValue: 'Cancelled', value: 'Canceled' },
  { viewValue: 'Rejected', value: 'Rejected' },
  { viewValue: 'Packing', value: 'Packing' },
  { viewValue: 'Shipped', value: 'Shipped' },
  { viewValue: 'Delivered', value: 'Delivered' },
  { viewValue: 'Unwant', value: 'UnWant' },
  { viewValue: 'Picking', value: 'Picking' },
  { viewValue: 'Rescheduled', value: 'Rescheduled' },
  { viewValue: 'Picked For Shipping', value: 'pickedShipping' },
  { viewValue: 'Picked', value: 'Picked' },
  { viewValue: 'Picked and Delivered', value: 'PickedDelivered' }]
  srNo: number;
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
  public barChartLabels: Label[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];

  public barChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
  ];
  dataSource: any;
  public barChartOptionsSale: ChartOptions = {
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
  public barChartLabelSale: Label[]
  public barChartTypeSale: ChartType = 'bar';
  public barChartLegendSale = true;
  public barChartPluginsSale = [pluginDataLabels];

  public barChartDataSale: ChartDataSets[]

  data: { barChartOptions: ChartOptions; barChartLabels: Label[]; barChartType: ChartType; barChartLegend: boolean; barChartPlugins: (typeof pluginDataLabels)[]; barChartData: ChartDataSets[]; };
  chartReady: boolean;
  type: string;
  width: string;
  height: string;
  periodSale = 'weekly';
  dashboardData: any;
  salesListData: any;
  constructor(private router: Router, private apiService: ApiService) {
    this.type = "timeseries";
    this.width = "100%";
    this.height = "400";
    this.getDashboardData(this.page, this.pageSize, this.search, this.filterBy, this.periodSale)


  }

  getDashboardData(page, pageSize, search, filterBy, typeSale) {
    this.apiService.getDashboardData(page, pageSize, search, filterBy, typeSale).subscribe(res => {
      console.log(res);

      if (res.success) {

        this.dashboardData = res;
        this.salesListData = this.dashboardData.salesList;
        this.length = this.salesListData.length
        console.log("Dashboard Data:", this.dashboardData);

        this.salesData(this.dashboardData.graph)
      }
    })
  }

  ngOnInit() {
    // This is the dataSource of the chart


  }

  salesData(graphData) {
    let array = []
    console.log(graphData);
    let data = graphData.length
    for (let i = 0; i < data; i++) {
      if (this.periodSale == 'monthly') {

        array.push('Week' + ' ' + [i + 1]);

      }
      if (this.periodSale == 'weekly') {

        array.push('Day' + ' ' + [i + 1]);

      }
      if (this.periodSale == 'yearly') {

        array.push('Month' + ' ' + [i + 1]);

      }

    }
    this.barChartLabelSale = array;

    // public barChartData: ChartDataSets[] = [
    //     { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    //     // { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
    //   ];
    this.barChartDataSale = [{ data: graphData, label: this.periodSale + " " + 'Sale' }]


    // this.barChartData = this.barChartData;
    console.log("labels: ", this.barChartLabelSale);
    console.log("data: ", this.barChartDataSale);
    console.log("options: ", this.barChartOptionsSale);

    this.chartReady = true


  }

  periodChanged(e) {
    this.periodSale = e.target.value;
    this.getDashboardData(this.page, this.pageSize, this.search, this.filterBy, this.periodSale)
  }

  filterSelected(e) {
    console.log(e);
    if (this.filterBy) {
      this.flag = true
    }
    else {
      this.flag = false
    }
    console.log(e.target.value);

    this.filterBy = e.target.value

    this.getDashboardData(this.page, this.pageSize, this.search, this.filterBy, this.periodSale)

  }
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }


  searchMethod() {
    this.flagSearch = false
    this.getDashboardData(this.page, this.pageSize, this.search, this.filterBy, this.periodSale)
  }
  clearSearch() {
    this.flagSearch = true
    this.search = ''
    this.getDashboardData(this.page, this.pageSize, this.search, this.filterBy, this.periodSale)
  }

  productListAfterPageSizeChanged(e): any {

    console.log(e)
    if (e.pageIndex == 0) {
      this.page = 1;
      // this.page = e.pageIndex;
      //  this.srNo = e.pageIndex * e.pageSize
      this.flagUserList = false
    } else {
      if (e.previousPageIndex < e.pageIndex) {
        this.page = e.pageIndex + 1;
        this.srNo = e.pageIndex * e.pageSize
        this.flagUserList = true
      } else {
        this.page = e.pageIndex;
        this.srNo = e.pageIndex * e.pageSize
        this.flagUserList = true
      }

    }
    this.getDashboardData(this.page, this.pageSize, this.search, this.filterBy, this.periodSale)
  }



  goTosalesgraph() {
    this.router.navigate(['salesgraph'])
  }
  goToreveuegraph() {
    this.router.navigate(['reveuegraph'])
  }
  goToeditOrder() {
    this.router.navigate(['editOrder'])
  }
  goToviewOrder() {
    this.router.navigate(['viewOrder'])
  }
}

