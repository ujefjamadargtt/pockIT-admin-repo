import { Component, Input, OnInit } from '@angular/core';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { HttpErrorResponse } from '@angular/common/http';
import { orderMasterData } from 'src/app/Pages/Models/OrderMasterData';
import { customer } from 'src/app/Pages/Models/customer';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
@Component({
  selector: 'app-chatlist',
  templateUrl: './chatlist.component.html',
  styleUrls: ['./chatlist.component.css'],
})
export class ChatlistComponent implements OnInit {
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
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService
  ) { }
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
    if (
      this.decreptedroleId != 1 &&
      this.decreptedroleId != 6 &&
      this.decreptedroleId != 8 &&
      this.decreptedroleId != 9
    ) {
      var decreptedbackofficeId = this.backofficeId
        ? this.commonFunction.decryptdata(this.backofficeId)
        : '';
      this.decreptedbackofficeId = parseInt(decreptedbackofficeId, 10);
    }
    this.getDatas();
  }

  vieworderdata: any;
  isSpinning: boolean = false;
  orderDetails: any;
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

    this.TERRITORY_IDS = [];
    if (this.decreptedroleId == 9) {
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
                this.TERRITORY_IDS.push(element.TERITORY_ID);
              });
              this.search(true);
            }
          }
        });
    } else if (
      this.decreptedroleId != 1 &&
      this.decreptedroleId != 6 &&
      this.decreptedroleId != 8 &&
      this.decreptedroleId != 9
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
                this.TERRITORY_IDS.push(element.TERITORY_ID);
              });
              this.search(true);
            }
          }
        });
    } else {
      this.search(true);
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
              });
            }
          }
        });
    }
  }
  teritoryData: any = {};
  vieworder(data: any): void {
    this.drawerTitle = 'Order Details';
    this.orderDetails = data;
    this.isSpinning = true;

    this.api.getorderdetails(0, 0, '', '', '', data.ID).subscribe((data) => {
      this.vieworderdata = data;
      this.api
        .getTeritory(
          1,
          1,
          '',
          '',
          ' AND IS_ACTIVE =1 AND ID=' +
          this.vieworderdata.orderData[0].TERRITORY_ID
        )
        .subscribe((data) => {
          this.teritoryData = data['data'][0];
        });
      this.drawerVisible = true;
      this.isSpinning = false;
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
      } else if (this.TYPE == 'ORDER') {
        likeQuery = likeQuery + ' AND ID =' + this.FILTER_ID;
      } else if (
        this.decreptedroleId == 9 ||
        (this.decreptedroleId != 1 &&
          this.decreptedroleId != 6 &&
          this.decreptedroleId != 8 &&
          this.decreptedroleId != 9)
      ) {
        likeQuery +=
          ' AND TERRITORY_ID in (' + this.TERRITORY_IDS.toString() + ')';
        if (this.TERRITORY_IDS.length == 0) {
          this.loadingRecords = false;
          this.dataList = [];
          this.isSpinning = false;
        } else {
          this.getOrdersData2(sort, likeQuery);
        }
      } else {
        this.getOrdersData2(sort, likeQuery);
      }
    }
  }
  getOrdersData2(sort, likeQuery) {
    this.api
      .getOrdersData(
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
            this.dataList = [...this.dataList, ...data['data']];
            this.isSpinning = false;
          } else {
            this.dataList = [...this.dataList, ...[]];
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

    if (this.TYPE == 'CUSTOMER') {
      likeQuery = likeQuery + ' AND CUSTOMER_ID =' + this.FILTER_ID;
      this.getOrdersData(sort, likeQuery);
    } else if (this.TYPE == 'ORDER') {
      likeQuery = likeQuery + ' AND ID =' + this.FILTER_ID;
      this.getOrdersData(sort, likeQuery);
    } else if (
      this.decreptedroleId == 9 ||
      (this.decreptedroleId != 1 &&
        this.decreptedroleId != 6 &&
        this.decreptedroleId != 8 &&
        this.decreptedroleId != 9)
    ) {
      likeQuery +=
        ' AND TERRITORY_ID in (' + this.TERRITORY_IDS.toString() + ')';
      if (this.TERRITORY_IDS.length == 0) {
        this.loadingRecords = false;
        this.dataList = [];
        this.isSpinning = false;
      } else {
        this.getOrdersData(sort, likeQuery);
      }
    } else this.getOrdersData(sort, likeQuery);
    //
  }
  getOrdersData(sort, likeQuery) {
    this.api
      .getOrdersData(
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
            this.dataList = data['data'];
            this.TabId = data['TAB_ID'];
            this.isSpinning = false;
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
    this.filterFields[0]['options'] = this.customer;
    this.drawerFilterVisible = true;

    this.drawerTitle = 'Backoffice-Technician Chat Filter';

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
      key: 'CUSTOMER_ID',
      label: 'Customer Name',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
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
    else this.filterClass = 'filter-visible';
  }

  oldFilter: any[] = [];
  // deleteItem(item: any) {
  //   this.oldFilter = this.oldFilter.filter((i) => i !== item);
  //   if (this.isfilterapply == true && this.oldFilter.length == 0) {
  //     this.isfilterapply = false;
  //     this.filterQuery = '';
  //     this.search(true);
  //   }
  // }
  filterQuery = '';
  // applyfilter(item) {
  //   this.filterQuery = ' AND (' + item.query + ')';
  //   this.isfilterapply = true;
  //   this.search(true);
  // }
  isModalVisible = false; // Controls modal visibility
  selectedQuery: string = ''; // Holds the query to display

  // toggleLiveDemo(query: string, name: string): void {
  //   this.selectedQuery = query;

  //   // Assign the query to display
  //   this.isModalVisible = true; // Show the modal
  // }
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

            // 
            // 

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

  editQuery(data) {
    this.filterGroups = JSON.parse(data.FILTER_JSON)[0];
    this.filterGroups2 = JSON.parse(data.FILTER_JSON)[1];

    this.filterData = data;
    this.drawerTitle = 'Chat Filter';
    this.applyCondition = '';
    this.filterFields[0]['options'] = this.customer;
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
    this.selectedQuery = item.FILTER_QUERY;
    // Assign the query to display
    this.isModalVisible = true; // Show the modal
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

  openchat() {
    this.chatdrawerVisible = true;
    this.chatdrawerTitle = 'chat details';
  }
}
