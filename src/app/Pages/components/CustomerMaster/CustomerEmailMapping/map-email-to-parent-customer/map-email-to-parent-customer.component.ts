import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { customer } from 'src/app/Pages/Models/customer';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';

export class Data {
  EMAIL_ID: any;
  PRICE_RANGE: number | null;
  IS_ACTIVE: boolean = true;
  ID?: number;
}

@Component({
  selector: 'app-map-email-to-parent-customer',
  templateUrl: './map-email-to-parent-customer.component.html',
  styleUrls: ['./map-email-to-parent-customer.component.css']
})
export class MapEmailToParentCustomerComponent {
  isSpinning;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'EMAIL_ID';
  public commonFunction = new CommonFunctionService();

  // Loading
  isLoading = true;
  countryloading = false;
  territoryloading = false;
  btnLoading = false;
  loadingRecords = false;

  dataList: any = [];
  addData: any = new Data();
  mappedTerritoryIds: number[] = [];

  ngOnInit(): void {
  }

  @Input() data;
  @Input() drawerVisible: boolean = false;
  @Input() drawerClose: any = Function;
  @Input() mainCustData: customer = new customer();

  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService,
    private modal: NzModalService
  ) { }
  changestatus(data, event) {
    data.IS_ACTIVE = data.IS_ACTIVE === 1 ? 0 : 1
    this.api
      .mapCustomerEmailsUpdate(data)
      .subscribe(
        (successCode) => {
          if (successCode['code'] === 200) {
            this.message.success(
              'Status changed successfully',
              ''
            );
            this.isSpinning = false;
          } else {
            this.message.error('Failed to change status', '');
          }
          this.isSpinning = false;
        },
        () => {
          this.isSpinning = false;
          this.message.error('Something went wrong.', '');
        }
      );
  }
  getMappedData() {
    this.loadingRecords = true;
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    this.api
      .getCustomerEmailMapping(
        0,
        0,
        this.sortKey,
        sort,
        ' AND CUSTOMER_ID =' + this.data.CUSTOMER_MASTER_ID
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.dataList = data['data'];
            this.originalMappingData = [...this.dataList];
            this.loadingRecords = false;
          } else {
            this.dataList = [];
            this.mappedTerritoryIds = [];
            this.loadingRecords = false;
            this.message.error('Failed To Get Mapping Data', '');
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

  add(TerritoryMappingForm: any): void {
    if (
      this.addData.EMAIL_ID == undefined ||
      this.addData.EMAIL_ID == null ||
      this.addData.EMAIL_ID == ''
    ) {

      this.message.error(' Please enter email ID', '');
      return;
    } else if (!this.commonFunction.emailpattern.test(this.addData.EMAIL_ID)) {

      this.message.error('Please enter a valid email ID.', '');
      return;
    } else if (
      this.addData.PRICE_RANGE == 0 ||
      this.addData.PRICE_RANGE == undefined ||
      this.addData.PRICE_RANGE == null
    ) {
      this.message.error('Please enter amount', '');
      return;
    } else {
      this.btnLoading = true;
      const entry = {
        EMAIL_ID: this.addData.EMAIL_ID,
        PRICE_RANGE: this.addData.PRICE_RANGE,
        IS_ACTIVE: 1,
        ID: this.addData?.ID
      };

      const exists = this.dataList.some(
        (item) => item.EMAIL_ID === entry.EMAIL_ID
      );

      if (!exists) {
        this.dataList.push(entry);
        this.addData.PRICE_RANGE = null;
        this.addData.EMAIL_ID = null;
        this.btnLoading = false;
        this.reset(TerritoryMappingForm);
      } else {
        this.message.warning('This email ID is already mapped.', '');
      }
      this.dataList = [...[], ...this.dataList];
      this.btnLoading = false;
      // Reset the inputs

    }
  }

  Cancel() { }

  reset(TerritoryMappingForm: any) {
    this.addData.EMAIL_ID = null;
    this.addData.PRICE_RANGE = null;
    this.addData.ID = null;
    this.originalEmailId = null;

    TerritoryMappingForm.form.markAsPristine();
    TerritoryMappingForm.form.markAsUntouched();
  }

  // Save Function
  save() {
    this.isSpinning = true;

    const dataToSave: any = {
      CUSTOMER_ID: this.data.CUSTOMER_MASTER_ID, // Replace with actual value
      CLIENT_ID: 1,     // Replace with actual value
      data: this.dataList.map(item => ({
        EMAIL_ID: item.EMAIL_ID,
        PRICE_RANGE: item.PRICE_RANGE,
        IS_ACTIVE: item.IS_ACTIVE ? 1 : 0,
        ID: item?.ID

      }))
    };
    // Call the API to save the task mapping data
    if (this.dataList.length >= 1) {
      this.api
        .mapCustomerEmails(dataToSave)
        .subscribe(
          (successCode) => {
            if (successCode['code'] === 200) {
              this.message.success(
                'Email IDs mapped to customer successfully',
                ''
              );
              this.isSpinning = false;
              this.drawerClose();
            } else {
              this.message.error('Failed to map email ID(s) to customer', '');
            }
            this.isSpinning = false;
          },
          () => {
            this.isSpinning = false;
            this.message.error('Something went wrong.', '');
          }
        );
    } else {
      this.message.error('Map at least one email ID.', '');
      this.isSpinning = false;
    }
  }

  close() {
    this.drawerClose();
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
    this.getMappedData();
  }

  originalMappingData: any[] = [];
  searchmappeddata;
  filtereddatalist1: any[] = [];

  handleEnterKey(event: any): void {
    if (event.key === 'Enter') {
      this.isSpinning = true;
      event.preventDefault();
      if (this.searchmappeddata.trim().length >= 3) {
        this.dataList = this.originalMappingData.filter((record) => {
          const countryName = record.EMAIL_ID?.toLowerCase() || '';
          const territoryName = record.PRICE_RANGE?.toLowerCase() || '';
          return (
            countryName.includes(this.searchmappeddata.toLowerCase()) ||
            territoryName.includes(this.searchmappeddata.toLowerCase())
          );
        });
        this.isSpinning = false;
      } else {
        this.isSpinning = false;
      }
    } else if (event.key === 'Backspace') {
      setTimeout(() => {
        if (this.searchmappeddata.trim().length === 0) {
          this.dataList = [...this.originalMappingData];
        }
      }, 0);
      this.isSpinning = false;
    }
  }

  SearchMappingdata(data: string): void {
    if (data.trim().length >= 3) {
      this.isSpinning = true;
      this.dataList = this.originalMappingData.filter((record) => {
        const countryName = record.EMAIL_ID?.toLowerCase() || '';
        const territoryName = record.PRICE_RANGE?.toLowerCase() || '';
        return (
          countryName.includes(data.toLowerCase()) ||
          territoryName.includes(data.toLowerCase())
        );
      });
      this.isSpinning = false;
    } else {
      this.isSpinning = false;
    }
  }

  isEditMode = false;
  editRow(selectedItem: any) {
    // this.addData.EMAIL_ID = selectedItem.EMAIL_ID;
    // this.addData.PRICE_RANGE = selectedItem.PRICE_RANGE;
    // this.isEditMode = true;

    this.originalEmailId = selectedItem.EMAIL_ID;
    this.addData = { ...selectedItem }; // Copy the selected row data to form
    this.isEditMode = true;
  }
  // updateData(TerritoryMappingForm: any): void {
  //   const email = this.addData.EMAIL_ID?.trim();
  //   const price = this.addData.PRICE_RANGE;

  //   console.log(TerritoryMappingForm, "TerritoryMappingForm")
  //   const index = this.dataList.findIndex(item => item.EMAIL_ID === email);

  //   if (index !== -1) {
  //     this.dataList[index].PRICE_RANGE = price;
  //     this.dataList[index].IS_ACTIVE = 1;
  //     this.isEditMode = false;
  //     this.reset(TerritoryMappingForm);
  //     this.dataList = [...this.dataList]; // Refresh table
  //   } else {
  //     this.message.warning('This email ID is already mapped.', '');
  //   }
  // }
  originalEmailId: any;
  updateData(TerritoryMappingForm: any): void {
    if (
      this.addData.EMAIL_ID == undefined ||
      this.addData.EMAIL_ID == null ||
      this.addData.EMAIL_ID == ''
    ) {

      this.message.error(' Please enter email ID', '');
      return;
    } else if (!this.commonFunction.emailpattern.test(this.addData.EMAIL_ID)) {

      this.message.error('Please enter a valid email ID.', '');
      return;
    } else if (
      this.addData.PRICE_RANGE == 0 ||
      this.addData.PRICE_RANGE == undefined ||
      this.addData.PRICE_RANGE == null
    ) {
      this.message.error('Please enter amount', '');
      return;
    } else {
      const updatedEmail = this.addData.EMAIL_ID?.trim();
      const updatedPrice = this.addData.PRICE_RANGE;
      const updatedStatus = this.addData.IS_ACTIVE;
      const updatedID = this.addData?.ID;


      const index = this.dataList.findIndex(item => item.EMAIL_ID === this.originalEmailId);

      if (index !== -1) {
        this.dataList[index].EMAIL_ID = updatedEmail;
        this.dataList[index].PRICE_RANGE = updatedPrice;
        this.dataList[index].IS_ACTIVE = updatedStatus;
        this.dataList[index].ID = updatedID;

        this.isEditMode = false;
        this.reset(TerritoryMappingForm);
        this.dataList = [...this.dataList]; // Refresh table
      } else {
        this.message.warning('Email Already Exists', '');
      }
    }
  }


}