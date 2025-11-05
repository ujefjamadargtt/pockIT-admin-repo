import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
declare const google: any;
@Component({
  selector: 'app-multiplelocationpage',
  templateUrl: './multiplelocationpage.component.html',
  styleUrls: ['./multiplelocationpage.component.css'],
})
export class MultiplelocationpageComponent {
  @Input() technicianmapslocationfilter: any;
  @Input() TYPE = '';
  @Input() FILTER_ID = 0;
  isnodata = false;
  filterQueryDate: any;
  ORDER_IDFilt: any;
  tech_IDFilt: any;
  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService,
    private datepipe: DatePipe
  ) {}

  technician: any;
  ngOnInit(): void {
    this.initMap();
  }
  dataList: any = [];
  isSpinning = false;
  initMap(): void {
    this.isSpinning = true;
    this.isnodata = false;
    var filterquery = '';
    if (this.TYPE == 'ORDER') {
      this.api
        .getorderDetails(0, 0, '', '', ' AND ORDER_ID =' + this.FILTER_ID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              var TECH_IDS: any = [];
              data['data'].forEach((element) => {
                if (element.TECHNICIAN_ID) TECH_IDS.push(element.TECHNICIAN_ID);
              });

              filterquery =
                ' AND ORDER_ID =' +
                this.FILTER_ID +
                ' AND TECHNICIAN_ID in (' +
                TECH_IDS.toString() +
                ')';
              if (TECH_IDS.length > 0) {
                this.ORDER_IDFilt =
                  this.FILTER_ID != null && this.FILTER_ID != undefined
                    ? {
                        ORDER_ID: {
                          $in: [this.FILTER_ID],
                        },
                      }
                    : {};
                this.tech_IDFilt =
                  TECH_IDS != null && TECH_IDS != undefined
                    ? {
                        TECHNICIAN_ID: {
                          $in: TECH_IDS,
                        },
                      }
                    : {};
                this.filterQueryDate = {
                  $and: [this.ORDER_IDFilt, this.tech_IDFilt],
                };
                this.getdataaa(this.filterQueryDate);
              } else {
                this.isSpinning = false;
                this.isnodata = true;
              }
            } else {
              this.isSpinning = false;
              this.isnodata = true;
            }
          },
          (err) => {
            this.isSpinning = false;
            this.isnodata = true;
          }
        );
    } else if (this.TYPE == 'JOB') {
      this.api
        .getpendinjobsdataa(
          1,
          1,
          '',
          '',
          ' AND ID in (' + this.FILTER_ID.toString() + ')'
        )
        .subscribe(
          (data2) => {
            if (data2['code'] == 200) {
              var TECH_IDS: any = [];

              data2['data'].forEach((element) => {
                if (element.TECHNICIAN_ID) TECH_IDS.push(element.TECHNICIAN_ID);
              });

              filterquery =
                ' AND JOB_CARD_ID in (' +
                this.FILTER_ID.toString() +
                ')' +
                ' AND TECHNICIAN_ID in (' +
                TECH_IDS.toString() +
                ')';
              if (TECH_IDS.length > 0) {
                this.ORDER_IDFilt =
                  this.FILTER_ID != null && this.FILTER_ID != undefined
                    ? {
                        JOB_CARD_ID: {
                          $in: [this.FILTER_ID],
                        },
                      }
                    : {};
                this.tech_IDFilt =
                  TECH_IDS != null && TECH_IDS != undefined
                    ? {
                        TECHNICIAN_ID: {
                          $in: TECH_IDS,
                        },
                      }
                    : {};
                this.filterQueryDate = {
                  $and: [this.ORDER_IDFilt, this.tech_IDFilt],
                };
                this.getdataaa(this.filterQueryDate);
              } else {
                this.isSpinning = false;
                this.isnodata = true;
              }
            } else {
              this.isSpinning = false;
              this.isnodata = true;
            }
          },
          (err) => {
            this.isSpinning = false;
            this.isnodata = true;
          }
        );
    } else if (this.TYPE == 'VENDOR') {
      var TECH_IDS: any = [];

      this.api
        .getTechnicianData(0, 0, '', '', ' AND VENDOR_ID =' + this.FILTER_ID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              data['data'].forEach((element) => {
                if (element.ID) TECH_IDS.push(element.ID);
              });
              filterquery =
                ' AND TECHNICIAN_ID in (' + TECH_IDS.toString() + ')';
              if (TECH_IDS.length > 0) {
                this.tech_IDFilt =
                  TECH_IDS != null && TECH_IDS != undefined
                    ? {
                        TECHNICIAN_ID: {
                          $in: TECH_IDS,
                        },
                      }
                    : {};
                this.filterQueryDate = {
                  $and: [this.tech_IDFilt],
                };
                this.getdataaa(this.filterQueryDate);
              }
            }
            this.isSpinning = false;
          },
          (err) => {
            this.isSpinning = false;
            this.isnodata = true;
          }
        );
    }
  }

  getdataaa(filterquery) {
    this.api
      .getTechnicaionLoacionTrackmultiple(0, 0, '_id', 'desc', filterquery)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.technician = [data.data[0]];
            this.isnodata = false;
            if (this.technician.length > 0) {
              this.setLocation();
            } else {
              this.technician = [];
              this.isSpinning = false;
              this.isnodata = true;
            }
            // Initialize the map with updated data
          } else {
            this.message.error('Server Not Found.', '');
          }
        },
        (err: HttpErrorResponse) => {
          this.handleHttpError(err);
        }
      );
  }

  @Input() technicianlocationfilter: any;

  techniciansdata: any;
  handleHttpError(err: HttpErrorResponse) {
    if (err.status === 0) {
      this.message.error(
        'Unable to connect. Please check your internet or server connection and try again shortly.',
        ''
      );
    } else {
      this.message.error('Something Went Wrong.', '');
    }
  }
  setLocation(): void {
    this.isSpinning = false;

    const validLocations = this.technician.filter(
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
        zoom: 18,
      });

      validLocations.forEach((location: any) => {
        const marker = new google.maps.Marker({
          position: {
            lat: parseFloat(location.LOCATION_LATITUDE),
            lng: parseFloat(location.LOCATION_LONG),
          },
          map: map2,
        });
        const convertedDate = this.datepipe.transform(
          location.DATE_TIME,
          'h:mm a'
        );
        const infoWindow = new google.maps.InfoWindow({
          content: `
      <div style="width: 150px; padding: 10px; font-size: 14px; color: #333; 
          background-color: #fff; border-radius: 5px; box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);">
        <h6>${location.TECHNICIAN_NAME}</h6>
        
       
        <p>${convertedDate}</p>
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
}

// <p>${location.CITY_NAME}</p>
