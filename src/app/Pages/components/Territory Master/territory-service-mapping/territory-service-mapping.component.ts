import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { TerritoryMaster } from 'src/app/Pages/Models/TerritoryMaster';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';

@Component({
  selector: 'app-territory-service-mapping',
  templateUrl: './territory-service-mapping.component.html',
  styleUrls: ['./territory-service-mapping.component.css']
})
export class TerritoryServiceMappingComponent {
  @Input() data: any = TerritoryMaster;
  @Input() drawerClose: any = Function;
  @Input() drawerVisible: boolean = false;
  public commonFunction = new CommonFunctionService();
  isSpinning = false;
  sortValue: string = 'desc';
  sortKey: string = 'NAME';
  pageIndex = 1;
  pageSize = 10;


  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService,
    private datePipe: DatePipe,
  ) {}

  WEEK_DAY = [
    { Id: "MON", Name: "Monday" },
    { Id: "TUE", Name: "Tuesday" },
    { Id: "WED", Name: "Wednesday" },
    { Id: "THU", Name: "Thursday" },
    { Id: "FRI", Name: "Friday" },
    { Id: "SAT", Name: "Saturday" },
    { Id: "SUN", Name: "Sunday" }
  ];


  parseTimeString(time: string | null): Date | null {
    if (!time) return null; // Handle null or undefined values
    const [hours, minutes] = time.split(':').map((val) => parseInt(val, 10));
    const date = new Date();
    date.setHours(hours, minutes, 0, 0); // Set time parts
    return date;
  }
  
  serviceData: any = [];
  // getServiceData() {
  //   this.api.getServiceCatData(0, 0, '', '', '').subscribe(
  //     (data) => {
  //       if (data['code'] == 200) {
  //         this.serviceData = data['data'];
  //       } else {
  //         this.serviceData = [];
  //         this.message.error('Failed To Get Service Data', '');
  //       }
  //     },
  //     () => {
  //       this.message.error('Something Went Wrong', '');
  //     }
  //   );
  // }
  ServiceMapping() {
    this.isSpinning = true;
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    // Call the API with the constructed query
    this.api
      .getterritoryServiceData(
        0,
        0,
        this.sortKey,
        sort,
       '',
       this.data.ID
      )
      .subscribe(
        (data) => {
          if (data['code'] === 200) {
           
            this.serviceData = data['data'].map((service) => ({
              ...service,
              START_TIME: this.parseTimeString(service.START_TIME),
              END_TIME: this.parseTimeString(service.END_TIME),
            }));
          } else {
            this.serviceData = [];
            this.message.error('Failed To Get Service Mapping Data...', '');
          }
          this.isSpinning = false;
        },
        () => {
          this.message.error('Something Went Wrong ...', '');
          this.isSpinning = false;
        }
      );
  }

  sort(params: NzTableQueryParams) {
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
    this.ServiceMapping();
  }
  close() {
    this.drawerClose();
  }


  // OrgServiceCalender: any = [];
  // getOrgServiceCalender() {
  //   this.api.getOrgServiceCalender(0, 0, '', '', '').subscribe(
  //     (data) => {
  //       if (data['code'] == 200) {
  //         this.OrgServiceCalender = data['data'];
  //       } else {
  //         this.OrgServiceCalender = [];
  //         this.message.error('Failed To Get Organization Service Calender Data', '');
  //       }
  //     },
  //     () => {
  //       this.message.error('Something Went Wrong', '');
  //     }
  //   );
  // }

  save() {
    this.isSpinning = true;

    const dataToSave = this.serviceData.map((data) => ({
      SERVICE_ID:data.SERVICE_ID,
      DATE:data.DATE,
      DAY_START_TIME: this.datePipe.transform(data.DAY_START_TIME, 'HH:mm:00'),
      DAY_END_TIME: this.datePipe.transform(data.DAY_END_TIME, 'HH:mm:00'),
      REMARKS: data.REMARKS,
      IS_ACTIVE: data.IS_ACTIVE==null?0:data.IS_ACTIVE,
      IS_SERIVCE_AVAILABILE: data.IS_SERIVCE_AVAILABILE,
       CLIENT_ID: data.CLIENT_ID,
    }));

  
   
    // Call the API to save the task mapping data
    this.api.addTerritoryServiceMapping(this.data.ID, 1, dataToSave).subscribe(
      (successCode) => {
        if (successCode['code'] === 200) {
          this.message.success('Services Successfully Mapped to the Territory.', '');
          this.isSpinning = false;
          this.drawerClose();
        } else {
          this.message.error('Failed to Map Services to the Territory', '');
        }
        this.isSpinning = false;
      },
      () => {
        this.isSpinning = false;
        this.message.error('Something Went Wrong.', '');
      }
    );
  }
}
