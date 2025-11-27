import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { saveOrderData } from 'src/app/orderpages/orderdetailsdrawer/orderdetailsdrawer.component';
import { customer } from 'src/app/Pages/Models/customer';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';

@Component({
  selector: 'app-shoporderdetails',
  templateUrl: './shoporderdetails.component.html',
  styleUrls: ['./shoporderdetails.component.css'],
})
export class ShoporderdetailsComponent {
  sortKey1: string = 'ID'

  newdataList: any = [{ id: 1 }];

  value1: any = '';
  value2: any = '';
  @Input() TYPE_FOR_LOCAL = '';
  @Input() FILTER_ID_FOR_LOCAL: any = null;
  roleId = sessionStorage.getItem('roleId');
  @Input() TERRITORY_IDS: any = [];
  decreptedroleId = 0;
  pageIndex = 1;
  IS_SHIP_ORDER: any = ''
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'ITEM_ID';
  loadingRecords: boolean = false;
  totalRecords: any = 0;
  invt_ids: any;
  selecteddata: any;
  LoadGodown: any = [];
  selectedoutfordate: any = 'OS'
  COURIER_TRACKING_URL: any;
  @Input()
  drawerClose!: Function;
  @Input() vieworderdata: any;
  @Input() teritoryData: any;
  @Input() orderid: any;
  @Input() orderDetails: any;
  SelectWEIGHT: any;
  SelectHEIGHT: any;
  SelectLENGTH: any;
  SelectBREADTH: any;
  date = new Date();
  warehousedetails: any;
  Courierdetails: any;
  destPINCODE: any;
  desWarehousename: any;
  loadinventories: any = [];
  DATETIME: Date;
  orderData: any = new saveOrderData();
  techData: any = [];
  TECHNICIAN_NAME: any;
  selectedTechnicianName: string = '';
  checked = true;
  showactionlog: boolean = false;
  showinvoicetable: boolean = false;
  showmap: boolean = false;

  drawerDatapastorder: any;
  drawerTitlepastorder!: string;
  modalStyle = {
    top: '20px',
  };
  checked1 = false;
  dataList: any = [{ id: 1 }];
  TIME: any;
  DATE: any;
  isSpinning: boolean = false;
  BoadAccept: boolean = false;
  expectedDate: Date | null = null;
  time: any;
  orderDetailsData: any = [];
  jobCardIds: any[] = [];
  timelineData: any = [];
  invoiceData: any = [];
  drawerCustomerRatingTitle!: string;
  drawerCustomerRatingVisible: boolean = false;
  drawerRatingVisible: boolean = false;
  drawerDataRating: any;

  STATUS: string = ''; // This will store the selected value of the radio button
  data = {
    REMARK: '',
  };
  showjobcard: boolean = true;
  showverification: boolean = false;
  showchat: boolean = false;
  userId = sessionStorage.getItem('userId');
  decrepteduserIDString = '';
  decrepteduserID = 0;
  openModal = false;
  public commonFunction = new CommonFunctionService();

