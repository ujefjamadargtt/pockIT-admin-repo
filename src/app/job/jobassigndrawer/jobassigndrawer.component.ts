import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
declare const google: any;

@Component({
  selector: 'app-jobassigndrawer',
  templateUrl: './jobassigndrawer.component.html',
  styleUrls: ['./jobassigndrawer.component.css'],
})
export class JobassigndrawerComponent {
  @Input() Jobassignsdata: any;
  @Input() SERVICE_DATA: any;
  @Input() alljobdata: any;
  @Input() IS_ORDER_JOB: any;
  @Input() IS_REMOTE_JOB: any;
  @Input() Territorytime: any;
  @Input() todaydate: any;
  @Input() drawerClose: any;
  @Input() currentPopoverData: any;
  @Input() jobedit: any;
  @Input() vendor_id: any;
  @Input() roleids: any;
  @Input() terriotrystarttime: any;
  @Input() terriotryendtime: any;
  TECHNICIAN_TYPE = 'A';
  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService,
    private datepipe: DatePipe,
  ) { }
  dublicatesheduledata: any;
  timeslots: any;
  mergedData: {
    time: string;
    job: string;
    rowSpan: number;
    colorStyle: any;
    randomColor: any;
  }[] = [];
  userId: any;
  backofficeId = sessionStorage.getItem('backofficeId');
  decreptedbackofficeId = 0;
  decreptedvendorId = 0;
  roleID = sessionStorage.getItem('roleId');
  decreptedroleIDString = '';
  decreptedroleID = 0;
  customerMangeer: any = '';
  orgId: any;
  public commonFunction = new CommonFunctionService();
  ngOnInit(): void {
    this.timeslots = this.generateTimeColumns();
    this.decreptedroleIDString = this.roleID
      ? this.commonFunction.decryptdata(this.roleID)
      : '';
    this.decreptedroleID = parseInt(this.decreptedroleIDString, 10);
    if (
      this.decreptedroleID != 1 &&
      this.decreptedroleID != 6 &&
      this.decreptedroleID != 8 &&
      this.decreptedroleID != 9
    ) {
      var decreptedbackofficeId = this.backofficeId
        ? this.commonFunction.decryptdata(this.backofficeId)
        : '';
      this.decreptedbackofficeId = parseInt(decreptedbackofficeId, 10);
    }
    if (this.decreptedroleID === 7) {
      this.customerMangeer = ' AND CUSTOMER_MANAGER_ID=' + this.decreptedbackofficeId
    } else {
      this.customerMangeer = '';
    }
    this.getTechnicianData();
    this.sheduledate = this.Jobassignsdata.EXPECTED_DATE_TIME;

    this.STARTTIME = new Date(this.Jobassignsdata.EXPECTED_DATE_TIME);

    let startMinutes = this.STARTTIME.getMinutes();
    if (
      startMinutes != 0 &&
      startMinutes != 10 &&
      startMinutes != 20 &&
      startMinutes != 30 &&
      startMinutes != 40 &&
      startMinutes != 50
    ) {
      let roundedStartMinutes = Math.floor(startMinutes / 10) * 10;
      this.STARTTIME.setMinutes(roundedStartMinutes);
    }
    if (this.IS_ORDER_JOB == 'P') {
      this.ENDTIME = new Date(
        this.STARTTIME.getTime() +
        this.Jobassignsdata.ESTIMATED_TIME_IN_MIN * 60000
      );
    } else if (this.IS_ORDER_JOB == 'O') {
      this.ENDTIME = new Date(
        this.STARTTIME.getTime() +
        this.SERVICE_DATA.ESTIMATED_TIME_IN_MIN * 60000
      );
    }

    let startMinutes1 = this.ENDTIME.getMinutes();
    if (
      startMinutes1 != 0 &&
      startMinutes1 != 10 &&
      startMinutes1 != 20 &&
      startMinutes1 != 30 &&
      startMinutes1 != 40 &&
      startMinutes1 != 50
    ) {
      let roundedStartMinutes1 = Math.floor(startMinutes1 / 10) * 10;
      this.ENDTIME.setMinutes(roundedStartMinutes1);
    }

    if (
      this.datepipe.transform(
        this.Jobassignsdata.EXPECTED_DATE_TIME,
        'dd/MM/yyyy'
      ) == this.datepipe.transform(new Date(), 'dd/MM/yyyy')
    ) {
      const jobTime = this.datepipe.transform(
        this.Jobassignsdata.EXPECTED_DATE_TIME,
        'HH:mm'
      );
      const currentTime = this.datepipe.transform(new Date(), 'HH:mm');
      const currentTimedate = new Date();
      this.terriotrystarttime = currentTime;
      if (jobTime && currentTime) {
        if (jobTime < currentTime) {
          this.terriotrystarttime = currentTime;
          this.STARTTIME = currentTimedate;

          let startMinutes = this.STARTTIME.getMinutes();
          if (
            startMinutes != 0 &&
            startMinutes != 10 &&
            startMinutes != 20 &&
            startMinutes != 30 &&
            startMinutes != 40 &&
            startMinutes != 50
          ) {
            let roundedStartMinutes = Math.floor(startMinutes / 10) * 10;
            this.STARTTIME.setMinutes(roundedStartMinutes);
          }

          if (this.IS_ORDER_JOB == 'P') {
            this.ENDTIME = new Date(
              this.STARTTIME.getTime() +
              this.Jobassignsdata.ESTIMATED_TIME_IN_MIN * 60000
            );
          } else if (this.IS_ORDER_JOB == 'O') {
            this.ENDTIME = new Date(
              this.STARTTIME.getTime() +
              this.SERVICE_DATA.ESTIMATED_TIME_IN_MIN * 60000
            );
          }

          let startMinutes1 = this.ENDTIME.getMinutes();
          if (
            startMinutes1 != 0 &&
            startMinutes1 != 10 &&
            startMinutes1 != 20 &&
            startMinutes1 != 30 &&
            startMinutes1 != 40 &&
            startMinutes1 != 50
          ) {
            let roundedStartMinutes1 = Math.floor(startMinutes1 / 10) * 10;
            this.ENDTIME.setMinutes(roundedStartMinutes1);
          }
        } else {
        }
      }
    } else {
    }

    this.userId = this.commonFunction.decryptdata(
      sessionStorage.getItem('userId') || ''
    );
    this.orgId = this.commonFunction.decryptdata(
      sessionStorage.getItem('orgId') || ''
    );
  }

  changeTechnicianType(event) {
    this.TECHNICIAN_TYPE = event;
    this.getTechnicianData();
  }
  disabledEndHours: () => number[] = () => [];
  disabledEndMinutes: (hour: number) => number[] = () => [];

  distancechecked: boolean = false;
  ServiceAvailabilitychecked: boolean = false;
  BrakeAvailabilitychecked: boolean = false;
  skillschecked: boolean = false;
  searchValue: any = '';

  onSearchChange(event: any) {
    this.isselectedtech = false;
    this.searchValue = event;
    if (event.length >= 1) {
      this.dublicatetechData = this.techData.filter((item) =>
        Object.keys(item)
          .filter((key) =>
            ['NAME', 'MOBILE_NUMBER', 'EMAIL_ID', 'PINCODE'].includes(key)
          )
          .some((key) =>
            item[key]?.toString().toLowerCase().includes(this.searchValue)
          )
      );
    } else if (event.length == 0) {
      this.dublicatetechData = this.techData;
    }
  }

  technician = [
    {
      CREATED_MODIFIED_DATE: '2024-12-18T10:00:00Z',
      LOCATION_LONG: 74.576091,
      LOCATION_LATITUDE: 16.862048,
      TECHNICIAN_NAME: 'John Doe',
      JOB_CARD_NO: 'JC1002',
      ID: 12345,
    },
    {
      CREATED_MODIFIED_DATE: '2024-12-17T09:30:00Z',
      LOCATION_LONG: 74.587839,
      LOCATION_LATITUDE: 16.890687,
      TECHNICIAN_NAME: 'Jane Smith',
      JOB_CARD_NO: 'JC1003',
      ID: 12346,
    },
  ];

  initMap(): void {
    // For technician travel map
    const technician = this.technician;
    if (technician) {
      const locations = technician
        .map((loc: any) => ({
          name: loc.TECHNICIAN_NAME,
          latitude: parseFloat(loc.LOCATION_LATITUDE),
          longitude: parseFloat(loc.LOCATION_LONG),
          locationName: `Location ID: ${loc.ID}`,
          time: loc.CREATED_MODIFIED_DATE
            ? new Date(loc.CREATED_MODIFIED_DATE).toLocaleString()
            : '',
        }))
        .filter((loc: any) => !isNaN(loc.latitude) && !isNaN(loc.longitude));

      if (locations.length === 0) {
        return;
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

        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer({
          suppressMarkers: true, // We will add custom markers below
          map: map,
        });

        const waypoints = locations
          .slice(1, locations.length - 1)
          .map((location: any) => ({
            location: new google.maps.LatLng(
              location.latitude,
              location.longitude
            ),
            stopover: true,
          }));

        const request = {
          origin: new google.maps.LatLng(
            locations[0].latitude,
            locations[0].longitude
          ),
          destination: new google.maps.LatLng(
            locations[locations.length - 1].latitude,
            locations[locations.length - 1].longitude
          ),
          waypoints: waypoints,
          travelMode: google.maps.TravelMode.DRIVING, // Use DRIVING to show the road map
        };

        directionsService.route(request, (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);

            // Add custom markers for each location
            locations.forEach((location: any, index: number) => {
              const markerIcon =
                index === 0
                  ? 'https://maps.google.com/mapfiles/ms/icons/red-dot.png' // red marker for the start location
                  : 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'; // blue markers for others

              const marker = new google.maps.Marker({
                position: { lat: location.latitude, lng: location.longitude },
                map: map,
                icon: markerIcon,
              });
              var convertedDate: any = '';

              if (location.time != '') {
                convertedDate = this.datepipe.transform(
                  location.time,
                  'h:mm a'
                );
              }

              const infoWindow = new google.maps.InfoWindow({
                content: `
              <div style="width: 150px; padding: 10px; font-size: 14px; color: #333; 
                  background-color: #fff; border-radius: 5px; box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);">
                   <h6>${location.name}</h6>
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
          } else {
          }
        });
      }
    }
  }
  generateTimeColumns(): string[] {
    const columns: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 10) {
        // Format hours and minutes as "HH:MM"
        const formattedTime = `${hour.toString().padStart(2, '0')}:${minute
          .toString()
          .padStart(2, '0')}`;
        columns.push(formattedTime);
      }
    }
    return columns;
  }
  sheduledata = [];

  spinnn: boolean = false;
  techData: any;
  dublicatetechData: any;
  getTechnicianData() {
    this.spinnn = true;
    var SortOrder = this.checkboxList
      .filter((item) => item.checked)
      .map((item, index) => ({
        KEY: item.KEY,
        VALUE: item.VALUE,
        SEQUENCE: index + 1,
      }));
    var dataaa = [this.SERVICE_DATA];
    var filter = this.TECHNICIAN_TYPE;
    if (this.IS_REMOTE_JOB == 1) {
      filter = this.TECHNICIAN_TYPE + 'R';
    }
    this.api
      .gettechciansheduledata(
        0,
        0,
        '',
        '',
        '',
        dataaa,
        SortOrder,
        filter,
        this.Jobassignsdata.CUSTOMER_ID,
        this.Jobassignsdata.CUSTOMER_TYPE,
        this.roleids === 9 || this.roleids === '9' ? this.vendor_id : 0,
        this.roleids === 9 || this.roleids === '9' ? 'V' : 'O'
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.techData = data['data'];
            this.dublicatetechData = data['data'];
            this.spinnn = false;
          } else if (data['code'] == 300) {
            this.techData = [];
            this.dublicatetechData = [];
            this.spinnn = false;
            this.message.info('No technician(s) available.', '');
          } else {
            this.techData = [];
            this.dublicatetechData = [];
            this.spinnn = false;
            this.message.error('Failed To Get Technician Data', '');
          }
        },
        () => {
          this.techData = [];
          this.dublicatetechData = [];
          this.spinnn = false;
        }
      );
  }
  prepareMergedData() {
    const rawData = this.timeslots.map((time) => ({
      time,
      job: this.sheduledata[0][time] || 'No Job',
    }));

    this.mergedData = [];
    let currentJob = null;
    let rowSpanCount = 0;
    let randomColor = '';
    let tempIndex = -1; // Track the starting index of merged rows

    rawData.forEach((row, index) => {
      if (row.job === currentJob && row.job !== 'No Job') {
        // Increment rowSpan for the first occurrence
        rowSpanCount++;
        this.mergedData[tempIndex].rowSpan = rowSpanCount;
        this.mergedData.push({ ...row, rowSpan: 0, randomColor: '' }); // Add the row but with no rowspan
      } else {
        // Add a new row for a new job or "No Job"
        currentJob = row.job;
        rowSpanCount = 1;
        randomColor = row.job !== 'No Job' ? this.getRandomColor() : ''; // Assign color only to jobs
        tempIndex = this.mergedData.length; // Update the start index for the current job
        this.mergedData.push({ ...row, rowSpan: 1, randomColor });
      }
    });

    // Ensure rows with no merging show correct rowSpan
    this.mergedData.forEach((row) => {
      if (row.rowSpan === 1) row.rowSpan = 0;
    });
  }

  // Assign color based on job type or any other condition
  getRowColor(job: string): any {
    if (job.includes('JOB/20241210/150')) {
      return { backgroundColor: '#e6f7ff' }; // Light blue
    } else if (job.includes('JOB/20241210/00014')) {
      return { backgroundColor: '#fff1b8' }; // Light yellow
    } else if (job === 'No Job') {
      return { backgroundColor: '#f6ffed' }; // Light green
    }
    return {}; // Default
  }

  getRandomColor(): string {
    const letters = '89ABCDEF'; // Use only lighter hex digits
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
  }
  filterClass = 'filter-invisible';
  showMainFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    } else {
      this.filterClass = 'filter-visible';
    }
  }

  checkboxList = [
    {
      label: 'Distance',
      checked: true,
      KEY: 'D',
      VALUE: 'Distance',
      SEQUENCE: 1,
    },
    { label: 'Skills', checked: true, KEY: 'SK', VALUE: 'Skills', SEQUENCE: 2 },
    {
      label: 'Service Availability',
      checked: true,
      KEY: 'S',
      VALUE: 'Service Availability',
      SEQUENCE: 3,
    },
    {
      label: 'Break Availability',
      checked: true,
      KEY: 'B',
      VALUE: 'Break Availability',
      SEQUENCE: 4,
    },
    {
      label: 'Rating',
      checked: true,
      KEY: 'R',
      VALUE: 'Rating',
      SEQUENCE: 5,
    },
  ];

  trackByFn(index: number, item: any): any {
    return item.label; // Use label or any unique identifier
  }

  // Handle the drop event to reorder items
  onDrop(event: CdkDragDrop<any[]>): void {
    // Using `moveItemInArray` to reorder items
    moveItemInArray(this.checkboxList, event.previousIndex, event.currentIndex);
    this.checkboxList.forEach((item, index) => {
      item.SEQUENCE = index + 1;
    });
  }

  isselectedtech = false;

  viewtechdetails(datas: any) {
    this.mergedData = [];
    this.sheduledata = [];
    this.technician = [];
    this.isselectedtech = true;
    var dateee = this.datepipe.transform(
      this.Jobassignsdata.EXPECTED_DATE_TIME,
      'yyyy-MM-dd'
    );
    var filterfortech =
      ' AND TECHNICIAN_ID = ' +
      datas.ID +
      " AND DATE(DATE_TIME) ='" +
      dateee +
      "'";
    var filterfortecheeee =
      ' AND TECHNICIAN_ID = ' + datas.ID + " AND DATE ='" + dateee + "'";
    this.api
      .getcurrentlocatiooftech(
        0,
        0,
        'ID',
        'desc',
        '',
        this.datepipe.transform(
          this.Jobassignsdata.EXPECTED_DATE_TIME,
          'yyyy-MM-dd'
        ),
        this.datepipe.transform(this.STARTTIME, 'HH:mm'),
        this.datepipe.transform(this.ENDTIME, 'HH:mm'),
        datas.ID
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200 || data['code'] == 300) {
            this.technician = data['data'];
            //

            const technician = this.technician.map((data) => ({
              CREATED_MODIFIED_DATE: data.CREATED_MODIFIED_DATE,
              LOCATION_LONG: data.LOCATION_LONG,
              LOCATION_LATITUDE: data.LOCATION_LATITUDE,
              TECHNICIAN_NAME: data.TECHNICIAN_NAME,
              JOB_CARD_NO: data.JOB_CARD_NO,
            }));

            if (this.technician.length > 0) {
              var dataaaaa222: any = {
                CREATED_MODIFIED_DATE: '',
                LOCATION_LONG: technician[0].LOCATION_LONG,
                LOCATION_LATITUDE: technician[0].LOCATION_LATITUDE,
                TECHNICIAN_NAME: technician[0].TECHNICIAN_NAME,
                JOB_CARD_NO: '',
                TYPE: 'T',
              };
            }
            var dataaaaa: any = {
              CREATED_MODIFIED_DATE: this.Jobassignsdata.SCHEDULED_DATE_TIME,
              LOCATION_LONG: this.Jobassignsdata.LONGITUDE,
              LOCATION_LATITUDE: this.Jobassignsdata.LATTITUTE,
              TECHNICIAN_NAME: this.Jobassignsdata.CUSTOMER_NAME,
              JOB_CARD_NO: this.Jobassignsdata.JOB_CARD_NO,
              TYPE: 'C',
            };

            this.technician = [
              {
                ...dataaaaa222,
              },
              {
                ...dataaaaa,
              },
            ];

            setTimeout(() => {
              // this.initMap();
              this.setLocation();
            }, 500);
          } else {
            this.message.error('Failed To Get Technician Data2', '');
          }
        },
        () => {
          // this.message.error('Something Went Wrong', '');
        }
      );

    this.api.gettechnicianjobshedule(0, 0, '', '', filterfortecheeee, '', '', datas.ID).subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.sheduledata = data['data'];

          if (this.sheduledata.length > 0) {
            this.prepareMergedData();
          } else {
            this.mergedData = [];
          }
        } else {
          this.message.error('Failed To Get Technician Data 1', '');
          this.mergedData = [];
        }
      },
      () => {
        // this.message.error('Something Went Wrong', '');
      }
    );
  }
  isSpinning: boolean = false;
  Titleforassign = '';
  assigndataa: any = [];
  openModal: boolean = false;
  jobdata: any = [];
  distancecalculateforprevois: any;
  distancecalculatefornext: any;
  previousdata: any;
  nextdata: any;
  assgnopen(dataaaa) {
    this.spinnn = true;
    this.api
      .getpendinjobsdataa(0, 0, '', '', ' AND ID=' + this.Jobassignsdata.ID)
      .subscribe(
        (data11) => {
          if (data11['code'] == 200) {
            var normaldata = data11['data'];

            if (
              (normaldata[0].STATUS == 'AS' ||
                normaldata[0].STATUS == 'P' ||
                this.jobedit == true) &&
              normaldata[0].TRACK_STATUS != 'SJ' &&
              normaldata[0].STATUS != 'CO'
            ) {
              this.sheduledate = this.Jobassignsdata.EXPECTED_DATE_TIME;

              if (this.jobedit) {
                const currentDate = new Date(
                  this.Jobassignsdata.EXPECTED_DATE_TIME
                );

                // Extract the year, month, and day from the current date
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth(); // Month is 0-indexed
                const day = currentDate.getDate();

                // Combine the date and time
                const dateWithTime = new Date(
                  year,
                  month,
                  day,
                  ...this.Jobassignsdata.START_TIME.split(':').map(Number)
                );
                const dateWithTime1 = new Date(
                  year,
                  month,
                  day,
                  ...this.Jobassignsdata.END_TIME.split(':').map(Number)
                );

                this.STARTTIME = dateWithTime;
                this.ENDTIME = dateWithTime1;
              } else {
                this.STARTTIME = new Date(
                  this.Jobassignsdata.EXPECTED_DATE_TIME
                );
                let startMinutes = this.STARTTIME.getMinutes();
                if (
                  startMinutes != 0 &&
                  startMinutes != 10 &&
                  startMinutes != 20 &&
                  startMinutes != 30 &&
                  startMinutes != 40 &&
                  startMinutes != 50
                ) {
                  let roundedStartMinutes = Math.floor(startMinutes / 10) * 10;
                  this.STARTTIME.setMinutes(roundedStartMinutes);
                }
                this.ENDTIME = new Date(
                  this.STARTTIME.getTime() +
                  this.Jobassignsdata.ESTIMATED_TIME_IN_MIN * 60000
                );

                let startMinutes1 = this.ENDTIME.getMinutes();
                if (
                  startMinutes1 != 0 &&
                  startMinutes1 != 10 &&
                  startMinutes1 != 20 &&
                  startMinutes1 != 30 &&
                  startMinutes1 != 40 &&
                  startMinutes1 != 50
                ) {
                  let roundedStartMinutes1 =
                    Math.floor(startMinutes1 / 10) * 10;
                  this.ENDTIME.setMinutes(roundedStartMinutes1);
                }

                if (
                  this.datepipe.transform(
                    this.Jobassignsdata.EXPECTED_DATE_TIME,
                    'dd/MM/yyyy'
                  ) == this.datepipe.transform(new Date(), 'dd/MM/yyyy')
                ) {
                  const jobTime = this.datepipe.transform(
                    this.Jobassignsdata.EXPECTED_DATE_TIME,
                    'HH:mm'
                  );
                  const currentTime = this.datepipe.transform(
                    new Date(),
                    'HH:mm'
                  );
                  const currentTimedate = new Date();

                  if (jobTime && currentTime) {
                    if (jobTime < currentTime) {
                      // this.terriotrystarttime = currentTime;
                      this.STARTTIME = currentTimedate;

                      let startMinutes = this.STARTTIME.getMinutes();
                      if (
                        startMinutes != 0 &&
                        startMinutes != 10 &&
                        startMinutes != 20 &&
                        startMinutes != 30 &&
                        startMinutes != 40 &&
                        startMinutes != 50
                      ) {
                        if (startMinutes % 10 !== 0) {
                          let roundedStartMinutes =
                            Math.ceil(startMinutes / 10) * 10;
                          this.STARTTIME.setMinutes(roundedStartMinutes);
                        } else {
                          this.STARTTIME.setMinutes(startMinutes);
                        }
                      }

                      this.ENDTIME = new Date(
                        this.STARTTIME.getTime() +
                        this.Jobassignsdata.ESTIMATED_TIME_IN_MIN * 60000
                      );

                      let startMinutes1 = this.ENDTIME.getMinutes();
                      if (
                        startMinutes1 != 0 &&
                        startMinutes1 != 10 &&
                        startMinutes1 != 20 &&
                        startMinutes1 != 30 &&
                        startMinutes1 != 40 &&
                        startMinutes1 != 50
                      ) {
                        let roundedStartMinutes1 =
                          Math.floor(startMinutes1 / 10) * 10;
                        this.ENDTIME.setMinutes(roundedStartMinutes1);
                      }
                    } else {
                    }
                  }
                } else {
                }
              }

              this.assigndataa = [];
              this.assigndataa = dataaaa;

              this.Titleforassign =
                'Assign the ' +
                this.Jobassignsdata.JOB_CARD_NO +
                ' number to the ' +
                dataaaa.NAME;
              this.api
                .getjobsbetween(
                  0,
                  0,
                  'ID',
                  'desc',
                  '',
                  this.datepipe.transform(
                    this.Jobassignsdata.EXPECTED_DATE_TIME,
                    'yyyy-MM-dd'
                  ),
                  this.datepipe.transform(this.STARTTIME, 'HH:mm'),
                  this.datepipe.transform(this.ENDTIME, 'HH:mm'),
                  dataaaa.ID,
                  this.Jobassignsdata.LATTITUTE,
                  this.Jobassignsdata.LONGITUDE
                )
                .subscribe(
                  (data) => {
                    if (data['code'] == 200) {
                      this.jobdata = data['data'];

                      this.previousdata = this.jobdata.filter((data) => {
                        return data.PREVIOUS_JOB == 1;
                      });
                      this.nextdata = this.jobdata.filter((data) => {
                        return data.PREVIOUS_JOB == 0;
                      });
                      this.spinnn = false;
                      this.openModal = true;
                      setTimeout(() => {
                        this.disstrue = false;
                      }, 500);

                      if (this.previousdata.length > 0) {
                        this.distancecalculateforprevois =
                          data['preveousJob'].distance;
                      }

                      if (this.nextdata.length > 0) {
                        this.distancecalculatefornext =
                          data['nextJob'].distance;
                      }
                    } else {
                      this.message.error('Failed To Get Technician Data', '');
                      this.spinnn = false;
                    }
                  },
                  () => {
                    // this.message.error('Something Went Wrong', '');
                    this.spinnn = false;
                  }
                );
            } else {
              this.message.info('Job Already Assigned to Technician', '');
              this.spinnn = true;
              setTimeout(() => {
                this.spinnn = false;
                this.drawerClose();
              }, 500);
            }
          } else {
            this.spinnn = false;
          }
        },
        () => {
          this.message.error('Something Went Wrong', '');
          this.spinnn = false;
        }
      );
  }

  assignjobtotech() { }
  DATEEE: any;
  isspinnnnnnn = false;
  assigntechhdata() {
    this.isspinnnnnnn = true;
    if (
      this.sheduledate == undefined ||
      this.sheduledate == null ||
      this.sheduledate == ''
    ) {
      this.message.error('Please Shedule Date', '');
      this.isspinnnnnnn = false;
    } else if (
      this.STARTTIME == undefined ||
      this.STARTTIME == null ||
      this.STARTTIME == ''
    ) {
      this.message.error('Please Shedule Start Time', '');
      this.isspinnnnnnn = false;
    } else if (
      this.ENDTIME == undefined ||
      this.ENDTIME == null ||
      this.ENDTIME == ''
    ) {
      this.message.error('Please Shedule End Time', '');
      this.isspinnnnnnn = false;
    } else {
      this.api
        .getpendinjobsdataa(0, 0, '', '', ' AND ID=' + this.Jobassignsdata.ID)
        .subscribe(
          (data11) => {
            if (data11['code'] == 200) {
              var normaldata = data11['data'];

              var ok = false;
              if (this.alljobdata.length == normaldata.length) {
                ok = true;
              } else {
                ok = false;
              }

              if (
                (this.IS_ORDER_JOB == 'O' && ok) ||
                ((normaldata[0].STATUS == 'AS' ||
                  normaldata[0].STATUS == 'P' ||
                  this.jobedit == true) &&
                  normaldata[0].STATUS != 'SJ' &&
                  normaldata[0].STATUS != 'CO')
              ) {
                if (this.jobedit == true) {
                  var dataaaasssss = {
                    OLD_DATA: {
                      ...this.currentPopoverData,
                      START_TIME: this.Jobassignsdata.START_TIME,
                      END_TIME: this.Jobassignsdata.END_TIME,
                      SCHEDULED_DATE_TIME: this.Jobassignsdata.SCHEDULED_DATE_TIME,
                      JOB_CARD_NO: this.Jobassignsdata.JOB_CARD_NO,
                      TECHNICIAN_NAME: this.Jobassignsdata.TECHNICIAN_NAME,
                    },
                    CUSTOMER_ID: this.Jobassignsdata.CUSTOMER_ID,
                    TERRITORY_ID: this.Jobassignsdata.TERRITORY_ID,
                    TECHNICIAN_ID: this.assigndataa.ID,
                    TECHNICIAN_NAME: this.assigndataa.NAME,
                    DATE: this.datepipe.transform(this.sheduledate, 'yyyy-MM-dd'),
                    JOB_CARD_NO: this.Jobassignsdata.JOB_CARD_NO,
                    START_TIME: this.datepipe.transform(this.STARTTIME, 'HH:mm'),
                    END_TIME: this.datepipe.transform(this.ENDTIME, 'HH:mm'),
                    CLIENT_ID: 1,
                    ID: this.Jobassignsdata.ID,
                    ORDER_ID: this.Jobassignsdata.ORDER_ID,
                    SERVICE_ID: this.Jobassignsdata.SERVICE_ID,
                    USER_ID: this.userId,
                    ORGNISATION_ID: this.orgId,
                    VENDOR_ID: this.assigndataa.VENDOR_ID ? this.assigndataa.VENDOR_ID : 0,
                    CUSTOMER_MANAGER_ID: this.Jobassignsdata.CUSTOMER_MANAGER_ID ? this.Jobassignsdata.CUSTOMER_MANAGER_ID : 0
                  };
                  this.api
                    .updateassignshedule(dataaaasssss)
                    .subscribe((successCode) => {
                      if (successCode.code == '200') {
                        this.message.success(
                          'Job has been successfully updated.',
                          ''
                        );
                        this.isSpinning = true;
                        this.openModal = false;

                        this.drawerClose();
                        this.isSpinning = false;
                        this.isspinnnnnnn = false;
                      } else if (successCode.code == '300') {
                        this.message.info(
                          'This technician is already assigned to another job in this time slot.',
                          ''
                        );
                        this.isspinnnnnnn = false;
                        this.isSpinning = false;
                      } else {
                        this.message.error(
                          'failed to assigned job to technician',
                          ''
                        );
                        this.isspinnnnnnn = false;
                        this.isSpinning = false;
                      }
                    });
                } else {
                  var dataaaa = {};
                  var ORDER_DATA: any = [];
                  if (this.IS_ORDER_JOB == 'P') {
                    dataaaa = {
                      IS_ORDER_JOB: 'J',
                      CUSTOMER_ID: this.Jobassignsdata.CUSTOMER_ID,
                      TERRITORY_ID: this.Jobassignsdata.TERRITORY_ID,
                      TECHNICIAN_ID: this.assigndataa.ID,
                      TECHNICIAN_NAME: this.assigndataa.NAME,
                      DATE: this.datepipe.transform(this.sheduledate, 'yyyy-MM-dd'),
                      JOB_CARD_NO: this.Jobassignsdata.JOB_CARD_NO,
                      START_TIME: this.datepipe.transform(this.STARTTIME, 'HH:mm'),
                      END_TIME: this.datepipe.transform(this.ENDTIME, 'HH:mm'),
                      CLIENT_ID: 1,
                      ID: this.Jobassignsdata.ID,
                      ORDER_ID: this.Jobassignsdata.ORDER_ID,
                      SERVICE_ID: this.Jobassignsdata.SERVICE_ID,
                      ORDER_NO: this.Jobassignsdata.ORDER_NO,
                      USER_ID: this.userId,
                      ORGNISATION_ID: this.orgId,
                      ORDER_DATA: [],
                      VENDOR_ID: this.assigndataa.VENDOR_ID ? this.assigndataa.VENDOR_ID : 0,
                      CUSTOMER_MANAGER_ID: this.Jobassignsdata.CUSTOMER_MANAGER_ID ? this.Jobassignsdata.CUSTOMER_MANAGER_ID : 0
                    };
                  } else if (this.IS_ORDER_JOB == 'O') {
                    let previousEndTime: Date = new Date(this.STARTTIME);
                    ORDER_DATA = this.alljobdata.map((item, index) => {
                      if (index === 0) {
                        item.START_TIME = this.datepipe.transform(
                          this.STARTTIME,
                          'HH:mm'
                        );
                      } else {
                        item.START_TIME = this.datepipe.transform(
                          new Date(
                            new Date(previousEndTime).getTime() + 10 * 60000
                          ),
                          'HH:mm'
                        );
                      }
                      const currentDate = new Date(this.sheduledate);
                      const year = currentDate.getFullYear();
                      const month = currentDate.getMonth();
                      const day = currentDate.getDate();
                      const dateWithTime = new Date(
                        year,
                        month,
                        day,
                        ...item.START_TIME.split(':').map(Number)
                      );
                      const startTimeDate = new Date(dateWithTime);

                      const dateWithTime11 = new Date(
                        year,
                        month,
                        day,
                        ...item.START_TIME.split(':').map(Number)
                      );

                      const endTimeDate = new Date(
                        dateWithTime11.getTime() +
                        item.ESTIMATED_TIME_IN_MIN * 60000
                      );
                      previousEndTime = endTimeDate;

                      return {
                        ID: item.ID,
                        ORDER_ID: item.ORDER_ID,
                        ORDER_NO: item.ORDER_NO,
                        JOB_CARD_NO: item.JOB_CARD_NO,
                        CUSTOMER_ID: item.CUSTOMER_ID,
                        CUSTOMER_NAME: item.CUSTOMER_NAME,
                        SERVICE_ID: item.SERVICE_ID,
                        TERRITORY_ID: item.TERRITORY_ID,
                        TECHNICIAN_ID: this.assigndataa.ID,
                        TECHNICIAN_NAME: this.assigndataa.NAME,
                        ESTIMATED_TIME_IN_MIN: item.ESTIMATED_TIME_IN_MIN,
                        DATE: this.datepipe.transform(
                          this.sheduledate,
                          'yyyy-MM-dd'
                        ),
                        START_TIME: item.START_TIME,
                        END_TIME: this.datepipe.transform(endTimeDate, 'HH:mm'),
                        USER_ID: this.userId,
                        ORGNISATION_ID: this.orgId,
                      };
                    });

                    dataaaa = {
                      IS_ORDER_JOB: 'O',
                      CUSTOMER_ID: this.Jobassignsdata.CUSTOMER_ID,
                      TERRITORY_ID: this.Jobassignsdata.TERRITORY_ID,
                      TECHNICIAN_ID: this.assigndataa.ID,
                      TECHNICIAN_NAME: this.assigndataa.NAME,
                      DATE: this.datepipe.transform(this.sheduledate, 'yyyy-MM-dd'),
                      JOB_CARD_NO: this.Jobassignsdata.JOB_CARD_NO,
                      START_TIME: this.datepipe.transform(this.STARTTIME, 'HH:mm'),
                      END_TIME: this.datepipe.transform(this.ENDTIME, 'HH:mm'),
                      CLIENT_ID: 1,
                      ID: this.Jobassignsdata.ID,
                      ORDER_ID: this.Jobassignsdata.ORDER_ID,
                      ORDER_NO: this.Jobassignsdata.ORDER_NO,
                      SERVICE_ID: this.Jobassignsdata.SERVICE_ID,
                      USER_ID: this.userId,
                      ORGNISATION_ID: this.orgId,
                      ORDER_DATA: ORDER_DATA,
                      VENDOR_ID: this.assigndataa.VENDOR_ID ? this.assigndataa.VENDOR_ID : 0,
                      CUSTOMER_MANAGER_ID: this.Jobassignsdata.CUSTOMER_MANAGER_ID ? this.Jobassignsdata.CUSTOMER_MANAGER_ID : 0
                    };
                  }

                  this.api
                    .createassignshedule(dataaaa)
                    .subscribe((successCode) => {
                      if (successCode.code == '200') {
                        this.message.success(
                          'Job assigned to technician Successfully',
                          ''
                        );
                        this.isSpinning = true;
                        this.openModal = false;
                        this.drawerClose();
                        this.isSpinning = false;
                        this.isspinnnnnnn = false;
                      } else if (successCode.code == '300') {
                        this.message.info(
                          'Technician is already assigned to other job at same time',
                          ''
                        );
                        this.isspinnnnnnn = false;
                        this.isSpinning = false;
                      } else {
                        this.message.error(
                          'failed to assigned job to technician',
                          ''
                        );
                        this.isspinnnnnnn = false;
                        this.isSpinning = false;
                      }
                    });
                }
              } else {
                if (this.IS_ORDER_JOB == 'O' && ok) {
                  const dataJobCardNos = new Set(
                    data11['data'].map((item) => item.JOB_CARD_NO)
                  );
                  this.newalljobarray = data11['data'];
                  this.missingJobCardNos = '';
                  this.missingJobCardNos = this.alljobdata
                    .filter((item) => !dataJobCardNos.has(item.JOB_CARD_NO))
                    .map((item) => item.JOB_CARD_NO);
                  this.message.info(
                    'Job count is missing',
                    this.missingJobCardNos
                  );
                  this.spinnn = false;
                  this.openmissingmodel = true;
                } else {
                  this.message.info('Job Already Assigned to Technician', '');
                  this.spinnn = true;
                  setTimeout(() => {
                    this.spinnn = false;
                    this.drawerClose();
                  }, 500);
                }
              }
            } else {
            }
          },
          () => {
            this.message.error('Something Went Wrong', '');
            this.spinnn = false;
          }
        );
    }
  }

  closemodelll() {
    this.openModal = false;
    this.assigndataa = [];

    this.disstrue = true;
  }

  STARTTIME: any;
  ENDTIME: any;

  timeslottt = [
    { KEY: '00:00', VALUE: '00:00' },
    { KEY: '00:10', VALUE: '00:10' },
    { KEY: '00:20', VALUE: '00:20' },
    { KEY: '00:30', VALUE: '00:30' },
    { KEY: '00:40', VALUE: '00:40' },
    { KEY: '00:50', VALUE: '00:50' },
    { KEY: '01:00', VALUE: '01:00' },
    { KEY: '01:10', VALUE: '01:10' },
    { KEY: '01:20', VALUE: '01:20' },
    { KEY: '01:30', VALUE: '01:30' },
    { KEY: '01:40', VALUE: '01:40' },
    { KEY: '01:50', VALUE: '01:50' },
    { KEY: '02:00', VALUE: '02:00' },
    { KEY: '02:10', VALUE: '02:10' },
    { KEY: '02:20', VALUE: '02:20' },
    { KEY: '02:30', VALUE: '02:30' },
    { KEY: '02:40', VALUE: '02:40' },
    { KEY: '02:50', VALUE: '02:50' },
    { KEY: '03:00', VALUE: '03:00' },
    { KEY: '03:10', VALUE: '03:10' },
    { KEY: '03:20', VALUE: '03:20' },
    { KEY: '03:30', VALUE: '03:30' },
    { KEY: '03:40', VALUE: '03:40' },
    { KEY: '03:50', VALUE: '03:50' },
    { KEY: '04:00', VALUE: '04:00' },
    { KEY: '04:10', VALUE: '04:10' },
    { KEY: '04:20', VALUE: '04:20' },
    { KEY: '04:30', VALUE: '04:30' },
    { KEY: '04:40', VALUE: '04:40' },
    { KEY: '04:50', VALUE: '04:50' },
    { KEY: '05:00', VALUE: '05:00' },
    { KEY: '05:10', VALUE: '05:10' },
    { KEY: '05:20', VALUE: '05:20' },
    { KEY: '05:30', VALUE: '05:30' },
    { KEY: '05:40', VALUE: '05:40' },
    { KEY: '05:50', VALUE: '05:50' },
    { KEY: '06:00', VALUE: '06:00' },
    { KEY: '06:10', VALUE: '06:10' },
    { KEY: '06:20', VALUE: '06:20' },
    { KEY: '06:30', VALUE: '06:30' },
    { KEY: '06:40', VALUE: '06:40' },
    { KEY: '06:50', VALUE: '06:50' },
    { KEY: '07:00', VALUE: '07:00' },
    { KEY: '07:10', VALUE: '07:10' },
    { KEY: '07:20', VALUE: '07:20' },
    { KEY: '07:30', VALUE: '07:30' },
    { KEY: '07:40', VALUE: '07:40' },
    { KEY: '07:50', VALUE: '07:50' },
    { KEY: '08:00', VALUE: '08:00' },
    { KEY: '08:10', VALUE: '08:10' },
    { KEY: '08:20', VALUE: '08:20' },
    { KEY: '08:30', VALUE: '08:30' },
    { KEY: '08:40', VALUE: '08:40' },
    { KEY: '08:50', VALUE: '08:50' },
    { KEY: '09:00', VALUE: '09:00' },
    { KEY: '09:10', VALUE: '09:10' },
    { KEY: '09:20', VALUE: '09:20' },
    { KEY: '09:30', VALUE: '09:30' },
    { KEY: '09:40', VALUE: '09:40' },
    { KEY: '09:50', VALUE: '09:50' },
    { KEY: '10:00', VALUE: '10:00' },
    { KEY: '10:10', VALUE: '10:10' },
    { KEY: '10:20', VALUE: '10:20' },
    { KEY: '10:30', VALUE: '10:30' },
    { KEY: '10:40', VALUE: '10:40' },
    { KEY: '10:50', VALUE: '10:50' },
    { KEY: '11:00', VALUE: '11:00' },
    { KEY: '11:10', VALUE: '11:10' },
    { KEY: '11:20', VALUE: '11:20' },
    { KEY: '11:30', VALUE: '11:30' },
    { KEY: '11:40', VALUE: '11:40' },
    { KEY: '11:50', VALUE: '11:50' },
    { KEY: '12:00', VALUE: '12:00' },
    { KEY: '12:10', VALUE: '12:10' },
    { KEY: '12:20', VALUE: '12:20' },
    { KEY: '12:30', VALUE: '12:30' },
    { KEY: '12:40', VALUE: '12:40' },
    { KEY: '12:50', VALUE: '12:50' },
    { KEY: '13:00', VALUE: '13:00' },
    { KEY: '13:10', VALUE: '13:10' },
    { KEY: '13:20', VALUE: '13:20' },
    { KEY: '13:30', VALUE: '13:30' },
    { KEY: '13:40', VALUE: '13:40' },
    { KEY: '13:50', VALUE: '13:50' },
    { KEY: '14:00', VALUE: '14:00' },
    { KEY: '14:10', VALUE: '14:10' },
    { KEY: '14:20', VALUE: '14:20' },
    { KEY: '14:30', VALUE: '14:30' },
    { KEY: '14:40', VALUE: '14:40' },
    { KEY: '14:50', VALUE: '14:50' },
    { KEY: '15:00', VALUE: '15:00' },
    { KEY: '15:10', VALUE: '15:10' },
    { KEY: '15:20', VALUE: '15:20' },
    { KEY: '15:30', VALUE: '15:30' },
    { KEY: '15:40', VALUE: '15:40' },
    { KEY: '15:50', VALUE: '15:50' },
    { KEY: '16:00', VALUE: '16:00' },
    { KEY: '16:10', VALUE: '16:10' },
    { KEY: '16:20', VALUE: '16:20' },
    { KEY: '16:30', VALUE: '16:30' },
    { KEY: '16:40', VALUE: '16:40' },
    { KEY: '16:50', VALUE: '16:50' },
    { KEY: '17:00', VALUE: '17:00' },
    { KEY: '17:10', VALUE: '17:10' },
    { KEY: '17:20', VALUE: '17:20' },
    { KEY: '17:30', VALUE: '17:30' },
    { KEY: '17:40', VALUE: '17:40' },
    { KEY: '17:50', VALUE: '17:50' },
    { KEY: '18:00', VALUE: '18:00' },
    { KEY: '18:10', VALUE: '18:10' },
    { KEY: '18:20', VALUE: '18:20' },
    { KEY: '18:30', VALUE: '18:30' },
    { KEY: '18:40', VALUE: '18:40' },
    { KEY: '18:50', VALUE: '18:50' },
    { KEY: '19:00', VALUE: '19:00' },
    { KEY: '19:10', VALUE: '19:10' },
    { KEY: '19:20', VALUE: '19:20' },
    { KEY: '19:30', VALUE: '19:30' },
    { KEY: '19:40', VALUE: '19:40' },
    { KEY: '19:50', VALUE: '19:50' },
    { KEY: '20:00', VALUE: '20:00' },
    { KEY: '20:10', VALUE: '20:10' },
    { KEY: '20:20', VALUE: '20:20' },
    { KEY: '20:30', VALUE: '20:30' },
    { KEY: '20:40', VALUE: '20:40' },
    { KEY: '20:50', VALUE: '20:50' },
    { KEY: '21:00', VALUE: '21:00' },
    { KEY: '21:10', VALUE: '21:10' },
    { KEY: '21:20', VALUE: '21:20' },
    { KEY: '21:30', VALUE: '21:30' },
    { KEY: '21:40', VALUE: '21:40' },
    { KEY: '21:50', VALUE: '21:50' },
    { KEY: '22:00', VALUE: '22:00' },
    { KEY: '22:10', VALUE: '22:10' },
    { KEY: '22:20', VALUE: '22:20' },
    { KEY: '22:30', VALUE: '22:30' },
    { KEY: '22:40', VALUE: '22:40' },
    { KEY: '22:50', VALUE: '22:50' },
    { KEY: '23:00', VALUE: '23:00' },
    { KEY: '23:10', VALUE: '23:10' },
    { KEY: '23:20', VALUE: '23:20' },
    { KEY: '23:30', VALUE: '23:30' },
    { KEY: '23:40', VALUE: '23:40' },
    { KEY: '23:50', VALUE: '23:50' },
  ];

  applyFilter() {
    //

    this.spinnn = true;

    var SortOrder = this.checkboxList
      .filter((item) => item.checked)
      .map((item, index) => ({
        KEY: item.KEY,
        VALUE: item.VALUE,
        SEQUENCE: index + 1,
      }));

    var dataaa = [
      {
        ...this.Jobassignsdata,
      },
    ];
    var filter = this.IS_REMOTE_JOB == 1 ? 'R' : this.TECHNICIAN_TYPE;
    this.api
      .gettechciansheduledata(
        0,
        0,
        '',
        '',
        '',
        dataaa,
        SortOrder,
        filter,
        this.Jobassignsdata.CUSTOMER_ID,
        this.Jobassignsdata.CUSTOMER_TYPE,
        this.roleids === 9 || this.roleids === '9' ? this.vendor_id : 0,
        this.roleids === 9 || this.roleids === '9' ? 'V' : 'O'
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.techData = data['data'];
            this.dublicatetechData = data['data'];
            this.spinnn = false;
            this.showMainFilter();
          } else {
            this.techData = [];
            this.spinnn = false;
            this.message.error('Failed To Get Technician Data', '');
          }
        },
        () => {
          // this.message.error('Something Went Wrong', '');
        }
      );
  }
  sheduledate: any;
  isDisabled(timeSlot: string): boolean {
    if (!this.STARTTIME) {
      return false; // Enable all options if no Start Time is selected
    }
    return timeSlot <= this.STARTTIME;
  }
  onStartTimeChange(startTime: string): void {
    this.STARTTIME = startTime;
    this.ENDTIME = null; // Reset End Time if Start Time changes
  }

  initDistanceCalculation(
    orderLocation: any,
    technicianLocation: any
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!orderLocation || !technicianLocation) {
        reject('Both orderLocation and technicianLocation are required.');
        return;
      }

      const orderLat = parseFloat(orderLocation.LOCATION_LATITUDE);
      const orderLng = parseFloat(orderLocation.LOCATION_LONG);
      const techLat = parseFloat(technicianLocation.LOCATION_LATITUDE);
      const techLng = parseFloat(technicianLocation.LOCATION_LONG);

      if (
        isNaN(orderLat) ||
        isNaN(orderLng) ||
        isNaN(techLat) ||
        isNaN(techLng)
      ) {
        reject('Invalid latitude or longitude values provided.');
        return;
      }

      const directionsService = new google.maps.DirectionsService();

      const request = {
        origin: new google.maps.LatLng(orderLat, orderLng),
        destination: new google.maps.LatLng(techLat, techLng),
        travelMode: google.maps.TravelMode.DRIVING, // Use DRIVING to calculate road distance
      };

      directionsService.route(request, (result, status) => {
        if (
          status === google.maps.DirectionsStatus.OK &&
          result.routes.length > 0
        ) {
          const totalDistance = result.routes[0].legs.reduce(
            (sum: number, leg: any) => sum + leg.distance.value,
            0
          );
          const distanceInKm = (totalDistance / 1000).toFixed(2); // Distance in kilometers with 2 decimals
          resolve(`${distanceInKm} km`);
        } else {
          reject(`Directions request failed due to ${status}`);
        }
      });
    });
  }

  // this.timeDifference = this.calculateTimeDifference(this.jobStartTime, this.technicianStartTime);
  calculateTimeDifference(start: string, end: any): string {
    const startTime = new Date(start);
    const endTime = new Date(end);

    const diffInMilliseconds = endTime.getTime() - startTime.getTime();
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;

    return `${hours} hours ${minutes} minutes`;
  }

  calculateTimeDifference11(start: any, end: any): string {
    // Get the current date
    const currentDate = new Date(this.sheduledate);

    // Extract the year, month, and day from the current date
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); // Month is 0-indexed
    const day = currentDate.getDate();

    // Combine the date and time
    const dateWithTime = new Date(
      year,
      month,
      day,
      ...end.split(':').map(Number)
    );
    end = dateWithTime;
    const startTime = new Date(start);
    const endTime = new Date(end);

    const diffInMilliseconds = endTime.getTime() - startTime.getTime();
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;

    return `${hours} hours ${minutes} minutes`;
  }
  calculateTimeDifference1111(start: any, end: any): string {
    // Get the current date
    const currentDate = new Date(this.sheduledate);

    // Extract the year, month, and day from the current date
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); // Month is 0-indexed
    const day = currentDate.getDate();

    // Combine the date and time
    const dateWithTime = new Date(
      year,
      month,
      day,
      ...start.split(':').map(Number)
    );
    start = dateWithTime;
    const startTime = new Date(start);
    const endTime = new Date(end);

    const diffInMilliseconds = endTime.getTime() - startTime.getTime();
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;

    return `${hours} hours ${minutes} minutes`;
  }

  disabledHours = (): number[] => {
    const hours: number[] = [];
    const beforeHour = parseInt(this.terriotrystarttime.split(':')[0], 10);
    const afterHour = parseInt(this.terriotryendtime.split(':')[0], 10);

    for (let i = 0; i < 24; i++) {
      if (i < beforeHour || i > afterHour) {
        hours.push(i);
      }
    }
    return hours;
  };

  disabledMinutes = (hour: number): number[] => {
    const beforeHour = parseInt(this.terriotrystarttime.split(':')[0], 10);
    const beforeMinute = parseInt(this.terriotrystarttime.split(':')[1], 10);

    const afterHour = parseInt(this.terriotryendtime.split(':')[0], 10);
    const afterMinute = parseInt(this.terriotryendtime.split(':')[1], 10);

    const allowedMinutes = [0, 10, 20, 30, 40, 50]; // Allowed minute intervals

    // Disable minutes before terriotrystarttime
    if (hour === beforeHour) {
      return Array.from({ length: 60 }, (_, i) => i).filter(
        (minute) => minute < beforeMinute || !allowedMinutes.includes(minute)
      );
    }

    // Disable minutes after terriotryendtime
    if (hour === afterHour) {
      return Array.from({ length: 60 }, (_, i) => i).filter(
        (minute) => minute > afterMinute || !allowedMinutes.includes(minute)
      );
    }

    // For other hours, disable all minutes not divisible by 10
    return Array.from({ length: 60 }, (_, i) => i).filter(
      (minute) => !allowedMinutes.includes(minute)
    );
  };

  datachange(event: any) {
    this.ENDTIME = new Date(
      event.getTime() + this.Jobassignsdata.ESTIMATED_TIME_IN_MIN * 60000
    );
  }

  roundNumber(value: any): number | string {
    const [integerPart, decimalPart] = value.toString().split('.');

    if (decimalPart === '00') {
      return parseInt(integerPart, 10); // Return integer part
    }

    return value; // Return original value as is
  }

  openmodell: boolean = false;
  cancel() {
    this.openmodell = false;
  }

  showconfirmation() {
    if (
      this.sheduledate == undefined ||
      this.sheduledate == null ||
      this.sheduledate == ''
    ) {
      this.message.error('Please Shedule Date', '');
      this.isspinnnnnnn = false;
    } else if (
      this.STARTTIME == undefined ||
      this.STARTTIME == null ||
      this.STARTTIME == ''
    ) {
      this.message.error('Please Shedule Start Time', '');
      this.isspinnnnnnn = false;
    } else if (
      this.ENDTIME == undefined ||
      this.ENDTIME == null ||
      this.ENDTIME == ''
    ) {
      this.message.error('Please Shedule End Time', '');
      this.isspinnnnnnn = false;
    } else {
      this.openmodell = true;
    }
  }

  disabledHours1 = (): number[] => {
    if (!this.STARTTIME || !this.terriotryendtime) {
      return [];
    }

    // Ensure STARTTIME and terriotryendtime are strings
    const startTime =
      typeof this.STARTTIME === 'string'
        ? this.STARTTIME
        : this.datepipe.transform(this.STARTTIME, 'HH:mm');
    const territoryEndTime =
      typeof this.terriotryendtime === 'string'
        ? this.terriotryendtime
        : this.datepipe.transform(this.terriotryendtime, 'HH:mm');

    if (!startTime || !territoryEndTime) {
      return [];
    }

    const startHour = parseInt(startTime.split(':')[0], 10);
    const endHour = parseInt(territoryEndTime.split(':')[0], 10);

    const hours: number[] = [];
    for (let i = 0; i < 24; i++) {
      if (i < startHour || i > endHour) {
        hours.push(i);
      }
    }
    return hours;
  };
  disabledMinutes1 = (hour: number): number[] => {
    if (!this.STARTTIME || !this.terriotryendtime) {
      return [];
    }

    // Ensure STARTTIME and terriotryendtime are strings
    const startTime =
      typeof this.STARTTIME === 'string'
        ? this.STARTTIME
        : this.datepipe.transform(this.STARTTIME, 'HH:mm');
    const territoryEndTime =
      typeof this.terriotryendtime === 'string'
        ? this.terriotryendtime
        : this.datepipe.transform(this.terriotryendtime, 'HH:mm');

    if (!startTime || !territoryEndTime) {
      return [];
    }

    const startHour = parseInt(startTime.split(':')[0], 10);
    const startMinute = parseInt(startTime.split(':')[1], 10);

    const endHour = parseInt(territoryEndTime.split(':')[0], 10);
    const endMinute = parseInt(territoryEndTime.split(':')[1], 10);

    const allowedMinutes = [0, 10, 20, 30, 40, 50];

    if (hour === startHour) {
      return Array.from({ length: 60 }, (_, i) => i).filter(
        (minute) => minute < startMinute || !allowedMinutes.includes(minute)
      );
    }

    if (hour === endHour) {
      return Array.from({ length: 60 }, (_, i) => i).filter(
        (minute) => minute > endMinute || !allowedMinutes.includes(minute)
      );
    }

    return Array.from({ length: 60 }, (_, i) => i).filter(
      (minute) => !allowedMinutes.includes(minute)
    );
  };

  disstrue: boolean = true;

  getbetweendata(event) {
    this.isspinnnnnnn = false;

    this.api
      .getjobsbetween(
        0,
        0,
        'ID',
        'desc',
        '',
        this.datepipe.transform(this.sheduledate, 'yyyy-MM-dd'),
        this.datepipe.transform(this.STARTTIME, 'HH:mm'),
        this.datepipe.transform(this.ENDTIME, 'HH:mm'),
        this.assigndataa.ID,
        this.Jobassignsdata.LATTITUTE,
        this.Jobassignsdata.LONGITUDE
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.jobdata = data['data'];
            this.jobdata = this.jobdata.filter((data) => {
              return data.ID != this.Jobassignsdata.ID;
            });

            this.previousdata = this.jobdata.filter((data) => {
              return data.PREVIOUS_JOB == 1;
            });
            this.nextdata = this.jobdata.filter((data) => {
              return data.PREVIOUS_JOB == 0;
            });

            if (this.previousdata.length > 0) {
              this.distancecalculateforprevois = data['preveousJob'].distance;
            }

            if (this.nextdata.length > 0) {
              this.distancecalculatefornext = data['nextJob'].distance;
            }

            this.openModal = true;
            setTimeout(() => {
              this.disstrue = false;
            }, 500);
            this.isspinnnnnnn = false;
          } else {
            this.message.error('Failed To Get Technician Data', '');
            this.isspinnnnnnn = false;
          }
        },
        () => { }
      );
  }

  getbetweendatastart(event) {
    this.isspinnnnnnn = false;
    this.ENDTIME = new Date(
      event.getTime() + this.SERVICE_DATA.ESTIMATED_TIME_IN_MIN * 60000
    );
    this.api
      .getjobsbetween(
        0,
        0,
        'ID',
        'desc',
        '',
        this.datepipe.transform(this.sheduledate, 'yyyy-MM-dd'),
        this.datepipe.transform(event, 'HH:mm'),
        this.datepipe.transform(this.ENDTIME, 'HH:mm'),
        this.assigndataa.ID,
        this.Jobassignsdata.LATTITUTE,
        this.Jobassignsdata.LONGITUDE
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.jobdata = data['data'];
            this.jobdata = this.jobdata.filter((data) => {
              return data.ID != this.Jobassignsdata.ID;
            });

            this.previousdata = this.jobdata.filter((data) => {
              return data.PREVIOUS_JOB == 1;
            });
            this.nextdata = this.jobdata.filter((data) => {
              return data.PREVIOUS_JOB == 0;
            });

            this.openModal = true;
            setTimeout(() => {
              this.disstrue = false;
            }, 500);
            if (this.previousdata.length > 0) {
              this.distancecalculateforprevois = data['preveousJob'].distance;
            }

            if (this.nextdata.length > 0) {
              this.distancecalculatefornext = data['nextJob'].distance;
            }
            this.isspinnnnnnn = false;
          } else {
            this.message.error('Failed To Get Technician Data', '');
            this.isspinnnnnnn = false;
          }
        },
        () => { }
      );
  }
  getbetweendataend(event) {
    this.isspinnnnnnn = false;

    this.api
      .getjobsbetween(
        0,
        0,
        'ID',
        'desc',
        '',
        this.datepipe.transform(this.sheduledate, 'yyyy-MM-dd'),
        this.datepipe.transform(this.STARTTIME, 'HH:mm'),
        this.datepipe.transform(event, 'HH:mm'),
        this.assigndataa.ID,
        this.Jobassignsdata.LATTITUTE,
        this.Jobassignsdata.LONGITUDE
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.jobdata = data['data'];
            this.jobdata = this.jobdata.filter((data) => {
              return data.ID != this.Jobassignsdata.ID;
            });

            this.previousdata = this.jobdata.filter((data) => {
              return data.PREVIOUS_JOB == 1;
            });
            this.nextdata = this.jobdata.filter((data) => {
              return data.PREVIOUS_JOB == 0;
            });
            if (this.previousdata.length > 0) {
              this.distancecalculateforprevois = data['preveousJob'].distance;
            }

            if (this.nextdata.length > 0) {
              this.distancecalculatefornext = data['nextJob'].distance;
            }
            this.openModal = true;
            setTimeout(() => {
              this.disstrue = false;
            }, 500);
            this.isspinnnnnnn = false;
          } else {
            this.message.error('Failed To Get Technician Data', '');
            this.isspinnnnnnn = false;
          }
        },
        () => { }
      );
  }
  assigntechdataaa: any;
  assgnorderopen(dataaaa) {
    this.assigntechdataaa = dataaaa;
    this.spinnn = true;
    this.api
      .getpendinjobsdataa(
        0,
        0,
        '',
        '',
        ' AND STATUS = "P" AND ORDER_NO="' + this.Jobassignsdata.ORDER_NO + '"'
      )
      .subscribe(
        (data11) => {
          if (data11['code'] == 200) {
            var normaldata = data11['data'];
            var ok = false;
            if (this.alljobdata.length == normaldata.length) {
              ok = true;
            } else {
              ok = false;
            }

            if (ok) {
              this.sheduledate = this.Jobassignsdata.EXPECTED_DATE_TIME;

              this.STARTTIME = new Date(this.Jobassignsdata.EXPECTED_DATE_TIME);
              let startMinutes = this.STARTTIME.getMinutes();
              if (
                startMinutes != 0 &&
                startMinutes != 10 &&
                startMinutes != 20 &&
                startMinutes != 30 &&
                startMinutes != 40 &&
                startMinutes != 50
              ) {
                let roundedStartMinutes = Math.floor(startMinutes / 10) * 10;
                this.STARTTIME.setMinutes(roundedStartMinutes);
              }
              this.ENDTIME = new Date(
                this.STARTTIME.getTime() +
                this.SERVICE_DATA.ESTIMATED_TIME_IN_MIN * 60000
              );

              let startMinutes1 = this.ENDTIME.getMinutes();
              if (
                startMinutes1 != 0 &&
                startMinutes1 != 10 &&
                startMinutes1 != 20 &&
                startMinutes1 != 30 &&
                startMinutes1 != 40 &&
                startMinutes1 != 50
              ) {
                let roundedStartMinutes1 = Math.floor(startMinutes1 / 10) * 10;
                this.ENDTIME.setMinutes(roundedStartMinutes1);
              }

              if (
                this.datepipe.transform(
                  this.Jobassignsdata.EXPECTED_DATE_TIME,
                  'dd/MM/yyyy'
                ) == this.datepipe.transform(new Date(), 'dd/MM/yyyy')
              ) {
                const jobTime = this.datepipe.transform(
                  this.Jobassignsdata.EXPECTED_DATE_TIME,
                  'HH:mm'
                );
                const currentTime = this.datepipe.transform(
                  new Date(),
                  'HH:mm'
                );
                const currentTimedate = new Date();

                if (jobTime && currentTime) {
                  if (jobTime < currentTime) {
                    // this.terriotrystarttime = currentTime;
                    this.STARTTIME = currentTimedate;

                    let startMinutes = this.STARTTIME.getMinutes();
                    if (
                      startMinutes != 0 &&
                      startMinutes != 10 &&
                      startMinutes != 20 &&
                      startMinutes != 30 &&
                      startMinutes != 40 &&
                      startMinutes != 50
                    ) {
                      if (startMinutes % 10 !== 0) {
                        let roundedStartMinutes =
                          Math.ceil(startMinutes / 10) * 10;
                        this.STARTTIME.setMinutes(roundedStartMinutes);
                      } else {
                        this.STARTTIME.setMinutes(startMinutes);
                      }
                    }

                    this.ENDTIME = new Date(
                      this.STARTTIME.getTime() +
                      this.SERVICE_DATA.ESTIMATED_TIME_IN_MIN * 60000
                    );

                    let startMinutes1 = this.ENDTIME.getMinutes();
                    if (
                      startMinutes1 != 0 &&
                      startMinutes1 != 10 &&
                      startMinutes1 != 20 &&
                      startMinutes1 != 30 &&
                      startMinutes1 != 40 &&
                      startMinutes1 != 50
                    ) {
                      let roundedStartMinutes1 =
                        Math.floor(startMinutes1 / 10) * 10;
                      this.ENDTIME.setMinutes(roundedStartMinutes1);
                    }
                  } else {
                  }
                }
              }

              this.assigndataa = [];
              this.assigndataa = dataaaa;

              this.Titleforassign =
                'Assign the ' +
                this.Jobassignsdata.ORDER_NO +
                ' number to the ' +
                dataaaa.NAME;
              this.api
                .getjobsbetween(
                  0,
                  0,
                  'ID',
                  'desc',
                  '',
                  this.datepipe.transform(
                    this.Jobassignsdata.EXPECTED_DATE_TIME,
                    'yyyy-MM-dd'
                  ),
                  this.datepipe.transform(this.STARTTIME, 'HH:mm'),
                  this.datepipe.transform(this.ENDTIME, 'HH:mm'),
                  dataaaa.ID,
                  this.Jobassignsdata.LATTITUTE,
                  this.Jobassignsdata.LONGITUDE
                )
                .subscribe(
                  (data) => {
                    if (data['code'] == 200) {
                      this.jobdata = data['data'];

                      this.previousdata = this.jobdata.filter((data) => {
                        return data.PREVIOUS_JOB == 1;
                      });
                      this.nextdata = this.jobdata.filter((data) => {
                        return data.PREVIOUS_JOB == 0;
                      });
                      this.spinnn = false;
                      this.openModal = true;
                      setTimeout(() => {
                        this.disstrue = false;
                      }, 500);
                      if (this.previousdata.length > 0) {
                        this.distancecalculateforprevois =
                          data['preveousJob'].distance;
                      }

                      if (this.nextdata.length > 0) {
                        this.distancecalculatefornext =
                          data['nextJob'].distance;
                      }
                    } else {
                      this.message.error('Failed To Get Technician Data', '');
                      this.spinnn = false;
                    }
                  },
                  () => {
                    // this.message.error('Something Went Wrong', '');
                    this.spinnn = false;
                  }
                );
            } else {
              const dataJobCardNos = new Set(
                data11['data'].map((item) => item.JOB_CARD_NO)
              );
              this.newalljobarray = data11['data'];
              this.missingJobCardNos = '';
              this.missingJobCardNos = this.alljobdata
                .filter((item) => !dataJobCardNos.has(item.JOB_CARD_NO))
                .map((item) => item.JOB_CARD_NO);
              this.message.info('Job count is missing', this.missingJobCardNos);
              this.spinnn = false;
              this.openmissingmodel = true;
            }
          } else {
            this.spinnn = false;
          }
        },
        () => {
          this.message.error('Something Went Wrong', '');
          this.spinnn = false;
        }
      );
  }
  missingJobCardNos: any;
  newalljobarray = [];
  gettimedataa() {
    if (this.IS_ORDER_JOB == 'O' || this.IS_ORDER_JOB == 'P') {
      const currentDate = new Date(this.sheduledate);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const day = currentDate.getDate();
      const dateWithTime = new Date(
        year,
        month,
        day,
        ...this.terriotryendtime.split(':').map(Number)
      );

      const todayEndTime = new Date(dateWithTime);

      return this.ENDTIME > todayEndTime
        ? 'The order is crossing the territorys end time.'
        : '';
    } else {
      return '';
    }
  }

  gettimedataa111() {
    if (this.IS_ORDER_JOB == 'O' || this.IS_ORDER_JOB == 'P') {
      const currentDate = new Date(this.sheduledate);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const day = currentDate.getDate();

      // Parse the END TIME as a Date object
      const endTimeDate = new Date(this.ENDTIME);

      // Check if END TIME is crossing into the next day
      const isCrossingNextDay =
        endTimeDate.getDate() > day ||
        (endTimeDate.getDate() === day + 1 && endTimeDate.getHours() > 0);

      if (isCrossingNextDay) {
        this.showbutton = false;
        return 'The order crosses into the next day. Please adjust the time or schedule a specific job.';
      } else {
        this.showbutton = true;
        return '';
      }
    } else {
      this.showbutton = true;
      return '';
    }
  }

  isspinnnnnnnmising: boolean = false;
  openmissingmodel: boolean = false;

  showbutton: boolean = true;
  continemissingorder() {
    this.isspinnnnnnnmising = true;
    this.alljobdata = this.newalljobarray;

    this.SERVICE_DATA.ESTIMATED_TIME_IN_MIN = this.alljobdata.reduce(
      (total, item) => total + item.ESTIMATED_TIME_IN_MIN,
      0
    );

    if (this.alljobdata.length > 1) {
      var lenggth = this.alljobdata.length - 1;
      var addmin = lenggth * 10;
      this.SERVICE_DATA.ESTIMATED_TIME_IN_MIN =
        this.SERVICE_DATA.ESTIMATED_TIME_IN_MIN + addmin;
    }

    this.openmissingmodel = false;
    this.openModal = false;
    this.openmodell = false;
    this.isspinnnnnnnmising = false;
    this.getTechnicianData();
  }

  cancelmising() {
    this.openmissingmodel = false;
    this.openModal = false;
    this.openmodell = false;
    this.drawerClose();
  }

  roundRating(rating: number): number {
    if (rating !== null && rating !== undefined && rating > 0) {
      return Math.round(rating * 2) / 2;
    } else {
      return 0;
    }
  }
  getconditio() {
    return this.showbutton ? 'true' : 'false';
  }

  // apiKey = 'AIzaSyA1EJJ0RMDQwzsDd00Oziy1pytYn_Ozi-g';
  apiKey = 'AIzaSyBOL8XUOxJicHzlQRGi27Wdn5M3zazFKTU';

  setLocation() {
    const technician = this.technician;

    if (!technician || technician.length === 0) {
      this.message.error('No technician location data available.', '');
      return;
    }

    const locations = technician
      .map((loc: any) => ({
        name: loc.TECHNICIAN_NAME,
        lat: parseFloat(loc.LOCATION_LATITUDE),
        lng: parseFloat(loc.LOCATION_LONG),
        TYPE: loc.TYPE,
      }))
      .filter((loc: any) => !isNaN(loc.lat) && !isNaN(loc.lng));

    if (locations.length === 0) {
      this.message.error('No valid locations found for the technician.', '');
      return;
    }

    // Initialize Google Map
    const map = new google.maps.Map(
      document.getElementById('map') as HTMLElement,
      {
        center: { lat: locations[0].lat, lng: locations[0].lng },
        zoom: 14,
        mapTypeId: 'roadmap',
      }
    );

    const bounds = new google.maps.LatLngBounds();

    // Add markers
    locations.forEach((point, index) => {
      const marker = new google.maps.Marker({
        position: { lat: point.lat, lng: point.lng },
        map: map,
        title: `${point.name}`,
        icon: {
          url:
            index === 0
              ? 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png' // Start
              : index === locations.length - 1
                ? 'https://maps.google.com/mapfiles/ms/icons/red-dot.png' // End
                : 'https://maps.google.com/mapfiles/ms/icons/red-dot.png', // Waypoints
          scaledSize: new google.maps.Size(40, 40),
        },
      });

      bounds.extend(marker.getPosition());

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="font-size: 14px;">
            <strong> ${point.name}</strong><br>
            <strong> ${point.TYPE == 'T' ? 'Technician' : 'Customer'}</strong>
          </div>
        `,
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });
      this.getNearestRoad(map, point);
    });

    // Fit Map to Show All Markers
    map.fitBounds(bounds);
    this.isSpinning = false;
    // Google API Key
    const googleApiKey = this.apiKey;
    const routeApiUrl = `https://routes.googleapis.com/directions/v2:computeRoutes?key=${googleApiKey}`;

    // Process waypoints in batches of 25
    const MAX_WAYPOINTS = 25;
    const routeSegments: any = [];

    for (let i = 0; i < locations.length; i += MAX_WAYPOINTS) {
      const segment = locations.slice(i, i + MAX_WAYPOINTS);
      routeSegments.push(segment);
    }

    // Function to fetch route and draw polylines
    const fetchAndDrawRoute = (segment: any, index: number) => {
      const origin = {
        latLng: { latitude: segment[0].lat, longitude: segment[0].lng },
      };
      const destination = {
        latLng: {
          latitude: segment[segment.length - 1].lat,
          longitude: segment[segment.length - 1].lng,
        },
      };
      const intermediates = segment.slice(1, -1).map((point: any) => ({
        location: { latLng: { latitude: point.lat, longitude: point.lng } },
      }));

      const requestBody = {
        origin: { location: origin },
        destination: { location: destination },
        intermediates: intermediates,
        travelMode: 'DRIVE',
        routingPreference: 'TRAFFIC_AWARE_OPTIMAL',
        computeAlternativeRoutes: false,
        polylineEncoding: 'ENCODED_POLYLINE',
      };

      fetch(routeApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-FieldMask': 'routes.polyline.encodedPolyline',
        },
        body: JSON.stringify(requestBody),
      })
        .then((response) => response.json())
        .then((data) => {
          if (!data.routes || data.routes.length === 0) {
            this.message.error(
              `No valid route found for segment ${index + 1}.`,
              ''
            );
            return;
          }

          // Decode and draw each segment
          const polylinePoints = this.decodePolyline(
            data.routes[0].polyline.encodedPolyline
          );
          const travelPath = new google.maps.Polyline({
            path: polylinePoints,
            geodesic: true,
            strokeColor: '#0000FF',
            strokeOpacity: 1.0,
            strokeWeight: 4,
          });

          travelPath.setMap(map);
        })
        .catch((error) => {
          console.error(
            `Error fetching Google Routes API for segment ${index + 1}:`,
            error
          );
          this.message.error(
            `Failed to get route for segment ${index + 1}.`,
            ''
          );
        });
    };

    // Process each segment
    routeSegments.forEach((segment, index) =>
      fetchAndDrawRoute(segment, index)
    );
  }

  // Function to decode polyline
  decodePolyline(encoded: string) {
    let index = 0,
      len = encoded.length;
    let lat = 0,
      lng = 0;
    const coordinates: any = [];

    while (index < len) {
      let shift = 0,
        result = 0,
        byte;
      do {
        byte = encoded.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);
      let deltaLat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += deltaLat;

      shift = 0;
      result = 0;
      do {
        byte = encoded.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);
      let deltaLng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += deltaLng;

      coordinates.push({ lat: lat / 1e5, lng: lng / 1e5 });
    }

    return coordinates;
  }
  // Function to draw a dashed polyline from the road to the technician
  drawWalkingPath(
    map: any,
    roadLocation: { lat: number; lng: number },
    technician: { lat: number; lng: number }
  ) {
    if (!map || !roadLocation || !technician) {
      console.error('Invalid map or location data');
      return;
    }
    const lineSymbol = {
      path: 'M 0,-2 0,2',
      strokeOpacity: 1,
      scale: 1,
    };
    const walkingPath = new google.maps.Polyline({
      path: [
        { lat: roadLocation.lat, lng: roadLocation.lng },
        { lat: technician.lat, lng: technician.lng },
      ],

      geodesic: true,
      strokeColor: '#FF0000', // Red color for walking path
      strokeOpacity: 0, // Ensure visibility
      strokeWeight: 1,
      icons: [
        {
          icon: lineSymbol,
          offset: '0',
          repeat: '10px',
        },
      ],
    });

    walkingPath.setMap(map);
  }

  getNearestRoad(map: any, destination: any) {
    const apiKey = this.apiKey; // Replace with your API Key
    const roadApiUrl = `https://roads.googleapis.com/v1/nearestRoads?points=${destination.lat},${destination.lng}&key=${apiKey}`;

    fetch(roadApiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (!data.snappedPoints || data.snappedPoints.length === 0) {
          // console.warn('No nearest road found for:', destination.name);
          return;
        }

        // Get snapped road point
        const roadPoint = data.snappedPoints[0].location;
        const roadLatLng = {
          lat: roadPoint.latitude,
          lng: roadPoint.longitude,
        };

        // Draw walking path from road to technician
        this.drawWalkingPath(map, roadLatLng, destination);
      })
      .catch((error) => {
        console.error('Error fetching nearest road:', error);
      });
  }

  drawerTitlefordeatils: any = '';
  drawerdetailsVisible: any = false;
  drawerclosefordetails() {
    this.drawerdetailsVisible = false;
  }
  openfordetails() {
    this.drawerTitlefordeatils =
      'Details of ' + this.IS_ORDER_JOB == 'P'
        ? this.Jobassignsdata.JOB_CARD_NO
        : this.Jobassignsdata.ORDER_NO;

    this.drawerdetailsVisible = true;
  }

  openfileee(event: any) {
    window.open(this.api.retriveimgUrl + 'CartItemPhoto/' + event);
  }
  isTextOverflowing(element: HTMLElement): boolean {
    return element.offsetWidth < element.scrollWidth;
  }
}
