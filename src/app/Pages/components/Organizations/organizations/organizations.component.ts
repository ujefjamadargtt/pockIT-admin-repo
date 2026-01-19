import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { OrganizationMaster } from '../../../Models/organization-master';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-organizations',
  templateUrl: './organizations.component.html',
  styleUrls: ['./organizations.component.css'],
})
export class OrganizationsComponent implements OnInit {
  formTitle = 'Manage Organizations';
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList: OrganizationMaster[] = [];
  filteredData: OrganizationMaster[] = [];
  loadingRecords = true;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: string = 'default';
  columns: string[][] = [
    ['NAME', 'Organization Name'],
    ['EMAIL_ID', 'Email'],
  ];
  isfilterapply: boolean = false;
  filterClass: string = 'filter-invisible';
  columns1: { label: string; value: string }[] = [
    { label: 'Orgnization', value: 'Orgnization' },
  ];
  time = new Date();
  features = [];
  visible = false;
  drawerVisible: boolean;
  drawerTitle: string;
  drawerData: OrganizationMaster = new OrganizationMaster();
  drawerVisible1: boolean;
  drawerTitle1: string;
  ROLES = [];
  isSpinning = false;
  searchTerms: { [key: string]: string } = {};
  isSearchVisible: { [key: string]: boolean } = {}; 
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private router: Router
  ) { }
  ngOnInit() {
    this.search();
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
  sort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id';
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
    this.search();
  }
  search(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'id';
      this.sortValue = 'desc';
    }
    if (this.searchText.length < 3 && this.searchText.length !== 0) {
      return;
    }
    this.loadingRecords = true;
    let sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    let likeQuery = '';
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
    if (this.nametext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') + `NAME LIKE '%${this.nametext.trim()}%'`;
    }
    if (this.emailtext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `EMAIL_ID LIKE '%${this.emailtext.trim()}%'`;
    }
    if (this.statusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `IS_ACTIVE = ${this.statusFilter}`;
    }
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    this.api
      .getAllOrganizationsNew(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery
      )
      .subscribe(
        (data) => {
          this.loadingRecords = false;
          this.totalRecords = data['body']['count'];
          this.dataList = data['body']['data'];
          this.filteredData = [...this.dataList];
        },
        (err) => {
          this.loadingRecords = false;
        }
      );
  }
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  add(): void {
    this.drawerTitle = 'Create New Organization';
    this.drawerData = new OrganizationMaster();
    this.drawerVisible = true;
  }
  edit(data: OrganizationMaster): void {
    this.drawerTitle = 'Update Organization Details';
    this.drawerData = Object.assign({}, data);
    if (
      this.drawerData.DAY_START_TIME != undefined &&
      this.drawerData.DAY_START_TIME != null &&
      this.drawerData.DAY_START_TIME != ''
    ) {
      const today = new Date();
      const timeParts = this.drawerData.DAY_START_TIME.split(':'); 
      if (timeParts.length > 1) {
        today.setHours(+timeParts[0], +timeParts[1], 0);
        this.drawerData.DAY_START_TIME = new Date(today);
      }
    }
    if (
      this.drawerData.DAY_END_TIME != undefined &&
      this.drawerData.DAY_END_TIME != null &&
      this.drawerData.DAY_END_TIME != ''
    ) {
      const today = new Date();
      const timeParts = this.drawerData.DAY_END_TIME.split(':'); 
      if (timeParts.length > 1) {
        today.setHours(+timeParts[0], +timeParts[1], 0);
        this.drawerData.DAY_END_TIME = new Date(today);
      }
    }
    this.drawerVisible = true;
  }
  close(): void {
    this.visible = false;
  }
  close1(accountMasterPage: NgForm) {
    this.drawerVisible1 = false;
    this.resetDrawer(accountMasterPage);
  }
  resetDrawer(accountMasterPage: NgForm) {
    accountMasterPage.form.reset();
  }
  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }
  drawerClose1(): void {
    this.drawerVisible1 = false;
  }
  onKeyupS(keys) {
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
  toggleSearchBox(column: string, event: MouseEvent): void {
    event.stopPropagation(); 
    this.isSearchVisible[column] = !this.isSearchVisible[column];
  }
  sortFn(columnKey: string) {
    return (a, b) => {
      return a[columnKey] > b[columnKey] ? 1 : -1;
    };
  }
  nametext: string = '';
  emailtext: string = '';
  statusFilter: string | undefined = undefined;
  showcloumnVisible: boolean = false;
  countryVisible: boolean = false;
  stateVisible: boolean = false;
  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];
  onSortClick(event: MouseEvent) {
    event.stopPropagation(); 
  }
  showcolumn = [
    { label: 'Organization Name', key: 'NAME', visible: true },
    { label: 'E-mail ID', key: 'EMAIL_ID', visible: true },
    { label: 'Status', key: 'IS_ACTIVE', visible: true },
  ];
  isColumnVisible(key: any): boolean {
    const column = this.showcolumn.find((col) => col.key === key);
    return column ? column.visible : true;
  }
  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }
  onStateChange(): void {
    this.search();
  }
  reset(): void {
    this.searchText = '';
    this.nametext = '';
    this.search();
  }
  reset1(): void {
    this.searchText = '';
    this.emailtext = '';
    this.search();
  }
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
  columns2: string[][] = [['AND'], ['OR']];
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
      let sort = ''; 
      let filterQuery = '';
      this.api
        .getAllCityMaster(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          newQuery
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
              this.isSpinner = false;
            }
          },
          (err) => {
            if (err['ok'] === false) this.message.error('Server Not Found', '');
          }
        );
      this.QUERY_NAME = '';
    }
  }
  applyFilter(i, j) {
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
      let sort: string;
      let filterQuery = '';
      try {
        sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
      } catch (error) {
        sort = '';
      }
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
        .getAllCityMaster(this.pageIndex, this.pageSize, this.sortKey, sort, FILDATA)
        .subscribe(
          (data) => {
            if (data['code'] === 200) {
              this.totalRecords = data['count'];
              this.dataList = data['data'];
              this.isSpinner = false;
              this.filterQuery = '';
            } else {
              this.dataList = [];
              this.isSpinner = false;
            }
          },
          (err) => {
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
    this.search();
  }
  public visiblesave = false;
  saveQuery() {
    this.visiblesave = !this.visiblesave;
  }
  QUERY_NAME: string = '';
  name1: any;
  name2: any;
  INSERT_NAMES: any[] = [];
  Insertname() {
    if (this.QUERY_NAME.trim()) {
      this.INSERT_NAMES.push({ query: this.showquery, name: this.QUERY_NAME });
      this.visiblesave = false;
      this.QUERY_NAME = ''; 
    } else {
    }
  }
  toggleLiveDemo(item: any, item1: any) {
    this.name1 = item;
    this.name2 = item1;
    this.visible = !this.visible;
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
  showMainFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    } else {
      this.filterClass = 'filter-visible';
    }
  }
  back() {
    this.router.navigate(['/masters/menu']);
  }
}
