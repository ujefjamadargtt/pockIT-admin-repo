import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { FaqresponsesComponent } from '../faqresponses/faqresponses.component';
import { Faq } from 'src/app/Support/Models/TicketingSystem';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
import { Router } from '@angular/router';
@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.css'],
})
export class FaqsComponent implements OnInit {
  formTitle = 'Manage FAQs';
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList: any = [];
  loadingRecords = true;
  sortValue: string = 'desc';
  sortKey: string = 'ID';
  searchText: string = '';
  filterQuery: any = '';
  isFilterApplied: any = 'default';
  columns: string[][] = [
    ['FAQ_HEAD_NAME', 'FAQ Head Name'],
    ['QUESTION', 'Question'],
    ['ANSWER', 'Answer'],
    ['POSITIVE_COUNT', 'Positive Count'],
    ['NEGATIVE_COUNT', 'Negative Count'],
    ['SEQ_NO', 'Sequence No'],
  ];
  filterGroups: any[] = [
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
  filterData: any;
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
  applicationId = Number(this.cookie.get('applicationId'));
  @ViewChild(FaqresponsesComponent, { static: false })
  faqResponse1: FaqresponsesComponent;
  drawerVisible: boolean;
  drawerTitle: string;
  drawerData: Faq = new Faq();
  drawerVisible1: boolean;
  drawerTitle1: string;
  drawerData1: Faq = new Faq();
  constructor(
    private api: ApiServiceService,
    private cookie: CookieService,
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
    if (this.sortKey != sortField) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
    }
    this.sortKey = sortField;
    this.sortValue = sortOrder;
    this.search();
  }
  onKeyup(event: KeyboardEvent): void {
    if (this.searchText.length >= 3 && event.key === 'Enter') {
      this.search(true);
    } else if (this.searchText.length == 0 && event.key === 'Backspace') {
      this.search(true);
    }
    if (this.FAQHeadNametext.length >= 3 && event.key === 'Enter') {
      this.search();
    } else if (this.FAQHeadNametext.length == 0 && event.key === 'Backspace') {
      this.search();
    }
    if (this.Questiontext.length >= 3 && event.key === 'Enter') {
      this.search();
    } else if (this.Questiontext.length == 0 && event.key === 'Backspace') {
      this.search();
    }
    if (this.Answertext.length >= 3 && event.key === 'Enter') {
      this.search();
    } else if (this.Answertext.length == 0 && event.key === 'Backspace') {
      this.search();
    }
    if (this.faqTypetext.length >= 3 && event.key === 'Enter') {
      this.search();
    } else if (this.faqTypetext.length == 0 && event.key === 'Backspace') {
      this.search();
    }
    if (this.PositiveCounttext.length >= 0 && event.key === 'Enter') {
      this.search();
    } else if (
      this.PositiveCounttext.length == 0 &&
      event.key === 'Backspace'
    ) {
      this.search();
    }
    if (this.NegativeCounttext.length >= 0 && event.key === 'Enter') {
      this.search();
    } else if (
      this.NegativeCounttext.length == 0 &&
      event.key === 'Backspace'
    ) {
      this.search();
    }
    if (this.SequenceNotext.length >= 0 && event.key === 'Enter') {
      this.search();
    } else if (this.SequenceNotext.length == 0 && event.key === 'Backspace') {
      this.search();
    }
  }
  onKeypressEvent(keys) {
    const element = window.document.getElementById('button');
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
  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];
  listOfFAQForFilter: any[] = [
    { text: 'Customer', value: "'C'" },
    { text: 'Technician', value: "'T'" },
  ];
  statusFilter: string | undefined = undefined;
  FAQForFilter: string | undefined = undefined;
  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }
  onFAQForFilterChange(selectedFAQFor: string) {
    this.FAQForFilter = selectedFAQFor;
    this.search(true);
  }
  back() {
    this.router.navigate(['/masters/menu']);
  }
  searchopen() {
    if (this.searchText.length >= 3) {
      this.search(true);
    } else {
      this.message.info('Please enter atleast 3 characters to search', '');
    }
  }
  showMainFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    } else {
      this.filterClass = 'filter-visible';
      this.loadFilters();
    }
  }
  search(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
    }
    this.loadingRecords = true;
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    var likeQuery = ' ';
    var likeQuery = '';
    var globalSearchQuery = '';
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
    if (this.FAQHeadNametext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `FAQ_HEAD_NAME LIKE '%${this.FAQHeadNametext.trim()}%'`;
      this.isFAQHeadNameFilterApplied = true;
    } else {
      this.isFAQHeadNameFilterApplied = false;
    }
    if (this.Questiontext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `QUESTION LIKE '%${this.Questiontext.trim()}%'`;
      this.isQuestionFilterApplied = true;
    } else {
      this.isQuestionFilterApplied = false;
    }
    if (this.Answertext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        ` ANSWER LIKE '%${this.Answertext.trim()}%'`;
      this.isAnswerFilterApplied = true;
    } else {
      this.isAnswerFilterApplied = false;
    }
    if (this.faqTypetext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        ` FAQ_TYPE LIKE '%${this.faqTypetext.trim()}%'`;
      this.isfaqTypeFilterApplied = true;
    } else {
      this.isfaqTypeFilterApplied = false;
    }
    if (this.PositiveCounttext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        ` POSITIVE_COUNT LIKE '%${this.PositiveCounttext.trim()}%'`;
      this.PositiveCountVisible = true;
    } else {
      this.PositiveCountVisible = false;
    }
    if (this.NegativeCounttext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        ` NEGATIVE_COUNT LIKE '%${this.NegativeCounttext.trim()}%'`;
      this.isNegativeCountFilterApplied = true;
    } else {
      this.isNegativeCountFilterApplied = false;
    }
    if (this.SequenceNotext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        ` SEQ_NO LIKE '%${this.SequenceNotext.trim()}%'`;
      this.isSequenceNoFilterApplied = true;
    } else {
      this.isSequenceNoFilterApplied = false;
    }
    if (this.statusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `STATUS = ${this.statusFilter}`;
    }
    if (this.FAQForFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `FAQ_TYPE = ${this.FAQForFilter}`;
    }
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    this.api
      .getAllFaqs(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + this.filterQuery
      )
      .subscribe(
        (data) => {
          this.loadingRecords = false;
          this.totalRecords = data.body['count'];
          this.dataList = data.body['data'];
          this.TabId = data.body['TAB_ID'];
          if (this.totalRecords == 0) {
            data.body['SEQ_NO'] = 1;
          } else {
            data.body['SEQ_NO'] =
              this.dataList[this.dataList.length - 1]['SEQ_NO'] + 1;
          }
        },
        (err) => { }
      );
  }
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  get closeCallback1() {
    return this.drawerClose1.bind(this);
  }
  add(): void {
    this.drawerTitle = 'Create New FAQ';
    this.drawerData = new Faq();
    this.drawerData.STATUS = true;
    this.drawerData.FAQ_HEAD_ID = null;
    this.drawerData.QUESTION = '';
    this.drawerData.ANSWER = '';
    this.drawerData.URL = '';
    this.drawerVisible = true;
    this.api.getAllFaqs(1, 1, 'SEQ_NO', 'desc', '').subscribe(
      (data) => {
        if (data['body']['count'] === 0) {
          this.drawerData.SEQ_NO = 1;
        } else {
          this.drawerData.SEQ_NO = data['body']['data'][0]['SEQ_NO'] + 1;
        }
      },
      (err) => { }
    );
    this.drawerVisible = true;
  }
  URL;
  edit(data: Faq): void {
    this.drawerTitle = 'Update FAQ';
    this.drawerData = Object.assign({}, data);
    this.URL = data.URL;
    this.drawerVisible = true;
    if (this.drawerData.URL != ' ' && this.drawerData.URL != null)
      this.drawerData.URL = this.drawerData.URL;
    else this.drawerData.URL = null;
  }
  ViewResponses(data: Faq) {
    this.drawerTitle1 = 'FAQ Responses';
    this.drawerData1 = Object.assign({}, data);
    this.drawerVisible1 = true;
    this.faqResponse1.applyfilter(data.ID);
  }
  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }
  drawerClose1(): void {
    this.search();
    this.drawerVisible1 = false;
  }
  reset(): void {
    this.searchText = '';
    this.FAQHeadNametext = '';
    this.Questiontext = '';
    this.Answertext = '';
    this.faqTypetext = '';
    this.PositiveCounttext = '';
    this.NegativeCounttext = '';
    this.SequenceNotext = '';
    this.search();
  }
  FAQHeadNameVisible: boolean = false;
  isFAQHeadNameFilterApplied = false;
  FAQHeadNametext: string = '';
  QuestionVisible: boolean = false;
  isQuestionFilterApplied = false;
  Questiontext: string = '';
  AnswerVisible: boolean = false;
  isAnswerFilterApplied = false;
  Answertext: string = '';
  tagsVisible: boolean = false;
  isTagsFilterApplied = false;
  Tagstext: string = '';
  PositiveCountVisible: boolean = false;
  isPositiveCountFilterApplied = false;
  PositiveCounttext: string = '';
  NegativeCountVisible: boolean = false;
  isNegativeCountFilterApplied = false;
  NegativeCounttext: string = '';
  SequenceNoVisible: boolean = false;
  isSequenceNoFilterApplied = false;
  SequenceNotext: string = '';
  faqTypeVisible: boolean = false;
  isfaqTypeFilterApplied = false;
  faqTypetext: string = '';
  public commonFunction = new CommonFunctionService();
  userId = sessionStorage.getItem('userId');
  decrepteduserIDString = this.userId
    ? this.commonFunction.decryptdata(this.userId)
    : '';
  USER_ID = parseInt(this.decrepteduserIDString, 10);
  savedFilters: any;
  currentClientId = 1;
  TabId: any;
  isfilterapply: boolean = false;
  drawerFilterVisible: boolean = false;
  selectedQuery: any;
  isModalVisible: any;
  filterClass: string = 'filter-invisible';
  filterloading: boolean = false;
  whichbutton: any;
  updateButton: any;
  updateBtn: any;
  loadFilters() {
    this.filterloading = true;
    this.api
      .getFilterData1(
        0,
        0,
        'id',
        'desc',
        ` AND TAB_ID = ${this.TabId} AND USER_ID = ${this.USER_ID}`
      ) 
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
  selectedFilter: string | null = null;
  Clearfilter() {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = '';
    this.isfilterapply = false;
    this.filterQuery = '';
    this.search();
    sessionStorage.removeItem('ID');
  }
  applyfilter(item) {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = item.ID;
    this.isfilterapply = true;
    this.filterQuery = ' AND (' + item.FILTER_QUERY + ')';
    this.search(true);
    sessionStorage.setItem('ID', item.ID);
  }
  toggleLiveDemo(item): void {
    this.selectedQuery = item.FILTER_QUERY;
    this.isModalVisible = true; 
  }
  applyCondition: any;
  openfilter() {
    this.drawerTitle = 'FAQ Filter';
    this.applyCondition = '';
    this.filterData = {
      TAB_ID: this.TabId,
      USER_ID: this.commonFunction.decryptdata(this.userId || ''),
      CLIENT_ID: this.currentClientId,
      FILTER_NAME: '',
      FILTER_QUERY: '',
      FILTER_JSON: {},
    };
    this.drawerFilterVisible = true;
    this.editButton = 'N';
    this.FILTER_NAME = '';
    this.EditQueryData = [];
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
  EditQueryData = [];
  editButton: any;
  FILTER_NAME: any;
  editQuery(data: any) {
    this.filterGroups = JSON.parse(data.FILTER_JSON)[0];
    this.filterGroups2 = JSON.parse(data.FILTER_JSON)[1];
    this.FILTER_NAME = data.FILTER_NAME;
    this.filterData = data;
    this.EditQueryData = data;
    this.editButton = 'Y';
    this.drawerTitle = 'Edit Filter';
    this.drawerFilterVisible = true;
  }
  oldFilter: any[] = [];
  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerflterClose('', '');
  }
  drawerflterClose(buttontype, updateButton) {
    this.drawerFilterVisible = false;
    this.loadFilters();
    this.whichbutton = buttontype;
    this.updateBtn = updateButton;
    if (buttontype == 'SA') {
      this.loadFilters();
    } else if (buttontype == 'SC') {
      this.loadFilters();
    }
  }
  get filtercloseCallback() {
    return this.drawerflterClose.bind(this);
  }
  filterFields: any[] = [
    {
      key: 'FAQ_HEAD_NAME',
      label: 'FAQ Head Name',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter FAQ Head Name',
    },
    {
      key: 'QUESTION',
      label: 'Question',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Question',
    },
    {
      key: 'ANSWER',
      label: 'Answer',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Answer',
    },
    {
      key: 'POSITIVE_COUNT',
      label: 'Positive Count',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Positive Count',
    },
    {
      key: 'NEGATIVE_COUNT',
      label: 'Negative Count',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Negative Count',
    },
    {
      key: 'STATUS',
      label: 'Status',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: '1', display: 'Active' },
        { value: '0', display: 'Inactive' },
      ],
      placeholder: 'Status',
    },
  ];
  handleCancel(): void {
    this.isModalVisible = false;
    this.selectedQuery = '';
  }
  get closefilterCallback() {
    return this.drawerflterClose.bind(this);
  }
}