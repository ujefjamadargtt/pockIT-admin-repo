import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiServiceService } from 'src/app/Service/api-service.service';
export class Data {
  COUNTRY_ID: any;
  COUNTRY_NAME: any;
  TERITORY_ID: number | null;
  TERRITORY_NAME: any;
  IS_ACTIVE: boolean = true;
}
@Component({
  selector: 'app-warehouseterriorymapping',
  templateUrl: './warehouseterriorymapping.component.html',
  styleUrls: ['./warehouseterriorymapping.component.css'],
})
export class WarehouseterriorymappingComponent {
  COUNTRY_ID;
  isSpinning;
  countryData: any;
  territoryData: any;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'COUNTRY_NAME';
  isLoading = true;
  countryloading = false;
  territoryloading = false;
  btnLoading = false;
  loadingRecords = false;
  dataList: any = [];
  addData: any = new Data();
  mappedTerritoryIds: number[] = [];
  ngOnInit(): void {
    this.getCountryData();
  }
  @Input() data;
  @Input() drawerVisible: boolean = false;
  @Input() drawerClose: any = Function;
  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService,
    private modal: NzModalService
  ) { }
  getCountryData() {
    this.countryloading = true;
    this.api.getAllCountryMaster(0, 0, '', 'asc', '').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.countryData = data['data'];
          this.countryloading = false;
        } else {
          this.countryData = [];
          this.countryloading = false;
          this.message.error('Failed to get country data', '');
        }
      },
      (err: HttpErrorResponse) => {
        this.countryloading = false;
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
  changestatus(data, event) {
    if (!data.TERRITORY_STATUS) {
      this.message.info('Territory is inactive', '');
      setTimeout(() => {
        data['IS_ACTIVE'] = false;
      }, 100);
    } else {
    }
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
      .getwarehouseTerritoryMappedData(
        0,
        0,
        this.sortKey,
        sort,
        ' AND WAREHOUSE_ID =' + this.data.ID
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.dataList = data['data'];
            this.originalMappingData = [...this.dataList];
            this.originalMappingDataMain = [...this.dataList];
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
  getTeritoryByCountry(countryId: any) {
    if (!countryId) {
      this.addData.TERITORY_ID = null;
      this.territoryData = []; 
      return;
    }
    this.territoryloading = true;
    this.api
      .getTeritory(
        0,
        0,
        '',
        'asc',
        ' AND IS_ACTIVE =1 AND COUNTRY_ID = ' + countryId
      )
      .subscribe(
        (data) => {
          if (data['code'] === 200) {
            const fetchedTerritory = data['data'];
            this.mappedTerritoryIds = this.dataList.map(
              (item) => item.TERITORY_ID
            );
            this.territoryData = fetchedTerritory.filter(
              (territory) => !this.mappedTerritoryIds.includes(territory.ID)
            );
            this.territoryloading = false;
          } else {
            this.territoryData = [];
            this.territoryloading = false;
            this.message.error('Failed to get territory data...', '');
          }
        },
        (err: HttpErrorResponse) => {
          this.territoryloading = false;
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
      this.addData.COUNTRY_ID == 0 ||
      this.addData.COUNTRY_ID == undefined ||
      this.addData.COUNTRY_ID == null
    ) {
      this.message.error('Please select country.', '');
      return;
    } else if (
      this.addData.TERITORY_ID == 0 ||
      this.addData.TERITORY_ID == undefined ||
      this.addData.TERITORY_ID == null
    ) {
      this.message.error('Please select territory.', '');
      return;
    } else {
      this.btnLoading = true;
      const selectedTerritory = this.addData.TERITORY_ID.map((territoryId) => {
        const territory = this.territoryData.find(
          (ter) => ter.ID === territoryId
        );
        return {
          TERRITORY_NAME: territory?.NAME,
          TERITORY_ID: territoryId,
        };
      });
      const selectedCountry = this.countryData.find(
        (data) => data.ID === this.addData.COUNTRY_ID
      )?.NAME;
      selectedTerritory.forEach((territory) => {
        const entry = {
          COUNTRY_NAME: selectedCountry,
          COUNTRY_ID: this.addData.COUNTRY_ID,
          ...territory,
          IS_ACTIVE: true, 
        };
        const exists = this.dataList.some(
          (item) =>
            item.COUNTRY_ID === entry.COUNTRY_ID &&
            item.TERITORY_ID === entry.TERITORY_ID
        );
        if (!exists) {
          this.dataList.push(entry);
        }
        this.dataList = [...[], ...this.dataList];
        this.originalMappingDataMain = this.dataList;
      });
      this.addData.TERITORY_ID = null;
      this.addData.COUNTRY_ID = null;
      this.message.success('Territory added successfully.', '');
      this.btnLoading = false;
      this.territoryData = [];
      this.reset(TerritoryMappingForm);
    }
  }
  Cancel() { }
  reset(TerritoryMappingForm: any) {
    this.addData.COUNTRY_ID = null;
    this.addData.TERITORY_ID = [];
    TerritoryMappingForm.form.markAsPristine();
    TerritoryMappingForm.form.markAsUntouched();
  }
  save() {
    this.isSpinning = true;
    const dataToSave = this.dataList.map((data) => ({
      TERITORY_ID: data.TERITORY_ID,
      IS_ACTIVE: data.IS_ACTIVE,
    }));
    if (dataToSave.length >= 1) {
      this.api
        .mapwarehouseTerritoryMapping(
          this.data.ID,
          this.data.USER_ID,
          this.data.WAREHOUSE_MANAGER_NAME,
          1,
          dataToSave
        )
        .subscribe(
          (successCode) => {
            if (successCode['code'] === 200) {
              this.message.success(
                'Territory successfully mapped to the back office.',
                ''
              );
              this.isSpinning = false;
              this.drawerClose();
            } else {
              this.message.error('Failed to map task to the back office.', '');
            }
            this.isSpinning = false;
          },
          () => {
            this.isSpinning = false;
            this.message.error('Something went wrong.', '');
          }
        );
    } else {
      this.message.error('Map at least one record.', '');
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
  originalMappingDataMain: any = [];
  handleEnterKey(event: any): void {
    if (event.key === 'Enter') {
      this.isSpinning = true;
      event.preventDefault();
      if (this.searchmappeddata.trim().length >= 3) {
        this.dataList = this.originalMappingData.filter((record) => {
          const countryName = record.COUNTRY_NAME?.toLowerCase() || '';
          const territoryName = record.TERRITORY_NAME?.toLowerCase() || '';
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
          this.dataList = [...this.originalMappingDataMain];
        }
      }, 0);
      this.isSpinning = false;
    }
  }
  SearchMappingdata(data: string): void {
    if (data.trim().length >= 3) {
      this.isSpinning = true;
      this.dataList = this.originalMappingData.filter((record) => {
        const countryName = record.COUNTRY_NAME?.toLowerCase() || '';
        const territoryName = record.TERRITORY_NAME?.toLowerCase() || '';
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
}