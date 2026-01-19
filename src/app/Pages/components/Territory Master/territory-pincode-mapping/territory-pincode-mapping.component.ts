import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { TerritoryMaster } from 'src/app/Pages/Models/TerritoryMaster';
import { ApiServiceService } from 'src/app/Service/api-service.service';
export class Data {
  PINCODE_ID: any = [];
  PINCODE: any = [];
  STATE_ID: number;
  STATE_NAME: string;
  CITY_ID: number;
  CITY_NAME: string;
  IS_ACTIVE: boolean = true;
}
@Component({
  selector: 'app-territory-pincode-mapping',
  templateUrl: './territory-pincode-mapping.component.html',
  styleUrls: ['./territory-pincode-mapping.component.css'],
})
export class TerritoryPincodeMappingComponent {
  @Input() data: any = TerritoryMaster;
  @Input() drawerClose: any = Function;
  @Input() drawerVisible: boolean = false;
  saveData: any = new Data();
  sortValue: string = 'desc';
  sortKey: string = 'STATE_NAME';
  pageIndex = 1;
  pageSize = 10;
  PincodeMappingdata: any[] = [];
  PincodeMappingdatass: any[] = [];
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
  filterQuery: any = {};
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private modal: NzModalService
  ) { }
  ngOnInit() {
    this.getStateData();
    this.allChecked = this.mappingdata.every((item) => item.IS_ACTIVE);
  }
  stateData: any = [];
  getStateData() {
    this.STATE_ID = null;
    this.DISTRICT_ID = null;
    this.cityData = [];
    this.stateData = [];
    this.PincodeMappingdata = [];
    this.isStateSpinning = true;
    this.api
      .getState(
        0,
        0,
        'NAME',
        'asc',
        ' AND IS_ACTIVE = 1 AND COUNTRY_ID=' + this.data.COUNTRY_ID
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.stateData = data['data'];
            this.isStateSpinning = false;
          } else {
            this.stateData = [];
            this.message.error('Failed To Get State Data', '');
            this.isStateSpinning = false;
          }
        },
        () => {
          this.message.error('Something Went Wrong', '');
          this.isStateSpinning = false;
        }
      );
  }
  DISTRICT_ID: any;
  STATE_ID: any;
  cityData: any = [];
  pincodeData: any = [];
  onStateChange(stateId: number): void {
    this.STATE_ID = stateId;
    this.searchText = '';
    this.DISTRICT_ID = null; 
    this.cityData = []; 
    this.PincodeMappingdata = []; 
    this.searchTags = [];
    if (stateId) {
      this.getCityData(stateId); 
    }
  }
  showMaxDist = false;
  previousDistrictIds: any[] = [];
  previousStateIds: any[] = [];
  searchPincode: string = '';
  datalist2: any[] = [];
  handleEnterPincodeKey(event: any): void {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === 'Enter') {
      keyboardEvent.preventDefault(); 
      if (this.searchPincode.trim().length >= 3) {
        this.SearchPincode(this.searchPincode);
      } else {
      }
    }
    if (keyboardEvent.key === 'Backspace') {
      setTimeout(() => {
        if (this.searchPincode.trim().length === 0) {
          this.mappingdata = this.originalTraineeData1;
          this.PincodeMapping111();
        }
      }, 0);
    }
  }
  SearchPincode(data: any) {
    this.isSpinning = true;
    if (data && data.trim().length >= 3) {
      const searchTerm = data.toLowerCase();
      this.mappingdata = this.originalTraineeData1.filter((record) => {
        return (
          (record.STATE_NAME &&
            record.STATE_NAME.toLowerCase().includes(searchTerm)) ||
          (record.DISTRICT_NAME &&
            record.DISTRICT_NAME.toLowerCase().includes(searchTerm)) ||
          (record.TALUKA && record.TALUKA.toLowerCase().includes(searchTerm)) ||
          (record.PINCODE && record.PINCODE.toString().includes(searchTerm))
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
  datalist1: any[] = [];
  originalTraineeData: any[] = [];
  originalTraineeData1: any[] = [];
  getCityData(stateId: number): void {
    if (!stateId) {
      return; 
    }
    this.isCitySpinning = true;
    this.api
      .getdistrict(
        0,
        0,
        'NAME',
        'asc',
        ` AND IS_ACTIVE=1 AND STATE_ID = ${stateId}`
      )
      .subscribe(
        (response) => {
          if (response['code'] === 200) {
            this.cityData = response['data'];
          } else {
            this.cityData = [];
            this.message.error('Failed to get city data.', '');
          }
          this.isCitySpinning = false;
        },
        (error) => {
          this.cityData = [];
          this.message.error(
            'Something went wrong while fetching city data.',
            ''
          );
          this.isCitySpinning = false;
        }
      );
  }
  get visibleTags() {
    return this.searchTags.slice(0, 7);
  }
  get hiddenTagCount() {
    return this.searchTags.length > 7 ? this.searchTags.length - 7 : 0;
  }
  handleEnterKey(event: any): void {
    const keyboardEvent = event as KeyboardEvent;
    const value = this.searchText.trim();
    if (keyboardEvent.key === 'Enter') {
      keyboardEvent.preventDefault();
      if (value.length === 0) {
        return;
      }
      if (this.searchTags.some(t => t.trim().toLowerCase() === value.toLowerCase())) {
        this.message.error("This is already in search", '');
        this.searchText = "";
        return;
      }
      const matches = this.originalTraineeData.filter(item =>
        (item?.OfficeName && item.OfficeName.toLowerCase().includes(value.toLowerCase())) ||
        (item?.TALUKA && item.TALUKA.toLowerCase().includes(value.toLowerCase())) ||
        (item?.PINCODE && item.PINCODE.toString().includes(value))
      );
      if (matches.length === 0) {
        this.searchText = "";
        return;
      }
      this.searchTags = [value, ...this.searchTags];
      this.SearchOffice();
      this.searchText = "";
      return;
    }
    if (keyboardEvent.key === 'Backspace') {
      setTimeout(() => {
        if (this.searchText.trim().length === 0 && this.searchTags.length === 0) {
          this.PincodeMappingdata = this.originalTraineeData.map((record) => ({
            ...record,
            selected: this.selectedPincodeSet.has(record.ID),
          }));
          this.PincodeMappingdata.sort((a, b) => Number(b.selected) - Number(a.selected));
          this.updateSelectionStates();
        }
      }, 0);
    }
  }
  pincodemappingdata() {
    this.isSpinning11 = true;
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    this.api
      .getTechnicianunMappedpincodesDataterritory(
        0,
        0,
        '',
        'asc',
        this.filterQuery,
        this.data.ID
      )
      .subscribe(
        (data) => {
          if (data['code'] === 200) {
            this.PincodeMappingdata = data['data'];
            this.originalTraineeData = [...this.PincodeMappingdata];
            this.updateSelectionStates();
          } else {
            this.PincodeMappingdata = [];
            this.selectedPincode = [];
            this.message.error('Failed To Get Pincode Mapping Data...', '');
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
  sort(params: NzTableQueryParams) {
    if (this.STATE_ID && this.DISTRICT_ID) {
      this.isSpinning11 = true;
      this.isSpinning = true;
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
      this.pincodemappingdata();
    }
  }
  close() {
    this.drawerClose();
  }
  Cancel() { }
  resetDrawer(teritorymaster: NgForm) {
    this.saveData.STATE_ID = null;
    this.saveData.CITY_ID = null;
    this.saveData.PINCODE_ID = [];
    teritorymaster.form.markAsPristine();
    teritorymaster.form.markAsUntouched();
  }
  add(technicianmaster: NgForm): void {
    if (
      (this.saveData.PINCODE_ID == 0 ||
        this.saveData.PINCODE_ID == undefined ||
        this.saveData.PINCODE_ID == null) &&
      (this.saveData.STATE_ID == 0 ||
        this.saveData.STATE_ID == undefined ||
        this.saveData.STATE_ID == null) &&
      (this.saveData.CITY_ID == 0 ||
        this.saveData.CITY_ID == undefined ||
        this.saveData.CITY_ID == null)
    ) {
      this.message.error('Please select State and Pincode.', '');
      return;
    } else if (
      this.saveData.STATE_ID == 0 ||
      this.saveData.STATE_ID == undefined ||
      this.saveData.STATE_ID == null
    ) {
      this.message.error('Please select State.', '');
      return;
    } else if (
      this.saveData.CITY_ID == 0 ||
      this.saveData.CITY_ID == undefined ||
      this.saveData.CITY_ID == null
    ) {
      this.message.error('Please select City.', '');
      return;
    } else if (
      this.saveData.PINCODE_ID == 0 ||
      this.saveData.PINCODE_ID == undefined ||
      this.saveData.PINCODE_ID == null
    ) {
      this.message.error('Please select Pincode.', '');
      return;
    } else {
      this.issaveSpinning = true;
      const selectedState = this.stateData.find(
        (state) => state.ID === this.saveData.STATE_ID
      )?.NAME;
      const selectedCity = this.cityData.find(
        (city) => city.ID === this.saveData.CITY_ID
      )?.NAME;
      const selectedPincodes = this.saveData.PINCODE_ID.map((pincodeId) => {
        const pincode = this.pincodeData.find((pin) => pin.ID === pincodeId);
        return {
          PINCODE: pincode?.PINCODE,
          PINCODE_ID: pincodeId,
        };
      });
      selectedPincodes.forEach((pincode) => {
        const entry = {
          STATE_NAME: selectedState,
          STATE_ID: this.saveData.STATE_ID,
          CITY_NAME: selectedCity,
          CITY_ID: this.saveData.CITY_ID,
          ...pincode,
          IS_ACTIVE: true, 
        };
        const exists = this.PincodeMappingdata.some(
          (item) =>
            item.STATE_ID === entry.STATE_ID &&
            item.CITY_ID === entry.CITY_ID &&
            item.PINCODE_ID === entry.PINCODE_ID
        );
        if (!exists) {
          this.PincodeMappingdata.push(entry);
        }
        this.PincodeMappingdata = [...[], ...this.PincodeMappingdata];
      });
      this.resetDrawer(technicianmaster);
      this.message.success("Pincode's added successfully.", '');
      this.issaveSpinning = false;
      this.pincodeData = [];
    }
  }
  isSelectAll: boolean = false;
  toggleSelectAll(isSelectAll: boolean): void {
    if (isSelectAll) {
      this.saveData.PINCODE_ID = this.pincodeData.map((pincode) => pincode.ID);
    } else {
      this.saveData.PINCODE_ID = [];
    }
  }
  apply_orginal() {
    if (
      this.STATE_ID == null ||
      this.STATE_ID == undefined ||
      this.STATE_ID == '' ||
      this.STATE_ID.length == 0
    ) {
      this.message.error('Please select State.', '');
      this.isSpinning = false;
      this.isSpinning11 = false;
      return;
    }
    if (
      this.DISTRICT_ID == null ||
      this.DISTRICT_ID == undefined ||
      this.DISTRICT_ID == '' ||
      this.DISTRICT_ID.length == 0
    ) {
      this.message.error('Please select District.', '');
      this.isSpinning = false;
      this.isSpinning11 = false;
      return;
    }
    if (
      this.STATE_ID &&
      (this.STATE_ID != null ||
        this.STATE_ID != undefined ||
        this.STATE_ID.length != 0 ||
        this.DISTRICT_ID ||
        this.DISTRICT_ID != null ||
        this.DISTRICT_ID != undefined ||
        this.DISTRICT_ID.length != 0)
    ) {
      this.isSpinning11 = true;
      this.filterQuery =
        ' AND DISTRICT IN (' +
        this.DISTRICT_ID +
        ')' +
        ' AND STATE IN (' +
        this.STATE_ID +
        ')';
      this.pincodemappingdata();
    }
  }
  clear(filter) {
    this.city = [];
    this.state = [];
    this.filterQuery = {};
    this.pincodemappingdata();
  }
  mapSelected() {
    this.isSpinning = true;
    const dataToSave = this.PincodeMappingdata.map((data) => ({
      PINCODE_ID: data.PINCODE_ID,
      IS_ACTIVE: data.IS_ACTIVE,
    }));
  }
  unmapSelected() { }
  allSelected1: any;
  selectedPincode111: any;
  selectedPincode11: any = [];
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
      .map((item) => item.PINCODE_ID);
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
  mappingdata: any = [];
  mappingdataMain: any = [];
  isSpinning22: boolean = false;
  isSpinning11: boolean = false;
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
      .getterritoryPincodeData11(
        0,
        0,
        this.sortKey,
        sort,
        " AND STATUS='M' AND TERRITORY_ID =" + this.data.ID
      )
      .subscribe(
        (data) => {
          if (data['code'] === 200) {
            this.mappingdata = data['data'];
            this.originalTraineeData1 = [...this.mappingdata];
            this.totoalrecordsss = this.mappingdata.length;
            this.selectedPincode11 = [];
            this.allChecked =
              this.mappingdata.length > 0 &&
              this.mappingdata.every((item) => item.IS_ACTIVE);
          } else {
            this.mappingdata = [];
            this.message.error('Failed To Get Pincode Mapping Data...', '');
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
  totoalrecordsss = 0;
  mapdatatopincode() {
    this.isSpinning = true;
    if (this.selectedPincode.length > 0) {
      this.api
        .addTechnicianPincodeMappingteroorty(
          this.data.ID,
          this.selectedPincode,
          'M'
        )
        .subscribe(
          (successCode) => {
            if (successCode['code'] === 200) {
              this.message.success(
                'Pincodes Successfully Mapped to the Territory.',
                ''
              );
              this.isSpinning = false;
              this.selectedPincode = [];
              this.selectedPincodeSet = new Set();
              this.PincodeMapping111();
              this.pincodemappingdata();
              this.allSelected1 = false;
              this.allSelected = false;
              this.tableIndeterminate = false;
            } else {
              this.message.error('Failed to Map Pincodes to the Territory', '');
            }
            this.isSpinning = false;
          },
          () => {
            this.isSpinning = false;
            this.message.error('Something Went Wrong.', '');
          }
        );
    } else {
      this.message.error('No Pincode selected for mapping.', '');
      this.isSpinning = false;
    }
  }
  onPincodeSelecttable11111(data: any, selected: boolean): void {
    const dataToSend = [
      {
        PINCODE_ID: data.PINCODE_ID,
        IS_ACTIVE: selected,
      },
    ];
    this.isSpinning = true;
    this.api.markasinactivedatatettory(this.data.ID, dataToSend).subscribe(
      (response) => {
        if (response.code === 200) {
          data.IS_ACTIVE = selected;
          this.allChecked = this.mappingdata.every((item) => item.IS_ACTIVE);
          const successMessage = selected
            ? 'Pincodes Successfully mapped to the Territory.'
            : 'Pincodes Successfully Unmapped to the Territory.';
          this.message.success(successMessage, '');
          this.isSpinning = false;
          this.selectedPincode11 = [];
          this.allSelected1 = false;
        } else if (response.code === 300) {
          data.IS_ACTIVE = false; 
          this.isSpinning = false;
          this.message.error(response.message, '');
        } else {
          this.isSpinning = false;
          this.message.error('Failed to Map Pincodes to the Territory', '');
        }
      },
      (error) => {
        this.isSpinning = false;
        this.message.error('Something Went Wrong.', '');
      }
    );
  }
  selectedPincodeSet: Set<number> = new Set();
  searchTags: string[] = [];
  SearchOffice(data?: string): void {
    this.isSpinning = true;
    const source = this.originalTraineeData || [];
    const hasData = typeof data === 'string' && data.trim().length >= 3;
    if (hasData) {
      const value = data.trim().toLowerCase();
      if (!this.searchTags.some(t => t.trim().toLowerCase() === value)) {
        this.searchTags = [data.trim(), ...this.searchTags,];
      }
      this.searchText = "";
    }
    const qTags = this.searchTags.map(t => t.toLowerCase());
    this.datalist1 = source.filter(record => {
      if (qTags.length === 0) return true;
      return qTags.some(tag =>
        (record.TALUKA && record.TALUKA.toLowerCase().includes(tag)) ||
        (record.OFFICE_NAME && record.OFFICE_NAME.toLowerCase().includes(tag)) ||
        (record.PINCODE && record.PINCODE.toString().includes(tag))
      );
    });
    this.PincodeMappingdata = this.datalist1.map(r => ({
      ...r,
      selected: this.selectedPincodeSet.has(r.ID),
    }));
    this.PincodeMappingdata.sort((a, b) => Number(b.selected) - Number(a.selected));
    this.isSpinning = false;
  }
  removeTag(index: number) {
    this.searchTags.splice(index, 1);
    this.SearchOffice('');
  }
  clearAllTags(): void {
    this.searchTags = [];
    this.SearchOffice('');
  }
  onPincodeSelecttable_original(data: any, selected: boolean): void {
    var selectedItem: any = {
      PINCODE_ID: data.ID,
      PINCODE: data.PINCODE,
      COUNTRY_NAME: data.COUNTRY_NAME,
      COUNTRY_ID: data.COUNTRY_ID,
      STATE: data.STATE,
      STATE_NAME: data.STATE_NAME,
      OFFICE_NAME: data.OFFICE_NAME,
      CIRCLE_NAME: data.CIRCLE_NAME,
      DIVISION_NAME: data.DIVISION_NAME,
      TALUKA: data.TALUKA,
      DISTRICT: data.DISTRICT,
      DISTRICT_NAME: data.DISTRICT_NAME,
      ID: data.ID,
    };
    if (selected) {
      this.selectedPincodeSet.add(data.ID);
      if (!this.selectedPincode.some(x => x.PINCODE_ID === data.ID)) {
        this.selectedPincode.push(selectedItem);
      }
    } else {
      this.selectedPincodeSet.delete(data.ID);
      this.selectedPincode = this.selectedPincode.filter(
        (element) => element.PINCODE_ID !== data.ID
      );
    }
    this.updateSelectionStates();
  }
  isLoading: boolean = false;
  loadingMessage: string = '';
  async toggleAll(selectAll: boolean): Promise<void> {
    this.isLoading = true;
    this.loadingMessage = selectAll
      ? 'Selecting all records. Please wait...'
      : 'Deselecting all records. Please wait...';
    const batchSize = 50;
    const totalRecords = this.PincodeMappingdata.length;
    const processBatch = async (startIndex: number) => {
      for (
        let i = startIndex;
        i < Math.min(startIndex + batchSize, totalRecords);
        i++
      ) {
        const item = this.PincodeMappingdata[i];
        if (selectAll) {
          const selectedItem: any = {
            PINCODE_ID: item.ID,
            PINCODE: item.PINCODE,
            COUNTRY_NAME: item.COUNTRY_NAME,
            COUNTRY_ID: item.COUNTRY_ID,
            STATE: item.STATE,
            STATE_NAME: item.STATE_NAME,
            OFFICE_NAME: item.OFFICE_NAME,
            CIRCLE_NAME: item.CIRCLE_NAME,
            DIVISION_NAME: item.DIVISION_NAME,
            TALUKA: item.TALUKA,
            DISTRICT: item.DISTRICT,
            DISTRICT_NAME: item.DISTRICT_NAME,
            ID: item.ID,
          };
          this.selectedPincodeSet.add(item.ID);
          this.selectedPincode.push(selectedItem);
          item.selected = true;
        } else {
          this.selectedPincodeSet.delete(item.ID);
          this.selectedPincode = [];
          item.selected = false;
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
    const visibleRecords = this.PincodeMappingdata; 
    const totalVisibleRecords = visibleRecords.length;
    if (!this.PincodeMappingdata) return;
    this.PincodeMappingdata = this.PincodeMappingdata.map(row => ({
      ...row,
      selected: this.selectedPincodeSet.has(row.ID)
    }));
    const totalSelectedVisibleRecords = visibleRecords.filter((record) =>
      this.selectedPincodeSet.has(record.ID)
    ).length;
    this.allSelected =
      totalSelectedVisibleRecords === totalVisibleRecords &&
      totalVisibleRecords > 0;
    this.tableIndeterminate =
      totalSelectedVisibleRecords > 0 &&
      totalSelectedVisibleRecords < totalVisibleRecords;
  }
  allChecked = false;
  allChange(selected: boolean): void {
    this.allChecked = selected; 
    this.isSpinning = true;
    const dataToSend = this.mappingdata.map((item) => ({
      PINCODE_ID: item.PINCODE_ID,
      IS_ACTIVE: selected,
    }));
    var dataid: any = '';
    this.api.markasinactivedatatettory(this.data.ID, dataToSend).subscribe(
      (response) => {
        if (response.code === 200) {
          this.mappingdata.forEach((item) => {
            item.IS_ACTIVE = selected;
          });
          const message = selected
            ? 'All Pincodes Successfully Mapped to the Territory.'
            : 'All Pincodes Successfully Unmapped from the Territory.';
          this.message.success(message, '');
        } else {
          this.message.error('Failed to Update Skills.', '');
        }
        this.isSpinning = false; 
      },
      (error) => {
        this.isSpinning = false; 
        this.message.error('Something Went Wrong.', '');
      }
    );
  }
  fetchMappingData(selected: boolean): void {
    this.isSpinning = true;
    this.api.markasinactivedatatettory(this.data.ID, []).subscribe(
      (response) => {
        this.mappingdata = response.data || [];
        this.mappingdataMain = [...this.mappingdata];
        this.mappingdata.forEach((item) => {
          item.IS_ACTIVE = false;
        });
        this.allChecked = false;
        this.isSpinning = false;
      },
      (error) => {
        this.isSpinning = false;
        this.message.error('Failed to Fetch Data.', '');
      }
    );
  }
  onPincodeSelecttable(data: any, selected: boolean): void {
    var selectedItem: any = {
      PINCODE_ID: data.ID,
      PINCODE: data.PINCODE,
      COUNTRY_NAME: data.COUNTRY_NAME,
      COUNTRY_ID: data.COUNTRY_ID,
      STATE: data.STATE,
      STATE_NAME: data.STATE_NAME,
      OFFICE_NAME: data.OFFICE_NAME,
      CIRCLE_NAME: data.CIRCLE_NAME,
      DIVISION_NAME: data.DIVISION_NAME,
      TALUKA: data.TALUKA,
      DISTRICT: data.DISTRICT,
      DISTRICT_NAME: data.DISTRICT_NAME,
      ID: data.ID,
    };
    if (selected) {
      this.selectedPincodeSet.add(data.ID);
      if (!this.selectedPincode.some(x => x.PINCODE_ID === data.ID)) {
        this.selectedPincode.push(selectedItem);
      }
    } else {
      this.selectedPincodeSet.delete(data.ID);
      this.selectedPincode = this.selectedPincode.filter(
        (element) => element.PINCODE_ID !== data.ID
      );
    }
    this.updateSelectionStates();
  }
  apply() {
    if (
      this.STATE_ID == null ||
      this.STATE_ID == undefined ||
      this.STATE_ID == '' ||
      this.STATE_ID.length == 0
    ) {
      this.message.error('Please select State.', '');
      this.isSpinning = false;
      this.isSpinning11 = false;
      return;
    }
    if (
      this.DISTRICT_ID == null ||
      this.DISTRICT_ID == undefined ||
      this.DISTRICT_ID == '' ||
      this.DISTRICT_ID.length == 0
    ) {
      this.message.error('Please select District.', '');
      this.isSpinning = false;
      this.isSpinning11 = false;
      return;
    }
    if (
      this.STATE_ID &&
      (this.STATE_ID != null ||
        this.STATE_ID != undefined ||
        this.STATE_ID.length != 0 ||
        this.DISTRICT_ID ||
        this.DISTRICT_ID != null ||
        this.DISTRICT_ID != undefined ||
        this.DISTRICT_ID.length != 0)
    ) {
      this.isSpinning11 = true;
      this.filterQuery =
        ' AND DISTRICT IN (' +
        this.DISTRICT_ID +
        ')' +
        ' AND STATE IN (' +
        this.STATE_ID +
        ')';
      this.pincodemappingdata();
    }
  }
  onDistChange(): void {
    const removedDistricts = this.previousDistrictIds.filter(
      d => !this.DISTRICT_ID.includes(d)
    );
    const stateChanged =
      JSON.stringify(this.previousStateIds) !== JSON.stringify(this.STATE_ID);
    if (stateChanged) {
      this.selectedPincode = [];
      this.selectedPincodeSet.clear();
    }
    else if (removedDistricts.length > 0) {
      this.selectedPincode = this.selectedPincode.filter(
        p => !removedDistricts.includes(p.DISTRICT)
      );
      this.selectedPincodeSet = new Set(
        this.selectedPincode.map(p => p.PINCODE_ID)
      );
    }
    this.previousDistrictIds = [...this.DISTRICT_ID];
    this.previousStateIds = this.STATE_ID;
    if (this.DISTRICT_ID.length == 3) {
      this.message.info('You have reached the maximum limit of 3 districts.', '');
    }
    this.PincodeMappingdata = [];
    this.searchTags = [];
    this.searchText = '';
    this.allSelected = false;
    this.tableIndeterminate = false;
  }
  restoreSelectionState(): void {
    if (this.PincodeMappingdata && this.PincodeMappingdata.length > 0) {
      this.PincodeMappingdata.forEach(item => {
        item.selected = this.selectedPincodeSet.has(item.ID);
      });
    }
  }
}