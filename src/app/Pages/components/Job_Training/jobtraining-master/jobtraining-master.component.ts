import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { JobTraining } from 'src/app/Pages/Models/jobTraining';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';

@Component({
  selector: 'app-jobtraining-master',
  templateUrl: './jobtraining-master.component.html',
  styleUrls: ['./jobtraining-master.component.css'],
})
export class JobtrainingMasterComponent {
  formTitle = 'Manage Job Trainings';
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
    ['TITLE', 'Name'],
    ['LINK', 'Link'],
    ['DESCRIPTION', 'Name'],
    ['SERVICE_MASTER_NAME', 'Name'],
    ['CATEGORY_NAME', 'Name'],
    ['SUB_CATEGORY_NAME', 'Name'],

    // ["SEQ_NO", "Sequence Number"],
  ];
  time = new Date();
  features = [];
  visible1 = false;
  drawerVisible: boolean;
  drawerTitle: string;
  drawerData: JobTraining = new JobTraining();
  drawerVisible1: boolean;
  drawerTitle1: string;
  ROLES = [];
  isSpinning = false;
  showcolumn = [
    { label: 'Title ', key: 'TITLE', visible: true },
    { label: 'Description ', key: 'DESCRIPTION', visible: true },
    { label: 'Category ', key: 'CATEGORY_NAME', visible: true },
    { label: 'Sub Category ', key: 'SUB_CATEGORY_NAME', visible: true },
    { label: 'Service Name ', key: 'SERVICE_MASTER_NAME', visible: true },
    { label: 'Link ', key: 'LINK', visible: true },
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

  //New Advance Filter
  whichbutton: any;
  filterData: any;
  currentClientId = 1; // Set the client ID

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

  viewImage(imageURL: string): void {
    this.ViewImage = 1;
    this.GetImage(imageURL);
  }
  sanitizedLink: any = '';
  // GetImage(link: string) {
  //   let imagePath = this.api.retriveimgUrl + 'JobTrainingDocs/' + link;
  //   this.sanitizedLink =
  //     this.sanitizer.bypassSecurityTrustResourceUrl(imagePath);
  //   this.imageshow = this.sanitizedLink;

  //   // Display the modal only after setting the image URL
  //   this.ImageModalVisible = true;
  // }

  GetImage(link: string) {
    const filePath: any = this.api.retriveimgUrl + 'JobTrainingDocs/' + link;

    const isDocOrDocx: any = link.endsWith('.doc') || link.endsWith('.docx');

    let finalPath: any = isDocOrDocx
      ? `https://docs.google.com/gview?url=${encodeURIComponent(filePath)}&embedded=true`
      : filePath;

    this.sanitizedLink = this.sanitizer.bypassSecurityTrustResourceUrl(finalPath);
    this.imageshow = this.sanitizedLink;
    this.ImageModalVisible = true;
  }

  helpcategoryvisible: boolean;
  subcategoryvisible: boolean;
  serviceVisible: boolean;
  descriptionVisible: boolean;
  description = '';
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
  // visible = false;
  // columns1: { label: string; value: string }[] = [
  //   { label: "Category Name", value: "NAME" },
  //   // { label: 'Sequence No.', value: 'SEQ_NO' },
  //   { label: "Is New ?", value: "IS_NEW" },
  //   { label: "Status", value: "STATUS" },
  // ];
  isFilterApplied: boolean = false;
  isdescriptionFilterApplied: boolean = false;

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
    this.getServices();
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

  isTextOverflow = false;

  checkOverflow(element: HTMLElement, tooltip: any): void {
    this.isTextOverflow = element.scrollWidth > element.clientWidth;
    if (this.isTextOverflow) {
      tooltip.show();
    } else {
      tooltip.hide();
    }
  }

  ImageModalCancel() {
    this.ImageModalVisible = false;
  }

  // viewImage(imageURL: string): void {
  //   this.ViewImage = 1;
  //   this.GetImage(imageURL);
  // }
  // sanitizedLink: any = '';
  // GetImage(link: string) {
  //   let imagePath = this.api.retriveimgUrl + 'HelpDocument/' + link;
  //   this.sanitizedLink =
  //     this.sanitizer.bypassSecurityTrustResourceUrl(imagePath);
  //   this.imageshow = this.sanitizedLink;

  //   // Display the modal only after setting the image URL
  //   this.ImageModalVisible = true;
  // }
  back() {
    this.router.navigate(['/masters/menu']);
  }
  reset(): void {
    this.searchText = '';
    this.categoryName = '';
    this.description = '';
    this.search();
  }
  categoryList: any = [];
  subCategoryList: any = [];
  subCategoryList1: any = [];
  categoryList1: any = [];
  selectedCategories: any = [];
  selectedSubCategories: any = [];
  selectedServices: any = [];
  serviceList: any = [];
  serviceList1: any = [];
  getServices() {
    // var filter = '';
    // if (this.data.CATEGORY_ID && this.data.SUBCATEGORY_ID) {
    //   filter =
    //     ' AND CATEGORY_ID= ' +
    //     this.data.CATEGORY_ID +
    //     ' AND SUB_CATEGORY_ID=' +
    //     this.data.SUBCATEGORY_ID;
    // }
    this.api
      .getServiceItem(0, 0, '', 'desc', ' AND STATUS=1')
      .subscribe((data) => {
        if (data.code == 200) {
          this.serviceList = data['data'];
          data['data'].forEach((element) => {
            this.serviceList1.push({
              value: element.ID,
              display: element.NAME,
            });
          });
        } else {
          this.serviceList = [];
        }
      });
  }
  getCategory() {
    this.categoryList1 = [];
    this.api.getCategoryData(0, 0, 'SEQ_NO', 'asc', ' AND STATUS=1').subscribe(
      (categoryData) => {
        if (categoryData['code'] == 200) {
          this.categoryList = categoryData['data'];

          categoryData['data'].forEach((element) => {
            this.categoryList1.push({
              value: element.ID,
              display: element.NAME,
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
    this.api.getSubCategoryData(0, 0, 'SEQ_NO', 'asc', ' AND STATUS=1').subscribe(
      (categoryData) => {
        if (categoryData['code'] == 200) {
          this.subCategoryList = categoryData['data'];
          categoryData['data'].forEach((element) => {
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
        `TITLE LIKE '%${this.categoryName.trim()}%'`;
    }
    if (this.description !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `DESCRIPTION LIKE '%${this.description.trim()}%'`;
    }
    // SEQ_NO Filter
    // if (this.Seqtext !== "") {
    //   likeQuery +=
    //     (likeQuery ? " AND " : "") + `SEQ_NO LIKE '%${this.Seqtext.trim()}%'`;
    // }

    // // IS_NEW Filter
    // if (this.isnewFilter) {
    //   if (likeQuery !== "") {
    //     likeQuery += " AND ";
    //   }
    //   likeQuery += `IS_NEW = ${this.isnewFilter}`;
    // }
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
    }

    // subcategory Filter
    if (this.selectedSubCategories.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `SUBCATEGORY_ID IN (${this.selectedSubCategories.join(
        ','
      )})`; // Update with actual field name in the DB
    }

    if (this.selectedServices.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `SERVICE_ID IN (${this.selectedServices.join(',')})`; // Update with actual field name in the DB
    }
    // Combine global search query and column-specific search query
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');

    this.api
      .getJobTraining(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + this.filterQuery
      )
      .subscribe(
        (data) => {
          if (data['status'] == 200) {
            this.loadingRecords = false;
            this.TabId = data.body['TAB_ID'];
            this.totalRecords = data.body['count'];
            this.dataList = data.body['data'];
          } else if (data['status'] == 400) {
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
    this.drawerTitle = 'Create New Job Training';
    this.drawerData = new JobTraining();
    // this.api.getHelpDoc(1, 1, "SEQ_NO", "desc", "").subscribe(
    //   (data) => {
    //     if (data["code"] == 200) {
    //       if (data["count"] == 0) {
    //         this.drawerData.SEQ_NO = 1;
    //       } else {
    //         this.drawerData.SEQ_NO = data["data"][0]["SEQ_NO"] + 1;
    //       }
    //     } else {
    //       this.message.error("Server Not Found", "");
    //     }
    //   },
    //   (err: HttpErrorResponse) => {
    //     this.loadingRecords = false;
    //     if (err.status === 0) {
    //       this.message.error(
    //         "Network error: Please check your internet connection.",
    //         ""
    //       );
    //     } else {
    //       this.message.error("Something Went Wrong.", "");
    //     }
    //   }
    // );
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
    if (this.description.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isdescriptionFilterApplied = true;
    } else if (this.description.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isdescriptionFilterApplied = false;
    }
    // if (this.Seqtext.length > 0 && event.key === 'Enter') {
    //   this.search();
    //   this.isSeqApplied = true;
    // } else if (this.Seqtext.length == 0 && event.key === 'Backspace') {
    //   this.search();
    //   this.isSeqApplied = false;
    // }
  }

  edit(data: JobTraining): void {
    this.drawerTitle = 'Update Job Training';
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
  updateButton: any;
  updateBtn: any;
  filterloading: boolean = false;

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

  openfilter() {
    this.drawerTitle = 'Job Training Filter';
    this.drawerFilterVisible = true;

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
    this.filterFields[1]['options'] = this.categoryList1;
    this.filterFields[2]['options'] = this.subCategoryList1;
    this.filterFields[3]['options'] = this.serviceList1;
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
    } else if (buttontype == 'SC') {
      this.loadFilters();
    }
  }

  get closefilterCallback() {
    return this.drawerflterClose.bind(this);
  }

  filterFields: any[] = [
    {
      key: 'TITLE',
      label: 'Title',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Title',
    },
    {
      key: 'CATEGORY_NAME',
      label: 'Category',
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
      placeholder: 'Select Category',
    },
    {
      key: 'SUB_CATEGORY_NAME',
      label: 'Sub Category',
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
      placeholder: 'Select Sub Category',
    },
    {
      key: 'SERVICE_NAME',
      label: 'Service',
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
      placeholder: 'Select Service',
    },
    {
      key: 'DESCRIPTION',
      label: 'Description',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Description',
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
    this.drawerflterClose('', '');
  }

  isDeleting: boolean = false;

  selectedFilter: string | null = null;
  // filterQuery = '';
  applyfilter(item) {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = item.ID;
    sessionStorage.setItem('ID', item.ID);
    this.isfilterapply = true;
    this.filterQuery = ' AND (' + item.FILTER_QUERY + ')';
    this.search(true);
  }

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
  editQuery(data: any) {
    this.filterGroups = JSON.parse(data.FILTER_JSON);
    this.FILTER_NAME = data.FILTER_NAME;
    this.filterFields[1]['options'] = this.categoryList1;
    this.filterFields[2]['options'] = this.subCategoryList1;
    this.filterFields[3]['options'] = this.serviceList1;

    this.filterGroups = JSON.parse(data.FILTER_JSON)[0];
    this.filterGroups2 = JSON.parse(data.FILTER_JSON)[1];

    this.EditQueryData = data;
    this.filterData = data;
    this.editButton = 'Y';
    this.drawerTitle = 'Edit Filter';
    this.drawerFilterVisible = true;
  }
}
