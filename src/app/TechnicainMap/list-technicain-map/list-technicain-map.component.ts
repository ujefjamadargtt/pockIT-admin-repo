import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { differenceInCalendarDays } from 'date-fns';
import { DatePipe } from '@angular/common';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
declare const google: any;
@Component({
  selector: 'app-list-technicain-map',
  templateUrl: './list-technicain-map.component.html',
  styleUrls: ['./list-technicain-map.component.css'],
})
export class ListTechnicainMapComponent implements OnInit {
  loadingRecords = false;
  selectedTerritor: string = '';
  selectedDate: any;
  selectedterritory2: any = 0;
  selectedTechnicianDropdown: string = 'tech1';
  techniciansdata: any[] = [];
  timelineData: any[] = [];
  technician: any[] = [];
  todaydate = new Date();
  vendor_id: any = 0;
  roleids: any;
  backofficeId = sessionStorage.getItem('backofficeId');
  decreptedbackofficeId = 0;
  decreptedvendorId = sessionStorage.getItem('Vid');
  roleID = sessionStorage.getItem('roleId');
  decreptedroleIDString = '';
  decreptedroleID = 0;
  customerMangeer: any = '';
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private datepipe: DatePipe
  ) { }
  public commonFunction = new CommonFunctionService();
  ngOnInit(): void {
    this.spinnnnnnn = true;
    var userid = this.commonFunction.decryptdata(
      sessionStorage.getItem('userId') || ''
    );
    var roleid = this.commonFunction.decryptdata(
      sessionStorage.getItem('roleId') || ''
    );
    var vidd = this.commonFunction.decryptdata(
      sessionStorage.getItem('Vid') || ''
    );
    this.decreptedvendorId = vidd;
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
    if (userid != undefined && userid != '' && userid != null) {
      var filterrrr = ' AND USER_ID=' + userid;
    } else {
      var filterrrr = '';
    }
    this.roleids = roleid;
    if (roleid == '1' || roleid == '8') {
      this.api.getTeritory(0, 0, '', '', ' AND IS_ACTIVE=1').subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.territorydata = data['data'];
            if (
              sessionStorage.getItem('territoryid') != '' &&
              sessionStorage.getItem('territoryid') != null &&
              sessionStorage.getItem('territoryid') != undefined
            ) {
              if (
                sessionStorage.getItem('Territory_Schedular') != '' &&
                sessionStorage.getItem('Territory_Schedular') != null &&
                sessionStorage.getItem('Territory_Schedular') != undefined
              ) {
                var dessionvalue: any = sessionStorage.getItem(
                  'Territory_Schedular'
                );
                sessionStorage.setItem('territoryid', dessionvalue);
                this.getpendingjobdatafilter2(0);
              } else {
                this.getpendingjobdatafilter2(0);
              }
            } else {
              if (
                sessionStorage.getItem('Territory_Schedular') != '' &&
                sessionStorage.getItem('Territory_Schedular') != null &&
                sessionStorage.getItem('Territory_Schedular') != undefined
              ) {
                var dessionvalue: any = sessionStorage.getItem(
                  'Territory_Schedular'
                );
                sessionStorage.setItem('territoryid', dessionvalue);
                this.getpendingjobdatafilter2(0);
              } else {
                sessionStorage.setItem('territoryid', this.territorydata[0].ID);
                this.getpendingjobdatafilter2(0);
              }
            }
            this.spinnnnnnn = false;
          } else {
            this.territorydata = [];
            this.spinnnnnnn = false;
            this.message.error('Failed to get Pending job data', '');
          }
        },
        () => {
          this.message.error('Something Went Wrong', '');
        }
      );
    } else {
      if (roleid == '9') {
        this.api.getAllUsers(0, 0, '', '', ' AND ID=' + userid).subscribe(
          (dataaa1) => {
            if (dataaa1['code'] == 200) {
              var dataaaaaa1 = dataaa1['data'];
              if (dataaaaaa1.length > 0) {
                this.vendor_id = dataaa1['data'][0].VENDOR_ID;
                this.api
                  .getVendorTerritoryMappedData(
                    0,
                    0,
                    '',
                    '',
                    ' AND IS_ACTIVE=1 AND VENDOR_ID=' + dataaaaaa1[0].VENDOR_ID
                  )
                  .subscribe(
                    (dataaa) => {
                      if (dataaa['code'] == 200) {
                        var dataaaaaa = dataaa['data'];
                        if (dataaaaaa.length > 0) {
                          var dd = dataaaaaa.map((item) => item.TERITORY_ID);
                          var filterformap = '';
                          if (dd != null && dd != undefined && dd != '') {
                            filterformap = ' AND ID IN (' + dd + ')';
                            this.api
                              .getTeritory(
                                0,
                                0,
                                '',
                                '',
                                ' AND IS_ACTIVE=1' + filterformap
                              )
                              .subscribe(
                                (data) => {
                                  if (data['code'] == 200) {
                                    this.territorydata = data['data'];
                                    if (
                                      sessionStorage.getItem('territoryid') !=
                                      '' &&
                                      sessionStorage.getItem('territoryid') !=
                                      null &&
                                      sessionStorage.getItem('territoryid') !=
                                      undefined
                                    ) {
                                      if (
                                        sessionStorage.getItem(
                                          'Territory_Schedular'
                                        ) != '' &&
                                        sessionStorage.getItem(
                                          'Territory_Schedular'
                                        ) != null &&
                                        sessionStorage.getItem(
                                          'Territory_Schedular'
                                        ) != undefined
                                      ) {
                                        var dessionvalue: any =
                                          sessionStorage.getItem(
                                            'Territory_Schedular'
                                          );
                                        sessionStorage.setItem(
                                          'territoryid',
                                          dessionvalue
                                        );
                                        this.getpendingjobdatafilter2(0);
                                      } else {
                                        this.getpendingjobdatafilter2(0);
                                      }
                                    } else {
                                      if (
                                        sessionStorage.getItem(
                                          'Territory_Schedular'
                                        ) != '' &&
                                        sessionStorage.getItem(
                                          'Territory_Schedular'
                                        ) != null &&
                                        sessionStorage.getItem(
                                          'Territory_Schedular'
                                        ) != undefined
                                      ) {
                                        var dessionvalue: any =
                                          sessionStorage.getItem(
                                            'Territory_Schedular'
                                          );
                                        sessionStorage.setItem(
                                          'territoryid',
                                          dessionvalue
                                        );
                                        this.getpendingjobdatafilter2(0);
                                      } else {
                                        sessionStorage.setItem(
                                          'territoryid',
                                          this.territorydata[0].ID
                                        );
                                        this.getpendingjobdatafilter2(0);
                                      }
                                    }
                                    this.spinnnnnnn = false;
                                  } else {
                                    this.territorydata = [];
                                    this.spinnnnnnn = false;
                                    this.message.error(
                                      'Failed to get Pending job data',
                                      ''
                                    );
                                  }
                                },
                                () => {
                                  this.message.error(
                                    'Something Went Wrong',
                                    ''
                                  );
                                }
                              );
                          } else {
                            filterformap = '';
                            this.openModal = true;
                            this.territorydata = [];
                            this.selectedterritory = '';
                            this.spinnnnnnn = false;
                          }
                        } else {
                          filterformap = '';
                          this.openModal = true;
                          this.territorydata = [];
                          this.selectedterritory = '';
                          this.spinnnnnnn = false;
                        }
                      } else {
                        filterformap = '';
                        this.openModal = true;
                        this.territorydata = [];
                        this.selectedterritory = '';
                        this.spinnnnnnn = false;
                      }
                    },
                    () => {
                      this.message.error('Something Went Wrong', '');
                    }
                  );
              } else {
                this.openModal = true;
                this.territorydata = [];
                this.selectedterritory = '';
                this.spinnnnnnn = false;
              }
            } else {
            }
          },
          () => {
            this.message.error('Something Went Wrong', '');
          }
        );
      } else {
        this.api.getBackOfficeData(0, 0, '', '', filterrrr).subscribe(
          (dataaa1) => {
            if (dataaa1['code'] == 200) {
              var dataaaaaa1 = dataaa1['data'];
              if (dataaaaaa1.length > 0) {
                this.api
                  .getBackofcTerritoryMappedData(
                    0,
                    0,
                    '',
                    '',
                    ' AND IS_ACTIVE=1 AND BACKOFFICE_ID=' + dataaaaaa1[0]['ID']
                  )
                  .subscribe(
                    (dataaa) => {
                      if (dataaa['code'] == 200) {
                        var dataaaaaa = dataaa['data'];
                        if (dataaaaaa.length > 0) {
                          var dd = dataaaaaa.map((item) => item.TERITORY_ID);
                          var filterformap = '';
                          if (dd != null && dd != undefined && dd != '') {
                            filterformap = ' AND ID IN (' + dd + ')';
                            this.api
                              .getTeritory(
                                0,
                                0,
                                '',
                                '',
                                ' AND IS_ACTIVE=1' + filterformap
                              )
                              .subscribe(
                                (data) => {
                                  if (data['code'] == 200) {
                                    this.territorydata = data['data'];
                                    if (
                                      sessionStorage.getItem('territoryid') !=
                                      '' &&
                                      sessionStorage.getItem('territoryid') !=
                                      null &&
                                      sessionStorage.getItem('territoryid') !=
                                      undefined
                                    ) {
                                      if (
                                        sessionStorage.getItem(
                                          'Territory_Schedular'
                                        ) != '' &&
                                        sessionStorage.getItem(
                                          'Territory_Schedular'
                                        ) != null &&
                                        sessionStorage.getItem(
                                          'Territory_Schedular'
                                        ) != undefined
                                      ) {
                                        var dessionvalue: any =
                                          sessionStorage.getItem(
                                            'Territory_Schedular'
                                          );
                                        sessionStorage.setItem(
                                          'territoryid',
                                          dessionvalue
                                        );
                                        this.getpendingjobdatafilter2(0);
                                      } else {
                                        this.getpendingjobdatafilter2(0);
                                      }
                                    } else {
                                      if (
                                        sessionStorage.getItem(
                                          'Territory_Schedular'
                                        ) != '' &&
                                        sessionStorage.getItem(
                                          'Territory_Schedular'
                                        ) != null &&
                                        sessionStorage.getItem(
                                          'Territory_Schedular'
                                        ) != undefined
                                      ) {
                                        var dessionvalue: any =
                                          sessionStorage.getItem(
                                            'Territory_Schedular'
                                          );
                                        sessionStorage.setItem(
                                          'territoryid',
                                          dessionvalue
                                        );
                                        this.getpendingjobdatafilter2(0);
                                      } else {
                                        sessionStorage.setItem(
                                          'territoryid',
                                          this.territorydata[0].ID
                                        );
                                        this.getpendingjobdatafilter2(0);
                                      }
                                    }
                                    this.spinnnnnnn = false;
                                  } else {
                                    this.territorydata = [];
                                    this.spinnnnnnn = false;
                                    this.message.error(
                                      'Failed to get pending job data',
                                      ''
                                    );
                                  }
                                },
                                () => {
                                  this.message.error(
                                    'Something Went Wrong',
                                    ''
                                  );
                                }
                              );
                          } else {
                            filterformap = '';
                            this.openModal = true;
                            this.territorydata = [];
                            this.selectedterritory = '';
                            this.spinnnnnnn = false;
                          }
                        } else {
                          filterformap = '';
                          this.openModal = true;
                          this.territorydata = [];
                          this.selectedterritory = '';
                          this.spinnnnnnn = false;
                        }
                      } else {
                        filterformap = '';
                        this.openModal = true;
                        this.territorydata = [];
                        this.selectedterritory = '';
                        this.spinnnnnnn = false;
                      }
                    },
                    () => {
                      this.message.error('Something Went Wrong', '');
                    }
                  );
              } else {
                this.openModal = true;
                this.territorydata = [];
                this.selectedterritory = '';
                this.spinnnnnnn = false;
              }
            } else {
            }
          },
          () => {
            this.message.error('Something Went Wrong', '');
          }
        );
      }
      this.api.getBackOfficeData(0, 0, '', '', filterrrr).subscribe(
        (dataaa1) => {
          if (dataaa1['code'] == 200) {
            var dataaaaaa1 = dataaa1['data'];
            if (dataaaaaa1.length > 0) {
              this.api
                .getBackofcTerritoryMappedData(
                  0,
                  0,
                  '',
                  '',
                  ' AND IS_ACTIVE=1 AND BACKOFFICE_ID=' + dataaaaaa1[0]['ID']
                )
                .subscribe(
                  (dataaa) => {
                    if (dataaa['code'] == 200) {
                      var dataaaaaa = dataaa['data'];
                      if (dataaaaaa.length > 0) {
                        var dd = dataaaaaa.map((item) => item.TERITORY_ID);
                        var filterformap = '';
                        if (dd != null && dd != undefined && dd != '') {
                          filterformap = ' AND ID IN (' + dd + ')';
                          this.api
                            .getTeritory(
                              0,
                              0,
                              '',
                              '',
                              ' AND IS_ACTIVE=1' + filterformap
                            )
                            .subscribe(
                              (data) => {
                                if (data['code'] == 200) {
                                  this.territorydata = data['data'];
                                  if (
                                    sessionStorage.getItem('territoryid') !=
                                    '' &&
                                    sessionStorage.getItem('territoryid') !=
                                    null &&
                                    sessionStorage.getItem('territoryid') !=
                                    undefined
                                  ) {
                                    if (
                                      sessionStorage.getItem(
                                        'Territory_Schedular'
                                      ) != '' &&
                                      sessionStorage.getItem(
                                        'Territory_Schedular'
                                      ) != null &&
                                      sessionStorage.getItem(
                                        'Territory_Schedular'
                                      ) != undefined
                                    ) {
                                      var dessionvalue: any =
                                        sessionStorage.getItem(
                                          'Territory_Schedular'
                                        );
                                      sessionStorage.setItem(
                                        'territoryid',
                                        dessionvalue
                                      );
                                      this.getpendingjobdatafilter2(0);
                                    } else {
                                      this.getpendingjobdatafilter2(0);
                                    }
                                  } else {
                                    if (
                                      sessionStorage.getItem(
                                        'Territory_Schedular'
                                      ) != '' &&
                                      sessionStorage.getItem(
                                        'Territory_Schedular'
                                      ) != null &&
                                      sessionStorage.getItem(
                                        'Territory_Schedular'
                                      ) != undefined
                                    ) {
                                      var dessionvalue: any =
                                        sessionStorage.getItem(
                                          'Territory_Schedular'
                                        );
                                      sessionStorage.setItem(
                                        'territoryid',
                                        dessionvalue
                                      );
                                      this.getpendingjobdatafilter2(0);
                                    } else {
                                      sessionStorage.setItem(
                                        'territoryid',
                                        this.territorydata[0].ID
                                      );
                                      this.getpendingjobdatafilter2(0);
                                    }
                                  }
                                  this.spinnnnnnn = false;
                                } else {
                                  this.territorydata = [];
                                  this.spinnnnnnn = false;
                                  this.message.error(
                                    'Failed to get pending job data',
                                    ''
                                  );
                                }
                              },
                              () => {
                                this.message.error('Something Went Wrong', '');
                              }
                            );
                        } else {
                          filterformap = '';
                          this.openModal = true;
                          this.territorydata = [];
                          this.selectedterritory = '';
                          this.spinnnnnnn = false;
                        }
                      } else {
                        filterformap = '';
                        this.openModal = true;
                        this.territorydata = [];
                        this.selectedterritory = '';
                        this.spinnnnnnn = false;
                      }
                    } else {
                      filterformap = '';
                      this.openModal = true;
                      this.territorydata = [];
                      this.selectedterritory = '';
                      this.spinnnnnnn = false;
                    }
                  },
                  () => {
                    this.message.error('Something Went Wrong', '');
                  }
                );
            } else {
              this.openModal = true;
              this.territorydata = [];
              this.selectedterritory = '';
              this.spinnnnnnn = false;
            }
          } else {
          }
        },
        () => {
          this.message.error('Something Went Wrong', '');
        }
      );
    }
    this.selectedDate = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
  }
  isTextOverflow = false;
  checkOverflow(element: HTMLElement, tooltip: any): void {
    this.isTextOverflow = element.scrollWidth > element.clientWidth;
    if (this.isTextOverflow) {
      tooltip.show();
    } else {
      tooltip.hide();
    }
  }
  getdataaaaa1() {
    if (this.columns.length > 0) {
      var dataaa = this.columns.length * 44;
      this.schollength = dataaa + 'px';
    } else {
      this.schollength = '1400px';
    }
    return this.schollength;
  }
  openModal = false;
  ColorArray: any = [];
  uniqueValues: any = [];
  sheduledataarray = [];
  searchValue: string = ''; 
  originalTechniciansData: any[] = []; 
  onSearchChange(value: string): void {
    this.searchValue = value;
    if (value.length >= 3) {
      this.onsearchload = true;
      this.getpendingjobdataforfilterforsearch();
    } else if (value.length == 0) {
      this.onsearchload = true;
      this.getpendingjobdataforfilterforsearch();
    } else {
    }
  }
  range(start: number, end: number): number[] {
    const result: number[] = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }
  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.selectedDate) > 0;
  };
  dateformat(data: any) {
    this.selectedDate = this.datepipe.transform(data, 'yyyy-MM-dd');
  }
  technicianName: any;
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
          (loc: any) => !isNaN(loc.latitude) && !isNaN(loc.longitude) 
        );
      if (locations.length === 0) {
        this.message.error('No valid locations found for the technician.', '');
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
        return; 
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
          marker.addListener('mouseover', () => {
            infoWindow.open(map, marker);
          });
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
    const validLocations = this.techniciansdata.filter(
      (location) =>
        !isNaN(parseFloat(location.LOCATION_LATITUDE)) &&
        !isNaN(parseFloat(location.LOCATION_LONG))
    );
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
  date = new Date();
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
  columnssssss: string[][] = [
    ['SERVICE_SKILLS', 'SERVICE_SKILLS'],
    ['ORDER_NO', 'ORDER_NO'],
    ['PINCODE', 'PINCODE'],
    ['SERVICE_ADDRESS', 'SERVICE_ADDRESS'],
    ['CUSTOMER_NAME', 'CUSTOMER_NAME'],
    ['TASK_DESCRIPTION', 'TASK_DESCRIPTION'],
    ['TERRITORY_NAME', 'TERRITORY_NAME'],
    ['JOB_CARD_NO', 'JOB_CARD_NO'],
  ];
  jobdatss: any = [];
  selectedterritory: any;
  terriotrystarttime: any = '';
  terriotryendtime: any = '';
  terriotrystarttime1: any = '';
  terriotryendtime1: any = '';
  filterdate: any = new Date();
  groupedData: { [key: string]: any[] } = {};
  getpendingjobdatafilter(event: any) {
    var filterterritory = this.territorydata.filter(
      (x: any) => x.ID == Number(event)
    );
    if (filterterritory.length > 0) {
      this.terriotrystarttime = filterterritory[0].GLOBAL_START_TIME;
      this.terriotryendtime = filterterritory[0].GLOBAL_END_TIME;
      const currentDate = new Date(this.todaydate);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const day = currentDate.getDate();
      const dateWithTime = new Date(
        year,
        month,
        day,
        ...filterterritory[0].START_TIME.split(':').map(Number)
      );
      const dateWithTime1 = new Date(
        year,
        month,
        day,
        ...filterterritory[0].END_TIME.split(':').map(Number)
      );
      this.terriotrystarttime1 = new Date(dateWithTime);
      this.terriotryendtime1 = new Date(dateWithTime1);
      this.columns = this.generateTimeColumnsFromRange();
    }
    if (event != '' && event != null && event != undefined) {
      sessionStorage.setItem('territoryid', event);
      this.spinnnnnnn = true;
      this.filterdate = '';
      var likeQuery = '';
      if (this.searchValue != '') {
        likeQuery = ' AND(';
        this.columnssssss.forEach((column) => {
          likeQuery +=
            ' ' + column[0] + " like '%" + this.searchValue + "%' OR";
        });
        likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
      }
      var filterdateee = '';
      if (this.filterdate.length == 2) {
        filterdateee =
          " AND  DATE (EXPECTED_DATE_TIME) BETWEEN '" +
          this.datepipe.transform(this.filterdate[0], 'yyyy-MM-dd') +
          "' AND' " +
          this.datepipe.transform(this.filterdate[1], 'yyyy-MM-dd') +
          "'";
      }
      this.getcalenderdata(event, this.todaydate);
      sessionStorage.removeItem('Territory_Schedular');
      this.spinnnnnnn = false;
    } else {
      this.openModal = true;
      this.selectedterritory = null;
    }
  }
  getpendingjobdatafilter2(event: any) {
    if (event == 0) {
      if (
        sessionStorage.getItem('territoryid') != null &&
        sessionStorage.getItem('territoryid') != undefined &&
        sessionStorage.getItem('territoryid') != '' &&
        sessionStorage.getItem('territoryid') != '0'
      ) {
        this.selectedterritory = Number(sessionStorage.getItem('territoryid'));
      } else this.selectedterritory = Number(this.territorydata[0]['ID']);
      sessionStorage.setItem('territoryid', this.selectedterritory);
      var filterterritory = this.territorydata.filter(
        (x: any) => x.ID == Number(this.selectedterritory)
      );
      if (filterterritory.length > 0) {
         this.terriotrystarttime = filterterritory[0].GLOBAL_START_TIME;
        this.terriotryendtime = filterterritory[0].GLOBAL_END_TIME;
        const currentDate = new Date(this.todaydate);
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const day = currentDate.getDate();
        const dateWithTime = new Date(
          year,
          month,
          day,
          ...filterterritory[0].START_TIME.split(':').map(Number)
        );
        const dateWithTime1 = new Date(
          year,
          month,
          day,
          ...filterterritory[0].END_TIME.split(':').map(Number)
        );
        this.terriotrystarttime1 = new Date(dateWithTime);
        this.terriotryendtime1 = new Date(dateWithTime1);
        this.columns = this.generateTimeColumnsFromRange();
      }
      if (
        this.selectedterritory != '' &&
        this.selectedterritory != null &&
        this.selectedterritory != undefined
      ) {
        sessionStorage.setItem('territoryid', this.selectedterritory);
        this.spinnnnnnn = true;
        this.filterdate = '';
        var likeQuery = '';
        if (this.searchValue != '') {
          likeQuery = ' AND(';
          this.columnssssss.forEach((column) => {
            likeQuery +=
              ' ' + column[0] + " like '%" + this.searchValue + "%' OR";
          });
          likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
        }
        var filterdateee = '';
        if (this.filterdate.length == 2) {
          filterdateee =
            " AND  DATE (EXPECTED_DATE_TIME) BETWEEN '" +
            this.datepipe.transform(this.filterdate[0], 'yyyy-MM-dd') +
            "' AND' " +
            this.datepipe.transform(this.filterdate[1], 'yyyy-MM-dd') +
            "'";
        }
        this.pageindexxx = 1;
        var trIds: any = [];
        this.territorydata.forEach((element) => {
          trIds.push(element.ID);
        });
        var vendorfilter = ''
        if (this.decreptedroleID == 9) {
          vendorfilter = " AND ASSING_TO=" + this.decreptedvendorId
        }
        this.api
          .getJobCardsForSchedular(
            this.pageindexxx,
            this.pageSize,
            '',
            '',
            ' AND TERRITORY_ID in (' +
            trIds.toString() +
            ") AND STATUS='P' AND ORDER_STATUS !='CA'" +
            likeQuery +
            filterdateee + this.customerMangeer + vendorfilter
          )
          .subscribe(
            (data) => {
              if (data['code'] == 200) {
                this.jobdatss = data['data'];
                sessionStorage.removeItem('Territory_Schedular');
                this.groupedData = this.groupByOrderNo(this.jobdatss);
                this.tempCount = data['count'];
                this.openModal = false;
                this.spinnnnnnn = false;
                this.getcalenderdata(this.selectedterritory, this.todaydate);
              } else {
                this.jobdatss = [];
                this.groupedData = {};
                this.message.error('Failed to get pending job data', '');
              }
            },
            () => {
              this.message.error('Something Went Wrong', '');
            }
          );
      } else {
        this.selectedterritory = null;
      }
    } else {
      var filterterritory = this.territorydata.filter(
        (x: any) => x.ID == Number(event)
      );
      if (filterterritory.length > 0) {
         this.terriotrystarttime = filterterritory[0].GLOBAL_START_TIME;
        this.terriotryendtime = filterterritory[0].GLOBAL_END_TIME;
        const currentDate = new Date(this.todaydate);
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const day = currentDate.getDate();
        const dateWithTime = new Date(
          year,
          month,
          day,
          ...filterterritory[0].START_TIME.split(':').map(Number)
        );
        const dateWithTime1 = new Date(
          year,
          month,
          day,
          ...filterterritory[0].END_TIME.split(':').map(Number)
        );
        this.terriotrystarttime1 = new Date(dateWithTime);
        this.terriotryendtime1 = new Date(dateWithTime1);
        this.columns = this.generateTimeColumnsFromRange();
      }
      if (event != '' && event != null && event != undefined) {
        sessionStorage.setItem('territoryid', event);
        this.spinnnnnnn = true;
        this.filterdate = '';
        var likeQuery = '';
        if (this.searchValue != '') {
          likeQuery = ' AND(';
          this.columnssssss.forEach((column) => {
            likeQuery +=
              ' ' + column[0] + " like '%" + this.searchValue + "%' OR";
          });
          likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
        }
        var filterdateee = '';
        if (this.filterdate.length == 2) {
          filterdateee =
            " AND  DATE (EXPECTED_DATE_TIME) BETWEEN '" +
            this.datepipe.transform(this.filterdate[0], 'yyyy-MM-dd') +
            "' AND' " +
            this.datepipe.transform(this.filterdate[1], 'yyyy-MM-dd') +
            "'";
        }
        this.pageindexxx = 1;
        this.api
          .getJobCardsForSchedular(
            this.pageindexxx,
            this.pageSize,
            '',
            '',
            ' AND TERRITORY_ID=' +
            event +
            " AND STATUS='P' AND ORDER_STATUS !='CA'" +
            likeQuery +
            filterdateee + this.customerMangeer
          )
          .subscribe(
            (data) => {
              if (data['code'] == 200) {
                this.jobdatss = data['data'];
                sessionStorage.removeItem('Territory_Schedular');
                this.groupedData = this.groupByOrderNo(this.jobdatss);
                this.selectedterritory = this.selectedterritory2;
                this.tempCount = data['count'];
                this.openModal = false;
                this.spinnnnnnn = false;
                this.getcalenderdata(event, this.todaydate);
              } else {
                this.jobdatss = [];
                this.groupedData = {};
                this.message.error('Failed to get pending job data', '');
              }
            },
            () => {
              this.message.error('Something Went Wrong', '');
            }
          );
      } else {
        this.openModal = true;
        this.selectedterritory = null;
      }
    }
  }
  spinnnnnnn: boolean = false;
  territorydata: any;
  getTeritorydata() {
    this.spinnnnnnn = true;
    this.api.getTeritory(0, 0, '', '', ' AND IS_ACTIVE=1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.territorydata = data['data'];
          this.spinnnnnnn = false;
        } else {
          this.territorydata = [];
          this.spinnnnnnn = false;
          this.message.error('Failed to get pending job data', '');
        }
      },
      () => {
        this.message.error('Something Went Wrong', '');
      }
    );
  }
  jobdetaildrawerTitle = '';
  jobdetailsshow = false;
  jobdetailsdata: any;
  invoicefilter: any;
  openjobcarddetails(data: any) {
    this.invoicefilter = ' AND JOB_CARD_ID=' + data.ID;
    this.jobdetailsdata = data;
    this.jobdetaildrawerTitle = 'Job details of ' + data.JOB_CARD_NO;
    this.jobdetailsshow = true;
  }
  drawersize = '100%';
  jobdetailsdrawerClose(): void {
    this.jobdetailsshow = false;
    if (
      sessionStorage.getItem('territoryid') != '' &&
      sessionStorage.getItem('territoryid') != null &&
      sessionStorage.getItem('territoryid') != undefined
    ) {
      this.selectedterritory = Number(sessionStorage.getItem('territoryid'));
      this.getpendingjobdatafilter2(this.selectedterritory2);
    } else {
      this.openModal = true;
    }
    this.jobedit = false;
  }
  get jobdetailscloseCallback() {
    return this.jobdetailsdrawerClose.bind(this);
  }
  sheduledata: any = [];
  columns: any = [];
  generateTimeColumns(): string[] {
    const columns: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 10) {
        const formattedTime = `${hour.toString().padStart(2, '0')}:${minute
          .toString()
          .padStart(2, '0')}`;
        columns.push(formattedTime);
      }
    }
    return columns;
  }
  getColorName(bookingID: string): string {
    var index = this.uniqueValues.indexOf(bookingID);
    if (index < 0) {
      return 'rgb(207, 251, 207)';
    } else {
      if (bookingID.split(',')[1] == 'CO') {
        return '#389e0d';
      } else {
        return this.ColorArray[index];
      }
    }
    return 'rgb(207, 251, 207)';
  }
  getWidth(cnt: any, data: any) {
    var w = Number(cnt) * 44 - 2;
    return w + 'px';
  }
  getLeft(cnt: any, data: any) {
    var w = (Number(cnt) * 44) / 2 + 0;
    return w + 'px';
  }
  generateColorCode() {
    var r = Math.floor(Math.random() * 155) + 100;
    var g = Math.floor(Math.random() * 155) + 100;
    var b = Math.floor(Math.random() * 155) + 100;
    var colorCode = 'rgb(' + r + ',' + g + ',' + b + ')';
    return colorCode;
  }
  mainCellMergeArray: any = [];
  mergecelss() {
    let tempCellMergeArray: any = [];
    let mainCellMergeArray: any = [];
    for (let i = 0; i < this.sheduledata.length; i++) {
      tempCellMergeArray = [];
      let previousValue = '';
      let tempArrayToFindOccurance: any = [];
      for (let j = 0; j < this.columns.length; j++) {
        tempArrayToFindOccurance.push(this.sheduledata[i][this.columns[j]]);
      }
      for (let j = 0; j < this.columns.length; j++) {
        if (
          this.sheduledata[i][this.columns[j]] != null &&
          this.sheduledata[i][this.columns[j]] != undefined
        ) {
          if (previousValue != this.sheduledata[i][this.columns[j]]) {
            previousValue = this.sheduledata[i][this.columns[j]];
            tempCellMergeArray.push(
              tempArrayToFindOccurance.filter(
                (item) => item === this.sheduledata[i][this.columns[j]]
              ).length
            );
          } else {
            tempCellMergeArray.push('0');
          }
        } else {
          tempCellMergeArray.push('0');
        }
      }
      mainCellMergeArray.push(Object.assign({}, tempCellMergeArray));
      this.mainCellMergeArray = [];
      this.mainCellMergeArray = mainCellMergeArray;
    }
  }
  jobassignshow: boolean = false;
  JobassigndrawerTitle: any = '';
  onsearchload: boolean = false;
  JobassignsdrawerClose(): void {
    this.jobassignshow = false;
    this.getpendingjobdatafilter2(this.selectedterritory2);
    this.jobedit = false;
  }
  Jobassignsdata: any = [];
  get JobassignscloseCallback() {
    return this.JobassignsdrawerClose.bind(this);
  }
  IS_REMOTE_JOB = 0;
  jobassigndraweropen(data: any) {
    this.IS_ORDER_JOB = 'P';
    this.IS_REMOTE_JOB = data.IS_REMOTE_JOB;
    this.alljobdata = [];
    this.Jobassignsdata = data;
    this.SERVICE_DATA = [];
    this.SERVICE_DATA = {
      TERRITORY_ID: this.Jobassignsdata.TERRITORY_ID,
      EXPECTED_DATE_TIME: this.Jobassignsdata.EXPECTED_DATE_TIME,
      ESTIMATED_TIME_IN_MIN: this.Jobassignsdata.ESTIMATED_TIME_IN_MIN,
      LATTITUTE: this.Jobassignsdata.LATTITUTE,
      LONGITUDE: this.Jobassignsdata.LONGITUDE,
      SERVICE_SKILLS: this.Jobassignsdata.SERVICE_SKILLS,
    };
    this.JobassigndrawerTitle =
      'Assign the ' + data.JOB_CARD_NO + ' number to the technician';
    var filterterritory = this.territorydata.filter(
      (x: any) => x.ID == Number(this.Jobassignsdata.TERRITORY_ID)
    );
    sessionStorage.setItem('territoryid', this.Jobassignsdata.TERRITORY_ID);
    if (filterterritory.length > 0) {
      const currentDate = new Date(this.todaydate);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const day = currentDate.getDate();
      const dateWithTime = new Date(
        year,
        month,
        day,
        ...filterterritory[0].START_TIME.split(':').map(Number)
      );
      const dateWithTime1 = new Date(
        year,
        month,
        day,
        ...filterterritory[0].END_TIME.split(':').map(Number)
      );
      this.terriotrystarttime = filterterritory[0].GLOBAL_START_TIME;
      this.terriotryendtime = filterterritory[0].GLOBAL_END_TIME;
      var terriotryendtime = new Date(dateWithTime1);
      var terriotrystarttime = new Date(dateWithTime);
      this.Territorytime =
        'Territory Time : ' +
        this.datepipe.transform(terriotrystarttime, 'hh:mm a') +
        '-' +
        this.datepipe.transform(terriotryendtime, 'hh:mm a');
    }
    this.jobassignshow = true;
  }
  navigateForward(): void {
    this.todaydate = new Date(this.todaydate);
    this.todaydate.setDate(this.todaydate.getDate() + 1);
    this.getcalenderdata(
      this.selectedterritory,
      this.datepipe.transform(this.todaydate, 'yyyy-MM-dd')
    );
  }
  navigateBackward(): void {
    this.todaydate = new Date(this.todaydate);
    this.todaydate.setDate(this.todaydate.getDate() - 1);
    this.getcalenderdata(
      this.selectedterritory,
      this.datepipe.transform(this.todaydate, 'yyyy-MM-dd')
    );
  }
  oncalenderdatechange(event: any) {
    this.getcalenderdata(
      this.selectedterritory,
      this.datepipe.transform(event, 'yyyy-MM-dd')
    );
  }
  shedulecount: any = [];
  getcalenderdata(id: any, date: any) {
    this.tableloading = true;
    var dateee = this.datepipe.transform(date, 'yyyy-MM-dd');
    var filterQuery =
      " AND DATE BETWEEN '" +
      dateee +
      "' AND' " +
      dateee +
      "' AND TERRITORY_ID=" +
      id;
    var filterQuery11 = ' AND TERRITORY_ID=' + id;
    var VENDOR_IDfilter: any = null;
    if (this.decreptedroleID == 9) {
      VENDOR_IDfilter = this.decreptedvendorId
    }
    this.api.gettechnicianjobshedule(0, 0, '', '', filterQuery, this.decreptedroleID === 7 ? 1 : 0, this.decreptedroleID === 7 ? this.decreptedbackofficeId : 0, id, VENDOR_IDfilter).subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.sheduledata = data['data'];
          if (this.sheduledata.length == 0) {
          } else {
            var dataaaaaaaa = this.filterDataByTime('', '');
            this.sheduledata = dataaaaaaaa;
          }
          this.api
            .gettechnicianjobshedulecount(0, 0, '', '', filterQuery11 + this.customerMangeer, this.datepipe.transform(date, 'yyyy-MM-dd'))
            .subscribe(
              (data) => {
                if (data['code'] == 200) {
                  this.shedulecount = data['data'];
                } else {
                  this.shedulecount = [];
                }
              },
              () => {
                this.message.error('Something Went Wrong', '');
              }
            );
          this.mergecelss();
          this.uniqueValues = Array.from(
            new Set(
              this.sheduledata.flatMap((item) =>
                Object.values(item).filter((value) => value !== null)
              )
            )
          );
          this.ColorArray = [];
          for (let i = 0; i < this.uniqueValues.length; i++) {
            this.ColorArray.push(this.generateColorCode());
          }
          this.tableloading = false;
        } else {
          this.sheduledata = [];
          this.message.error('calender ', '');
        }
      },
      () => {
        this.message.error('Something Went Wrong', '');
      }
    );
  }
  filterClass = 'filter-invisible';
  showMainFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    } else {
      this.filterClass = 'filter-visible';
    }
  }
  applyFilter() {
    this.showMainFilter();
    this.filterClassss = true;
  }
  filterClassss: boolean = false;
  showHoverCard = false;
  currentPopoverData: any = [];
  jobno: any;
  jobnoedit: any;
  custidHover: any;
  updatePopoverContext(data: any, aa: any): void {
    this.jobno = aa.split(',')[0];
    this.jobnoedit = aa.split(',')[1];
    this.custidHover = Number(aa.split(',')[2]);
    this.currentPopoverData = data;
  }
  extractJobDetails(data: any[]): any[] {
    let jobDetails: any[] = [];
    data.forEach((entry) => {
      let jobData: any = {}; 
      Object.keys(entry).forEach((key) => {
        if (
          key !== 'ID' &&
          key !== 'TERRITORY_ID' &&
          key !== 'TECHNICIAN_ID' &&
          key !== 'DATE' &&
          key !== 'CREATED_MODIFIED_DATE' &&
          key !== 'READ_ONLY' &&
          key !== 'ARCHIVE_FLAG' &&
          key !== 'CLIENT_ID'
        ) {
          if (entry[key] !== null) {
            jobData[key] = entry[key];
          }
        }
      });
      jobDetails.push(jobData);
    });
    return jobDetails;
  }
  jobdataforedit: any;
  jobedit: boolean = false;
  getpendingjobsforedit() {
    this.api
      .getJobCardsForSchedular(
        0,
        0,
        '',
        '',
        " AND JOB_CARD_NO='" + this.jobno + "'"
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.jobdataforedit = data['data'][0];
            this.alljobdata = [];
            this.IS_ORDER_JOB = 'P';
            if (
              this.jobdataforedit.STATUS == 'AS' &&
              this.jobdataforedit.TRACK_STATUS != 'SJ'
            ) {
              this.jobedit = true;
              this.Jobassignsdata = this.jobdataforedit;
              this.SERVICE_DATA = {
                TERRITORY_ID: this.Jobassignsdata.TERRITORY_ID,
                EXPECTED_DATE_TIME: this.Jobassignsdata.EXPECTED_DATE_TIME,
                ESTIMATED_TIME_IN_MIN:
                  this.Jobassignsdata.ESTIMATED_TIME_IN_MIN,
                LATTITUTE: this.Jobassignsdata.LATTITUTE,
                LONGITUDE: this.Jobassignsdata.LONGITUDE,
                SERVICE_SKILLS: this.Jobassignsdata.SERVICE_SKILLS,
              };
              this.JobassigndrawerTitle =
                ' Edit assigned job number ' + this.jobdataforedit.JOB_CARD_NO;
              this.jobassignshow = true;
            } else {
              if (this.jobdataforedit.TRACK_STATUS == 'SJ') {
                this.message.info(
                  'The job has started and you cannot edit it.',
                  ''
                );
              } else if (this.jobdataforedit.STATUS == 'CO') {
                this.message.info('Job is completed ', '');
              }
              if (
                sessionStorage.getItem('territoryid') != '' &&
                sessionStorage.getItem('territoryid') != null &&
                sessionStorage.getItem('territoryid') != undefined
              ) {
                this.selectedterritory = Number(
                  this.Jobassignsdata.TERRITORY_ID
                );
                this.getpendingjobdatafilter(this.Jobassignsdata.TERRITORY_ID);
              } else {
                this.openModal = true;
              }
            }
          } else {
            this.jobdataforedit = [];
            this.message.error('Failed to get pending job data', '');
          }
        },
        () => {
          this.message.error('Something Went Wrong', '');
        }
      );
  }
  getpendingjobdata() {
    if (this.filterdate.length == 2) {
      var filterQuery = " AND STATUS='P' AND ORDER_STATUS !='CA'";
      var likeQuery = '';
      if (this.searchValue != '') {
        likeQuery = ' AND(';
        this.columnssssss.forEach((column) => {
          likeQuery +=
            ' ' + column[0] + " like '%" + this.searchValue + "%' OR";
        });
        likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
      }
      var filterdateee = '';
      if (this.filterdate.length == 2) {
        filterdateee =
          " AND  DATE (EXPECTED_DATE_TIME) BETWEEN '" +
          this.datepipe.transform(this.filterdate[0], 'yyyy-MM-dd') +
          "' AND' " +
          this.datepipe.transform(this.filterdate[1], 'yyyy-MM-dd') +
          "'";
      }
      this.pageindexxx = 1;
      this.api
        .getJobCardsForSchedular(
          this.pageindexxx,
          this.pageSize,
          '',
          '',
          filterQuery + likeQuery + filterdateee + " AND ORDER_STATUS !='CA'" + this.customerMangeer
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.jobdatss = data['data'];
              this.groupedData = this.groupByOrderNo(this.jobdatss);
              this.tempCount = data['count'];
            } else {
              this.jobdatss = [];
              this.groupedData = {};
              this.message.error('Failed to get pending job data', '');
            }
          },
          () => {
            this.message.error('Something Went Wrong', '');
          }
        );
    } else {
      this.message.info('Please select date', '');
    }
  }
  getpendingjobdataforfilter() {
    var dateee = this.datepipe.transform(this.todaydate, 'yyyy-MM-dd');
    var filterQuery = " AND STATUS='P' AND ORDER_STATUS !='CA'";
    var likeQuery = '';
    if (this.searchValue != '') {
      likeQuery = ' AND(';
      this.columnssssss.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchValue + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
    }
    var filterdateee = '';
    if (this.filterdate.length == 2) {
      filterdateee =
        " AND  DATE (EXPECTED_DATE_TIME) BETWEEN '" +
        this.datepipe.transform(this.filterdate[0], 'yyyy-MM-dd') +
        "' AND' " +
        this.datepipe.transform(this.filterdate[1], 'yyyy-MM-dd') +
        "'";
    }
    this.pageindexxx = 1;
    this.api
      .getJobCardsForSchedular(
        this.pageindexxx,
        this.pageSize,
        '',
        '',
        filterQuery + likeQuery + filterdateee + " AND ORDER_STATUS !='CA'" + this.customerMangeer
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.jobdatss = data['data'];
            this.groupedData = this.groupByOrderNo(this.jobdatss);
            this.tempCount = data['count'];
            this.showMainFilter();
            this.filterClassss = true;
          } else {
            this.jobdatss = [];
            this.groupedData = {};
            this.message.error('Failed to get pending job data', '');
          }
        },
        () => {
          this.message.error('Something Went Wrong', '');
        }
      );
  }
  jobviewdetails() {
    this.api
      .getJobCardsForSchedular(
        0,
        0,
        '',
        '',
        " AND JOB_CARD_NO='" + this.jobno + "'"
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.jobdetailsdata = data['data'][0];
            this.invoicefilter = ' AND JOB_CARD_ID=' + this.jobdetailsdata.ID;
            this.jobdetaildrawerTitle =
              'Job details of ' + this.jobdetailsdata.JOB_CARD_NO;
            this.jobdetailsshow = true;
          } else {
            this.jobdataforedit = [];
          }
        },
        () => {
          this.message.error('Something Went Wrong', '');
        }
      );
  }
  tableloading: boolean = false;
  getpendingjobdataforfilterforsearch() {
    var dateee = this.datepipe.transform(this.todaydate, 'yyyy-MM-dd');
    var filterQuery = " AND STATUS='P' AND ORDER_STATUS !='CA'";
    var likeQuery = '';
    if (this.searchValue != '') {
      likeQuery = ' AND(';
      this.columnssssss.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchValue + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
    }
    var filterdateee = '';
    if (this.filterdate.length == 2) {
      filterdateee =
        " AND  DATE (EXPECTED_DATE_TIME) BETWEEN '" +
        this.datepipe.transform(this.filterdate[0], 'yyyy-MM-dd') +
        "' AND' " +
        this.datepipe.transform(this.filterdate[1], 'yyyy-MM-dd') +
        "'";
    }
    this.spinnnnnnn = true;
    this.pageindexxx = 1;
    this.api
      .getJobCardsForSchedular(
        this.pageindexxx,
        this.pageSize,
        '',
        '',
        filterQuery + likeQuery + filterdateee + " AND ORDER_STATUS !='CA'" + this.customerMangeer
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.jobdatss = data['data'];
            this.groupedData = this.groupByOrderNo(this.jobdatss);
            this.tempCount = data['count'];
            this.onsearchload = false;
            this.spinnnnnnn = false;
          } else {
            this.jobdatss = [];
            this.groupedData = {};
            this.onsearchload = false;
            this.spinnnnnnn = false;
            this.message.error('Failed to get pending job data', '');
          }
        },
        () => {
          this.message.error('Something Went Wrong', '');
          this.spinnnnnnn = false;
        }
      );
  }
  filterDataByTime(startTime: string, endTime: string): void {
    const startMinutes = this.convertToMinutes(this.terriotrystarttime);
    const endMinutes = this.convertToMinutes(this.terriotryendtime);
    var filteredData = this.sheduledata.map((record) => {
      const filteredRecord = Object.entries(record)
        .filter(([key, value]) => {
          if (this.isTimeString(key)) {
            const timeMinutes = this.convertToMinutes(key);
            return timeMinutes >= startMinutes && timeMinutes <= endMinutes;
          }
          return false;
        })
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});
      Object.entries(record).forEach(([key, value]) => {
        if (!this.isTimeString(key)) {
          filteredRecord[key] = value;
        }
      });
      return filteredRecord;
    });
    return filteredData;
  }
  private convertToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
  private isTimeString(key: string): boolean {
    return /^\d{2}:\d{2}$/.test(key); 
  }
  generateTimeColumnsFromRange(): string[] {
    const columns: string[] = [];
    const startMinutes = this.convertToMinutes(this.terriotrystarttime);
    const endMinutes = this.convertToMinutes(this.terriotryendtime);
    for (let time = startMinutes; time <= endMinutes; time += 10) {
      const hours = Math.floor(time / 60);
      const minutes = time % 60;
      const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}`;
      columns.push(formattedTime);
    }
    return columns;
  }
  onscrolldata: any = '';
  onScroll(event: any) {
    if (this.spinnnnnnn == false) {
      const scrollContainer = event.target;
      this.onscrolldata = scrollContainer;
      if (
        scrollContainer.scrollTop + scrollContainer.clientHeight >=
        scrollContainer.scrollHeight - 20
      ) {
        if (this.tempCount == this.jobdatss.length) {
        } else {
          this.getpendingjobdatafilter11(sessionStorage.getItem('territoryid'));
        }
      }
    }
  }
  pageindexxx = 1;
  pageSize = 20;
  tempCount: any;
  getpendingjobdatafilter11(event: any) {
    this.spinnnnnnn = true;
    var vendorfilter = ''
    if (this.decreptedroleID == 9) {
      vendorfilter = " AND ASSING_TO=" + this.decreptedvendorId
    }
    if (event != '' && event != null && event != undefined) {
      this.filterdate = '';
      var likeQuery = '';
      if (this.searchValue != '') {
        likeQuery = ' AND(';
        this.columnssssss.forEach((column) => {
          likeQuery +=
            ' ' + column[0] + " like '%" + this.searchValue + "%' OR";
        });
        likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
      }
      var filterdateee = '';
      if (this.filterdate.length == 2) {
        filterdateee =
          " AND  DATE (EXPECTED_DATE_TIME) BETWEEN '" +
          this.datepipe.transform(this.filterdate[0], 'yyyy-MM-dd') +
          "' AND' " +
          this.datepipe.transform(this.filterdate[1], 'yyyy-MM-dd') +
          "'";
      }
      this.pageindexxx++;
      this.api
        .getJobCardsForSchedular(
          this.pageindexxx,
          this.pageSize,
          '',
          '',
          ' AND TERRITORY_ID=' +
          event +
          " AND STATUS='P' AND ORDER_STATUS !='CA'" +
          likeQuery +
          filterdateee + this.customerMangeer + vendorfilter
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              const newData = data['data'];
              this.tempCount = data['count'];
              var checkcondition = newData.some((newItem) =>
                this.jobdatss.some(
                  (oldItem) => oldItem.ORDER_NO === newItem.ORDER_NO
                )
              );
              this.jobdatss = [...this.jobdatss, ...newData];
              this.groupedData = this.groupByOrderNo(this.jobdatss);
              if (checkcondition) {
                if (this.onscrolldata != '') {
                  setTimeout(() => {
                    this.onscrolldata.scrollTo({
                      top: 0,
                      behavior: 'smooth', 
                    });
                  }, 0);
                }
              } else {
              }
              this.openModal = false;
              this.spinnnnnnn = false;
            } else {
              this.jobdatss = [];
              this.groupedData = {};
              this.spinnnnnnn = false;
              this.message.error('Failed to get pending job data', '');
            }
          },
          () => {
            this.message.error('Something Went Wrong', '');
            this.spinnnnnnn = false;
          }
        );
    } else {
      this.openModal = true;
      this.selectedterritory = null;
    }
  }
  schollength: any = '';
  getdataaaaa() {
    if (this.columns.length > 0) {
      var dataaa = this.columns.length * 60;
      this.schollength = dataaa + 'px';
    } else {
      this.schollength = '1400px';
    }
    return this.schollength;
  }
  Territorytime: any;
  gettime() {
    if (this.terriotryendtime1 && this.terriotrystarttime1) {
      this.terriotryendtime1 = new Date(this.terriotryendtime1);
      this.terriotrystarttime1 = new Date(this.terriotrystarttime1);
      return (
        'Territory Time : ' +
        this.datepipe.transform(this.terriotrystarttime1, 'hh:mm a') +
        '-' +
        this.datepipe.transform(this.terriotryendtime1, 'hh:mm a')
      );
    } else {
      return '';
    }
  }
  isTextOverflowing(element: HTMLElement): boolean {
    return element.offsetWidth < element.scrollWidth;
  }
  groupByOrderNo(data: any[]): any {
    return data.reduce((result, currentItem) => {
      const orderNo = currentItem.ORDER_NO;
      if (!result[orderNo]) {
        result[orderNo] = [];
      }
      result[orderNo].push(currentItem);
      return result;
    }, {});
  }
  getKeys(obj: any): string[] {
    return Object.keys(obj);
  }
  SERVICE_DATA: any = [];
  IS_ORDER_JOB = 'P';
  alljobdata: any = [];
  orderassigndraweropen(orderno: any) {
    if (orderno) {
      this.spinnnnnnn = true;
      this.api
        .getJobCardsForSchedular(
          0,
          0,
          '',
          '',
          " AND STATUS='P' AND ORDER_STATUS !='CA' AND ORDER_NO='" +
          orderno +
          "'"
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.alljobdata = [];
              this.alljobdata = data['data'];
              this.Jobassignsdata = data['data'][0];
              if (this.alljobdata.length > 0) {
                this.SERVICE_DATA = {
                  TERRITORY_ID: this.Jobassignsdata.TERRITORY_ID,
                  EXPECTED_DATE_TIME: this.Jobassignsdata.EXPECTED_DATE_TIME,
                  ESTIMATED_TIME_IN_MIN: this.alljobdata.reduce(
                    (total, item) => total + item.ESTIMATED_TIME_IN_MIN,
                    0
                  ),
                  LATTITUTE: this.Jobassignsdata.LATTITUTE,
                  LONGITUDE: this.Jobassignsdata.LONGITUDE,
                  SERVICE_SKILLS: [
                    ...new Set(
                      this.alljobdata.flatMap((item) =>
                        item.SERVICE_SKILLS.split(',').map((skill) =>
                          skill.trim()
                        )
                      )
                    ),
                  ].join(', '),
                };
              }
              if (this.alljobdata.length > 1) {
                var lenggth = this.alljobdata.length - 1;
                var addmin = lenggth * 10;
                this.SERVICE_DATA.ESTIMATED_TIME_IN_MIN =
                  this.SERVICE_DATA.ESTIMATED_TIME_IN_MIN + addmin;
              }
              this.IS_ORDER_JOB = 'O';
              this.JobassigndrawerTitle =
                'Assign the Order ' + orderno + ' number to the technician';
              this.jobassignshow = true;
              this.spinnnnnnn = false;
            } else {
            }
          },
          () => {
            this.message.error('Something Went Wrong', '');
            this.spinnnnnnn = false;
          }
        );
    }
  }
  getistimatetime(event) {
    if (event) {
      var timeee = event.reduce(
        (total, item) => total + item.ESTIMATED_TIME_IN_MIN,
        0
      );
      if (event.length > 1) {
        var lenggth = event.length - 1;
        var addmin = lenggth * 10;
        return timeee + addmin + ' min';
      } else {
        return '';
      }
    } else {
      return '';
    }
  }
}