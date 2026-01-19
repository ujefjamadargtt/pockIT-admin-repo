import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DatePipe } from '@angular/common';
import { NgForm } from '@angular/forms';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CookieService } from 'ngx-cookie-service';
import { pincode } from 'src/app/Pages/Models/pincode';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
declare const google: any;
@Component({
  selector: 'app-pincode',
  templateUrl: './pincode.component.html',
  styleUrls: ['./pincode.component.css'],
})
export class PincodeComponent {
  @Input() drawerClose: Function;
  @Input() data: pincode;
  @Input() drawerVisible: boolean;
  public commonFunction = new CommonFunctionService();
  loadingRecords = true;
  isSpinning = false;
  isOk = true;
  isFocused: string = '';
  countryName: any;
  districtName: any;
  stateName: any;
  constructor(
    private api: ApiServiceService,
    private cookie: CookieService,
    private datePipe: DatePipe,
    private message: NzNotificationService
  ) { }
  validateInput(event: KeyboardEvent): void {
    const allowedPattern = /^[a-zA-Z\s\/\(\)_\-\&]*$/; 
    const char = event.key; 
    if (!allowedPattern.test(char)) {
      event.preventDefault(); 
    }
  }
  ngOnInit() {
    this.getCountry();
    if (this.data?.COUNTRY_ID) {
      this.getStatesByCountry(this.data.COUNTRY_ID, false);
    }
    if (this.data?.STATE_ID) {
      this.getDistrictByState(this.data.STATE_ID, false);
    }
    if (this.data.ID) {
    }
  }
  getCountryNameById(countryId: any): string {
    const country = this.CountryData.find((data: any) => data.ID === countryId);
    return country ? country.NAME : '';
  }
  getsistrictNameById(countryId: any): string {
    const country = this.DistrictData.find(
      (data: any) => data.ID === countryId
    );
    return country ? country.NAME : '';
  }
  getstateNameById(countryId: any): string {
    const country = this.StateData.find((data: any) => data.ID === countryId);
    return country ? country.NAME : '';
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      const { COUNTRY_ID, STATE } = this.data;
      if (COUNTRY_ID) {
        this.getStatesByCountry(COUNTRY_ID, false);
      }
      if (STATE) {
        this.getDistrictByState(STATE, false);
      }
    }
  }
  close(accountMasterPage: NgForm) {
    this.drawerClose();
    this.resetDrawer(accountMasterPage);
  }
  resetDrawer(accountMasterPage: NgForm) {
    this.data = new pincode();
    accountMasterPage.form.markAsPristine();
    accountMasterPage.form.markAsUntouched();
  }
  save(addNew: boolean, accountMasterPage: NgForm): void {
    this.isOk = true;
    if (
      (this.data.COUNTRY_ID == undefined || this.data.COUNTRY_ID == null) &&
      (this.data.STATE == undefined || this.data.STATE == null) &&
      (this.data.DISTRICT == undefined || this.data.DISTRICT == null) &&
      (this.data.PINCODE == undefined || this.data.PINCODE == null) &&
      (this.data.LATTITUDE == undefined || this.data.LATTITUDE == null) &&
      (this.data.LONGITUDE == undefined || this.data.LONGITUDE == null)
    ) {
      this.isOk = false;
      this.message.error('Please fill all required details', '');
    } else if (
      this.data.LATTITUDE == null ||
      this.data.LATTITUDE == undefined ||
      this.data.LATTITUDE == 0
    ) {
      this.isOk = false;
      this.message.error('Please Enter Latitude', '');
    } else if (
      this.data.LONGITUDE == null ||
      this.data.LONGITUDE == undefined ||
      this.data.LONGITUDE == 0
    ) {
      this.isOk = false;
      this.message.error('Please Enter Longitude', '');
    } else if (
      this.data.COUNTRY_ID == null ||
      this.data.COUNTRY_ID == undefined ||
      this.data.COUNTRY_ID == 0
    ) {
      this.isOk = false;
      this.message.error('Please Select Country ', '');
    } else if (
      this.data.STATE == null ||
      this.data.STATE == undefined ||
      this.data.STATE == 0
    ) {
      this.isOk = false;
      this.message.error('Please Select State', '');
    } else if (!this.data.DISTRICT) {
      this.isOk = false;
      this.message.error('Please Select District Name', '');
    }
    else if (!this.data.PINCODE || this.data.PINCODE.trim() == '') {
      this.isOk = false;
      this.message.error('Please Enter Pincode', '');
    } else if (
      this.data.PINCODE_FOR == null ||
      this.data.PINCODE_FOR == undefined ||
      this.data.PINCODE_FOR == 0
    ) {
      this.isOk = false;
      this.message.error('Please Select Pincode For', '');
    }
    if (this.isOk) {
      this.isSpinning = true;
      this.data.COUNTRY_NAME = this.countryName;
      this.data.STATE_NAME = this.stateName;
      this.data.DISTRICT_NAME = this.districtName;
      if (this.data.ID) {
        if (this.data.TALUKA === '') {
          this.data.TALUKA = null;
        }
        if (this.data.DIVISION_NAME === '') {
          this.data.DIVISION_NAME = null;
        }
        if (this.data.CIRCLE_NAME === '') {
          this.data.CIRCLE_NAME = null;
        }
        if (this.data.SUB_OFFICE === '') {
          this.data.SUB_OFFICE = null;
        }
        if (this.data.HEAD_OFFICE === '') {
          this.data.HEAD_OFFICE = null;
        }
        this.api.updatePincode(this.data).subscribe(
          (successCode) => {
            if (successCode['code'] == 200) {
              this.message.success(
                'Pincode Information Updated Successfully',
                ''
              );
              if (!addNew) this.drawerClose();
              this.isSpinning = false;
              this.resetDrawer(accountMasterPage);
            } else if (successCode['code'] == 300) {
              this.message.info('The pincode you entered already exists.', '');
              this.isSpinning = false;
            }
            else {
              this.message.error('Pincode Information Updation Failed', '');
              this.isSpinning = false;
            }
          },
          (err) => {
            if (err['code'] == 300) {
              this.message.info('The pincode you entered already exists.', '');
              this.isSpinning = false;
            } else {
              this.message.error(
                'Something went wrong, please try again later',
                ''
              );
              this.isSpinning = false;
            }
          }
        );
      } else {
        this.api.createPincode(this.data).subscribe(
          (successCode) => {
            if (successCode['code'] == 200) {
              this.isSpinning = false;
              this.message.success(
                'Pincode Information Saved Successfully',
                ''
              );
              if (!addNew) {
                this.drawerClose();
                this.resetDrawer(accountMasterPage);
              } else {
                this.data = new pincode();
                this.resetDrawer(accountMasterPage);
              }
            } else if (successCode['code'] == 300) {
              this.message.info('The pincode you entered already exists.', '');
              this.isSpinning = false;
            } else {
              this.message.error('Cannot save Pincode Information', '');
              this.isSpinning = false;
            }
          },
          (err) => {
            if (err['code'] == 300) {
              this.message.info('The pincode you entered already exists.', '');
              this.isSpinning = false;
            } else {
              this.message.error(
                'Something went wrong, please try again later',
                ''
              );
              this.isSpinning = false;
            }
          }
        );
      }
    }
  }
  City1: any = [];
  CountryData: any = [];
  isContrySpinning = false;
  getCountry() {
    this.isContrySpinning = true;
    this.api
      .getAllCountryMaster(0, 0, 'NAME', 'asc', ' AND IS_ACTIVE = 1')
      .subscribe(
        (forms) => {
          if (forms['code'] == 200) {
            this.CountryData = forms['data'];
            this.countryName = this.getCountryNameById(this.data.COUNTRY_ID);
            this.isContrySpinning = false;
          } else {
            this.CountryData = [];
            this.message.error('Failed to get country data', '');
            this.isContrySpinning = false;
          }
        },
        (err) => {
          this.CountryData = [];
          this.isContrySpinning = false;
        }
      );
  }
  StateData: any = [];
  isStateSpinning = false;
  getStatesByCountry(countryId: any, value: boolean) {
    if (value == true) {
      this.data.STATE = null;
      this.data.DISTRICT = null;
      this.StateData = [];
      this.DistrictData = [];
    }
    this.countryName = this.getCountryNameById(countryId);
    this.isStateSpinning = true;
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
            this.stateName = this.getstateNameById(this.data.STATE);
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
    if (value == true) {
      this.data.DISTRICT = null;
      this.DistrictData = [];
    }
    this.stateName = this.getstateNameById(stateId);
    this.isDistSpinning = true;
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
            this.isDistSpinning = false;
          } else {
            this.DistrictData = [];
            this.message.error('Failed To Get District Data...', '');
            this.isDistSpinning = false;
          }
        },
        () => {
          this.message.error('Something Went Wrong ...', '');
        }
      );
  }
  getData(districtId: any) {
    this.districtName = this.getsistrictNameById(districtId);
  }
  DistrictData: any = [];
  isDistSpinning = false;
  mapDraweVisible = false;
  mapDrawerTitle = 'Select Location';
  map2: any;
  selectedLocation: any;
  noaddress: boolean = false;
  noaddress1: boolean = false;
  noaddress2: boolean = false;
  noaddress3: boolean = false;
  address1: any;
  address2: any;
  address3: any;
  address4: any;
  mapOptions: any;
  maps: any;
  marker: any;
  mapss: any;
  markers: any;
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
      !this.data.PINCODE ||
      this.data.PINCODE == '' ||
      this.data.PINCODE == null ||
      this.data.PINCODE == undefined
    ) {
      this.noaddress3 = true;
    } else if (this.address4) {
      this.noaddress3 = false;
    }
    let addressParts: any = [];
    if (this.data.COUNTRY_ID) {
      let country = this.CountryData.find(
        (c) => c.ID === this.data.COUNTRY_ID
      )?.NAME;
      if (country) addressParts.push(country);
    }
    if (this.data.STATE) {
      let state = this.StateData.find((s) => s.ID === this.data.STATE)?.NAME;
      if (state) addressParts.push(state);
    }
    if (this.data.DISTRICT) {
      let district = this.DistrictData.find(
        (d) => d.ID === this.data.DISTRICT
      )?.NAME;
      if (district) addressParts.push(district);
    }
    if (this.data.PINCODE) {
      addressParts.push(this.data.PINCODE);
    }
    if ((Number(this.data.LATTITUDE) && Number(this.data.LONGITUDE)) ||
      (this.data.PINCODE !== null && this.data.PINCODE !== undefined && this.data.PINCODE !== '') ||
      (this.data.COUNTRY_ID !== null && this.data.COUNTRY_ID !== undefined && this.data.COUNTRY_ID !== '')) {
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
    if (!this.data.COUNTRY_ID || !this.data.PINCODE) {
      this.data.LATTITUDE = Number(this.data.LATTITUDE);
      this.data.LONGITUDE = Number(this.data.LONGITUDE);
      setTimeout(() => {
        this.loadMap();
      }, 5);
    }
    if (this.data.ID) {
      this.data.LATTITUDE = this.data.LATTITUDE;
      this.data.LONGITUDE = this.data.LONGITUDE;
      if (this.data.LATTITUDE && this.data.LONGITUDE) {
        this.selectedLocation = '';
      }
      setTimeout(() => {
        this.loadMap();
      }, 5);
    }
  }
  loadMap() {
    const map2Element = document.getElementById('map');
    if (!map2Element) return;
    const lat = Number(this.data.LATTITUDE) || 20.5937;
    const lng = Number(this.data.LONGITUDE) || 78.9629;
    this.map2 = new google.maps.Map(map2Element, {
      center: { lat, lng },
      zoom: this.data.LATTITUDE && this.data.LONGITUDE ? 14 : 5,
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
      this.getAddress(lat, lng, place);
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
  handleSearch(event: any) {
    const query = event.target.value;
    let lat = this.data.LATTITUDE ? parseFloat(this.data.LATTITUDE) : 18.5204;
    let lng = this.data.LONGITUDE ? parseFloat(this.data.LONGITUDE) : 73.8567;
    const mapElement = document.getElementById('map');
    if (!mapElement) return;
    this.map2 = new google.maps.Map(mapElement, {
      center: { lat, lng },
      zoom: this.data.LATTITUDE && this.data.LONGITUDE ? 14 : 5,
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
    let lat = this.data.LATTITUDE ? parseFloat(this.data.LATTITUDE) : 18.5204;
    let lng = this.data.LONGITUDE ? parseFloat(this.data.LONGITUDE) : 73.8567;
    const mapElement = document.getElementById('map');
    if (!mapElement) return;
    this.map2 = new google.maps.Map(mapElement, {
      center: { lat, lng },
      zoom: this.data.LATTITUDE && this.data.LONGITUDE ? 14 : 5,
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
    if (value == true) {
      this.data.STATE = null;
      this.data.DISTRICT = null;
      this.StateData = [];
      this.DistrictData = [];
    }
    this.countryName = this.getCountryNameById(countryId);
    this.isStateSpinning = true;
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
            this.isStateSpinning = false;
            this.StateData = data['data'];
            if (state) {
              var stateDatas: any = this.StateData.find((c: any) => c.NAME === state)?.ID;
              if (stateDatas !== null && stateDatas !== undefined && stateDatas !== '') {
                this.data.STATE = Number(stateDatas);
                this.stateName = this.getstateNameById(this.data.STATE);
                this.getDistrictByLocationFetch(this.data.STATE, true, postcode, distt)
              }
            }
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
  getDistrictByLocationFetch(stateId: any, value: boolean, postcode: any, distt: any) {
    if (value == true) {
      this.data.DISTRICT = null;
      this.DistrictData = [];
    }
    this.stateName = this.getstateNameById(stateId);
    this.isDistSpinning = true;
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
            this.isDistSpinning = false;
            if (distt) {
              var DistrictDatas: any = this.DistrictData.find((c: any) => c.NAME === distt)?.ID;
              if (DistrictDatas !== null && DistrictDatas !== undefined && DistrictDatas !== '') {
                this.data.DISTRICT = Number(DistrictDatas);
                this.getData(DistrictDatas);
              }
            }
          } else {
            this.DistrictData = [];
            this.message.error('Failed To Get District Data...', '');
            this.isDistSpinning = false;
          }
        },
        () => {
          this.message.error('Something Went Wrong ...', '');
        }
      );
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
            if (types.includes('administrative_area_level_3')) {
              this.districtSearch = component?.long_name || '';
            }
            if (types.includes('postal_code')) {
              this.postcodeSearch = component?.long_name || '';
            }
          });
        }
        this.data.LATTITUDE = lat;
        this.data.LONGITUDE = lng;
        if (this.data.ID || !this.noaddress3) {
          this.data.PINCODE = this.data.PINCODE;
        } else {
          this.data.PINCODE = this.postcodeSearch || '';
          this.address4 = this.data.PINCODE;
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
  closemapModal() {
    this.mapDraweVisible = false;
    if (this.countrySearch !== '' && this.countrySearch !== undefined && this.countrySearch !== null) {
      this.StateDataValues(this.countrySearch, this.stateSearch, this.postcodeSearch, this.districtSearch)
    }
  }
  clearSearchBox() {
    this.selectedLocation = '';
    this.closemapModal();
  }
}