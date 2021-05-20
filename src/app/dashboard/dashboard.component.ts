import { Component, OnInit } from '@angular/core';
import * as FusionCharts from "fusioncharts";
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { ApiService } from 'src/services/api.service';
import { CommonService } from 'src/services/common.service';
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
  vendorFilter = 'weekly'
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
  public barChartOptionsVendor: ChartOptions = {
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
  public barChartLabelVendor: Label[];
  public barChartLabelrevenue: Label[];
  public barChartTypeVendor: ChartType = 'bar';
  public barChartLegendVendor = true;
  public barChartPluginsVendor = [pluginDataLabels];

  public barChartDataVendor: ChartDataSets[]
  public barChartDataRevenue: ChartDataSets[]
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


  public barChartLabelRevenue: Label[]
  public barChartTypeRevenue: ChartType = 'bar';
  public barChartLegendRevenue = true;
  public barChartPluginsRevenue = [pluginDataLabels];
  public barChartOptionsRevenue: ChartOptions = {
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

  data: { barChartOptions: ChartOptions; barChartLabels: Label[]; barChartType: ChartType; barChartLegend: boolean; barChartPlugins: (typeof pluginDataLabels)[]; barChartData: ChartDataSets[]; };
  chartReady: boolean;
  type: string;
  width: string;
  height: string;
  periodSale = 'weekly';
  dashboardData: any;
  salesListData: any;
  revenueFilter: string = 'weekly';
  roles: any;
  geofence: any = '';
  count: any = 999999999;
  pageGeofence = 1
  geofenceList: any;
  orderHistoryList: any;
  id: any='';
  filter: any='currentSales';
  constructor(private router: Router, private apiService: ApiService, private commonService:CommonService) {
    this.type = "timeseries";
    this.width = "100%";
    this.height = "400";
   
    this.roles = JSON.parse(this.apiService.getUser())

  }

  getAllGeofence() {
    let body = {
      page: this.pageGeofence,
      count: this.count
    }

    this.apiService.getAllGeofence(body).subscribe(res => {
      if (res.success) {
        this.geofenceList = res.data
        console.log(this.geofenceList);
      }

    })
  }



  geofenceChange(eve) {
    console.log(eve);
    if(eve==''){
      this.flag=false
      this.geofence = eve;
      this.getDashboardData(this.periodSale, this.revenueFilter)
  
    }else{
      this.flag=true
      this.geofence = eve;
      this.getDashboardData(this.periodSale, this.revenueFilter)
  
    }

  }


  getDashboardData(typeSale, revenueFilter) {
    let body = {
      salesFilterType: typeSale,
      geofence: this.geofence,
      revenueFilterType: revenueFilter
    }
    console.log(body);
    this.apiService.getDashboardData(body).subscribe(res => {
      if (res.success) {
        this.dashboardData = res.data;
        this.salesData(this.dashboardData.salesGraph);
        this.revenueData(this.dashboardData.revenueGraph)
      }
    })
  }

  ngOnInit() {
    // This is the dataSource of the chart
    this.getDashboardData(this.periodSale, this.revenueFilter)
    this.getAllGeofence()
    this.getbookingHistory()

  }


  getbookingHistory() {
    this.apiService.viewPurchaseHistory(this.page, this.pageSize, this.id,this.filter,this.filterBy ,this.search).subscribe((res) => {
      if (res.success) {
        if (res.data.length > 0) {
          this.flagData = false
          this.orderHistoryList = res.data
          this.length = res.total
        } else {
          this.flagData = true
          this.length=res.total
        }
      } else {
        this.commonService.errorToast(res.message)
      }
    });
  }

  salesData(graphData) {
    let array = []

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
    //     // { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' } 78,115,223,1
    //   ];
    this.barChartDataSale = [{ data: graphData, label: this.periodSale + " " + 'Sale', backgroundColor: 'rgba(78,115,223,1)', borderColor: 'rgba(78,115,223,1)', hoverBackgroundColor: 'rgba(78,115,223,1)', hoverBorderColor: 'rgba(78,115,223,1)' }]


    // this.barChartData = this.barChartData;

    this.chartReady = true


  }



  revenueData(revenueGraphData) {

    let array = []
    let data = revenueGraphData.length
    for (let i = 0; i < data; i++) {
      if (this.revenueFilter == 'monthly') {

        array.push('Week' + ' ' + [i + 1]);

      }
      if (this.revenueFilter == 'weekly') {

        array.push('Day' + ' ' + [i + 1]);

      }
      if (this.revenueFilter == 'yearly') {

        array.push('Month' + ' ' + [i + 1]);

      }

    }
    this.barChartLabelrevenue = array;

    // public barChartData: ChartDataSets[] = [
    //     { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    //     // { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }54,185,204,1
    //   ];
    this.barChartDataRevenue = [{ data: revenueGraphData, label: this.periodSale + " " + 'Revenue', backgroundColor: 'rgba(54,185,204,1)', borderColor: 'rgba(54,185,204,1)', hoverBackgroundColor: 'rgba(54,185,204,1)', hoverBorderColor: 'rgba(54,185,204,1)' }]


    // this.barChartData = this.barChartData;

    this.chartReady = true

  }



  periodChanged(e) {
    console.log('asdvsdf',e);
    
    this.periodSale = e;
    this.getDashboardData(this.periodSale, this.revenueFilter)
  }

  

  revenuePeriodChanged(e) {
    this.revenueFilter = e;
    this.getDashboardData(this.periodSale, this.revenueFilter)


  }

  filterSelected(e) {
    if (this.filterBy) {
      this.flag = true
    }
    else {
      this.flag = false
    }

   this.getbookingHistory()     

  }
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }


  searchMethod() {
    this.flagSearch = false
     this.getbookingHistory()
  }
  clearSearch() {
    this.flagSearch = true
    this.search = ''
     this.getbookingHistory()
  }

  productListAfterPageSizeChanged(e): any {

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
    this.getbookingHistory()
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

