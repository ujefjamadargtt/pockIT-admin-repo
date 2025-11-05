import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { endOfMonth, startOfYear, endOfYear, startOfMonth } from 'date-fns';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { Router } from '@angular/router';
@Component({
  selector: 'app-jobcardpage',
  templateUrl: './jobcardpage.component.html',
  styleUrls: ['./jobcardpage.component.css'],
})
export class JobcardpageComponent {
  @Input() jobcardfilter: any;
  @Input() TYPE: any = '';
  @Input() FILTER_ID: any;
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: any = 'default';
  selectedDate: Date[] = [];
  date1 =
    new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + 1;
  value1: any = '';
  value2: any = '';
  ranges: any = {
    'This Month': [startOfMonth(new Date()), endOfMonth(new Date())],
    'This Year': [startOfYear(new Date()), endOfYear(new Date())],
  };
  loadingRecords: boolean = false;
  selectedFilter: string | null = null;
  userId = sessionStorage.getItem('userId'); // Retrieve userId from session storage
  USER_ID: number; // Declare USER_ID as a number
  userId1 = sessionStorage.getItem('userName'); // Retrieve userId from session storage
  USER_ID1: any; // Declare USER_ID as a number
  savedFilters: any; // Define the type of savedFilters if possible
  currentClientId = 1; // Set the client ID
  TabId: number = 44; // Ensure TabId is defined and initialized
  pageIndex = 1;
  pageSize = 9;
  sortKey: string = 'ID';
  sortValue: string = 'desc';
  jobdatss: any = [];
  totalRecords = 1;
  CustomersData: any = [];
  teritory: any = [];
  customerMangeer: any = '';
  teritoryIds: any = [];
  technicians: any = [];
  columns: string[][] = [
    ['ORDER_NO', 'ORDER_NO'],
    ['CUSTOMER_NAME', 'CUSTOMER_NAME'],
    ['JOB_CARD_NO', 'JOB_CARD_NO'],
    ['SERVICE_ADDRESS', 'SERVICE_ADDRESS'],
    ['TERRITORY_NAME', 'TERRITORY_NAME'],
    ['SERVICE_NAME', 'SERVICE_NAME'],
    ['PINCODE', 'PINCODE'],
  ];
  filterData: any;

  filterGroups: any = [
    {
      operator: 'AND',
      conditions: [
        {
          condition: {
            field: '',
            comparator: '',
            value: '',
          },
          operator: 'AND',
        },
      ],
      groups: [],
    },
  ];

  filterGroups2: any = [
    {
      operator: 'AND',
      conditions: [
        {
          condition: {
            field: '',
            comparator: '',
            value: '',
          },
          operator: 'AND',
        },
      ],
      groups: [],
    },
  ];

  constructor(
    private datePipe: DatePipe,
    private api: ApiServiceService,
    private message: NzNotificationService,
    private router: Router
  ) { }
  back() {
    this.router.navigate(['/masters/menu']);
  }
  isSpinning = false;
  isfilterapply: boolean = false;
  filterClass: string = 'filter-invisible';
  vendorId = sessionStorage.getItem('vendorId');
  decreptedvendorIdString = '';
  decreptedvendorId = 0;
  roleID = sessionStorage.getItem('roleId');
  decreptedroleIDString = '';
  decreptedroleID = 0;
  backofficeId = sessionStorage.getItem('backofficeId');
  decreptedbackofficeId = 0;
  public commonFunction = new CommonFunctionService();
  ngOnInit(): void {
    const decryptedUserId = this.userId
      ? this.commonFunction.decryptdata(this.userId)
      : '0'; // Decrypt userId or use '0' as fallback
    this.USER_ID = Number(decryptedUserId);
    const decryptedUserId1 = this.userId1
      ? this.commonFunction.decryptdata(this.userId1)
      : '0'; // Decrypt userId or use '0' as fallback
    this.USER_ID1 = decryptedUserId1;

    this.userId1 = sessionStorage.getItem('userName');
    this.USER_ID1 = this.userId1
      ? this.commonFunction.decryptdata(this.userId1)
      : '';
    this.decreptedvendorIdString = this.vendorId
      ? this.commonFunction.decryptdata(this.vendorId)
      : '';
    this.decreptedvendorId = parseInt(this.decreptedvendorIdString, 10);
    this.decreptedroleIDString = this.roleID
      ? this.commonFunction.decryptdata(this.roleID)
      : '';
    this.decreptedroleID = parseInt(this.decreptedroleIDString, 10);
    if (
      this.decreptedroleID != 1 &&
      this.decreptedroleID != 6 &&
      this.decreptedroleID != 8 &&
      this.decreptedroleID != 9
    ) {
      var decreptedbackofficeId = this.backofficeId
        ? this.commonFunction.decryptdata(this.backofficeId)
        : '';
      this.decreptedbackofficeId = parseInt(decreptedbackofficeId, 10);
    }

    this.getDatas();
  }

