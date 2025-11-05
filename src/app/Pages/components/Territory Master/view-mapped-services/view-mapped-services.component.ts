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
  selector: 'app-view-mapped-services',
  templateUrl: './view-mapped-services.component.html',
  styleUrls: ['./view-mapped-services.component.css'],
  providers: [DatePipe],
})
export class ViewMappedServicesComponent implements OnInit {
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

  formTitle = 'Territory Wise Service Change Management';
  pageIndex = 1;
  pageSize = 10;
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
    ['B2B_PRICE', 'NAME'],
    ['CATEGORY_NAME', 'CATEGORY_NAME'],
    ['SUB_CATEGORY_NAME', 'SUB_CATEGORY_NAME'],
  ];

  columnsBulk: string[][] = [['S.NAME', 'S.NAME']];

  columns11: string[][] = [
    ['NAME', 'NAME'],
    ['B2B_PRICE', 'B2B_PRICE'],
    ['B2C_PRICE', 'B2C_PRICE'],
    ['EXPRESS_COST', 'EXPRESS_COST'],
    ['TECHNICIAN_COST', 'TECHNICIAN_COST'],
    ['VENDOR_COST', 'VENDOR_COST'],
    ['START_TIME', 'START_TIME'],
    ['END_TIME', 'END_TIME'],
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
  widthsSkill: string = '80%';

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
  close() {
    this.drawerCloset();
  }
  onCategoryChange(): void {
    this.searchTable();
  }
  onSubCategoryChange(): void {
    this.searchTable();
  }
  // Check if the column is visible
  isColumnVisible(key: any): boolean {
    const column = this.showcolumn.find((col) => col.key === key);
    return column ? column.visible : true;
  }

  keyup1(event: KeyboardEvent) {
    if (this.searchText.length >= 3 && event.key === 'Enter') {
      this.searchTable();
    } else if (this.searchText.length == 0 && event.key === 'Backspace') {
      this.datalistforTable = [];
      this.searchTable();
    }
  }
  ngOnInit() {
    this.getcategoryData();
    this.getsubcategoryData();
    this.searchTable();

    this.datalistforTable.START_TIME = this.datepipe.transform(
      this.datalistforTable.START_TIME,
      'hh:mm a'
    );

    const decryptedUserId = this.userId
      ? this.commonFunction.decryptdata(this.userId)
      : '0'; // Decrypt userId or use '0' as fallback
    this.USER_ID = Number(decryptedUserId);
    // this.loadFilters();
  }
  ServiceData: any = [];
  getcategoryData() {
    this.api.getCategoryData(0, 0, '', '', ' AND STATUS=1').subscribe(
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
  }

  ServiceData1: any = [];
  ServiceDataMulti: any = [];
  isSpinningMulti: boolean = false;
  mapTreeData(categories: any[]): any[] {
    return categories.map((category) => {
      return {
        key: category.key,
        title: category.title,
        disabled: !!category.disabled, // Convert 0/1 to boolean
        isLeaf: !!category.isLeaf, // Ensure isLeaf is a boolean
        children: category.children ? this.mapTreeData(category.children) : [],
      };
    });
  }

  reset(): void {
    this.searchText = '';
    this.servicecattext = '';
    this.servicecatdesctext = '';
    this.expresspriceB2B = '';
    this.technitianCost = '';
    this.vendorcost = '';

    this.priceB2C = '';
    this.priceB2B = '';
    this.Name = '';
    this.Description = '';
    this.vendorcost = '';
    this.vendorcost = '';
    this.vendorcost = '';

    this.searchTable();
  }
  getServiceHierarchyget() {
    this.isSpinningMulti = true;
    this.api.getMultiServiceHierarchy(this.data.ID).subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.isSpinningMulti = false;
          // this.ServiceDataMulti = data['data'][0]['categories'];
          // if (data['count'] > 0) {
          this.ServiceDataMulti = this.mapTreeData(
            data['data'][0]['categories']
          );
          // } else {
          //   this.ServiceDataMulti = [];
          // }
        } else {
          this.ServiceDataMulti = [];
          this.isSpinningMulti = false;
        }
      },
      () => {
        this.ServiceDataMulti = [];
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

  onKeypressEvent(keys: KeyboardEvent) {
    // const element = window.document.getElementById('button');
    // if (element != null) element.focus();

    if (this.searchText1.length >= 3 && keys.key === 'Enter') {
      this.searchTable(true);
    } else if (this.searchText1.length == 0 && keys.key == 'Backspace') {
      // this.dataList = []
      this.searchTable(true);
    }
  }

  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
    // this.search(true);
  }

  searchTableIcon() {
    if (this.searchText1.length >= 3) {
      this.searchTable();
    } else {
      this.message.info('Please enter alteast 3 characters to search', '');
    }
  }
  sort(params: NzTableQueryParams) {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'TERRITORY_ID';
    const sortOrder = (currentSort && currentSort.value) || 'desc';
    this.pageIndextable = pageIndex;
    this.pageSizetable = pageSize;

    if (this.pageSizetable != pageSize) {
      this.pageIndextable = 1;
      this.pageSizetable = pageSize;
    }

    if (this.sortKeytable != sortField) {
      this.pageIndextable = 1;
      this.pageSizetable = pageSize;
    }

    this.sortKeytable = sortField;
    this.sortValuetable = sortOrder;
    // if (currentSort != null && currentSort.value != undefined) {
    this.searchTable();
    // }
  }

  parentSerId: any;
  sername: any;

  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.searchTable(true);
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
      selectedColumn === 'IS_AVAILABLE'
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
    { label: 'Status', value: 'IS_AVAILABLE' },
  ];

  filterClass: string = 'filter-invisible';

  // showFilter = false;
  // toggleFilter() {
  //   this.showFilter = !this.showFilter;
  // }

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

  public visiblesave = false;

  QUERY_NAME: string = '';
  name1: any;
  name2: any;
  INSERT_NAMES: any[] = [];
  isModalVisible = false; // Controls modal visibility
  selectedQuery: string = ''; // Holds the query to display

  // toggleLiveDemo(query: string, name: string): void {
  //   this.selectedQuery = query;

  //   // Assign the query to display
  //   this.isModalVisible = true; // Show the modal
  // }

  // deleteItem(item: any) {
  //   this.INSERT_NAMES = this.INSERT_NAMES.filter((i) => i !== item);
  // }

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
  starttimeVisible = false;
  endtimeVisible = false;

  datalistforTable: any = [];
  loadtable: boolean = false;
  totalREcordTable: any = 0;
  pageIndextable: any = 1;
  pageSizetable: any = 10;
  sortValuetable: string = 'desc';
  sortKeytable: any = 'TERRITORY_ID';
  pageIndexBulk: any = 0;
  pageSizeBulk: any = 0;
  sortValueBulk: string = 'desc';
  sortKeyBulk: any = '';

  onServiceChange(): void {
    this.searchTable();
  }
  isnameFilterApplied: boolean = false;
  ispriceb2cFilterApplied: boolean = false;
  ispriceb2bFilterApplied: boolean = false;
  istachcostFilterApplied: boolean = false;
  isvendorcostFilterApplied: boolean = false;
  isexpresscostFilterApplied: boolean = false;
  isstarttimeFilterApplied: boolean = false;
  isendtimeFilterApplied: boolean = false;

  fromTime: any;
  toTime: any;
  startfromTime;
  starttoTime;

  onTimeFilterChange(): void {
    if (this.fromTime && this.toTime) {
      // Extract hours and minutes, ensure it's in 'HH:mm:ss' format
      const startHours = this.fromTime.getHours().toString().padStart(2, '0');
      const startMinutes = this.fromTime
        .getMinutes()
        .toString()
        .padStart(2, '0');
      const endHours = this.toTime.getHours().toString().padStart(2, '0');
      const endMinutes = this.toTime.getMinutes().toString().padStart(2, '0');

      // Concatenate in 'HH:mm:ss' format
      this.startfromTime = `${startHours}:${startMinutes}:00`;
      this.starttoTime = `${endHours}:${endMinutes}:00`;

      // Set the filter as applied
      this.isstarttimeFilterApplied = true;
    } else {
      // Clear the filter
      this.fromTime = null;
      this.toTime = null;
      this.startfromTime = null;
      this.starttoTime = null;
      this.isstarttimeFilterApplied = false;
    }

    // Now, call searchTable (filtering logic is handled inside searchTable)
    this.searchTable();
  }

  endfromTime: any;
  endtoTime: any;
  endfromTime1;
  endtoTime1;

  onendTimeFilterChange(): void {
    if (this.endfromTime && this.endtoTime) {
      // Extract hours and minutes, ensure it's in 'HH:mm:ss' format
      const startHours = this.endfromTime
        .getHours()
        .toString()
        .padStart(2, '0');
      const startMinutes = this.endfromTime
        .getMinutes()
        .toString()
        .padStart(2, '0');
      const endHours = this.endtoTime.getHours().toString().padStart(2, '0');
      const endMinutes = this.endtoTime
        .getMinutes()
        .toString()
        .padStart(2, '0');

      // Concatenate in 'HH:mm:ss' format
      this.endfromTime1 = `${startHours}:${startMinutes}:00`;
      this.endtoTime1 = `${endHours}:${endMinutes}:00`;

      // Set the filter as applied
      this.isendtimeFilterApplied = true;
    } else {
      // Clear the filter
      this.endfromTime = null;
      this.endtoTime = null;
      this.endfromTime1 = null;
      this.endtoTime1 = null;
      this.isendtimeFilterApplied = false;
    }

    // Now, call searchTable (filtering logic is handled inside searchTable)
    this.searchTable();
  }

  formatTime(time: string): string {
    // Ensure the time is valid and in the format HH:mm:ss or HH:mm
    if (time && /^[0-9]{2}:[0-9]{2}(:[0-9]{2})?$/.test(time)) {
      // Split the time into hours and minutes
      const [hours, minutes] = time.split(':').map(Number);

      // Convert 24-hour format to 12-hour format
      const period = hours >= 12 ? 'PM' : 'AM';
      const hour12 = hours % 12 || 12; // Convert 0 to 12 (midnight)

      // Return formatted time with a dot (.) separator
      return `${hour12}.${this.padZero(minutes)} ${period}`;
    }
    return '';
  }

  // Helper method to pad single-digit numbers with a leading zero
  padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  updateStartFromTime(value: any): void {
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
  }

  nameFilter() {
    if (this.Name.trim() === '') {
      this.searchText = '';
    } else if (this.Name.length >= 3) {
      this.searchTable();
    } else {
      // this.message.warning('Please enter at least 3 characters to filter.', '');
    }
  }
  onKeyup(event: KeyboardEvent, data: any): void {
    if (this.Name.length >= 3 && event.key === 'Enter' && data == 'a') {
      this.searchTable();
      this.isnameFilterApplied = true;
    } else if (
      this.Name.length == 0 &&
      event.key === 'Backspace' &&
      data == 'a'
    ) {
      this.searchTable();
      this.isnameFilterApplied = false;
    }
    if (this.Description.length >= 3 && event.key === 'Enter' && data == 'b') {
      this.searchTable();
    } else if (
      this.Description.length == 0 &&
      event.key === 'Backspace' &&
      data == 'b'
    ) {
      this.searchTable();
    }
    if (this.priceB2B.length > 1 && event.key === 'Enter' && data == 'c') {
      this.searchTable();
      this.ispriceb2bFilterApplied = true;
    } else if (
      this.priceB2B.length == 0 &&
      event.key === 'Backspace' &&
      data == 'c'
    ) {
      this.searchTable();
      this.ispriceb2bFilterApplied = false;
    }
    if (this.priceB2C.length > 1 && event.key === 'Enter' && data == 'd') {
      this.searchTable();
      this.ispriceb2cFilterApplied = true;
    } else if (
      this.priceB2C.length == 0 &&
      event.key === 'Backspace' &&
      data == 'd'
    ) {
      this.searchTable();
      this.ispriceb2cFilterApplied = false;
    }

    if (
      this.expresspriceB2B.length > 1 &&
      event.key === 'Enter' &&
      data == 'e'
    ) {
      this.searchTable();
      this.isexpresscostFilterApplied = true;
    } else if (
      this.expresspriceB2B.length == 0 &&
      event.key === 'Backspace' &&
      data == 'e'
    ) {
      this.searchTable();
      this.isexpresscostFilterApplied = false;
    }

    if (
      this.technitianCost.length > 1 &&
      event.key === 'Enter' &&
      data == 'f'
    ) {
      this.searchTable();
      this.istachcostFilterApplied = true;
    } else if (
      this.technitianCost.length == 0 &&
      event.key === 'Backspace' &&
      data == 'f'
    ) {
      this.searchTable();
      this.istachcostFilterApplied = false;
    }

    if (this.vendorcost.length > 1 && event.key === 'Enter' && data == 'g') {
      this.searchTable();
      this.isvendorcostFilterApplied = true;
    } else if (
      this.vendorcost.length == 0 &&
      event.key === 'Backspace' &&
      data == 'g'
    ) {
      this.searchTable();
      this.isvendorcostFilterApplied = false;
    }
  }

  searchTable(reset: boolean = false) {
    if (reset) {
      this.pageIndextable = 1;
      this.sortKeytable = 'TERRITORY_ID';
      this.sortValuetable = 'desc';
    }

    var sort: string;
    try {
      sort = this.sortValuetable.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    var likeQuery = '';
    let globalSearchQuery = '';

    // Global Search (using searchText)
    if (this.searchText1 !== '') {
      globalSearchQuery =
        ' AND (' +
        this.columns11
          .map((column) => {
            return `${column[0]} like '%${this.searchText1}%'`;
          })
          .join(' OR ') +
        ')';
    }

    // name Filter
    if (this.Name !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') + `NAME LIKE '%${this.Name.trim()}%'`;
    }
    // name Filter
    // if (this.Description !== '') {
    //   likeQuery += (likeQuery ? ' AND ' : '') + `DESCRIPTION LIKE '%${this.Description.trim()}%'`;
    // }
    // // service Filter
    // if (this.selectedServices.length > 0) {
    //   if (likeQuery !== '') {
    //     likeQuery += ' AND ';
    //   }
    //   likeQuery += `CATEGORY_ID IN (${this.selectedServices.join(',')})`; // Update with actual field name in the DB
    // }

    // if (this.selectedServicessub.length > 0) {
    //   if (likeQuery !== '') {
    //     likeQuery += ' AND ';
    //   }
    //   likeQuery += `SUB_CATEGORY_ID IN (${this.selectedServicessub.join(',')})`; // Update with actual field name in the DB
    // }

    // priceB2B Filter
    if (this.priceB2B !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `B2B_PRICE LIKE '%${this.priceB2B.trim()}%'`;
    }
    // priceB2C Filter
    if (this.priceB2C !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `B2C_PRICE LIKE '%${this.priceB2C.trim()}%'`;
    }
    // expresspriceB2B Filter
    if (this.expresspriceB2B !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `EXPRESS_COST LIKE '%${this.expresspriceB2B.trim()}%'`;
    }
    // technician Filter
    if (this.technitianCost !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `TECHNICIAN_COST LIKE '%${this.technitianCost.trim()}%'`;
    }
    // vendor cost Filter
    if (this.vendorcost !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `VENDOR_COST LIKE '%${this.vendorcost.trim()}%'`;
    }

    // time Filter
    // if (this.EstimatedTime !== '') {
    //   likeQuery += (likeQuery ? ' AND ' : '') + `S LIKE '%${this.EstimatedTime.trim()}%'`;
    // }
    // Status Filter
    if (this.statusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `IS_AVAILABLE = ${this.statusFilter}`;
    }

    // start time Range Filter
    if (this.startfromTime && this.starttoTime) {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `START_TIME BETWEEN '${this.startfromTime}' AND '${this.starttoTime}'`;
    }

    // end time Range Filter
    if (this.endfromTime1 && this.endtoTime1) {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `END_TIME BETWEEN '${this.endfromTime1}' AND '${this.endtoTime1}'`;
    }

    // Combine global search query and column-specific search query
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    this.loadtable = true;

    this.api
      .getServiceTerritoryDetailsget(
        this.pageIndextable,
        this.pageSizetable,
        this.sortKeytable,
        sort,
        likeQuery + ' AND TERRITORY_ID = ' + this.data.ID + this.filterQuery
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadtable = false;
            this.totalREcordTable = data['count'];
            this.datalistforTable = data['data'];
            this.TabId = data['TAB_ID'];
          } else if (data['code'] == 400) {
            this.totalREcordTable = 0;
            this.loadtable = false;
            this.datalistforTable = [];
            this.message.error('Invalid filter parameter', '');
          } else {
            this.totalREcordTable = 0;
            this.loadtable = false;
            this.datalistforTable = [];
            // this.message.error('Something Went Wrong ...', '');
          }
        },
        (err: HttpErrorResponse) => {
          this.totalREcordTable = 0;
          this.loadtable = false;
          this.datalistforTable = [];
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

  // new filter
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

  // openfilter() {
  //   this.drawerTitle = "View Mapped Services Filter";
  //   this.applyCondition = "";
  //   // this.filterFields[1]['options'] = this.countryData;

  //   this.drawerFilterVisible = true;
  // }
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

  whichbutton: any;
  filterloading: boolean = false;
  updateButton: any;
  updateBtn: any;
  filterData: any;

  openfilter() {
    this.drawerTitle = 'View Mapped Services Filter';
    this.applyCondition = '';
    // this.filterFields[1]['options'] = this.countryData;

    this.drawerFilterVisible = true;

    // Edit code 2

    this.filterData = {
      TAB_ID: this.TabId,
      USER_ID: this.commonFunction.decryptdata(this.userId || ''),
      CLIENT_ID: this.currentClientId,
      FILTER_NAME: '',
      FILTER_QUERY: '',
      FILTER_JSON: {},
    };

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

  drawerflterClose(): void {
    this.drawerFilterVisible = false;
  }

  get closefilterCallback() {
    return this.drawerflterClose.bind(this);
  }

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

  filterFields: any[] = [
    {
      key: 'NAME',
      label: 'Service Name',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Territory Name',
    },
    {
      key: 'B2B_PRICE',
      label: 'B2B Price',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter B2B Price',
    },
    {
      key: 'B2C_PRICE',
      label: 'B2C Price',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter B2C Price',
    },
    {
      key: 'EXPRESS_COST',
      label: 'Express Cost',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Express Cost',
    },
    {
      key: 'TECHNICIAN_COST',
      label: 'Technician Cost',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Technician Cost',
    },
    {
      key: 'VENDOR_COST',
      label: 'Vendor Cost',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Vendor Cost',
    },
    {
      key: 'START_TIME',
      label: 'Start Time',
      type: 'time',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: '>', display: 'Greater Than' },
        { value: '<', display: 'Less Than' },
        { value: '>=', display: 'Greater Than Equal To' },
        { value: '<=', display: 'Less Than Equal To' },
      ],
      placeholder: 'Enter Start Time',
    },
    {
      key: 'END_TIME',
      label: 'End Time',
      type: 'time',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: '>', display: 'Greater Than' },
        { value: '<', display: 'Less Than' },
        { value: '>=', display: 'Greater Than Equal To' },
        { value: '<=', display: 'Less Than Equal To' },
      ],
      placeholder: 'Enter End Time',
    },
    {
      key: 'IS_AVAILABLE',
      label: 'Is Available ?',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: '1', display: 'Active' },
        { value: '0', display: 'Inactive' },
      ],
      placeholder: 'Select Is Available ?',
    },
  ];

  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerflterClose();
  }

  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }

  oldFilter: any[] = [];

  // isModalVisible = false; // Controls modal visibility
  // selectedQuery: string = ''; // Holds the query to display

  handleCancel(): void {
    this.isModalVisible = false; // Close the modal
    this.selectedQuery = ''; // Clear the selected query
  }

  Clearfilter() {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = '';
    this.isfilterapply = false;
    this.filterQuery = '';
    sessionStorage.removeItem('ID');
    this.searchTable();
  }
  selectedFilter: string | null = null;

  applyfilter(item) {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = item.ID;
    sessionStorage.setItem('ID', item.ID);
    this.isfilterapply = true;
    this.filterQuery = ' AND (' + item.FILTER_QUERY + ')';
    this.searchTable(true);
  }
  userId = sessionStorage.getItem('userId'); // Retrieve userId from session storage
  USER_ID: number; // Declare USER_ID as a number
  savedFilters: any; // Define the type of savedFilters if possible
  currentClientId = 1; // Set the client ID
  //TabId: number; // Ensure TabId is defined and initialized
  TabId: number;

  toggleLiveDemo(item): void {
    this.selectedQuery = item.FILTER_QUERY;
    // Assign the query to display
    this.isModalVisible = true; // Show the modal
  }

  drawerfilterClose(buttontype, updateButton) {
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
    return this.drawerfilterClose.bind(this);
  }

  // filterloading: boolean = false;

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

  isDeleting: boolean = false;

  deleteItem(item: any): void {
    //

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
            this.searchTable(true);
            //
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

  // Edit Code 1
  EditQueryData = [];
  editButton: any;
  FILTER_NAME: any;
  editQuery(data: any) {
    //  this.filterFields[1]['options'] = this.countryData;
    this.filterGroups = JSON.parse(data.FILTER_JSON)[0];
    this.filterGroups2 = JSON.parse(data.FILTER_JSON)[1];
    this.FILTER_NAME = data.FILTER_NAME;
    //
    this.EditQueryData = data;
    this.filterData = data;
    this.editButton = 'Y';
    this.drawerTitle = 'Edit Filter';
    this.drawerFilterVisible = true;
  }
}