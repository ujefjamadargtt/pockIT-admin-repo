import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { TechnicianMasterData } from 'src/app/Pages/Models/TechnicianMasterData';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
@Component({
  selector: 'app-technician-active-status-report',
  templateUrl: './technician-active-status-report.component.html',
  styleUrls: ['./technician-active-status-report.component.css'],
})
export class TechnicianActiveStatusReportComponent {
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private modal: NzModalService,
    private router: Router
  ) { }
  formTitle = 'Technician Activities';
  searchText: string = '';
  pageIndex = 1;
  mappedtechs: any = [];
  pageSize = 10;
  sortKey: string = 'NAME';
  sortValue: string = 'desc';
  loadingRecords = false;
  totalRecords = 1;
  Technician: any[] = [];
  roleID: any;
  roleIDs = sessionStorage.getItem('roleId');
  decreptedroleIDString = '';
  decreptedroleID = 0;
  columns: string[][] = [
    ['NAME', 'NAME'],
    ['TYPE', 'TYPE'],
    ['AADHAR_NUMBER', 'AADHAR_NUMBER'],
    ['EMAIL_ID', 'EMAIL_ID'],
    ['VEHICLE_NO', 'VEHICLE_NO'],
    ['BUISNESS_NAME', 'BUISNESS_NAME'],
    ['ADDRESS_LINE1', 'ADDRESS_LINE1'],
    ['COUNTRY_NAME', 'COUNTRY_NAME'],
    ['DISTRICT_NAME', 'DISTRICT_NAME'],
    ['NAME', 'NAME'],
    ['STATE_NAME', 'STATE_NAME'],
    ['NAME', 'NAME'],
    ['PINCODE', 'PINCODE'],
    ['VEHICLE_TYPE', 'VEHICLE_TYPE'],
    ['EXPERIENCE_LEVEL', 'EXPERIENCE_LEVEL'],
    ['MOBILE_NUMBER', 'MOBILE_NUMBER'],
  ];
  ReportingPersonVisible: boolean = false;
  dataList: any = [];
  visible = false;
  filterQuery: string = '';
  isfilterapply: boolean = false;
  filterClass: string = 'filter-invisible';
  columns1: { label: string; value: string }[] = [
    { label: 'Technician Name', value: 'NAME' },
    { label: 'Email', value: 'EMAIL_ID' },
    { label: 'Mobile No.', value: 'MOBILE_NUMBER' },
    { label: 'Aadhaar No.', value: 'AADHAR_NUMBER' },
    { label: 'Vehicle No.', value: 'VEHICLE_NO' },
    { label: 'Having own vehicle?', value: 'IS_OWN_VEHICLE' },
    { label: 'Vendor Name', value: 'VENDOR_ID' },
    { label: 'Country Name', value: 'COUNTRY_ID' },
    { label: 'State Name', value: 'STATE_ID' },
    { label: 'Pincode', value: 'PINCODE_ID' },
    { label: 'Gender', value: 'GENDER' },
    { label: 'Status', value: 'IS_ACTIVE' },
  ];
  decreptedbackofficeId = 0;
  customerMangeer: any;
  teritoryIds: any = [];
  backofficeId = sessionStorage.getItem('backofficeId');
  ngOnInit(): void {
    this.loadingRecords = false;
    this.roleID = this.commonFunction.decryptdata(
      sessionStorage.getItem('roleId') || ''
    );
    this.decreptedroleIDString = this.roleIDs
      ? this.commonFunction.decryptdata(this.roleIDs)
      : '';
    this.decreptedroleID = parseInt(this.decreptedroleIDString, 10);
    const decryptedUserId = this.userId
      ? this.commonFunction.decryptdata(this.userId)
      : '0';
    this.USER_ID = Number(decryptedUserId);
    var decreptedbackofficeId = this.backofficeId
      ? this.commonFunction.decryptdata(this.backofficeId)
      : '';
    this.decreptedbackofficeId = parseInt(decreptedbackofficeId, 10);
    this.customerMangeer = this.decreptedbackofficeId;
    this.teritoryIds = [];
    this.getCountyData();
    this.getStateData();
    this.getCityData();
    this.getPincodeData('PINCODE');
    this.getVendorData();
    this.getVendorData1();
    this.getDistrictData();
    if (
      this.decreptedbackofficeId != undefined &&
      this.decreptedbackofficeId != null &&
      this.decreptedbackofficeId != 0
    )
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
                this.teritoryIds.push(element.TERITORY_ID);
              });
            } else {
              this.teritoryIds = [];
            }
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
  onStateChange(): void {
    this.search();
  }
  search(reset: boolean = false) {
    if (this.searchText.length < 3 && this.searchText.length !== 0) {
      return;
    }
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
    this.loadingRecords = true;
    if (this.isownvehicleFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `IS_OWN_VEHICLE = ${this.isownvehicleFilter}`;
    }
    if (this.statusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `IS_ACTIVE = ${this.statusFilter}`;
    }
    if (this.typeFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `TYPE = '${this.typeFilter}'`;
    }
    if (this.genderFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `GENDER = '${this.genderFilter}'`;
    }
    if (this.selectedServices.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      const formattedValues = this.selectedServices
        .map((sep: string) => `'${sep}'`)
        .join(',');
      likeQuery += `EXPERIENCE_LEVEL IN (${formattedValues})`;
    }
    if (this.selectevehical.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      const formattedValues = this.selectevehical
        .map((sep: string) => `'${sep}'`)
        .join(',');
      likeQuery += `VEHICLE_TYPE IN (${formattedValues})`;
    }
    if (this.Techniciantext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `NAME LIKE '%${this.Techniciantext.trim()}%'`;
    }
    if (this.Emailtext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `EMAIL_ID LIKE '%${this.Emailtext.trim()}%'`;
    }
    if (this.Mobiletext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `MOBILE_NUMBER LIKE '%${this.Mobiletext.trim()}%'`;
    }
    if (this.Addresstext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `ADDRESS_LINE1
 LIKE '%${this.Addresstext.trim()}%'`;
    }
    if (this.Aadhaartext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `
AADHAR_NUMBER LIKE '%${this.Aadhaartext.trim()}%'`;
    }
    if (this.Vehicletext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `
VEHICLE_NO
 LIKE '%${this.Vehicletext.trim()}%'`;
    }
    if (this.Detailstext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `VEHICLE_DETAILS LIKE '%${this.Detailstext.trim()}%'`;
    }
    if (this.selectedPincode.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `PINCODE IN ('${this.selectedPincode.join("','")}')`;
    }
    if (this.selectedVendorName.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `VENDOR_ID IN (${this.selectedVendorName.join(',')})`;
    }
    if (this.selectedCountries.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `COUNTRY_NAME IN ('${this.selectedCountries.join("','")}')`;
    }
    if (this.selectedDistricties.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `DISTRICT_NAME IN ('${this.selectedDistricties.join(
        "','"
      )}')`;
    }
    if (this.selectedStates.length > 0) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `STATE_NAME IN ('${this.selectedStates.join("','")}')`;
    }
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    if (this.decreptedroleID === 7) {
      if (this.mappedtechs.length > 0) {
        this.api
          .getTechnicianData1(
            this.pageIndex,
            this.pageSize,
            this.sortKey,
            sort,
            likeQuery +
            this.filterQuery +
            ' AND ID IN(' +
            this.mappedtechs +
            ')'
          )
          .subscribe(
            (data) => {
              if (data['code'] == 200) {
                this.loadingRecords = false;
                this.totalRecords = data['count'];
                this.Technician = data['data'];
                this.TabId = data['TAB_ID'];
              } else if (data['code'] == 400) {
                this.loadingRecords = false;
                this.Technician = [];
                this.message.error('Invalid filter parameter', '');
              } else {
                this.loadingRecords = false;
                this.Technician = [];
                this.message.error('Something Went Wrong ...', '');
              }
            },
            (err: HttpErrorResponse) => {
              this.loadingRecords = false;
              if (err.status === 0) {
                this.message.error(
                  'Unable to connect. Please check your internet or server connection and try again shortly.',
                  ''
                );
              } else if (err['status'] == 400) {
                this.loadingRecords = false;
                this.isSpinning = false;
                this.message.error('Invalid filter parameter', '');
              } else {
                this.message.error('Something Went Wrong.', '');
              }
            }
          );
      } else {
        this.loadingRecords = false;
        this.Technician = [];
        this.isSpinning = false;
        this.mappedtechs = [];
      }
    } else {
      this.api
        .getTechnicianData1(
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
              this.Technician = data['data'];
              this.TabId = data['TAB_ID'];
            } else if (data['code'] == 400) {
              this.loadingRecords = false;
              this.Technician = [];
              this.message.error('Invalid filter parameter', '');
            } else {
              this.loadingRecords = false;
              this.Technician = [];
              this.message.error('Something Went Wrong ...', '');
            }
          },
          (err: HttpErrorResponse) => {
            this.loadingRecords = false;
            if (err.status === 0) {
              this.message.error(
                'Unable to connect. Please check your internet or server connection and try again shortly.',
                ''
              );
            } else if (err['status'] == 400) {
              this.loadingRecords = false;
              this.isSpinning = false;
              this.message.error('Invalid filter parameter', '');
            } else {
              this.message.error('Something Went Wrong.', '');
            }
          }
        );
    }
  }
  VendorData1: any = [];
  getVendorData() {
    this.api
      .getVendorData(0, 0, '', 'asc', ' AND STATUS =1')
      .subscribe((data) => {
        if (data['code'] == '200') {
          if (data['count'] > 0) {
            data['data'].forEach((element) => {
              this.VendorData1.push({
                value: element.ID,
                display: element.NAME,
              });
            });
          }
        }
      });
  }
  venderdata: any = [];
  getVendorData1() {
    this.api.getVendorData(0, 0, '', '', ' AND STATUS = 1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.venderdata = data['data'];
        } else {
          this.venderdata = [];
          this.message.error('Failed To Get Vendor Data', '');
        }
      },
      () => {
      }
    );
  }
  sort(params: NzTableQueryParams) {
    this.loadingRecords = true;
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
    if (this.decreptedroleID === 7) {
      this.customerMangeer = this.decreptedbackofficeId;
      this.api
        .getAllCustomer(
          0,
          0,
          '',
          'desc',
          ' AND ACCOUNT_STATUS=1 AND CUSTOMER_MANAGER_ID=' +
          this.customerMangeer
        )
        .subscribe(
          (datas) => {
            if (datas['code'] == 200 && datas['count'] > 0) {
              var t: any = [];
              datas['data'].forEach((element) => {
                t.push(element.ID);
              });
              if (t.length > 0) {
                this.api
                  .getCustomerTechnicianmapdata(
                    0,
                    0,
                    this.sortKey,
                    '',
                    " AND STATUS='M' AND IS_ACTIVE=1 AND CUSTOMER_ID IN (" +
                    t +
                    ')'
                  )
                  .subscribe(
                    (datass) => {
                      if (datass['code'] === 200 && datass['count'] > 0) {
                        this.mappedtechs = [];
                        datass['data'].forEach((element) => {
                          this.mappedtechs.push(element.TECHNICIAN_ID);
                        });
                        this.search();
                      } else {
                        this.mappedtechs = [];
                        this.loadingRecords = false;
                        this.Technician = [];
                        this.isSpinning = false;
                      }
                    },
                    () => {
                      this.mappedtechs = [];
                      this.loadingRecords = false;
                      this.Technician = [];
                      this.isSpinning = false;
                    }
                  );
              } else {
                this.loadingRecords = false;
                this.mappedtechs = [];
                this.Technician = [];
                this.isSpinning = false;
              }
            } else {
              this.loadingRecords = false;
              this.mappedtechs = [];
              this.Technician = [];
              this.isSpinning = false;
            }
          },
          (err) => {
            this.loadingRecords = false;
            this.Technician = [];
            this.mappedtechs = [];
            this.isSpinning = false;
          }
        );
    } else {
      this.search();
    }
  }
  jobdetaildrawerTitle = '';
  jobdetailsshow = false;
  jobdetailsdata: any;
  invoicefilter = '';
  ratingfilter = '';
  openjobcarddetails(data: TechnicianMasterData) {
    this.jobdetailsdata = data;
    this.getTechniciansJobs(data);
    this.jobdetaildrawerTitle = `View details of ${data.NAME}`;
  }
  drawersize = '100%';
  jobdetailsdrawerClose(): void {
    this.jobdetailsshow = false;
  }
  get jobdetailscloseCallback() {
    return this.jobdetailsdrawerClose.bind(this);
  }
  jobdatss: any = [];
  jobcardids: any = [];
  jobId: any;
  getTechniciansJobs(data) {
    this.jobId = data.ID;
    this.jobdetailsshow = true;
  }
  ExperienceData = [
    { Id: 'F', Name: 'Fresher' },
    { Id: 'J', Name: 'Junior' },
    { Id: 'M', Name: 'Mid-Level' },
    { Id: 'S', Name: 'Senior' },
    { Id: 'L', Name: 'Lead' },
    { Id: 'E', Name: 'Expert' },
  ];
  Techniciantext: string = '';
  TechnicianVisible = false;
  Emailtext: string = '';
  EmailVisible = false;
  Mobiletext: string = '';
  MobileVisible = false;
  PANtext: string = '';
  PANVisible = false;
  GSTtext: string = '';
  GSTVisible = false;
  Addresstext: string = '';
  AddressVisible = false;
  AadharVisible = false;
  Aadhaartext: any = '';
  VehicleNoVisible = false;
  Vehicletext: any = '';
  DetailsVisible = false;
  Detailstext: any = '';
  CityVisible = false;
  Citytext: any = '';
  StateVisible = false;
  Statetext: any = '';
  PincodeVisible = false;
  Pincodetext: any = '';
  ExperienceVisible = false;
  CountryVisible = false;
  districtVisible = false;
  showcloumnVisible: boolean = false;
  VehicleVisible: boolean = false;
  selectevehical: string[] = [];
  selectedPincode: any[] = [];
  selectedCountries: any[] = [];
  selectedCities: any[] = [];
  selectedStates: any[] = [];
  selectedVendorName: number[] = [];
  selectedDistricties: any[] = [];
  back() {
    this.router.navigate(['/masters/menu']);
  }
  onKeyup(event: KeyboardEvent): void {
    if (this.Techniciantext.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isnameFilterApplied = true;
    } else if (this.Techniciantext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isnameFilterApplied = false;
    }
    if (this.Emailtext.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isemailFilterApplied = true;
    } else if (this.Emailtext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isemailFilterApplied = false;
    }
    if (this.Mobiletext.length > 0 && event.key === 'Enter') {
      this.search();
      this.ismobileFilterApplied = true;
    } else if (this.Mobiletext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.ismobileFilterApplied = false;
    }
    if (this.Addresstext.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isaddressFilterApplied = true;
    } else if (this.Addresstext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isaddressFilterApplied = false;
    }
    if (this.Aadhaartext.length > 0 && event.key === 'Enter') {
      this.search();
      this.isadharFilterApplied = true;
    } else if (this.Aadhaartext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isadharFilterApplied = false;
    }
    if (this.Vehicletext.length > 0 && event.key === 'Enter') {
      this.search();
      this.isvehiclenoFilterApplied = true;
    } else if (this.Vehicletext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isvehiclenoFilterApplied = false;
    }
  }
  reset(): void {
    this.searchText = '';
    this.Techniciantext = '';
    this.Emailtext = '';
    this.Mobiletext = '';
    this.search();
  }
  isnameFilterApplied: boolean = false;
  isemailFilterApplied: boolean = false;
  ismobileFilterApplied: boolean = false;
  isadharFilterApplied: boolean = false;
  isaddressFilterApplied: boolean = false;
  isvehiclenoFilterApplied: boolean = false;
  isvendornameFilterApplied: boolean = false;
  isexplevelFilterApplied: boolean = false;
  iscountryFilterApplied: boolean = false;
  isstateFilterApplied: boolean = false;
  isdistrictFilterApplied: boolean = false;
  iscityFilterApplied: boolean = false;
  ispincodeFilterApplied: boolean = false;
  isvehicletypeFilterApplied: boolean = false;
  nameFilter() {
    if (this.Techniciantext.trim() === '') {
      this.searchText = '';
    } else if (this.Techniciantext.length >= 3) {
      this.search();
    } else {
    }
  }
  emailFilter() {
    if (this.Emailtext.trim() === '') {
      this.searchText = '';
    } else if (this.Emailtext.length >= 3) {
      this.search();
    } else {
    }
  }
  mobileFilter() {
    if (this.Mobiletext.trim() === '') {
      this.searchText = '';
    } else if (this.Mobiletext.length >= 3) {
      this.search();
    } else {
    }
  }
  adharFilter() {
    if (this.Aadhaartext.trim() === '') {
      this.searchText = '';
    } else if (this.Aadhaartext.length >= 3) {
      this.search();
    } else {
    }
  }
  addressFilter() {
    if (this.Addresstext.trim() === '') {
      this.searchText = '';
    } else if (this.Addresstext.length >= 3) {
      this.search();
    } else {
    }
  }
  vehiclenoFilter() {
    if (this.Vehicletext.trim() === '') {
      this.searchText = '';
    } else if (this.Vehicletext.length >= 3) {
      this.search();
    } else {
    }
  }
  statusFilter: string | undefined = undefined;
  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }
  isownvehicleFilter: string | undefined = undefined;
  onisownvehicleFilterChange(selectedStatus: string) {
    this.isownvehicleFilter = selectedStatus;
    this.search(true);
  }
  onVehicalChange() {
    if (this.selectevehical?.length) {
      this.search();
      this.isvehicletypeFilterApplied = true;
    } else {
      this.search();
      this.isvehicletypeFilterApplied = false;
    }
  }
  onPincodeChange() {
    if (this.selectedPincode?.length) {
      this.search();
      this.ispincodeFilterApplied = true;
    } else {
      this.search();
      this.ispincodeFilterApplied = false;
    }
  }
  onCountryChange() {
    if (this.selectedCountries?.length) {
      this.search();
      this.iscountryFilterApplied = true;
    } else {
      this.search();
      this.iscountryFilterApplied = false;
    }
  }
  oncityChange() {
    if (this.selectedCities?.length) {
      this.search();
      this.iscityFilterApplied = true;
    } else {
      this.search();
      this.iscityFilterApplied = false;
    }
  }
  onStateChanged() {
    if (this.selectedStates?.length) {
      this.search();
      this.isstateFilterApplied = true;
    } else {
      this.search();
      this.isstateFilterApplied = false;
    }
  }
  onVendorNameChange() {
    if (this.selectedVendorName?.length) {
      this.search();
      this.isvendornameFilterApplied = true;
    } else {
      this.search();
      this.isvendornameFilterApplied = false;
    }
  }
  onDistrictChange() {
    if (this.selectedDistricties?.length) {
      this.search();
      this.isdistrictFilterApplied = true;
    } else {
      this.search();
      this.isdistrictFilterApplied = false;
    }
  }
  ReportingVisible = false;
  selectedServices: string[] = [];
  onServiceChange(): void {
    if (this.selectedServices?.length) {
      this.search();
      this.isexplevelFilterApplied = true;
    } else {
      this.search();
      this.isexplevelFilterApplied = false;
    }
  }
  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];
  typeFilter: string | undefined = undefined;
  listOfFilter1: any[] = [
    { text: 'On Payroll', value: 'O' },
    { text: 'Vendor Managed', value: 'V' },
    { text: 'Freelancer', value: 'F' },
  ];
  listOfFilter3: any[] = [
    { text: 'Yes', value: '1' },
    { text: 'No', value: '0' },
  ];
  VehicleData = [
    { ID: 'T', NAME: 'Two-Wheeler' },
    { ID: 'TR', NAME: 'Three-Wheeler' },
    { ID: 'F', NAME: 'Four-Wheeler' },
  ];
  typeV: string | undefined = undefined;
  onvFilterChange(selectedStatus: string) {
    this.typeV = selectedStatus;
    this.search(true);
  }
  ontypeFilterChange(selectedStatus: string) {
    this.typeFilter = selectedStatus;
    this.search(true);
  }
  genderFilter: string | undefined = undefined;
  listOfFilter2: any[] = [
    { text: 'Male', value: 'M' },
    { text: 'Female', value: 'F' },
  ];
  onGenderFilterChange1(selectedStatus: string) {
    this.genderFilter = selectedStatus;
    this.search(true);
  }
  distinctData: any = [];
  onFilterClick(columnKey: string): void {
    this.api.getDistinctData(114, columnKey).subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.distinctData = data['data'];
        } else {
          this.distinctData = [];
          this.message.error('Failed To Get Distinct data Data', '');
        }
      },
      () => {
      }
    );
  }
  countryData: any = [];
  getCountyData() {
    this.api
      .getAllCountryMaster(0, 0, 'SEQ_NO', 'asc', ' AND IS_ACTIVE = 1')
      .subscribe((data) => {
        if (data['code'] == '200') {
          if (data['count'] > 0) {
            data['data'].forEach((element) => {
              this.countryData.push({
                value: element.ID,
                display: element.NAME,
              });
            });
          }
        }
      });
  }
  StateData: any = [];
  getStateData() {
    this.api
      .getState(0, 0, 'SEQ_NO', 'asc', ' AND IS_ACTIVE = 1')
      .subscribe((data) => {
        if (data['code'] == '200') {
          if (data['count'] > 0) {
            data['data'].forEach((element) => {
              this.StateData.push({ value: element.ID, display: element.NAME });
            });
          }
        }
      });
  }
  districtData: any = [];
  getDistrictData() {
    this.api
      .getdistrict(0, 0, 'SEQ_NO', 'asc', ' AND IS_ACTIVE = 1')
      .subscribe((data) => {
        if (data['code'] == '200') {
          if (data['count'] > 0) {
            data['data'].forEach((element) => {
              this.districtData.push({
                value: element.ID,
                display: element.NAME,
              });
            });
          }
        }
      });
  }
  CityData: any = [];
  getCityData() {
    this.api
      .getAllCityMaster(0, 0, 'SEQ_NO', 'asc', ' AND IS_ACTIVE = 1')
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.CityData = data['data'];
          } else {
            this.CityData = [];
          }
        },
        () => {
        }
      );
  }
  PincodeData: any = [];
  getPincodeData(columnKey) {
    this.api.getDistinctData(114, columnKey).subscribe((data) => {
      if (data['code'] == '200') {
        if (data['count'] > 0) {
          data['data'].forEach((element) => {
            this.PincodeData.push({
              value: element.PINCODE,
              display: element.PINCODE,
            });
          });
        }
      }
    });
  }
  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  isSpinning = false;
  isOk = true;
  Disabled = true;
  selectedTab: number = 0;
  @Input() data: any = TechnicianMasterData;
  handleOk(addNew: boolean): void {
    this.isSpinning = false;
    this.isOk = true;
    if (this.isOk) {
      this.isSpinning = true;
      {
        this.data.AVIALABILITY_STATUS = 'A';
        this.api
          .updateTechnicianData(this.data)
          .subscribe((successCode: any) => {
            if (successCode.code == '200') {
              this.message.success('Technician Data Updated Successfully', '');
              this.isVisible = false;
            } else {
              this.message.error('Technician Data Updation Failed', '');
              this.isSpinning = false;
            }
          });
      }
    }
  }
  orderData: any;
  filterdrawerTitle!: string;
  drawerFilterVisible: boolean = false;
  applyCondition: any;
  drawerTitle = '';
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
  filterData: any;
  currentClientId = 1;
  openfilter() {
    this.drawerTitle = 'Technician Activities Filter';
    this.drawerFilterVisible = true;
    this.filterFields[5]['options'] = this.VendorData1;
    this.filterFields[9]['options'] = this.countryData;
    this.filterFields[10]['options'] = this.StateData;
    this.filterFields[11]['options'] = this.districtData;
    this.filterFields[12]['options'] = this.PincodeData;
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
    this.filterData = {
      TAB_ID: this.TabId,
      USER_ID: this.commonFunction.decryptdata(this.userId || ''),
      CLIENT_ID: this.currentClientId,
      FILTER_NAME: '',
      FILTER_QUERY: '',
      FILTER_JSON: {},
    };
  }
  whichbutton: any;
  filterloading: boolean = false;
  updateButton: any;
  updateBtn: any;
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
      label: 'Technician Name',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Name',
    },
    {
      key: 'EMAIL_ID',
      label: 'Email ID',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Email ID',
    },
    {
      key: 'MOBILE_NUMBER',
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
    {
      key: 'GENDER',
      label: 'Gender',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: 'M', display: 'Male' },
        { value: 'F', display: 'Female' },
      ],
      placeholder: 'Select Gender',
    },
    {
      key: 'AADHAR_NUMBER',
      label: 'Aadhar Number',
      type: 'text',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
        { value: 'Contains', display: 'Contains' },
        { value: 'Does Not Contains', display: 'Does Not Contains' },
        { value: 'Starts With', display: 'Starts With' },
        { value: 'Ends With', display: 'Ends With' },
      ],
      placeholder: 'Enter Aadhar Number',
    },
    {
      key: 'EXPERIENCE_LEVEL',
      label: 'Experience Level',
      type: 'select',
      comparators: [
        { value: '=', display: 'Equal To' },
        { value: '!=', display: 'Not Equal To' },
      ],
      options: [
        { value: 'F', display: 'Fresher' },
        { value: 'J', display: 'Junior' },
        { value: 'M', display: 'Mid-Level' },
        { value: 'S', display: 'Senior' },
        { value: 'L', display: 'Lead' },
        { value: 'E', display: 'Expert' },
      ],
      placeholder: 'Select Experience Level',
    },
    {
      key: 'IS_ACTIVE',
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
  EditQueryData = [];
  editButton: any;
  FILTER_NAME: any;
  editQuery(data: any) {
    this.filterGroups = JSON.parse(data.FILTER_JSON)[0];
    this.filterGroups2 = JSON.parse(data.FILTER_JSON)[1];
    this.filterFields[5]['options'] = this.VendorData1;
    this.filterFields[9]['options'] = this.countryData;
    this.filterFields[10]['options'] = this.StateData;
    this.filterFields[11]['options'] = this.districtData;
    this.filterFields[12]['options'] = this.PincodeData;
    this.FILTER_NAME = data.FILTER_NAME;
    this.filterData = data;
    this.EditQueryData = data;
    this.editButton = 'Y';
    this.drawerTitle = 'Edit Filter';
    this.drawerFilterVisible = true;
  }
  onFilterApplied(obj) {
    this.oldFilter.push({ query: obj.query, name: obj.name });
    this.drawerfilterClose('', '');
  }
  convertToQuery(filterGroups: any[]): string {
    const processGroup = (group: any): string => {
      const conditions = group.conditions.map((conditionObj) => {
        const { field, comparator, value } = conditionObj.condition;
        let processedValue = typeof value === 'string' ? `'${value}'` : value;
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
      const allClauses = [...conditions, ...nestedGroups];
      return `(${allClauses.join(` ${group.operator} `)})`;
    };
    return filterGroups.map(processGroup).join(' AND ');
  }
  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }
  oldFilter: any[] = [];
  isModalVisible = false;
  selectedQuery: string = '';
  handleCancel(): void {
    this.isModalVisible = false;
    this.selectedQuery = '';
  }
  handleOk1(): void {
    this.isSpinning = true;
    this.data.IS_ACTIVE = this.data.IS_ACTIVE === 1 ? 0 : 1;
    this.api.updateTechnicianData(this.data).subscribe(
      (response: any) => {
        this.isSpinning = false;
        if (response.code === 200) {
          const statusMessage =
            this.data.IS_ACTIVE === 1 ? 'online' : 'offline';
          this.message.success(`Technician is now ${statusMessage}`, '');
          this.isVisible = false;
          this.search();
        } else {
          this.message.error(`Failed to update technician status.`, '');
        }
      },
      () => {
        this.isSpinning = false;
        this.message.error(
          'An error occurred while updating technician status.',
          ''
        );
      }
    );
  }
  isVisible: boolean;
  modalTitle: string;
  showConfirm1(data: any): void {
    this.data = { ...data };
    this.modalTitle =
      data.IS_ACTIVE === 1 ? `Disable ${data.NAME}` : `Enable ${data.NAME}`;
    this.isVisible = true;
  }
  handleCancel1(): void {
    this.isVisible = false;
  }
  userId = sessionStorage.getItem('userId');
  USER_ID: number;
  savedFilters: any;
  TabId: number;
  public commonFunction = new CommonFunctionService();
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
  Clearfilter() {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = '';
    this.isfilterapply = false;
    this.filterQuery = '';
    sessionStorage.removeItem('ID');
    this.search();
  }
  selectedFilter: string | null = null;
  applyfilter(item) {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = item.ID;
    sessionStorage.setItem('ID', item.ID);
    this.isfilterapply = true;
    this.filterQuery = ' AND (' + item.FILTER_QUERY + ')';
    this.search(true);
  }
  toggleLiveDemo(item): void {
    this.selectedQuery = item.FILTER_QUERY;
    this.isModalVisible = true;
  }
  showMainFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    } else {
      this.filterClass = 'filter-visible';
      this.loadFilters();
    }
  }
  viewJobsWidth: string = '100%';
  viewJobsDrawerVisible = false;
  viewJobsdrawerTitle = '';
  viewjobsdata: any;
  technicianId: any;
  viewJobs(data: TechnicianMasterData) {
    if (this.teritoryIds.length > 0) {
      this.viewJobsDrawerVisible = true;
      this.viewjobsdata = data;
      this.getViewJobs(data);
      this.viewJobsdrawerTitle = `Jobs of ${data.NAME}`;
    } else {
      if (this.decreptedroleIDString == '8' || this.decreptedroleIDString == '1') {
        this.viewJobsDrawerVisible = true;
        this.viewjobsdata = data;
        this.getViewJobs(data);
        this.viewJobsdrawerTitle = `Jobs of ${data.NAME}`;
      } else {
        this.message.error(
          'No territory has been assigned to you. Please contact the Admin.',
          ''
        );
      }
    }
  }
  viewJobsdrawerClose(): void {
    this.viewJobsDrawerVisible = false;
  }
  get viewJobscloseCallback() {
    return this.viewJobsdrawerClose.bind(this);
  }
  getViewJobs(data) {
    this.technicianId = data.ID;
    this.viewJobsDrawerVisible = true;
  }
}
