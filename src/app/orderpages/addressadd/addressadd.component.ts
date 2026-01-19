import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CookieService } from 'ngx-cookie-service';
import { Address } from 'src/app/Pages/Models/Address';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { NgForm } from '@angular/forms';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
declare let L: any;
declare const google: any;
@Component({
  selector: 'app-addressadd',
  templateUrl: './addressadd.component.html',
  styleUrls: ['./addressadd.component.css'],
  providers: [DatePipe],
})
export class AddressaddComponent {
  @Input() drawerAddressClose: Function;
  @Input() data: Address = new Address();
  @Input() customerAddData;
  isSpinning: boolean = false;
  isStateSpinning: boolean = false;
  isDistrictSpinning: boolean = false;
  isPincodeSpinning: boolean = false;
  custaddress: any = [];
  public commonFunction = new CommonFunctionService();
  isFocused: string = '';
  isContactPersonNameRequired = false;
  ismobnoRequired = false;
  longitude: any;
  latitude: any;
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    public datePipe: DatePipe
  ) { }
  ngOnInit() {
    this.getAllCountry();
    this.data.MOBILE_NO = this.customerAddData[0].MOBILE_NO;
    this.data.CONTACT_PERSON_NAME = this.customerAddData[0].NAME;
    if (this.customerAddData[0].CUSTOMER_TYPE === 'B') {
      this.isContactPersonNameRequired = true;
      this.ismobnoRequired = true;
    } else {
      this.isContactPersonNameRequired = false;
      this.ismobnoRequired = false;
    }
  }
  CityData: any = [];
  PincodeData: any = [];
  StateData: any = [];
  DistrictData: any = [];
  CountryData: any = [];
  getAllCountry() {
    this.api
      .getAllCountryMaster(0, 0, 'NAME', 'asc', ' AND IS_ACTIVE = 1')
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.CountryData = data['data'];
          } else {
            this.CountryData = [];
            this.message.error('Failed to get country data', '');
          }
        },
        () => {
          this.message.error('Something Went Wrong ...', '');
        }
      );
  }
  getStatesByCountry(countryId: any, value: boolean) {
    this.isStateSpinning = true;
    if (value == true) {
      this.data.STATE_ID = null;
      this.data.DISTRICT_ID = null;
      this.data.PINCODE = null;
      this.data.PINCODE_ID = null;
      this.StateData = [];
      this.DistrictData = [];
      this.CityData = [];
      this.PincodeData = [];
    }
    this.api
      .getState(
        0,
        0,
        'NAME',
        'asc',
        ' AND IS_ACTIVE = 1 AND COUNTRY_ID=' + countryId
      )
      .subscribe(
        (data) => {
          if (data['code'] === 200) {
            this.StateData = data['data'];
            this.isStateSpinning = false;
          } else {
            this.StateData = [];
            this.message.error('Failed To Get State Data...', '');
            this.isStateSpinning = false;
          }
        },
        () => {
          this.message.error('Something went wrong.', '');
        }
      );
  }
  getDistrictByState(stateId: any, value: boolean) {
    this.isDistrictSpinning = true;
    if (value == true) {
      this.data.DISTRICT_ID = null;
      this.data.CITY_ID = null;
      this.data.PINCODE_ID = null;
      this.data.PINCODE = null;
      this.DistrictData = [];
      this.CityData = [];
      this.PincodeData = [];
    }
    this.api
      .getdistrict(
        0,
        0,
        'NAME',
        'asc',
        ' AND IS_ACTIVE = 1 AND STATE_ID=' + stateId
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.DistrictData = data['data'];
            this.isDistrictSpinning = false;
          } else {
            this.DistrictData = [];
            this.message.error('Failed To Get District Data...', '');
            this.isDistrictSpinning = false;
          }
        },
        () => {
          this.message.error('Something Went Wrong ...', '');
        }
      );
  }
  getStateandPincode(districtId: number, value: boolean) {
    if (value == true) {
      this.data.CITY_ID = null;
      this.data.PINCODE_ID = null;
      this.data.PINCODE = null;
      this.CityData = [];
      this.PincodeData = [];
    }
    this.getPincodesByCity(districtId, value);
  }
  Filterss: any = {};
  logfilt: any;
  filterdata1: any;
  pincodeChannel: any = '';
  pincodeChannelOld: any = '';
  mappingdata: any = [];
  getpincodename(pincode: any) {
    if (pincode != null && pincode != undefined && pincode != '') {
      this.api
        .getterritoryPincodeData11(
          0,
          0,
          '',
          '',
          ' AND PINCODE_ID IN (' + pincode + ')'
        )
        .subscribe(
          (data) => {
            if (data['code'] === 200) {
              this.mappingdata = data['data'];
              if (this.mappingdata.length == 0) {
                this.message.error(
                  'Sorry, we do not currently serve this pincode. Please select a different pincode.',
                  ''
                );
                this.data.PINCODE_ID = null;
                this.data.PINCODE = null;
              }
            } else {
              this.mappingdata = [];
              this.message.error('Failed To Get Pincode Mapping Data...', '');
            }
            this.isSpinning = false;
          },
          () => {
            this.message.error('Something Went Wrong ...', '');
            this.isSpinning = false;
          }
        );
    }
    if (pincode != null && pincode != undefined && pincode != '') {
      var pin = this.PincodeData.filter((i) => i.ID == pincode);
      if (pin != null && pin != undefined && pin != '') {
        this.data.PINCODE = pin[0]['PINCODE_NUMBER'];
        this.data.PINCODE_FOR = pin[0]['PINCODE_FOR'];
        this.pincodeChannel = 'pincode_' + pin[0]['ID'] + '_channel';
        if (this.pincodeChannelOld === '' || this.pincodeChannelOld === null) {
          this.pincodeChannelOld = 'pincode_' + pin[0]['ID'] + '_channel';
        } else {
          this.pincodeChannelOld = this.pincodeChannelOld;
        }
      } else {
        this.data.PINCODE = null;
        this.data.PINCODE_FOR = '';
      }
    } else {
      this.data.PINCODE = null;
      this.data.PINCODE_FOR = '';
    }
  }
  getPincodesByCity(districtId: number, value: boolean) {
    if (value === true) {
      this.data.PINCODE_ID = null;
      this.data.PINCODE = null;
    }
    this.isPincodeSpinning = true; 
    this.api
      .getAllPincode(
        0,
        0,
        '',
        'asc',
        ` AND IS_ACTIVE = 1 AND DISTRICT=${districtId} ` +
        " AND (PINCODE_FOR='B' OR PINCODE_FOR='S')"
      )
      .subscribe(
        (data) => {
          if (data['code'] === 200) {
            this.PincodeData = data['data'];
            this.data.PINCODE_ID = Number(this.data.PINCODE_ID);
          } else {
            this.PincodeData = [];
            this.message.error('Failed To Get Pincode Data...', '');
          }
          this.isPincodeSpinning = false; 
        },
        () => {
          this.message.error('Something went wrong.', '');
          this.isPincodeSpinning = false; 
        }
      );
  }
  close(accountMasterPage: NgForm) {
    this.drawerAddressClose();
    this.resetDrawer(accountMasterPage);
  }
  resetDrawer(accountMasterPage: NgForm) {
    this.data = new Address();
    accountMasterPage.form.markAsPristine();
    accountMasterPage.form.markAsUntouched();
  }
  @Input() ID;
  isOk: boolean = true;
  save(accountMasterPage: NgForm): void {
    this.isOk = true;
    if (
      this.data.TYPE == undefined &&
      this.data.COUNTRY_ID == undefined &&
      this.data.STATE_ID == undefined &&
      this.data.PINCODE_ID == undefined &&
      !this.data.CITY_NAME
    ) {
      this.isOk = false;
      this.message.error('Please fill all required details', '');
    } else if (this.data.TYPE == undefined || this.data.TYPE == '') {
      this.isOk = false;
      this.message.error('Please Select Address Type', '');
    } else if (
      this.latitude == undefined ||
      this.latitude == '' ||
      this.latitude == null
    ) {
      this.isOk = false;
      this.message.error('Please Enter Latitude', '');
    } else if (
      this.longitude == undefined ||
      this.longitude == '' ||
      this.longitude == null
    ) {
      this.isOk = false;
      this.message.error('Please Enter Longitude', '');
    } else if (
      this.data.ADDRESS_LINE_1 == undefined ||
      this.data.ADDRESS_LINE_1.trim() == '' ||
      this.data.ADDRESS_LINE_1 == null
    ) {
      this.isOk = false;
      this.message.error('Please Enter House Number', '');
    } else if (
      this.data.ADDRESS_LINE_2 === undefined ||
      this.data.ADDRESS_LINE_2.trim() === '' ||
      this.data.ADDRESS_LINE_2 === null
    ) {
      this.isOk = false;
      this.message.error('Please Enter Building Name / Area Name', '');
    } else if (
      this.data.COUNTRY_ID == undefined ||
      this.data.COUNTRY_ID == '' ||
      this.data.COUNTRY_ID == null
    ) {
      this.isOk = false;
      this.message.error('Please Select Country', '');
    } else if (
      this.data.STATE_ID == undefined ||
      this.data.STATE_ID == '' ||
      this.data.STATE_ID == null
    ) {
      this.isOk = false;
      this.message.error('Please Select State', '');
    } else if (
      this.data.DISTRICT_ID == undefined ||
      this.data.DISTRICT_ID == '' ||
      this.data.DISTRICT_ID == null
    ) {
      this.isOk = false;
      this.message.error('Please Select District', '');
    } else if (
      this.data.CITY_NAME == undefined ||
      this.data.CITY_NAME == '' ||
      this.data.CITY_NAME == null
    ) {
      this.isOk = false;
      this.message.error('Please Enter City', '');
    } else if (
      this.data.PINCODE_ID == undefined ||
      this.data.PINCODE_ID == '' ||
      this.data.PINCODE_ID == null
    ) {
      this.isOk = false;
      this.message.error('Please Select Pincode', '');
    } else if (
      this.data.CONTACT_PERSON_NAME == undefined ||
      this.data.CONTACT_PERSON_NAME == '' ||
      this.data.CONTACT_PERSON_NAME == null
    ) {
      this.isOk = false;
      this.message.error('Please Enter Contact Person Name', '');
    } else if (
      this.data.MOBILE_NO == undefined ||
      this.data.MOBILE_NO == '' ||
      this.data.MOBILE_NO == null
    ) {
      this.isOk = false;
      this.message.error('Please Enter Mobile No.', '');
    } else if (
      (this.data.MOBILE_NO != null &&
        this.data.MOBILE_NO != undefined &&
        this.data.MOBILE_NO != 0 &&
        this.data.MOBILE_NO! == '') ||
      !this.commonFunction.mobpattern.test(this.data.MOBILE_NO)
    ) {
      this.isOk = false;
      this.message.error('Please enter a valid mobile number.', '');
    }
    if (this.isOk) {
      this.isSpinning = true;
      this.data.GEO_LOCATION = `${this.latitude},${this.longitude}`;
      this.data.CUSTOMER_NAME = this.customerAddData[0]['NAME'];
      this.data.IS_DEFAULT = true;
      this.api.createCustomerAddress(this.data).subscribe(
        (successCode: any) => {
          if (successCode.code == '200') {
            this.message.success(
              'Customer Address Information Saved Successfully',
              ''
            );
            this.createChannelData();
            this.close(accountMasterPage);
            this.isSpinning = false;
          } else {
            this.message.error('Cannot save Customer Address Information', '');
            this.isSpinning = false;
          }
        },
        (err) => {
          this.isSpinning = false;
        }
      );
    } else {
    }
  }
  createChannelData() {
    var data: any = {
      CHANNEL_NAME: this.pincodeChannel,
      USER_ID: this.customerAddData[0]['ID'],
      STATUS: true,
      CLIENT_ID: 1,
      USER_NAME: this.customerAddData[0]['NAME'],
      TYPE: 'C',
      DATE: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
    };
    this.api.createChannels(data).subscribe(
      (successCode: any) => {
        if (successCode.status == '200') {
          this.isSpinning = false;
        } else {
          this.isSpinning = false;
        }
      },
      (err) => {
        this.isSpinning = false;
      }
    );
  }
  mapDraweVisible = false;
  mapDrawerTitle = 'Select Location';
  map2: any;
  mapOptions: any;
  maps: any;
  marker: any;
  mapss: any;
  markers: any;
  selectedLocation: any;
  noaddress: boolean = false;
  nolandmark: boolean = false;
  varm: any;
  citySearch: any = ''
  stateSearch: any = ''
  countrySearch: any = ''
  locality1Search: any = ''
  locality2Search: any = ''
  buildingSearch: any = ''
  landmarkSearch: any = ''
  building1Search: any = ''
  postcodeSearch: any = ''
  districtSearch: any = '';
  street_number: any = '';
  subpremise: any = '';
  floor: any = '';
  placeName: any = ''
  openmapModal() {
    if (
      !this.data.ADDRESS_LINE_2 ||
      this.data.ADDRESS_LINE_2 == '' ||
      this.data.ADDRESS_LINE_2 == null ||
      this.data.ADDRESS_LINE_2 == undefined
    ) {
      this.noaddress = true;
    } else if (this.address1) {
      this.noaddress = false;
    }
    if (
      !this.data.LANDMARK ||
      this.data.LANDMARK == '' ||
      this.data.LANDMARK == null ||
      this.data.LANDMARK == undefined
    ) {
      this.nolandmark = true;
    } else if (this.address2) {
      this.nolandmark = false;
    }
    let addressParts: any = [];
    if (this.data.COUNTRY_ID) {
      let country = this.CountryData.find(
        (c) => c.ID === this.data.COUNTRY_ID
      )?.NAME;
      if (country) addressParts.push(country);
    }
    if (this.data.STATE_ID) {
      let state = this.StateData.find((s) => s.ID === this.data.STATE_ID)?.NAME;
      if (state) addressParts.push(state);
    }
    if (this.data.DISTRICT_ID) {
      let district = this.DistrictData.find(
        (d) => d.ID === this.data.DISTRICT_ID
      )?.NAME;
      if (district) addressParts.push(district);
    }
    if (this.data.PINCODE) {
      addressParts.push(this.data.PINCODE);
    }
    if (this.data.ADDRESS_LINE_1) {
      addressParts.push(this.data.ADDRESS_LINE_1);
    }
    if (this.data.ADDRESS_LINE_2) {
      addressParts.push(this.data.ADDRESS_LINE_2);
    }
    if (this.data.LANDMARK) {
      addressParts.push(this.data.LANDMARK);
    }
    if (this.data.CITY_NAME) {
      addressParts.push(this.data.CITY_NAME);
    }
    if (Number(this.latitude)) {
      addressParts.push(this.latitude);
    }
    if (Number(this.longitude)) {
      addressParts.push(this.longitude);
    }
    if ((Number(this.latitude) && Number(this.longitude)) || (this.data.LANDMARK !== null && this.data.LANDMARK !== undefined && this.data.LANDMARK !== '') ||
      (this.data.ADDRESS_LINE_2 !== null && this.data.ADDRESS_LINE_2 !== undefined && this.data.ADDRESS_LINE_2 !== '') ||
      (this.data.ADDRESS_LINE_1 !== null && this.data.ADDRESS_LINE_1 !== undefined && this.data.ADDRESS_LINE_1 !== '') ||
      (this.data.COUNTRY_ID !== null && this.data.COUNTRY_ID !== undefined && this.data.COUNTRY_ID !== '') ||
      (this.data.CITY_NAME !== null && this.data.CITY_NAME !== undefined && this.data.CITY_NAME !== '')) {
      this.selectedLocation = addressParts.join(', ');
    } else {
      this.selectedLocation = '';
    }
    this.mapDraweVisible = true;
    setTimeout(() => {
      const searchBox = document.getElementById(
        'searchBox'
      ) as HTMLInputElement;
      if (searchBox) {
        if (this.selectedLocation !== '' && this.selectedLocation !== null && this.selectedLocation !== undefined) {
          searchBox.value = this.selectedLocation || '';
        } else {
          searchBox.value = '';
        }
        this.handleSearch({ target: { value: this.selectedLocation } });
      }
    }, 100);
    if (!this.data.COUNTRY_ID) {
      this.latitude = Number(this.latitude);
      this.longitude = Number(this.longitude);
      setTimeout(() => {
        this.loadMap();
      }, 5);
    }
    if (this.data.ID) {
      this.latitude = this.latitude;
      this.longitude = this.longitude;
      if (this.latitude && this.longitude) {
        this.selectedLocation = '';
      }
      setTimeout(() => {
        this.loadMap();
      }, 5);
    }
  }
  closemapModal() {
    this.mapDraweVisible = false;
    if (this.countrySearch !== '' && this.countrySearch !== undefined && this.countrySearch !== null) {
      this.StateDataValues(this.countrySearch, this.stateSearch, this.postcodeSearch, this.districtSearch)
    }
  }
  loadMap() {
    const map2Element = document.getElementById('map');
    if (!map2Element) return;
    const lat = Number(this.latitude) || 20.5937;
    const lng = Number(this.longitude) || 78.9629;
    this.map2 = new google.maps.Map(map2Element, {
      center: { lat, lng },
      zoom: this.latitude && this.longitude ? 14 : 5,
    });
    if (!isNaN(lat) && !isNaN(lng)) {
      this.marker = new google.maps.Marker({
        position: { lat, lng },
        map: this.map2,
      });
      this.getAddress(lat, lng);
    }
    const input = document.getElementById('searchBox') as HTMLInputElement;
    if (!input) return;
    const searchBox = new google.maps.places.SearchBox(input);
    searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces();
      if (!places || places.length === 0) return;
      const place = places[0];
      const lat = place.geometry?.location?.lat() || 0;
      const lng = place.geometry?.location?.lng() || 0;
      this.placeName = place?.name;
      var formattedaddress: any = ''
      formattedaddress = place?.formatted_address || '';
      this.selectedLocation = formattedaddress;
      this.map2.setCenter({ lat, lng });
      setTimeout(() => {
        this.map2.setZoom(19); 
      }, 100);
      if (this.marker) {
        this.marker.setMap(null);
        this.marker = null;
      }
      this.marker = new google.maps.Marker({
        position: { lat, lng },
        map: this.map2,
      });
      this.getAddress(lat, lng);
    });
    this.map2.addListener('click', (event: any) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      if (this.marker) {
        this.marker.setMap(null);
        this.marker = null;
      }
      this.marker = new google.maps.Marker({
        position: { lat, lng },
        map: this.map2,
      });
      var formattedaddress1: any = ''
      formattedaddress1 = '';
      this.selectedLocation = formattedaddress1;
      this.getAddress(lat, lng);
    });
  }
  address1: any;
  address2: any;
  handleSearch(event: any) {
    const query = event.target.value;
    let lat = this.latitude ? parseFloat(this.latitude) : 20.5942;
    let lng = this.longitude ? parseFloat(this.longitude) : 78.9606;
    const mapElement = document.getElementById('map');
    if (!mapElement) return;
    this.map2 = new google.maps.Map(mapElement, {
      center: { lat, lng },
      zoom: this.latitude && this.longitude ? 14 : 5,
    });
    this.marker = new google.maps.Marker({
      position: { lat, lng },
      map: this.map2,
    });
    const input = document.getElementById('searchBox') as HTMLInputElement;
    if (input) {
      const autocomplete = new google.maps.places.Autocomplete(input);
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) return;
        lat = place.geometry.location.lat();
        lng = place.geometry.location.lng();
        this.getAddress(lat, lng);
        this.map2.setCenter(place.geometry.location);
        setTimeout(() => {
          this.map2.setZoom(19); 
        }, 100);
        this.marker.setPosition(place.geometry.location);
      });
    }
    if (query !== null && query !== undefined && query !== '') {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: query }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;
          lat = location.lat();
          lng = location.lng();
          this.getAddress(lat, lng, null);
          this.map2.setCenter(location);
          setTimeout(() => {
            this.map2.setZoom(19); 
          }, 100);
          this.marker.setPosition(location);
        }
      });
    }
    this.map2.addListener('click', (event: any) => {
      lat = event.latLng.lat();
      lng = event.latLng.lng();
      this.marker.setPosition({ lat, lng });
      var formattedaddress1: any = ''
      formattedaddress1 = '';
      this.selectedLocation = formattedaddress1;
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const placeId = results[0].place_id;
          const service = new google.maps.places.PlacesService(this.map2);
          service.getDetails({ placeId: placeId }, (placeResult, placeStatus) => {
            if (placeStatus === 'OK' && placeResult) {
              this.placeName = placeResult.name || ''; 
              this.getAddress(lat, lng, placeResult);  
            } else {
              this.getAddress(lat, lng, null);
            }
          });
        } else {
          console.warn('Geocoder failed:', status);
          this.getAddress(lat, lng, null);
        }
      });
    });
  }
  handleSearch1(event: any) {
    const query = event.target.value;
    let lat = this.latitude ? parseFloat(this.latitude) : 18.5204;
    let lng = this.longitude ? parseFloat(this.longitude) : 73.8567;
    const mapElement = document.getElementById('map');
    if (!mapElement) return;
    this.map2 = new google.maps.Map(mapElement, {
      center: { lat, lng },
      zoom: this.latitude && this.longitude ? 14 : 5,
    });
    this.marker = new google.maps.Marker({
      position: { lat, lng },
      map: this.map2,
    });
    const input = document.getElementById('searchBox') as HTMLInputElement;
    if (input) {
      const autocomplete = new google.maps.places.Autocomplete(input);
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) return;
        lat = place.geometry.location.lat();
        lng = place.geometry.location.lng();
        this.placeName = place?.name || '';
        this.getAddress(lat, lng, place); 
        this.map2.setCenter(place.geometry.location);
        setTimeout(() => {
          this.map2.setZoom(19); 
        }, 100);
        this.marker.setPosition(place.geometry.location);
      });
    }
    if (query !== null && query !== undefined && query !== '') {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: query }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;
          lat = location.lat();
          lng = location.lng();
          this.getAddress(lat, lng, null);
          this.map2.setCenter(location);
          setTimeout(() => {
            this.map2.setZoom(19); 
          }, 100);
          this.marker.setPosition(location);
        }
      });
    }
    this.map2.addListener('click', (event: any) => {
      lat = event.latLng.lat();
      lng = event.latLng.lng();
      this.marker.setPosition({ lat, lng });
      var formattedaddress11: any = ''
      formattedaddress11 = '';
      this.selectedLocation = formattedaddress11;
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const placeId = results[0].place_id;
          const service = new google.maps.places.PlacesService(this.map2);
          service.getDetails({ placeId: placeId }, (placeResult, placeStatus) => {
            if (placeStatus === 'OK' && placeResult) {
              this.placeName = placeResult.name || ''; 
              this.getAddress(lat, lng, placeResult);  
            } else {
              this.getAddress(lat, lng, null);
            }
          });
        } else {
          console.warn('Geocoder failed:', status);
          this.getAddress(lat, lng, null);
        }
      });
    });
  }
  StateDataValues(country: any, state: any, postcode: any, distt: any) {
    if (country) {
      var countryDatas: any = this.CountryData.find((c: any) => c.NAME === country)?.ID;
      if (countryDatas !== null && countryDatas !== undefined && countryDatas !== '') {
        this.data.COUNTRY_ID = Number(countryDatas);
        this.getStatesByLocationFetch(this.data.COUNTRY_ID, true, state, postcode, distt)
      }
    }
  }
  getStatesByLocationFetch(countryId: any, value: boolean, state: any, postcode: any, distt: any) {
    this.isStateSpinning = true;
    if (value == true) {
      this.data.STATE_ID = null;
      this.data.DISTRICT_ID = null;
      this.data.CITY_ID = null;
      this.data.PINCODE_ID = null;
      this.data.PINCODE = null;
      this.StateData = [];
      this.DistrictData = [];
      this.CityData = [];
      this.PincodeData = [];
    }
    this.api
      .getState(
        0,
        0,
        'NAME',
        'asc',
        ' AND IS_ACTIVE = 1 AND COUNTRY_ID=' + countryId
      )
      .subscribe(
        (data) => {
          if (data['code'] === 200) {
            this.StateData = data['data'];
            if (state) {
              var stateDatas: any = this.StateData.find((c: any) => c.NAME === state)?.ID;
              if (stateDatas !== null && stateDatas !== undefined && stateDatas !== '') {
                this.data.STATE_ID = Number(stateDatas);
                this.getDistrictByLocationFetch(this.data.STATE_ID, true, postcode, distt)
              }
            }
            this.isStateSpinning = false;
          } else {
            this.StateData = [];
            this.isStateSpinning = false;
          }
        },
        () => {
        }
      );
  }
  getDistrictByLocationFetch(stateId: any, value: boolean, postcode: any, distt: any) {
    this.isDistrictSpinning = true;
    if (value == true) {
      this.data.DISTRICT_ID = null;
      this.data.CITY_ID = null;
      this.data.PINCODE_ID = null;
      this.data.PINCODE = null;
      this.DistrictData = [];
      this.CityData = [];
      this.PincodeData = [];
    }
    this.api
      .getdistrict(
        0,
        0,
        'NAME',
        'asc',
        ' AND IS_ACTIVE = 1 AND STATE_ID=' + stateId
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.isDistrictSpinning = false;
            this.DistrictData = data['data'];
            if (distt) {
              var DistrictDatas: any = this.DistrictData.find((c: any) => c.NAME === distt)?.ID;
              if (DistrictDatas !== null && DistrictDatas !== undefined && DistrictDatas !== '') {
                this.data.DISTRICT_ID = Number(DistrictDatas);
                this.getPincodeByLocation(this.data.DISTRICT_ID, true, postcode)
              }
            }
          } else {
            this.DistrictData = [];
            this.isDistrictSpinning = false;
          }
        },
        () => {
        }
      );
  }
  getPincodeByLocation(districtId: number, value: boolean, postcode: any) {
    if (value == true) {
      this.data.CITY_ID = null;
      this.data.PINCODE_ID = null;
      this.data.PINCODE = null;
      this.CityData = [];
      this.PincodeData = [];
    }
    this.isPincodeSpinning = true; 
    this.api
      .getAllPincode(
        0,
        0,
        '',
        'asc',
        ` AND IS_ACTIVE = 1 AND DISTRICT=${districtId} `
      )
      .subscribe(
        (data) => {
          if (data['code'] === 200) {
            this.PincodeData = data['data'];
            if (postcode) {
              var PincodeDatas: any = this.PincodeData.find((c: any) => c.PINCODE_NUMBER === postcode)?.ID;
              if (PincodeDatas !== null && PincodeDatas !== undefined && PincodeDatas !== '') {
                this.data.PINCODE_ID = Number(PincodeDatas);
                this.getpincodename1(this.data.PINCODE_ID);
              }
            }
          } else {
            this.PincodeData = [];
          }
          this.isPincodeSpinning = false; 
        },
        () => {
          this.isPincodeSpinning = false; 
        }
      );
  }
  getpincodename1(pincode: any) {
    if (pincode != null && pincode != undefined && pincode != '') {
      this.api
        .getterritoryPincodeData11(
          0,
          0,
          '',
          '',
          ' AND PINCODE_ID IN (' + pincode + ')'
        )
        .subscribe(
          (data) => {
            if (data['code'] === 200) {
              this.mappingdata = data['data'];
              if (this.mappingdata.length == 0) {
                this.message.error(
                  'Sorry, we do not currently serve this pincode. Please select a different pincode.',
                  ''
                );
                this.data.PINCODE_ID = null;
                this.data.PINCODE = null;
                this.mapDraweVisible = false;
              }
            } else {
              this.mappingdata = [];
            }
            this.isSpinning = false;
          },
          () => {
            this.isSpinning = false;
          }
        );
    }
    if (pincode != null && pincode != undefined && pincode != '') {
      var pin = this.PincodeData.filter((i) => i.ID == pincode);
      if (pin != null && pin != undefined && pin != '') {
        this.data.PINCODE = pin[0]['PINCODE_NUMBER'];
        this.data.PINCODE_FOR = pin[0]['PINCODE_FOR'];
        this.pincodeChannel = 'pincode_' + pin[0]['ID'] + '_channel';
        if (this.pincodeChannelOld === '' || this.pincodeChannelOld === null) {
          this.pincodeChannelOld = 'pincode_' + pin[0]['ID'] + '_channel';
        } else {
          this.pincodeChannelOld = this.pincodeChannelOld;
        }
      } else {
        this.data.PINCODE = null;
        this.data.PINCODE_FOR = '';
      }
    } else {
      this.data.PINCODE = null;
      this.data.PINCODE_FOR = '';
    }
  }
  getAddress(lat: number, lng: number, placeId?: any) {
    const geocoder = new google.maps.Geocoder();
    const latlng = { lat, lng };
    this.citySearch = '';
    this.stateSearch = '';
    this.countrySearch = '';
    this.locality1Search = '';
    this.locality2Search = '';
    this.buildingSearch = '';
    this.landmarkSearch = '';
    this.building1Search = '';
    this.postcodeSearch = '';
    this.districtSearch = '';
    this.street_number = '';
    this.subpremise = '';
    this.floor = '';
    const geocodeRequest = placeId?.place_id ? { placeId: placeId.place_id } : { location: latlng };
    geocoder.geocode(geocodeRequest, (results, status) => {
      if (status === 'OK' && results[0]) {
        const addressComponents: any = results[0].address_components;
        if (addressComponents && addressComponents.length) {
          addressComponents.forEach((component: any) => {
            const types = component?.types;
            if (types.includes('locality')) {
              this.citySearch = component?.long_name || '';
            }
            if (types.includes('administrative_area_level_1')) {
              this.stateSearch = component?.long_name || '';
            }
            if (types.includes('country')) {
              this.countrySearch = component?.long_name || '';
            }
            if (types.some((type: any) => ['sublocality_level_2', 'neighborhood'].includes(type))) {
              this.locality1Search = component.long_name || '';
            }
            if (types.some((type: any) => ['sublocality_level_1', 'neighborhood'].includes(type))) {
              this.locality2Search = component.long_name || '';
            }
            if (types.includes('premise')) {
              this.buildingSearch += (this.buildingSearch ? ', ' : '') + (component?.long_name || '');
            }
            if (types.includes('landmark')) {
              this.landmarkSearch = component?.long_name || '';
            }
            if (types.includes('route')) {
              this.building1Search = component?.long_name || '';
            }
            if (types.some((type: any) => ['plus_code', 'street_number'].includes(type))) {
              this.street_number = component.long_name || '';
            }
            if (types.includes('floor')) {
              this.floor = component?.long_name || '';
            }
            if (types.includes('subpremise')) {
              this.subpremise = component?.long_name || '';
            }
            if (types.includes('postal_code')) {
              this.postcodeSearch = component?.long_name || '';
            }
            if (types.includes('administrative_area_level_3')) {
              this.districtSearch = component?.long_name || '';
            }
          });
          this.data.CITY_NAME = this.citySearch ? this.citySearch : this.districtSearch;
          this.data.LANDMARK = [this.landmarkSearch, this.building1Search, this.locality2Search].filter(part => !!part && part.trim() !== '').join(', ');
          this.data.ADDRESS_LINE_2 = [this.placeName, this.buildingSearch, this.locality1Search].filter(parts => !!parts && parts.trim() !== '').join(', ');
          if (this.data.ADDRESS_LINE_2 === '' || this.data.ADDRESS_LINE_2 === null || this.data.ADDRESS_LINE_2 === undefined) {
            this.data.ADDRESS_LINE_2 = this.data?.LANDMARK;
          }
          this.data.ADDRESS_LINE_1 = [this.floor, this.street_number, this.subpremise].filter(partad => !!partad && partad.trim() !== '').join(', ');
        }
        this.latitude = lat;
        this.longitude = lng;
        if (!this.noaddress) {
          this.data.ADDRESS_LINE_2 = this.data.ADDRESS_LINE_2;
        } else {
          this.address1 = this.data.ADDRESS_LINE_2
        }
        if (!this.nolandmark) {
          this.data.LANDMARK = this.data.LANDMARK;
        } else {
          this.address2 = this.data.LANDMARK;
        }
        if (typeof this.selectedLocation !== 'object') {
          this.selectedLocation = '';
        }
        this.selectedLocation = this.address2
      } else {
        this.selectedLocation = '';
        console.error('Geocoder failed due to: ' + status);
      }
    });
  }
  clearSearchBox() {
    this.selectedLocation = '';
    this.closemapModal();
  }
}