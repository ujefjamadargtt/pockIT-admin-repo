import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { helpDocumentMaster } from 'src/app/Pages/Models/helipDocument';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
@Component({
  selector: 'app-selpdoclist',
  templateUrl: './selpdoclist.component.html',
  styleUrls: ['./selpdoclist.component.css'],
})
export class SelpdoclistComponent implements OnInit {
  formTitle = 'Manage Help Documents';
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList: any = [];
  loadingRecords = true;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  // filterQuery: string = "";

  columns: string[][] = [
    ['NAME', 'Name'],
    ['HELP_DOCUMENT_CATEGORY_NAME', 'Name'],
    ['HELP_DOCUMENT_SUB_CATEGORY_NAME', 'Name'],
    ['SEQ_NO', 'Sequence Number'],
  ];
  time = new Date();
  features = [];
  visible1 = false;
  drawerVisible: boolean;
  drawerTitle: string;
  drawerData: helpDocumentMaster = new helpDocumentMaster();
  drawerVisible1: boolean;
  drawerTitle1: string;
  ROLES = [];
  isSpinning = false;
  showcolumn = [
    { label: 'Category ', key: 'NAME', visible: true },
    { label: 'Sequence No. ', key: 'SEQ_NO', visible: true },
    { label: 'Is New ? ', key: 'IS_NEW', visible: true },
    { label: 'Status ', key: 'STATUS', visible: true },
  ];
  showcloumnVisible: boolean = false;
  categoryName: string = '';
  categoryvisible = false;
  statusFilter: string | undefined = undefined;
  isnewFilter: string | undefined = undefined;
  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];

  // Edit Code 3
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
  helpcategoryvisible: boolean;
  subcategoryvisible: boolean;

  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }
  listOfFilterisnew: any[] = [
    { text: 'Yes', value: '1' },
    { text: 'No', value: '0' },
  ];
  onISNEWFilterChange(selectedStatus: string) {
    this.isnewFilter = selectedStatus;
    this.search(true);
  }

  // isfilterapply: boolean = false;
  // filterClass: string = 'filter-invisible';
  // filterQuery: string = '';
  visible = false;
  columns1: { label: string; value: string }[] = [
    { label: 'Category Name', value: 'NAME' },
    // { label: 'Sequence No.', value: 'SEQ_NO' },
    { label: 'Is New ?', value: 'IS_NEW' },
    { label: 'Status', value: 'STATUS' },
  ];
  isFilterApplied: boolean = false;
  iscatFilterApplied: boolean = false;
  issubcatFilterApplied: boolean = false;
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) { }
  ngOnInit() {
    // this.search();
    // this.columns1 = [
    //   { label: 'Category Name', value: 'NAME' },
    //   // add more columns if needed
    // ];
    this.getCategory();
    this.getSubCategory();
  }

  ViewImage: any;
  ImageModalVisible: boolean = false;
  imageshow;

  onKeypressEvent(keys: KeyboardEvent) {
    const element = window.document.getElementById('button');
    // if (element != null) element.focus();
    if (this.searchText.length >= 3 && keys.key === 'Enter') {
      this.search(true);
    } else if (this.searchText.length == 0 && keys.key == 'Backspace') {
      // this.dataList = []
      this.search(true);
    }
  }

  searchopen() {
    if (this.searchText.length >= 3) {
      this.search(true);
    } else {
      this.message.info('Please enter atleast 3 characters to search', '');
    }
  }
  ImageModalCancel() {
    this.ImageModalVisible = false;
  }

  viewImage(imageURL: string): void {
    this.ViewImage = 1;
    this.GetImage(imageURL);
  }
  sanitizedLink: any = '';
  // GetImage(link: string) {
  //   let imagePath = this.api.retriveimgUrl + 'HelpDocument/' + link;
  //   this.sanitizedLink =
  //     this.sanitizer.bypassSecurityTrustResourceUrl(imagePath);
  //   this.imageshow = this.sanitizedLink;

  //   // Display the modal only after setting the image URL
  //   this.ImageModalVisible = true;
  // }
  GetImage(link: string) {
    const filePath: any = this.api.retriveimgUrl + 'HelpDocument/' + link;

    const isDocOrDocx: any = link.endsWith('.doc') || link.endsWith('.docx');

    let finalPath: any = isDocOrDocx
      ? `https://docs.google.com/gview?url=${encodeURIComponent(filePath)}&embedded=true`
      : filePath;

    this.sanitizedLink = this.sanitizer.bypassSecurityTrustResourceUrl(finalPath);
    this.imageshow = this.sanitizedLink;
    this.ImageModalVisible = true;
  }
  back() {
    this.router.navigate(['/masters/menu']);
  }
  reset(): void {
    this.searchText = '';
    this.categoryName = '';
    this.search();
  }
  categoryList: any = [];
  subCategoryList: any = [];
  subCategoryList1: any = [];
  categoryList1: any = [];
  selectedCategories: any = [];
  selectedSubCategories: any = [];
  getCategory() {
    this.categoryList1 = [];
    this.api
      .gethelpDocumentCategory(0, 0, '', 'desc', ' AND IS_ACTIVE=1')
      .subscribe(
        (categoryData) => {
          if (categoryData.status == 200) {
            this.categoryList = categoryData.body.data;

            categoryData.body.data.forEach((element) => {
              this.categoryList1.push({
                value: element.ID,
                display: element.HELP_CATEGORY_NAME,
              });
            });
          } else {
            this.categoryList1 = [];
            this.categoryList = [];
          }
        },
        (err) => { }
      );
  }
  getSubCategory() {
    this.api
      .gethelpDocumentsubCategory(0, 0, '', 'desc', ' AND STATUS=1')
      .subscribe(
        (categoryData) => {
          if (categoryData.status == 200) {
            this.subCategoryList = categoryData.body.data;
            categoryData.body.data.forEach((element) => {
              this.subCategoryList1.push({
                value: element.ID,
                display: element.NAME,
              });
            });
          } else {
            this.subCategoryList1 = [];
            this.subCategoryList = [];
          }
        },
        (err) => { }
      );
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
    if (this.searchText.length < 3 && this.searchText.length !== 0) {
      return;
    }
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
    var likeQuery = '';
    // if (this.searchText != "") {
    //     likeQuery = " AND";
    //   this.columns.forEach(column => {
    //     likeQuery += " " + column[0] + " like '%" + this.searchText + "%' OR";
    //   });

    //   likeQuery = likeQuery.substring(0, likeQuery.length - 2)
    // }
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
    this.loadingRecords = true;

    // category Filter
    if (this.categoryName !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `NAME LIKE '%${this.categoryName.trim()}%'`;
    }
    // SEQ_NO Filter
    if (this.Seqtext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') + `SEQ_NO LIKE '%${this.Seqtext.trim()}%'`;
    }

    // IS_NEW Filter
    if (this.isnewFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `IS_NEW = ${this.isnewFilter}`;
    }
    // Status Filter
    if (this.statusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `STATUS = ${this.statusFilter}`;
    }
    if (this.selectedCategories.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `CATEGORY_ID IN (${this.selectedCategories.join(',')})`; // Update with actual field name in the DB
      this.iscatFilterApplied = true;
    } else {
      this.iscatFilterApplied = false;
    }

    // subcategory Filter
    if (this.selectedSubCategories.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `SUBCATEGORY_ID IN (${this.selectedSubCategories.join(
        ','
      )})`; // Update with actual field name in the DB
      this.issubcatFilterApplied = true;
    } else {
      this.issubcatFilterApplied = false;
    }
    // Combine global search query and column-specific search query
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');

    this.api
      .getHelpDoc(
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
            this.TabId = data['TAB_ID'];
            this.totalRecords = data['count'];
            this.dataList = data['data'];
          } else if (data['code'] == 400) {
            this.loadingRecords = false;
            this.dataList = [];
            this.message.error('Invalid filter parameter', '');
          } else {
            this.loadingRecords = false;
            this.dataList = [];
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
          } else if (err['status'] == 400) {
            this.loadingRecords = false;
            this.message.error('Invalid filter parameter', '');
          } else {
            this.message.error('Something Went Wrong.', '');
          }
        }
      );
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  add(): void {
    this.drawerTitle = 'Add Help Document';
    this.drawerData = new helpDocumentMaster();
    this.api.getHelpDoc(1, 1, 'SEQ_NO', 'desc', '').subscribe(
      (data) => {
        if (data['code'] == 200) {
          if (data['count'] == 0) {
            this.drawerData.SEQ_NO = 1;
          } else {
            this.drawerData.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
          }
        } else {
          this.message.error('Server Not Found', '');
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
    this.drawerVisible = true;
  }
  Seqtext: string = '';
  Seqvisible = false;
  isSeqApplied = false;
  onKeyup(event: KeyboardEvent): void {
    if (this.categoryName.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isFilterApplied = true;
    } else if (this.categoryName.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isFilterApplied = false;
    }
    if (this.Seqtext.length > 0 && event.key === 'Enter') {
      this.search();
      this.isSeqApplied = true;
    } else if (this.Seqtext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isSeqApplied = false;
    }
  }

  edit(data: helpDocumentMaster): void {
    this.drawerTitle = 'Update Help Document';
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
  }

  navigateToMastersMenu(): void {
    this.router.navigate(['/masters/menu']);
  }

  close(): void {
    this.visible1 = false;
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
    // this.search(true);
  }

  isColumnVisible(key: any): boolean {
    const column = this.showcolumn.find((col) => col.key === key);
    return column ? column.visible : true;
  }

  viewLink(link: string): void {
    if (link) {
      window.open(link, '_blank'); // Opens the link in a new tab/window
    } else {
    }
  }

  // new  Main filter
  TabId: number;
  public commonFunction = new CommonFunctionService();
  userId = sessionStorage.getItem('userId');
  decrepteduserIDString = this.userId
    ? this.commonFunction.decryptdata(this.userId)
    : '';
  USER_ID = parseInt(this.decrepteduserIDString, 10);
  isfilterapply: boolean = false;
  drawerFilterVisible: boolean = false;
  filterQuery: string = '';
  filterClass: string = 'filter-invisible';
  savedFilters: any[] = [];

  showMainFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    } else {
      this.filterClass = 'filter-visible';
      this.loadFilters();
    }
  }

  filterloading: boolean = false;

  openfilter() {
    this.drawerTitle = 'Help Document Filter';
    this.drawerFilterVisible = true;

    // Edit code 2

    this.filterFields[1]['options'] = this.categoryList1;
    this.filterFields[2]['options'] = this.subCategoryList1;
    this.filterData = {
      TAB_ID: this.TabId,
      USER_ID: this.commonFunction.decryptdata(this.userId || ''),
      CLIENT_ID: this.currentClientId,
      FILTER_NAME: '',
      FILTER_QUERY: '',
      FILTER_JSON: {},
    };

    // Edit code 2

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

  Clearfilter() {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = '';
    this.isfilterapply = false;
    this.filterQuery = '';
    sessionStorage.removeItem('ID');
    this.search();
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

  applyfilter(item) {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = item.ID;
    sessionStorage.setItem('ID', item.ID);
    this.isfilterapply = true;
    this.filterQuery = ' AND (' + item.FILTER_QUERY + ')';
    this.search(true);
  }

  drawerfilterClose(buttontype, updateButton): void {
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

  get closefilterCallback() {
    return this.drawerfilterClose.bind(this);
  }

  filterFields: any[] = [
    {
      key: 'NAME',
      label: 'Document Name',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Document Name',
    },
    {
      key: 'HELP_DOCUMENT_CATEGORY_NAME',
      label: 'Select Help Category',
      type: 'search',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      options: [],
      placeholder: 'Select Help Category',
    },
    {
      key: 'HELP_DOCUMENT_SUB_CATEGORY_NAME',
      label: 'Select Help Sub Category',
      type: 'search',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      options: [],
      placeholder: 'Select Help Sub Category',
    },
    {
      key: 'SEQ_NO',
      label: 'Sequence No.',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Sequence Number',
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
      placeholder: 'Select Status',
    },
  ];

  oldFilter: any[] = [];

  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerfilterClose('', '');
  }

  selectedFilter: string | null = null;
  // filterQuery = '';

  isModalVisible = false;
  selectedQuery: string = '';

  toggleLiveDemo(query: any): void {
    this.selectedQuery = query.FILTER_QUERY;
    this.isModalVisible = true;
  }

  handleCancel(): void {
    this.isModalVisible = false;
    this.selectedQuery = '';
  }

  // Edit Code 1
  EditQueryData = [];
  editButton: any;
  FILTER_NAME: any;
  currentClientId = 1;

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
  editQuery(data: any) {
    this.filterFields[1]['options'] = this.categoryList1;
    this.filterFields[2]['options'] = this.subCategoryList1;

    this.filterGroups = JSON.parse(data.FILTER_JSON)[0];
    this.filterGroups2 = JSON.parse(data.FILTER_JSON)[1];

    this.FILTER_NAME = data.FILTER_NAME;
    this.filterData = data;
    this.EditQueryData = data;
    this.editButton = 'Y';
    this.drawerTitle = 'Edit Filter';
    this.drawerFilterVisible = true;
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
}