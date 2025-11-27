import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { customer } from 'src/app/Pages/Models/customer';
import { customerAddLoginsAddress } from 'src/app/Pages/Models/customerAddLoginsAddress';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
declare const google: any;

@Component({
  selector: 'app-add-login-address-details',
  templateUrl: './add-login-address-details.component.html',
  styleUrls: ['./add-login-address-details.component.css'],
})
export class AddLoginAddressDetailsComponent {
  @Input() drawerVisibleCustomerAddLoginsAddress: boolean = false;
  @Input() drawerCustomerAddLoginsAddressClose;
  @Input() data: customerAddLoginsAddress = new customerAddLoginsAddress();
  @Input() dataList;
  @Input() mainCustData: customer = new customer();
  @Input() isReadOnly: boolean = false;
  @Input() addressdata2: any;
  @Input() whosAddress: any;

  @Input() ID;
  @Input() isAddressReadOnly;
  @Input() selectedAddressData;
  @Input() tempCustID;
  @Input() secondDrawerData;

  Branch: any = [];
  public commonFunction = new CommonFunctionService();
  isFocused: string = '';
  // City1: any = []
  longitude: any;
  latitude: any;
  isSpinning: boolean = false;
  cdr: any;

  constructor(
    private api: ApiServiceService,
    private datePipe: DatePipe,
    private message: NzNotificationService
  ) {}

  isStateSpinning: boolean = false;
  isDistrictSpinning: boolean = false;
  isCitySpinning: boolean = false;
  isPincodeSpinning: boolean = false;
  custaddress: any = [];
  isContactPersonNameRequired = false;
  ismobnoRequired = false;

  ngOnInit() {
    if (
      this.selectedAddressData &&
      this.selectedAddressData != undefined &&
      this.selectedAddressData != null &&
      this.selectedAddressData != ''
    ) {
      if (this.data.ID) {
        this.data.MOBILE_NO = this.selectedAddressData.MOBILE_NO;
        // this.data.CUSTOMER_ID = this.selectedAddressData.CUSTOMER_ID;
        // this.data.CONTACT_PERSON_NAME =  this.selectedAddressData.CONTACT_PERSON_NAME;
        if (
          this.data.ID &&
          this.data.ID != null &&
          this.data.ID != undefined &&
          this.data.ID != ''
        ) {
          this.data.CUSTOMER_ID = this.data.CUSTOMER_ID;
        } else {
          this.data.CUSTOMER_ID = this.selectedAddressData.CUSTOMER_ID;
        }
      } else {
        this.data.MOBILE_NO = this.selectedAddressData.MOBILE_NO;
        this.data.CONTACT_PERSON_NAME = this.selectedAddressData.CUSTOMER_NAME;
        // this.data.CUSTOMER_ID = this.selectedAddressData.CUSTOMER_ID;
        // this.data.CUSTOMER_ID = this.tempCustID;
        if (
          this.data.ID &&
          this.data.ID != null &&
          this.data.ID != undefined &&
          this.data.ID != ''
        ) {
          this.data.CUSTOMER_ID = this.data.CUSTOMER_ID;
        } else {
          this.data.CUSTOMER_ID = this.tempCustID;
        }
      }
    } else {
      if (
        this.data.ID &&
        this.data.ID != null &&
        this.data.ID != undefined &&
        this.data.ID != ''
      ) {
        this.data.CUSTOMER_ID = this.data.CUSTOMER_ID;
      } else {
        if (
          this.secondDrawerData.ID &&
          this.secondDrawerData.ID != null &&
          this.secondDrawerData.ID != undefined &&
          this.secondDrawerData.ID != ''
        ) {
          this.data.CUSTOMER_ID = this.secondDrawerData.ID;
        } else {
          this.data.CUSTOMER_ID = this.tempCustID;
        }
      }
    }
    // this.api
    //   .getAllCustomer(0, 0, '', '', ' AND IS_PARENT=0 AND ID =' + this.ID)
    //   .subscribe((data) => {
    //     this.custaddress = data['data'];
    //     const customer = this.custaddress[0];

    //     if (this.data.ID) {
    //       this.data.MOBILE_NO = this.data.MOBILE_NO;
    //       this.data.CUSTOMER_ID = customer.ID;
    //       this.data.CONTACT_PERSON_NAME = this.data.CONTACT_PERSON_NAME;
    //     } else {
    //       this.data.MOBILE_NO = customer.MOBILE_NO;
    //       this.data.CONTACT_PERSON_NAME = customer.NAME;
    //       this.data.CUSTOMER_ID = customer.ID;
    //     }
    //   });

    this.getallCountry();
    if (this.data?.COUNTRY_ID) {
      this.getStatesByCountry(this.data.COUNTRY_ID, false);
    }
    if (this.data?.STATE_ID) {
      this.getDistrictByState(this.data.STATE_ID, false);
    }

    // if (this.data?.DISTRICT_ID) {
    //   this.getCitiesByState(this.data.DISTRICT_ID, false);
    // }
    if (this.data?.DISTRICT_ID) {
      this.getPincodesByCity(this.data.DISTRICT_ID, false);
    }

    if (
      this.data.GEO_LOCATION != null &&
      this.data.GEO_LOCATION != undefined &&
      this.data.GEO_LOCATION != ''
    ) {
      var geodata = this.data.GEO_LOCATION.split(',');
      this.latitude = geodata[0];
      this.longitude = geodata[1];
    }
  }

