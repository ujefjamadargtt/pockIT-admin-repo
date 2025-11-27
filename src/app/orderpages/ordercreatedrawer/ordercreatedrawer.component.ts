import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Address } from 'src/app/Pages/Models/Address';
import { customer } from 'src/app/Pages/Models/customer';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { differenceInCalendarDays } from 'date-fns';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { orderMasterData } from 'src/app/Pages/Models/OrderMasterData';
import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { appkeys } from 'src/app/app.constant';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-ordercreatedrawer',
  templateUrl: './ordercreatedrawer.component.html',
  styleUrls: ['./ordercreatedrawer.component.css'],
  providers: [DatePipe],
})
export class OrdercreatedrawerComponent {
  @Input() drawerCloseorder: any;
  @Input() data: any = new orderMasterData();
  @Input() type = 'a';
  isOk: boolean = false;
  @Input() expandKeys = ['0-0', '0-1'];
  customerAddData: any;
  isSpinning: boolean = false;
  drawerVisible: boolean = false;
  drawerVisibleAddress: boolean = false;
  drawerData: customer = new customer();
  drawerDataaddress: Address = new Address();
  drawerTitle: any = '';
  showbutton: boolean = true;
  cartVisible: boolean = false;
  selectedService: any = '';
  orderMediums = ['Phone', 'Email', 'Recurring'];
  quantity = 1;
  rate = 0;
  total = 0;
  unit: any;
  @Input() time: any;
  territories: any = [];
  subcategories: any = [];
  @Input() servicescatalogue: any = [];
  services: any = [];
  categories: any = [];
  uniteDta: any = [];
  selectedTerritory: string;
  selectedOrderMedium: string;
  @Input() tableData: any = [];
  isEditing = false;
  editingIndex: number | null = null;
  @Input() expectedDate: Date | null = null;
  @Input() addresses: any = [];
  @Input() TERRITORY_IDS: any = [];
  @Input() decreptedroleId: any = 0;
  ID: any;
  selectedCategory: any;
  selectedSubcategory: any;
  selectedServices: any;
  selectedServiceItem: any;
  @Input() specialInstruction = '';
  STATE_ID_EN = sessionStorage.getItem('stateId');
  STATE_ID = 0;
  @Input() selectedKeys: any = [];
  userId = sessionStorage.getItem('userId');
  decrepteduserIDString = '';
  decrepteduserID = 0;
  SERVER_URL = appkeys.retriveimgUrl + 'Item/';
  customer: any = [];
  company: any = [];
  pageIndex = 1;
  CUSTOMER_TYPE = 'I';
  pageSize = 8;
  totalrecords = 0;
  searchkey = '';
  decreptedvendorId = 0;
  vendorId = sessionStorage.getItem('vendorId');
  buttonLoading = false;
  Emaiid = sessionStorage.getItem('emailId');
  decryptedEmail = '';
  roleId = sessionStorage.getItem('roleId');
  vendor_id: any = 0;
  Usertype: any = 'A';
  backofficeId = sessionStorage.getItem('backofficeId');
  decreptedbackofficeId = 0;
  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer
  ) { }
  showcbutton: boolean = false;
  @Input() isTerritoryExpress: boolean = false;
  ngOnInit() {
    this.decryptedEmail = this.Emaiid
      ? this.commonFunction.decryptdata(this.Emaiid)
      : '';
    var STATE_ID = this.STATE_ID_EN
      ? this.commonFunction.decryptdata(this.STATE_ID_EN)
      : '';
    this.STATE_ID = parseInt(STATE_ID, 10);
    this.decrepteduserIDString = this.userId
      ? this.commonFunction.decryptdata(this.userId)
      : '';
    this.decrepteduserID = parseInt(this.decrepteduserIDString, 10);
    var decreptedbackofficeId = this.backofficeId
      ? this.commonFunction.decryptdata(this.backofficeId)
      : '';
    this.decreptedbackofficeId = parseInt(decreptedbackofficeId, 10);
    this.customer = [];
    this.company = [];
    if (this.decreptedroleId == 9) {
      var decreptedvendorId = this.vendorId
        ? this.commonFunction.decryptdata(this.vendorId)
        : '';
      this.decreptedvendorId = parseInt(decreptedvendorId, 10);
    } else {
      this.decreptedvendorId = 0;
    }

    this.getcustomer(this.searchkey);
    this.getcategories();

    this.getUnits();
    if (this.data.CUSTOMER_ID === '' || this.data.CUSTOMER_ID === undefined) {
      this.showcbutton = true;
      this.showbutton = false;
    } else {
      this.showcbutton = false;
      this.showbutton = true;
    }

    if (this.decreptedroleId == '9') {
      this.api
        .getVendorData(0, 0, '', '', ' AND USER_ID=' + this.decrepteduserID)
        .subscribe((dataaa1) => {
          if (dataaa1['code'] == 200) {
            var dataaaaaa1 = dataaa1['data'];
            if (dataaaaaa1.length > 0) {
              this.vendor_id = dataaa1['data'][0].ID;
              this.Usertype = 'V';
            }
          }
        });
    } else if (this.decreptedroleId == '8' || this.decreptedroleId == '1') {
      this.vendor_id = this.decrepteduserID;
      this.Usertype = 'A';
    } else {
      this.api
        .getBackOfficeData(0, 0, '', '', ' AND USER_ID=' + this.decrepteduserID)
        .subscribe((dataaa11) => {
          if (dataaa11['code'] == 200) {
            var dataaaaaa1 = dataaa11['data'];
            if (dataaaaaa1.length > 0) {
              this.vendor_id = dataaa11['data'][0].ID;
              this.Usertype = 'B';
            }
          }
        });
    }
  }

  @Input() nodes: any = [];
  closeCallbackorder() {
    this.drawerCloseorder();
  }

  loadMore() {
    if (this.totalrecords > this.customer.length) {
      this.pageIndex++;
      this.getcustomer(this.searchkey);
    }
  }
  search(event) {
    this.searchkey = event;
    if (event.length >= 3) {
      this.customer = [];
      this.pageIndex = 1;
      this.getcustomer(this.searchkey);
    }
  }

  keyup(event) {
    if (
      this.searchkey == '' &&
      (event.code == 'Backspace' || event.code == 'Delete')
    ) {
      this.customer = [];
      this.company = [];
      this.pageIndex = 1;
      this.getcustomer('');
    }
  }

  isLoading = false;

  getcustomer(event: string = '', orgName: string = '') {
    const customerType = this.data.CUSTOMER_TYPE || 'I';
    if (this.decreptedroleId == 7) {
      event =
        event != '' && event != undefined && event != null
          ? ' AND (NAME like "%' +
          event +
          '%" OR EMAIL like "%' +
          event +
          '%" OR COMPANY_NAME like "%' +
          event +
          '%" OR  MOBILE_NO like "%' +
          event +
          '%" ) '
          : '';

      let orgFilter = '';

      if (orgName !== '') {
        orgFilter = " AND COMPANY_NAME = '" + orgName + "'";
      }

      if (customerType) {
        orgFilter += ` AND CUSTOMER_TYPE = '${customerType}'`;
      }

      this.isLoading = true;
      this.api
        .getAllCustomer(
          this.pageIndex,
          8,
          '',
          '',
          ' AND ACCOUNT_STATUS = 1' +
          event +
          ' AND CUSTOMER_MANAGER_ID=' +
          this.decreptedbackofficeId +
          orgFilter
        )
        .subscribe((data) => {
          if (data['code'] == 200 && data['data'].length > 0) {
            if (this.pageIndex == 1) {
              this.customer = [...[], ...data['data']];
            } else this.customer = [...this.customer, ...data['data']];
            this.totalrecords = data['count'];
          }
          this.isLoading = false;
        });
    } else {
      event =
        event != '' && event != undefined && event != null
          ? ' AND (NAME like "%' +
          event +
          '%" OR EMAIL like "%' +
          event +
          '%" OR COMPANY_NAME like "%' +
          event +
          '%" OR  MOBILE_NO like "%' +
          event +
          '%" ) '
          : '';

      let orgFilter = '';

      if (orgName !== '') {
        orgFilter = " AND COMPANY_NAME = '" + orgName + "'";
      }

      if (customerType) {
        orgFilter += ` AND CUSTOMER_TYPE = '${customerType}'`;
      }

      this.isLoading = true;
      this.api
        .getAllCustomer(
          this.pageIndex,
          8,
          '',
          '',
          ' AND ACCOUNT_STATUS = 1' + event + orgFilter
        )
        .subscribe((data) => {
          if (data['code'] == 200 && data['data'].length > 0) {
            if (this.pageIndex == 1) {
              this.customer = [...[], ...data['data']];
            } else this.customer = [...this.customer, ...data['data']];
            this.totalrecords = data['count'];
          }
          this.isLoading = false;
        });
    }
  }

  showbillingaddress: boolean = false;

  @Input() storeserviceaddress: any;
  @Input() storeBillingaddress: any;
  getaddress(event) {
    this.data['IS_SPECIAL_CATALOGUE'] = 0;
    this.addresses = [];
    if (event) {
      this.data.CUSTOMER_ID = event;
      if (
        this.data.CUSTOMER_ID === '' ||
        this.data.CUSTOMER_ID === undefined ||
        this.data.CUSTOMER_ID === null
      ) {
        this.showcbutton = true;
        this.showbutton = false;
        this.showbillingaddress = false;
        this.data.CUSTOMER_TYPE = 'I';
      } else {
        this.showcbutton = false;
        this.showbutton = true;
        var cust: any = this.customer.filter(
          (element) => element.ID == this.data.CUSTOMER_ID
        );

        if (cust) {
          this.customerAddData = cust;
          this.data.CUSTOMER_TYPE = cust[0].CUSTOMER_TYPE;
          if (this.data.CUSTOMER_TYPE == 'I')
            this.data.CUSTOMER_NAME = cust[0]['NAME'];
          else {
            this.data.CUSTOMER_NAME = cust[0]['COMPANY_NAME'];
            this.data['IS_SPECIAL_CATALOGUE'] = cust[0]['IS_SPECIAL_CATALOGUE'];
          }
        } else {
          this.data.CUSTOMER_TYPE = 'I';
          this.data.CUSTOMER_NAME = cust[0]['NAME'];
        }
      }

      this.api
        .getAllCustomerAddress(
          0,
          0,
          'IS_DEFAULT',
          'desc',
          ' AND STATUS = 1 AND CUSTOMER_ID= ' +
          this.data.CUSTOMER_ID +
          " AND (PINCODE_FOR='B' OR PINCODE_FOR='S')"
        )
        .subscribe((data) => {
          if (data['code'] == 200) {
            this.addresses = data['data'];
          } else this.addresses = [];
        });
    } else {
      this.data.CUSTOMER_ID = 0;
    }
    this.data.ADDRESS_ID = null;
    this.data.ADDRESS_ID1 = null;
    this.storeBillingaddress = null;
    this.storeserviceaddress = null;
    this.data.SERVICE_ADDRESS_DATA = null;
    this.data.BILLING_ADDRESS_DATA = null;
    this.data.TERRITORY_ID = 0;

    this.resetForm('C');
  }

  copyServiceAddress() {
    this.storeBillingaddress = this.storeserviceaddress;
    this.data.ADDRESS_ID1 = this.data.ADDRESS_ID;
    this.data.STATE_ID = this.storeserviceaddress[0].STATE_ID;
    this.data.IS_SAME_STATE =
      this.STATE_ID == this.storeserviceaddress[0].STATE_ID ? true : false;
  }
  @Input() terriotrystarttime1: any;
  @Input() terriotryendtime1: any;
  taxdata: any = [];
  isTerritoryMapped = true;
  getteritory(event) {
    this.isTerritoryMapped = true;
    if (event == null || event == undefined || event == '') {
      this.storeserviceaddress = null;
      this.storeBillingaddress = null;
      this.data.ADDRESS_ID = 0;
      this.data.ADDRESS_ID1 = 0;
      this.data.STATE_ID = 0;
      this.data.IS_SAME_STATE = 0;
      this.data.TERRITORY_ID = 0;
    } else {
      var serviceAddress: any = this.addresses.filter(
        (element) => element.ID == event
      );

      var long: any;
      var longitude: any;
      var latitude: any;
      if (serviceAddress) {
        if (serviceAddress[0]['GEO_LOCATION']) {
          long = serviceAddress[0].GEO_LOCATION.split(',');
          longitude = long[1];
          latitude = long[0];
        }
        this.storeserviceaddress = {
          ID: serviceAddress[0]['ID'],
          ADDRESS_LINE_1: serviceAddress[0].ADDRESS_LINE_1,
          ADDRESS_LINE_2: serviceAddress[0].ADDRESS_LINE_2,
          DISTRICT_ID: serviceAddress[0].DISTRICT_ID,
          STATE_ID: serviceAddress[0].STATE_ID,
          CITY_NAME: serviceAddress[0]?.CITY_NAME,
          COUNTRY_ID: serviceAddress[0].COUNTRY_ID,
          PINCODE_ID: serviceAddress[0].PINCODE_ID,
          PINCODE: serviceAddress[0].PINCODE,
          LONGITUDE: longitude,
          LATITUDE: latitude,
          CONTACT_PERSON_NAME: serviceAddress[0].CONTACT_PERSON_NAME,
          MOBILE_NO: serviceAddress[0].MOBILE_NO,
          LANDMARK: serviceAddress[0].LANDMARK
            ? serviceAddress[0].LANDMARK
            : null,
        };
        this.storeBillingaddress = {
          ID: serviceAddress[0]['ID'],
          ADDRESS_LINE_1: serviceAddress[0].ADDRESS_LINE_1,
          ADDRESS_LINE_2: serviceAddress[0].ADDRESS_LINE_2,
          DISTRICT_ID: serviceAddress[0].DISTRICT_ID,
          STATE_ID: serviceAddress[0].STATE_ID,
          CITY_NAME: serviceAddress[0]?.CITY_NAME,
          COUNTRY_ID: serviceAddress[0].COUNTRY_ID,
          PINCODE_ID: serviceAddress[0].PINCODE_ID,
          PINCODE: serviceAddress[0].PINCODE,
          LONGITUDE: longitude,
          LATITUDE: latitude,
          CONTACT_PERSON_NAME: serviceAddress[0].CONTACT_PERSON_NAME,
          MOBILE_NO: serviceAddress[0].MOBILE_NO,
          LANDMARK: serviceAddress[0].LANDMARK
            ? serviceAddress[0].LANDMARK
            : null,
        };
        this.data.ADDRESS_ID = event;
        this.data.ADDRESS_ID1 = event;
        this.data.TERRITORY_ID = serviceAddress[0].TERRITORY_ID;
        this.data.STATE_ID = serviceAddress[0].STATE_ID;
        this.data.IS_SAME_STATE =
          this.STATE_ID == serviceAddress[0].STATE_ID ? true : false;
      }
      if (this.data.TERRITORY_ID > 0) {
        this.data.TERRITORY_NAME = serviceAddress[0].TERRITORY_NAME;
        if (
          this.decreptedroleId == 9 ||
          (this.decreptedroleId != 1 &&
            this.decreptedroleId != 6 &&
            this.decreptedroleId != 8 &&
            this.decreptedroleId != 9)
        ) {
          var i = this.TERRITORY_IDS.findIndex(
            (item) => item == this.data.TERRITORY_ID
          );
          if (i != undefined && i != null && i > -1) {
            this.api
              .getTeritory(
                1,
                1,
                '',
                '',
                ' AND IS_ACTIVE =1 AND ID =' + serviceAddress[0].TERRITORY_ID
              )
              .subscribe((data) => {
                if (data['code'] == 200 && data.count > 0) {
                  this.territories = data['data'];
                  this.data.TERRITORY_ID = this.territories[0]['ID'];
                  this.data.TERRITORY_NAME = this.territories[0]['NAME'];
                  this.data.MAX_T_START_TIME =
                    this.territories[0]['GLOBAL_START_TIME'];
                  this.data.MAX_T_END_TIME = this.territories[0]['GLOBAL_END_TIME'];
                  const currentDate = new Date(this.currentDate2);
                  const year = currentDate.getFullYear();
                  const month = currentDate.getMonth();
                  const day = currentDate.getDate();

                  const dateWithTime = new Date(
                    year,
                    month,
                    day,
                    ...this.data.MAX_T_START_TIME.split(':').map(Number)
                  );
                  const dateWithTime1 = new Date(
                    year,
                    month,
                    day,
                    ...this.data.MAX_T_END_TIME.split(':').map(Number)
                  );

                  this.terriotrystarttime1 = new Date(dateWithTime);
                  this.terriotryendtime1 = new Date(dateWithTime1);
                  this.isTerritoryExpress =
                    this.territories[0]['IS_EXPRESS_SERVICE_AVAILABLE'] == 0
                      ? false
                      : true;
                  this.getCategoriesNodes();
                } else {
                  this.territories = [];
                  this.data.TERRITORY_ID = 0;
                  this.isTerritoryExpress = false;
                  this.data.MAX_T_START_TIME = null;
                  this.data.MAX_T_END_TIME = null;
                  this.terriotrystarttime1 = null;
                  this.terriotryendtime1 = null;
                  this.message.error(
                    'We do not provide service in this territory.',
                    ''
                  );
                }
              });
          } else {
            this.territories = [];
            this.data.TERRITORY_ID = 0;
            this.isTerritoryExpress = false;
            this.data.MAX_T_START_TIME = null;
            this.data.MAX_T_END_TIME = null;
            this.terriotrystarttime1 = null;
            this.terriotryendtime1 = null;
            this.message.error(
              'You can not create orders for this Territory',
              ''
            );
            this.isTerritoryMapped = false;
          }
        } else {
          this.api
            .getTeritory(
              1,
              1,
              '',
              '',
              ' AND IS_ACTIVE =1 AND ID =' + serviceAddress[0].TERRITORY_ID
            )
            .subscribe((data) => {
              if (data['code'] == 200 && data.count > 0) {
                this.territories = data['data'];
                this.data.TERRITORY_ID = this.territories[0]['ID'];
                this.data.TERRITORY_NAME = this.territories[0]['NAME'];
                this.data.MAX_T_START_TIME = this.territories[0]['GLOBAL_START_TIME'];
                this.data.MAX_T_END_TIME = this.territories[0]['GLOBAL_END_TIME'];
                const currentDate = new Date(this.currentDate2);
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth();
                const day = currentDate.getDate();

                const dateWithTime = new Date(
                  year,
                  month,
                  day,
                  ...this.data.MAX_T_START_TIME.split(':').map(Number)
                );
                const dateWithTime1 = new Date(
                  year,
                  month,
                  day,
                  ...this.data.MAX_T_END_TIME.split(':').map(Number)
                );

                this.terriotrystarttime1 = new Date(dateWithTime);
                this.terriotryendtime1 = new Date(dateWithTime1);
                this.isTerritoryExpress =
                  this.territories[0]['IS_EXPRESS_SERVICE_AVAILABLE'] == 0
                    ? false
                    : true;
                this.getCategoriesNodes();
              } else {
                this.territories = [];
                this.data.TERRITORY_ID = 0;
                this.isTerritoryExpress = false;
                this.data.MAX_T_START_TIME = null;
                this.data.MAX_T_END_TIME = null;
                this.terriotrystarttime1 = null;
                this.terriotryendtime1 = null;
                this.message.error(
                  'We do not provide service in this territory.',
                  ''
                );
              }
            });
        }
      } else {
        this.territories = [];
        this.data.MAX_T_START_TIME = null;
        this.data.MAX_T_END_TIME = null;
        this.terriotrystarttime1 = null;
        this.terriotryendtime1 = null;
        this.data.TERRITORY_ID = 0;
        this.isTerritoryExpress = false;
        this.message.error('No Territory Available For This Pincode', '');
      }
    }
    this.resetForm('S');
  }
  getteritory1(event) {
    if (event == null || event == undefined || event == '') {
      this.storeBillingaddress = null;

      this.data.ADDRESS_ID1 = 0;
      this.data.STATE_ID = 0;
      this.data.IS_SAME_STATE = 0;
    } else {
      var serviceAddress: any = this.addresses.filter(
        (element) => element.ID == event
      );

      var long: any;
      var longitude: any;
      var latitude: any;
      if (serviceAddress) {
        if (serviceAddress[0].GEO_LOCATION) {
          long = serviceAddress[0].GEO_LOCATION.split(',');
          longitude = long[1];
          latitude = long[0];
        }
        this.storeBillingaddress = {
          ID: serviceAddress[0]['ID'],
          ADDRESS_LINE_1: serviceAddress[0].ADDRESS_LINE_1,
          ADDRESS_LINE_2: serviceAddress[0].ADDRESS_LINE_2,
          DISTRICT_ID: serviceAddress[0].DISTRICT_ID,
          STATE_ID: serviceAddress[0].STATE_ID,
          CITY_NAME: serviceAddress[0].CITY_NAME,
          COUNTRY_ID: serviceAddress[0].COUNTRY_ID,
          PINCODE_ID: serviceAddress[0].PINCODE_ID,
          PINCODE: serviceAddress[0].PINCODE,
          LONGITUDE: longitude,
          LATITUDE: latitude,
          CONTACT_PERSON_NAME: serviceAddress[0].CONTACT_PERSON_NAME,
          MOBILE_NO: serviceAddress[0].MOBILE_NO,
          LANDMARK: serviceAddress[0].LANDMARK
            ? serviceAddress[0].LANDMARK
            : null,
        };

        this.data.STATE_ID = serviceAddress[0].STATE_ID;
        this.data.IS_SAME_STATE =
          this.STATE_ID == serviceAddress[0].STATE_ID ? true : false;
      }
    }
    this.resetForm('B');
  }

  getcategories() {
    this.api
      .getCategoryData(0, 0, 'SEQ_NO', 'asc', ' AND STATUS =1')
      .subscribe((data) => {
        if (data.code == 200) {
          this.categories = data['data'];
        } else {
          this.categories = [];
        }
      });
  }

  getUnits() {
    this.api
      .getUnitData(0, 0, 'ID', 'desc', ' AND IS_ACTIVE =1')
      .subscribe((data) => {
        if (data.code == 200) {
          this.uniteDta = data['data'];
        } else {
          this.uniteDta = [];
        }
      });
  }
  totalamount = 0;
  calculateTotalAmount() {
    this.totalamount = this.tableData.reduce(
      (sum, item) => sum + item.TOTAL_AMOUNT,
      0
    );
    return this.totalamount;
  }

  calculateTotal() {
    this.total = this.quantity * this.rate;
  }

  deleteRow(index: number) {
    this.tableData.splice(index, 1);
  }

  nzSelectedKeys = [];
  servicechange(event: any) {
    if (event) {
      this.api
        .getServiceItem(
          0,
          0,
          '',
          '',
          ' AND IS_ACTIVE =1 AND SERVICE_CATLOG_ID=' + event
        )
        .subscribe((data) => {
          if (data.code == 200) {
            this.services = data['data'];
          } else {
            this.services = [];
          }
        });

      var serviceee: any = this.servicescatalogue.filter(
        (element) => element.ID == event
      );
      this.servicenamee = serviceee[0].NAME;
    } else {
      this.selectedService = null;
      this.services = [];
    }
  }

  categoryname = '';
  subcategoryname = '';
  servicenamee = '';
  serviceitemnamee = '';

  categorychange(event: any) {
    if (
      this.data.CUSTOMER_ID == '' ||
      this.data.CUSTOMER_ID == null ||
      this.data.CUSTOMER_ID == undefined
    ) {
      this.selectedCategory = null;
      this.message.error('Please select customer name to proceed further.', '');
    } else {
      if (event) {
        this.api
          .getSubCategoryData(
            0,
            0,
            'SEQ_NO',
            'asc',
            ' AND STATUS =1 AND CATEGORY_ID=' + event
          )
          .subscribe((data) => {
            if (data['code'] == 200) {
              this.subcategories = data['data'];
            } else this.subcategories = [];
          });
        var categoryyy: any = this.categories.filter(
          (element) => element.ID == event
        );
        this.categoryname = categoryyy[0].CATEGORY_NAME;
      } else {
        this.subcategories = [];
        this.selectedSubcategory = null;
      }
    }
  }
  Subcategorychange(event: any) {
    if (event) {
      this.api
        .getServiceCatlogData(
          0,
          0,
          '',
          '',
          ' AND AVAILABILITY_STATUS=1 AND SUBCATEGORY_ID=' + event
        )
        .subscribe((data) => {
          if (data.code == 200) {
            this.servicescatalogue = data['data'];
          } else {
            this.servicescatalogue = [];
          }
        });

      var subcategoryyy: any = this.subcategories.filter(
        (element) => element.ID == event
      );
      this.subcategoryname = subcategoryyy[0].NAME;
    } else {
      this.servicescatalogue = [];
      this.selectedServices = null;
    }
  }

  onServiceChange(serviceKey: string) {
    var cust: any = this.services.filter((element) => element.ID == serviceKey);

    if (cust) {
      if (this.data.CUSTOMER_TYPE == 'I') {
        this.rate = cust[0].PRICE_B2C;
        this.calculateTotal();
      } else {
        this.rate = cust[0].PRICE_B2B;
        this.calculateTotal();
      }
    } else {
      this.rate = 0;
      this.calculateTotal();
    }

    if (serviceKey) {
      var servieitem: any = this.services.filter(
        (element) => element.ID == Number(serviceKey)
      );
      this.serviceitemnamee = servieitem[0].NAME;
    }
    // this.getServiceNameAndItem(serviceKey)
  }

  cancel() { }
  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }

    return true;
  }
  addcustomer(): void {
    this.drawerTitle = 'Create New Customer';
    this.drawerData = new customer();
    this.drawerVisible = true;
  }

  drawerClose(): void {
    this.drawerVisible = false;
    this.api
      .getAllCustomer(1, 1, 'ID', 'DESC', ' AND ACCOUNT_STATUS = 1')
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.customer.push(data['data'][0]);
          this.data.CUSTOMER_ID = data['data'][0].ID;
          this.getaddress(this.data.CUSTOMER_ID);
        }
      });
  }
  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  addcustomerAddress(): void {
    if (
      this.data.CUSTOMER_ID != undefined &&
      this.data.CUSTOMER_ID != null &&
      this.data.CUSTOMER_ID > 0
    ) {
      this.drawerTitle = 'Create New Address';
      this.drawerDataaddress = new Address();
      this.drawerDataaddress.CUSTOMER_ID = this.data.CUSTOMER_ID;
      this.drawerVisibleAddress = true;
    } else {
      this.message.error('Please select customer first', '');
    }
  }
  drawerAddressClose(): void {
    this.drawerVisibleAddress = false;

    this.api
      .getAllCustomerAddress(
        1,
        1,
        'IS_DEFAULT',
        'desc',
        ' AND STATUS = 1 AND CUSTOMER_ID= ' +
        this.data.CUSTOMER_ID +
        " AND (PINCODE_FOR='B' OR PINCODE_FOR='S')"
      )
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.addresses.push(data['data'][0]);
          this.data.ADDRESS_ID = data['data'][0].ID;
          this.getteritory(this.data.ADDRESS_ID);
          this.data.ADDRESS_ID1 = data['data'][0].ID;
        }
      });
  }
  get closeCallbackAddress() {
    return this.drawerAddressClose.bind(this);
  }

  addToTable(servicescatalogue, i) {
    if (
      this.servicescatalogue[i].QUANTITY == undefined ||
      this.servicescatalogue[i].QUANTITY <= 0
    ) {
      this.message.error('Please enter valid quantity.', '');
      return;
    } else if (
      this.servicescatalogue[i].KEY_PRICE == undefined ||
      this.servicescatalogue[i].KEY_PRICE < 0
    ) {
      this.message.error('Please enter valid rate.', '');
      return;
    } else if (
      this.servicescatalogue[i].UNIT_ID == undefined ||
      this.servicescatalogue[i].UNIT_ID == ''
    ) {
      this.message.error('Please select unit.', '');
      return;
    }
    var taxRate = 0;
    if (this.data.IS_SAME_STATE) {
      // console.log("1", this.servicescatalogue[i], this.servicescatalogue[i].SGST, this.servicescatalogue[i].CGST)
      taxRate =
        parseFloat(this.servicescatalogue[i].SGST) +
        parseFloat(this.servicescatalogue[i].CGST);
    } else {
      // console.log("2")
      taxRate = parseFloat(this.servicescatalogue[i].IGST);
    }

    if (
      this.servicescatalogue[i].CESS != undefined &&
      this.servicescatalogue[i].CESS != null &&
      this.servicescatalogue[i].CESS != ''
    ) {
      taxRate = taxRate + parseFloat(this.servicescatalogue[i].CESS);
    }

    const taxRateDecimal = taxRate / 100;
    this.servicescatalogue[i].TAX_EXCLUSIVE_AMOUNT =
      Number(this.servicescatalogue[i].KEY_PRICE) / (1 + taxRateDecimal);
    this.servicescatalogue[i].TAX_EXCLUSIVE_AMOUNT =
      Math.round(this.servicescatalogue[i].TAX_EXCLUSIVE_AMOUNT * 100) / 100;

    this.servicescatalogue[i].TAX_AMOUNT =
      (Number(this.servicescatalogue[i].KEY_PRICE) -
        Number(this.servicescatalogue[i].TAX_EXCLUSIVE_AMOUNT)) *
      Number(this.servicescatalogue[i].QUANTITY);

    this.servicescatalogue[i].TAX_AMOUNT =
      Math.round(this.servicescatalogue[i].TAX_AMOUNT * 100) / 100;

    this.servicescatalogue[i].TOTAL_TAX_EXCLUSIVE_AMOUNT =
      Number(this.servicescatalogue[i].TAX_EXCLUSIVE_AMOUNT) *
      Number(this.servicescatalogue[i].QUANTITY);

    this.servicescatalogue[i].TOTAL_TAX_EXCLUSIVE_AMOUNT =
      Math.round(this.servicescatalogue[i].TOTAL_TAX_EXCLUSIVE_AMOUNT * 100) /
      100;

    var ind = -1;
    ind = this.tableData.findIndex((element) => {
      return element.SERVICE_ITEM_ID == servicescatalogue.ID;
    });
    if (ind != undefined && ind != null && ind > -1) {
      if (
        this.servicescatalogue[i].MAX_QTY >=
        this.tableData[ind].QUANTITY + servicescatalogue.QUANTITY
      ) {
        this.tableData[ind] = {
          TECHNICIAN_COST: this.servicescatalogue[i].TECHNICIAN_COST,
          VENDOR_COST: this.servicescatalogue[i].VENDOR_COST,
          CATEGORY_ID: this.servicescatalogue[i].CATEGORY_ID,
          SUB_CATEGORY_ID: this.servicescatalogue[i].SUB_CATEGORY_ID,
          SERVICE_CATALOGUE_ID: this.servicescatalogue[i].PARENT_ID,
          SERVICE_ITEM_ID: this.servicescatalogue[i].ID,
          JOB_CARD_ID: 0,
          CATEGORY_NAME: this.servicescatalogue[i].CATEGORY_NAME,
          SUB_CATEGORY_NAME: this.servicescatalogue[i].SUB_CATEGORY_NAME,
          SERVICE_PARENT_NAME: this.servicescatalogue[i].SERVICE_NAME,
          SERVICE_NAME: this.servicescatalogue[i].NAME,
          QUANTITY:
            this.tableData[ind].QUANTITY + this.servicescatalogue[i].QUANTITY,
          RATE: this.servicescatalogue[i].KEY_PRICE,
          MAX_QTY: this.servicescatalogue[i].MAX_QTY,
          UNIT_ID: this.servicescatalogue[i].UNIT_ID,
          TOTAL_AMOUNT:
            Number(this.tableData[ind].TOTAL_AMOUNT) +
            Number(this.servicescatalogue[i].TOTAL_AMOUNT),
          TAX_RATE: taxRate,
          TAX_AMOUNT:
            Math.round(
              (Number(this.tableData[ind].TAX_AMOUNT) +
                Number(this.servicescatalogue[i].TAX_AMOUNT)) *
              100
            ) / 100,
          IS_EXPRESS: this.servicescatalogue[i].IS_EXPRESS,
          TOTAL_TAX_EXCLUSIVE_AMOUNT:
            Math.round(
              (Number(this.tableData[ind].TOTAL_TAX_EXCLUSIVE_AMOUNT) +
                Number(this.servicescatalogue[i].TOTAL_TAX_EXCLUSIVE_AMOUNT)) *
              100
            ) / 100,
          EXPRESS_DELIVERY_CHARGES:
            this.servicescatalogue[i].EXPRESS_COST != undefined &&
              this.servicescatalogue[i].EXPRESS_COST != null
              ? parseFloat(this.servicescatalogue[i].EXPRESS_COST)
              : 0,
          TAX_EXCLUSIVE_AMOUNT: this.servicescatalogue[i].TAX_EXCLUSIVE_AMOUNT,
          IS_JOB_CREATED_DIRECTLY:
            this.servicescatalogue[i].IS_JOB_CREATED_DIRECTLY,

          UNIT_NAME: this.servicescatalogue[i].UNIT_ID,
          // TAX_AMOUNT: this.servicescatalogue[i].TAX_AMOUNT,
          END_TIME: this.servicescatalogue[i].END_TIME,
          START_TIME: this.servicescatalogue[i].START_TIME,
          DURARTION_HOUR: Number(this.servicescatalogue[i].DURARTION_HOUR),
          DURARTION_MIN: Number(this.servicescatalogue[i].DURARTION_MIN),
          PREPARATION_HOURS: Number(
            this.servicescatalogue[i].T_PREPARATION_HOURS
          ),
          PREPARATION_MINUTES: Number(
            this.servicescatalogue[i].T_PREPARATION_MINUTES
          ),
          TOTAL_DURARTION_MIN:
            Number(this.servicescatalogue[i].T_PREPARATION_HOURS) * 60 +
            Number(this.servicescatalogue[i].T_PREPARATION_MINUTES),
          IGST: this.data.IS_SAME_STATE ? 0 : this.servicescatalogue[i].IGST,
          CGST: this.data.IS_SAME_STATE ? this.servicescatalogue[i].CGST : 0,
          SGST: this.data.IS_SAME_STATE ? this.servicescatalogue[i].SGST : 0,
          CESS: this.servicescatalogue[i].CESS,
        };
      } else {
        this.message.error(
          'You have already added ' +
          this.tableData[ind].QUANTITY +
          ' quantity of this service. The maximum allowed quantity per order is ' +
          this.servicescatalogue[i].MAX_QTY +
          '. You can only add ' +
          (this.servicescatalogue[i].MAX_QTY - this.tableData[ind].QUANTITY) +
          ' more quantity.',
          ''
        );
      }
    } else {
      this.tableData.push({
        TECHNICIAN_COST: this.servicescatalogue[i].TECHNICIAN_COST,
        VENDOR_COST: this.servicescatalogue[i].VENDOR_COST,
        CATEGORY_ID: this.servicescatalogue[i].CATEGORY_ID,
        SUB_CATEGORY_ID: this.servicescatalogue[i].SUB_CATEGORY_ID,
        SERVICE_CATALOGUE_ID: this.servicescatalogue[i].PARENT_ID,
        SERVICE_ITEM_ID: this.servicescatalogue[i].ID,
        JOB_CARD_ID: 0,
        CATEGORY_NAME: this.servicescatalogue[i].CATEGORY_NAME,
        SUB_CATEGORY_NAME: this.servicescatalogue[i].SUB_CATEGORY_NAME,
        SERVICE_PARENT_NAME: this.servicescatalogue[i].SERVICE_NAME,
        SERVICE_NAME: this.servicescatalogue[i].NAME,
        QUANTITY: this.servicescatalogue[i].QUANTITY,
        RATE: this.servicescatalogue[i].KEY_PRICE,
        UNIT_ID: this.servicescatalogue[i].UNIT_ID,
        TOTAL_AMOUNT: Number(this.servicescatalogue[i].TOTAL_AMOUNT),
        TAX_RATE: taxRate,
        MAX_QTY: this.servicescatalogue[i].MAX_QTY,
        TAX_AMOUNT: this.servicescatalogue[i].TAX_AMOUNT,
        IS_JOB_CREATED_DIRECTLY:
          this.servicescatalogue[i].IS_JOB_CREATED_DIRECTLY,

        IS_EXPRESS: this.servicescatalogue[i].IS_EXPRESS,
        TOTAL_TAX_EXCLUSIVE_AMOUNT:
          Math.round(
            this.servicescatalogue[i].TOTAL_TAX_EXCLUSIVE_AMOUNT * 100
          ) / 100,
        EXPRESS_DELIVERY_CHARGES:
          this.servicescatalogue[i].EXPRESS_COST != undefined &&
            this.servicescatalogue[i].EXPRESS_COST != null
            ? parseFloat(this.servicescatalogue[i].EXPRESS_COST)
            : 0,
        TAX_EXCLUSIVE_AMOUNT: this.servicescatalogue[i].TAX_EXCLUSIVE_AMOUNT,

        UNIT_NAME: this.servicescatalogue[i].UNIT_ID,
        // TAX_AMOUNT: this.servicescatalogue[i].TAX_AMOUNT,
        END_TIME: this.servicescatalogue[i].END_TIME,
        START_TIME: this.servicescatalogue[i].START_TIME,
        DURARTION_HOUR: Number(this.servicescatalogue[i].DURARTION_HOUR),
        DURARTION_MIN: Number(this.servicescatalogue[i].DURARTION_MIN),
        PREPARATION_HOURS: Number(
          this.servicescatalogue[i].T_PREPARATION_HOURS
        ),
        PREPARATION_MINUTES: Number(
          this.servicescatalogue[i].T_PREPARATION_MINUTES
        ),
        TOTAL_DURARTION_MIN:
          Number(this.servicescatalogue[i].T_PREPARATION_HOURS) * 60 +
          Number(this.servicescatalogue[i].T_PREPARATION_MINUTES),
        IGST: this.data.IS_SAME_STATE ? 0 : this.servicescatalogue[i].IGST,
        CGST: this.data.IS_SAME_STATE ? this.servicescatalogue[i].CGST : 0,
        SGST: this.data.IS_SAME_STATE ? this.servicescatalogue[i].SGST : 0,
        CESS: this.servicescatalogue[i].CESS,
      });
    }
    if (this.servicescatalogue[i].IS_EXPRESS) this.showExpress = true;

    this.calculate();
  }
  @Input() showExpress = false;
  addToTable2(servicescatalogue, i, k) {
    if (
      this.servicescatalogue[i]['CHILDS'][k].QUANTITY == undefined ||
      this.servicescatalogue[i]['CHILDS'][k].QUANTITY == null ||
      this.servicescatalogue[i]['CHILDS'][k].QUANTITY <= 0
    ) {
      this.message.error('Please enter valid quantity.', '');
      return;
    } else if (
      this.servicescatalogue[i]['CHILDS'][k].KEY_PRICE == undefined ||
      this.servicescatalogue[i]['CHILDS'][k].KEY_PRICE == null ||
      this.servicescatalogue[i]['CHILDS'][k].KEY_PRICE < 0
    ) {
      this.message.error('Please enter valid rate.', '');
      return;
    } else if (
      this.servicescatalogue[i]['CHILDS'][k].UNIT_ID == undefined ||
      this.servicescatalogue[i]['CHILDS'][k].UNIT_ID == null ||
      this.servicescatalogue[i]['CHILDS'][k].UNIT_ID == ''
    ) {
      this.message.error('Please select unit.', '');
      return;
    }

    var taxRate = 0;
    if (this.data.IS_SAME_STATE) {
      // console.log("11")

      taxRate =
        parseFloat(this.servicescatalogue[i]['CHILDS'][k].SGST) +
        parseFloat(this.servicescatalogue[i]['CHILDS'][k].CGST);
    } else {
      // console.log("22")

      taxRate = parseFloat(this.servicescatalogue[i]['CHILDS'][k].IGST);
    }

    if (
      this.servicescatalogue[i]['CHILDS'][k].CESS != undefined &&
      this.servicescatalogue[i]['CHILDS'][k].CESS != null &&
      this.servicescatalogue[i]['CHILDS'][k].CESS != ''
    ) {
      taxRate =
        taxRate + parseFloat(this.servicescatalogue[i]['CHILDS'][k].CESS);
    }

    const taxRateDecimal = taxRate / 100;
    this.servicescatalogue[i]['CHILDS'][k].TAX_EXCLUSIVE_AMOUNT =
      Number(this.servicescatalogue[i]['CHILDS'][k].KEY_PRICE) /
      (1 + taxRateDecimal);

    this.servicescatalogue[i]['CHILDS'][k].TAX_EXCLUSIVE_AMOUNT =
      Math.round(
        this.servicescatalogue[i]['CHILDS'][k].TAX_EXCLUSIVE_AMOUNT * 100
      ) / 100;
    this.servicescatalogue[i]['CHILDS'][k].TAX_AMOUNT =
      (Number(this.servicescatalogue[i]['CHILDS'][k].KEY_PRICE) -
        Number(this.servicescatalogue[i]['CHILDS'][k].TAX_EXCLUSIVE_AMOUNT)) *
      this.servicescatalogue[i]['CHILDS'][k].QUANTITY;

    this.servicescatalogue[i]['CHILDS'][k].TAX_AMOUNT =
      Math.round(this.servicescatalogue[i]['CHILDS'][k].TAX_AMOUNT * 100) / 100;

    this.servicescatalogue[i]['CHILDS'][k].TOTAL_TAX_EXCLUSIVE_AMOUNT =
      Number(this.servicescatalogue[i]['CHILDS'][k].TAX_EXCLUSIVE_AMOUNT) *
      this.servicescatalogue[i]['CHILDS'][k].QUANTITY;

    this.servicescatalogue[i]['CHILDS'][k].TOTAL_TAX_EXCLUSIVE_AMOUNT =
      Math.round(
        this.servicescatalogue[i]['CHILDS'][k].TOTAL_TAX_EXCLUSIVE_AMOUNT * 100
      ) / 100;

    var ind = -1;
    ind = this.tableData.findIndex((element) => {
      return element.SERVICE_ITEM_ID == servicescatalogue.ID;
    });

    if (ind != undefined && ind != null && ind > -1) {
      if (
        this.servicescatalogue[i]['CHILDS'][k].MAX_QTY >
        this.tableData[ind].QUANTITY
      ) {
        this.tableData[ind] = {
          TECHNICIAN_COST:
            this.servicescatalogue[i]['CHILDS'][k].TECHNICIAN_COST,
          VENDOR_COST: this.servicescatalogue[i]['CHILDS'][k].VENDOR_COST,
          CATEGORY_ID: this.servicescatalogue[i]['CHILDS'][k].CATEGORY_ID,
          SUB_CATEGORY_ID:
            this.servicescatalogue[i]['CHILDS'][k].SUB_CATEGORY_ID,
          SERVICE_CATALOGUE_ID:
            this.servicescatalogue[i]['CHILDS'][k].PARENT_ID,
          SERVICE_ITEM_ID: this.servicescatalogue[i]['CHILDS'][k].ID,
          JOB_CARD_ID: 0,
          CATEGORY_NAME: this.servicescatalogue[i]['CHILDS'][k].CATEGORY_NAME,
          SUB_CATEGORY_NAME:
            this.servicescatalogue[i]['CHILDS'][k].SUB_CATEGORY_NAME,
          SERVICE_PARENT_NAME:
            this.servicescatalogue[i]['CHILDS'][k].SERVICE_NAME,
          IS_JOB_CREATED_DIRECTLY:
            this.servicescatalogue[i]['CHILDS'][k].IS_JOB_CREATED_DIRECTLY,

          SERVICE_NAME: this.servicescatalogue[i]['CHILDS'][k].NAME,
          MAX_QTY: this.servicescatalogue[i]['CHILDS'][k].MAX_QTY,
          QUANTITY:
            this.tableData[ind].QUANTITY +
            this.servicescatalogue[i]['CHILDS'][k].QUANTITY,
          RATE: this.servicescatalogue[i]['CHILDS'][k].KEY_PRICE,
          UNIT_ID: this.servicescatalogue[i]['CHILDS'][k].UNIT_ID,
          TOTAL_AMOUNT:
            Number(this.tableData[ind].TOTAL_AMOUNT) +
            Number(this.servicescatalogue[i]['CHILDS'][k].TOTAL_AMOUNT),

          TAX_RATE: taxRate,
          TAX_AMOUNT:
            Math.round(
              (Number(this.tableData[ind].TAX_AMOUNT) +
                Number(this.servicescatalogue[i]['CHILDS'][k].TAX_AMOUNT)) *
              100
            ) / 100,
          IS_EXPRESS: this.servicescatalogue[i]['CHILDS'][k].IS_EXPRESS,
          TOTAL_TAX_EXCLUSIVE_AMOUNT:
            Math.round(
              (Number(this.tableData[ind].TOTAL_TAX_EXCLUSIVE_AMOUNT) +
                Number(
                  this.servicescatalogue[i]['CHILDS'][k]
                    .TOTAL_TAX_EXCLUSIVE_AMOUNT
                )) *
              100
            ) / 100,
          EXPRESS_DELIVERY_CHARGES:
            this.servicescatalogue[i]['CHILDS'][k].EXPRESS_COST != undefined &&
              this.servicescatalogue[i]['CHILDS'][k].EXPRESS_COST != null
              ? parseFloat(this.servicescatalogue[i]['CHILDS'][k].EXPRESS_COST)
              : 0,
          TAX_EXCLUSIVE_AMOUNT:
            this.servicescatalogue[i]['CHILDS'][k].TAX_EXCLUSIVE_AMOUNT,

          UNIT_NAME: this.servicescatalogue[i]['CHILDS'][k].UNIT_ID,
          // TAX_AMOUNT: this.servicescatalogue[i]['CHILDS'][k].TAX_AMOUNT,
          END_TIME: this.servicescatalogue[i]['CHILDS'][k].END_TIME,
          START_TIME: this.servicescatalogue[i]['CHILDS'][k].START_TIME,
          DURARTION_HOUR: Number(
            this.servicescatalogue[i]['CHILDS'][k].DURARTION_HOUR
          ),
          DURARTION_MIN: Number(
            this.servicescatalogue[i]['CHILDS'][k].DURARTION_MIN
          ),
          PREPARATION_HOURS: Number(
            this.servicescatalogue[i]['CHILDS'][k].T_PREPARATION_HOURS
          ),
          PREPARATION_MINUTES: Number(
            this.servicescatalogue[i]['CHILDS'][k].T_PREPARATION_MINUTES
          ),
          TOTAL_DURARTION_MIN:
            Number(this.servicescatalogue[i]['CHILDS'][k].T_PREPARATION_HOURS) *
            60 +
            Number(
              this.servicescatalogue[i]['CHILDS'][k].T_PREPARATION_MINUTES
            ),
          IGST: this.data.IS_SAME_STATE ? 0 : this.servicescatalogue[i]['CHILDS'][k].IGST,
          CGST: this.data.IS_SAME_STATE ? this.servicescatalogue[i]['CHILDS'][k].CGST : 0,
          SGST: this.data.IS_SAME_STATE ? this.servicescatalogue[i]['CHILDS'][k].SGST : 0,
          CESS: this.servicescatalogue[i]['CHILDS'][k].CESS,
        };
      } else {
        this.message.error(
          'This service item already available in cart with ' +
          this.servicescatalogue[i].MAX_QTY +
          ' quantity',
          ''
        );
      }
    } else {
      this.tableData.push({
        TECHNICIAN_COST: this.servicescatalogue[i]['CHILDS'][k].TECHNICIAN_COST,
        VENDOR_COST: this.servicescatalogue[i]['CHILDS'][k].VENDOR_COST,
        CATEGORY_ID: this.servicescatalogue[i]['CHILDS'][k].CATEGORY_ID,
        SUB_CATEGORY_ID: this.servicescatalogue[i]['CHILDS'][k].SUB_CATEGORY_ID,
        SERVICE_CATALOGUE_ID: this.servicescatalogue[i]['CHILDS'][k].PARENT_ID,
        SERVICE_ITEM_ID: this.servicescatalogue[i]['CHILDS'][k].ID,
        JOB_CARD_ID: 0,
        CATEGORY_NAME: this.servicescatalogue[i]['CHILDS'][k].CATEGORY_NAME,
        SUB_CATEGORY_NAME:
          this.servicescatalogue[i]['CHILDS'][k].SUB_CATEGORY_NAME,
        SERVICE_PARENT_NAME:
          this.servicescatalogue[i]['CHILDS'][k].SERVICE_NAME,
        SERVICE_NAME: this.servicescatalogue[i]['CHILDS'][k].NAME,
        QUANTITY: this.servicescatalogue[i]['CHILDS'][k].QUANTITY,
        RATE: this.servicescatalogue[i]['CHILDS'][k].KEY_PRICE,
        MAX_QTY: this.servicescatalogue[i]['CHILDS'][k].MAX_QTY,
        IS_JOB_CREATED_DIRECTLY:
          this.servicescatalogue[i]['CHILDS'][k].IS_JOB_CREATED_DIRECTLY,

        UNIT_ID: this.servicescatalogue[i]['CHILDS'][k].UNIT_ID,
        TOTAL_AMOUNT: Number(
          this.servicescatalogue[i]['CHILDS'][k].TOTAL_AMOUNT
        ),

        TAX_RATE: taxRate,
        TAX_AMOUNT: this.servicescatalogue[i]['CHILDS'][k].TAX_AMOUNT,
        IS_EXPRESS: this.servicescatalogue[i]['CHILDS'][k].IS_EXPRESS,
        TOTAL_TAX_EXCLUSIVE_AMOUNT:
          this.servicescatalogue[i]['CHILDS'][k].TOTAL_TAX_EXCLUSIVE_AMOUNT,
        EXPRESS_DELIVERY_CHARGES:
          this.servicescatalogue[i]['CHILDS'][k].EXPRESS_COST != undefined &&
            this.servicescatalogue[i]['CHILDS'][k].EXPRESS_COST != null
            ? parseFloat(this.servicescatalogue[i]['CHILDS'][k].EXPRESS_COST)
            : 0,
        TAX_EXCLUSIVE_AMOUNT:
          this.servicescatalogue[i]['CHILDS'][k].TAX_EXCLUSIVE_AMOUNT,

        UNIT_NAME: this.servicescatalogue[i]['CHILDS'][k].UNIT_ID,
        // TAX_AMOUNT: this.servicescatalogue[i]['CHILDS'][k].TAX_AMOUNT,
        END_TIME: this.servicescatalogue[i]['CHILDS'][k].END_TIME,
        START_TIME: this.servicescatalogue[i]['CHILDS'][k].START_TIME,
        DURARTION_HOUR: Number(
          this.servicescatalogue[i]['CHILDS'][k].DURARTION_HOUR
        ),
        DURARTION_MIN: Number(
          this.servicescatalogue[i]['CHILDS'][k].DURARTION_MIN
        ),
        PREPARATION_HOURS: Number(
          this.servicescatalogue[i]['CHILDS'][k].T_PREPARATION_HOURS
        ),
        PREPARATION_MINUTES: Number(
          this.servicescatalogue[i]['CHILDS'][k].T_PREPARATION_MINUTES
        ),
        TOTAL_DURARTION_MIN:
          Number(this.servicescatalogue[i]['CHILDS'][k].T_PREPARATION_HOURS) *
          60 +
          Number(this.servicescatalogue[i]['CHILDS'][k].T_PREPARATION_MINUTES),
        IGST: this.data.IS_SAME_STATE ? 0 : this.servicescatalogue[i]['CHILDS'][k].IGST,
        CGST: this.data.IS_SAME_STATE ? this.servicescatalogue[i]['CHILDS'][k].CGST : 0,
        SGST: this.data.IS_SAME_STATE ? this.servicescatalogue[i]['CHILDS'][k].SGST : 0,
        CESS: this.servicescatalogue[i]['CHILDS'][k].CESS,
      });
    }
    if (this.servicescatalogue[i].IS_EXPRESS) this.showExpress = true;
    this.calculate();
  }

  resetForm(from) {
    this.quantity = 0;
    this.rate = 0;
    this.unit = '';
    this.total = 0;
    this.tableData = [];
    this.expectedDate = null;

    if (from == 'C') {
      this.data.SERVICE_ADDRESS_DATA = null;
      this.data.BILLING_ADDRESS_DATA = null;
      this.data.TERRITORY_ID = 0;
    }
    if (from == 'C' && from == 'S') {
      this.nodes = [];
      this.servicescatalogue = [];
      this.services = [];
      this.selectedCategory = '';
      this.selectedSubcategory = '';
      this.selectedService = null;
      this.selectedServices = null;
      this.selectedServiceItem = null;
      this.serviceSubCatName = '';
      this.serviceCatName = '';
      this.data.IS_EXPRESS = false;
      this.showExpress = false;
      this.isTerritoryExpress = false;
      this.selectedKeys = [];
    }

    this.data.ORDER_DETAILS_DAT = [];
    this.data.TOTAL_TAXABLE_AMOUNT = 0;
    this.data.TAX_RATE = 0;
    this.data.TAX_AMOUNT = 0;
    this.data.EXPRESS_DELIVERY_CHARGES = 0;
    this.data.TOTAL_AMOUNT = 0;
    this.data.DISCOUNT_AMOUNT = 0;
  }

  findServiceKeyByTitle(nodes: any[], serviceTitle: string): string | null {
    for (const node of nodes) {
      if (
        node.title.trim().toLowerCase() === serviceTitle.trim().toLowerCase()
      ) {
        return node.key;
      }

      if (node.children) {
        const foundKey = this.findServiceKeyByTitle(
          node.children,
          serviceTitle
        );
        if (foundKey) {
          return foundKey;
        }
      }
    }
    return null;
  }

  fullPath: any;
  @Input() serviceSubCatName: any = '';
  @Input() serviceCatName: any = '';
  getServiceNameAndItem(event: any): void {
    const selectedNode = this.findServiceByKey(this.nodes, event);
    const selectedKey = event;
    const parentTitle = this.findParentServiceName(this.nodes, selectedKey);
    if (parentTitle) {
      this.serviceCatName = parentTitle;
    } else {
      this.serviceCatName = selectedNode?.title || 'Unknown Service';
    }

    this.serviceSubCatName = selectedNode?.title || 'Unknown Service Item';
  }
  findServiceByKey(nodes: any[], key: number): any | null {
    for (const node of nodes) {
      if (node.key === key) {
        return node;
      }
      if (node.children) {
        const foundNode = this.findServiceByKey(node.children, key);
        if (foundNode) {
          return foundNode;
        }
      }
    }
    return null;
  }

  findParentServiceName(nodes: any[], childKey: number): string | null {
    for (const node of nodes) {
      if (node.children) {
        const childNode = node.children.find(
          (child: any) => child.key === childKey
        );
        if (childNode) {
          return node.title;
        }
        const parentTitle = this.findParentServiceName(node.children, childKey);
        if (parentTitle) {
          return parentTitle;
        }
      }
    }
    return null;
  }

  resetDrawer(orderDrawer: NgForm) {
    this.data = new orderMasterData();
    orderDrawer.form.markAsPristine();
    orderDrawer.form.markAsUntouched();
  }
  deleteCancel() { }

  save(addNew: boolean, orderDrawer: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;

    if (
      this.data.CUSTOMER_ID == null ||
      this.data.CUSTOMER_ID == undefined ||
      this.data.CUSTOMER_ID == ''
    ) {
      this.isOk = false;
      this.message.error(' Please select custome name', '');
    } else if (
      this.storeserviceaddress == null ||
      this.storeserviceaddress == undefined ||
      this.storeserviceaddress == ''
    ) {
      this.isOk = false;
      this.message.error('Please select service address', '');
    } else if (
      this.data.CUSTOMER_TYPE == 'B' &&
      (this.storeBillingaddress == null ||
        this.storeBillingaddress == undefined ||
        this.storeBillingaddress == '')
    ) {
      this.isOk = false;
      this.message.error('Please select billing address', '');
    } else if (
      this.data.TERRITORY_ID == null ||
      this.data.TERRITORY_ID == undefined ||
      this.data.TERRITORY_ID == 0
    ) {
      this.isOk = false;
      this.message.error('Please select territory', '');
    } else if (
      this.data.ORDER_MEDIUM == null ||
      this.data.ORDER_MEDIUM == undefined ||
      this.data.ORDER_MEDIUM == 0
    ) {
      this.isOk = false;
      this.message.error('Please select source of order', '');
    } else if (this.tableData.length <= 0) {
      this.isOk = false;
      this.message.error('Please add atleast one service item', '');
    } else if (this.expectedDate == null || this.expectedDate == undefined) {
      this.isOk = false;
      this.message.error('Please select expected due date', '');
    } else if (this.time == null || this.time == undefined) {
      this.isOk = false;
      this.message.error('Please select expected time', '');
    }

    if (this.isOk) {
      this.isSpinning = true;
      this.data.SERVICE_ADDRESS_DATA = this.storeserviceaddress;
      this.data.ORDER_DETAILS_DAT = this.tableData;
      if (this.data.CUSTOMER_TYPE != 'I') {
        this.data.BILLING_ADDRESS_DATA = this.storeBillingaddress;
      } else {
        this.data.BILLING_ADDRESS_DATA = this.storeserviceaddress;
      }
      if (this.data.IS_EXPRESS === false) {
        this.tableData.forEach((item) => {
          item.IS_EXPRESS = false;
        });
      }

      this.data.ORDER_DETAILS_DAT = this.tableData;

      var ORDER_DATA = {
        CUSTOMER_ID: this.data.CUSTOMER_ID,
        ORDER_MEDIUM: this.data.ORDER_MEDIUM,
        TERRITORY_ID: this.data.TERRITORY_ID,
        CLIENT_ID: '1',
        IS_EXPRESS: this.data.IS_EXPRESS,
        SERVICE_COUNT: this.tableData.length,
        TOTAL_TAXABLE_AMOUNT: this.data.TOTAL_TAXABLE_AMOUNT,
        DISCOUNT_AMOUNT: this.data.DISCOUNT_AMOUNT,
        EXPRESS_DELIVERY_CHARGES: this.data.EXPRESS_DELIVERY_CHARGES,
        TAX_AMOUNT: this.data.TAX_AMOUNT,
        IGST_TAX_AMOUNT: this.data.TAX_AMOUNT,
        CUSTOMER_TYPE: this.data.CUSTOMER_TYPE,
        STATE_ID: this.data.STATE_ID,
        IS_SAME_STATE: this.data.IS_SAME_STATE,
        CUSTOMER_NAME: this.data.CUSTOMER_NAME,
        ORDER_CREATER_ID: this.vendor_id ? this.vendor_id : 0,
        ORDER_CREATED_BY:
          this.vendor_id === '8' || this.vendor_id === 8 ? 'A' : this.Usertype,
      };
      // VENDOR_ID: this.decreptedvendorId,
      var SERVICE_ADDRESS_DATA = this.data.SERVICE_ADDRESS_DATA;
      var BILLING_ADDRESS_DATA = this.data.BILLING_ADDRESS_DATA;

      var ORDER_DETAILS_DATA = this.data.ORDER_DETAILS_DAT;

      var expecteddateee = this.datePipe.transform(
        this.expectedDate,
        'yyyy-MM-dd'
      );
      var expecteddateeetime = this.datePipe.transform(this.time, 'HH:mm:ss');
      var totaldatee = `${expecteddateee} ${expecteddateeetime}`;

      var SUMMARY_DATA = {
        GROSS_AMOUNT: this.data.TOTAL_TAXABLE_AMOUNT,
        TAX_RATE: this.data.TAX_RATE,
        COUPON_CHARGES: 0,
        DISCOUNT_AMOUNT: 0,
        TAX_AMOUNT: this.data.TAX_AMOUNT,
        SERVICE_CHARGES: this.data.EXPRESS_DELIVERY_CHARGES,
        NET_AMOUNT: this.data.TOTAL_AMOUNT,
        TOTAL_AMOUNT: this.data.TOTAL_AMOUNT,
        SPECIAL_INSTRUCTIONS: this.specialInstruction,
        EXPECTED_DATE_TIME: totaldatee,
      };

      if (this.data.ID) {
        ORDER_DATA['ID'] = this.data.ID;
        SUMMARY_DATA['FINAL_AMOUNT'] = this.data.TOTAL_AMOUNT;
        SUMMARY_DATA['PAYMENT_MODE'] = this.data.PAYMENT_MODE;
        var maindata: any = {
          ORDER_DATA: ORDER_DATA,
          ORDER_DETAILS_DATA: ORDER_DETAILS_DATA,
          SUMMARY_DATA: SUMMARY_DATA,
          DELETED_DATA: this.DELETED_IDS,
        };
        this.api.updateOrdersDetails(maindata).subscribe(
          (successCode: any) => {
            if (successCode.code == '200') {
              this.message.success('Order Updated Successfully', '');
              this.drawerCloseorder();
              this.isSpinning = false;
            } else {
              this.message.error('Order Updation Failed', '');
              this.isSpinning = false;
            }
          },
          (err: HttpErrorResponse) => {
            this.isSpinning = false;
            if (err.status === 0) {
              this.message.error(
                'Unable to connect. Please check your internet or server connection and try again shortly.',
                ''
              );
            } else {
              this.message.error('Something Went Wrong.', '');
            }
          }
        );
      } else {
        var custdd: any = this.customer.filter(
          (element) => element.ID == this.data.CUSTOMER_ID
        );
        var maindata: any = {
          USER_ID: this.decrepteduserID,
          MOBILE_NO: custdd[0]['MOBILE_NO'],
          ORDER_DATA: ORDER_DATA,
          SERVICE_ADDRESS_DATA: SERVICE_ADDRESS_DATA,
          BILLING_ADDRESS_DATA: BILLING_ADDRESS_DATA,
          ORDER_DETAILS_DATA: ORDER_DETAILS_DATA,
          SUMMARY_DATA: SUMMARY_DATA,
          DELETED_IDS: this.DELETED_IDS,
        };
        this.api.createOrdersData(maindata).subscribe(
          (successCode: any) => {
            if (successCode.code == '200') {
              this.message.success('New Order Created Successfully', '');
              this.drawerCloseorder();
              this.isSpinning = false;
            } else {
              this.message.error('Order Creation Failed', '');
              this.isSpinning = false;
            }
          },
          (err: HttpErrorResponse) => {
            this.isSpinning = false;
            if (err.status === 0) {
              this.message.error(
                'Unable to connect. Please check your internet or server connection and try again shortly.',
                ''
              );
            } else {
              this.message.error('Something Went Wrong.', '');
            }
          }
        );
      }
    }
  }
  close() {
    this.drawerClose();
  }
  totaltaxamount: any = 0;
  gettotaltax() {
    if (this.taxdata.length > 0) {
      if (this.totalamount && this.taxdata[0].RATE) {
        var tax = (this.totalamount * this.taxdata[0].RATE) / 100;

        this.totaltaxamount = tax;
        // return "( Rate " + this.taxdata[0].RATE + " %)";
        return '';
      } else {
        return '';
      }
    } else {
      this.totaltaxamount = 0;
      return '';
    }
  }
  searchValue = '';
  searchValue2 = '';
  nzEvent(event: NzFormatEmitEvent): void {
    if (event.eventName == 'search') {
      if (this.searchValue == '') {
        this.expandedKeys = this.getAllKeys(this.nodes);
        this.expanded = true;
      }
    }

    if (event.node != undefined) {
      if (event.node.level == 1) this.getServices(event.node.key);
      this.onNodeClick(event);
    }
  }
  onNodeClick(event: any): void {
    const clickedNodeKey = event.node.key;
    this.selectedKeys =
      this.selectedKeys === clickedNodeKey ? clickedNodeKey : clickedNodeKey;
  }

  isNodeSelected(key: string): boolean {
    return this.selectedKeys === key;
  }
  expanded = true;
  @Input() expandedKeys: any = [];
  getCategoriesNodes() {
    this.expandedKeys = [];
    this.api
      .getCategoriesForOrder(this.data.TERRITORY_ID, this.data.CUSTOMER_ID)
      .subscribe((data) => {
        if (data['code'] == 200 && data['data'] != null) {
          this.nodes = data['data'];
          this.expandedKeys = this.getAllKeys(this.nodes);

          this.selectedKeys = this.nodes[0]['children'][0]['key'];
          this.getServices(this.selectedKeys);
          this.nodes[0]['children'][0]['selected'] = true;
          this.expanded = true;
        } else this.nodes = [];
      });
  }

  getAllKeys(data: any): string[] {
    let keys: any = [];
    data.forEach((item) => {
      keys.push(item.key);
      if (item.children) {
        keys = keys.concat(this.getAllKeys(item.children));
      }
    });
    return keys;
  }

  isSpinning2 = false;

  getServices(SUB_CATEGORY_ID) {
    if (
      this.data.CUSTOMER_TYPE == 'B' &&
      this.data['IS_SPECIAL_CATALOGUE'] == 1
    ) {
      this.isSpinning2 = true;
      this.api
        .getServices(
          0,
          0,
          '',
          '',
          '',
          SUB_CATEGORY_ID,
          this.searchValue2,
          0,
          this.data.TERRITORY_ID,
          this.data.CUSTOMER_TYPE,
          this.data.CUSTOMER_ID
        )
        .subscribe((data) => {
          this.isSpinning2 = false;
          if (data['code'] == 200) {
            this.servicescatalogue = data['data'];

            this.serviceCatName = this.servicescatalogue[0]['CATEGORY_NAME'];
            // this.CATEGORY_NAME= this.servicescatalogue[0].CATEGORY_NAME
            this.serviceSubCatName =
              this.servicescatalogue[0].SUB_CATEGORY_NAME;

            // this.serviceCatName = this.servicescatalogue[0].SERVICE_NAME;
            // this.serviceItem= this.servicescatalogue[0].NAME
            this.servicescatalogue.forEach((element, i) => {
              this.servicescatalogue[i].QUANTITY = 1;
              this.servicescatalogue[i].TOTAL_AMOUNT = Number(
                this.servicescatalogue[i].KEY_PRICE
              );

              this.servicescatalogue[i]['options'] = this.servicescatalogue[i][
                'options'
              ] = Array.from(
                { length: this.servicescatalogue[i].MAX_QTY },
                (_, ii) => ii + 1
              );
            });
          } else {
            this.servicescatalogue = [];
            this.isSpinning2 = false;
          }
        });
    } else if (
      this.data.TERRITORY_ID != undefined &&
      this.data.TERRITORY_ID != null &&
      this.data.TERRITORY_ID > 0
    ) {
      this.isSpinning2 = true;
      this.api
        .getServices(
          0,
          0,
          '',
          '',
          '',
          SUB_CATEGORY_ID,
          this.searchValue2,
          0,
          this.data.TERRITORY_ID,
          this.data.CUSTOMER_TYPE,
          this.data.CUSTOMER_ID
        )
        .subscribe((data) => {
          this.isSpinning2 = false;
          if (data['code'] == 200) {
            this.servicescatalogue = data['data'];
            this.serviceCatName = this.servicescatalogue[0]['CATEGORY_NAME'];
            this.serviceSubCatName =
              this.servicescatalogue[0].SUB_CATEGORY_NAME;

            this.servicescatalogue.forEach((element, i) => {
              this.servicescatalogue[i].QUANTITY = 1;
              this.servicescatalogue[i].TOTAL_AMOUNT = Number(
                this.servicescatalogue[i].KEY_PRICE
              );
              this.servicescatalogue[i]['options'] = Array.from(
                { length: this.servicescatalogue[i].MAX_QTY },
                (_, ii) => ii + 1
              );
            });
          } else {
            this.servicescatalogue = [];
          }
        });
    }
  }

  getsubServices(item, i) {
    if (
      this.servicescatalogue[i]['CHILDS'] != undefined &&
      this.servicescatalogue[i]['CHILDS'] != null &&
      this.servicescatalogue[i]['CHILDS'].length > 0
    )
      this.servicescatalogue[i]['IS_OPEN'] = true;
    else {
      this.buttonLoading = true;
      if (
        this.data.CUSTOMER_TYPE == 'B' &&
        this.data['IS_SPECIAL_CATALOGUE'] == 1
      ) {
        this.api
          .getServices(
            0,
            0,
            '',
            '',
            '',
            item.SUB_CATEGORY_ID,
            this.searchValue2,
            item.ID,
            this.data.TERRITORY_ID,
            this.data.CUSTOMER_TYPE,
            this.data.CUSTOMER_ID
          )
          .subscribe((data) => {
            if (data['code'] == 200) {
              this.services = data['data'];
              this.services.forEach((element, ii) => {
                this.services[ii].QUANTITY = 1;
                this.services[ii].TOTAL_AMOUNT = Number(
                  this.services[ii].KEY_PRICE
                );
                this.services[ii]['options'] = Array.from(
                  { length: this.services[ii].MAX_QTY },
                  (_, i) => i + 1
                );
              });
              this.servicescatalogue[i]['CHILDS'] = this.services;
              this.servicescatalogue[i]['IS_OPEN'] = true;
            } else {
              this.services = [];
              this.servicescatalogue[i]['CHILDS'] = [];
              this.servicescatalogue[i]['IS_OPEN'] = true;
            }
          });
        this.buttonLoading = false;
      } else if (
        this.data.TERRITORY_ID != undefined &&
        this.data.TERRITORY_ID != null &&
        this.data.TERRITORY_ID > 0
      ) {
        this.buttonLoading = true;
        this.api
          .getServices(
            0,
            0,
            '',
            '',
            '',
            item.SUB_CATEGORY_ID,
            this.searchValue2,
            item.ID,
            this.data.TERRITORY_ID,
            this.data.CUSTOMER_TYPE,
            this.data.CUSTOMER_ID
          )
          .subscribe((data) => {
            if (data['code'] == 200) {
              this.services = data['data'];
              this.services.forEach((element, ii) => {
                this.services[ii].QUANTITY = 1;
                this.services[ii].TOTAL_AMOUNT = Number(
                  this.services[ii].KEY_PRICE
                );
                this.services[ii]['options'] = Array.from(
                  { length: this.services[ii].MAX_QTY },
                  (_, i) => i + 1
                );
              });

              this.servicescatalogue[i]['CHILDS'] = this.services;
              this.servicescatalogue[i]['IS_OPEN'] = true;
            } else {
              this.services = [];
              this.servicescatalogue[i]['CHILDS'] = [];
              this.servicescatalogue[i]['IS_OPEN'] = true;
            }
            this.buttonLoading = false;
          });
      }
    }
  }

  public commonFunction = new CommonFunctionService();

  calculateTotal1(event, key, i): void {
    if (event != null && event != undefined) {
      if (key == 'KEY_PRICE') {
        this.servicescatalogue[i].KEY_PRICE = event;
      } else {
        this.servicescatalogue[i].QUANTITY = event;
      }
      this.servicescatalogue[i].TOTAL_AMOUNT =
        Number(this.servicescatalogue[i].KEY_PRICE) *
        this.servicescatalogue[i].QUANTITY;
    }
  }
  calculateTotal11(event, key, i, k): void {
    if (event != null && event != undefined) {
      if (key == 'KEY_PRICE') {
        this.servicescatalogue[i]['CHILDS'][k].KEY_PRICE = event;
      } else {
        this.servicescatalogue[i]['CHILDS'][k].QUANTITY = event;
      }
      this.servicescatalogue[i]['CHILDS'][k].TOTAL_AMOUNT =
        Number(this.servicescatalogue[i]['CHILDS'][k].KEY_PRICE) *
        this.servicescatalogue[i]['CHILDS'][k].QUANTITY;
    }
  }
  hideservices(servicescatalogue, i) {
    this.servicescatalogue[i]['IS_OPEN'] = false;
  }

  calculate() {
    this.data.TAX_AMOUNT = 0;
    this.data.DISCOUNT_AMOUNT = 0;
    this.data.TAX_RATE = 0;
    this.data.TOTAL_TAXABLE_AMOUNT = 0;
    this.data.EXPRESS_DELIVERY_CHARGES = 0;
    this.data.TOTAL_AMOUNT = 0;

    this.expectedDate = null;
    this.time = null;

    var d2: any = [];
    var d = this.tableData;
    var d3 = this.tableData;
    var d4 = this.tableData;
    d2 = d.reduce(
      (max, current) =>
        current.TOTAL_DURARTION_MIN > max.TOTAL_DURARTION_MIN ? current : max,
      d[0]
    );
    var maxTime = d3.reduce(
      (max, current) => (current.START_TIME > max.START_TIME ? current : max),
      d3[0]
    );

    var maxTime2 = d4.reduce(
      (max, current) => (current.END_TIME > max.END_TIME ? max : current),
      d4[0]
    );

    if (d2) this.data.MAX_DURARTION_MIN = d2.TOTAL_DURARTION_MIN;
    if (maxTime) this.data.START_TIME = maxTime.START_TIME;
    if (maxTime2) this.data.END_TIME = maxTime2.END_TIME;

    this.setDateDisableDateTime();
    this.showExpress = false;
    var TAX_RATE = 0;
    this.tableData.forEach((element, index) => {
      if (element.IS_EXPRESS) this.showExpress = true;
      this.data.DISCOUNT_AMOUNT = 0;
      this.data.TAX_AMOUNT =
        Number(this.data.TAX_AMOUNT) + Number(element.TAX_AMOUNT);

      TAX_RATE = TAX_RATE + Number(element.TAX_RATE);

      if (this.data.IS_EXPRESS && element.IS_EXPRESS)
        this.data.EXPRESS_DELIVERY_CHARGES =
          this.data.EXPRESS_DELIVERY_CHARGES +
          Number(element.EXPRESS_DELIVERY_CHARGES);

      this.data.TOTAL_TAXABLE_AMOUNT =
        this.data.TOTAL_TAXABLE_AMOUNT +
        Number(element.TOTAL_TAX_EXCLUSIVE_AMOUNT);

      if (index == this.tableData.length - 1) {
        this.data.TOTAL_TAXABLE_AMOUNT =
          Math.round(this.data.TOTAL_TAXABLE_AMOUNT * 100) / 100;
        this.data.EXPRESS_DELIVERY_CHARGES =
          Math.round(this.data.EXPRESS_DELIVERY_CHARGES * 100) / 100;
        this.data.TAX_AMOUNT = Math.round(this.data.TAX_AMOUNT * 100) / 100;

        this.data.TOTAL_AMOUNT =
          this.data.TOTAL_TAXABLE_AMOUNT +
          this.data.EXPRESS_DELIVERY_CHARGES +
          this.data.TAX_AMOUNT;
        this.data.TOTAL_AMOUNT =
          Number(this.data.TOTAL_AMOUNT) - this.data.DISCOUNT_AMOUNT;
        this.data.TOTAL_AMOUNT = Math.round(this.data.TOTAL_AMOUNT * 100) / 100;
        this.data.TAX_RATE =
          Math.round((TAX_RATE / this.tableData.length) * 100) / 100;
      }
    });
  }
  DELETED_IDS: any = [];
  // ID: 14,
  deleteService(cartItem, g) {
    this.tableData = this.tableData.filter((element, index) => {
      if (index == g && element.ID != null && element.ID != undefined) {
        this.DELETED_IDS.push(element.ID);
        this.message.info('Please save order details.', '');
      }
      return index != g;
    });
    this.calculate();
  }
  specialInstruction2: string = '';
  isaddInstruction: boolean = false;
  addspecialInstruction() {
    this.isaddInstruction = true;
    this.specialInstruction2 = '';
  }
  editspecialInstruction() {
    this.isaddInstruction = true;
    this.specialInstruction2 = this.specialInstruction;
  }
  handleOk() {
    if (
      this.specialInstruction2 == null ||
      this.specialInstruction2 == undefined ||
      this.specialInstruction2.trim() == ''
    ) {
      this.message.error(
        'Special instructions cannot be empty. Please enter a valid instruction to save.',
        ''
      );
    } else {
      this.isaddInstruction = false;
      this.specialInstruction = this.specialInstruction2.trim();
    }
  }
  handleCancel() {
    this.isaddInstruction = false;
  }

  expressAvailable(event) {
    this.data.IS_EXPRESS = event;
    this.calculate();
  }
  @Input() MIN_T_END_TIME: any;
  @Input() MAX_T_START_TIME: any;

  setDateDisableDateTime() {
    this.MIN_T_END_TIME =
      this.data.MAX_T_END_TIME < this.data.END_TIME
        ? this.data.MAX_T_END_TIME
        : this.data.END_TIME;

    this.MAX_T_START_TIME =
      this.data.MAX_T_START_TIME > this.data.START_TIME
        ? this.data.MAX_T_START_TIME
        : this.data.START_TIME;

    var date: any = new Date();
    const [hours1, minutes1, second] =
      this.MIN_T_END_TIME.split(':').map(Number);

    const today = new Date();

    this.currentDate = new Date(today); // Create a copy of the current date
    this.currentDate.setMinutes(
      this.currentDate.getMinutes() + this.data.MAX_DURARTION_MIN
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

  @Input() currentDate = new Date();
  currentDate2 = new Date();
  currentHour = new Date().getHours();
  currentMinute = new Date().getMinutes();
  currentSecond = new Date().getSeconds();
  disabledHours: any[] = [];
  disabledminutes: any[] = [];
  disabledPastDates = (current: Date): boolean =>
    differenceInCalendarDays(current, this.currentDate) < 0;

  calculateMaxStartTime(
    endHour: number,
    endMinute: number
  ): { hour: number; minute: number } {
    const totalMinutes = endHour * 60 + endMinute; // Convert end time to total minutes
    const maxStartMinutes = totalMinutes - this.data.MAX_DURARTION_MIN; // Subtract service duration
    return {
      hour: Math.floor(maxStartMinutes / 60),
      minute: maxStartMinutes % 60,
    };
  }

  calculateMaxStartTime2(records: any) {
    if (!Array.isArray(records) || records.length === 0) {
      return [];
    }

    // Sort records in descending order and slice top 3
    return records.sort((a, b) => b - a).slice(0, 3);
  }

  getDisabledHours = (): number[] => {
    const disabledHours: number[] = [];
    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    const { hour: startHour, minute: startMinute } = this.parseTimeString(
      this.MAX_T_START_TIME
    );

    const { hour: endHour, minute: endMinute } = this.parseTimeString(
      this.MIN_T_END_TIME
    );

    var maxStartHour: any = this.calculateMaxStartTime2([
      currentHour,
      startHour,
      this.currentDate.getHours(),
    ]);

    if (this.expectedDate) {
      if (this.expectedDate.toDateString() == currentDate.toDateString()) {
        for (let i = 0; i < 24; i++) {
          if (i < Number(maxStartHour[0]) || i > endHour) {
            disabledHours.push(i);
          }
        }
      } else {
        for (let i = 0; i < 24; i++) {
          if (i < startHour || i > endHour) {
            disabledHours.push(i);
          }
        }
      }
    }

    this.disabledHours = disabledHours;
    return disabledHours;
  };

  getDisabledMinutes = (hour: number): number[] => {
    var disabledMinutes: number[] = [];
    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    const currentMinute = currentDate.getMinutes();
    const { hour: startHour, minute: startMinute } = this.parseTimeString(
      this.MAX_T_START_TIME
    );
    const { hour: endHour, minute: endMinute } = this.parseTimeString(
      this.MIN_T_END_TIME
    );

    if (this.expectedDate) {
      if (this.expectedDate.toDateString() == currentDate.toDateString()) {
        if (hour == startHour) {
          for (let i = 0; i < 60; i++) {
            if (i < startMinute) {
              disabledMinutes.push(i);
            }
          }
        }
        if (hour == this.currentDate.getHours()) {
          for (let i = 0; i < 60; i++) {
            if (i < this.currentDate.getMinutes()) {
              disabledMinutes.push(i);
            }
          }
        }
        if (hour == currentHour) {
          for (let i = 0; i < 60; i++) {
            if (i < this.currentMinute) {
              disabledMinutes.push(i);
            }
          }
        }
        if (
          hour > startHour &&
          hour > this.currentDate.getHours() &&
          hour > currentHour
        ) {
          disabledMinutes = [];
        }
        if (hour == endHour) {
          for (let i = 0; i < 60; i++) {
            if (i > endMinute) {
              disabledMinutes.push(i);
            }
          }
        }
        disabledMinutes = [...new Set(disabledMinutes)];
      } else {
        if (hour == startHour) {
          for (let i = 0; i < 60; i++) {
            if (i < startMinute) {
              disabledMinutes.push(i);
            }
          }
        }
        if (hour > startHour) {
          disabledMinutes = [];
        }
        if (hour == endHour) {
          for (let i = 0; i < 60; i++) {
            if (i > endMinute) {
              disabledMinutes.push(i);
            }
          }
        }
      }
    }

    this.disabledminutes = disabledMinutes;
    return disabledMinutes;
  };

  parseTimeString(timeString: string): { hour: number; minute: number } {
    const [hour, minute, seconds] = timeString.split(':').map(Number);
    return { hour, minute };
  }

  setTime(value) {
    if (value != undefined && value != null) {
      let minutes = value.getMinutes();
      minutes = Math.round(minutes / 10) * 10;
      value.setMinutes(minutes);
      value.setSeconds(0);
      value.setMilliseconds(0);

      if (this.disabledHours.includes(value.getHours())) {
        this.time = undefined;
        this.message.error(
          'You can not schedule order at ' + value.getHours() + ':' + minutes,
          ''
        );
      } else if (this.disabledminutes.includes(value.getMinutes())) {
        this.time = undefined;
        this.message.error(
          'You can not schedule order at ' + value.getHours() + ':' + minutes,
          ''
        );
      } else this.time = value;
    } else {
      this.time = undefined;
    }
  }
  setDate(event) {
    this.expectedDate = event;
    this.time = null;
    this.setDateDisableDateTime();
  }

  isTextOverflowing(element: HTMLElement): boolean {
    return element.offsetWidth < element.scrollWidth;
  }
  decrementQuantity(servicescatalogue, i) {
    if (servicescatalogue.QUANTITY > 1) {
      this.servicescatalogue[i].QUANTITY =
        this.servicescatalogue[i].QUANTITY - 1;
      this.calculateTotal1(this.servicescatalogue[i].QUANTITY, 'QUANTITY', i);
    }
  }
  incrementQuantity(servicescatalogue, i) {
    if (servicescatalogue.MAX_QTY > this.servicescatalogue[i].QUANTITY) {
      this.servicescatalogue[i].QUANTITY =
        this.servicescatalogue[i].QUANTITY + 1;

      this.calculateTotal1(this.servicescatalogue[i].QUANTITY, 'QUANTITY', i);
    } else {
      this.message.error(
        'You can not add more than ' + servicescatalogue.MAX_QTY + ' quantity',
        ''
      );
    }
  }
  decrementQuantity2(servicescatalogue, i, k) {
    if (servicescatalogue.QUANTITY > 1) {
      this.servicescatalogue[i]['CHILDS'][k].QUANTITY =
        this.servicescatalogue[i]['CHILDS'][k].QUANTITY - 1;
      this.calculateTotal11(
        this.servicescatalogue[i]['CHILDS'][k].QUANTITY,
        'QUANTITY',
        i,
        k
      );
    }
  }
  incrementQuantity2(servicescatalogue, i, k) {
    if (
      servicescatalogue.MAX_QTY >
      this.servicescatalogue[i]['CHILDS'][k].QUANTITY
    ) {
      this.servicescatalogue[i]['CHILDS'][k].QUANTITY =
        this.servicescatalogue[i]['CHILDS'][k].QUANTITY + 1;
      this.calculateTotal11(
        this.servicescatalogue[i]['CHILDS'][k].QUANTITY,
        'QUANTITY',
        i,
        k
      );
    } else {
      this.message.error(
        'You can not add more than ' + servicescatalogue.MAX_QTY + ' quantity',
        ''
      );
    }
  }
  formatTime(hoursMatch: any, minutesMatch: any): string {
    const hours = hoursMatch ? this.padZero(hoursMatch) : '00';
    const minutes = minutesMatch ? this.padZero(minutesMatch) : '00';

    return `${hours}:${minutes}`;
  }

  padZero(value: string | number): string {
    return value.toString().padStart(2, '0');
  }

  showerror = false;
  checkLength() {
    this.showerror = !this.showerror;
  }
  convertDateTiem(date: any) {
    const currentDate = new Date(this.currentDate2);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const day = currentDate.getDate();
    const dateWithTime1 = new Date(
      year,
      month,
      day,
      ...date.split(':').map(Number)
    );
    return new Date(dateWithTime1);
  }

  decrementQuantityIncart(servicescatalogue, i) {
    if (servicescatalogue.QUANTITY > 1) {
      this.tableData[i].QUANTITY = this.tableData[i].QUANTITY - 1;
      this.tableData[i].TOTAL_TAX_EXCLUSIVE_AMOUNT =
        Number(this.tableData[i].TAX_EXCLUSIVE_AMOUNT) *
        this.tableData[i].QUANTITY;

      this.addToTable22(servicescatalogue, i);
    }
  }
  incrementQuantityIncart(servicescatalogue, i) {
    if (servicescatalogue.MAX_QTY > this.tableData[i].QUANTITY) {
      this.tableData[i].QUANTITY = this.tableData[i].QUANTITY + 1;
      this.tableData[i].TOTAL_TAX_EXCLUSIVE_AMOUNT =
        Number(this.tableData[i].TAX_EXCLUSIVE_AMOUNT) *
        this.tableData[i].QUANTITY;

      this.addToTable22(servicescatalogue, i);
    } else {
      this.message.error(
        'You can not add more than ' + servicescatalogue.MAX_QTY + ' quantity',
        ''
      );
    }
  }

  addToTable22(servicescatalogue, i) {
    this.tableData[i].TOTAL_AMOUNT =
      Number(this.tableData[i].RATE) * Number(this.tableData[i].QUANTITY);
    this.tableData[i].TAX_AMOUNT =
      (Number(this.tableData[i].RATE) -
        Number(this.tableData[i].TAX_EXCLUSIVE_AMOUNT)) *
      Number(this.tableData[i].QUANTITY);
    this.tableData[i].TAX_AMOUNT =
      Math.round(this.tableData[i].TAX_AMOUNT * 100) / 100;

    this.tableData[i].TOTAL_TAX_EXCLUSIVE_AMOUNT =
      Number(this.tableData[i].TAX_EXCLUSIVE_AMOUNT) *
      this.tableData[i].QUANTITY;

    this.tableData[i].TOTAL_TAX_EXCLUSIVE_AMOUNT =
      Math.round(this.tableData[i].TOTAL_TAX_EXCLUSIVE_AMOUNT * 100) / 100;
    this.tableData[i].TAX_AMOUNT = Number(this.tableData[i].TAX_AMOUNT);
    this.calculate();
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
    let imagePath = this.api.retriveimgUrl + 'CartItemPhoto/' + link;
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
  getcompanynames(event) {
    if (this.decreptedroleId == 7) {
      // event =
      //   event != '' && event != undefined && event != null
      //     ?
      //     event +
      //     '%" OR COMPANY_NAME like "%'
      //     : '';
      this.isLoading = true;
      this.api
        .getCompanyNames(
          this.pageIndex,
          this.pageSize,
          '',
          '',
          '' + event + '' + this.decreptedbackofficeId
        )
        .subscribe((data) => {
          if (data['code'] == 200 && data['data'].length > 0) {
            if (this.pageIndex == 1) {
              this.company = [...[], ...data['data']];
            } else this.company = [...this.company, ...data['data']];
            this.totalrecords = data['count'];
          }
          this.isLoading = false;
        });
    } else {
      event =
        event != '' && event != undefined && event != null
          ? ` AND COMPANY_NAME like '%${event}%'`
          : '';
      this.isLoading = true;
      this.api
        .getCompanyNames(this.pageIndex, 8, '', '', '' + event)
        .subscribe((data) => {
          if (data['code'] == 200 && data['data'].length > 0) {
            if (this.pageIndex == 1) {
              this.company = [...[], ...data['data']];
            } else this.company = [...this.company, ...data['data']];
            this.totalrecords = data['count'];
          }
          this.isLoading = false;
        });
    }
  }

  searchCompany(event) {
    this.searchkey = event;
    if (event.length >= 3) {
      this.customer = [];
      this.pageIndex = 1;
      this.getcompanynames(this.searchkey);
    }
  }

  keyupCompany(event) {
    if (
      this.searchkey == '' &&
      (event.code == 'Backspace' || event.code == 'Delete')
    ) {
      this.customer = [];
      this.company = [];
      this.pageIndex = 1;
      this.getcompanynames('');
    }
  }
  // getcompanynames(event) {
  //   if (this.decreptedroleId == 7) {
  //     this.isLoading = true;
  //     this.api
  //       .getCompanyNames(
  //         this.pageIndex,
  //         this.pageSize,
  //         '',
  //         '',
  //         '' + event + '' + this.decreptedbackofficeId
  //       )
  //       .subscribe((data) => {
  //         if (data['code'] == 200 && data['data'].length > 0) {
  //           if (this.pageIndex == 1) {
  //             this.company = [...data['data']];
  //           } else {
  //             this.company = [...this.company, ...data['data']];
  //           }
  //           this.totalrecords = data['count'];
  //         } else {
  //           this.company = [];
  //           this.totalrecords = 0;
  //         }
  //         this.isLoading = false;
  //       });
  //   } else {
  //     const searchTerm = '" AND COMPANY_NAME like "%' + event;
  //     this.isLoading = true;
  //     this.api
  //       .getCompanyNames(this.pageIndex, 8, '', '', '' + searchTerm)
  //       .subscribe((data) => {
  //         if (data['code'] == 200 && data['data'].length > 0) {
  //           if (this.pageIndex == 1) {
  //             this.company = [...data['data']];
  //           } else {
  //             this.company = [...this.company, ...data['data']];
  //           }
  //           this.totalrecords = data['count'];
  //         } else {
  //           this.company = [];
  //           this.totalrecords = 0;
  //         }
  //         this.isLoading = false;
  //       });
  //   }
  // }

  onCustomerTypeChange(value: string) {

    this.data.ORGANIZATION_NAME = undefined;
    this.data.CUSTOMER_ID = undefined;
    this.addresses = [];
    this.data.ADDRESS_ID = undefined;
    this.data.ADDRESS_ID1 = undefined;
    this.data.TERRITORY_ID = 0;
    this.data.TERRITORY_NAME = null;
    this.data.MAX_T_START_TIME = null;
    this.data.MAX_T_END_TIME = null;
    this.terriotrystarttime1 = null;
    this.terriotryendtime1 = null;
    this.isTerritoryExpress = false;
    this.data.ORDER_MEDIUM = undefined;
    this.company = [];
    this.pageIndex = 1;
    this.searchkey = '';
    this.customer = [];
    this.totalrecords = 0;

    if (value === 'B') {
      this.getcompanynames('');
    } else {
      this.getcustomer('');
    }

    this.loadCustomers('');
  }

  loadCustomers(orgName: string = '') {
    this.isLoading = true;
    let customerType = this.data.CUSTOMER_TYPE || 'I';
    let orgFilter = '';

    if (orgName !== '') {
      orgFilter = " AND COMPANY_NAME = '" + orgName + "'";
    }

    if (customerType) {
      orgFilter += ` AND CUSTOMER_TYPE = '${customerType}'`;
    }
    this.isLoading = true;
    this.api
      .getAllCustomer(this.pageIndex, 8, '', '', orgFilter)
      .subscribe((data) => {
        if (data['code'] == 200 && data['data'].length > 0) {
          const filteredData = data['data'].filter(
            (cust) => cust.CUSTOMER_TYPE === customerType
          );

          this.customer =
            this.pageIndex == 1
              ? [...filteredData]
              : [...this.customer, ...filteredData];
          this.totalrecords = data['count'];
          this.isLoading = false;
        } else {
          if (this.pageIndex == 1) {
            this.customer = [];
          }
          this.totalrecords = 0;
        }
        this.isLoading = false;
      });
  }

  loadMorecompany() {
    if (this.totalrecords > this.company.length) {
      this.pageIndex++;
      this.getcompanynames(this.searchkey);
    }
  }

  selectOrgName(orgName: string | null): void {
    if (!orgName) {
      this.clearTerritory();
    }

    this.pageIndex = 1;

    if (orgName && orgName !== '') {
      this.loadCustomers(orgName);
    } else {
      this.getcompanynames('');

      this.loadCustomers('');
    }
  }


  clearTerritory() {
    this.data.TERRITORY_ID = null;
    this.data.TERRITORY_NAME = '';
    this.terriotrystarttime1 = null;
    this.terriotryendtime1 = null;



    this.data.CUSTOMER_ID = undefined;
    this.customer = [];
    this.addresses = [];
    this.data.ADDRESS_ID = undefined;
    this.data.ADDRESS_ID1 = undefined;
    this.data.ORDER_MEDIUM = undefined
    // this.orderMediums=[];
  }

}
