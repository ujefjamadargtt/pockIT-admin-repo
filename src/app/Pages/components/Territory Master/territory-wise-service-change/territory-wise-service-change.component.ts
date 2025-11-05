import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { appkeys } from 'src/app/app.constant';
import { ServiceCatMasterDataNew } from 'src/app/Pages/Models/ServiceCatMasterData';
import { TerritoryMaster } from 'src/app/Pages/Models/TerritoryMaster';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';

@Component({
  selector: 'app-territory-wise-service-change',
  templateUrl: './territory-wise-service-change.component.html',
  styleUrls: ['./territory-wise-service-change.component.css'],
  providers: [DatePipe],
})
export class TerritoryWiseServiceChangeComponent implements OnInit {
  drawerVisible: boolean = false;
  drawerData: ServiceCatMasterDataNew = new ServiceCatMasterDataNew();
  searchText: string = '';
  searchText1: string = '';
  searchTextBulk: string = '';
  public commonFunction = new CommonFunctionService();
  currentHour: any = new Date().getHours();
  currentMinute: any = new Date().getMinutes();
  isOk: boolean = false;
  updatedRecords: any[] = [];
  organizationid: any = sessionStorage.getItem('orgId');

  // Disable hours before the current hour for START_TIME
  disableBeforeCurrentHour = (): any[] => {
    const hours: any[] = [];
    for (let i = 0; i < this.currentHour; i++) {
      hours.push(i);
    }
    return hours;
  };

  changeAmount(event: any, datas: any) {
    if (event == 'B') {
      datas.B2C_PRICE = null;
    } else if (event == 'C') {
      datas.B2B_PRICE = null;
    }
  }

  restrictMinutes(event: any, datas: any): void {
    const input = event.target.value;
    if (input > 59) {
      event.target.value = 59; // Prevent values greater than 59
      datas.PREPARATION_MINUTES = 59; // Update the model value
    } else if (input < 0) {
      event.target.value = ''; // Prevent negative values
      datas.PREPARATION_MINUTES = null;
    } else {
      datas.PREPARATION_MINUTES = input; // Update model for valid input
    }
  }
  disableBeforeStartMinutes(i: number, selectedHour: number): number[] {
    const datas = this.dataListBulk[i]; // Reference the current row's data
    if (!datas.START_TIME) {
      return [];
    }
    const startHour = datas.START_TIME.getHours();
    const startMinute = datas.START_TIME.getMinutes();
    const minutes: number[] = [];
    if (selectedHour === startHour) {
      for (let i = 0; i <= startMinute; i++) {
        minutes.push(i);
      }
    }
    return minutes;
  }
  valueChange() {
    this.addbulkservice = false;
    this.searchTextBulk = '';
    this.searchText = '';
  }
  disableBeforeStartHour(i: number): number[] {
    const datas = this.dataListBulk[i]; // Reference the current row's data
    if (!datas.START_TIME) {
      return [];
    }
    const startHour = datas.START_TIME.getHours();
    const hours: number[] = [];
    for (let i = 0; i <= startHour; i++) {
      hours.push(i);
    }
    return hours;
  }

  formTitle = 'Territory Wise Service Change Management';
  pageIndex = 1;
  pageSize = 9;
  sortValue: string = 'desc';
  sortKey: string = '';
  chapters: any = [];
  GLOBAL_TABLE_CARD: string = 'C';

  isLoading = true;
  SERVER_URL = appkeys.retriveimgUrl + 'Item/';
  @Input() data: any = TerritoryMaster;
  @Input() drawerCloset: any = Function;
  @Input() drawerVisiblet: boolean = false;
  columns: string[][] = [
    ['DESCRIPTION', 'DESCRIPTION'],
    ['NAME', 'NAME'],
    ['CATEGORY_NAME', 'CATEGORY_NAME'],
    ['SUB_CATEGORY_NAME', 'SUB_CATEGORY_NAME'],
  ];

  columnsBulk: string[][] = [['NAME', 'NAME']];

  columns11: string[][] = [
    ['NAME', 'NAME'],
    // ["B2B_PRICE", "B2B_PRICE"],
    // ["B2C_PRICE", "B2C_PRICE"],
    // ["EXPRESS_COST", "EXPRESS_COST"],
  ];

  loadingRecordsBulk: boolean = false;
  totalRecordsBulk: any = 0;
  dataListBulk: any = [];
  dataListBulk1: any = [];