  keyup(keys) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    if (this.searchText.length >= 3 && keys.key === 'Enter') {
      this.search(true);
    } else if (this.searchText.length === 0 && keys.key == 'Backspace') {
      this.jobdatss = [];
      this.search(true);
    }
  }

  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
  }

  editQuery(data) {
    this.filterGroups = JSON.parse(data.FILTER_JSON)[0];
    this.filterGroups2 = JSON.parse(data.FILTER_JSON)[1];

    this.filterData = data;
    this.drawerTitle = 'Edit Filter';
    this.applyCondition = '';
    this.filterFields[0]['options'] = this.CustomersData;
    this.filterFields[7]['options'] = this.teritory;
    this.filterFields[8]['options'] = this.technicians;
    this.drawerFilterVisible = true;
  }

  loadMore() {
    if (this.jobdatss.length < this.totalRecords) {
      this.pageIndex = this.pageIndex + 1;

      var sort: string;
      try {
        sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
      } catch (error) {
        sort = '';
      }

      var likeQuery = '';
      let globalSearchQuery = '';
      if (this.searchText !== '') {
        globalSearchQuery =
          ' AND (' +
          this.columns
            .map((column) => {
              return `${column[0]} like '%${this.searchText}%'`;
            })
            .join(' OR ') +
          ')';
      }

      if (this.filterOfTerritory.length > 0 && this.isall == false) {
        likeQuery += ' AND TERRITORY_ID =' + this.filterOfTerritory;
      } else {
        if (
          this.TYPE == 'VENDOR' ||
          this.decreptedroleID == 9 ||
          (this.decreptedroleID != 1 &&
            this.decreptedroleID != 6 &&
            this.decreptedroleID != 8 &&
            this.decreptedroleID != 9)
        ) {
          likeQuery += ' TERRITORY_ID in (' + this.teritoryIds.toString() + ')';
        }
        this.filterOfTerritory = [];
        this.filterOfTerritory.push(0);
      }
      // Combine global search query and column-specific search query
      likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');

      this.isSpinning = true;

      if (this.TYPE == 'CUSTOMER') {
        likeQuery = likeQuery + ' AND CUSTOMER_ID =' + this.FILTER_ID;
        this.dataGet(sort, likeQuery);
      } else if (this.TYPE == 'ORDER') {
        likeQuery = likeQuery + ' AND ID =' + this.FILTER_ID;
        this.dataGet(sort, likeQuery);
      } else if (this.TYPE == 'TECHNICIAN') {
        likeQuery = likeQuery + ' AND TECHNICIAN_ID =' + this.FILTER_ID;
        this.dataGet(sort, likeQuery);
      } else if (
        (this.decreptedroleID === 7)
      ) {
        // likeQuery =
        //   ' AND TERRITORY_ID in (' + this.teritoryIds.toString() + ')';
        this.dataGet(sort, likeQuery + this.customerMangeer);
      } else if (
        this.TYPE == 'VENDOR' ||
        this.decreptedroleID == 9 ||
        (this.decreptedroleID != 1 &&
          this.decreptedroleID != 6 &&
          this.decreptedroleID != 8 &&
          this.decreptedroleID != 9)
      ) {
        // likeQuery =
        //   ' AND TERRITORY_ID in (' + this.teritoryIds.toString() + ')';
        this.dataGet(sort, likeQuery);
      } else {
        this.dataGet(sort, likeQuery);
      }
    }
  }

  dataGet(sort, likeQuery) {
    this.api
      .getpendinjobsdataa(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + this.filterQuery
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadingRecords = false;
            this.jobdatss = [...this.jobdatss, ...data['data']];
            this.isSpinning = false;
          } else if (data['code'] == 400) {
            this.isSpinning = false;
            this.jobdatss = [...this.jobdatss, ...[]];

            this.message.error('Invalid filter parameter', '');
          } else {
            this.jobdatss = [...this.jobdatss, ...[]];
            this.message.error('Something Went Wrong ...', '');
            this.isSpinning = false;
          }
        },
        (err: HttpErrorResponse) => {
          this.loadingRecords = false;
          if (err.status === 0) {
            this.message.error(
              'Unable to connect. Please check your internet or server connection and try again shortly.',
              ''
            );
            this.isSpinning = false;
          } else if (err['status'] == 400) {
            this.loadingRecords = false;
            this.isSpinning = false;
            this.message.error('Invalid filter parameter', '');
          } else {
            this.message.error('Something Went Wrong.', '');
            this.isSpinning = false;
          }
          this.jobdatss = [...this.jobdatss, ...[]];
        }
      );
  }

  jobdetaildrawerTitle = '';
  jobdetailsshow = false;
  jobdetailsdata: any;
  invoicefilter: any;

  openjobcarddetails(data: any) {
    this.invoicefilter = ' AND JOB_CARD_ID=' + data.ID;
    this.jobdetailsdata = data;
    this.jobdetaildrawerTitle = 'Job details of ' + data.JOB_CARD_NO;
    this.jobdetailsshow = true;
  }
  drawersize = '100%';
  jobdetailsdrawerClose(): void {
    this.jobdetailsshow = false;
  }
  //Drawer Methods
  get jobdetailscloseCallback() {
    return this.jobdetailsdrawerClose.bind(this);
  }

  search(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'id';
      this.sortValue = 'desc';
    }

    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    var likeQuery = '';
    let globalSearchQuery = '';
    if (this.searchText !== '') {
      globalSearchQuery =
        ' AND (' +
        this.columns
          .map((column) => {
            return `${column[0]} like '%${this.searchText}%'`;
          })
          .join(' OR ') +
        ')';
    }
    // this.filterOfTerritory.length
    if (this.filterOfTerritory.length > 0 && this.isall == false) {
      likeQuery +=
        ' TERRITORY_ID in (' + this.filterOfTerritory.toString() + ')';
    } else {
      // alert(this.teritoryIds);
      if (
        (this.decreptedvendorId != 1 &&
          this.decreptedvendorId != 6 &&
          this.decreptedvendorId != 8 &&
          this.decreptedvendorId != 9 &&
          this.decreptedbackofficeId > 0) ||
        this.TYPE == 'VENDOR' ||
        this.decreptedroleID == 9
      ) {
        likeQuery += ' TERRITORY_ID in (' + this.teritoryIds.toString() + ')';
      }

      this.filterOfTerritory = [];
      this.filterOfTerritory.push(0);
    }
    // else{
    //   likeQuery +=
    //   ' AND TERRITORY_ID in (' + this.TERRITORY_IDS.toString() + ')';
    // }

    // Combine global search query and column-specific search query
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');

    this.isSpinning = true;

    if (this.TYPE == 'CUSTOMER') {
      likeQuery = likeQuery + ' AND CUSTOMER_ID =' + this.FILTER_ID;
      this.getData(sort, likeQuery);
    } else if (this.TYPE == 'ORDER') {
      likeQuery = likeQuery + ' AND ID =' + this.FILTER_ID;
      this.getData(sort, likeQuery);
    } else if (this.TYPE == 'TECHNICIAN') {
      likeQuery = likeQuery + ' AND TECHNICIAN_ID =' + this.FILTER_ID;
      this.getData(sort, likeQuery);
    } else if (
      (this.decreptedroleID === 7 && this.decreptedbackofficeId > 0)
    ) {
      if (this.teritoryIds.length > 0) {
        this.getData(sort, likeQuery + this.customerMangeer);
      } else {
        this.jobdatss = [];
        this.isSpinning = false;
      }
    } else if (
      this.TYPE == 'VENDOR' ||
      this.decreptedroleID == 9 ||
      (this.decreptedvendorId != 1 &&
        this.decreptedvendorId != 6 &&
        this.decreptedvendorId != 8 &&
        this.decreptedvendorId != 9 &&
        this.decreptedbackofficeId > 0)
    ) {
      // likeQuery = ' AND TERRITORY_ID in (' + this.teritoryIds.toString() + ')';
      // alert(this.teritoryIds.length + ' ' + likeQuery);
      if (this.teritoryIds.length > 0) {
        this.getData(sort, likeQuery);
      } else {
        this.jobdatss = [];
        this.isSpinning = false;
      }
    } else {
      this.getData(sort, likeQuery);
    }
  }

  getData(sort, likeQuery) {
    this.api
      .getpendinjobsdataa(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + this.filterQuery
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadingRecords = false;
            this.totalRecords = data['count'];
            this.jobdatss = data['data'];
            this.TabId = data['TAB_ID'];
            this.isSpinning = false;
          } else if (data['code'] == 400) {
            this.loadingRecords = false;
            this.jobdatss = [];
            this.isSpinning = false;
            this.message.error('Invalid filter parameter', '');
          } else {
            this.loadingRecords = false;
            this.jobdatss = [];
            this.message.error('Something Went Wrong ...', '');
            this.isSpinning = false;
          }
        },
        (err: HttpErrorResponse) => {
          this.loadingRecords = false;
          if (err.status === 0) {
            this.message.error(
              'Unable to connect. Please check your internet or server connection and try again shortly.',
              ''
            );
            this.isSpinning = false;
          } else if (err['status'] == 400) {
            this.loadingRecords = false;
            this.isSpinning = false;
            this.message.error('Invalid filter parameter', '');
          } else {
            this.message.error('Something Went Wrong.', '');
            this.isSpinning = false;
          }
          this.jobdatss = [];
        }
      );
  }

  getDatas() {
    this.CustomersData = [];
    var likeQuery = '';

    if (this.TYPE == 'VENDOR') {
      likeQuery = ' AND VENDOR_ID =' + this.FILTER_ID;
    }
    if (this.decreptedroleID == 9) {
      likeQuery = ' AND VENDOR_ID =' + this.decreptedvendorId;
    }
    var custQuery = '';
    if (this.TYPE == 'CUSTOMER') {
      custQuery = ' AND ID =' + this.FILTER_ID;
    }


    if (this.decreptedroleID == 7) {
      this.api.getAllCustomer(0, 0, '', '', custQuery + ' AND ACCOUNT_STATUS=1 AND CUSTOMER_MANAGER_ID=' + this.decreptedbackofficeId).subscribe((data) => {
        if (data['code'] == '200') {
          if (data['count'] > 0) {
            data['data'].forEach((element) => {
              this.CustomersData.push({
                value: element.ID,
                display: element.NAME,
              });
            });
          }
        }
      });
    } else {
      this.api.getAllCustomer(0, 0, '', '', custQuery + ' AND ACCOUNT_STATUS=1').subscribe((data) => {
        if (data['code'] == '200') {
          if (data['count'] > 0) {
            data['data'].forEach((element) => {
              this.CustomersData.push({
                value: element.ID,
                display: element.NAME,
              });
            });
          }
        }
      });
    }
    this.teritory = [];
    this.teritoryIds = [];
    this.filterOfTerritory = [];
    if (
      this.decreptedroleID === 7 &&
      this.decreptedbackofficeId > 0
    ) {
      this.api
        .getBackofcTerritoryMappedData(
          0,
          0,
          '',
          '',
          ' AND IS_ACTIVE =1 AND BACKOFFICE_ID =' + this.decreptedbackofficeId
        )
        .subscribe((data2) => {
          if (data2['code'] == '200') {
            if (data2['count'] > 0) {
              data2['data'].forEach((element) => {
                this.teritory.push({
                  value: element.TERITORY_ID,
                  display: element.TERRITORY_NAME,
                });
                this.teritoryIds.push(element.TERITORY_ID);
              });
              this.customerMangeer = ' AND CUSTOMER_MANAGER_ID=' + this.decreptedbackofficeId
              this.search(true);
            } else {
              this.customerMangeer = ' AND CUSTOMER_MANAGER_ID=' + this.decreptedbackofficeId
              this.search(true);
            }
          }
        });
    } else if (this.TYPE == 'VENDOR' || this.decreptedroleID == 9) {
      this.api
        .getVendorTerritoryMappedData(
          0,
          0,
          '',
          '',
          ' AND IS_ACTIVE =1 AND VENDOR_ID =' + this.decreptedvendorId
        )
        .subscribe((data2) => {
          if (data2['code'] == '200') {
            if (data2['count'] > 0) {
              data2['data'].forEach((element) => {
                this.teritory.push({
                  value: element.TERITORY_ID,
                  display: element.TERRITORY_NAME,
                });
                this.teritoryIds.push(element.TERITORY_ID);
              });
              this.search(true);
            }
          }
        });
    } else if (
      this.decreptedvendorId != 1 &&
      this.decreptedvendorId != 6 &&
      this.decreptedvendorId != 8 &&
      this.decreptedvendorId != 9 &&
      this.decreptedbackofficeId > 0
    ) {
      this.api
        .getBackofcTerritoryMappedData(
          0,
          0,
          '',
          '',
          ' AND IS_ACTIVE =1 AND BACKOFFICE_ID =' + this.decreptedbackofficeId
        )
        .subscribe((data2) => {
          if (data2['code'] == '200') {
            if (data2['count'] > 0) {
              data2['data'].forEach((element) => {
                this.teritory.push({
                  value: element.TERITORY_ID,
                  display: element.TERRITORY_NAME,
                });
                this.teritoryIds.push(element.TERITORY_ID);
              });
              this.search(true);
            }
          }
        });
    } else {
      this.api
        .getTeritory(0, 0, '', '', ' AND IS_ACTIVE =1')
        .subscribe((data2) => {
          if (data2['code'] == '200') {
            if (data2['count'] > 0) {
              data2['data'].forEach((element) => {
                this.teritory.push({
                  value: element.ID,
                  display: element.NAME,
                });
                this.teritoryIds.push(element.TERITORY_ID);
              });
            }
            this.search(true);
          }
        });
    }
    this.technicians = [];
    this.api
      .getTechnicianData(0, 0, '', '', '  AND IS_ACTIVE=1' + likeQuery)
      .subscribe((data3) => {
        if (data3['code'] == 200) {
          if (data3['count'] > 0) {
            data3['data'].forEach((element) => {
              this.technicians.push({
                value: element.ID,
                display: element.NAME,
              });
            });
          }
        }
      });
  }
  custType: any = '';

  filterQuery1 = '';
  filterQuery2 = '';
  Customers = null;

  onKeyup(event: KeyboardEvent): void {
    if (this.searchText.length > 3 && event.key === 'Enter') {
      this.search(true);
    }
  }

  onKeypressEvent(keys) {
    const element = window.document.getElementById('buttonss');
    if (element != null) element.focus();
    if (this.searchText.length >= 3 && keys.key === 'Enter') {
      this.search(true);
    } else if (this.searchText.length === 0 && keys.key == 'Backspace') {
      this.jobdatss = [];
      this.search(true);
    }
  }
  exportLoading = false;
  importInExcel() {
    this.search();
  }
  changeDate(value: any) {
    this.value1 = this.datePipe.transform(value[0], 'yyyy-MM-dd');
    this.value2 = this.datePipe.transform(value[1], 'yyyy-MM-dd');
  }
  invoiceData: any;
  searchdata() {
    if (this.searchText.length >= 3) {
      this.search();
    }
  }
  convertInExcel() {
    var arry1: any = [];
    var obj1: any = new Object();
    // for (var i = 0; i < this.exportdataList.length; i++) {
    //   obj1['Invoice Date'] = this.exportdataList[i]['INVOICE_DATE'] ? this.datePipe.transform(this.exportdataList[i]['INVOICE_DATE'], 'dd/MM/yyyy') : "-";

    //   obj1['Customer Name'] = this.exportdataList[i]['CUSTOMER_NAME'] ? this.exportdataList[i]['CUSTOMER_NAME'] : "-";

    //   obj1['Mobile No.'] = this.exportdataList[i]['MOBILE_NO'] ? this.exportdataList[i]['MOBILE_NO'] : "-";
    //   obj1['Email ID'] = this.exportdataList[i]['EMAIL'] ? this.exportdataList[i]['EMAIL'] : "-";
    //   if (this.exportdataList[i]['CUSTOMER_TYPE'] == 'I') {
    //     obj1[' Customer Type'] = 'Indivisual';
    //   } else if (this.exportdataList[i]['CUSTOMER_TYPE'] == 'B') {
    //     obj1[' Customer Type'] = 'Business';
    //   } else {
    //     obj1[' Customer Type'] = '-';
    //   }
    //   obj1['Total Amount'] = this.exportdataList[i]['TOTAL_AMOUNT'] ? this.exportdataList[i]['TOTAL_AMOUNT'] : "0";
    //   obj1['Tax Amount'] = this.exportdataList[i]['TAX_AMOUNT'] ? this.exportdataList[i]['TAX_AMOUNT'] : "0";
    //   obj1['Discount Amount'] = this.exportdataList[i]['DISCOUNT_AMOUNT'] ? this.exportdataList[i]['DISCOUNT_AMOUNT'] : "0";
    //   obj1['Final Amount'] = this.exportdataList[i]['FINAL_AMOUNT'] ? this.exportdataList[i]['FINAL_AMOUNT'] : "0";
    //   // obj1['Invoice PDF'] = this.exportdataList[i]['INVOICE_URL']
    //   //   ? `=HYPERLINK("${appkeys.retriveimgUrl}Invoices/${this.exportdataList[i]['INVOICE_URL']}", "Download")`
    //   //   : "-";
    //   arry1.push(Object.assign({}, obj1));
    //   if (i == this.exportdataList.length - 1) {
    //     this._exportService.exportExcel(
    //       arry1,
    //       'Invoice Report On ' +
    //       this.datePipe.transform(new Date(), 'dd/mm/yyyy')
    //     );
    //   }
    // }
  }

  showMainFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    } else {
      this.filterClass = 'filter-visible';
      this.loadFilters();
    }
  }
  orderData: any;
  filterdrawerTitle!: string;
  drawerFilterVisible: boolean = false;
  // drawerData: CurrencyMaster = new CurrencyMaster();
  applyCondition: any;
  drawerTitle = '';

  openfilter() {
    this.drawerTitle = 'Job Filter';
    this.filterData = {
      TAB_ID: this.TabId,
      USER_ID: this.commonFunction.decryptdata(this.userId || ''),
      CLIENT_ID: this.currentClientId,
      FILTER_NAME: '',
      FILTER_QUERY: '',
      FILTER_JSON: {},
    };
    this.applyCondition = '';
    this.filterGroups = [
      {
        operator: 'AND',
        conditions: [
          {
            condition: {
              field: '',
              comparator: '',
              value: '',
            },
            operator: 'AND',
          },
        ],
        groups: [],
      },
    ];
    this.filterGroups2 = [
      {
        operator: 'AND',
        conditions: [
          {
            condition: {
              field: '',
              comparator: '',
              value: '',
            },
            operator: 'AND',
          },
        ],
        groups: [],
      },
    ];
    this.filterFields[0]['options'] = this.CustomersData;
    this.filterFields[7]['options'] = this.teritory;
    this.filterFields[8]['options'] = this.technicians;
    this.drawerFilterVisible = true;
  }

  whichbutton;
  updateBtn;

  drawerfilterClose(buttontype, updateButton): void {
    this.drawerFilterVisible = false;

    this.whichbutton = buttontype;
    this.updateBtn = updateButton;

    if (buttontype == 'SA') {
      this.loadFilters();

      //  this.applyfilter(this.savedFilters[0]['FILTER_QUERY'])
    } else if (buttontype == 'SC') {
      this.loadFilters();
    }
  }

  get closefilterCallback() {
    return this.drawerfilterClose.bind(this);
  }
  filterFields: any[] = [
    {
      key: 'CUSTOMER_NAME',
      label: 'Customer Name',
      type: 'search',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [],
      placeholder: 'Select Customer Name',
    },
    {
      key: 'COMPANY_NAME',
      label: 'Company Name',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Company Name',
    },
    {
      key: 'ODER_NO',
      label: 'Order Number',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Order Number',
    },
    {
      key: 'JOB_CARD_NO',
      label: 'Job Number',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Job Number',
    },
    {
      key: 'PINCODE',
      label: 'Pincode',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Pincode',
    },
    {
      key: 'SCHEDULED_DATE_TIME',
      label: 'Scheduled Date Time',
      type: 'date',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: '>', display: 'Greater Than' },
        { value: '<', display: 'Less Than' },
        { value: '>=', display: 'Greater Than Equal To' },
        { value: '<=', display: 'Less Than Equal To' },
      ],
      placeholder: 'Select Scheduled Date Time',
    },
    {
      key: 'EXPECTED_DATE_TIME',
      label: 'Expected Date Time',
      type: 'date',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: '>', display: 'Greater Than' },
        { value: '<', display: 'Less Than' },
        { value: '>=', display: 'Greater Than Equal To' },
        { value: '<=', display: 'Less Than Equal To' },
      ],
      placeholder: 'Select Expected Date Time',
    },
    {
      key: 'STATUS',
      label: 'Job Status',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: 'P', display: 'Pending' },
        { value: 'AS', display: 'Assigned' },
        { value: 'AS', display: 'Accepted' },
        { value: 'C', display: 'Completed' },
      ],
      placeholder: 'Select Job Status',
    },

    {
      key: 'TERRITORY_ID',
      label: 'Territory',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [],
      placeholder: 'Select Territory',
    },
    {
      key: 'TECHNICIAN_ID',
      label: 'Technician',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [],
      placeholder: 'Select Technician',
    },
  ];

  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerfilterClose('', '');
  }
  convertToQuery(filterGroups: any[]): string {
    const processGroup = (group: any): string => {
      const conditions = group.conditions.map((conditionObj) => {
        const { field, comparator, value } = conditionObj.condition;
        let processedValue = typeof value === 'string' ? `'${value}'` : value; // Add quotes for strings

        switch (comparator) {
          case 'Contains':
            return `${field} LIKE '%${value}%'`;
          case 'Does Not Contains':
            return `${field} NOT LIKE '%${value}%'`;
          case 'Starts With':
            return `${field} LIKE '${value}%'`;
          case 'Ends With':
            return `${field} LIKE '%${value}'`;
          default:
            return `${field} ${comparator} ${processedValue}`;
        }
      });

      const nestedGroups = (group.groups || []).map(processGroup);

      // Combine conditions and nested group queries using the group's operator
      const allClauses = [...conditions, ...nestedGroups];
      return `(${allClauses.join(` ${group.operator} `)})`;
    };

    return filterGroups.map(processGroup).join(' AND '); // Top-level groups are combined with 'AND'
  }

  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }

  oldFilter: any[] = [];
  deleteItem(item: any): void {
    sessionStorage.removeItem('ID');
    this.isDeleting = true;
    this.filterloading = true;
    this.api.deleteFilterById(item.ID).subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.savedFilters = this.savedFilters.filter(
            (filter) => filter.ID !== item.ID
          );
          this.message.success('Filter deleted successfully.', '');
          sessionStorage.removeItem('ID');
          this.filterloading = true;
          this.isDeleting = false;
          this.isfilterapply = false;
          this.filterClass = 'filter-invisible';

          this.loadFilters();
          if (this.selectedFilter == item.ID) {
            this.filterQuery = '';
            this.search(true);
          } else {
            this.isfilterapply = true;
          }
        } else {
          this.message.error('Failed to delete filter.', '');
          this.isDeleting = false;
          this.filterloading = true;
        }
      },
      (err: HttpErrorResponse) => {
        this.loadingRecords = false;
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

  applyfilter(item) {
    this.selectedFilter = item.ID;
    sessionStorage.setItem('ID', item.ID);
    this.filterClass = 'filter-invisible';
    this.selectedFilter = item.ID;
    this.isfilterapply = true;
    this.filterQuery = ' AND (' + item.FILTER_QUERY + ')';
    this.search(true);
  }

  filterloading: boolean = false;
  isDeleting: boolean = false;
  loadFilters() {
    this.filterloading = true;

    this.api
      .getFilterData1(
        0,
        0,
        'id',
        'desc',
        ` AND TAB_ID = ${this.TabId} AND USER_ID = ${this.USER_ID}`
      ) // Use USER_ID as a number
      .subscribe(
        (response) => {
          if (response.code === 200) {
            this.filterloading = false;
            this.savedFilters = response.data;
            if (this.whichbutton == 'SA' || this.updateBtn == 'UF') {
              if (this.whichbutton == 'SA') {
                sessionStorage.removeItem('ID');
              }
              if (
                sessionStorage.getItem('ID') !== null &&
                sessionStorage.getItem('ID') !== undefined &&
                sessionStorage.getItem('ID') !== '' &&
                Number(sessionStorage.getItem('ID')) !== 0
              ) {
                let IDIndex = this.savedFilters.find(
                  (element: any) =>
                    Number(element.ID) === Number(sessionStorage.getItem('ID'))
                );
                this.applyfilter(IDIndex);
              } else {
                if (this.whichbutton == 'SA') {
                  this.applyfilter(this.savedFilters[0]);
                }
              }

              this.whichbutton = '';
              this.updateBtn = '';
            }
            // else if (this.whichbutton == 'SA') {
            //   this.applyfilter(this.savedFilters[0]);
            // }

            this.filterQuery = '';
          } else {
            this.filterloading = false;
            this.message.error('Failed to load filters.', '');
          }
        },
        (error) => {
          this.filterloading = false;
          this.message.error('An error occurred while loading filters.', '');
        }
      );
    this.filterQuery = '';
  }

  isModalVisible = false; // Controls modal visibility
  selectedQuery: string = ''; // Holds the query to display

  toggleLiveDemo(item): void {
    this.selectedQuery = item.FILTER_QUERY;
    // Assign the query to display
    this.isModalVisible = true; // Show the modal
  }

  handleCancel(): void {
    this.isModalVisible = false; // Close the modal
    this.selectedQuery = ''; // Clear the selected query
  }

  orderdrawerVisible = false;
  orderdrawerTitle = '';
  ORDER_ID = 0;
  orderdrawerData: any;
  viewOrder(data: any): void {
    this.ORDER_ID = data.ORDER_ID;
    this.orderdrawerTitle = `View details of ${data.ORDER_NO}`;
    this.orderdrawerData = Object.assign({}, data);
    this.orderdrawerVisible = true;
  }
  orderdrawerClose(): void {
    this.orderdrawerVisible = false;
  }
  get closeCallbackOrders() {
    return this.orderdrawerClose.bind(this);
  }

  ratingsShow: boolean = false;
  ratingsData: any;
  RatingsdrawerTitle: any = '';
  custid: any;
  giveratings(data: any) {
    this.ratingsData = data;
    this.custid = data.ID;
    this.RatingsdrawerTitle = 'Give ratings to ' + data.TECHNICIAN_NAME;
    this.ratingsShow = true;
  }
  drawersizeRatings = '30%';
  giveratingsdrawerClose(): void {
    this.ratingsShow = false;
  }
  //Drawer Methods
  get giveratingscloseCallback() {
    return this.giveratingsdrawerClose.bind(this);
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }

  TechJobsPhotosData: any;
  TechJobsPhotosTitle: any = '';
  Jobcustid: any;
  TechJobsPhotosView: boolean = false;
  TechJobsPhotosDataView(data: any) {
    this.TechJobsPhotosData = data;
    this.Jobcustid = data.ID;
    this.TechJobsPhotosTitle = 'Job Photos of ' + data.JOB_CARD_NO;
    this.TechJobsPhotosView = true;
  }
  drawersizePhoto = '60%';
  TechJobsPhotosdrawerClose(): void {
    this.TechJobsPhotosView = false;
  }
  //Drawer Methods
  get TechJobsPhotoscloseCallback() {
    return this.TechJobsPhotosdrawerClose.bind(this);
  }

  Clearfilter() {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = '';
    this.isfilterapply = false;
    this.filterQuery = '';
    this.search();
    sessionStorage.removeItem('ID');
  }

  filterOfTerritory: any = [];
  isall = true;
  applyfilterChange(event) {
    var filterrrr = event[event.length - 1];
    if (filterrrr === 0) {
      this.filterOfTerritory = [];
      this.filterOfTerritory.push(0);
      this.isall = true;
    } else {
      var filter = this.filterOfTerritory.indexOf(0);
      if (filter > -1) {
        this.filterOfTerritory.splice(filter, 1);
      }
      this.isall = false;
    }

    this.search(true);
  }

  chatdata: any;
  chatdrawerClose() {
    this.chatdrawerVisible = false;
  }
  chatdrawerTitle: any = '';
  chatdrawerVisible: boolean = false;
  get chatcloseCallback() {
    return this.chatdrawerClose.bind(this);
  }

  // openchat(data) {
  //   this.chatdata = data;

  //   this.chatdrawerVisible = true;
  //   this.chatdrawerTitle = 'Chat with ' + data.TECHNICIAN_NAME;

  //   var topics =
  //     'support_chat_' + data.ID + '_backoffice_' + this.USER_ID + '_channel';

  //   const subscribedChannels1 = sessionStorage.getItem('subscribedChannels1');
  //   if (subscribedChannels1) {
  //     let channelsArray = JSON.parse(subscribedChannels1);
  //     if (Array.isArray(channelsArray) && channelsArray.length > 0) {
  //       var fi = -1;
  //       fi = channelsArray.findIndex(
  //         (channel: any) => topics == channel.CHANNEL_NAME
  //       );
  //       if (fi != undefined && fi != null && fi == -1) {
  //         this.api.subscribeToMultipleTopics([topics]).subscribe({
  //           next: () => {
  //             // Update sessionStorage
  //             var j: any = sessionStorage.getItem('subscribedChannels1');
  //             let channelsArray = JSON.parse(j);
  //             channelsArray.push({ CHANNEL_NAME: topics });
  //             sessionStorage.setItem(
  //               'subscribedChannels1',
  //               JSON.stringify(channelsArray)
  //             );
  //           },
  //           error: (err) => {
  //             console.error('Failed to subscribe to topics:', err);
  //           },
  //         });
  //       }
  //     } else {
  //       this.api.subscribeToMultipleTopics([topics]).subscribe({
  //         next: () => {
  //           // Update sessionStorage
  //           var j: any = sessionStorage.getItem('subscribedChannels1');
  //           let channelsArray = JSON.parse(j);
  //           channelsArray.push({ CHANNEL_NAME: topics });
  //           sessionStorage.setItem(
  //             'subscribedChannels1',
  //             JSON.stringify(channelsArray)
  //           );
  //         },
  //         error: (err) => {
  //           console.error('Failed to subscribe to topics:', err);
  //         },
  //       });
  //     }
  //   }
  // }

  // openchat(data: any) {
  //   this.chatdata = data;

  //   this.chatdrawerVisible = true;
  //   this.chatdrawerTitle = 'Chat with ' + data.TECHNICIAN_NAME;

  //   var topic1 =
  //     'support_chat_' + data.ID + '_backoffice_' + this.USER_ID + '_channel';
  //   var topic2 =
  //     'job_chat_' + data.ID + '_initiate_channel';

  //   var topic1data: any = {
  //     CHANNEL_NAME: topic1,
  //     USER_ID: this.USER_ID,
  //     STATUS: true,
  //     CLIENT_ID: 1,
  //     USER_NAME: this.USER_ID1,
  //     TYPE: 'B',
  //     DATE: this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss")
  //   }
  //   var topic1data1: any = {
  //     CHANNEL_NAME: topic2,
  //     USER_ID: this.USER_ID,
  //     STATUS: true,
  //     CLIENT_ID: 1,
  //     USER_NAME: this.USER_ID1,
  //     TYPE: 'B',
  //     DATE: this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss")
  //   }
  //   this.api.channelSubscribedUsers(topic1data).subscribe(
  //     (data) => { });
  //   this.api.channelSubscribedUsers(topic1data1).subscribe(
  //     (data) => { });

  //   const topics = [topic1, topic2];

  //   const subscribedChannels1 = sessionStorage.getItem('subscribedChannels1');
  //   if (subscribedChannels1) {
  //     let channelsArray = JSON.parse(subscribedChannels1);
  //     if (Array.isArray(channelsArray) && channelsArray.length > 0) {
  //       topics.forEach((topic) => {
  //         var fi = channelsArray.findIndex(
  //           (channel: any) => topic == channel.CHANNEL_NAME
  //         );
  //         if (fi == -1) {
  //           this.api.subscribeToMultipleTopics([topic]).subscribe({
  //             next: () => {
  //               var j: any = sessionStorage.getItem('subscribedChannels1');
  //               let channelsArray = JSON.parse(j);
  //               channelsArray.push({ CHANNEL_NAME: topic });
  //               sessionStorage.setItem(
  //                 'subscribedChannels1',
  //                 JSON.stringify(channelsArray)
  //               );
  //             },
  //             error: (err) => {
  //               console.error('Failed to subscribe to topic:', err);
  //             },
  //           });
  //         }
  //       });
  //     } else {
  //       topics.forEach((topic) => {
  //         this.api.subscribeToMultipleTopics([topic]).subscribe({
  //           next: () => {
  //             var j: any = sessionStorage.getItem('subscribedChannels1');
  //             let channelsArray = JSON.parse(j);
  //             channelsArray.push({ CHANNEL_NAME: topic });
  //             sessionStorage.setItem(
  //               'subscribedChannels1',
  //               JSON.stringify(channelsArray)
  //             );
  //           },
  //           error: (err) => {
  //             console.error('Failed to subscribe to topic:', err);
  //           },
  //         });
  //       });
  //     }
  //   }
  // }

  openchat(data: any) {
    this.chatdata = data;

    this.chatdrawerVisible = true;
    this.chatdrawerTitle = 'Chat with ' + data.TECHNICIAN_NAME;

    var topic1 =
      'support_chat_' + data.ID + '_backoffice_' + this.USER_ID + '_channel';
    var topic2 =
      'job_chat_' + data.ID + '_initiate_channel';

    var topic1data: any = {
      CHANNEL_NAME: topic1,
      USER_ID: this.USER_ID,
      STATUS: true,
      CLIENT_ID: 1,
      USER_NAME: this.USER_ID1,
      TYPE: 'B',
      DATE: this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss")
    };
    var topic2data: any = {
      CHANNEL_NAME: topic2,
      USER_ID: this.USER_ID,
      STATUS: true,
      CLIENT_ID: 1,
      USER_NAME: this.USER_ID1,
      TYPE: 'B',
      DATE: this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss")
    };

    const topics = [topic1, topic2];
    const topicDataMap = {
      [topic1]: topic1data,
      [topic2]: topic2data,
    };

    const subscribedChannels1 = sessionStorage.getItem('subscribedChannels1');
    if (subscribedChannels1) {
      let channelsArray = JSON.parse(subscribedChannels1);
      if (Array.isArray(channelsArray) && channelsArray.length > 0) {
        topics.forEach((topic) => {
          var fi = channelsArray.findIndex(
            (channel: any) => topic == channel.CHANNEL_NAME
          );
          if (fi == -1) {
            this.api.subscribeToMultipleTopics([topic]).subscribe({
              next: () => {
                var j: any = sessionStorage.getItem('subscribedChannels1');
                let channelsArray = JSON.parse(j);
                channelsArray.push({ CHANNEL_NAME: topic });
                sessionStorage.setItem(
                  'subscribedChannels1',
                  JSON.stringify(channelsArray)
                );

                // Call channelSubscribedUsers only on new subscription
                this.api.channelSubscribedUsers(topicDataMap[topic]).subscribe(
                  () => { },
                  (err) => { console.error('Failed to log channel subscription:', err); }
                );
              },
              error: (err) => {
                console.error('Failed to subscribe to topic:', err);
              },
            });
          }
        });
      } else {
        topics.forEach((topic) => {
          this.api.subscribeToMultipleTopics([topic]).subscribe({
            next: () => {
              var j: any = sessionStorage.getItem('subscribedChannels1');
              let channelsArray = JSON.parse(j);
              channelsArray.push({ CHANNEL_NAME: topic });
              sessionStorage.setItem(
                'subscribedChannels1',
                JSON.stringify(channelsArray)
              );

              // Call channelSubscribedUsers only on new subscription
              this.api.channelSubscribedUsers(topicDataMap[topic]).subscribe(
                () => { },
                (err) => { console.error('Failed to log channel subscription:', err); }
              );
            },
            error: (err) => {
              console.error('Failed to subscribe to topic:', err);
            },
          });
        });
      }
    }
  }



  roundRating(rating: number): number {
    if (rating !== null && rating !== undefined && rating > 0) {
      return Math.round(rating * 2) / 2;
    } else {
      return 0;
    }
  }
}