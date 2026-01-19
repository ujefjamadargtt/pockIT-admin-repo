import { Component, Input } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiServiceService } from 'src/app/Service/api-service.service';
export class Data {
  TECHNICIAN_ID: any = [];
  TECHNICIAN_NAME: string;
  IS_ACTIVE: boolean = true;
}
@Component({
  selector: 'app-customer-technician-mapping',
  templateUrl: './customer-technician-mapping.component.html',
  styleUrls: ['./customer-technician-mapping.component.css'],
})
export class CustomerTechnicianMappingComponent {
  @Input() data;
  @Input() drawerClose: any = Function;
  @Input() drawerVisible: boolean = false;
  saveData: any = new Data();
  sortValue: string = 'desc';
  sortKey: string = 'NAME';
  pageIndex = 1;
  pageSize = 10;
  PincodeMappingdata: any[] = [];
  mappedPincodeIds: number[] = [];
  searchText: string = '';
  isSpinning = false;
  isStateSpinning = false;
  isPincodeSpinning = false;
  isCitySpinning = false;
  issaveSpinning = false;
  columns: string[][] = [['TRAINEE_NAME', 'TRAINEE_NAME']];
  allSelected = false;
  tableIndeterminate: boolean = false;
  tableIndeterminate11: boolean = false;
  selectedPincode: any[] = [];
  city: any[] = [];
  state: any[] = [];
  filterQuery: string = '';
  stateData: any = [];
  pincodeData: any = [];
  mappingdata: any = [];
  isSpinning22: boolean = false;
  isSpinning11: boolean = false;
  originalTraineeData1: any[] = [];
  originalTraineeData: any[] = [];
  allSelected1: any;
  selectedPincode111: any;
  isLoading: boolean = false;
  loadingMessage: string = '';
  selectedPincode11: any = [];
  totoalrecordsss = 0;
  searchskill;
  allChecked;
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private modal: NzModalService
  ) { }
  ngOnInit() {
    this.allChecked = this.mappingdata.every((item) => item.IS_ACTIVE);
  }
  sort(params: NzTableQueryParams) {
    this.isSpinning = true;
    this.isSpinning11 = true;
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
    this.PincodeMapping();
  }
  PincodeMapping() {
    this.isSpinning = true;
    this.isSpinning11 = true;
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    this.api
      .getMapTechnicianData11(0, 0, 'NAME', 'asc', '', this.data.CUSTOMER_MASTER_ID)
      .subscribe(
        (data) => {
          if (data['code'] === 200) {
            this.PincodeMappingdata = data['data'];
            this.originalTraineeData = [...this.PincodeMappingdata];
            this.selectedPincode = [];
          } else {
            this.PincodeMappingdata = [];
            this.selectedPincode = [];
            this.message.error('Failed To Get Technician Mapping Data...', '');
          }
          this.isSpinning = false;
          this.isSpinning11 = false;
        },
        () => {
          this.message.error('Something Went Wrong ...', '');
          this.isSpinning = false;
          this.isSpinning11 = false;
        }
      );
  }
  isSelectAll: boolean = false;
  toggleSelectAll(isSelectAll: boolean): void {
    if (isSelectAll) {
      this.saveData.TECHNICIAN_ID = this.pincodeData.map(
        (pincode) => pincode.ID
      );
    } else {
      this.saveData.TECHNICIAN_ID = [];
    }
  }
  async toggleAll(selectAll: boolean): Promise<void> {
    this.isLoading = true;
    this.loadingMessage = selectAll
      ? 'Selecting all records. Please wait...'
      : 'Deselecting all selected records. Please wait...';
    const batchSize = 50;
    const totalRecords = this.PincodeMappingdata.length;
    const processBatch = async (startIndex: number) => {
      for (
        let i = startIndex;
        i < Math.min(startIndex + batchSize, totalRecords);
        i++
      ) {
        const item = this.PincodeMappingdata[i];
        item.selected = selectAll;
        if (selectAll) {
          this.selectedPincodeSet.add(item.ID);
          if (
            !this.selectedPincode.some(
              (selected) => selected.TECHNICIAN_ID === item.ID
            )
          ) {
            this.selectedPincode.push({ TECHNICIAN_ID: item.ID, STATUS: 'M' });
          }
        } else {
          this.selectedPincodeSet.delete(item.ID);
          this.selectedPincode = this.selectedPincode.filter(
            (selected) => selected.TECHNICIAN_ID !== item.ID
          );
        }
      }
      if (startIndex + batchSize < totalRecords) {
        setTimeout(() => processBatch(startIndex + batchSize), 0);
      } else {
        this.updateSelectionStates(); 
        this.isLoading = false;
      }
    };
    processBatch(0);
  }
  updateSelectionStates(): void {
    const totalSelected = this.PincodeMappingdata.filter(
      (item) => item.selected
    ).length;
    this.allSelected = totalSelected === this.PincodeMappingdata.length;
    this.tableIndeterminate = totalSelected > 0 && !this.allSelected;
  }
  onPincodeSelecttable(data: any, selected: boolean): void {
    data.selected = selected;
    if (selected) {
      if (
        !this.selectedPincode.some((item) => item.TECHNICIAN_ID === data.ID)
      ) {
        this.selectedPincode.push({ TECHNICIAN_ID: data.ID, STATUS: 'M' });
        this.selectedPincodeSet.add(data.ID);
      }
    } else {
      this.selectedPincodeSet.delete(data.ID);
      this.selectedPincode = this.selectedPincode.filter(
        (item) => item.TECHNICIAN_ID !== data.ID
      );
    }
    this.updateSelectionStates();
  }
  getFormattedData() {
    return { data: this.selectedPincode };
  }
  onPincodeSelecttable11(data: any, selected: boolean): void {
    data.selected = selected;
    const totalRows = this.mappingdata.length;
    const selectedRows = this.mappingdata.filter(
      (item) => item.selected
    ).length;
    this.allSelected1 = selectedRows === totalRows && totalRows > 0;
    this.tableIndeterminate11 = selectedRows > 0 && selectedRows < totalRows;
    this.selectedPincode11 = this.mappingdata
      .filter((item) => item.selected)
      .map((item) => item.TECHNICIAN_ID);
  }
  sort11(params: NzTableQueryParams) {
    this.isSpinning = true;
    this.isSpinning22 = true;
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
    this.PincodeMapping111();
  }
  PincodeMapping111() {
    this.isSpinning = true;
    this.isSpinning22 = true;
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    this.api
      .getCustomerTechnicianmapdata(
        0,
        0,
        this.sortKey,
        sort,
        " AND STATUS='M' AND CUSTOMER_ID =" + this.data.CUSTOMER_MASTER_ID
      )
      .subscribe(
        (data) => {
          if (data['code'] === 200) {
            this.mappingdata = data['data'];
            this.totoalrecordsss = this.mappingdata.length;
            this.originalTraineeData1 = [...this.mappingdata];
            this.selectedPincode11 = [];
            this.allChecked =
              this.mappingdata.length > 0 &&
              this.mappingdata.every((item) => item.IS_ACTIVE);
          } else {
            this.mappingdata = [];
            this.message.error('Failed To Get Technician Mapping Data...', '');
          }
          this.isSpinning = false;
          this.isSpinning22 = false;
        },
        () => {
          this.message.error('Something Went Wrong ...', '');
          this.isSpinning = false;
          this.isSpinning22 = false;
        }
      );
  }
  mapdatatopincode() {
    this.isSpinning = true;
    this.api
      .addCustomerTechnicianMapping(this.data.CUSTOMER_MASTER_ID, this.selectedPincode, 'M', 1)
      .subscribe(
        (successCode) => {
          if (successCode['code'] === 200) {
            this.message.success(
              'Technicians Successfully Mapped to the Customer.',
              ''
            );
            this.isSpinning = false;
            this.selectedPincode = [];
            this.selectedPincode11 = [];
            this.selectedPincodeSet = new Set();
            this.PincodeMapping111();
            this.PincodeMapping();
            this.allSelected1 = false;
            this.allSelected = false;
            this.tableIndeterminate = false;
          } else {
            this.message.error('Failed to map technicians to the customer', '');
          }
          this.isSpinning = false;
        },
        () => {
          this.isSpinning = false;
          this.message.error('Something Went Wrong.', '');
        }
      );
  }
  unmapdatatopincode() {
    this.isSpinning = true;
    this.api
      .addCustomerTechnicianMapping(
        this.data.CUSTOMER_MASTER_ID,
        this.selectedPincode11,
        'U',
        0
      )
      .subscribe(
        (successCode) => {
          if (successCode['code'] === 200) {
            this.message.success(
              'Technician Successfully Unmapped to the Customer.',
              ''
            );
            this.isSpinning = false;
            this.selectedPincode = [];
            this.selectedPincode11 = [];
            this.PincodeMapping111();
            this.PincodeMapping();
            this.allSelected1 = false;
            this.allSelected = false;
          } else {
            this.message.error('Failed to Map Technician to the Customer', '');
          }
          this.isSpinning = false;
        },
        () => {
          this.isSpinning = false;
          this.message.error('Something Went Wrong.', '');
        }
      );
  }
  marasisactive() {
    const inactiveData = this.mappingdata
      .filter((item) => !item.IS_ACTIVE)
      .map((item) => item.ID);
    this.isSpinning = true;
    this.api.markasinactivedataTechnician(this.data.CUSTOMER_MASTER_ID, inactiveData).subscribe(
      (successCode) => {
        if (successCode['code'] === 200) {
          this.message.success(
            'Technician Successfully Unmapped to the Customer.',
            ''
          );
          this.isSpinning = false;
          this.selectedPincode11 = [];
          this.PincodeMapping111();
          this.allSelected1 = false;
        } else {
          this.message.error('Failed to Map Technician to the Customer', '');
        }
        this.isSpinning = false;
      },
      () => {
        this.isSpinning = false;
        this.message.error('Something Went Wrong.', '');
      }
    );
  }
  getstatussss() {
    const inactiveData = this.mappingdata
      .filter((item) => !item.IS_ACTIVE)
      .map((item) => item.TECHNICIAN_ID);
    return inactiveData.length == 0 ? false : true;
  }
  onPincodeSelecttable11111(data: any, selected: boolean): void {
    const dataToSend = [
      {
        TECHNICIAN_ID: data.TECHNICIAN_ID,
        IS_ACTIVE: selected,
      },
    ];
    this.isSpinning = true;
    this.api.markasinactivedataTechnician(this.data.CUSTOMER_MASTER_ID, dataToSend).subscribe(
      (response) => {
        if (response.code === 200) {
          if (!selected) {
            this.message.success(
              'Technicians Successfully Unmapped to the Customer.',
              ''
            );
          } else {
            this.message.success(
              'Technicians Successfully Mapped to the Customer.',
              ''
            );
          }
          data.IS_ACTIVE = selected;
          this.allChecked = this.mappingdata.every((item) => item.IS_ACTIVE);
        } else {
          this.message.error('Failed to Map Technician to the Customer.', '');
        }
        this.isSpinning = false; 
      },
      (error) => {
        this.isSpinning = false; 
        this.message.error('Something Went Wrong.', '');
      }
    );
  }
  datalist1: any[] = [];
  selectedPincodeSet: Set<number> = new Set();
  SearchPincode(data: string): void {
    this.isSpinning = true;
    if (data && data.trim().length >= 3) {
      this.datalist1 = this.PincodeMappingdata.filter((record) => {
        return (
          record.NAME && record.NAME.toLowerCase().includes(data.toLowerCase())
        );
      });
      this.PincodeMappingdata = this.datalist1.map((record) => ({
        ...record,
        selected: this.selectedPincodeSet.has(record.ID),
      }));
      this.PincodeMappingdata.sort((a, b) => b.selected - a.selected);
    } else if (data.trim().length === 0) {
      this.PincodeMappingdata = this.originalTraineeData.map((record) => ({
        ...record,
        selected: this.selectedPincodeSet.has(record.ID),
      }));
      this.PincodeMappingdata.sort((a, b) => b.selected - a.selected);
    }
    this.isSpinning = false;
  }
  mapsearchskill;
  SearchTechnician(data: any) {
    this.isSpinning = true;
    if (data && data.trim().length >= 3) {
      const searchTerm = data.toLowerCase();
      this.mappingdata = this.originalTraineeData1.filter((record) => {
        return (
          record.TECHNICIAN_NAME &&
          record.TECHNICIAN_NAME.toLowerCase().includes(searchTerm)
        );
      });
      this.isSpinning = false;
    } else if (data.trim().length === 0) {
      this.isSpinning = false;
      this.mappingdata = [...this.originalTraineeData1];
    } else {
      this.isSpinning = false;
    }
  }
  allChange(selected: boolean): void {
    this.allChecked = selected; 
    this.isSpinning = true;
    const dataToSend = this.mappingdata.map((item) => ({
      TECHNICIAN_ID: item.TECHNICIAN_ID,
      IS_ACTIVE: selected,
    }));
    this.api.markasinactivedataTechnician(this.data.CUSTOMER_MASTER_ID, dataToSend).subscribe(
      (response) => {
        if (response.code === 200) {
          this.mappingdata.forEach((item) => {
            item.IS_ACTIVE = selected;
          });
          const message = selected
            ? 'All Technicians Successfully Mapped to the Customer.'
            : 'All Technicians Successfully Unmapped from the Customer.';
          this.message.success(message, '');
        } else {
          this.message.error('Failed to Update Technician.', '');
        }
        this.isSpinning = false; 
      },
      (error) => {
        this.isSpinning = false; 
        this.message.error('Something Went Wrong.', '');
      }
    );
  }
  handleEnterKey(event: any): void {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === 'Enter') {
      keyboardEvent.preventDefault(); 
      if (this.searchskill.trim().length >= 3) {
        this.SearchPincode(this.searchskill);
      } else {
      }
    }
    if (keyboardEvent.key === 'Backspace') {
      setTimeout(() => {
        if (this.searchskill.trim().length === 0) {
          this.PincodeMappingdata = this.originalTraineeData.map((record) => ({
            ...record,
            selected: this.selectedPincodeSet.has(record.ID),
          }));
          this.updateSelectionStates();
          this.PincodeMappingdata.sort((a, b) => b.selected - a.selected);
        }
      }, 0);
    }
  }
  handlepincodeEnterKey(keys: any): void {
    const keyboardEvent = event as KeyboardEvent; 
    if (keyboardEvent.key === 'Enter') {
      keyboardEvent.preventDefault(); 
      if (this.mapsearchskill.trim().length >= 3) {
        this.SearchTechnician(this.mapsearchskill);
      } else {
      }
    }
    if (keyboardEvent.key === 'Backspace') {
      setTimeout(() => {
        if (this.mapsearchskill.trim().length === 0) {
          this.PincodeMapping111(); 
        }
      }, 0);
    }
  }
}