  loadingRecords = false;
  totalRecords = 0;
  dataList: any = [];
  drawerTitle!: string;
  servicename: any;
  statusFilter: string | undefined = undefined;

  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];
  showcloumnVisible: boolean = false;
  servicecattext: string = '';
  sercatnameVisible: boolean = false;

  servicecatdesctext: string = '';
  sercatdescVisible: boolean = false;

  B2Btext: string = '';
  b2bVisible: boolean = false;

  B2Ctext: string = '';
  b2cVisible: boolean = false;

  expresspriceb2b: string = '';
  expressb2bVisible: boolean = false;

  expresspriceb2c: string = '';
  expressb2cVisible: boolean = false;

  estimationTimemins: string = '';
  estimationTimeVisible: boolean = false;

  widths: string = '35%';
  widths1: string = '100%';
  widths11: string = '60%';

  ServiceData: any = [];
  day_start_time: any;
  day_end_time: any;

  ServiceData1: any = [];
  ServiceDataMulti: any = [];
  isSpinningMulti: boolean = false;
  selectedLeafKeys: any = [];
  selectedCategories: number[] = [];
  categoryVisible = false;

  selectedSubCategories: number[] = [];
  subcategoryVisible = false;

  showcolumn = [
    { label: 'Price B2B', key: 'B2B_PRICE', visible: true },
    { label: 'Price B2C', key: 'B2C_PRICE', visible: true },
    { label: 'Express Price For B2B', key: 'EXPRESS_COST', visible: true },
    { label: 'Estimation Time', key: 'DURATION', visible: true },
    { label: 'Catlogue Image', key: 'SERVICE_IMAGE', visible: true },
  ];

  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private sanitizer: DomSanitizer,
    private router: Router,
    public datepipe: DatePipe
  ) { }

  back() {
    this.router.navigate(['/masters/menu']);
  }

  // Check if the column is visible
  isColumnVisible(key: any): boolean {
    const column = this.showcolumn.find((col) => col.key === key);
    return column ? column.visible : true;
  }
  keyup(keys: KeyboardEvent) {
    const element = window.document.getElementById('button1');
    if (this.searchText.length >= 3 && keys.key === 'Enter') {
      // this.search(true);
    } else if (this.searchText.length == 0 && keys.key === 'Backspace') {
      this.dataList = [];
      this.search(true);
    }
  }
  orgidd: any;
  CAN_CHANGE_SERVICE_PRICE1: any = sessionStorage.getItem(
    'CAN_CHANGE_SERVICE_PRICE'
  );
  CAN_CHANGE_SERVICE_PRICE_STATUS: any = 0;
  ngOnInit() {
    this.organizationid = sessionStorage.getItem('orgId');
    this.orgidd = this.organizationid
      ? this.commonFunction.decryptdata(this.organizationid)
      : 0;
    this.CAN_CHANGE_SERVICE_PRICE1 = sessionStorage.getItem(
      'CAN_CHANGE_SERVICE_PRICE'
    );
    this.CAN_CHANGE_SERVICE_PRICE_STATUS = this.CAN_CHANGE_SERVICE_PRICE1
      ? this.commonFunction.decryptdata(this.CAN_CHANGE_SERVICE_PRICE1)
      : 0;

    this.getcategoryData();
    this.getsubcategoryData();
    this.search(true);
    this.getorgData();
  }

  getcategoryData() {
    this.api.getCategoryData(0, 0, 'SEQ_NO', 'asc', ' AND STATUS=1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.ServiceData = data['data'];
        } else {
          this.ServiceData = [];
        }
      },
      () => {
        // this.message.error("Something Went Wrong", "");
      }
    );

    this.api
      .getAllOrganizations(1, 1, '', 'desc', ' AND ID= 1')
      .subscribe((data) => {
        if (data['status'] == 200) {
          if (data['body'].count > 0) {
            if (data['body']['data'][0].DAY_START_TIME) {
              this.day_start_time = data['body']['data'][0].DAY_START_TIME;
            }

            // Parse organization end time
            if (data['body']['data'][0].DAY_END_TIME) {
              this.day_end_time = data['body']['data'][0].DAY_END_TIME;
            }
          }
        }
      });
  }
  isSpinningMulti1: boolean = false;
  getServiceHierarchyget() {
    // this.isSpinningMulti = true;
    this.isSpinningMulti1 = true;
    this.api.getMultiServiceHierarchy(this.data.ID).subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.isSpinningMulti = false;
          this.isSpinningMulti1 = false;
          if (data['data'][0]['categories'].length > 0) {
            this.ServiceDataMulti = data['data'][0]['categories'];
            this.ModalVisibleMultiple = true;
          } else {
            this.message.info('No Services Found', '');
            this.ModalVisibleMultiple = false;
          }
        } else {
          this.ServiceDataMulti = [];
          this.isSpinningMulti = false;
          this.isSpinningMulti1 = false;
        }
      },
      () => {
        this.ServiceDataMulti = [];
        this.isSpinningMulti = false;
        this.isSpinningMulti1 = false;
        // this.message.error("Something Went Wrong", "");
      }
    );
  }
  getServiceTerritoryget() {
    this.isSpinningMulti = true;
    this.api
      .getServiceTerritoryget(0, 0, '', '', " AND SERVICE_TYPE IN('C','O') AND IS_FOR_B2B = 0", this.data.ID)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.isSpinningMulti = false;
            if (data['count'] > 0) {
              this.ServiceData1 = data['data'];
              this.SerModalVisible = true;
            } else {
              this.SerModalVisible = false;
              this.message.info(
                'No Services Found',
                ''
              );
            }
          } else {
            this.ServiceData1 = [];
            this.isSpinningMulti = false;
          }
        },
        () => {
          this.ServiceData1 = [];
          this.isSpinningMulti = false;
          // this.message.error("Something Went Wrong", "");
        }
      );
  }

  isSelectAll: boolean = false;

  allSelected1: any;
  selectedPincode111: any;
  allSelected: boolean = false;
  tableIndeterminate: boolean = false;
  selectedPincode: any[] = [];

  SubCategoryData: any = [];
  getsubcategoryData() {
    this.api.getSubCategoryData(0, 0, 'SEQ_NO', 'asc', ' AND STATUS=1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.SubCategoryData = data['data'];
        } else {
          this.SubCategoryData = [];
          this.message.error('Failed To Get Subategory Data', '');
        }
      },
      () => {
        // this.message.error("Something Went Wrong", "");
      }
    );
  }
  dublcatearray: any = [];
  search(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
      this.dataList = [];
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
    // if (this.searchText != "") {
    //   likeQuery = " AND";
    //   this.columns.forEach((column) => {
    //     likeQuery += " " + column[0] + " like '%" + this.searchText + "%' OR";
    //   });
    //   likeQuery = likeQuery.substring(0, likeQuery.length - 2);
    // }
    this.loadingRecords = true;

    var globalSearchQuery = '';
    // Global Search (using searchText)
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

    this.loadingRecords = true;
    if (this.servicecattext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `NAME LIKE '%${this.servicecattext.trim()}%'`;
    }
    // category Filter
    if (this.selectedCategories.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `CATEGORY_ID IN (${this.selectedCategories.join(',')})`; // Update with actual field name in the DB
    }

    // subcategory Filter
    if (this.selectedSubCategories.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `SUB_CATEGORY_ID IN (${this.selectedSubCategories.join(
        ','
      )})`; // Update with actual field name in the DB
    }
    if (this.servicecatdesctext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `DESCRIPTION LIKE '%${this.servicecatdesctext.trim()}%'`;
    }

    if (this.B2Btext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `B2B_PRICE LIKE '%${this.B2Btext.trim()}%'`;
    }

    if (this.B2Ctext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `B2C_PRICE LIKE '%${this.B2Ctext.trim()}%'`;
    }

    if (this.expresspriceb2b !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `EXPRESS_COST LIKE '%${this.expresspriceb2b.trim()}%'`;
    }
    if (this.estimationTimemins !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `DURATION LIKE '%${this.estimationTimemins.trim()}%'`;
    }

    // Status Filter
    if (this.statusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `IS_ADDED= ${this.statusFilter}`;
    }

    // Combine global search query and column-specific search query
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');

    this.api
      .getServiceTerritoryNonget(
        this.pageIndex,
        this.pageSize,
        '',
        sort,
        likeQuery + ' AND TERRITORY_ID=' + this.data.ID
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadingRecords = false;
            this.totalRecords = data['count'];
            // this.dataList = data["data"];
            this.dataList = [...this.dataList, ...data['data']];
          } else if (data['code'] == 400) {
            this.loadingRecords = false;
            this.totalRecords = 0;
            this.dataList = [];
            this.message.error('Invalid filter parameter', '');
          } else {
            this.loadingRecords = false;
            this.totalRecords = 0;
            this.dataList = [];
            // this.message.error("Something Went Wrong ...", "");
          }
        },
        (err: HttpErrorResponse) => {
          this.loadingRecords = false;
          this.totalRecords = 0;
          if (err.status === 0) {
            this.message.error(
              'Network error: Please check your internet connection.',
              ''
            );
          } else if (err['status'] == 400) {
            this.loadingRecords = false;
            this.message.error('Invalid filter parameter', '');
          } else {
            this.message.error('Something Went Wrong.', '');
          }
        }
      );
  }

  onKeypressEvent1(keys: KeyboardEvent) {
    const element = window.document.getElementById('button1');
    if (this.searchTextBulk.length >= 3 && keys.key === 'Enter') {
      this.addmultiple(true);
    } else if (this.searchTextBulk.length == 0 && keys.key == 'Backspace') {
      // this.dataList = []
      this.addmultiple(true);
    }
  }

  searchopenBulk() {
    if (this.searchTextBulk.length >= 3) {
      this.addmultiple(true);
    } else {
      this.message.info('Please enter atleast 3 characters to search', '');
    }
  }
  addmultiple(reset: boolean = false) {
    if (reset) {
      this.pageIndexBulk = 0;
      this.sortKeyBulk = 'ID';
      this.sortValueBulk = 'desc';
    }

    var sort: string;
    try {
      sort = this.sortValueBulk.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    var likeQuery = '';
    this.loadingRecordsBulk = true;

    var globalSearchQuery = '';
    // Global Search (using searchText)
    if (this.searchTextBulk !== '') {
      globalSearchQuery =
        ' AND (' +
        this.columnsBulk
          .map((column) => {
            return `${column[0]} like '%${this.searchTextBulk}%'`;
          })
          .join(' OR ') +
        ')';
    }

    this.loadingRecordsBulk = true;
    if (this.servicecattext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `NAME LIKE '%${this.servicecattext.trim()}%'`;
    }
    // category Filter
    if (this.selectedCategories.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `CATEGORY_ID IN (${this.selectedCategories.join(',')})`; // Update with actual field name in the DB
    }

    // subcategory Filter
    if (this.selectedSubCategories.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `SUB_CATEGORY_ID IN (${this.selectedSubCategories.join(
        ','
      )})`; // Update with actual field name in the DB
    }
    if (this.servicecatdesctext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `DESCRIPTION LIKE '%${this.servicecatdesctext.trim()}%'`;
    }

    if (this.B2Btext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `B2B_PRICE LIKE '%${this.B2Btext.trim()}%'`;
    }

    if (this.B2Ctext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `B2C_PRICE LIKE '%${this.B2Ctext.trim()}%'`;
    }

    if (this.expresspriceb2b !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `EXPRESS_COST LIKE '%${this.expresspriceb2b.trim()}%'`;
    }
    if (this.estimationTimemins !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `DURATION LIKE '%${this.estimationTimemins.trim()}%'`;
    }

    // Status Filter
    if (this.statusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `IS_ADDED= ${this.statusFilter}`;
    }

    // Combine global search query and column-specific search query
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');

    this.api
      .getServiceTerritoryNonget(
        0,
        0,
        this.sortKeyBulk,
        this.sortValueBulk,
        likeQuery + ' AND TERRITORY_ID=' + this.data.ID
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadingRecordsBulk = false;
            this.totalRecordsBulk = data['count'];
            this.dataListBulk = data['data'];
            this.dataListBulk.forEach((record) => {
              // Check and update START_TIME
              if (
                record.START_TIME != undefined &&
                record.START_TIME != null &&
                record.START_TIME != ''
              ) {
                const today = new Date();
                const timeParts = record.START_TIME.split(':'); // Split "HH:mm:ss"
                if (timeParts.length > 1) {
                  today.setHours(+timeParts[0], +timeParts[1], 0);
                  record.START_TIME = new Date(today); // Update START_TIME for the current record
                }
              }

              // Check and update END_TIME
              if (
                record.END_TIME != undefined &&
                record.END_TIME != null &&
                record.END_TIME != ''
              ) {
                const today = new Date();
                const timeParts = record.END_TIME.split(':'); // Split "HH:mm:ss"
                if (timeParts.length > 1) {
                  today.setHours(+timeParts[0], +timeParts[1], 0);
                  record.END_TIME = new Date(today); // Update END_TIME for the current record
                }
              }

              if (record.IS_EXPRESS && this.data.IS_EXPRESS_SERVICE_AVAILABLE) {
                record.EXPRESS_COST = record.EXPRESS_COST; // Clear the value
              } else {
                record.EXPRESS_COST = null;
              }
            });
            this.dublcatearray = JSON.parse(JSON.stringify(this.dataListBulk));
          } else if (data['code'] == 400) {
            this.loadingRecordsBulk = false;
            this.totalRecordsBulk = 0;
            this.dataListBulk = [];
            this.message.error('Invalid filter parameter', '');
          } else {
            this.loadingRecordsBulk = false;
            this.totalRecordsBulk = 0;
            this.dataListBulk = [];
            // this.message.error("Something Went Wrong ...", "");
          }
        },
        (err: HttpErrorResponse) => {
          this.loadingRecordsBulk = false;
          this.totalRecordsBulk = 0;
          if (err.status === 0) {
            this.message.error(
              'Network error: Please check your internet connection.',
              ''
            );
          } else if (err['status'] == 400) {
            this.loadingRecords = false;
            this.message.error('Invalid filter parameter', '');
          } else {
            this.message.error('Something Went Wrong.', '');
          }
        }
      );
  }

  index = -1;
  setIndex(i) {
    this.index = i;
  }
  getDisabledMinutes2 = (hour: number): number[] => {
    var disabledMinutes: number[] = [];
    const endHour = Number(this.day_end_time.split(':')[0]);
    const endMinute = Number(this.day_end_time.split(':')[1]);

    const minuteStep = 10; // Matches [nzMinuteStep]
    const allMinutes = Array.from(
      { length: 60 / minuteStep },
      (_, i) => i * minuteStep
    );
    var selectedStartHour: any;
    var selectedStartMinute: any;

    selectedStartHour = this.extractHour(
      this.dataListBulk[this.index]?.START_TIME
    );
    selectedStartMinute = this.extractMinute(
      this.dataListBulk[this.index]?.START_TIME
    );

    if (hour === selectedStartHour) {
      // If END_TIME hour matches START_TIME hour, disable minutes less than START_TIME minutes
      return allMinutes.filter((m) => m <= selectedStartMinute);
    } else if (hour === endHour) {
      // If the hour matches the organization's endHour, disable minutes greater than endMinute
      return allMinutes.filter((m) => m > endMinute);
    }
    return disabledMinutes;
  };

  getDisabledHours(type: string, index: number): () => number[] {
    return () => {
      let startHour = Number(this.day_start_time.split(':')[0]);
      let endHour = Number(this.day_end_time.split(':')[0]);

      if (type === 'START_TIME') {
        // Disable hours outside organization start and end hours
        return Array.from({ length: 24 }, (_, h) => h).filter(
          (h) => h < startHour || h > endHour
        );
      } else if (type === 'END_TIME') {
        const startTime = this.dataListBulk[index]?.START_TIME;
        if (startTime) {
          const selectedStartHour = this.extractHour(startTime);
          return Array.from({ length: 24 }, (_, h) => h).filter(
            (h) => h < selectedStartHour || h > endHour
          );
        } else {
          return Array.from({ length: 24 }, (_, h) => h).filter(
            (h) => h < startHour || h > endHour
          );
        }
      }
      return [];
    };
  }

  getDisabledMinutes(type: string, index: number): () => number[] {
    return () => {
      const startHour = Number(this.day_start_time.split(':')[0]);
      const startMinute = Number(this.day_start_time.split(':')[1]);
      const endHour = Number(this.day_end_time.split(':')[0]);
      const endMinute = Number(this.day_end_time.split(':')[1]);

      const minuteStep = 10; // Matches [nzMinuteStep]
      const allMinutes = Array.from(
        { length: 60 / minuteStep },
        (_, i) => i * minuteStep
      );
      var selectedStartHour: any;
      var selectedEndHour: any;
      var selectedStartMinute: any;

      if (type === 'START_TIME') {
        selectedStartHour = this.extractHour(
          this.dataListBulk[index]?.START_TIME || this.day_start_time
        );
        if (selectedStartHour === startHour) {
          // Disable minutes before the organization startMinute
          return allMinutes.filter((m) => m < startMinute);
        }
      } else if (type === 'END_TIME') {
        selectedStartHour = this.extractHour(
          this.dataListBulk[index]?.START_TIME
        );
        selectedStartMinute = this.extractMinute(
          this.dataListBulk[index]?.START_TIME
        );
        selectedEndHour = this.extractHour(this.dataListBulk[index]?.END_TIME);

        if (selectedEndHour === selectedStartHour) {
          // If END_TIME hour matches START_TIME hour, disable minutes less than START_TIME minutes
          return allMinutes.filter((m) => m < selectedStartMinute);
        } else if (selectedEndHour === endHour) {
          // If the hour matches the organization's endHour, disable minutes greater than endMinute
          return allMinutes.filter((m) => m > endMinute);
        }
      }
      return [];
    };
  }

  // Helper functions to extract hour and minute
  extractHour(time: any): number {
    if (typeof time === 'string') {
      return Number(time.split(':')[0]);
    } else if (time instanceof Date) {
      return time.getHours();
    } else if (typeof time === 'number') {
      const timeStr = time.toString().padStart(4, '0');
      return Number(timeStr.substring(0, 2));
    }
    return 0;
  }

  extractMinute(time: any): number {
    if (typeof time === 'string') {
      return Number(time.split(':')[1]);
    } else if (time instanceof Date) {
      return time.getMinutes();
    } else if (typeof time === 'number') {
      const timeStr = time.toString().padStart(4, '0');
      return Number(timeStr.substring(2, 4));
    }
    return 0;
  }
  onStartTimeChange(rowIndex: number, selectedTime: Date): void {
    if (selectedTime) {
      // Round the time to the nearest 10 minutes
      // this.dataListBulk[rowIndex].START_TIME = this.roundToNearestTenMinutes(new Date(selectedTime));

      // Reset END_TIME if it's earlier than the new START_TIME
      if (
        this.dataListBulk[rowIndex].END_TIME &&
        this.dataListBulk[rowIndex].END_TIME <
        this.dataListBulk[rowIndex].START_TIME
      ) {
        this.dataListBulk[rowIndex].END_TIME = null;
      }
    }
  }

  OnendTimeChange(rowIndex: number, selectedTime: Date): void {
    if (selectedTime) {
      // Round the time to the nearest 10 minutes
      // this.dataListBulk[rowIndex].START_TIME = this.roundToNearestTenMinutes(new Date(selectedTime));

      // Reset END_TIME if it's earlier than the new START_TIME
      if (
        this.dataListBulk[rowIndex].END_TIME &&
        this.dataListBulk[rowIndex].END_TIME <
        this.dataListBulk[rowIndex].START_TIME
      ) {
        this.dataListBulk[rowIndex].END_TIME = null;
      }
    }
  }

  searchopen() {
    if (this.searchText.length >= 3) {
      this.search(true);
    } else {
      this.message.info('Please enter atleast 3 characters to search', '');
    }
  }

  sortBulk(params: NzTableQueryParams) {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id';
    const sortOrder = (currentSort && currentSort.value) || 'desc';
    this.pageIndexBulk = pageIndex;
    this.pageSizeBulk = pageSize;

    if (this.pageSizeBulk != pageSize) {
      this.pageIndexBulk = 1;
      this.pageSizeBulk = pageSize;
    }

    if (this.sortKeyBulk != sortField) {
      this.pageIndexBulk = 1;
      this.pageSizeBulk = pageSize;
    }

    if (sortOrder == 'descend') {
      this.sortValueBulk = 'desc';
    } else if (sortOrder == 'ascend') {
      this.sortValueBulk = 'asc';
    } else {
      this.sortValueBulk = 'desc';
    }
    this.sortKeyBulk = sortField;
    if (currentSort != null && currentSort.value != undefined) {
      this.addmultiple();
    }
  }

  add(): void {
    this.servicename = null;
    // this.dataList = [];
    // this.pageIndex = 1;
    // this.searchText = '';
    // this.addbulkservice = false;
    this.getServiceTerritoryget();
  }
  ModalVisibleMultiple: boolean = false;
  addMultiService(): void {
    this.Service_HEI_DATA1 = [];
    this.Service_HEI_DATA = [];

    this.getServiceHierarchyget();
  }

  closeMultiSerModal() {
    // this.dataList = [];
    // this.pageIndex = 1;
    // this.searchText = '';
    this.ModalVisibleMultiple = false;
  }

  Service_HEI_DATA: any = [];
  Service_HEI_DATA1: any = [];
  onChange(selectedValue: any): void {
    this.Service_HEI_DATA = [];
    // Loop through each selected value (key)
    selectedValue.forEach((key: string) => {
      this.findAndProcessItem(this.ServiceDataMulti, key); // Call recursive function
    });
  }

  findAndProcessItem(data: any[], key: string): boolean {
    for (let item of data) {
      if (item.key === key) {
        // If the current item matches the selected key
        this.extractServiceIds(item);
        return true; // Stop further recursion for this key
      }

      // If the item has children, continue searching recursively
      if (item.children && this.findAndProcessItem(item.children, key)) {
        return true;
      }
    }

    return false; // Return false if the key is not found in the current data
  }

  extractServiceIds(item: any): void {
    if (item.isLeaf) {
      // If it's a service (leaf node), extract its ID
      const serviceId = item.key.split('-').pop(); // Get last part of the key
      if (!this.Service_HEI_DATA.includes(serviceId)) {
        this.Service_HEI_DATA.push(serviceId);
      }
    } else if (item.children) {
      // If it's a category or subcategory, process its children
      item.children.forEach((child: any) => this.extractServiceIds(child));
    }
  }

  saveserviceMulti() {
    if (
      this.Service_HEI_DATA == null ||
      this.Service_HEI_DATA == undefined ||
      this.Service_HEI_DATA.length <= 0
    ) {
      this.message.error(
        'Please select alteast one service to proceed further',
        ''
      );
    } else {
      this.loadingRecords = true;
      this.api.BulkServiceADd(this.data.ID, this.Service_HEI_DATA).subscribe(
        (successCode: any) => {
          if (successCode.code == '200') {
            this.message.success('Services mapped successfully', '');
            this.loadingRecords = false;
            this.ModalVisibleMultiple = false;
            if (this.GLOBAL_TABLE_CARD === 'C') {
              this.search(true)
            } else {
              this.addmultiple(true);
            }
          } else {
            this.message.error('Failed to map services', '');
            this.loadingRecords = false;
          }
        },
        (err: HttpErrorResponse) => {
          this.loadingRecords = false;
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
  }

  drawerClose(): void {
    this.dataList = [];
    this.pageIndex = 1;
    this.searchText = '';
    this.search(true);
    this.addmultiple();
    this.drawerVisible = false;
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  parentSerId: any;
  sername: any;

  editclick: any = 'N';
  edit(data: ServiceCatMasterDataNew): void {
    this.drawerTitle = 'Update Service';
    this.dataList = [];
    this.pageIndex = 1;
    this.searchText = '';
    this.editclick = 'Y';
    this.drawerData = Object.assign({}, data);
    if (
      this.drawerData.START_TIME != undefined &&
      this.drawerData.START_TIME != null &&
      this.drawerData.START_TIME != ''
    ) {
      const today = new Date();
      const timeParts = this.drawerData.START_TIME.split(':'); // Split "HH:mm:ss"
      if (timeParts.length > 1) {
        today.setHours(+timeParts[0], +timeParts[1], 0);
        this.drawerData.START_TIME = new Date(today);
      }
    }
    if (
      this.drawerData.END_TIME != undefined &&
      this.drawerData.END_TIME != null &&
      this.drawerData.END_TIME != ''
    ) {
      // this.drawerData.END_TIME = this.datepipe.transform(
      //   new Date(),
      //   'yyyy-MM-dd' + 'T' + this.drawerData.END_TIME
      // );
      const today = new Date();
      const timeParts = this.drawerData.END_TIME.split(':'); // Split "HH:mm:ss"
      if (timeParts.length > 1) {
        today.setHours(+timeParts[0], +timeParts[1], 0);
        this.drawerData.END_TIME = new Date(today);
      }
    }

    this.drawerVisible = true;
    // this.drawerData.DURATION = "";
  }
  // Main Filter code
  isfilterapply: boolean = false;
  filterQuery: string = '';
  visible = false;
  hide: boolean = true;
  filterQuery1: any = '';
  INSERT_NAME: any;
  comparisonOptions: string[] = [
    '=',
    '!=',
    '<',
    '>',
    '<=',
    '>=',
    'Contains',
    'Does not Contain',
    'Start With',
    'End With',
  ];

  getComparisonOptions(selectedColumn: string): string[] {
    if (
      selectedColumn === 'CATEGORY_ID' ||
      selectedColumn === 'SUB_CATEGORY_ID' ||
      selectedColumn === 'IS_ADDED'
    ) {
      return ['=', '!='];
    }
    return [
      '=',
      '!=',
      '<',
      '>',
      '<=',
      '>=',
      'Contains',
      'Does not Contain',
      'Start With',
      'End With',
    ];
  }

  columns2: string[][] = [['AND'], ['OR']];

  columns1: { label: string; value: string }[] = [
    { label: 'Category', value: 'CATEGORY_ID' },
    { label: 'Sub Category', value: 'SUB_CATEGORY_ID' },
    { label: 'Service Name', value: 'NAME' },
    { label: 'Service Description', value: 'DESCRIPTION' },
    { label: 'Price B2B (₹)', value: 'B2B_PRICE' },
    { label: 'Price B2C (₹)', value: 'B2C_PRICE' },
    { label: 'Express Price For B2B (₹)', value: 'EXPRESS_COST' },
    { label: 'Estimation Time (mins)', value: 'DURATION' },
    { label: 'Status', value: 'IS_ADDED' },
  ];

  filterClass: string = 'filter-invisible';
  showMainFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    } else {
      this.filterClass = 'filter-visible';
    }
  }

  showFilter = false;
  toggleFilter() {
    this.showFilter = !this.showFilter;
  }

  showSortFilter = false;
  toggleSortFilter() {
    this.showSortFilter = !this.showSortFilter;
  }

  SELECTCOLOUM_NAME: any;
  TABLE_VALUE: any;
  COMPARISION_VALUE: any;

  conditions: any[] = [];

  InsertNewCondition() {
    this.conditions.push({
      SELECTCOLOUM_NAME: '',
      COMPARISION_VALUE: '',
      TABLE_VALUE: '',
    });
  }

  deleteCondition(index: number) {
    this.conditions.splice(index, 1);
  }

  operators: string[] = ['AND', 'OR'];
  // QUERY_NAME: string = '';
  showQueriesArray = [];

  filterBox = [
    {
      CONDITION: '',
      FILTER: [
        {
          CONDITION: '',
          SELECTION1: '',
          SELECTION2: '',
          SELECTION3: '',
        },
      ],
    },
  ];

  addCondition() {
    this.filterBox.push({
      CONDITION: '',
      FILTER: [
        {
          CONDITION: '',
          SELECTION1: '',
          SELECTION2: '',
          SELECTION3: '',
        },
      ],
    });
  }

  removeCondition(index: number) {
    this.filterBox.splice(index, 1);
  }

  insertSubCondition(conditionIndex: number, subConditionIndex: number) {
    const lastFilterIndex = this.filterBox.length - 1;
    const lastSubFilterIndex =
      this.filterBox[lastFilterIndex]['FILTER'].length - 1;

    const selection1 =
      this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex][
      'SELECTION1'
      ];
    const selection2 =
      this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex][
      'SELECTION2'
      ];
    const selection3 =
      this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex][
      'SELECTION3'
      ];

    if (!selection1) {
      this.message.error('Please select a column', '');
    } else if (!selection2) {
      this.message.error('Please select a comparison', '');
    } else if (!selection3 || selection3.length < 1) {
      this.message.error(
        'Please enter a valid value with at least 1 characters',
        ''
      );
    } else {
      this.hide = false;
      this.filterBox[conditionIndex].FILTER.splice(subConditionIndex + 1, 0, {
        CONDITION: '',
        SELECTION1: '',
        SELECTION2: '',
        SELECTION3: '',
      });
    }
  }

  removeSubCondition(conditionIndex: number, subConditionIndex: number) {
    this.hide = true;
    this.filterBox[conditionIndex].FILTER.splice(subConditionIndex, 1);
  }

  generateQuery() {
    var isOk = true;
    var i = this.filterBox.length - 1;
    var j = this.filterBox[i]['FILTER'].length - 1;
    if (
      this.filterBox[i]['FILTER'][j]['SELECTION1'] == undefined ||
      this.filterBox[i]['FILTER'][j]['SELECTION1'] == '' ||
      this.filterBox[i]['FILTER'][j]['SELECTION2'] == undefined ||
      this.filterBox[i]['FILTER'][j]['SELECTION2'] == '' ||
      this.filterBox[i]['FILTER'][j]['SELECTION3'] == undefined ||
      this.filterBox[i]['FILTER'][j]['SELECTION3'] == '' ||
      this.filterBox[i]['FILTER'][j]['CONDITION'] == undefined ||
      this.filterBox[i]['FILTER'][j]['CONDITION'] == null
    ) {
      isOk = false;
      this.message.error('Please check some fields are empty', '');
    } else if (
      i != 0 &&
      (this.filterBox[i]['CONDITION'] == undefined ||
        this.filterBox[i]['CONDITION'] == null ||
        this.filterBox[i]['CONDITION'] == '')
    ) {
      isOk = false;
      this.message.error('Please select operator.', '');
    }

    if (isOk) {
      this.filterBox.push({
        CONDITION: '',
        FILTER: [
          {
            CONDITION: '',
            SELECTION1: '',
            SELECTION2: '',
            SELECTION3: '',
          },
        ],
      });
    }
  }

  /*******  Create filter query***********/
  query = '';
  query2 = '';
  showquery: any;
  isSpinner: boolean = false;
  createFilterQuery(): void {
    const lastFilterIndex = this.filterBox.length - 1;
    1;
    const lastSubFilterIndex =
      this.filterBox[lastFilterIndex]['FILTER'].length - 1;

    const selection1 =
      this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex][
      'SELECTION1'
      ];
    const selection2 =
      this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex][
      'SELECTION2'
      ];
    const selection3 =
      this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex][
      'SELECTION3'
      ];
    const selection4 = this.filterBox[lastFilterIndex]['CONDITION'];

    if (!selection1) {
      this.message.error('Please select a column', '');
    } else if (!selection2) {
      this.message.error('Please select a comparison', '');
    } else if (!selection3 || selection3.length < 1) {
      this.message.error(
        'Please enter a valid value with at least 1 characters',
        ''
      );
    } else if (!selection4 && lastFilterIndex > 0) {
      this.message.error('Please Select the Operator', '');
    } else {
      this.isSpinner = true;

      for (let i = 0; i < this.filterBox.length; i++) {
        if (i != 0) {
          this.query += ') ' + this.filterBox[i]['CONDITION'] + ' (';
        } else this.query = '(';

        this.query2 = '';
        for (let j = 0; j < this.filterBox[i]['FILTER'].length; j++) {
          const filter = this.filterBox[i]['FILTER'][j];
          if (j == 0) {
            //this.query2 += '(';
          } else {
            if (filter['CONDITION'] == 'AND') {
              this.query2 = this.query2 + ' AND ';
            } else {
              this.query2 = this.query2 + ' OR ';
            }
          }

          let selection1 = filter['SELECTION1'];
          let selection2 = filter['SELECTION2'];
          let selection3 = filter['SELECTION3'];

          if (selection2 == 'Contains') {
            this.query2 += `${selection1} LIKE '%${selection3}%'`;
          } else if (selection2 == 'End With') {
            this.query2 += `${selection1} LIKE '%${selection3}'`;
          } else if (selection2 == 'Start With') {
            this.query2 += `${selection1} LIKE '${selection3}%'`;
          } else {
            this.query2 += `${selection1} ${selection2} '${selection3}'`;
          }
          if (j + 1 == this.filterBox[i]['FILTER'].length) {
            //this.query2 += ') ';
            this.query += this.query2;
          }
        }

        if (i + 1 == this.filterBox.length) {
          this.query += ')';
        }
      }

      this.showquery = this.query;

      var newQuery = ' AND ' + this.query;

      this.filterQuery1 = newQuery;

      let sort = ''; // Assign a default value to sort
      let filterQuery = '';
      this.api
        .getServiceTerritoryNonget(
          0,
          0,
          '',
          sort,
          newQuery + ' AND TERRITORY_ID=' + this.data.ID
        )
        .subscribe(
          (data) => {
            if (data['code'] === 200) {
              this.totalRecords = data['count'];
              this.dataList = data['data'];
              this.isSpinner = false;
              this.filterQuery = '';
            } else {
              this.dataList = [];
              this.totalRecords = 0;
              this.isSpinner = false;
            }
          },
          (err) => {
            this.totalRecords = 0;
            if (err['ok'] === false) this.message.error('Server Not Found', '');
          }
        );

      this.QUERY_NAME = '';
    }
  }

  restrictedKeywords = [
    'SELECT',
    'INSERT',
    'UPDATE',
    'DELETE',
    'DROP',
    'TRUNCATE',
    'ALTER',
    'CREATE',
    'RENAME',
    'GRANT',
    'REVOKE',
    'EXECUTE',
    'UNION',
    'HAVING',
    'WHERE',
    'ORDER BY',
    'GROUP BY',
    'ROLLBACK',
    'COMMIT',
    '--',
    ';',
    '/*',
    '*/',
  ];

  isValidInput(input: string): boolean {
    return !this.restrictedKeywords.some((keyword) =>
      input.toUpperCase().includes(keyword)
    );
  }

  applyFilter(i, j) {
    const inputValue = this.filterBox[i].FILTER[j].SELECTION3;

    const lastFilterIndex = this.filterBox.length - 1;
    const lastSubFilterIndex =
      this.filterBox[lastFilterIndex]['FILTER'].length - 1;

    const selection1 =
      this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex][
      'SELECTION1'
      ];
    const selection2 =
      this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex][
      'SELECTION2'
      ];
    const selection3 =
      this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex][
      'SELECTION3'
      ];

    if (!selection1) {
      this.message.error('Please select a column', '');
    } else if (!selection2) {
      this.message.error('Please select a comparison', '');
    } else if (!selection3 || selection3.length < 1) {
      this.message.error(
        'Please enter a valid value with at least 1 characters',
        ''
      );
    } else if (
      typeof inputValue === 'string' &&
      !this.isValidInput(inputValue)
    ) {
      // Show error message
      this.message.error(`Invalid Input: ${inputValue} is not allowed.`, '');
    } else {
      // var DemoData:any = this.filterBox
      let sort: string;
      let filterQuery = '';

      try {
        sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
      } catch (error) {
        sort = '';
      }
      // Define a function to get the comparison value filter

      this.isSpinner = true;
      const getComparisonFilter = (
        comparisonValue: any,
        columnName: any,
        tableValue: any
      ) => {
        switch (comparisonValue) {
          case '=':
          case '!=':
          case '<':
          case '>':
          case '<=':
          case '>=':
            return `${tableValue} ${comparisonValue} '${columnName}'`;
          case 'Contains':
            return `${tableValue} LIKE '%${columnName}%'`;
          case 'Does not Contain':
            return `${tableValue} NOT LIKE '%${columnName}%'`;
          case 'Start With':
            return `${tableValue} LIKE '${columnName}%'`;
          case 'End With':
            return `${tableValue} LIKE '%${columnName}'`;
          default:
            return '';
        }
      };

      const FILDATA = this.filterBox[i]['FILTER']
        .map((item) => {
          const filterCondition = getComparisonFilter(
            item.SELECTION2,
            item.SELECTION3,
            item.SELECTION1
          );
          return `AND (${filterCondition})`;
        })
        .join(' ');

      this.api
        .getServiceTerritoryNonget(
          0,
          0,
          '',
          sort,
          FILDATA + ' AND TERRITORY_ID=' + this.data.ID
        )
        .subscribe(
          (data) => {
            if (data['code'] === 200) {
              this.totalRecords = data['count'];
              this.dataList = data['data'];
              this.isSpinner = false;
              this.filterQuery = '';
            } else {
              this.dataList = [];
              this.totalRecords = 0;
              this.isSpinner = false;
            }
          },
          (err) => {
            this.totalRecords = 0;
            if (err['ok'] === false) this.message.error('Server Not Found', '');
          }
        );
    }
  }

  resetValues(): void {
    this.filterBox = [
      {
        CONDITION: '',
        FILTER: [
          {
            CONDITION: '',
            SELECTION1: '',
            SELECTION2: '',
            SELECTION3: '',
          },
        ],
      },
    ];
    // this.searchTable();
  }

  public visiblesave = false;

  saveQuery() {
    this.visiblesave = !this.visiblesave;
  }

  QUERY_NAME: string = '';
  name1: any;
  name2: any;
  INSERT_NAMES: any[] = [];
  isModalVisible = false; // Controls modal visibility
  selectedQuery: string = ''; // Holds the query to display

  // Insertname() {
  //   if (this.QUERY_NAME.trim()) {
  //     this.INSERT_NAMES.push({ query: this.showquery, name: this.QUERY_NAME });

  //
  //     this.visiblesave = false;
  //     this.QUERY_NAME = ""; // Clear input after adding
  //   } else {
  //
  //   }
  // }

  toggleLiveDemo(query: string, name: string): void {
    this.selectedQuery = query;

    // Assign the query to display
    this.isModalVisible = true; // Show the modal
  }

  deleteItem(item: any) {
    this.INSERT_NAMES = this.INSERT_NAMES.filter((i) => i !== item);
  }

  handleLiveDemoChange(event: any) {
    this.visible = event;
  }
  toggleLiveDemo1() {
    this.visible = false;
  }

  ViewImage: any;
  ImageModalVisible = false;
  SerModalVisible: boolean = false;
  imageshow;

  viewImage(imageURL: string): void {
    this.ViewImage = 1;
    this.GetImage(imageURL);
  }

  sanitizedLink: any = '';
  GetImage(link: string) {
    let imagePath = this.api.retriveimgUrl + 'Item/' + link;
    this.sanitizedLink =
      this.sanitizer.bypassSecurityTrustResourceUrl(imagePath);
    this.imageshow = this.sanitizedLink;

    // Display the modal only after setting the image URL
    this.ImageModalVisible = true;
  }

  ImageModalCancel() {
    this.ImageModalVisible = false;
  }
  loadingRecordsservice: boolean = false;

  closeser() {
    this.SerModalVisible = false;
    this.servicename = null;
  }

  saveservice() {
    if (
      this.servicename == null ||
      this.servicename == undefined ||
      this.servicename == ''
    ) {
      this.message.error('Please select service', '');
    } else {
      this.api
        .getServiceItem(0, 0, this.sortKey, '', ' AND ID=' + this.servicename)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.loadingRecords = false;
              if (data['count'] > 0) {
                this.drawerTitle = 'Update Service Details';
                this.editclick = 'N';
                this.SerModalVisible = false;
                this.drawerData = Object.assign({}, data['data'][0]);
                if (
                  this.drawerData.START_TIME != undefined &&
                  this.drawerData.START_TIME != null &&
                  this.drawerData.START_TIME != ''
                ) {
                  const today = new Date();
                  const timeParts = this.drawerData.START_TIME.split(':'); // Split "HH:mm:ss"
                  if (timeParts.length > 1) {
                    today.setHours(+timeParts[0], +timeParts[1], 0);
                    this.drawerData.START_TIME = new Date(today);
                  }
                }
                if (
                  this.drawerData.END_TIME != undefined &&
                  this.drawerData.END_TIME != null &&
                  this.drawerData.END_TIME != ''
                ) {
                  const today = new Date();
                  const timeParts = this.drawerData.END_TIME.split(':'); // Split "HH:mm:ss"
                  if (timeParts.length > 1) {
                    today.setHours(+timeParts[0], +timeParts[1], 0);
                    this.drawerData.END_TIME = new Date(today);
                  }
                }
                this.drawerVisible = true;
              }
            } else {
              this.loadingRecords = false;
              this.message.error('Something Went Wrong ...', '');
            }
          },
          (err: HttpErrorResponse) => {
            this.loadingRecords = false;
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
  }

  handleOkTop(): void {
    const lastFilterIndex = this.filterBox.length - 1;
    1;
    const lastSubFilterIndex =
      this.filterBox[lastFilterIndex]['FILTER'].length - 1;

    const selection1 =
      this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex][
      'SELECTION1'
      ];
    const selection2 =
      this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex][
      'SELECTION2'
      ];
    const selection3 =
      this.filterBox[lastFilterIndex]['FILTER'][lastSubFilterIndex][
      'SELECTION3'
      ];
    const selection4 = this.filterBox[lastFilterIndex]['CONDITION'];

    if (!selection1) {
      this.message.error('Please select a column', '');
    } else if (!selection2) {
      this.message.error('Please select a comparison', '');
    } else if (!selection3 || selection3.length < 1) {
      this.message.error(
        'Please enter a valid value with at least 1 characters',
        ''
      );
    } else if (!selection4 && lastFilterIndex > 0) {
      this.message.error('Please Select the Operator', '');
    } else {
      this.isSpinner = true;

      for (let i = 0; i < this.filterBox.length; i++) {
        if (i != 0) {
          this.query += ') ' + this.filterBox[i]['CONDITION'] + ' (';
        } else this.query = '(';

        this.query2 = '';
        for (let j = 0; j < this.filterBox[i]['FILTER'].length; j++) {
          const filter = this.filterBox[i]['FILTER'][j];
          if (j == 0) {
            //this.query2 += '(';
          } else {
            if (filter['CONDITION'] == 'AND') {
              this.query2 = this.query2 + ' AND ';
            } else {
              this.query2 = this.query2 + ' OR ';
            }
          }

          let selection1 = filter['SELECTION1'];
          let selection2 = filter['SELECTION2'];
          let selection3 = filter['SELECTION3'];

          if (selection2 == 'Contains') {
            this.query2 += `${selection1} LIKE '%${selection3}%'`;
          } else if (selection2 == 'End With') {
            this.query2 += `${selection1} LIKE '%${selection3}'`;
          } else if (selection2 == 'Start With') {
            this.query2 += `${selection1} LIKE '${selection3}%'`;
          } else {
            this.query2 += `${selection1} ${selection2} '${selection3}'`;
          }
          if (j + 1 == this.filterBox[i]['FILTER'].length) {
            //this.query2 += ') ';
            this.query += this.query2;
          }
        }

        if (i + 1 == this.filterBox.length) {
          this.query += ')';
        }
      }

      this.showquery = this.query;
    }

    if (this.QUERY_NAME == '' || this.QUERY_NAME.trim() == '') {
      this.message.error('Please Enter Query Name', '');
    } else {
      this.INSERT_NAMES.push({ query: this.showquery, name: this.QUERY_NAME });

      this.visiblesave = false;
      this.QUERY_NAME = ''; // Clear input after adding
    }
    this.visiblesave = false;
  }

  handleCancelTop(): void {
    this.visiblesave = false;
  }

  handleCancel(): void {
    this.isModalVisible = false; // Close the modal
    this.selectedQuery = ''; // Clear the selected query
  }

  onViewReference(imageUrl: string): void {
    if (imageUrl) {
      window.open(appkeys.retriveimgUrl + 'Item/' + '/' + imageUrl, '_blank');
    }
  }
  isSpinning = false;
  Name: string = '';
  Description: string = '';
  namevisible = false;
  discriptionvisible = false;
  priceB2B: string = '';
  priceB2Bvisible = false;
  priceB2C: string = '';
  priceB2Cvisible = false;
  expresspriceB2B: string = '';
  expresspriceB2Bvisible = false;
  expresspriceB2C: string = '';
  expresspriceB2Cvisible = false;
  technitianCost: string = '';
  techCostvisible = false;
  vendorcost: string = '';
  vendorvisible = false;
  EstimatedTime: string = '';
  timevisible = false;
  Maxstockcount: string = '';
  stockvisible = false;
  shortcode: string = '';
  shortcodevisible = false;
  seqno: string = '';
  seqvisible = false;
  selectedServices: number[] = [];
  selectedServicessub: number[] = [];

  serviceVisible = false;
  subserviceVisible = false;

  datalistforTable: any = [];
  loadtable: boolean = false;
  totalREcordTable: any = 0;
  pageIndextable: any = 1;
  pageSizetable: any = 10;
  sortValuetable: string = 'desc';
  sortKeytable: any = '';
  pageIndexBulk: any = 0;
  pageSizeBulk: any = 0;
  sortValueBulk: string = 'desc';
  sortKeyBulk: any = '';

  addbulkservice: boolean = false;
  add1() {
    this.dataList = [];
    this.pageIndex = 1;
    this.searchText = '';
    this.addmultiple(true);
    this.addbulkservice = true;
    this.searchTextBulk = '';
    this.searchText = '';
  }
  searchopen1() {
    if (this.searchText.length >= 3) {
      this.search(true);
    } else {
      this.message.info('Please enter atleast 3 characters to search', '');
    }
  }

  updateValue(index: number, key: string, value: any) {
    // Get the original item from the duplicate array
    const originalItem = this.dublcatearray[index];

    // Check if the value has actually changed
    if (originalItem[key] !== value) {
      // Update the value in the main data array
      this.dataListBulk[index][key] = value;

      // Check if the record is already in updatedRecords
      const existingRecordIndex = this.updatedRecords.findIndex((item) => {
        return item.SERVICE_ID === originalItem.SERVICE_ID; // Explicit return
      });

      if (existingRecordIndex !== -1) {
        // If the record is already in updatedRecords, update the specific field
        this.updatedRecords[existingRecordIndex][key] = value;
      } else {
        const newRecord = { ...originalItem, [key]: value };
        this.updatedRecords.push(newRecord);
        // If the record is not in updatedRecords, add a copy of it with the updated field
        // this.updatedRecords.push({ ...originalItem });
      }

      const selectedTime = new Date(value);
      if (key == 'START_TIME' || key == 'END_TIME') {
        this.dataListBulk[index][key] =
          this.roundMinutesToNearestInterval(selectedTime);
      }
    } else {
    }
  }

  save(): void {
    if (this.updatedRecords.length > 0) {
      let isValid = true; // Flag to track if the validation passes
      let commonErrorMessage = '';
      this.updatedRecords.forEach((data, i) => {
        // Check if required fields are empty or invalid for each row

        // if (!commonErrorMessage && (
        //   data.SERVICE_TYPE == null ||
        //   data.SERVICE_TYPE == undefined ||
        //   data.SERVICE_TYPE == '')) {
        //   commonErrorMessage = 'Please select service type for updated records.';
        //   isValid = false;
        // } else
        if (
          !commonErrorMessage &&
          (data.SERVICE_TYPE == 'B' || data.SERVICE_TYPE == 'O') &&
          (data.B2B_PRICE === null ||
            data.B2B_PRICE === undefined ||
            data.B2B_PRICE === '')
        ) {
          commonErrorMessage = 'Please enter B2B cost for updated records.';
          isValid = false;
        } else if (
          !commonErrorMessage &&
          (data.SERVICE_TYPE == 'C' || data.SERVICE_TYPE == 'O') &&
          (data.B2C_PRICE == null ||
            data.B2C_PRICE == undefined ||
            data.B2C_PRICE == '' ||
            data.B2C_PRICE <= 0)
        ) {
          commonErrorMessage = 'Please enter B2C cost for updated records.';
          isValid = false;
        } else if (
          !commonErrorMessage &&
          (data.TECHNICIAN_COST === null ||
            data.TECHNICIAN_COST === undefined ||
            data.TECHNICIAN_COST === '')
        ) {
          commonErrorMessage =
            'Please enter technician cost for updated records.';
          isValid = false;
        } else if (
          !commonErrorMessage &&
          (data.VENDOR_COST === null ||
            data.VENDOR_COST === undefined ||
            data.VENDOR_COST === '')
        ) {
          commonErrorMessage = 'Please enter vendor cost for updated records.';
          isValid = false;
        } else if (
          !commonErrorMessage &&
          data.IS_EXPRESS &&
          this.data.IS_EXPRESS_SERVICE_AVAILABLE &&
          (data.EXPRESS_COST == null ||
            data.EXPRESS_COST == undefined ||
            data.EXPRESS_COST == '' ||
            data.EXPRESS_COST <= 0)
        ) {
          commonErrorMessage = 'Please enter express cost for updated records.';
          isValid = false;
        } else if (
          !commonErrorMessage &&
          (data.START_TIME == undefined ||
            data.START_TIME == null ||
            data.START_TIME == 0)
        ) {
          commonErrorMessage = 'Please select start time for updated records.';
          isValid = false;
        } else if (
          !commonErrorMessage &&
          (data.END_TIME == undefined ||
            data.END_TIME == null ||
            data.END_TIME == 0)
        ) {
          commonErrorMessage = 'Please select end time for updated records.';
          isValid = false;
        } else if (
          !commonErrorMessage &&
          (data.PREPARATION_HOURS === null ||
            data.PREPARATION_HOURS === undefined ||
            data.PREPARATION_HOURS === '')
        ) {
          commonErrorMessage =
            'Please enter preparation hours for updated records.';
          isValid = false;
        } else if (
          !commonErrorMessage &&
          (data.PREPARATION_MINUTES === null ||
            data.PREPARATION_MINUTES === undefined ||
            data.PREPARATION_MINUTES === '')
        ) {
          commonErrorMessage =
            'Please enter preparation minutes for updated records.';
          isValid = false;
        } else if (
          !commonErrorMessage &&
          data.PREPARATION_HOURS !== null &&
          data.PREPARATION_HOURS !== undefined &&
          data.PREPARATION_HOURS !== '' &&
          data.PREPARATION_HOURS <= 0 &&
          data.PREPARATION_MINUTES !== null &&
          data.PREPARATION_MINUTES !== undefined &&
          data.PREPARATION_MINUTES !== '' &&
          data.PREPARATION_MINUTES <= 0
        ) {
          commonErrorMessage =
            'Service preparation time must be greater than 0 for updated records';
          isValid = false;
        }
      });

      if (isValid) {
        this.updatedRecords.forEach((data, i) => {
          if (data.START_TIME) {
            data.START_TIME = this.formatTimeToHHmm(data.START_TIME);
          }
          if (data.END_TIME) {
            data.END_TIME = this.formatTimeToHHmm(data.END_TIME);
          }
        });
        this.isSpinning = true;
        this.api.BulkServiceUpdate(this.data.ID, this.updatedRecords).subscribe(
          (successCode: any) => {
            if (successCode.code == '200') {
              this.message.success('Services Updated Successfully', '');
              this.isSpinning = false;
              this.updatedRecords = [];
              this.addmultiple(true);
            } else {
              this.message.error('Services Updation Failed', '');
              this.isSpinning = false;
            }
          },
          (err: HttpErrorResponse) => {
            this.isSpinning = false;
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
      } else {
        this.message.error(commonErrorMessage, '');
        return;
      }
    } else {
      this.message.error(
        'Please update atleast one record to save changes.',
        ''
      );
    }
  }

  formatTimeToHHmm(time: any): string {
    const date = new Date(time); // Assuming time is a valid timestamp or ISO string
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  // singlerow
  loadingRecordsreceipt: { [key: number]: boolean } = {};

  updateSingleRow(rowData: any): void {
    let isValid = true; // Flag to track if validation passes
    let commonErrorMessage = ''; // Variable to store the common error message

    if (
      (rowData.SERVICE_TYPE == 'B' || rowData.SERVICE_TYPE == 'O') &&
      (rowData.B2B_PRICE == null ||
        rowData.B2B_PRICE == undefined ||
        rowData.B2B_PRICE == '')
    ) {
      commonErrorMessage = 'Please enter B2B cost for this record.';
      isValid = false;
    } else if (
      (rowData.SERVICE_TYPE == 'C' || rowData.SERVICE_TYPE == 'O') &&
      (rowData.B2C_PRICE == null ||
        rowData.B2C_PRICE == undefined ||
        rowData.B2C_PRICE == '' ||
        rowData.B2C_PRICE <= 0)
    ) {
      commonErrorMessage = 'Please enter B2C cost for this record.';
      isValid = false;
    } else if (
      rowData.TECHNICIAN_COST == null ||
      rowData.TECHNICIAN_COST == undefined ||
      rowData.TECHNICIAN_COST == ''
    ) {
      commonErrorMessage = 'Please enter technician cost for this record.';
      isValid = false;
    } else if (
      rowData.VENDOR_COST == null ||
      rowData.VENDOR_COST == undefined ||
      rowData.VENDOR_COST == ''
    ) {
      commonErrorMessage = 'Please enter vendor cost for this record.';
      isValid = false;
    } else if (
      rowData.IS_EXPRESS &&
      this.data.IS_EXPRESS_SERVICE_AVAILABLE &&
      (rowData.EXPRESS_COST == null ||
        rowData.EXPRESS_COST == undefined ||
        rowData.EXPRESS_COST == '' ||
        rowData.EXPRESS_COST <= 0)
    ) {
      commonErrorMessage = 'Please enter express cost for this record.';
      isValid = false;
    } else if (
      rowData.START_TIME == undefined ||
      rowData.START_TIME == null ||
      rowData.START_TIME == 0
    ) {
      commonErrorMessage = 'Please select start time for this record.';
      isValid = false;
    } else if (
      rowData.END_TIME == undefined ||
      rowData.END_TIME == null ||
      rowData.END_TIME == 0
    ) {
      commonErrorMessage = 'Please select end time for this record.';
      isValid = false;
    } else if (
      rowData.PREPARATION_HOURS === null ||
      rowData.PREPARATION_HOURS === undefined ||
      rowData.PREPARATION_HOURS === ''
    ) {
      commonErrorMessage = 'Please enter preparation hours for this record.';
      isValid = false;
    } else if (
      rowData.PREPARATION_MINUTES === null ||
      rowData.PREPARATION_MINUTES === undefined ||
      rowData.PREPARATION_MINUTES === ''
    ) {
      commonErrorMessage = 'Please enter preparation minutes for this record.';
      isValid = false;
    } else if (
      rowData.PREPARATION_HOURS !== null &&
      rowData.PREPARATION_HOURS !== undefined &&
      rowData.PREPARATION_HOURS !== '' &&
      rowData.PREPARATION_HOURS <= 0 &&
      rowData.PREPARATION_MINUTES !== null &&
      rowData.PREPARATION_MINUTES !== undefined &&
      rowData.PREPARATION_MINUTES !== '' &&
      rowData.PREPARATION_MINUTES <= 0
    ) {
      commonErrorMessage = 'Service preparation time must be greater than 0';
      isValid = false;
    }

    // If valid, process the row
    if (isValid) {
      // Convert START_TIME and END_TIME to HH:mm format
      if (rowData.START_TIME) {
        rowData.START_TIME = this.formatTimeToHHmm(rowData.START_TIME);
      }
      if (rowData.END_TIME) {
        rowData.END_TIME = this.formatTimeToHHmm(rowData.END_TIME);
      }
      if (rowData.IS_EXPRESS && this.data.IS_EXPRESS_SERVICE_AVAILABLE) {
        rowData.EXPRESS_COST = rowData.EXPRESS_COST;
      } else {
        rowData.EXPRESS_COST = null;
        rowData.IS_EXPRESS = false;
      }
      rowData.PREPARATION_MINUTES = Number(rowData.PREPARATION_MINUTES);
      rowData.PREPARATION_HOURS = Number(rowData.PREPARATION_HOURS);

      this.loadingRecordsreceipt[rowData.ID] = true;

      this.isSpinning = true;
      this.api.BulkServiceUpdate(this.data.ID, [rowData]).subscribe(
        (successCode: any) => {
          if (successCode.code == '200') {
            this.message.success('Service Updated Successfully', '');
            this.isSpinning = false;
            this.loadingRecordsreceipt[rowData.ID] = false;
            this.addmultiple(true);
          } else {
            this.loadingRecordsreceipt[rowData.ID] = false;
            this.message.error('Service Update Failed', '');
            this.isSpinning = false;
          }
        },
        (err: HttpErrorResponse) => {
          this.isSpinning = false;
          this.loadingRecordsreceipt[rowData.ID] = false;
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
    } else {
      // Show error message if validation fails
      this.message.error(commonErrorMessage, '');
      return;
    }
  }
  loadMore() {
    this.pageIndex += 1;
    this.search();
  }

  drawerserviceVisibleMaped: boolean = false;
  drawerDataMaped: ServiceCatMasterDataNew = new ServiceCatMasterDataNew();
  drawerTitleMaped!: string;
  widthsss: any = '100%';
  serviceid: any;
  VieMappedServices(data: any): void {
    this.drawerTitleMaped = `View Service Logs`;
    this.serviceid = data.SERVICE_ID;
    this.drawerDataMaped = Object.assign({}, data);
    this.drawerserviceVisibleMaped = true;
  }

  drawerServiceMappingCloseMaped(): void {
    this.dataList = [];
    this.pageIndex = 1;
    this.searchText = '';
    this.search();
    this.drawerserviceVisibleMaped = false;
  }
  get closeServiceMappingCallbackMaped() {
    return this.drawerServiceMappingCloseMaped.bind(this);
  }

  //Mapping
  drawerMappigVisible: boolean = false;
  drawerMappingTitle!: string;

  draweMappingClose(): void {
    this.dataList = [];
    this.pageIndex = 1;
    this.searchText = '';
    this.search();
    this.drawerMappigVisible = false;
  }

  mapSkill(data: any) {
    // this.dataList = [];
    this.pageIndex = 1;
    this.searchText = '';
    this.drawerMappingTitle = `Map Skills to ${data.NAME} Service`;
    this.drawerData = Object.assign({}, data);
    this.drawerMappigVisible = true;
  }
  get closeCallbackMapping() {
    return this.draweMappingClose.bind(this);
  }

  drawerMappigVisibleHelp: boolean = false;
  drawerMappingTitleHelp!: string;

  draweMappingCloseHelp(): void {
    this.dataList = [];
    this.pageIndex = 1;
    this.searchText = '';
    this.search();
    this.drawerMappigVisibleHelp = false;
  }
  widthsDoc: any = '100%';
  HelpDocMap(data: any) {
    this.dataList = [];
    this.pageIndex = 1;
    this.searchText = '';
    this.drawerMappingTitleHelp = `Map Help Documents To ${data.NAME} Service`;
    this.drawerData = Object.assign({}, data);
    this.drawerMappigVisibleHelp = true;
  }
  get HelpcloseCallbackMapping() {
    return this.draweMappingCloseHelp.bind(this);
  }

  // vaishnavi
  bulkupdatebutton = false;
  StartDate: any;
  submittedDateVisible: boolean = false;
  isSubmittedDateFilterApplied: boolean = false;
  cancelFilterss() {
    this.submittedDateVisible = false;
  }
  applyprepFilter(value: any) {
    let timeString: string;
    if (value instanceof Date) {
      const hours = value.getHours();
      const minutes = value.getMinutes();
      timeString = `${hours % 12 || 12}:${minutes
        .toString()
        .padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;
    } else if (typeof value === 'string') {
      timeString = value;
    } else {

      return;
    }

    const [time, modifier] = timeString.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier === 'PM' && hours < 12) {
      hours += 12;
    }
    if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }

    const date = new Date();
    date.setHours(hours, minutes, 0);
    const formattedStartTime = date.toISOString();

    // this.dataListBulk.forEach((item) => {
    //   item.START_TIME = formattedStartTime;
    //   const endTime = new Date(item.END_TIME);

    //   if (endTime < date) {
    //     item.END_TIME = null;
    //   }
    // });

    this.dataListBulk.forEach((item, index) => {
      const endTime = new Date(item.END_TIME);
      if (endTime < date) {
        this.updateValue(index, 'END_TIME', null);
      }
      this.updateValue(index, 'START_TIME', formattedStartTime);
    });

    this.bulkupdatebutton = true;
    this.submittedDateVisible = false;
    this.updateEndTimeRestrictions();
  }

  EndDate: any;
  endDateVisible: boolean = false;
  isendDateFilterApplied: boolean = false;
  cancelendFilterss() {
    this.endDateVisible = false;
  }
  applyprependFilter(value: any) {
    let timeString: string;
    if (value instanceof Date) {
      const hours = value.getHours();
      const minutes = value.getMinutes();
      timeString = `${hours % 12 || 12}:${minutes
        .toString()
        .padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;
    } else if (typeof value === 'string') {
      timeString = value;
    } else {

      return;
    }

    const [time, modifier] = timeString.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier === 'PM' && hours < 12) {
      hours += 12;
    }
    if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }

    const date = new Date();
    date.setHours(hours, minutes, 0);
    const formattedStartTime = date.toISOString();

    // this.dataListBulk.forEach((item) => {
    //   item.END_TIME = formattedStartTime;
    // });

    this.dataListBulk.forEach((item, index) => {
      this.updateValue(index, 'END_TIME', formattedStartTime);
    });

    this.endDateVisible = false;
  }

  disableStartHours: () => number[] = () => [];
  disableStartMinutes: (hour: number) => number[] = () => [];
  disableEndHours: () => number[] = () => [];
  disableEndMinutes: (hour: number) => number[] = () => [];
  orgStartHour: any = 0;
  orgStartMinute: any = 0;
  orgEndHour: any = 23;
  orgEndMinute: any = 59;

  getorgData() {
    this.api
      .getAllOrganizations(1, 1, '', 'desc', ' AND ID=1')
      .subscribe((data) => {
        if (data['status'] == 200) {
          if (data['body'].count > 0) {
            if (data['body']['data'][0].DAY_START_TIME) {
              const startParts = data['body']['data'][0].DAY_START_TIME.split(':');
              this.orgStartHour = +startParts[0];
              this.orgStartMinute = +startParts[1];
              if (!this.data.ID) {
                this.StartDate = new Date().setHours(
                  this.orgStartHour,
                  this.orgStartMinute,
                  0
                );
              }
            }

            if (data['body']['data'][0].DAY_END_TIME) {
              const endParts = data['body']['data'][0].DAY_END_TIME.split(':');
              this.orgEndHour = +endParts[0];
              this.orgEndMinute = +endParts[1];
              if (!this.data.ID) {
                this.EndDate = new Date().setHours(
                  this.orgEndHour,
                  this.orgEndMinute,
                  0
                );
              }
            }

            this.initializeTimeRestrictions();

            if (data['body'].count > 0 && !this.data.ID) {
              if (
                data['body']['data'][0].DAY_START_TIME != undefined &&
                data['body']['data'][0].DAY_START_TIME != null &&
                data['body']['data'][0].DAY_START_TIME != ''
              ) {
                const today = new Date();
                const timeParts = data['body']['data'][0].DAY_START_TIME.split(':'); // Split "HH:mm:ss"
                if (timeParts.length > 1) {
                  today.setHours(+timeParts[0], +timeParts[1], 0);
                  this.StartDate = new Date(today);
                }
              }
              if (
                data['body']['data'][0].DAY_END_TIME != undefined &&
                data['body']['data'][0].DAY_END_TIME != null &&
                data['body']['data'][0].DAY_END_TIME != ''
              ) {
                const today = new Date();
                const timeParts = data['body']['data'][0].DAY_END_TIME.split(':'); // Split "HH:mm:ss"
                if (timeParts.length > 1) {
                  today.setHours(+timeParts[0], +timeParts[1], 0);
                  this.EndDate = new Date(today);
                }
              }
            }
          }
        }
      });
  }
  initializeTimeRestrictions() {
    this.disableStartHours = () =>
      Array.from({ length: 24 }, (_, i) => i).filter(
        (hour) => hour < this.orgStartHour || hour > this.orgEndHour
      );

    this.disableStartMinutes = (hour: number) =>
      hour === this.orgStartHour
        ? Array.from({ length: 60 }, (_, i) => i).filter(
          (minute) => minute < this.orgStartMinute
        )
        : hour === this.orgEndHour
          ? Array.from({ length: 60 }, (_, i) => i).filter(
            (minute) => minute > this.orgEndMinute
          )
          : [];

    this.disableEndHours = () => {
      const startHour = this.getStartHour();
      return Array.from({ length: 24 }, (_, i) => i).filter(
        (hour) => hour < startHour || hour > this.orgEndHour
      );
    };

    this.disableEndMinutes = (hour: number) => {
      const startHour = this.getStartHour();
      const startMinute = this.getStartMinute();

      if (hour === startHour) {
        return Array.from({ length: 60 }, (_, i) => i).filter(
          (minute) => minute <= startMinute
        );
      } else if (hour === this.orgEndHour) {
        return Array.from({ length: 60 }, (_, i) => i).filter(
          (minute) => minute > this.orgEndMinute
        );
      } else {
        return [];
      }
    };
  }

  getStartHour() {
    return this.StartDate
      ? new Date(this.StartDate).getHours()
      : this.orgStartHour;
  }

  getStartMinute() {
    return this.StartDate
      ? new Date(this.StartDate).getMinutes()
      : this.orgStartMinute;
  }

  onStartTimeChange1() {
    const selectedTime = new Date(this.StartDate);
    this.StartDate = this.roundMinutesToNearestInterval(selectedTime);

    this.initializeTimeRestrictions();
    // this.updateEndTimeRestrictions();
  }
  updateEndTimeRestrictions() {
    if (!this.StartDate) return;

    const startHour = this.StartDate.getHours();
    const startMinute = this.StartDate.getMinutes();

    this.getDisabledHours = (type: string, index: number) => {
      return () => {
        if (type === 'END_TIME') {
          return [...Array(startHour).keys()];
        }
        return [];
      };
    };

    this.getDisabledMinutes2 = (hour: number) => {
      if (hour === startHour) {
        return [...Array(startMinute + 1).keys()];
      }
      return [];
    };
  }

  onendTimeChange1() {
    const selectedTime = new Date(this.EndDate);
    this.EndDate = this.roundMinutesToNearestInterval(selectedTime);
  }
  roundMinutesToNearestInterval(date: Date): Date {
    const minutes = date.getMinutes();
    const roundedMinutes = Math.round(minutes / 10) * 10;

    let finalHour = date.getHours();
    let finalMinutes = roundedMinutes;

    if (roundedMinutes >= 60) {
      finalMinutes = 0;
      finalHour = (finalHour + 1) % 24;
    }

    const roundedDate = new Date(date);
    roundedDate.setHours(finalHour);
    roundedDate.setMinutes(finalMinutes);
    roundedDate.setSeconds(0);

    return roundedDate;
  }

  bulkupdate() {
    let isValid = true;
    let commonErrorMessage = '';

    for (const rowData of this.dataListBulk) {
      if (
        (rowData.SERVICE_TYPE == 'C' || rowData.SERVICE_TYPE == 'O') &&
        (rowData.B2C_PRICE == null ||
          rowData.B2C_PRICE == undefined ||
          rowData.B2C_PRICE == '' ||
          rowData.B2C_PRICE <= 0)
      ) {
        commonErrorMessage = 'Please enter B2C cost.';
        isValid = false;
        break;
      } else if (
        (rowData.SERVICE_TYPE == 'B' || rowData.SERVICE_TYPE == 'O') &&
        (rowData.B2B_PRICE === null ||
          rowData.B2B_PRICE === undefined ||
          rowData.B2B_PRICE === '')
      ) {
        commonErrorMessage = 'Please enter B2B cost.';
        isValid = false;
        break;
      } else if (
        rowData.TECHNICIAN_COST === null ||
        rowData.TECHNICIAN_COST === undefined ||
        rowData.TECHNICIAN_COST === ''
      ) {
        commonErrorMessage = 'Please enter technician cost.';
        isValid = false;
        break;
      } else if (
        rowData.VENDOR_COST === null ||
        rowData.VENDOR_COST === undefined ||
        rowData.VENDOR_COST === ''
      ) {
        commonErrorMessage = 'Please enter vendor cost.';
        isValid = false;
        break;
      } else if (
        rowData.IS_EXPRESS &&
        this.data.IS_EXPRESS_SERVICE_AVAILABLE &&
        (rowData.EXPRESS_COST == null ||
          rowData.EXPRESS_COST == undefined ||
          rowData.EXPRESS_COST == '' ||
          rowData.EXPRESS_COST <= 0)
      ) {
        commonErrorMessage = 'Please enter express cost.';
        isValid = false;
        break;
      } else if (
        rowData.START_TIME == undefined ||
        rowData.START_TIME == null ||
        rowData.START_TIME == 0
      ) {
        commonErrorMessage = 'Please select start time.';
        isValid = false;
        break;
      } else if (
        rowData.END_TIME == undefined ||
        rowData.END_TIME == null ||
        rowData.END_TIME == 0
      ) {
        commonErrorMessage = 'Please select end time.';
        isValid = false;
        break;
      } else if (
        rowData.PREPARATION_HOURS === null ||
        rowData.PREPARATION_HOURS === undefined ||
        rowData.PREPARATION_HOURS === ''
      ) {
        commonErrorMessage = 'Please enter preparation hours.';
        isValid = false;
        break;
      } else if (
        rowData.PREPARATION_MINUTES === null ||
        rowData.PREPARATION_MINUTES === undefined ||
        rowData.PREPARATION_MINUTES === ''
      ) {
        commonErrorMessage = 'Please enter preparation minutes.';
        isValid = false;
        break;
      } else if (
        rowData.PREPARATION_HOURS !== null &&
        rowData.PREPARATION_HOURS !== undefined &&
        rowData.PREPARATION_HOURS !== '' &&
        rowData.PREPARATION_HOURS <= 0 &&
        rowData.PREPARATION_MINUTES !== null &&
        rowData.PREPARATION_MINUTES !== undefined &&
        rowData.PREPARATION_MINUTES !== '' &&
        rowData.PREPARATION_MINUTES <= 0
      ) {
        commonErrorMessage = 'Service preparation time must be greater than 0';
        isValid = false;
        break;
      }
    }

    // If validation fails, show error and return
    if (!isValid) {
      this.message.error(commonErrorMessage, '');
      return;
    }
    // const hasNullEndTime = this.dataListBulk.some(
    //   (item) => item.END_TIME === null
    // );

    // if (hasNullEndTime) {
    //   this.message.error('Please Select End Time.', '');
    //   return;
    // }
    // const hasNullStartTime = this.dataListBulk.some(
    //   (item) => item.START_TIME === null
    // );

    // if (hasNullStartTime) {
    //   this.message.error('Please Select Start Time.', '');
    //   return;
    // }

    const updatedDataList = this.dataListBulk.map((item) => {
      const formatedstarttime = this.formatTimeToHHmm(item.START_TIME);
      const formatedendtime = this.formatTimeToHHmm(item.END_TIME);
      const updatedItem = this.updatedRecords.find(
        (record) => record.ID === item.ID
      );

      return {
        ...item,
        ...updatedItem,
        PREPARATION_MINUTES: Number(item.PREPARATION_MINUTES),
        START_TIME: formatedstarttime,
        END_TIME: formatedendtime,
        ORG_ID: 1,
      };
    });

    this.isSpinning = true;

    this.api.BulkServiceUpdate(this.data.ID, updatedDataList).subscribe(
      (successCode: any) => {
        if (successCode.code === 200) {
          this.message.success('Services Updated Successfully', '');
          this.isSpinning = false;
          this.addmultiple(true);
        } else {
          this.message.error('Failed to update services', '');
          this.isSpinning = false;
        }
      },
      (err: HttpErrorResponse) => {
        this.isSpinning = false;
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
}