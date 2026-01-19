import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { ApiServiceService } from 'src/app/Service/api-service.service';
declare const google: any;
@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css'],
})
export class LocationComponent implements AfterViewInit, OnInit {
  @Input() TYPE = '';
  @Input() FILTER_ID = 0;
  isnodata = false;
  constructor(private api: ApiServiceService) { }
  ngOnInit(): void {
    this.initMap();
  }
  ngAfterViewInit(): void { }
  dataList: any = [];
  isSpinning = false;
  initMap(): void {
    this.isSpinning = true;
    this.isnodata = false;
    var filterquery = '';
    if (this.TYPE == 'SHOP_ORDER') {
      filterquery = ' AND ID =' + this.FILTER_ID;
      this.getOrderDetailsforshop(filterquery);
    } else if (this.TYPE == 'ORDER') {
      filterquery = ' AND ID =' + this.FILTER_ID;
      this.getOrderDetails(filterquery);
    } else if (this.TYPE == 'CUSTOMER') {
      filterquery = ' AND CUSTOMER_ID =' + this.FILTER_ID;
      this.getOrderDetails(filterquery);
    } else if (this.TYPE == 'JOB') {
      this.api
        .getorderDetails(1, 1, '', '', ' AND JOB_CARD_ID=' + this.FILTER_ID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              filterquery = ' AND ID =' + data['data'][0]['ORDER_ID'];
              this.getOrderDetails(filterquery);
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
      var TERRITORY_IDS: any = [];
      this.api
        .getVendorTerritoryMappedData(
          0,
          0,
          '',
          '',
          ' AND IS_ACTIVE =1 AND VENDOR_ID =' + this.FILTER_ID
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              data['data'].forEach((element) => {
                TERRITORY_IDS.push(element.TERITORY_ID);
              });
              filterquery =
                ' AND TERRITORY_ID in (' + TERRITORY_IDS.toString() + ')';
              this.getOrderDetails(filterquery);
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
    } else if (this.TYPE == 'TECHNICIAN') {
      this.api
        .getpendinjobsdataa(
          1,
          1,
          '',
          '',
          ' AND TECHNICIAN_ID =' + this.FILTER_ID
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              var ORDER_IDS: any = [];
              data['data'].forEach((element) => {
                ORDER_IDS.push(element.ORDER_ID);
              });
              filterquery = ' AND ID in (' + ORDER_IDS.toString() + ')';
              if (ORDER_IDS.length > 0) this.getOrderDetails(filterquery);
              else {
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
    }
  }
  getOrderDetails(filterquery) {
    this.api.getOrdersData(0, 0, '', '', '' + filterquery).subscribe(
      (data) => {
        if (data['code'] == 200 && data['count'] > 0) {
          this.isnodata = false;
          this.dataList = data['data'];
          this.setLocation();
        } else {
          this.dataList = [];
          this.isSpinning = false;
          this.isnodata = true;
        }
      },
      (err: HttpErrorResponse) => {
        this.isSpinning = false;
        this.isnodata = true;
      }
    );
  }
  setLocation() {
    this.isSpinning = false;
    const validLocations = this.dataList.filter(
      (location) =>
        !isNaN(parseFloat(location.SERVICE_LATITUDE)) &&
        !isNaN(parseFloat(location.SERVICE_LONGITUDE))
    );
    const map2Center = {
      lat:
        validLocations.length > 0
          ? validLocations.reduce(
            (sum, loc) => sum + parseFloat(loc.SERVICE_LATITUDE),
            0
          ) / validLocations.length
          : 0,
      lng:
        validLocations.length > 0
          ? validLocations.reduce(
            (sum, loc) => sum + parseFloat(loc.SERVICE_LONGITUDE),
            0
          ) / validLocations.length
          : 0,
    };
    const map2Element = document.getElementById('map');
    if (map2Element) {
      const map2 = new google.maps.Map(map2Element as HTMLElement, {
        center: map2Center,
        zoom: 14,
      });
      validLocations.forEach((location: any) => {
        const marker = new google.maps.Marker({
          position: {
            lat: parseFloat(location.SERVICE_LATITUDE),
            lng: parseFloat(location.SERVICE_LONGITUDE),
          },
          map: map2,
        });
        const infoWindow = new google.maps.InfoWindow({
          content: `
      <div style="width: 200px; padding: 10px; font-size: 14px; color: #333; 
          ">
        <h6>${location.CUSTOMER_NAME}</h6>
        <p>${location.SERVICE_ADDRESS}</p>
        <p>${location.SERVICE_LATITUDE},${location.SERVICE_LONGITUDE}</p>
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
  getOrderDetailsforshop(filterquery) {
    this.api.getshopOrdersData(0, 0, '', '', '' + filterquery).subscribe(
      (data) => {
        if (data['status'] == 200) {
          this.dataList = data['body']['data'];
          this.setLocation();
          this.isSpinning = false;
        } else {
          this.dataList = [];
          this.isSpinning = false;
        }
      },
      (err: HttpErrorResponse) => {
        if (err.status === 0) {
          this.isSpinning = false;
        } else {
          this.isSpinning = false;
        }
        this.dataList = [];
      }
    );
  }
}
