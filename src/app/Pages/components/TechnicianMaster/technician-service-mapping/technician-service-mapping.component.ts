import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
export class Data {
  SERVICE_CATLOG_ID: any = [];
  ID: any = [];
  NAME: string;
  SERVICE_CATLOG_NAME: string;
  CHARGES_TYPE: string;
  CHARGES: DoubleRange;
  EFFECTIVE_DATE: Date;
  EXPIRY_DATE: Date;
  IS_ACTIVE: boolean = true;
}
@Component({
  selector: 'app-technician-service-mapping',
  templateUrl: './technician-service-mapping.component.html',
  styleUrls: ['./technician-service-mapping.component.css'],
})
export class TechnicianServiceMappingComponent {
  @Input() data: any;
  @Input() drawerClose: any = Function;
  @Input() drawerVisible: boolean = false;
  saveData: any = new Data();
  sortValue: string = 'desc';
  sortKey: string = 'STATE_NAME';
  pageIndex = 1;
  pageSize = 10;
  PincodeMappingdata: any[] = [];
  mappedPincodeIds: number[] = [];
  searchText: string = '';
  isSpinning = false;
  isCatelogSpinning = false;
  isPincodeSpinning = false;
  isServiceSpinning = false;
  issaveSpinning = false;
  columns: string[][] = [['TRAINEE_NAME', 'TRAINEE_NAME']];
  allSelected = false;
  tableIndeterminate: boolean = false;
  selectedPincode: any[] = [];
  Service: any[] = [];
  Catelog: any[] = [];
  filterQuery: string = '';
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private modal: NzModalService,
    private datePipe: DatePipe
  ) { }
  public commonFunction = new CommonFunctionService();
  ngOnInit() {
    this.getServiceCatelogData();
    this.getServiceforMapping();
  }
  CatalogData: any = [];
  getServiceCatelogData() {
    this.isCatelogSpinning = true;
    this.api.getServiceCatData(0, 0, '', 'asc', '').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.CatalogData = data['data'];
          this.isCatelogSpinning = false;
        } else {
          this.CatalogData = [];
          this.message.error('Failed To Get Catalog Data', '');
          this.isCatelogSpinning = false;
        }
      },
      () => {
        this.message.error('Something Went Wrong', '');
        this.isCatelogSpinning = false;
      }
    );
  }
  ServiceData: any = [];
  getServiceData(ServiceId: number) {
    if (!ServiceId) {
      this.ServiceData = [];
      return;
    }
    this.isServiceSpinning = true;
    this.api
      .getServiceItem(0, 0, '', '', ' AND SERVICE_CATLOG_ID=' + ServiceId)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.ServiceData = data['data'];
            this.isServiceSpinning = false;
          } else {
            this.ServiceData = [];
            this.message.error('Failed To Get Service Data', '');
            this.isServiceSpinning = false;
          }
        },
        () => {
          this.message.error('Something Went Wrong', '');
          this.isServiceSpinning = false;
        }
      );
  }
  disableWeekEndDate = (current: Date): boolean => {
    if (this.data.WEEK_START_DATE) {
      const weekStartDate = new Date(this.data.WEEK_START_DATE);
      const startDateNormalized = new Date(
        weekStartDate.getFullYear(),
        weekStartDate.getMonth(),
        weekStartDate.getDate()
      );
      const currentDateNormalized = new Date(
        current.getFullYear(),
        current.getMonth(),
        current.getDate()
      );
      return currentDateNormalized < startDateNormalized;
    }
    return false;
  };
  ServicesMappingdata: any[] = [];
  CatalogServiceMappingData: any[] = [];
  add(ServiceMasterForm: NgForm): void {
    if (!this.saveData.SERVICE_CATLOG_ID || !this.saveData.ID) {
      this.message.error('Please select both Service Catalog and Service.', '');
      return;
    }
    this.issaveSpinning = true;
    const selectedCatalog = this.CatalogData.find(
      (catalog) => catalog.ID === this.saveData.SERVICE_CATLOG_ID
    )?.NAME;
    const selectedService = this.ServiceData.find(
      (service) => service.ID === this.saveData.ID
    )?.NAME;
    if (!selectedCatalog || !selectedService) {
      this.message.error('Invalid Service Catalog or Service selection.', '');
      this.issaveSpinning = false;
      return;
    }
    const newEntry = {
      SERVICE_CATLOG_NAME: selectedCatalog,
      CATALOG_ID: this.saveData.SERVICE_CATLOG_ID, 
      SERVICE_NAME: selectedService,
      SERVICE_ID: this.saveData.ID, 
      IS_ACTIVE: true, 
    };
    const exists = this.CatalogServiceMappingData.some(
      (item) =>
        item.CATALOG_ID === newEntry.CATALOG_ID &&
        item.SERVICE_ID === newEntry.SERVICE_ID
    );
    if (exists) {
      this.message.warning(
        'This Service and Catalog combination already exists.',
        ''
      );
      this.issaveSpinning = false;
      return;
    }
    this.CatalogServiceMappingData.push(newEntry);
    this.CatalogServiceMappingData = [...this.CatalogServiceMappingData];
    this.resetDrawer(ServiceMasterForm);
    this.message.success('Service and Catalog added successfully.', '');
    this.issaveSpinning = false;
  }
  resetDrawer(Servicemaster: NgForm) {
    this.saveData.CATALOG_ID = null;
    this.saveData.ID = null;
    Servicemaster.form.markAsPristine();
    Servicemaster.form.markAsUntouched();
  }
  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }
  isFilterApplied: any = 'default';
  filterClass: string = 'filter-invisible';
  close() {
    this.drawerClose();
  }
  save() {
    this.isSpinning = true;
    this.data.EFFECTIVE_DATE = this.datePipe.transform(
      this.data.EFFECTIVE_DATE,
      'yyyy-MM-dd'
    );
    this.data.EXPIRY_DATE = this.datePipe.transform(
      this.data.EXPIRY_DATE,
      'yyyy-MM-dd'
    );
    const dataToSave = this.CatalogServiceMappingData.filter(
      (data) => data.IS_ACTIVE === true || data.IS_ACTIVE == '1'
    ).map((data) => ({
      SERVICE_ID: data.SERVICE_ID || null, 
      CHARGES_TYPE: data.CHARGES_TYPE || '', 
      CHARGES: data.CHARGES || 0, 
      EFFECTIVE_DATE:
        this.datePipe.transform(data.EFFECTIVE_DATE, 'yyyy-MM-dd') || null, 
      EXPIRY_DATE:
        this.datePipe.transform(data.EXPIRY_DATE, 'yyyy-MM-dd') || null, 
      IS_ACTIVE: data.IS_ACTIVE === true || data.IS_ACTIVE == '1' ? 1 : 0, 
    }));
    this.api.addServiceTeachniacianMapping(this.data.ID, dataToSave).subscribe(
      (successCode) => {
        if (successCode['code'] === 200) {
          this.message.success(
            'Technican Successfully Mapped to the Skill.',
            ''
          );
          this.isSpinning = false;
          this.drawerClose();
        } else {
          this.message.error('Failed to Map Technician to the Skills', '');
        }
        this.isSpinning = false;
      },
      () => {
        this.isSpinning = false;
        this.message.error('Something Went Wrong.', '');
      }
    );
  }
  getServiceforMapping() {
    this.api
      .getTechnicianServiceData(
        0,
        0,
        '',
        '',
        ' AND TECHNICIAN_ID=' + this.data.ID
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.CatalogServiceMappingData = data['data'];
          } else {
            this.CatalogServiceMappingData = [];
            this.message.error('Failed To Get Service Data', '');
          }
        },
        () => {
          this.message.error('Something Went Wrong', '');
        }
      );
  }
}
