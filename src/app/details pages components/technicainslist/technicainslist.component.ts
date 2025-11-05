import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { differenceInCalendarDays } from 'date-fns';
import { DatePipe } from '@angular/common';
import { NgForm } from '@angular/forms';

declare const google: any;

@Component({
  selector: 'app-technicainslist',
  templateUrl: './technicainslist.component.html',
  styleUrls: ['./technicainslist.component.css'],
})
export class technicainslistComponent implements OnInit {
  loadingRecords = false;
  selectedTerritor: string = '';
  selectedDate: any;
  isfilterapply = false;
  selectedTechnicianDropdown: string = 'tech1';
  @Input() TYPE: any = '';
  @Input() FILTER_ID: any;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  techniciansdata: any[] = [];
  timelineData: any[] = [];
  technician: any[] = [];
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: any = 'default';
  filterClass: any = 'filter-invisible';
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private datepipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.getTechniciandata();
  }
  isSpinning = true;
  filterdata: any = '';
  onKeyup(event: KeyboardEvent): void {
    if (this.searchText.length > 3 && event.key === 'Enter') {
      this.getTechniciandata(true);
    }
  }

  onKeypressEvent(keys) {
    const element = window.document.getElementById('buttonss');
    if (element != null) element.focus();
    if (this.searchText.length >= 3 && keys.key === 'Enter') {
      this.getTechniciandata(true);
    }
    else if (this.searchText.length === 0 && keys.key == 'Backspace') {
      this.getTechniciandata(true);
    }
  }
  columns: string[][] = [
    ['EMAIL_ID', 'EMAIL_ID'],
    ['MOBILE_NUMBER', 'MOBILE_NUMBER'],
    ['NAME', 'NAME']
  ];
  searchdata() {
    if (this.searchText.length >= 3) {
      this.getTechniciandata(true);
    }
  }
  count: number = 0;
  getTechniciandata(reset: boolean = false) {
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
    var likeQuery = '';

    if (this.searchText != '' && this.searchText.length > 0) {
      likeQuery = ' AND(';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ') ';

    }

    if (this.TYPE == 'VENDOR' && this.FILTER_ID != null && this.FILTER_ID != undefined && this.FILTER_ID != '') {
      this.filterdata = ' AND VENDOR_ID=' + this.FILTER_ID
    } else {
      this.filterdata = '';
    }
    this.isSpinning = true;
    this.api.getTechnicianData(0, 0, 'id', 'desc', this.filterdata + likeQuery).subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.count = data['count']
          this.originalTechniciansData = data.data; // Save the original data
        } else {
          this.count = 0;
          this.message.error('Server Not Found.', '');
        }
        this.isSpinning = false;
      },
      (err: HttpErrorResponse) => {
        this.count = 0;
        this.handleHttpError(err);
        this.isSpinning = false;
      }
    );
  }

  searchValue: string = ''; // Two-way bound to the input field
  originalTechniciansData: any[] = []; // To preserve the original list

  onSearchChange(value: string): void {
    this.searchValue = value;
    if (value.length >= 3) {
      const lowerValue = value.toLowerCase();

      this.techniciansdata = this.originalTechniciansData.filter(
        (technician) =>
          technician.NAME.toLowerCase().includes(lowerValue) ||
          technician.EMAIL_ID.toLowerCase().includes(lowerValue) ||
          technician.MOBILE_NUMBER.includes(value) ||
          (technician.IS_ACTIVE === 1 && 'active'.includes(lowerValue)) || // Match "Active" status
          (technician.IS_ACTIVE === 0 && 'inactive'.includes(lowerValue))
      );
    } else {
      this.techniciansdata = [...this.originalTechniciansData];
    }
  }

  range(start: number, end: number): number[] {
    const result: number[] = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }

  // Disable dates only, not time
  disabledDate = (current: Date): boolean => {
    // Disable all dates after the selected date
    return differenceInCalendarDays(current, this.selectedDate) > 0;
  };

  dateformat(data: any) {
    this.selectedDate = this.datepipe.transform(data, 'yyyy-MM-dd');
  }

  handleHttpError(err: HttpErrorResponse) {
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

  initMap(): void {
    // For technician travel map
    const technician = this.technician;

    if (technician) {
      const locations = technician
        .map((loc: any) => ({
          latitude: parseFloat(loc.LOCATION_LATITUDE),
          longitude: parseFloat(loc.LOCATION_LONG),
          locationName: `Location ID: ${loc.ID}`,
          time: new Date(loc.CREATED_MODIFIED_DATE).toLocaleString(),
        }))
        .filter(
          (loc: any) => !isNaN(loc.latitude) && !isNaN(loc.longitude) // Filter out invalid locations
        );

      if (locations.length === 0) {
        this.message.error('No valid locations found for the technician.', '');
        return; // Exit if no valid locations
      }

      const mapCenter = {
        lat:
          locations.reduce((sum: number, loc: any) => sum + loc.latitude, 0) /
          locations.length,
        lng:
          locations.reduce((sum: number, loc: any) => sum + loc.longitude, 0) /
          locations.length,
      };

      if (isNaN(mapCenter.lat) || isNaN(mapCenter.lng)) {
        return; // Exit if map center is invalid
      }

      const mapElement = document.getElementById('map');
      if (mapElement) {
        const map = new google.maps.Map(mapElement as HTMLElement, {
          center: mapCenter,
          zoom: 14,
        });

        locations.forEach((location: any) => {
          const marker = new google.maps.Marker({
            position: { lat: location.latitude, lng: location.longitude },
            map: map,
          });

          const convertedDate = this.datepipe.transform(
            location.time,
            'h:mm a'
          );

          const infoWindow = new google.maps.InfoWindow({
            content: `
            <div style="width: 150px; padding: 10px; font-size: 14px; color: #333; 
                background-color: #fff; border-radius: 5px; box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);">
            <p style="font-size: 12px; margin: 5px 0;">${convertedDate}</p>
            </div>`,
          });

          // Show the InfoWindow on hover
          marker.addListener('mouseover', () => {
            infoWindow.open(map, marker);
          });

          // Close the InfoWindow when the mouse leaves the marker
          marker.addListener('mouseout', () => {
            infoWindow.close();
          });
        });

        new google.maps.Polyline({
          path: locations.map(
            (location: any) =>
              new google.maps.LatLng(location.latitude, location.longitude)
          ),
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2,
          map: map,
        });
      }
    }

    // For all technicians location map

    // Check for valid technician data with proper latitude and longitude
    const validLocations = this.techniciansdata.filter(
      (location) =>
        !isNaN(parseFloat(location.LOCATION_LATITUDE)) &&
        !isNaN(parseFloat(location.LOCATION_LONG))
    );

    // Calculate the center only if there are valid locations
    const map2Center = {
      lat:
        validLocations.length > 0
          ? validLocations.reduce(
            (sum, loc) => sum + parseFloat(loc.LOCATION_LATITUDE),
            0
          ) / validLocations.length
          : 0,
      lng:
        validLocations.length > 0
          ? validLocations.reduce(
            (sum, loc) => sum + parseFloat(loc.LOCATION_LONG),
            0
          ) / validLocations.length
          : 0,
    };

    const map2Element = document.getElementById('map1');
    if (map2Element) {
      const map2 = new google.maps.Map(map2Element as HTMLElement, {
        center: map2Center,
        zoom: 14,
      });

      validLocations.forEach((location: any) => {
        const marker = new google.maps.Marker({
          position: {
            lat: parseFloat(location.LOCATION_LATITUDE),
            lng: parseFloat(location.LOCATION_LONG),
          },
          map: map2,
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `
      <div style="width: 150px; padding: 10px; font-size: 14px; color: #333; 
          background-color: #fff; border-radius: 5px; box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);">
        <h6>${location.NAME}</h6>
        <p>${location.MOBILE_NUMBER}</p>
        
      </div>`,
        });

        infoWindow.open(map2, marker);

        marker.addListener('mouseover', () => {
          infoWindow.open(map2, marker);
        });

        marker.addListener('mouseout', () => {
          infoWindow.close();
        });
      });
    }
  }
  // <p>${location.CITY_NAME}</p>
  drawerTitle!: string;
  drawerFilterVisible: boolean = false;
  // drawerData: CurrencyMaster = new CurrencyMaster();
  applyCondition: any;

  addtechnicianfilter(data: any) {
    if (data == 'Technician') {
      this.drawerTitle = 'Technician Filter';
    } else if (data == 'order') {
      this.drawerTitle = 'Order Filter';
    } else if (data == 'jobcard') {
      this.drawerTitle = 'Job Filter';
    }
    this.applyCondition = data;
    // this.drawerData = new CurrencyMaster();
    this.drawerFilterVisible = true;
  }

  drawerflterClose(): void {
    this.drawerFilterVisible = false;
  }

  get closefilterCallback() {
    return this.drawerflterClose.bind(this);
  }

  selectedmode = 'tech';
  // order
  // job

  selectmodeee(event) {
    this.selectedmode = event;
  }

  date = new Date();

  onlymap: boolean = false;

  fullmap() {
    this.onlymap = true;
    this.cdr.detectChanges(); // Manually trigger change detection to re-render the view

    this.initMap();
  }

  back() {
    this.onlymap = false;
    this.cdr.detectChanges(); // Manually trigger change detection to re-render the view
    this.initMap();
  }

  public visiblesave = false;
  resetPasswordLoading: boolean = false;

  isChangePassword() {
    this.getSkillData();
    this.visiblesave = true;
  }

  handleCancelTop(): void {
    this.resetForm();
    this.visiblesave = false;
  }

  PINCODE_ID;

  checkOptionsOne = [
    { label: 'Inhouse', value: 'I', checked: false },
    { label: 'Freelancer', value: 'F', checked: false },
    { label: 'Vendor Tech', value: 'V', checked: false },
  ];

  checkOptionsTwo = [
    { label: 'Fresher', value: 'F', checked: false },
    { label: 'Junior', value: 'J', checked: false },
    { label: 'Mid-Level', value: 'M', checked: false },
    { label: 'Senior', value: 'S', checked: false },
    { label: 'Lead', value: 'L', checked: false },
    { label: 'Expert', value: 'E', checked: false },
  ];


  selectedSkills: { [key: number]: boolean } = {};
  skillData: any = [];
  getSkillData() {
    this.api.getSkillData(0, 0, '', '', ' AND IS_ACTIVE =1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.skillData = data['data'];
        } else {
          this.skillData = [];
          this.message.error('Failed To Get Skill Data', '');
        }
      },
      () => {
        this.message.error('Something Went Wrong', '');
      }
    );
  }



  @ViewChild('resetform') resetform: NgForm;
  resetForm(): void {
    // Reset all checkboxes in checkOptionsOne
    this.checkOptionsOne.forEach((option) => (option.checked = false));

    // Reset all checkboxes in checkOptionsTwo
    this.checkOptionsTwo.forEach((option) => (option.checked = false));

    // Clear selected skills
    this.selectedSkills = {};

    // Reset Pincode selection
    this.PINCODE_ID = null;

    // Reset the form's state
    if (this.resetform) {
      this.resetform.resetForm();
    }
  }

  jobdetaildrawerTitle = '';
  jobdetailsshow = false;
  jobdetailsdata: any;
  invoicefilter = '';
  ratingfilter = ''

  openjobcarddetails(data: any) {

    this.jobdetailsdata = data;
    this.getTechniciansJobs(data);
    this.jobdetaildrawerTitle = 'Technician Details';

  }

  drawersize = '100%';
  jobdetailsdrawerClose(): void {
    this.jobdetailsshow = false;
  }
  //Drawer Methods
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
}