  skills: any[] = [];
  jobdetails: any = '';
  estimatetime: any = 0;
  selectService: any;
  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService,
    private datePipe: DatePipe,
    private router: Router,
    private sanitizer: DomSanitizer
  ) { }
  ngOnInit() {
    var decreptedroleIdString = this.roleId
      ? this.commonFunction.decryptdata(this.roleId)
      : '';
    this.decreptedroleId = parseInt(decreptedroleIdString, 10);

    this.decrepteduserIDString = this.userId
      ? this.commonFunction.decryptdata(this.userId)
      : '';
    this.decrepteduserID = parseInt(this.decrepteduserIDString, 10);

    this.chatfilter = ' AND ORDER_ID = ' + this.orderDetails.ID;
    this.invoicefilter = ' AND ORDER_ID = ' + this.orderDetails.ID;
    this.actionfilter = " AND ACTION_LOG_TYPE IN('O')" + this.invoicefilter;
    this.getwarehouse();
    this.invt_ids = this.vieworderdata['detailsData'].map(
      (warehouse) => warehouse.INVENTORY_ID
    );
    if (this.vieworderdata.orderData[0]['ORDER_STATUS'] == 'OP') {
      this.selecteddata = 'OK';
    } else if (this.vieworderdata.orderData[0]['ORDER_STATUS'] == 'OK') {
      if (this.vieworderdata.orderData[0]['IS_SHIP_ORDER']) {
        this.selecteddata = 'SC';
      } else {
        this.selecteddata = 'DO';
      }
    } else if (this.vieworderdata.orderData[0]['ORDER_STATUS'] == 'SC') {
      this.selecteddata = 'AO';
    } else if (this.vieworderdata.orderData[0]['ORDER_STATUS'] == 'AO') {
      this.selecteddata = 'GL';
    } else if (this.vieworderdata.orderData[0]['ORDER_STATUS'] == 'GL') {
      this.selecteddata = 'SP';
    } else {
      this.selecteddata = 'OD';
    }
    this.expectedDate = new Date();

    if (
      this.vieworderdata.orderData[0]['WAREHOUSE_DETAILS'] !== null &&
      this.vieworderdata.orderData[0]['WAREHOUSE_DETAILS'] !== undefined
    ) {
      this.warehousedetails = JSON.parse(
        this.vieworderdata.orderData[0]['WAREHOUSE_DETAILS']
      );
      this.desWarehousename = this.warehousedetails[0]['NAME'];
      this.destPINCODE = this.warehousedetails[0]['PINCODE'].split('-')[0];
    }



    if (
      this.vieworderdata.orderData[0]['COURIER_DETAILS'] !== null &&
      this.vieworderdata.orderData[0]['COURIER_DETAILS'] !== undefined
    ) {
      this.Courierdetails = JSON.parse(
        this.vieworderdata.orderData[0]['COURIER_DETAILS']
      );
    }
    const now = new Date();
    this.value1 = this.datePipe.transform(new Date(now.getFullYear(), now.getMonth(), 1), 'yyyy-MM-dd');
    this.value2 = this.datePipe.transform(new Date(now.getFullYear(), now.getMonth() + 1, 0), 'yyyy-MM-dd');
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // Format the dates using DatePipe
    const formattedStartDate: any = this.datePipe.transform(startOfMonth, 'yyyy-MM-dd');
    const formattedEndDate: any = this.datePipe.transform(endOfMonth, 'yyyy-MM-dd');

    this.selectedDate = [formattedStartDate, formattedEndDate];
  }
  close(): void {
    this.drawerClose();
  }
  gettotal(value1: any, value2: any) {
    return Number(value1) * Number(value2);
  }

  changestagetye(data: any) {
    if (data === 'OK') {
      this.SelectWEIGHT = null;
      this.SelectHEIGHT = null;
      this.SelectLENGTH = null;
      this.SelectBREADTH = null;
    }
  }

  viewCustomerRating() {
    this.drawerCustomerRatingTitle = 'Rating';
    this.drawerDataRating = this.orderDetails;
    this.drawerCustomerRatingVisible = true;
  }

  WAREHOUSE_ID: any = '';
  CourierData: any = [];
  CourierData1: any = {
    "company_auto_shipment_insurance_setting": false,
    "covid_zones": {
      "delivery_zone": null,
      "pickup_zone": null
    },
    "currency": "INR",
    "data": {
      "available_courier_companies": [
        {
          "air_max_weight": "25.00",
          "assured_amount": 0,
          "base_courier_id": null,
          "base_weight": "",
          "blocked": 0,
          "call_before_delivery": "Available",
          "charge_weight": 1,
          "city": "Sangli",
          "cod": 1,
          "cod_charges": 0,
          "cod_multiplier": 0,
          "cost": "",
          "courier_company_id": 10,
          "courier_name": "Delhivery Air",
          "courier_type": "0",
          "coverage_charges": 0,
          "cutoff_time": "11:00",
          "delivery_boy_contact": "Not Available",
          "delivery_performance": 3.5,
          "description": "",
          "edd": "",
          "entry_tax": 0,
          "estimated_delivery_days": "3",
          "etd": "Apr 06, 2025",
          "etd_hours": 72,
          "freight_charge": 101.07,
          "id": 561562018,
          "is_custom_rate": 0,
          "is_hyperlocal": false,
          "is_international": 0,
          "is_rto_address_available": true,
          "is_surface": false,
          "local_region": 0,
          "metro": 0,
          "min_weight": 0.5,
          "mode": 1,
          "new_edd": 1,
          "odablock": false,
          "other_charges": 0,
          "others": "{\"allow_postcode_auto_sync\":1,\"cancel_real_time\":true,\"courier_available_for_payment_change\":1,\"fbs_amazon_Standard\":1,\"international_enabled\":1,\"is_cancel_courier\":1,\"is_edd_courier\":1,\"is_eway_bill_courier\":1,\"is_notify_cancel_courier\":1,\"is_warehouse_courier\":1,\"is_webhook_courier\":1,\"qr_pickrr_enable\":1}",
          "pickup_availability": "1",
          "pickup_performance": 4.3,
          "pickup_priority": "",
          "pickup_supress_hours": 0,
          "pod_available": "Instant",
          "postcode": "416416",
          "qc_courier": 0,
          "rank": "",
          "rate": 101.07,
          "rating": 2.5,
          "realtime_tracking": "Real Time",
          "region": 3,
          "rto_charges": 104.5,
          "rto_performance": 1,
          "seconds_left_for_pickup": 1130,
          "secure_shipment_disabled": false,
          "ship_type": 1,
          "state": "Maharashtra",
          "suppress_date": "Apr 03, 2025",
          "suppress_text": "",
          "suppression_dates": {
            "action_on": "2025-03-19 19:15:42",
            "blocked_fm": "",
            "blocked_lm": ""
          },
          "surface_max_weight": "0.00",
          "tracking_performance": 4.8,
          "volumetric_max_weight": null,
          "weight_cases": 4.6,
          "zone": "z_a"
        },
        {
          "air_max_weight": "0.00",
          "assured_amount": 0,
          "base_courier_id": null,
          "base_weight": "",
          "blocked": 0,
          "call_before_delivery": "Available",
          "charge_weight": 1,
          "city": "Sangli",
          "cod": 1,
          "cod_charges": 0,
          "cod_multiplier": 0,
          "cost": "",
          "courier_company_id": 43,
          "courier_name": "Delhivery Surface",
          "courier_type": "0",
          "coverage_charges": 0,
          "cutoff_time": "11:00",
          "delivery_boy_contact": "Not Available",
          "delivery_performance": 3.6,
          "description": "",
          "edd": "",
          "entry_tax": 0,
          "estimated_delivery_days": "3",
          "etd": "Apr 06, 2025",
          "etd_hours": 72,
          "freight_charge": 101.47,
          "id": 567399788,
          "is_custom_rate": 0,
          "is_hyperlocal": false,
          "is_international": 0,
          "is_rto_address_available": true,
          "is_surface": true,
          "local_region": 0,
          "metro": 0,
          "min_weight": 0.5,
          "mode": 0,
          "new_edd": 1,
          "odablock": false,
          "other_charges": 0,
          "others": "{\"allow_postcode_auto_sync\":1,\"cancel_real_time\":true,\"courier_available_for_payment_change\":1,\"fbs_amazon_Standard\":1,\"international_enabled\":1,\"is_edd_courier\":1,\"is_eway_bill_courier\":1,\"is_notify_cancel_courier\":1,\"is_warehouse_courier\":1,\"is_webhook_courier\":1,\"qr_pickrr_enable\":1}",
          "pickup_availability": "1",
          "pickup_performance": 5,
          "pickup_priority": "",
          "pickup_supress_hours": 0,
          "pod_available": "Instant",
          "postcode": "416416",
          "qc_courier": 0,
          "rank": "",
          "rate": 101.47,
          "rating": 4.5,
          "realtime_tracking": "Real Time",
          "region": 3,
          "rto_charges": 104.9,
          "rto_performance": 5,
          "seconds_left_for_pickup": 1130,
          "secure_shipment_disabled": false,
          "ship_type": 1,
          "state": "Maharashtra",
          "suppress_date": "Apr 03, 2025",
          "suppress_text": "",
          "suppression_dates": {
            "action_on": "2025-04-02 16:47:50",
            "blocked_fm": "",
            "blocked_lm": ""
          },
          "surface_max_weight": "4.00",
          "tracking_performance": 3.8,
          "volumetric_max_weight": null,
          "weight_cases": 4.6,
          "zone": "z_a"
        },
        {
          "air_max_weight": "0.00",
          "assured_amount": 0,
          "base_courier_id": null,
          "base_weight": "",
          "blocked": 0,
          "call_before_delivery": "Not Available",
          "charge_weight": 1,
          "city": "Sangli",
          "cod": 1,
          "cod_charges": 0,
          "cod_multiplier": 0,
          "cost": "",
          "courier_company_id": 29,
          "courier_name": "Amazon Shipping Surface 1kg",
          "courier_type": "0",
          "coverage_charges": 0,
          "cutoff_time": "09:00",
          "delivery_boy_contact": "Not Available",
          "delivery_performance": 5,
          "description": "",
          "edd": "",
          "entry_tax": 0,
          "estimated_delivery_days": "5",
          "etd": "Apr 08, 2025",
          "etd_hours": 119,
          "freight_charge": 78.8,
          "id": 567528364,
          "is_custom_rate": 0,
          "is_hyperlocal": false,
          "is_international": 0,
          "is_rto_address_available": false,
          "is_surface": true,
          "local_region": 0,
          "metro": 0,
          "min_weight": 1,
          "mode": 0,
          "new_edd": 1,
          "odablock": false,
          "other_charges": 0,
          "others": "{\"auto_pickup\":1,\"cancel_real_time\":true,\"is_cancellation_courier\":1,\"is_custom_courier\":1,\"is_edd_courier\":1,\"is_notify_cancel_courier\":1,\"is_webhook_courier\":1,\"min_breadth\":1,\"min_length\":1,\"wec\":1}",
          "pickup_availability": "0",
          "pickup_performance": 5,
          "pickup_priority": "",
          "pickup_supress_hours": 0,
          "pod_available": "On Request",
          "postcode": "416416",
          "qc_courier": 0,
          "rank": "",
          "rate": 78.8,
          "rating": 2.8,
          "realtime_tracking": "Real Time",
          "region": 3,
          "rto_charges": 78.8,
          "rto_performance": 1,
          "seconds_left_for_pickup": -6069,
          "secure_shipment_disabled": false,
          "ship_type": 1,
          "state": "MAHARASHTRA",
          "suppress_date": "Apr 04, 2025",
          "suppress_text": "",
          "suppression_dates": {
            "action_on": "2025-04-02 22:37:55",
            "blocked_fm": "",
            "blocked_lm": ""
          },
          "surface_max_weight": "1.00",
          "tracking_performance": 2,
          "volumetric_max_weight": null,
          "weight_cases": 4.6,
          "zone": "z_a"
        },
        {
          "air_max_weight": "0.00",
          "assured_amount": 0,
          "base_courier_id": null,
          "base_weight": "",
          "blocked": 0,
          "call_before_delivery": "Not Available",
          "charge_weight": 1,
          "city": "Sangli",
          "cod": 1,
          "cod_charges": 0,
          "cod_multiplier": 0,
          "cost": "",
          "courier_company_id": 142,
          "courier_name": "Amazon Prepaid Surface 500g",
          "courier_type": "0",
          "coverage_charges": 0,
          "cutoff_time": "09:00",
          "delivery_boy_contact": "Not Available",
          "delivery_performance": 5,
          "description": "",
          "edd": "",
          "entry_tax": 0,
          "estimated_delivery_days": "4",
          "etd": "Apr 07, 2025",
          "etd_hours": 95,
          "freight_charge": 82,
          "id": 567560552,
          "is_custom_rate": 0,
          "is_hyperlocal": false,
          "is_international": 0,
          "is_rto_address_available": false,
          "is_surface": true,
          "local_region": 0,
          "metro": 0,
          "min_weight": 0.5,
          "mode": 0,
          "new_edd": 1,
          "odablock": false,
          "other_charges": 0,
          "others": "{\"auto_pickup\":1,\"cancel_real_time\":true,\"is_cancellation_courier\":1,\"is_custom_courier\":1,\"is_edd_courier\":1,\"is_notify_cancel_courier\":1}",
          "pickup_availability": "0",
          "pickup_performance": 5,
          "pickup_priority": "",
          "pickup_supress_hours": 0,
          "pod_available": "On Request",
          "postcode": "416416",
          "qc_courier": 0,
          "rank": "",
          "rate": 82,
          "rating": 2.8,
          "realtime_tracking": "Real Time",
          "region": 3,
          "rto_charges": 82,
          "rto_performance": 1,
          "seconds_left_for_pickup": -6069,
          "secure_shipment_disabled": false,
          "ship_type": 1,
          "state": "MAHARASHTRA",
          "suppress_date": "Apr 04, 2025",
          "suppress_text": "",
          "suppression_dates": {
            "action_on": "2025-04-02 22:39:24",
            "blocked_fm": "",
            "blocked_lm": ""
          },
          "surface_max_weight": "1.00",
          "tracking_performance": 2,
          "volumetric_max_weight": null,
          "weight_cases": 4.6,
          "zone": "z_a"
        },
        {
          "air_max_weight": "35.00",
          "assured_amount": 0,
          "base_courier_id": null,
          "base_weight": "",
          "blocked": 0,
          "call_before_delivery": "Available",
          "charge_weight": 1,
          "city": "SANGLI",
          "cod": 0,
          "cod_charges": 0,
          "cod_multiplier": 0,
          "cost": "",
          "courier_company_id": 217,
          "courier_name": "India Post-Speed Post Air Prepaid",
          "courier_type": "0",
          "coverage_charges": 0,
          "cutoff_time": "10:00",
          "delivery_boy_contact": "Not Available",
          "delivery_performance": 4.5,
          "description": "",
          "edd": "",
          "entry_tax": 0,
          "estimated_delivery_days": "7",
          "etd": "Apr 10, 2025",
          "etd_hours": 162,
          "freight_charge": 76.7,
          "id": 480305405,
          "is_custom_rate": 0,
          "is_hyperlocal": false,
          "is_international": 0,
          "is_rto_address_available": true,
          "is_surface": false,
          "local_region": 0,
          "metro": 0,
          "min_weight": 0.05,
          "mode": 1,
          "new_edd": 0,
          "odablock": false,
          "other_charges": 0,
          "others": "{\"auto_pickup\":1,\"cancel_real_time\":true,\"is_cancellation_courier\":1,\"is_manual_courier\":1,\"is_notify_cancel_courier\":1,\"prefetch_awb\":1}",
          "pickup_availability": "0",
          "pickup_performance": 4.4,
          "pickup_priority": "",
          "pickup_supress_hours": 0,
          "pod_available": "On Request",
          "postcode": "416416",
          "qc_courier": 0,
          "rank": "",
          "rate": 76.7,
          "rating": 4.4,
          "realtime_tracking": "Real Time",
          "region": 3,
          "rto_charges": 0.01,
          "rto_performance": 4.4,
          "seconds_left_for_pickup": -2469,
          "secure_shipment_disabled": false,
          "ship_type": 1,
          "state": "MAHARASHTRA",
          "suppress_date": "Apr 04, 2025",
          "suppress_text": "",
          "suppression_dates": {
            "action_on": "2024-08-26 08:08:26",
            "delay_remark": "Festival",
            "delivery_delay_by": 2065762,
            "delivery_delay_days": "1",
            "delivery_delay_from": "2024-08-26",
            "delivery_delay_to": "2024-08-26",
            "pickup_delay_by": 2065762,
            "pickup_delay_days": "1",
            "pickup_delay_from": "2024-08-26",
            "pickup_delay_to": "2024-08-26"
          },
          "surface_max_weight": "0.00",
          "tracking_performance": 4.5,
          "volumetric_max_weight": 35,
          "weight_cases": 4.2,
          "zone": "z_b"
        },
        {
          "air_max_weight": "30.00",
          "assured_amount": 0,
          "base_courier_id": null,
          "base_weight": "",
          "blocked": 0,
          "call_before_delivery": "Available",
          "charge_weight": 1,
          "city": "SANGLI",
          "cod": 1,
          "cod_charges": 0,
          "cod_multiplier": 0,
          "cost": "",
          "courier_company_id": 228,
          "courier_name": "Ecom Air 500gm",
          "courier_type": "0",
          "coverage_charges": 0,
          "cutoff_time": "11:00",
          "delivery_boy_contact": "Not Available",
          "delivery_performance": 4.5,
          "description": "",
          "edd": "",
          "entry_tax": 0,
          "estimated_delivery_days": "2",
          "etd": "Apr 05, 2025",
          "etd_hours": 51,
          "freight_charge": 83.9,
          "id": 479878849,
          "is_custom_rate": 0,
          "is_hyperlocal": false,
          "is_international": 0,
          "is_rto_address_available": true,
          "is_surface": false,
          "local_region": 0,
          "metro": 0,
          "min_weight": 0.5,
          "mode": 1,
          "new_edd": 0,
          "odablock": false,
          "other_charges": 0,
          "others": "{\"allow_postcode_auto_sync\":1,\"cancel_real_time\":true,\"courier_available_for_payment_change\":1,\"is_cancellation_courier\":1,\"is_custom_courier\":1,\"is_edd_courier\":1,\"is_eway_bill_courier\":1,\"is_notify_cancel_courier\":1,\"is_webhook_courier\":1,\"min_breadth\":1,\"min_length\":1,\"wec\":1}",
          "pickup_availability": "1",
          "pickup_performance": 4.4,
          "pickup_priority": "",
          "pickup_supress_hours": 0,
          "pod_available": "Instant",
          "postcode": "416416",
          "qc_courier": 0,
          "rank": "",
          "rate": 83.9,
          "rating": 4.4,
          "realtime_tracking": "Real Time",
          "region": 3,
          "rto_charges": 86,
          "rto_performance": 4.4,
          "seconds_left_for_pickup": 1130,
          "secure_shipment_disabled": false,
          "ship_type": 1,
          "state": "MAHARASHTRA",
          "suppress_date": "Apr 03, 2025",
          "suppress_text": "",
          "suppression_dates": null,
          "surface_max_weight": "0.00",
          "tracking_performance": 4.5,
          "volumetric_max_weight": null,
          "weight_cases": 4.2,
          "zone": "z_a"
        },
        {
          "air_max_weight": "0.00",
          "assured_amount": 0,
          "base_courier_id": null,
          "base_weight": "",
          "blocked": 0,
          "call_before_delivery": "Not Available",
          "charge_weight": 2,
          "city": "Sangli",
          "cod": 1,
          "cod_charges": 0,
          "cod_multiplier": 0,
          "cost": "",
          "courier_company_id": 32,
          "courier_name": "Amazon Shipping Surface 2kg",
          "courier_type": "0",
          "coverage_charges": 0,
          "cutoff_time": "09:00",
          "delivery_boy_contact": "Not Available",
          "delivery_performance": 4.5,
          "description": "",
          "edd": "",
          "entry_tax": 0,
          "estimated_delivery_days": "3",
          "etd": "Apr 06, 2025",
          "etd_hours": 78,
          "freight_charge": 88,
          "id": 567542708,
          "is_custom_rate": 0,
          "is_hyperlocal": false,
          "is_international": 0,
          "is_rto_address_available": false,
          "is_surface": true,
          "local_region": 0,
          "metro": 0,
          "min_weight": 2,
          "mode": 0,
          "new_edd": 0,
          "odablock": false,
          "other_charges": 0,
          "others": "{\"auto_pickup\":1,\"cancel_real_time\":true,\"is_cancellation_courier\":1,\"is_custom_courier\":1,\"is_edd_courier\":1,\"is_notify_cancel_courier\":1,\"is_webhook_courier\":1,\"min_breadth\":1,\"min_length\":1,\"wec\":1}",
          "pickup_availability": "0",
          "pickup_performance": 4.4,
          "pickup_priority": "",
          "pickup_supress_hours": 0,
          "pod_available": "On Request",
          "postcode": "416416",
          "qc_courier": 0,
          "rank": "",
          "rate": 88,
          "rating": 4.4,
          "realtime_tracking": "Real Time",
          "region": 3,
          "rto_charges": 88,
          "rto_performance": 4.4,
          "seconds_left_for_pickup": -6069,
          "secure_shipment_disabled": false,
          "ship_type": 1,
          "state": "MAHARASHTRA",
          "suppress_date": "Apr 04, 2025",
          "suppress_text": "",
          "suppression_dates": {
            "action_on": "2025-04-02 22:38:31",
            "blocked_fm": "",
            "blocked_lm": ""
          },
          "surface_max_weight": "4.00",
          "tracking_performance": 4.5,
          "volumetric_max_weight": null,
          "weight_cases": 4.2,
          "zone": "z_a"
        }
      ],
      "child_courier_id": null,
      "is_recommendation_enabled": 1,
      "promise_recommended_courier_company_id": null,
      "recommendation_advance_rule": 0,
      "recommendation_level": "default",
      "recommended_by": {
        "id": 6,
        "title": "Recommendation By Shiprocket"
      },
      "recommended_courier_company_id": 10,
      "shiprocket_recommended_courier_id": 10
    },
    "dg_courier": 0,
    "eligible_for_insurance": 0,
    "insurace_opted_at_order_creation": false,
    "is_allow_templatized_pricing": true,
    "is_latlong": 0,
    "is_old_zone_opted": false,
    "is_zone_from_mongo": false,
    "label_generate_type": 2,
    "on_new_zone": 0,
    "seller_address": [],
    "status": 200,
    "user_insurance_manadatory": false
  }

  CourierdataCount: any = 0;
  spinCourier: boolean = false;

  getcourier() {
    if (
      this.WAREHOUSE_ID === null ||
      this.WAREHOUSE_ID === undefined ||
      this.WAREHOUSE_ID === ''
    ) {
      this.message.error('Please Select Warehouse', '');
    } else if (this.expectedDate === null || this.expectedDate === undefined) {
      this.message.error('Please select Expected date', '');
      // return;
    } else if (
      this.selecteddata == 'SC' &&
      (this.SelectHEIGHT === null ||
        this.SelectHEIGHT === undefined ||
        this.SelectHEIGHT === '' ||
        this.SelectHEIGHT === 0)
    ) {
      this.message.error('Please Enter Height', '');
    } else if (
      this.selecteddata === 'SC' &&
      (this.SelectWEIGHT === null ||
        this.SelectWEIGHT === undefined ||
        this.SelectWEIGHT === '' ||
        this.SelectWEIGHT === 0)
    ) {
      this.message.error('Please Enter Weight', '');
    } else if (
      this.selecteddata === 'SC' &&
      (this.SelectLENGTH === null ||
        this.SelectLENGTH === undefined ||
        this.SelectLENGTH === '' ||
        this.SelectLENGTH === 0)
    ) {
      this.message.error('Please Enter Length', '');
    } else if (
      this.selecteddata === 'SC' &&
      (this.SelectBREADTH === null ||
        this.SelectBREADTH === undefined ||
        this.SelectBREADTH === '' ||
        this.SelectBREADTH === 0)
    ) {
      this.message.error('Please Enter Breadth', '');
    } else {
      this.spinCourier = true;
      this.api
        .getCouriers(
          this.destPINCODE,
          this.vieworderdata['addressData'][0]['PINCODE'],
          this.SelectWEIGHT,
          this.SelectLENGTH,
          this.SelectBREADTH,
          this.SelectHEIGHT
        )
        .subscribe(
          (datass) => {
            if (datass['status'] == 200) {
              this.spinCourier = false;
              if (datass['body']['DATA'].status == 404) {
                this.message.info(datass['body']['DATA'].message, '');

                this.spinCourier = false;
                this.CourierData = [];
                this.CourierdataCount = 0;
              } else {
                if (
                  datass['body']['DATA']['data'][
                  'available_courier_companies'
                  ] !== null &&
                  datass['body']['DATA']['data'][
                  'available_courier_companies'
                  ] !== undefined &&
                  datass['body']['DATA']['data'][
                  'available_courier_companies'
                  ] !== ''
                ) {
                  this.CourierData =
                    datass['body']['DATA']['data'][
                    'available_courier_companies'
                    ];
                  this.CourierdataCount =
                    datass['body']['DATA']['data'][
                      'available_courier_companies'
                    ].length;
                } else {
                  this.spinCourier = false;
                  this.CourierData = [];
                  this.CourierdataCount = 0;
                }
              }
            } else {
              this.spinCourier = false;
              this.CourierData = [];
              this.CourierdataCount = 0;
            }
          },
          () => {
            this.spinCourier = false;
            this.CourierData = [];
            this.CourierdataCount = 0;
          }
        );
    }
  }
  setCourier(event) {
    this.Courier = event;
    if (event > 0) {
      var d = [];
      d = this.CourierData.filter(
        (iteme) => iteme.courier_company_id == this.Courier
      );
      this.orderData.COURIER_DETAILS = d[0];
      this.expectedDate = new Date(d[0]['etd']);
    }
  }
  getcourier1() {
    if (this.expectedDate === null || this.expectedDate === undefined) {
      this.message.error('Please select Expected date', '');
      // return;
    } else if (
      this.selecteddata == 'SC' &&
      (this.SelectHEIGHT === null ||
        this.SelectHEIGHT === undefined ||
        this.SelectHEIGHT === '' ||
        this.SelectHEIGHT === 0)
    ) {
      this.message.error('Please Enter Height', '');
    } else if (
      this.selecteddata === 'SC' &&
      (this.SelectWEIGHT === null ||
        this.SelectWEIGHT === undefined ||
        this.SelectWEIGHT === '' ||
        this.SelectWEIGHT === 0)
    ) {
      this.message.error('Please Enter Weight', '');
    } else if (
      this.selecteddata === 'SC' &&
      (this.SelectLENGTH === null ||
        this.SelectLENGTH === undefined ||
        this.SelectLENGTH === '' ||
        this.SelectLENGTH === 0)
    ) {
      this.message.error('Please Enter Length', '');
    } else if (
      this.selecteddata === 'SC' &&
      (this.SelectBREADTH === null ||
        this.SelectBREADTH === undefined ||
        this.SelectBREADTH === '' ||
        this.SelectBREADTH === 0)
    ) {
      this.message.error('Please Enter Breadth', '');
    } else {
      this.spinCourier = true;
      this.api
        .getCouriers(
          this.destPINCODE,
          this.vieworderdata['addressData'][0]['PINCODE'],
          this.SelectWEIGHT,
          this.SelectLENGTH,
          this.SelectBREADTH,
          this.SelectHEIGHT
        )
        .subscribe(
          (datass) => {
            if (datass['status'] == 200) {
              this.spinCourier = false;
              if (datass['body']['DATA'].status == 404) {
                this.message.info(datass['body']['DATA'].message, '');

                this.spinCourier = false;
                this.CourierData = [];
                this.CourierdataCount = 0;
              } else {
                if (
                  datass['body']['DATA']['data'][
                  'available_courier_companies'
                  ] !== null &&
                  datass['body']['DATA']['data'][
                  'available_courier_companies'
                  ] !== undefined &&
                  datass['body']['DATA']['data'][
                  'available_courier_companies'
                  ] !== ''
                ) {
                  this.CourierData =
                    datass['body']['DATA']['data'][
                    'available_courier_companies'
                    ];
                  this.CourierdataCount =
                    datass['body']['DATA']['data'][
                      'available_courier_companies'
                    ].length;
                } else {
                  this.spinCourier = false;
                  this.CourierData = [];
                  this.CourierdataCount = 0;
                }
              }
            } else {
              this.spinCourier = false;
              this.CourierData = [];
              this.CourierdataCount = 0;
            }
          },
          () => {
            this.spinCourier = false;
            this.CourierData = [];
            this.CourierdataCount = 0;
          }
        );
    }
  }

  resetCourier() {
    this.spinCourier = false;
    this.CourierData = [];
    this.CourierdataCount = 0;
    this.Courier = 0;
  }

  setHeight(event) {
    this.SelectHEIGHT = event;
    this.resetCourier();
  }
  setWeight(event) {
    this.SelectWEIGHT = event;
    this.resetCourier();
  }
  setLength(event) {
    this.SelectLENGTH = event;
    this.resetCourier();
  }
  setBreadth(event) {
    this.SelectBREADTH = event;
    this.resetCourier();
  }

  Courier: any;

  // openCourierURL(data: any, datass: any) {
  //   console.log(data, "dataa")
  //   console.log(datass, "datass")

  //   if (data) {
  //     window.open(data, '_blank');
  //   } else {
  //     console.warn('Courier URL is invalid or missing.');
  //   }
  // }

  openCourierURL(data: any, datass: any) {
    let url = data?.trim();

    if (data) {
      // Check if URL already has http:// or https://
      const hasProtocol = /^https?:\/\//i.test(url);
      const finalUrl = hasProtocol ? url : `https://${url}`;

      window.open(finalUrl, '_blank');
    } else {
      alert('Invalid or missing courier tracking URL.');
    }
  }


  acceptorder(event: any) {
    if (
      (this.STATUS != null && this.STATUS != undefined && this.STATUS != '') ||
      event == 'second'
    ) {
      if (this.STATUS === 'A') {
        if (
          this.IS_SHIP_ORDER === null ||
          this.IS_SHIP_ORDER === undefined ||
          this.IS_SHIP_ORDER === ''
        ) {
          this.message.error('Please Select Order Processing Type', '');
          return;
        } else if (
          this.WAREHOUSE_ID === null ||
          this.WAREHOUSE_ID === undefined ||
          this.WAREHOUSE_ID === ''
        ) {
          this.message.error('Please Select Warehouse', '');
          return;
        } else if (
          this.selecteddata === 'SC' &&
          (this.SelectHEIGHT === null ||
            this.SelectHEIGHT === undefined ||
            this.SelectHEIGHT === '' ||
            this.SelectHEIGHT === 0)
        ) {
          this.message.error('Please Enter Height', '');
          return;
        } else if (
          this.selecteddata === 'SC' &&
          (this.SelectWEIGHT === null ||
            this.SelectWEIGHT === undefined ||
            this.SelectWEIGHT === '' ||
            this.SelectWEIGHT === 0)
        ) {
          this.message.error('Please Enter Weight', '');
          return;
        } else if (
          this.selecteddata === 'SC' &&
          (this.SelectLENGTH === null ||
            this.SelectLENGTH === undefined ||
            this.SelectLENGTH === '' ||
            this.SelectLENGTH === 0)
        ) {
          this.message.error('Please Enter Length', '');
          return;
        } else if (
          this.selecteddata === 'SC' &&
          (this.SelectBREADTH === null ||
            this.SelectBREADTH === undefined ||
            this.SelectBREADTH === '' ||
            this.SelectBREADTH === 0)
        ) {
          this.message.error('Please Enter Breadth', '');
          return;
        } else if (
          this.selecteddata === 'SC' &&
          (this.Courier === null ||
            this.Courier === undefined ||
            this.Courier === 0 ||
            this.Courier === '')
        ) {
          this.message.error('Please Select Couries', '');
          return;
        } else {
          this.orderData.IS_FIRST = true;
          this.orderData.WAREHOUSE_DETAILS = this.warehousedetails;
        }
      } else {
        this.orderData.IS_FIRST = false;
      }
      if (this.STATUS == 'R') {
        if (
          this.IS_SHIP_ORDER === null ||
          this.IS_SHIP_ORDER === undefined ||
          this.IS_SHIP_ORDER === ''
        ) {
          this.message.error('Please Select Order Processing Type', '');
          return;
        } else
          if (
            this.orderData.REMARK == null ||
            this.orderData.REMARK == undefined ||
            this.orderData.REMARK == ''
          ) {
            this.message.error('Please Enter Reject Remark', '');
            return;
          } else {
            this.orderData.ORDER_STATUS = 'OR';
          }
      }

      if (this.STATUS != 'R') {
        if (
          this.selecteddata === '' ||
          this.selecteddata === null ||
          this.selecteddata === undefined
        ) {
          this.message.error('Please select the stage', '');
          return;
        } else if (
          this.expectedDate === null ||
          this.expectedDate === undefined
        ) {
          this.message.error('Please select Expected date', '');
          return;
        } else if (
          this.selecteddata === 'SC' &&
          (this.SelectHEIGHT === null ||
            this.SelectHEIGHT === undefined ||
            this.SelectHEIGHT === '' ||
            this.SelectHEIGHT === 0)
        ) {
          this.message.error('Please Enter Height', '');
          return;
        } else if (
          this.selecteddata === 'SC' &&
          (this.SelectWEIGHT === null ||
            this.SelectWEIGHT === undefined ||
            this.SelectWEIGHT === '' ||
            this.SelectWEIGHT === 0)
        ) {
          this.message.error('Please Enter Weight', '');
          return;
        } else if (
          this.selecteddata === 'SC' &&
          (this.SelectLENGTH === null ||
            this.SelectLENGTH === undefined ||
            this.SelectLENGTH === '' ||
            this.SelectLENGTH === 0)
        ) {
          this.message.error('Please Enter Length', '');
          return;
        } else if (
          this.selecteddata === 'SC' &&
          (this.SelectBREADTH === null ||
            this.SelectBREADTH === undefined ||
            this.SelectBREADTH === '' ||
            this.SelectBREADTH === 0)
        ) {
          this.message.error('Please Enter Breadth', '');
          return;
        } else if (
          this.selecteddata === 'SC' &&
          (this.Courier === null ||
            this.Courier === undefined ||
            this.Courier === 0 ||
            this.Courier === '')
        ) {
          this.message.error('Please Select Couries', '');
          return;
        } else {
          if (this.STATUS == 'A') {
            this.orderData.EXPECTED_DATE_TIME = this.datePipe.transform(
              this.expectedDate,
              'yyyy-MM-dd HH:mm:ss'
            );
          } else if (this.STATUS == 'R') {
            this.orderData.EXPECTED_DATE_TIME = this.datePipe.transform(
              this.expectedDate,
              'yyyy-MM-dd HH:mm:ss'
            );
          } else {
            this.orderData.ACTUAL_PACKAGING_DATETIME = this.datePipe.transform(
              this.expectedDate,
              'yyyy-MM-dd HH:mm:ss'
            );
          }
        }
      }
      if (this.STATUS == 'A') {
        this.orderData.ORDER_STATUS = this.selecteddata;
      } else if (this.STATUS == 'R') {
        this.orderData.ORDER_STATUS = 'OR';
      } else {
        this.orderData.ORDER_STATUS = this.selecteddata;
      }

      if (this.IS_SHIP_ORDER == 'M') {
        this.orderData.IS_SHIP_ORDER = 0;
      } else {
        this.orderData.IS_SHIP_ORDER = 1;
      }
      if (this.selecteddata === 'OK') {
        this.SelectBREADTH = null;
        this.SelectHEIGHT = null;
        this.SelectLENGTH = null;
        this.SelectWEIGHT = null;
        this.orderData.WAREHOUSE_DETAILS = this.warehousedetails;
      }
      if (this.selecteddata == 'SC') {
        this.orderData.WEIGHT = this.SelectWEIGHT;
        this.orderData.LENGTH = this.SelectLENGTH;
        this.orderData.BREADTH = this.SelectBREADTH;
        this.orderData.HEIGHT = this.SelectHEIGHT;
        this.orderData.COURIER_ID = this.Courier;
        var d = [];
        d = this.CourierData.filter(
          (iteme) => iteme.courier_company_id == this.orderData.COURIER_ID
        );
        this.orderData.COURIER_DETAILS = d[0];
        this.orderData.WAREHOUSE_DETAILS =
          this.vieworderdata.orderData[0]['WAREHOUSE_DETAILS'];
      }
      const requestData = {
        WAREHOUSE_ID: this.WAREHOUSE_ID,
        WAREHOUSE_NAME: this.desWarehousename,
        ORDER_ID: this.vieworderdata.summaryData[0]['ORDER_ID'],
        ORDER_NUMBER: this.vieworderdata.orderData[0]['ORDER_NUMBER'],
        ORDER_DATE: this.datePipe.transform(
          this.vieworderdata.orderData[0]['ORDER_DATE_TIME'],
          'yyyy-MM-dd HH:mm:ss'
        ),

        INVENTORY_DETAILS: this.vieworderdata.detailsData.map((item: any) => ({
          ITEM_ID: item.INVENTORY_ID,
          ITEM_NAME: item.PRODUCT_NAME,
          QUANTITY: item.QUANTITY,
          UNIT_ID: item.UNIT_ID,
          UNIT_NAME: item.UNIT_NAME,
          INVENTORY_TRACKING_TYPE: item.INVENTORY_TRACKING_TYPE,
          QUANTITY_PER_UNIT: item.QUANTITY_PER_UNIT,
        })),
      };
      this.orderData.ID = this.vieworderdata.orderData[0]['ID'];

      this.isSpinning = true;
      this.BoadAccept = true;

      if (this.STATUS == 'A') {
        this.api.updateStockforOrder(requestData).subscribe(
          (successCode1) => {
            this.orderData.INVENTORY_DETAILS =
              successCode1['INVENTORY_DETAILS'];

            if (successCode1['code'] === 200) {
              this.api.acceptorderforshop(this.orderData).subscribe(
                (successCode) => {


                  if (successCode.status == '200') {
                    // this.BoadAccept = false;
                    if (this.STATUS == 'A') {
                      this.message.success('Order Accepted Successfully', '');
                      this.orderData = new saveOrderData();
                      this.expectedDate = null;
                      this.STATUS = '';
                    } else if (this.STATUS == 'R') {
                      this.message.success('Order has been Rejected', '');
                      this.orderData = new saveOrderData();
                      this.expectedDate = null;
                      this.STATUS = '';
                    } else {
                      this.message.success('Status Changed1 Successfully', '');
                      this.orderData = new saveOrderData();
                      this.expectedDate = null;
                      this.STATUS = '';
                    }
                    this.getorderDetails2();
                    // this.isSpinning = false;
                  } else if (successCode.status == '300') {
                    this.isSpinning = false;
                    this.BoadAccept = false;
                    this.message.error('Something went wrong with Shiprocket. please try again later', '');
                  } else {
                    this.BoadAccept = false;

                    if (this.STATUS == 'A') {
                      this.message.error('Failed To Accept Order.', '');
                    } else if (this.STATUS == 'R') {
                      this.message.error('Failed To Rejected Order.', '');
                    } else {
                      this.message.error('Failed To change status.', '');
                    }
                    this.isSpinning = false;
                  }
                },
                () => {
                  this.BoadAccept = false;
                  this.isSpinning = false;
                  this.message.error(
                    'Something went wrong, please try again later',
                    ''
                  );
                }
              );
            } else if (successCode1['code'] === 300) {
              this.BoadAccept = false;
              this.isSpinning = false;
              this.message.info(successCode1['message'], '');
            } else {
              this.BoadAccept = false;
              this.isSpinning = false;
              this.message.error(
                'Something went wrong, please try again later',
                ''
              );
            }
          },
          () => {
            this.BoadAccept = false;
            this.isSpinning = false;
            this.message.error(
              'Something went wrong, please try again later',
              ''
            );
          }
        );
      } else {
        this.api.acceptorderforshop(this.orderData).subscribe(
          (successCode) => {

            if (successCode.status == '200') {
              // this.BoadAccept = false;
              if (this.STATUS == 'A') {
                this.message.success('Order Accepted Successfully', '');
                this.orderData = new saveOrderData();
                this.expectedDate = null;
                this.STATUS = '';
              } else if (this.STATUS == 'R') {
                this.message.success('Order has been Rejected', '');
                this.orderData = new saveOrderData();
                this.expectedDate = null;
                this.STATUS = '';
              } else {
                this.message.success('Status Changed Successfully', '');
                this.orderData = new saveOrderData();
                this.expectedDate = null;
                this.STATUS = '';
              }
              this.getorderDetails2();
              // this.isSpinning = false;
            } else if (successCode.status == 300) {
              this.isSpinning = false;
              this.BoadAccept = false;
              this.message.error('Something went wrong with Shiprocket. please try again later', '');
            } else {
              this.BoadAccept = false;

              if (this.STATUS == 'A') {
                this.message.error('Failed To Accept Order.', '');
              } else if (this.STATUS == 'R') {
                this.message.error('Failed To Rejected Order.', '');
              } else {
                this.message.error('Failed To change status.', '');
              }
              this.isSpinning = false;
            }
          },
          () => {
            this.BoadAccept = false;
            this.isSpinning = false;
          }
        );
      }
    } else {
      this.BoadAccept = false;
      this.message.error('Please Select Order Status', '');
      this.isSpinning = false;
    }
  }

  CreateShipOrder() {
    if (
      this.selecteddata === '' ||
      this.selecteddata === null ||
      this.selecteddata === undefined
    ) {
      this.message.error('Please select the stage', '');
      return;
    } else if (
      this.selecteddata === 'SC' &&
      (this.SelectHEIGHT === null ||
        this.SelectHEIGHT === undefined ||
        this.SelectHEIGHT === '' ||
        this.SelectHEIGHT === 0)
    ) {
      this.message.error('Please Enter Height', '');
      return;
    } else if (
      this.selecteddata === 'SC' &&
      (this.SelectWEIGHT === null ||
        this.SelectWEIGHT === undefined ||
        this.SelectWEIGHT === '' ||
        this.SelectWEIGHT === 0)
    ) {
      this.message.error('Please Enter Weight', '');
      return;
    } else if (
      this.selecteddata === 'SC' &&
      (this.SelectLENGTH === null ||
        this.SelectLENGTH === undefined ||
        this.SelectLENGTH === '' ||
        this.SelectLENGTH === 0)
    ) {
      this.message.error('Please Enter Length', '');
      return;
    } else if (
      this.selecteddata === 'SC' &&
      (this.SelectBREADTH === null ||
        this.SelectBREADTH === undefined ||
        this.SelectBREADTH === '' ||
        this.SelectBREADTH === 0)
    ) {
      this.message.error('Please Enter Breadth', '');
      return;
    } else if (
      this.selecteddata === 'SC' &&
      (this.Courier === null ||
        this.Courier === undefined ||
        this.Courier === 0 ||
        this.Courier === '')
    ) {
      this.message.error('Please Select Couries', '');
      return;
    } else {
      // this.orderData.ORDER_SHIPROCKET_DATETIME = this.datePipe.transform(
      //   new Date(), 'yyyy-MM-dd HH:mm:ss'
      // );
    }

    this.orderData.ORDER_STATUS = this.selecteddata;
    if (this.selecteddata == 'SC') {
      this.orderData.WEIGHT = this.SelectWEIGHT;
      this.orderData.LENGTH = this.SelectLENGTH;
      this.orderData.BREADTH = this.SelectBREADTH;
      this.orderData.HEIGHT = this.SelectHEIGHT;
      this.orderData.COURIER_ID = this.Courier;
      var d = [];
      d = this.CourierData.filter(
        (iteme) => iteme.courier_company_id == this.orderData.COURIER_ID
      );
      this.orderData.COURIER_DETAILS = d[0];
      this.orderData.WAREHOUSE_DETAILS =
        this.vieworderdata.orderData[0]['WAREHOUSE_DETAILS'];
    }

    this.orderData.ID = this.vieworderdata.orderData[0]['ID'];
    this.isSpinning = true;
    this.BoadAccept = true;
    this.api.acceptorderforshop(this.orderData).subscribe(
      (successCode) => {
        if (successCode.status == '200') {
          // this.BoadAccept = false;
          this.message.success('Order created in Shiprocket successfully', '');
          this.orderData = new saveOrderData();
          this.expectedDate = null;
          this.STATUS = '';
          this.getorderDetails2();
          // this.isSpinning = false;
        } else if (successCode.body.code == 301) {
          this.isSpinning = false;
          this.BoadAccept = false;
          this.message.error('Something went wrong with Shiprocket. please try again later', '');
        } else {
          this.BoadAccept = false;
          this.message.error('Failed to create order in Shiprocket', '');
          this.isSpinning = false;
        }
      }, err => {
        this.BoadAccept = false;
        this.isSpinning = false;
        this.message.error('Something went wrong with Shiprocket. please try again later', '');
      }
    );
  }


  AssignShipOrder() {
    if (
      this.selecteddata === '' ||
      this.selecteddata === null ||
      this.selecteddata === undefined
    ) {
      this.message.error('Please select the stage', '');
      return;
    }
    else {
      // this.orderData.ORDER_SHIP_ASSIGN_DATETIME = this.datePipe.transform(
      //   new Date(), 'yyyy-MM-dd HH:mm:ss'
      // );
    }
    this.orderData.ORDER_STATUS = this.selecteddata;

    if (this.selecteddata == 'AO') {
      this.orderData.COURIER_ID = this.vieworderdata.orderData[0]['COURIER_ID']
      this.orderData.SHIPMENT_ID = this.vieworderdata.orderData[0]['SHIPMENT_ID']
    }
    this.orderData.ID = this.vieworderdata.orderData[0]['ID'];
    this.isSpinning = true;
    this.BoadAccept = true;
    this.api.acceptorderforshop(this.orderData).subscribe(
      (successCode) => {

        if (successCode.status == '200') {
          // this.BoadAccept = false;
          this.message.success('Order Assigned successfully', '');
          this.orderData = new saveOrderData();
          this.expectedDate = null;
          this.STATUS = '';
          this.getorderDetails2();
          // this.isSpinning = false;
        } else if (successCode.status == 301) {
          this.isSpinning = false;
          this.BoadAccept = false;
          this.message.error('Something went wrong with Shiprocket. please try again later', '');
        } else {
          this.BoadAccept = false;
          this.message.error('Failed to assign order', '');
          this.isSpinning = false;
        }
      },
      () => {
        this.BoadAccept = false;
        this.isSpinning = false;
        this.message.error('Something went wrong with Shiprocket. please try again later', '');
      }
    );
  }

  MarkAsDelivery() {
    this.orderData.ORDER_STATUS = 'DO';
    this.orderData.ID = this.vieworderdata.orderData[0]['ID'];
    this.orderData.MANUAL_COURIER_URL = this.COURIER_TRACKING_URL
    this.isSpinning = true;
    this.BoadAccept = true;
    this.api.acceptorderforshop(this.orderData).subscribe(
      (successCode) => {

        if (successCode.status == '200') {
          // this.BoadAccept = false;
          this.message.success('Order marked as out for delivery successfully', '');
          this.orderData = new saveOrderData();
          this.expectedDate = null;
          this.STATUS = '';
          this.getorderDetails2();
          // this.isSpinning = false;
        } else if (successCode.status == 301) {
          this.isSpinning = false;
          this.BoadAccept = false;
          this.message.error('Something went wrong. Please try again later', '');
        } else {
          this.BoadAccept = false;
          this.message.error('Failed to change order status', '');
          this.isSpinning = false;
        }
      },
      () => {
        this.BoadAccept = false;
        this.isSpinning = false;
        this.message.error('Something went wrong. Please try again later', '');
      }
    );
  }

  MarkAsDelivered() {
    this.orderData.ORDER_STATUS = 'OS';
    this.orderData.ID = this.vieworderdata.orderData[0]['ID'];
    this.isSpinning = true;
    this.BoadAccept = true;
    this.api.acceptorderforshop(this.orderData).subscribe(
      (successCode) => {

        if (successCode.status == '200') {
          // this.BoadAccept = false;
          this.message.success('Order marked as delivered successfully', '');
          this.orderData = new saveOrderData();
          this.expectedDate = null;
          this.STATUS = '';
          this.getorderDetails2();
          // this.isSpinning = false;
        } else if (successCode.status == 301) {
          this.isSpinning = false;
          this.BoadAccept = false;
          this.message.error('Something went wrong. Please try again later', '');
        } else {
          this.BoadAccept = false;
          this.message.error('Failed to change order status', '');
          this.isSpinning = false;
        }
      },
      () => {
        this.BoadAccept = false;
        this.isSpinning = false;
        this.message.error('Something went wrong. Please try again later', '');
      }
    );
  }
  GenerateLabelShipOrder() {
    if (
      this.selecteddata === '' ||
      this.selecteddata === null ||
      this.selecteddata === undefined
    ) {
      this.message.error('Please select the stage', '');
      return;
    }
    else {
      // this.orderData.ORDER_LABEL_DATETIME = this.datePipe.transform(
      //   new Date(), 'yyyy-MM-dd HH:mm:ss'
      // );
    }
    this.orderData.ORDER_STATUS = this.selecteddata;

    if (this.selecteddata == 'GL') {
      this.orderData.SHIPMENT_ID = this.vieworderdata.orderData[0]['SHIPMENT_ID']

    }
    this.orderData.ID = this.vieworderdata.orderData[0]['ID'];
    this.isSpinning = true;
    this.BoadAccept = true;
    this.api.acceptorderforshop(this.orderData).subscribe(
      (successCode) => {

        if (successCode.status == '200') {
          // this.BoadAccept = false;
          this.message.success('Label generated successfully', '');
          this.orderData = new saveOrderData();
          this.expectedDate = null;
          this.STATUS = '';
          this.getorderDetails2();
          // this.isSpinning = false;
        } else if (successCode.status == 301) {
          this.isSpinning = false;
          this.BoadAccept = false;
          this.message.error('Something went wrong with Shiprocket. please try again later', '');
        } else {
          this.BoadAccept = false;
          this.message.error('Failed to generate label', '');
          this.isSpinning = false;
        }
      },
      () => {
        this.BoadAccept = false;
        this.isSpinning = false;
        this.message.error('Something went wrong with Shiprocket. please try again later', '');
      }
    );
  }
  SendForPickupShipOrder() {
    if (
      this.selecteddata === '' ||
      this.selecteddata === null ||
      this.selecteddata === undefined
    ) {
      this.message.error('Please select the stage', '');
      return;
    }
    else {
      // this.orderData.ORDER_PICKUP_DATETIME = this.datePipe.transform(
      //   new Date(), 'yyyy-MM-dd HH:mm:ss'
      // );
    }
    this.orderData.ORDER_STATUS = this.selecteddata;

    if (this.selecteddata == 'SP') {
      this.orderData.SHIPMENT_ID = this.vieworderdata.orderData[0]['SHIPMENT_ID']

    }
    this.orderData.ID = this.vieworderdata.orderData[0]['ID'];
    this.isSpinning = true;
    this.BoadAccept = true;
    this.api.acceptorderforshop(this.orderData).subscribe(
      (successCode) => {

        if (successCode.status == '200') {
          // this.BoadAccept = false;
          this.message.success('Send for pickup successfully', '');
          this.orderData = new saveOrderData();
          this.expectedDate = null;
          this.STATUS = '';
          this.getorderDetails2();
          // this.isSpinning = false;
        } else if (successCode.status == 301) {
          this.isSpinning = false;
          this.BoadAccept = false;
          this.message.error('Something went wrong with Shiprocket. please try again later', '');
        } else {
          this.BoadAccept = false;
          this.message.error('Failed to Send for pickup', '');
          this.isSpinning = false;
        }
      },
      () => {
        this.BoadAccept = false;
        this.isSpinning = false;
        this.message.error('Something went wrong with Shiprocket. please try again later', '');
      }
    );
  }
  dispatchorder() {
    if (
      this.selecteddata === '' ||
      this.selecteddata === null ||
      this.selecteddata === undefined
    ) {
      this.message.error('Please select the stage', '');
      return;
    }
    else {
      this.orderData.ACTUAL_DISPATCH_DATETIME = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
    }
    this.orderData.ORDER_STATUS = this.selecteddata;

    this.orderData.ID = this.vieworderdata.orderData[0]['ID'];
    this.isSpinning = true;
    this.BoadAccept = true;
    this.api.acceptorderforshop(this.orderData).subscribe(
      (successCode) => {

        if (successCode.status == '200') {
          // this.BoadAccept = false;
          this.message.success('Order Dispatched successfully', '');
          this.orderData = new saveOrderData();
          this.expectedDate = null;
          this.STATUS = '';
          this.getorderDetails2();
          // this.isSpinning = false;
        } else if (successCode.status == 301) {
          this.isSpinning = false;
          this.BoadAccept = false;
          this.message.error('Something went wrong. please try again later', '');
        } else {
          this.BoadAccept = false;
          this.message.error('Failed to dispatch order', '');
          this.isSpinning = false;
        }
      },
      () => {
        this.BoadAccept = false;
        this.isSpinning = false;
        this.message.error('Something went wrong. please try again later', '');
      }
    );
  }
  drawerCloseRating(): void {
    this.drawerCustomerRatingVisible = false;
  }

  get closeCallbackRating() {
    return this.drawerClose.bind(this);
  }

  showaction() {
    this.showactionlog = true;
    this.showinvoicetable = false;
    this.showjobcard = false;
    this.showverification = false;
    this.showchat = false;
    this.showmap = false;
    this.getActionLog();
  }

  showverificationn() {
    this.showactionlog = false;
    this.showinvoicetable = false;
    this.showjobcard = false;
    this.showverification = true;
    this.showchat = false;
    this.showmap = false;
  }
  backall() {
    this.showactionlog = false;
    this.showinvoicetable = false;
    this.showjobcard = true;
    this.showverification = false;
    this.showchat = false;
    this.showmap = false;
  }

  getActionLog() {
    var filter = '';
    if (this.checked == true && this.checked1 == false) {
      filter = " AND ACTION_LOG_TYPE IN('O')";
    } else if (this.checked == false && this.checked1 == true) {
      filter = " AND ACTION_LOG_TYPE IN('J')";
    } else {
      filter = " AND ACTION_LOG_TYPE IN('O','J')";
    }
    this.api
      .getActionLog(0, 0, '', '', filter + ' AND ORDER_ID= ' + this.orderid)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.timelineData = this.formatTimelineData(data['data']);
          } else {
            this.message.error('Failed To get Action Log Data', '');
          }
        },
        () => {
          this.message.error('Something Went Wrong', '');
        }
      );
  }
  formatTimelineData(data: any[]): any[] {
    return data.map((day) => ({
      date: day.DATE,
      events: day.ACTION_LOGS.map((log) => ({
        icon: this.getStatusIcon(log.ORDER_STATUS || ''), // Adjust icon logic as needed
        title: log.ACTION_DETAILS || 'Action performed',
        time: log.ORDER_DATE_TIME
          ? new Date(log.ORDER_DATE_TIME).toLocaleTimeString()
          : 'N/A',
        user: log.TECHNICIAN_NAME || 'Unknown',
        description: log.TASK_DESCRIPTION || 'No description provided',
      })),
    }));
  }
  getStatusIcon(status: string): string {
    switch (status) {
      case 'order placed':
        return '🛒';
      case 'order accepted':
        return '✅';
      case 'order rejected':
        return '❌';
      case 'order scheduled':
        return '📅';
      case 'order ongoing':
        return '🔄';
      case 'order completed':
        return '🏁';
      case 'order cancelled':
        return '🚫';
      default:
        return 'ℹ️';
    }
  }

  TYPE = 'ORDER';
  FILTER_ID: any = null;
  setFilter() {
    this.TYPE = 'SHOP_ORDER';
    this.FILTER_ID = this.orderDetails.ID;
  }

  getorderDetails2() {
    setTimeout(() => {
      this.api
        .getshoporderalldata(0, 0, '', '', this.orderDetails.ID)
        .subscribe((data) => {
          if (data['status'] == 200) {
            this.isSpinning = false;
            this.BoadAccept = false;
            this.vieworderdata = data['body'];
            this.expectedDate = new Date();
            if (this.vieworderdata.orderData[0]['ORDER_STATUS'] == 'OP') {
              this.selecteddata = 'OK';

            } else if (this.vieworderdata.orderData[0]['ORDER_STATUS'] == 'OK') {
              if (this.vieworderdata.orderData[0]['IS_SHIP_ORDER']) {
                this.selecteddata = 'SC';
              } else {
                this.selecteddata = 'DO';
              }
              // this.selecteddata = 'SC';
            } else if (this.vieworderdata.orderData[0]['ORDER_STATUS'] == 'SC') {
              this.selecteddata = 'AO';
            } else if (this.vieworderdata.orderData[0]['ORDER_STATUS'] == 'AO') {
              this.selecteddata = 'GL';
            } else if (this.vieworderdata.orderData[0]['ORDER_STATUS'] == 'GL') {
              this.selecteddata = 'SP';
            } else {
              this.selecteddata = 'OD';
            }
            if (data['body']['count'] > 0) {
              if (
                this.vieworderdata.orderData[0]['WAREHOUSE_DETAILS'] !== null &&
                this.vieworderdata.orderData[0]['WAREHOUSE_DETAILS'] !== undefined
              ) {
                this.warehousedetails = JSON.parse(
                  this.vieworderdata.orderData[0]['WAREHOUSE_DETAILS']
                );
                this.desWarehousename = this.warehousedetails[0]['NAME'];
                this.destPINCODE =
                  this.warehousedetails[0]['PINCODE'].split('-')[0];
              }



              if (
                this.vieworderdata.orderData[0]['COURIER_DETAILS'] !== null &&
                this.vieworderdata.orderData[0]['COURIER_DETAILS'] !== undefined
              ) {

                this.Courierdetails = JSON.parse(
                  this.vieworderdata.orderData[0]['COURIER_DETAILS']
                );
              }

            }
            // this.isSpinning = false;
          } else {
            this.isSpinning = false;
            this.BoadAccept = false;
            this.vieworderdata = [];
            // this.isSpinning = false;
          }
        }, err => {
          this.isSpinning = false;
          this.BoadAccept = false;
          this.vieworderdata = [];
        });
    }, 1000);

  }
  skillsList: any = [];

  TECHNICIAN_ID: any;
  jobcardtechmapdata: any = [];
  filteredJobcardTechData: any[] = [];
  show: any = 0;
  onSelectedIndexChange(event) {
    this.show = event;
  }
  actionfilter = " AND ACTION_LOG_TYPE IN('O')";
  chatfilter: any = '';
  invoicefilter: any = '';

  // shreya
  drawerVisibleCustomers: boolean;
  drawerTitleCustomers: string;
  drawerDataCustomers: customer = new customer();
  widths: any = '100%';
  custid = 0;
  view(data: any): void {
    this.custid = data.CUSTOMER_ID;

    this.drawerTitleCustomers = `View details of ${data.CUSTOMER_NAME}`;
    this.drawerDataCustomers = Object.assign({}, data);
    this.drawerVisibleCustomers = true;
  }
  drawerCloseCustomers(): void {
    this.drawerVisibleCustomers = false;
  }
  get closeCallbackCustomers() {
    return this.drawerCloseCustomers.bind(this);
  }

  MIN_T_END_TIME: any;
  MAX_T_START_TIME: any;
  setDateDisableDateTime() {
    this.MIN_T_END_TIME =
      this.teritoryData?.MAX_T_END_TIME && this.teritoryData?.END_TIME
        ? this.teritoryData.MAX_T_END_TIME < this.teritoryData.END_TIME
          ? this.teritoryData.MAX_T_END_TIME
          : this.teritoryData.END_TIME
        : '00:00:00';

    this.MAX_T_START_TIME =
      this.teritoryData.MAX_T_START_TIME > this.teritoryData.START_TIME
        ? this.teritoryData.MAX_T_START_TIME
        : this.teritoryData.START_TIME;

    var date: any = new Date();
    const [hours1, minutes1, second] =
      this.MIN_T_END_TIME.split(':').map(Number);

    const today = new Date();

    this.currentDate = new Date(today); // Create a copy of the current date
    this.currentDate.setMinutes(
      this.currentDate.getMinutes() + this.teritoryData.MAX_DURARTION_MIN
    );
    date.setHours(
      this.currentDate.getHours(),
      this.currentDate.getMinutes(),
      0,
      0
    );
    var date1: any = new Date(this.currentDate);
    date1.setHours(hours1, minutes1, 0, 0);
    const differenceInMs: any = date1 - date; // Difference in milliseconds
    const differenceInMinutes = Math.floor(differenceInMs / (1000 * 60)); //

    if (differenceInMinutes > 0) {
    } else if (differenceInMinutes < 0) {
      this.currentDate.setDate(this.currentDate.getDate() + 1);
    }
  }

  currentDate = new Date();
  currentDate2 = new Date();
  currentHour = new Date().getHours();
  currentMinute = new Date().getMinutes();
  currentSecond = new Date().getSeconds();
  disabledHours: any[] = [];
  disabledminutes: any[] = [];

  disabledPastDates = (current: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of today
    return current < today; // Disable only past dates (yesterday and earlier)
  };

  deleteCancel() { }
  parseTimeString(timeString: string): { hour: number; minute: number } {
    const [hour, minute, seconds] = timeString.split(':').map(Number);
    return { hour, minute };
  }
  setDate(event) {
    this.expectedDate = event;
    this.time = null;
    this.setDateDisableDateTime();
  }
  showerror = false;
  checkLength() {
    this.showerror = !this.showerror;
  }

  formatTime(totalMinutes): string {
    var hoursMatch = Math.floor(totalMinutes / 60);
    var minutesMatch = totalMinutes % 60;
    const hours = hoursMatch ? this.padZero(hoursMatch) : '00';
    const minutes = minutesMatch ? this.padZero(minutesMatch) : '00';

    return `${hours}:${minutes}`;
  }

  padZero(value: string | number): string {
    return value.toString().padStart(2, '0');
  }
  isTextOverflowing(element: HTMLElement): boolean {
    return element.offsetWidth < element.scrollWidth;
  }

  type = 'a';
  addresses = [];
  terriotrystarttime1: any = null;
  terriotryendtime1: any = null;

  isTerritoryExpress = false;
  storeserviceaddress;
  storeBillingaddress;

  //Drawer Methods
  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  drawerCloseorder(): void {
    this.ordercreateVisible = false;
  }

  //Drawer Methods
  get closeCallbackorder() {
    return this.drawerCloseorder.bind(this);
  }
  showExpress = false;
  specialInstruction = '';

  ordercreateVisible = false;
  expandedKeys: any = [];
  selectedKeys: any;
  nodes: any = [];
  servicescatalogue: any = [];
  serviceSubCatName = '';
  serviceCatName = '';

  @Input() MIN_T_END_TIME2: any;
  @Input() MAX_T_START_TIME2: any;
  @Input() currentDate5 = new Date();

  ScheduleJob(data: any) {
    sessionStorage.setItem('Territory_Schedular', data.TERRITORY_ID);
    this.router.navigateByUrl('/order/dispatcher');
  }
  imageshow;
  ViewImage;
  ImageModalCancel() {
    this.ImageModalVisible = false;
  }

  viewImage(imageURL: string): void {
    this.ViewImage = 1;
    this.GetImage(imageURL);
  }

  sanitizedLink: any = '';
  ImageModalVisible = false;
  GetImage(link: string) {
    let imagePath = this.api.retriveimgUrl + 'InventoryImages/' + link;
    this.sanitizedLink =
      this.sanitizer.bypassSecurityTrustResourceUrl(imagePath);
    this.imageshow = this.sanitizedLink;

    // Display the modal only after setting the image URL
    this.ImageModalVisible = true;
  }

  zoomLevel = 1;
  rotation = 0;

  zoomIn() {
    this.zoomLevel += 0.1;
  }

  zoomOut() {
    if (this.zoomLevel > 0.2) {
      this.zoomLevel -= 0.1;
    }
  }

  rotateLeft() {
    this.rotation -= 90;
  }

  rotateRight() {
    this.rotation += 90;
  }

  reset() {
    this.zoomLevel = 1;
    this.rotation = 0;
  }


  getwarehouse() {
    this.api.getWarehouses(0, 0, 'ID', 'desc', ' AND STATUS=1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.LoadGodown = data['data'];
        }
      },
      (err) => {
        // this.message.error('Server Not Found', '');
      }
    );
  }

  changeFromGodown(event: any) {
    this.CourierData = [];
    this.CourierdataCount = 0;
    this.warehousedetails = this.LoadGodown.filter((x: any) => x.ID == event);
    this.desWarehousename = this.warehousedetails[0]['NAME'];
    this.destPINCODE = this.warehousedetails[0]['PINCODE'].split('-')[0];
  }

  isdetailsclosed = false;
  storeid: any;
  PartTitle: any = '';
  ViewDetails() {
    this.storeid = this.WAREHOUSE_ID;
    this.PartTitle = 'View item stock';
    // this.search1();
    this.getlistofstock();
  }

  closedetailsd() {
    // this.search();
    this.isdetailsclosed = false;
  }

  isTextOverflow = false;

  checkOverflow(element: HTMLElement, tooltip: any): void {
    this.isTextOverflow = element.scrollWidth > element.clientWidth;
    if (this.isTextOverflow) {
      tooltip.show();
    } else {
      tooltip.hide();
    }
  }

  loadingRecordIStock: boolean = false;
  getlistofstock() {
    let sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    this.loadingRecordIStock = true;

    this.api
      .getStockMgtReportReport(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        ' AND WAREHOUSE_ID=' +
        this.storeid +
        ' AND ITEM_ID IN(' +
        this.invt_ids +
        ')'
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadingRecordIStock = false;
            this.totalRecords = data['count'];
            if (this.totalRecords > 0) {
              this.loadingRecordIStock = false;
              this.isdetailsclosed = true;
              this.dataList = data['data'];
            } else {
              this.dataList = [];
              this.loadingRecordIStock = false;
              this.isdetailsclosed = false;
              this.message.info('No item stock found in this warehouse', '');
            }
          } else {
            this.loadingRecordIStock = false;
            this.dataList = [];
            this.message.error('Something Went Wrong ...', '');
          }
        },
        (err: HttpErrorResponse) => {
          this.loadingRecordIStock = false;
          if (err.status === 0) {
            this.message.error(
              'Network error: Please check your internet connection.',
              ''
            );
          } else {
            this.message.error('Something Went Wrong.', '');
          }
        }
      );
  }

  sort(params: NzTableQueryParams) {
    this.loadingRecords = true;
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'ITEM_ID';
    const sortOrder = (currentSort && currentSort.value) || 'desc';
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;

    if (this.pageSize != pageSize) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
    }

    if (this.sortKey != sortField) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
    }

    this.sortKey = sortField;
    this.sortValue = sortOrder;
    if (currentSort != null && currentSort.value != undefined) {
      this.getlistofstock();
    }
  }
  filterQuery: string = '';
  filterQuery1: any = '';
  searchText: string = '';
  custType: any = '';
  columns: string[][] = [
    ['INVOICE_DATE', 'INVOICE_DATE'],
    ['CUSTOMER_NAME', 'CUSTOMER_NAME'],
    ['CUSTOMER_TYPE', 'CUSTOMER_TYPE'],
    ['MOBILE_NO', 'MOBILE_NO'],
    ['EMAIL', 'EMAIL'],
    ['EMAIL', 'EMAIL'],
    ['TOTAL_AMOUNT', 'TOTAL_AMOUNT'],
    ['TAX_AMOUNT', 'TAX_AMOUNT'],
    ['FINAL_AMOUNT', 'FINAL_AMOUNT']
  ];
  selectedDate: Date[] = [];
  Customers: any = [];
  InvoiceClick() {
    this.getshopOrderData();
  }

  getshopOrderData(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
      this.sortKey1 = 'id';
      this.sortValue = 'desc';
    }
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    var likeQuery = '';
    if (this.searchText != '' && this.searchText.length > 0) {
      likeQuery = ' AND(';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ') ';

    }
    if ((this.Customers != undefined) && (this.Customers != null) && (this.Customers.length > 0)) {
      this.filterQuery = " AND CUSTOMER_ID IN(" + this.Customers + ")";
    } else {
      this.filterQuery = '';
    }
    this.filterQuery1 = '';
    if (this.custType != undefined && this.custType != null && this.custType != '') {
      this.filterQuery1 = " AND CUSTOMER_TYPE IN('" + this.custType + "')";
    } else {
      this.filterQuery1 = '';
    }

    if (this.orderDetails.CUSTOMER_ID) {
      this.filterQuery = `AND CUSTOMER_ID = ${this.orderDetails.CUSTOMER_ID}`;
    }
    if (this.orderDetails.ORDER_NUMBER) {
      this.filterQuery1 = ` AND ORDER_NUMBER = '${this.orderDetails.ORDER_NUMBER}'`;
    }
    likeQuery = this.filterQuery + this.filterQuery1;
    this.api
      .getshopOrdersData1(
        this.pageIndex,
        this.pageSize,
        this.sortKey1,
        this.sortValue,
        likeQuery
      )
      .subscribe(
        (data) => {
          if (data['status'] == 200) {
            this.loadingRecords = false;
            this.totalRecords = data['body']['count'];
            this.newdataList = data['body']['data'];
            // this.TabId = data['body']['TAB_ID'];
            this.isSpinning = false;
          } else if (data['status'] == 400) {
            this.loadingRecords = false;
            this.newdataList = [];
            this.isSpinning = false;
            this.message.error('Invalid filter parameter', '');
          } else {
            this.loadingRecords = false;
            this.newdataList = [];
            this.message.error('Something Went Wrong ...', '');
            this.isSpinning = false;
          }
        });

  }


}