  CityData: any = [];
  PincodeData: any = [];
  StateData: any = [];
  DistrictData: any = [];
  CountryData: any = [];

  getallCountry() {
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

  // Fetch states based on country ID
  getStatesByCountry(countryId: any, value: boolean) {
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
            //this.data.STATE_ID = "";
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
    // this.getCitiesByState(districtId, value);
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
    this.isPincodeSpinning = true; // Set loading to true when fetching data
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
            if (this.data.ID) {
              this.getpincodename(this.data.PINCODE_ID);
            }
            this.data.PINCODE_ID = Number(this.data.PINCODE_ID);
          } else {
            this.PincodeData = [];
            this.message.error('Failed To Get Pincode Data...', '');
          }
          this.isPincodeSpinning = false; // Ensure spinning state is turned off after data is fetched
        },
        () => {
          this.message.error('Something went wrong.', '');
          this.isPincodeSpinning = false; // Ensure spinning state is turned off on error
        }
      );
  }

  state: any = [];
  country: any = [];
  pincode: any = [];
  City1: any = [];

  close(accountMasterPage: NgForm) {
    this.isSpinning = true;
    this.drawerCustomerAddLoginsAddressClose();
    this.resetDrawer(accountMasterPage);
    this.isSpinning = false;
  }

  resetDrawer(accountMasterPage: NgForm) {
    this.data = new customerAddLoginsAddress();
    accountMasterPage.form.markAsPristine();
    accountMasterPage.form.markAsUntouched();
  }

  isOk: boolean = true;

  save(accountMasterPage: NgForm): void {
    if (this.whosAddress === 'ParentAddress') {
      if (
        this.data.ID &&
        this.data.ID != null &&
        this.data.ID != undefined &&
        this.data.ID != ''
      ) {
        this.data.PARENT_ADDRESS_ID = this.data.PARENT_ADDRESS_ID;
      } else {
        this.data.PARENT_ADDRESS_ID = this.addressdata2?.[0]['ID'];
      }
    } else {
      if (
        this.data.ID &&
        this.data.ID != null &&
        this.data.ID != undefined &&
        this.data.ID != ''
      ) {
        this.data.PARENT_ADDRESS_ID = this.data.PARENT_ADDRESS_ID;
      } else {
        this.data.PARENT_ADDRESS_ID = null;
      }
    }
    // if (this.isReadOnly) {
    //   this.data.PARENT_ADDRESS_ID = this.data.PARENT_ADDRESS_ID
    //     ? this.data.PARENT_ADDRESS_ID
    //     : this.addressdata2?.[0]['ID'];
    //   // this.data.PARENT_ADDRESS_ID = this.data.PARENT_ADDRESS_ID ?this.data.PARENT_ADDRESS_ID :this.addressdata2[0]['ID']
    // } else {
    //   this.data.PARENT_ADDRESS_ID = null;
    // }

    // this.isSpinning=true;
    this.isOk = true;

    if (
      this.data.TYPE == undefined &&
      this.data.ADDRESS_LINE_1 == undefined &&
      this.data.COUNTRY_ID == undefined &&
      this.data.STATE_ID == undefined &&
      this.data.PINCODE_ID == undefined &&
      !this.data.CITY_NAME
    ) {
      this.isOk = false;
      this.message.error('Please fill all required details', '');
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
    } else if (this.data.TYPE == undefined || this.data.TYPE == '') {
      this.isOk = false;

      this.message.error('Please Select Address Type', '');
    } else if (
      this.data.ADDRESS_LINE_1 == undefined ||
      this.data.ADDRESS_LINE_1.trim() == '' ||
      this.data.ADDRESS_LINE_1 == null
    ) {
      this.isOk = false;

      this.message.error('Please Enter House No./Flat No./Floor No.', '');
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
      this.data.CITY_NAME === undefined ||
      this.data.CITY_NAME.trim() === '' ||
      this.data.CITY_NAME === null
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

    this.data.CUSTOMER_DETAILS_ID = this.mainCustData.ID;

    // this.isSpinning = true
    // setTimeout(() => {
    if (this.isOk) {
      this.data.GEO_LOCATION = `${this.latitude},${this.longitude}`;

      if (this.selectedAddressData && this.selectedAddressData.length > 0) {
        // if (this.custaddress && this.custaddress.length > 0) {
        // Avoid overriding MOBILE_NO if it has been cleared
        if (
          !this.data.MOBILE_NO ||
          this.data.MOBILE_NO === null ||
          this.data.MOBILE_NO === undefined ||
          this.data.MOBILE_NO.trim() === ''
        ) {
          this.data.MOBILE_NO = '';
        }
      }
      if (this.data.ID) {
        if (this.data.FLOOR == '') {
          this.data.FLOOR = null;
        }
        if (this.data.BUILDING == '') {
          this.data.BUILDING = null;
        }
        if (this.data.LANDMARK == '') {
          this.data.LANDMARK = null;
        }
        this.isSpinning = true;
        this.data.CUSTOMER_NAME = this.selectedAddressData.CUSTOMER_NAME;
        // this.data.CUSTOMER_NAME = this.custaddress[0]['CUSTOMER_NAME'];
        if (this.data.IS_DEFAULT) {
          this.api.updateCustomerAddressNew(this.data).subscribe(
            (successCode: any) => {
              if (successCode.code == '200') {
                this.isSpinning = false;
                this.message.success(
                  'Customer Address Information Updated Successfully',
                  ''
                );
                this.updateChannelData();
                this.resetDrawer(accountMasterPage);
                this.drawerCustomerAddLoginsAddressClose();
              } else {
                this.message.error(
                  'Cannot update Customer Address Information',
                  ''
                );
                this.isSpinning = false;
              }
            },
            (err) => {
              this.isSpinning = false;
            }
          );
        } else {
          this.api
            .getAllCustomerAddress(
              0,
              0,
              'IS_DEFAULT',
              'desc',
              ' AND STATUS = 1 AND CUSTOMER_ID= ' + this.ID
            )
            .subscribe((data) => {
              if (data['count'] > 0) {
                var filteredAddresses = data['data'].filter(
                  (address) => address.ID !== this.data.ID
                );
                var addressdata: any = filteredAddresses.find(
                  (address) => address.IS_DEFAULT === 1
                );
                if (
                  addressdata !== null &&
                  addressdata !== undefined &&
                  addressdata !== ''
                ) {
                  this.api.updateCustomerAddressNew(this.data).subscribe(
                    (successCode: any) => {
                      if (successCode.code == '200') {
                        this.isSpinning = false;
                        this.message.success(
                          'Customer Address Information Updated Successfully',
                          ''
                        );
                        this.updateChannelData();
                        this.resetDrawer(accountMasterPage);
                        this.drawerCustomerAddLoginsAddressClose();
                      } else {
                        this.message.error(
                          'Cannot update Customer Address Information',
                          ''
                        );
                        this.isSpinning = false;
                      }
                    },
                    (err) => {
                      this.isSpinning = false;
                    }
                  );
                } else {
                  this.isSpinning = false;
                  this.message.info(
                    "Currently you don't have any default address, please set this address as default address",
                    ''
                  );
                }
              } else {
                if (!this.data.IS_DEFAULT) {
                  this.isSpinning = false;
                  this.message.info(
                    "Currently you don't have any default address, please set this address as default address",
                    ''
                  );
                } else {
                  this.api.updateCustomerAddressNew(this.data).subscribe(
                    (successCode: any) => {
                      if (successCode.code == '200') {
                        this.isSpinning = false;
                        this.message.success(
                          'Customer Address Information Updated Successfully',
                          ''
                        );
                        this.updateChannelData();
                        this.resetDrawer(accountMasterPage);
                        this.drawerCustomerAddLoginsAddressClose();
                      } else {
                        this.message.error(
                          'Cannot update Customer Address Information',
                          ''
                        );
                        this.isSpinning = false;
                      }
                    },
                    (err) => {
                      this.isSpinning = false;
                    }
                  );
                }
              }
            });
        }
      } else {
        this.isSpinning = true;
        this.data.CUSTOMER_NAME = this.selectedAddressData.CUSTOMER_NAME;
        // this.data.CUSTOMER_NAME = this.custaddress[0]['CUSTOMER_NAME'];
        if (this.data.IS_DEFAULT) {
          // this.data.IS_DEFAULT = true;
          this.api.createCustomerAddress(this.data).subscribe(
            (successCode: any) => {
              if (successCode.code == '200') {
                this.isSpinning = false;

                this.message.success(
                  'Customer Address Information Saved Successfully',
                  ''
                );
                this.createChannelData();
                this.resetDrawer(accountMasterPage);

                this.drawerCustomerAddLoginsAddressClose();
              } else {
                this.message.error(
                  'Cannot update Customer Address Information',
                  ''
                );
                this.isSpinning = false;
              }
            },
            (err) => {
              this.isSpinning = false;
            }
          );
        } else {
          this.api
            .getAllCustomerAddress(
              0,
              0,
              'IS_DEFAULT',
              'desc',
              ' AND STATUS = 1 AND CUSTOMER_ID= ' + this.ID
            )
            .subscribe((data) => {
              if (data['count'] > 0) {
                var addressdata: any = data['data'].find(
                  (address) => address.IS_DEFAULT === 1
                );
                if (
                  addressdata !== null &&
                  addressdata !== undefined &&
                  addressdata !== ''
                ) {
                  // this.data.IS_DEFAULT = true;
                  this.api.createCustomerAddress(this.data).subscribe(
                    (successCode: any) => {
                      if (successCode.code == '200') {
                        this.isSpinning = false;

                        this.message.success(
                          'Customer Address Information Saved Successfully',
                          ''
                        );
                        this.createChannelData();
                        this.resetDrawer(accountMasterPage);

                        this.drawerCustomerAddLoginsAddressClose();
                      } else {
                        this.message.error(
                          'Cannot update Customer Address Information',
                          ''
                        );
                        this.isSpinning = false;
                      }
                    },
                    (err) => {
                      this.isSpinning = false;
                    }
                  );
                } else {
                  this.isSpinning = false;
                  this.message.info(
                    "Currently you don't have any default address, please set this address as default address",
                    ''
                  );
                }
              } else {
                if (!this.data.IS_DEFAULT) {
                  this.isSpinning = false;
                  this.message.info(
                    "Currently you don't have any default address, please set this address as default address",
                    ''
                  );
                } else {
                  // this.data.IS_DEFAULT = true;
                  this.api.createCustomerAddress(this.data).subscribe(
                    (successCode: any) => {
                      if (successCode.code == '200') {
                        this.isSpinning = false;

                        this.message.success(
                          'Customer Address Information Saved Successfully',
                          ''
                        );
                        this.createChannelData();
                        this.resetDrawer(accountMasterPage);

                        this.drawerCustomerAddLoginsAddressClose();
                      } else {
                        this.message.error(
                          'Cannot update Customer Address Information',
                          ''
                        );
                        this.isSpinning = false;
                      }
                    },
                    (err) => {
                      this.isSpinning = false;
                    }
                  );
                }
              }
            });
        }
      }
    }
  }

  createChannelData() {
    var data: any = {
      CHANNEL_NAME: this.pincodeChannel,
      USER_ID: this.selectedAddressData.ID,
      // USER_ID: this.custaddress[0]['ID'],
      STATUS: true,
      CLIENT_ID: 1,
      USER_NAME: this.selectedAddressData.CUSTOMER_NAME,
      // USER_NAME: this.custaddress[0]['CUSTOMER_NAME'],
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

  updateChannelData() {
    var data: any = {
      CHANNEL_NAME: this.pincodeChannel,
      OLD_CHANNEL_NAME: this.pincodeChannelOld,
      USER_ID: this.selectedAddressData.ID,
      // USER_ID: this.custaddress[0]['ID'],
      STATUS: true,
      CLIENT_ID: 1,
      USER_NAME: this.selectedAddressData.CUSTOMER_NAME,
      // USER_NAME: this.custaddress[0]['CUSTOMER_NAME'],
      TYPE: 'C',
      DATE: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
    };
    this.api.updateChannels(data).subscribe(
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
  selectedLocation: any;
  noaddress: boolean = false;
  nolandmark: boolean = false;
  address1: any;
  address2: any;
  mapOptions: any;
  maps: any;
  marker: any;
  mapss: any;
  markers: any;
  varm: any;
  citySearch: any = '';
  stateSearch: any = '';
  countrySearch: any = '';
  locality1Search: any = '';
  locality2Search: any = '';
  buildingSearch: any = '';
  landmarkSearch: any = '';
  building1Search: any = '';
  postcodeSearch: any = '';
  districtSearch: any = '';
  street_number: any = '';
  subpremise: any = '';
  floor: any = '';
  placeName: any = '';

  openmapModal() {
    // if (!this.data.ADDRESS_LINE_2) {
    //   this.noaddress = true;
    // }

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

    // Final Address String
    if (
      (Number(this.latitude) && Number(this.longitude)) ||
      (this.data.LANDMARK !== null &&
        this.data.LANDMARK !== undefined &&
        this.data.LANDMARK !== '') ||
      (this.data.ADDRESS_LINE_2 !== null &&
        this.data.ADDRESS_LINE_2 !== undefined &&
        this.data.ADDRESS_LINE_2 !== '') ||
      (this.data.ADDRESS_LINE_1 !== null &&
        this.data.ADDRESS_LINE_1 !== undefined &&
        this.data.ADDRESS_LINE_1 !== '') ||
      (this.data.COUNTRY_ID !== null &&
        this.data.COUNTRY_ID !== undefined &&
        this.data.COUNTRY_ID !== '') ||
      (this.data.CITY_NAME !== null &&
        this.data.CITY_NAME !== undefined &&
        this.data.CITY_NAME !== '')
    ) {
      this.selectedLocation = addressParts.join(', ');
    } else {
      this.selectedLocation = '';
    }
    this.mapDraweVisible = true;

    // Set search box value and trigger search after modal opens
    setTimeout(() => {
      const searchBox = document.getElementById(
        'searchBox'
      ) as HTMLInputElement;
      if (searchBox) {
        if (
          this.selectedLocation !== '' &&
          this.selectedLocation !== null &&
          this.selectedLocation !== undefined
        ) {
          searchBox.value = this.selectedLocation || '';
        } else {
          searchBox.value = '';
        }
        // this.handleSearch(this.selectedLocation);

        this.handleSearch({ target: { value: this.selectedLocation } });
      }
    }, 100);

    if (!this.data.COUNTRY_ID) {
      // Convert latitude and longitude to numbers
      this.latitude = Number(this.latitude);
      this.longitude = Number(this.longitude);

      // this.mapDraweVisible = true;
      setTimeout(() => {
        this.loadMap();
      }, 5);
    }
    if (this.data.ID) {
      // Convert latitude and longitude to numbers
      this.latitude = this.latitude;
      this.longitude = this.longitude;
      // this.selectedLocation = '';

      if (this.latitude && this.longitude) {
        this.selectedLocation = '';
      }
      // this.mapDraweVisible = true;
      setTimeout(() => {
        this.loadMap();
      }, 5);
    }
  }

  handleSearch(event: any) {
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

        this.getAddress(lat, lng, place); // Still use OSM for better address sometimes

        this.map2.setCenter(place.geometry.location);
        setTimeout(() => {
          this.map2.setZoom(19); // Try 19–21
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
            this.map2.setZoom(19); // Try 19–21
          }, 100);
          this.marker.setPosition(location);
        }
      });
    }

    this.map2.addListener('click', (event: any) => {
      lat = event.latLng.lat();
      lng = event.latLng.lng();
      this.marker.setPosition({ lat, lng });
      var formattedaddress1: any = '';
      formattedaddress1 = '';
      this.selectedLocation = formattedaddress1;

      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const placeId = results[0].place_id;

          // Get full place details using placeId
          const service = new google.maps.places.PlacesService(this.map2);
          service.getDetails(
            { placeId: placeId },
            (placeResult, placeStatus) => {
              if (placeStatus === 'OK' && placeResult) {
                this.placeName = placeResult.name || ''; // <- Now you get name too
                this.getAddress(lat, lng, placeResult); // Call your function with place
              } else {
                this.getAddress(lat, lng, null);
              }
            }
          );
        } else {
          // fallback if geocoding fails
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

        this.getAddress(lat, lng, place); // Still use OSM for better address sometimes

        this.map2.setCenter(place.geometry.location);
        setTimeout(() => {
          this.map2.setZoom(19); // Try 19–21
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
            this.map2.setZoom(19); // Try 19–21
          }, 100);
          this.marker.setPosition(location);
        }
      });
    }

    this.map2.addListener('click', (event: any) => {
      lat = event.latLng.lat();
      lng = event.latLng.lng();
      this.marker.setPosition({ lat, lng });
      var formattedaddress11: any = '';
      formattedaddress11 = '';
      this.selectedLocation = formattedaddress11;

      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const placeId = results[0].place_id;

          // Get full place details using placeId
          const service = new google.maps.places.PlacesService(this.map2);
          service.getDetails(
            { placeId: placeId },
            (placeResult, placeStatus) => {
              if (placeStatus === 'OK' && placeResult) {
                this.placeName = placeResult.name || ''; // <- Now you get name too
                this.getAddress(lat, lng, placeResult); // Call your function with place
              } else {
                this.getAddress(lat, lng, null);
              }
            }
          );
        } else {
          // fallback if geocoding fails
          console.warn('Geocoder failed:', status);
          this.getAddress(lat, lng, null);
        }
      });
    });
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
    // this.map2.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

    searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces();
      if (!places || places.length === 0) return;

      const place = places[0];
      const lat = place.geometry?.location?.lat() || 0;
      const lng = place.geometry?.location?.lng() || 0;
      this.placeName = place?.name;
      var formattedaddress: any = '';
      formattedaddress = place?.formatted_address || '';
      this.selectedLocation = formattedaddress;

      this.map2.setCenter({ lat, lng });
      setTimeout(() => {
        this.map2.setZoom(19); // Try 19–21
      }, 100);

      if (this.marker) {
        this.marker.setMap(null);
        //  this.marker.setMap(null);
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
        //  this.marker.setMap(null);
        this.marker = null;
      }
      this.marker = new google.maps.Marker({
        position: { lat, lng },
        map: this.map2,
      });
      var formattedaddress1: any = '';
      formattedaddress1 = '';
      this.selectedLocation = formattedaddress1;
      this.getAddress(lat, lng);
    });
  }
  StateDataValues(country: any, state: any, postcode: any, distt: any) {
    if (country) {
      var countryDatas: any = this.CountryData.find(
        (c: any) => c.NAME === country
      )?.ID;
      if (
        countryDatas !== null &&
        countryDatas !== undefined &&
        countryDatas !== ''
      ) {
        this.data.COUNTRY_ID = Number(countryDatas);
        this.getStatesByLocationFetch(
          this.data.COUNTRY_ID,
          true,
          state,
          postcode,
          distt
        );
      }
    }
  }

  getStatesByLocationFetch(
    countryId: any,
    value: boolean,
    state: any,
    postcode: any,
    distt: any
  ) {
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
              var stateDatas: any = this.StateData.find(
                (c: any) => c.NAME === state
              )?.ID;
              if (
                stateDatas !== null &&
                stateDatas !== undefined &&
                stateDatas !== ''
              ) {
                this.data.STATE_ID = Number(stateDatas);
                this.getDistrictByLocationFetch(
                  this.data.STATE_ID,
                  true,
                  postcode,
                  distt
                );
              }
            }
            this.isStateSpinning = false;
          } else {
            this.StateData = [];
            // this.message.error('Failed To Get State Data...', '');
            this.isStateSpinning = false;
          }
        },
        () => {
          // this.message.error('Something went wrong.', '');
        }
      );
  }

  getDistrictByLocationFetch(
    stateId: any,
    value: boolean,
    postcode: any,
    distt: any
  ) {
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
              var DistrictDatas: any = this.DistrictData.find(
                (c: any) => c.NAME === distt
              )?.ID;
              if (
                DistrictDatas !== null &&
                DistrictDatas !== undefined &&
                DistrictDatas !== ''
              ) {
                this.data.DISTRICT_ID = Number(DistrictDatas);
                this.getPincodeByLocation(
                  this.data.DISTRICT_ID,
                  true,
                  postcode
                );
              }
            }
          } else {
            this.DistrictData = [];
            // this.message.error('Failed To Get District Data...', '');
            this.isDistrictSpinning = false;
          }
        },
        () => {
          // this.message.error('Something Went Wrong ...', '');
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

    this.isPincodeSpinning = true; // Set loading to true when fetching data
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
              var PincodeDatas: any = this.PincodeData.find(
                (c: any) => c.PINCODE_NUMBER === postcode
              )?.ID;
              if (
                PincodeDatas !== null &&
                PincodeDatas !== undefined &&
                PincodeDatas !== ''
              ) {
                this.data.PINCODE_ID = Number(PincodeDatas);
                this.getpincodename1(this.data.PINCODE_ID);
              }
            }
          } else {
            this.PincodeData = [];
            // this.message.error('Failed To Get Pincode Data...', '');
          }
          this.isPincodeSpinning = false; // Ensure spinning state is turned off after data is fetched
        },
        () => {
          // this.message.error('Something went wrong.', '');
          this.isPincodeSpinning = false; // Ensure spinning state is turned off on error
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
              // this.message.error('Failed To Get Pincode Mapping Data...', '');
            }
            this.isSpinning = false;
          },
          () => {
            // this.message.error('Something Went Wrong ...', '');
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
    // this.placeName = '';
    this.floor = '';
    const geocodeRequest = placeId?.place_id
      ? { placeId: placeId.place_id }
      : { location: latlng };

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

            if (
              types.some((type: any) =>
                ['sublocality_level_2', 'neighborhood'].includes(type)
              )
            ) {
              this.locality1Search = component.long_name || '';
            }
            if (
              types.some((type: any) =>
                ['sublocality_level_1', 'neighborhood'].includes(type)
              )
            ) {
              this.locality2Search = component.long_name || '';
            }
            if (types.includes('premise')) {
              // this.buildingSearch = component?.long_name || '';
              this.buildingSearch +=
                (this.buildingSearch ? ', ' : '') +
                (component?.long_name || '');
            }
            if (types.includes('landmark')) {
              this.landmarkSearch = component?.long_name || '';
            }
            if (types.includes('route')) {
              this.building1Search = component?.long_name || '';
            }
            // if (types.includes('street_number')) {
            //   this.street_number = component?.long_name || '';
            // }
            if (
              types.some((type: any) =>
                ['plus_code', 'street_number'].includes(type)
              )
            ) {
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
          this.data.CITY_NAME = this.citySearch
            ? this.citySearch
            : this.districtSearch;
          this.data.LANDMARK = [
            this.landmarkSearch,
            this.building1Search,
            this.locality2Search,
          ]
            .filter((part) => !!part && part.trim() !== '')
            .join(', ');
          this.data.ADDRESS_LINE_2 = [
            this.placeName,
            this.buildingSearch,
            this.locality1Search,
          ]
            .filter((parts) => !!parts && parts.trim() !== '')
            .join(', ');
          if (
            this.data.ADDRESS_LINE_2 === '' ||
            this.data.ADDRESS_LINE_2 === null ||
            this.data.ADDRESS_LINE_2 === undefined
          ) {
            this.data.ADDRESS_LINE_2 = this.data?.LANDMARK;
          }
          this.data.ADDRESS_LINE_1 = [
            this.floor,
            this.street_number,
            this.subpremise,
          ]
            .filter((partad) => !!partad && partad.trim() !== '')
            .join(', ');

          // this.data.ADDRESS_LINE_1 = this.street_number;
          // if (this.countrySearch !== '' && this.countrySearch !== undefined && this.countrySearch !== null) {
          //   this.StateDataValues(this.countrySearch, this.stateSearch, this.postcodeSearch, this.districtSearch)
          // }
        }

        // Preserve coordinates
        this.latitude = lat;
        this.longitude = lng;

        // Respect your conditions
        if (!this.noaddress) {
          this.data.ADDRESS_LINE_2 = this.data.ADDRESS_LINE_2;
        } else {
          this.address1 = this.data.ADDRESS_LINE_2;
        }

        if (!this.nolandmark) {
          this.data.LANDMARK = this.data.LANDMARK;
        } else {
          this.address2 = this.data.LANDMARK;
        }

        if (typeof this.selectedLocation !== 'object') {
          this.selectedLocation = '';
        }
        this.selectedLocation = this.address2;
      } else {
        // this.selectedLocation = this.selectedLocation || {};
        this.selectedLocation = '';
        console.error('Geocoder failed due to: ' + status);
      }
    });
  }

  closemapModal() {
    this.mapDraweVisible = false;
    if (
      this.countrySearch !== '' &&
      this.countrySearch !== undefined &&
      this.countrySearch !== null
    ) {
      this.StateDataValues(
        this.countrySearch,
        this.stateSearch,
        this.postcodeSearch,
        this.districtSearch
      );
    }
  }

  clearSearchBox() {
    this.selectedLocation = '';
    this.closemapModal();
  }
}
