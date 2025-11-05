import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { customer } from 'src/app/Pages/Models/customer';
import { orderMasterData } from 'src/app/Pages/Models/OrderMasterData';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';

@Component({
  selector: 'app-shpoorderlist',
  templateUrl: './shpoorderlist.component.html',
  styleUrls: ['./shpoorderlist.component.css'],
})
export class ShpoorderlistComponent {
  date = new Date();
  drawerTitle: string = '';
  drawerVisible = false;
  searchText: string = '';
  pageIndex = 1;
  pageSize = 9;
  sortKey: string = 'ID';
  sortValue: string = 'desc';
  loadingRecords = false;
  dataList: any = [];
  totalRecords = 1;
  columns: string[][] = [
    ['ORDER_NUMBER', 'ORDER_NUMBER'],
    ['CUSTOMER_NAME', 'CUSTOMER_NAME'],
    ['MOBILE_NO', 'MOBILE_NO'],
    ['SERVICE_ADDRESS', 'SERVICE_ADDRESS'],
  ];
  drawerData: orderMasterData = new orderMasterData();
  drawervisible = false;
  drawersize = '85%';
  ordercreateVisible: boolean = false;
  isfilterapply: boolean = false;
  filterClass: string = 'filter-invisible';
  @Input() TYPE = '';
  @Input() FILTER_ID: any = null;
  customer: any[] = [];
  teritory: any[] = [];
  count = 0;
  roleId = sessionStorage.getItem('roleId');
  vendorId = sessionStorage.getItem('vendorId');
  decreptedroleId = 0;
  decreptedvendorId = 0;
  backofficeId = sessionStorage.getItem('backofficeId');
  decreptedbackofficeId = 0;
  TERRITORY_IDS: any[] = [];
  public commonFunction = new CommonFunctionService();
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
    private api: ApiServiceService,
    private message: NzNotificationService,
    private router: Router
  ) { }
  back() {
    this.router.navigate(['/masters/menu']);
  }
  ngOnInit(): void {
    const decryptedUserId = this.userId
      ? this.commonFunction.decryptdata(this.userId)
      : '0'; // Decrypt userId or use '0' as fallback
    this.USER_ID = Number(decryptedUserId);

    var decreptedroleIdString = this.roleId
      ? this.commonFunction.decryptdata(this.roleId)
      : '';
    this.decreptedroleId = parseInt(decreptedroleIdString, 10);

    var decreptedvendorId = this.vendorId
      ? this.commonFunction.decryptdata(this.vendorId)
      : '';
    this.decreptedvendorId = parseInt(decreptedvendorId, 10);

    if (this.decreptedroleId == 23) {
      var decreptedbackofficeId = this.backofficeId
        ? this.commonFunction.decryptdata(this.backofficeId)
        : '';
      this.decreptedbackofficeId = parseInt(decreptedbackofficeId, 10);

      this.warehouses = [];
      this.warehouse_ids = [];
      this.api
        .getWarehouseData(
          0,
          0,
          'ID',
          'ASC',
          ' AND WAREHOUSE_MANAGER_ID=' + this.decreptedbackofficeId
        )
        .subscribe((successdata) => {
          if (successdata['code'] == 200) {
            successdata['data'].forEach((element) => {
              this.warehouses.push({
                value: element.ID,
                display: element.NAME,
              });
              this.warehouse_ids.push(element.ID);
              this.search(true);
            });
          }
        });
    } else {
      this.search(true);
    }
    // this.getDatas();
    this.getDatas();
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
  vieworderdata: any;
  isSpinning: boolean = false;
  orderDetails: any;
  statuses: any = [];
  warehouses: any = [];
  warehouse_ids: any = [];
  getDatas() {
    this.customer = [];
    this.api.getAllCustomer(0, 0, '', '', '').subscribe((data) => {
      if (data['code'] == '200') {
        if (data['count'] > 0) {
          data['data'].forEach((element) => {
            this.customer.push({ value: element.ID, display: element.NAME });
          });
        }
      }
    });
    this.statuses = [];
    this.api
      .getOrderStatusData(0, 0, 'ID', 'ASC', ' AND IS_ACTIVE=1')
      .subscribe((data4) => {
        if (data4['code'] == 200) {
          data4['data'].forEach((element) => {
            this.statuses.push({
              value: element.ID,
              display: element.NAME,
            });
          });
        }
      });
  }
  teritoryData: any = {};

  vieworder(data: any): void {
    this.drawerTitle = 'Shop Order Details ';
    this.orderDetails = data;
    this.isSpinning = true;

    this.api.getshoporderalldata(0, 0, '', '', data.ID).subscribe((data) => {
      if (data['status'] == 200) {
        this.vieworderdata = data['body'];
        this.isSpinning = false;
        this.drawerVisible = true;
      } else {
        this.vieworderdata = [];
        this.isSpinning = false;
      }
    });
  }

  keyup(keys) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    if (this.searchText.length >= 3 && keys.key === 'Enter') {
      this.search(true);
    } else if (this.searchText.length === 0 && keys.key == 'Backspace') {
      this.dataList = [];
      this.search(true);
    }
  }

  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
  }

  loadMore() {
    if (this.dataList.length < this.totalRecords) {
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

      // Combine global search query and column-specific search query
      likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');

      this.isSpinning = true;

      if (this.TYPE == 'CUSTOMER') {
        likeQuery = likeQuery + ' AND CUSTOMER_ID =' + this.FILTER_ID;
        this.getOrdersData2(sort, likeQuery);
      } else if (this.TYPE == 'ORDER') {
        likeQuery = likeQuery + ' AND ID =' + this.FILTER_ID;
        this.getOrdersData2(sort, likeQuery);
      } else this.getOrdersData2(sort, likeQuery);

    }
  }
  getOrdersData2(sort, likeQuery) {
    var f = '';
    if (this.decreptedroleId == 23) {
      f = ' AND WAREHOUSE_ID in (' + this.warehouse_ids.toString() + ')';
    }
    this.api
      .getshopOrdersData(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + this.filterQuery + f
      )
      .subscribe(
        (data) => {
          if (data['status'] == 200) {
            this.loadingRecords = false;
            this.dataList = [...this.dataList, ...data['body']['data']];
            this.isSpinning = false;
          } else if (data['status'] == 400) {
            this.loadingRecords = false;
            this.dataList = [...this.dataList, ...[]];
            this.message.error('Invalid filter parameter', '');
          } else {
            this.dataList = [...this.dataList, ...[]];
            // this.message.error('Something Went Wrong ...', '');
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
            this.message.error('Invalid filter parameter', '');
          } else {
            this.message.error('Something Went Wrong.', '');
            this.isSpinning = false;
          }
          this.dataList = [...this.dataList, ...[]];
        }
      );
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

    // Combine global search query and column-specific search query
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');

    this.isSpinning = true;
    this.getOrdersData(sort, likeQuery);

  }
  getOrdersData(sort, likeQuery) {
    var f = '';
    if (this.decreptedroleId == 23) {
      f = ' AND WAREHOUSE_ID in (' + this.warehouse_ids.toString() + ')';
    }
    this.api
      .getshopOrdersData(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + this.filterQuery + f
      )
      .subscribe(
        (data) => {
          if (data['status'] == 200) {
            this.loadingRecords = false;
            this.totalRecords = data['body']['count'];
            this.dataList = data['body']['data'];
            this.TabId = data['body']['TAB_ID'];
            this.isSpinning = false;
          } else if (data['status'] == 400) {
            this.loadingRecords = false;
            this.dataList = [];
            this.isSpinning = false;
            this.message.error('Invalid filter parameter', '');
          } else {
            this.loadingRecords = false;
            this.dataList = [];
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
          this.dataList = [];
        }
      );
  }

  drawerClose(): void {
    this.search(true);

    this.drawerVisible = false;
  }
  //Drawer Methods
  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  drawerCloseorder(): void {
    this.search(true);
    this.ordercreateVisible = false;
  }

  //Drawer Methods
  get closeCallbackorder() {
    return this.drawerCloseorder.bind(this);
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
  filterData: any;
  openfilter() {
    this.drawerTitle = 'Shop Order Filter';
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

    this.filterFields[0]['options'] = this.customer;
    // this.filterFields[6]['options'] = this.teritory;
    this.filterFields[3]['options'] = this.statuses;
    this.drawerFilterVisible = true;
  }

  drawerflterClose(buttontype, updateButton): void {
    this.drawerFilterVisible = false;
    this.loadFilters();

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
    return this.drawerflterClose.bind(this);
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
      key: 'CUSTOMER_TYPE',
      label: 'Customer Type',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: 'B', display: 'Business' },
        { value: 'R', display: 'Regular' },
      ],
      placeholder: 'Select Customer Type',
    },
    {
      key: 'ORDER_DATE_TIME',
      label: 'Order Date Time',
      type: 'date',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: '>', display: 'Greater Than' },
        { value: '<', display: 'Less Than' },
        { value: '>=', display: 'Greater Than Equal To' },
        { value: '<=', display: 'Less Than Equal To' },
      ],
      placeholder: 'Select Order Date Time',
    },
    {
      key: 'ORDER_STATUS_ID',
      label: 'Order Status',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [],
      placeholder: 'Select Order Status',
    },
    {
      key: 'PAYMENT_MODE',
      label: 'Payment Mode',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: 'COD', display: 'Cash on Delivery' },
        { value: 'ONLINE', display: 'Online' },
      ],
      placeholder: 'Select Payment Mode',
    },
    {
      key: 'MOBILE_NO',
      label: 'Mobile Number',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Mobile Number',
    },
  ];

  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerflterClose('', '');
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
    else {
      this.filterClass = 'filter-visible';
      this.loadFilters();
    }
  }

  oldFilter: any[] = [];

  filterQuery = '';
  isModalVisible = false; // Controls modal visibility
  selectedQuery: string = ''; // Holds the query to display

  handleCancel(): void {
    this.isModalVisible = false; // Close the modal
    this.selectedQuery = ''; // Clear the selected query
  }

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

  selectedFilter: string | null = null;
  userId = sessionStorage.getItem('userId'); // Retrieve userId from session storage
  USER_ID: number; // Declare USER_ID as a number
  savedFilters: any; // Define the type of savedFilters if possible
  currentClientId = 1; // Set the client ID
  TabId: number; // Ensure TabId is defined and initialized

  applyfilter(item) {
    this.selectedFilter = item.ID;
    sessionStorage.setItem('ID', item.ID);
    this.filterClass = 'filter-invisible';
    this.selectedFilter = item.ID;
    this.isfilterapply = true;
    this.filterQuery = ' AND (' + item.FILTER_QUERY + ')';
    this.search(true);
  }
  Clearfilter() {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = '';
    this.isfilterapply = false;
    this.filterQuery = '';
    this.search();
    sessionStorage.removeItem('ID');
  }
  filterloading: boolean = false;

  whichbutton;
  updateBtn;

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

  editQuery(data) {
    this.filterGroups = JSON.parse(data.FILTER_JSON)[0];
    this.filterGroups2 = JSON.parse(data.FILTER_JSON)[1];

    this.filterData = data;
    this.drawerTitle = 'Edit Filter';
    this.applyCondition = '';
    this.filterFields[0]['options'] = this.customer;
    this.filterFields[3]['options'] = this.statuses;
    // this.filterFields[6]['options'] = this.teritory;
    this.drawerFilterVisible = true;
  }

  isDeleting: boolean = false;

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

  toggleLiveDemo(item): void {
    this.selectedQuery = item.SHOW_QUERY;
    // Assign the query to display
    this.isModalVisible = true; // Show the modal
  }
  type = 'a';
  addresses = [];
  terriotrystarttime1: any = null;
  terriotryendtime1: any = null;
  expectedDate: any = null;
  time: any = null;
  isTerritoryExpress = false;
  storeserviceaddress;
  storeBillingaddress;
  createneworder() {
    this.type = 'a';
    this.vieworderdata = {
      orderData: [new orderMasterData()],
      detailsData: [],
    };
    this.addresses = [];
    this.expectedDate = null;
    this.time = null;
    this.terriotrystarttime1 = null;
    this.terriotryendtime1 = null;
    this.expandedKeys = [];
    this.selectedKeys = [];
    this.nodes = [];
    this.servicescatalogue = [];
    this.serviceSubCatName = '';
    this.serviceCatName = '';
    this.showExpress = false;
    this.specialInstruction = '';
    this.isTerritoryExpress = false;
    this.ordercreateVisible = true;
  }
  @Input() showExpress = false;
  specialInstruction = '';
  editOrder(data: any): void {
    this.type = 'e';

    this.api.getorderdetails(0, 0, '', '', '', data.ID).subscribe((data2) => {
      this.vieworderdata = data2;
      this.vieworderdata.orderData[0]['ADDRESS_ID'] =
        this.vieworderdata.detailsData[0]['CUSTOMER_SERVICE_ADDRESS_ID'];
      this.vieworderdata.orderData[0]['ADDRESS_ID1'] =
        this.vieworderdata.detailsData[0]['CUSTOMER_BILLING_ADDRESS_ID'];
      this.api
        .OrderAddressMap(
          0,
          0,
          '',
          '',
          ' AND ORDER_ID= ' + this.vieworderdata.orderData[0]['ID']
        )
        .subscribe((data) => {
          if (data['code'] == 200) {
            this.addresses = data['data'];
            this.addresses.forEach((item: any) => {
              if (
                item.ID == this.vieworderdata.orderData[0]['SERVICE_ADDRESS_ID']
              ) {
                this.storeserviceaddress = item;
              }
              if (
                item.ID == this.vieworderdata.orderData[0]['BILLING_ADDRESS_ID']
              ) {
                this.storeBillingaddress = item;
              }
            });

          } else this.addresses = [];
        });

      this.expectedDate = new Date(
        this.vieworderdata.orderData[0]['EXPECTED_DATE_TIME']
      );
      this.time = new Date(
        this.vieworderdata.orderData[0]['EXPECTED_DATE_TIME']
      );
      this.specialInstruction =
        this.vieworderdata.orderData[0]['SPECIAL_INSTRUCTIONS'];
      var d3 = this.vieworderdata.detailsData;
      var d4 = this.vieworderdata.detailsData;

      var d2: any = [];
      var d = this.vieworderdata.detailsData;
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
      if (d2)
        this.vieworderdata.orderData[0].MAX_DURARTION_MIN =
          d2.TOTAL_DURARTION_MIN;
      if (maxTime)
        this.vieworderdata.orderData[0].START_TIME = maxTime.START_TIME;
      if (maxTime2)
        this.vieworderdata.orderData[0].END_TIME = maxTime2.END_TIME;
      this.vieworderdata.detailsData.forEach((element, index) => {
        if (element.IS_EXPRESS) this.showExpress = true;
      });
      this.MIN_T_END_TIME =
        this.vieworderdata.orderData[0].MAX_T_END_TIME <
          this.vieworderdata.orderData[0].END_TIME
          ? this.vieworderdata.orderData[0].MAX_T_END_TIME
          : this.vieworderdata.orderData[0].END_TIME;

      this.MAX_T_START_TIME =
        this.vieworderdata.orderData[0].MAX_T_START_TIME >
          this.vieworderdata.orderData[0].START_TIME
          ? this.vieworderdata.orderData[0].MAX_T_START_TIME
          : this.vieworderdata.orderData[0].START_TIME;

      this.setDateDisableDateTime(this.vieworderdata.orderData[0]);
      this.vieworderdata.orderData[0]['IS_EXPRESS'] =
        this.vieworderdata.orderData[0].IS_EXPRESS == 0 ? false : true;
      this.api
        .getTeritory(
          1,
          1,
          '',
          '',
          ' AND IS_ACTIVE =1 AND ID=' +
          this.vieworderdata.orderData[0].TERRITORY_ID
        )
        .subscribe((data3) => {
          this.teritoryData = data3['data'][0];

          this.vieworderdata.orderData[0].TERRITORY_NAME =
            this.teritoryData['NAME'];
          this.vieworderdata.orderData[0].MAX_T_START_TIME =
            this.teritoryData['START_TIME'];
          this.vieworderdata.orderData[0].MAX_T_END_TIME =
            this.teritoryData['END_TIME'];
          this.isTerritoryExpress =
            this.teritoryData['IS_EXPRESS_SERVICE_AVAILABLE'] == 0
              ? false
              : true;
          const currentDate = new Date();
          const year = currentDate.getFullYear();
          const month = currentDate.getMonth();
          const day = currentDate.getDate();
          const dateWithTime = new Date(
            year,
            month,
            day,
            ...this.teritoryData.START_TIME.split(':').map(Number)
          );
          const dateWithTime1 = new Date(
            year,
            month,
            day,
            ...this.teritoryData.END_TIME.split(':').map(Number)
          );

          this.terriotrystarttime1 = new Date(dateWithTime);
          this.terriotryendtime1 = new Date(dateWithTime1);
          this.getCategoriesNodes(this.vieworderdata.orderData[0]);
        });
      this.ordercreateVisible = true;
    });
  }

  expandedKeys: any = [];
  selectedKeys: any;
  nodes: any = [];
  servicescatalogue: any = [];
  serviceSubCatName = '';
  serviceCatName = '';
  getCategoriesNodes(datas) {
    this.expandedKeys = [];
    this.api
      .getCategoriesForOrder(datas.TERRITORY_ID, datas.CUSTOMER_ID)
      .subscribe((data) => {
        if (data['code'] == 200 && data['data'] != null) {
          this.nodes = data['data'];
          this.expandedKeys = this.getAllKeys(this.nodes);

          this.selectedKeys = this.nodes[0]['children'][0]['key'];
          this.getServices(this.selectedKeys, datas);
          this.nodes[0]['children'][0]['selected'] = true;
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

  getServices(SUB_CATEGORY_ID, data) {
    if (data.CUSTOMER_TYPE == 'B' && data['IS_SPECIAL_CATALOGUE'] == 1) {
      this.api
        .getServices(
          0,
          0,
          '',
          '',
          '',
          SUB_CATEGORY_ID,
          '',
          0,
          data.TERRITORY_ID,
          data.CUSTOMER_TYPE,
          data.CUSTOMER_ID
        )
        .subscribe((data) => {
          if (data['code'] == 200) {
            this.servicescatalogue = data['data'];

            this.serviceCatName = this.servicescatalogue[0]['CATEGORY_NAME'];
            // this.category= this.servicescatalogue[0].CATEGORY_NAME
            this.serviceSubCatName =
              this.servicescatalogue[0]['SUB_CATEGORY_NAME'];

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
          }
        });
    } else if (
      data.TERRITORY_ID != undefined &&
      data.TERRITORY_ID != null &&
      data.TERRITORY_ID > 0
    ) {
      this.api
        .getServices(
          0,
          0,
          '',
          '',
          '',
          SUB_CATEGORY_ID,
          '',
          0,
          data.TERRITORY_ID,
          data.CUSTOMER_TYPE,
          data.CUSTOMER_ID
        )
        .subscribe((datas) => {
          if (datas['code'] == 200) {
            this.servicescatalogue = datas['data'];
            this.serviceCatName = this.servicescatalogue[0]['CATEGORY_NAME'];
            // this.category= this.servicescatalogue[0].CATEGORY_NAME
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
  filterOfTerritory = 0;

  applyfilterChange(event) {
    this.filterOfTerritory = event;
    this.search(true);
  }

  @Input() MIN_T_END_TIME: any;
  @Input() MAX_T_START_TIME: any;
  @Input() currentDate = new Date();
  setDateDisableDateTime(data) {
    var date: any = new Date();
    const [hours1, minutes1, second] =
      this.MIN_T_END_TIME.split(':').map(Number);

    const today = new Date();

    this.currentDate = new Date(today); // Create a copy of the current date

    this.currentDate.setMinutes(
      this.currentDate.getMinutes() + data.MAX_DURARTION_MIN
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

  drawershoporderVisible: boolean = false;
  drawershoporderClose(): void {
    this.search(true);

    this.drawershoporderVisible = false;
  }
  drawerdata: any = [];
  //Drawer Methods
  get closeshoporderCallback() {
    return this.drawershoporderClose.bind(this);
  }
}