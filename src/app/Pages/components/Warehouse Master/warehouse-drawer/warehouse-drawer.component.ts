import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { WarehouseMasterData } from 'src/app/Pages/Models/WarehouseMasterData';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
declare const google: any;

@Component({
  selector: 'app-warehouse-drawer',
  templateUrl: './warehouse-drawer.component.html',
  styleUrls: ['./warehouse-drawer.component.css'],
})
export class WarehouseDrawerComponent {
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService
  ) { }
  @Input() data: WarehouseMasterData = new WarehouseMasterData();
  @Input() drawerClose!: () => void;
  @Input() drawerVisible: boolean = false;
  public commonFunction = new CommonFunctionService();
  isSpinning = false;
  WarehouseManagerData: any = [];
  isStateSpinning = false;
  isCitySpinning = false;
  isPincodeSpinning = false;
  PincodeData: any = [];
  StateData: any = [];
  DistData: any = [];
  CountryData: any = [];
  isDistSpinning = false;

  Filterss: any = {};
  logfilt: any;
  filterdata1: any;
  isFocused;
  emailpattern =
    /^(?!.*\.\.)[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]*[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+$/;
  countryCodes = [
    { label: '+91 (India)', value: '+91' },
    { label: '+92 (Pakistan)', value: '+92' },
    { label: '+93 (Afghanistan)', value: '+93' },
    { label: '+94 (Sri Lanka)', value: '+94' },
    { label: '+95 (Myanmar)', value: '+95' },
    { label: '+1 (United States)', value: '+1' },
    { label: '+1-242 (Bahamas)', value: '+1-242' },
    { label: '+1-246 (Barbados)', value: '+1-246' },
    { label: '+1-264 (Anguilla)', value: '+1-264' },
    { label: '+1-268 (Antigua and Barbuda)', value: '+1-268' },
    { label: '+1-284 (British Virgin Islands)', value: '+1-284' },
    { label: '+1-340 (U.S. Virgin Islands)', value: '+1-340' },
    { label: '+1-345 (Cayman Islands)', value: '+1-345' },
    { label: '+1-441 (Bermuda)', value: '+1-441' },
    { label: '+1-473 (Grenada)', value: '+1-473' },
    { label: '+1-649 (Turks and Caicos Islands)', value: '+1-649' },
    { label: '+1-664 (Montserrat)', value: '+1-664' },
    { label: '+1-670 (Northern Mariana Islands)', value: '+1-670' },
    { label: '+1-671 (Guam)', value: '+1-671' },
    { label: '+1-684 (American Samoa)', value: '+1-684' },
    { label: '+1-721 (Sint Maarten)', value: '+1-721' },
    { label: '+1-758 (Saint Lucia)', value: '+1-758' },
    { label: '+1-767 (Dominica)', value: '+1-767' },
    { label: '+1-784 (Saint Vincent and the Grenadines)', value: '+1-784' },
    { label: '+1-787 (Puerto Rico)', value: '+1-787' },
    { label: '+1-809 (Dominican Republic)', value: '+1-809' },
    { label: '+1-829 (Dominican Republic)', value: '+1-829' },
    { label: '+1-849 (Dominican Republic)', value: '+1-849' },
    { label: '+1-868 (Trinidad and Tobago)', value: '+1-868' },
    { label: '+1-869 (Saint Kitts and Nevis)', value: '+1-869' },
    { label: '+1-876 (Jamaica)', value: '+1-876' },
    { label: '+1-939 (Puerto Rico)', value: '+1-939' },
    { label: '+20 (Egypt)', value: '+20' },
    { label: '+211 (South Sudan)', value: '+211' },
    { label: '+212 (Morocco)', value: '+212' },
    { label: '+213 (Algeria)', value: '+213' },
    { label: '+216 (Tunisia)', value: '+216' },
    { label: '+218 (Libya)', value: '+218' },
    { label: '+220 (Gambia)', value: '+220' },
    { label: '+221 (Senegal)', value: '+221' },
    { label: '+222 (Mauritania)', value: '+222' },
    { label: '+223 (Mali)', value: '+223' },
    { label: '+224 (Guinea)', value: '+224' },
    { label: '+225 (Ivory Coast)', value: '+225' },
    { label: '+226 (Burkina Faso)', value: '+226' },
    { label: '+227 (Niger)', value: '+227' },
    { label: '+228 (Togo)', value: '+228' },
    { label: '+229 (Benin)', value: '+229' },
    { label: '+230 (Mauritius)', value: '+230' },
    { label: '+231 (Liberia)', value: '+231' },
    { label: '+232 (Sierra Leone)', value: '+232' },
    { label: '+233 (Ghana)', value: '+233' },
    { label: '+234 (Nigeria)', value: '+234' },
    { label: '+235 (Chad)', value: '+235' },
    { label: '+236 (Central African Republic)', value: '+236' },
    { label: '+237 (Cameroon)', value: '+237' },
    { label: '+238 (Cape Verde)', value: '+238' },
    { label: '+239 (Sao Tome and Principe)', value: '+239' },
    { label: '+240 (Equatorial Guinea)', value: '+240' },
    { label: '+241 (Gabon)', value: '+241' },
    { label: '+242 (Republic of the Congo)', value: '+242' },
    { label: '+243 (Democratic Republic of the Congo)', value: '+243' },
    { label: '+244 (Angola)', value: '+244' },
    { label: '+245 (Guinea-Bissau)', value: '+245' },
    { label: '+246 (British Indian Ocean Territory)', value: '+246' },
    { label: '+248 (Seychelles)', value: '+248' },
    { label: '+249 (Sudan)', value: '+249' },
    { label: '+250 (Rwanda)', value: '+250' },
    { label: '+251 (Ethiopia)', value: '+251' },
    { label: '+252 (Somalia)', value: '+252' },
    { label: '+253 (Djibouti)', value: '+253' },
    { label: '+254 (Kenya)', value: '+254' },
    { label: '+255 (Tanzania)', value: '+255' },
    { label: '+256 (Uganda)', value: '+256' },
    { label: '+257 (Burundi)', value: '+257' },
    { label: '+258 (Mozambique)', value: '+258' },
    { label: '+260 (Zambia)', value: '+260' },
    { label: '+261 (Madagascar)', value: '+261' },
    { label: '+262 (Reunion)', value: '+262' },
    { label: '+263 (Zimbabwe)', value: '+263' },
    { label: '+264 (Namibia)', value: '+264' },
    { label: '+265 (Malawi)', value: '+265' },
    { label: '+266 (Lesotho)', value: '+266' },
    { label: '+267 (Botswana)', value: '+267' },
    { label: '+268 (Eswatini)', value: '+268' },
    { label: '+269 (Comoros)', value: '+269' },
    { label: '+27 (South Africa)', value: '+27' },
    { label: '+290 (Saint Helena)', value: '+290' },
    { label: '+291 (Eritrea)', value: '+291' },
    { label: '+297 (Aruba)', value: '+297' },
    { label: '+298 (Faroe Islands)', value: '+298' },
    { label: '+299 (Greenland)', value: '+299' },
    { label: '+30 (Greece)', value: '+30' },
    { label: '+31 (Netherlands)', value: '+31' },
    { label: '+32 (Belgium)', value: '+32' },
    { label: '+33 (France)', value: '+33' },
    { label: '+34 (Spain)', value: '+34' },
    { label: '+350 (Gibraltar)', value: '+350' },
    { label: '+351 (Portugal)', value: '+351' },
    { label: '+352 (Luxembourg)', value: '+352' },
    { label: '+353 (Ireland)', value: '+353' },
    { label: '+354 (Iceland)', value: '+354' },
    { label: '+355 (Albania)', value: '+355' },
    { label: '+356 (Malta)', value: '+356' },
    { label: '+357 (Cyprus)', value: '+357' },
    { label: '+358 (Finland)', value: '+358' },
    { label: '+359 (Bulgaria)', value: '+359' },
    { label: '+36 (Hungary)', value: '+36' },
    { label: '+370 (Lithuania)', value: '+370' },
    { label: '+371 (Latvia)', value: '+371' },
    { label: '+372 (Estonia)', value: '+372' },
    { label: '+373 (Moldova)', value: '+373' },
    { label: '+374 (Armenia)', value: '+374' },
    { label: '+375 (Belarus)', value: '+375' },
    { label: '+376 (Andorra)', value: '+376' },
    { label: '+377 (Monaco)', value: '+377' },
    { label: '+378 (San Marino)', value: '+378' },
    { label: '+379 (Vatican City)', value: '+379' },
    { label: '+380 (Ukraine)', value: '+380' },
    { label: '+381 (Serbia)', value: '+381' },
    { label: '+382 (Montenegro)', value: '+382' },
    { label: '+383 (Kosovo)', value: '+383' },
    { label: '+385 (Croatia)', value: '+385' },
    { label: '+386 (Slovenia)', value: '+386' },
    { label: '+387 (Bosnia and Herzegovina)', value: '+387' },
    { label: '+389 (North Macedonia)', value: '+389' },
    { label: '+39 (Italy)', value: '+39' },
    { label: '+40 (Romania)', value: '+40' },
    { label: '+41 (Switzerland)', value: '+41' },
    { label: '+420 (Czech Republic)', value: '+420' },
    { label: '+421 (Slovakia)', value: '+421' },
    { label: '+423 (Liechtenstein)', value: '+423' },
    { label: '+43 (Austria)', value: '+43' },
    { label: '+44 (United Kingdom)', value: '+44' },
    { label: '+44-1481 (Guernsey)', value: '+44-1481' },
    { label: '+44-1534 (Jersey)', value: '+44-1534' },
    { label: '+44-1624 (Isle of Man)', value: '+44-1624' },
    { label: '+45 (Denmark)', value: '+45' },
    { label: '+46 (Sweden)', value: '+46' },
    { label: '+47 (Norway)', value: '+47' },
    { label: '+48 (Poland)', value: '+48' },
    { label: '+49 (Germany)', value: '+49' },
    { label: '+500 (Falkland Islands)', value: '+500' },
    { label: '+501 (Belize)', value: '+501' },
    { label: '+502 (Guatemala)', value: '+502' },
    { label: '+503 (El Salvador)', value: '+503' },
    { label: '+504 (Honduras)', value: '+504' },
    { label: '+505 (Nicaragua)', value: '+505' },
    { label: '+506 (Costa Rica)', value: '+506' },
    { label: '+507 (Panama)', value: '+507' },
    { label: '+508 (Saint Pierre and Miquelon)', value: '+508' },
    { label: '+509 (Haiti)', value: '+509' },
    { label: '+51 (Peru)', value: '+51' },
    { label: '+52 (Mexico)', value: '+52' },
    { label: '+53 (Cuba)', value: '+53' },
    { label: '+54 (Argentina)', value: '+54' },
    { label: '+55 (Brazil)', value: '+55' },
    { label: '+56 (Chile)', value: '+56' },
    { label: '+57 (Colombia)', value: '+57' },
    { label: '+58 (Venezuela)', value: '+58' },
    { label: '+590 (Guadeloupe)', value: '+590' },
    { label: '+591 (Bolivia)', value: '+591' },
    { label: '+592 (Guyana)', value: '+592' },
    { label: '+593 (Ecuador)', value: '+593' },
    { label: '+594 (French Guiana)', value: '+594' },
    { label: '+595 (Paraguay)', value: '+595' },
    { label: '+596 (Martinique)', value: '+596' },
    { label: '+597 (Suriname)', value: '+597' },
    { label: '+598 (Uruguay)', value: '+598' },
    { label: '+599 (Netherlands Antilles)', value: '+599' },
    { label: '+60 (Malaysia)', value: '+60' },
    { label: '+61 (Australia)', value: '+61' },
    { label: '+62 (Indonesia)', value: '+62' },
    { label: '+63 (Philippines)', value: '+63' },
    { label: '+64 (New Zealand)', value: '+64' },
    { label: '+65 (Singapore)', value: '+65' },
    { label: 'Thailand (+66)', value: '+66' },
    { label: 'Timor-Leste (+670)', value: '+670' },
    { label: 'Australian External Territories (+672)', value: '+672' },
    { label: 'Brunei (+673)', value: '+673' },
    { label: 'Nauru (+674)', value: '+674' },
    { label: 'Papua New Guinea (+675)', value: '+675' },
    { label: 'Tonga (+676)', value: '+676' },
    { label: 'Solomon Islands (+677)', value: '+677' },
    { label: 'Vanuatu (+678)', value: '+678' },
    { label: 'Fiji (+679)', value: '+679' },
    { label: 'Palau (+680)', value: '+680' },
    { label: 'Wallis and Futuna (+681)', value: '+681' },
    { label: 'Cook Islands (+682)', value: '+682' },
    { label: 'Niue (+683)', value: '+683' },
    { label: 'Samoa (+685)', value: '+685' },
    { label: 'Kiribati (+686)', value: '+686' },
    { label: 'New Caledonia (+687)', value: '+687' },
    { label: 'Tuvalu (+688)', value: '+688' },
    { label: 'French Polynesia (+689)', value: '+689' },
    { label: 'Tokelau (+690)', value: '+690' },
    { label: 'Micronesia (+691)', value: '+691' },
    { label: 'Marshall Islands (+692)', value: '+692' },
    { label: 'Russia (+7)', value: '+7' },
    { label: 'Kazakhstan (+7)', value: '+7' },
    { label: 'Japan (+81)', value: '+81' },
    { label: 'South Korea (+82)', value: '+82' },
    { label: 'Vietnam (+84)', value: '+84' },
    { label: 'North Korea (+850)', value: '+850' },
    { label: 'Hong Kong (+852)', value: '+852' },
    { label: 'Macau (+853)', value: '+853' },
    { label: 'Cambodia (+855)', value: '+855' },
    { label: 'Laos (+856)', value: '+856' },
    { label: 'China (+86)', value: '+86' },
    { label: 'Bangladesh (+880)', value: '+880' },
    { label: 'Taiwan (+886)', value: '+886' },
    { label: 'Turkey (+90)', value: '+90' },
    { label: 'Maldives (+960)', value: '+960' },
    { label: 'Lebanon (+961)', value: '+961' },
    { label: 'Jordan (+962)', value: '+962' },
    { label: 'Syria (+963)', value: '+963' },
    { label: 'Iraq (+964)', value: '+964' },
    { label: 'Kuwait (+965)', value: '+965' },
    { label: 'Saudi Arabia (+966)', value: '+966' },
    { label: 'Yemen (+967)', value: '+967' },
    { label: 'Oman (+968)', value: '+968' },
    { label: 'Palestine (+970)', value: '+970' },
    { label: 'United Arab Emirates (+971)', value: '+971' },
    { label: 'Israel (+972)', value: '+972' },
    { label: 'Bahrain (+973)', value: '+973' },
    { label: 'Qatar (+974)', value: '+974' },
    { label: 'Bhutan (+975)', value: '+975' },
    { label: 'Mongolia (+976)', value: '+976' },
    { label: 'Nepal (+977)', value: '+977' },
    { label: 'Iran (+98)', value: '+98' },
    { label: 'Tajikistan (+992)', value: '+992' },
    { label: 'Turkmenistan (+993)', value: '+993' },
    { label: 'Azerbaijan (+994)', value: '+994' },
    { label: 'Georgia (+995)', value: '+995' },
    { label: 'Kyrgyzstan (+996)', value: '+996' },
    { label: 'Uzbekistan (+998)', value: '+998' },
  ];
  isOk = true;
  ngOnInit() {
    this.getallCountry();
    this.getwarehouseManager();
  }

  getwarehouseManager() {
    this.api
      .getBackOfficeData(0, 0, 'ID', 'desc', ' AND IS_ACTIVE=1 AND ROLE_ID= 23')
      .subscribe(
        (dataaa1) => {
          if (dataaa1['code'] == 200) {
            this.WarehouseManagerData = dataaa1['data'];
          } else {
            this.WarehouseManagerData = [];
          }
        },
        () => {
          this.WarehouseManagerData = [];
          this.message.error('Something Went Wrong', '');
        }
      );
  }
  save(addNew: boolean, VendorDrawer: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;
    if (
      (this.data.NAME == null ||
        this.data.NAME == undefined ||
        this.data.NAME.trim() == '') &&
      (this.data.EMAIL_ID == null ||
        this.data.EMAIL_ID == undefined ||
        this.data.EMAIL_ID.trim() == '') &&
      (this.data.COUNTRY_CODE == undefined ||
        this.data.COUNTRY_CODE == null ||
        this.data.COUNTRY_CODE == 0) &&
      (this.data.MOBILE_NO == undefined ||
        this.data.MOBILE_NO == null ||
        this.data.MOBILE_NO == 0) &&
      (this.data.ADDRESS_LINE1 == null ||
        this.data.ADDRESS_LINE1 == undefined ||
        this.data.ADDRESS_LINE1.trim() == '') &&
      (this.data.COUNTRY_ID == undefined ||
        this.data.COUNTRY_ID == null ||
        this.data.COUNTRY_ID == 0) &&
      (this.data.STATE_ID == 0 ||
        this.data.STATE_ID == null ||
        this.data.STATE_ID == undefined) &&
      (this.data.DISTRICT_ID == undefined ||
        this.data.DISTRICT_ID == null ||
        this.data.DISTRICT_ID == 0) &&
      (this.data.PIN_CODE_ID == undefined ||
        this.data.PIN_CODE_ID == null ||
        this.data.PIN_CODE_ID == 0)
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (
      this.data.NAME == null ||
      this.data.NAME == undefined ||
      this.data.NAME.trim() == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Warehouse Name', '');
    } else if (
      this.data.WAREHOUSE_MANAGER_ID === null ||
      this.data.WAREHOUSE_MANAGER_ID === undefined ||
      this.data.WAREHOUSE_MANAGER_ID === ''
    ) {
      this.isOk = false;
      this.message.error(' Please Select Warehosue Manager', '');
    } else if (
      this.data.EMAIL_ID == null ||
      this.data.EMAIL_ID == undefined ||
      this.data.EMAIL_ID.trim() == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Email ID', '');
    } else if (
      this.data.EMAIL_ID != null &&
      this.data.EMAIL_ID != undefined &&
      !this.commonFunction.emailpattern.test(this.data.EMAIL_ID)
    ) {
      this.isOk = false;
      this.message.error('Please Enter Valid Email ', '');
    } else if (
      this.data.COUNTRY_CODE == null ||
      this.data.COUNTRY_CODE == undefined ||
      this.data.COUNTRY_CODE == 0
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Country Code', '');
    } else if (
      this.data.MOBILE_NO == null ||
      this.data.MOBILE_NO == undefined ||
      this.data.MOBILE_NO == 0
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Mobile No.', '');
    } else if (
      this.data.MOBILE_NO != null &&
      this.data.MOBILE_NO != undefined &&
      this.data.MOBILE_NO != 0 &&
      !this.commonFunction.mobpattern.test(this.data.MOBILE_NO)
    ) {
      this.isOk = false;
      this.message.error('Please Enter Valid Mobile No. ', '');
    } else if (
      this.data.LATITUDE == null ||
      this.data.LATITUDE == undefined ||
      this.data.LATITUDE == 0
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
      this.data.ADDRESS_LINE1 == null ||
      this.data.ADDRESS_LINE1 == undefined ||
      this.data.ADDRESS_LINE1.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter Address Line 1', '');
    } else if (
      this.data.ADDRESS_LINE2 == null ||
      this.data.ADDRESS_LINE2 == undefined ||
      this.data.ADDRESS_LINE2.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter Address Line 2', '');
    } else if (
      this.data.COUNTRY_ID == null ||
      this.data.COUNTRY_ID == undefined ||
      this.data.COUNTRY_ID == 0
    ) {
      this.isOk = false;
      this.message.error('Please Select Country Name', '');
    } else if (
      this.data.STATE_ID == null ||
      this.data.STATE_ID == undefined ||
      this.data.STATE_ID == 0
    ) {
      this.isOk = false;
      this.message.error('Please Select State Name', '');
    } else if (
      this.data.DISTRICT_ID == null ||
      this.data.DISTRICT_ID == undefined ||
      this.data.DISTRICT_ID == 0
    ) {
      this.isOk = false;
      this.message.error('Please Select District Name', '');
    }
    else if (
      this.data.CITY_NAME === null ||
      this.data.CITY_NAME === undefined ||
      this.data.CITY_NAME.trim() === ''
    ) {
      this.isOk = false;
      this.message.error('Please enter city', '');
    } else if (
      this.data.PIN_CODE_ID === null ||
      this.data.PIN_CODE_ID === undefined ||
      this.data.PIN_CODE_ID === 0
    ) {
      this.isOk = false;
      this.message.error(' Please Select Pincode', '');
    }

    if (this.isOk) {
      this.isSpinning = true;
      {
        if (this.data.ID) {
          this.api
            .updateWarehouseData(this.data)
            .subscribe((successCode: any) => {
              if (successCode.code == '200') {
                this.message.success('Warehouse Data Updated Successfully', '');
                if (!addNew) this.drawerClose();
                this.isSpinning = false;
              } else {
                this.message.error('Warehouse Data Updation Failed', '');
                this.isSpinning = false;
              }
            }, err => {
              this.message.error('Something went wrong, please try again later', '');
              this.isSpinning = false;
            });
        } else {
          this.api
            .CreateWarehouseData(this.data)
            .subscribe((successCode: any) => {
              if (successCode.code == '200') {
                this.message.success('Warehouse Data Created Successfully', '');
                if (!addNew) this.drawerClose();
                else {
                  // this.data = new VendorMasterData();
                  this.resetDrawer(VendorDrawer);
                  this.api.getWarehouseData(0, 0, '', 'desc', '').subscribe(
                    (data) => { },
                    () => { }
                  );
                }
                this.isSpinning = false;
              } else {
                this.message.error('Warehouse Data Creation Failed...', '');
                this.isSpinning = false;
              }
            }, err => {
              this.message.error('Something went wrong, please try again later', '');
              this.isSpinning = false;
            });
        }
      }
    }
  }
  close() {
    this.drawerClose();
  }
  resetDrawer(VendorDrawer: NgForm) {
    this.data = new WarehouseMasterData();
    VendorDrawer.form.markAsPristine();
    VendorDrawer.form.markAsUntouched();
  }

  getallCountry() {
    this.api.getAllCountryMaster(0, 0, 'ID', 'asc', ' AND IS_ACTIVE =1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.CountryData = data['data'];
          if (this.data.ID) {
            this.getStatesByCountry1(this.data.COUNTRY_ID, true);
          }
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
  getStatesByCountry(countryId: any, value: boolean = true) {
    if (value === false) {
      this.data.STATE_ID = null;
      this.data.DISTRICT_ID = null;
      this.data.PIN_CODE_ID = 0;
      this.data.PINCODE = null;
      this.data.STATE_NAME = null;
      this.data.DISTRICT_NAME = null;
      this.PincodeData = [];
      this.StateData = [];
      this.DistData = [];
    }
    if (countryId != null && countryId != undefined && countryId != '') {
      var pin = this.CountryData.filter((i) => i.ID == countryId);
      if (pin != null && pin != undefined && pin != '') {
        this.data.COUNTRY_NAME = pin[0]['NAME'];
      } else {
        this.data.COUNTRY_NAME = null;
      }

      this.isStateSpinning = true; // Set loading to true when fetching data
      this.api
        .getState(
          0,
          0,
          'NAME',
          'asc',
          ` AND COUNTRY_ID=${countryId} AND IS_ACTIVE = 1`
        ) // Added ' AND IS_ACTIVE = 1'
        .subscribe(
          (data) => {
            if (data['code'] === 200) {
              this.StateData = data['data'];
            } else {
              this.StateData = [];
              this.message.error('Failed To Get State Data...', '');
            }
            this.isStateSpinning = false; // Ensure spinning state is turned off after data is fetched
          },
          () => {
            this.message.error('Something went wrong.', '');
            this.isStateSpinning = false; // Ensure spinning state is turned off on error
          }
        );
    } else {
      this.data.COUNTRY_NAME = null;
      this.data.STATE_ID = null;
      this.data.DISTRICT_ID = null;
      this.data.PIN_CODE_ID = 0;
      this.data.PINCODE = null;
      this.data.STATE_NAME = null;
      this.data.DISTRICT_NAME = null;
      this.PincodeData = [];
      this.StateData = [];
      this.DistData = [];
      this.isStateSpinning = false;
    }
  }

  getStatesByCountry1(countryId: any, value: boolean = true) {
    if (value === false) {
      this.data.STATE_ID = null;
      this.data.DISTRICT_ID = null;
      this.data.PIN_CODE_ID = 0;
      this.data.PINCODE = null;
      this.data.STATE_NAME = null;
      this.data.DISTRICT_NAME = null;
      this.PincodeData = [];
      this.StateData = [];
      this.DistData = [];
    }
    if (countryId != null && countryId != undefined && countryId != '') {
      var pin = this.CountryData.filter((i) => i.ID == countryId);
      if (pin != null && pin != undefined && pin != '') {
        this.data.COUNTRY_NAME = pin[0]['NAME'];
      } else {
        this.data.COUNTRY_NAME = null;
      }

      this.isStateSpinning = true; // Set loading to true when fetching data
      this.api
        .getState(
          0,
          0,
          'NAME',
          'asc',
          ` AND COUNTRY_ID=${countryId} AND IS_ACTIVE = 1`
        ) // Added ' AND IS_ACTIVE = 1'
        .subscribe(
          (data) => {
            if (data['code'] === 200) {
              this.StateData = data['data'];
              this.getDistByState1(this.data.STATE_ID, true);
            } else {
              this.StateData = [];
              this.message.error('Failed To Get State Data...', '');
            }
            this.isStateSpinning = false; // Ensure spinning state is turned off after data is fetched
          },
          () => {
            this.message.error('Something went wrong.', '');
            this.isStateSpinning = false; // Ensure spinning state is turned off on error
          }
        );
    } else {
      this.data.COUNTRY_NAME = null;
      this.data.STATE_ID = null;
      this.data.DISTRICT_ID = null;
      this.data.PIN_CODE_ID = 0;
      this.data.PINCODE = null;
      this.data.STATE_NAME = null;
      this.data.DISTRICT_NAME = null;
      this.PincodeData = [];
      this.StateData = [];
      this.DistData = [];
      this.isStateSpinning = false;
    }
  }

  getDistByState(stateId: any, value: boolean = true) {
    if (value === false) {
      this.data.DISTRICT_ID = 0;
      this.data.PIN_CODE_ID = 0;
      this.data.PINCODE = null;
      this.data.DISTRICT_NAME = null;
      this.PincodeData = [];
      this.DistData = [];
    }
    if (stateId != null && stateId != undefined && stateId != '') {
      var pin = this.StateData.filter((i) => i.ID == stateId);
      if (pin != null && pin != undefined && pin != '') {
        this.data.STATE_NAME = pin[0]['NAME'];
      } else {
        this.data.STATE_NAME = null;
      }

      this.isDistSpinning = true; // Set loading to true when fetching data
      this.api
        .getDistrictData(
          0,
          0,
          'NAME',
          'asc',
          ` AND IS_ACTIVE=1 AND STATE_ID=${stateId}`
        ) // Added ' AND IS_ACTIVE = 1'
        .subscribe(
          (data) => {
            if (data['code'] === 200) {
              this.DistData = data['data'];
            } else {
              this.DistData = [];
              this.message.error('Failed To Get District Data...', '');
            }
            this.isDistSpinning = false; // Ensure spinning state is turned off after data is fetched
          },
          () => {
            this.message.error('Something went wrong.', '');
            this.isDistSpinning = false; // Ensure spinning state is turned off on error
          }
        );
    } else {
      this.data.STATE_ID = null;
      this.data.DISTRICT_ID = null;
      this.data.PIN_CODE_ID = 0;
      this.data.PINCODE = null;
      this.data.DISTRICT_NAME = null;
      this.PincodeData = [];
      this.DistData = [];
      this.isStateSpinning = false;
    }
  }

  getDistByState1(stateId: any, value: boolean = true) {
    if (value === false) {
      this.data.DISTRICT_ID = 0;
      this.data.PIN_CODE_ID = 0;
      this.data.PINCODE = null;
      this.data.DISTRICT_NAME = null;
      this.PincodeData = [];
      this.DistData = [];
    }
    if (stateId != null && stateId != undefined && stateId != '') {
      var pin = this.StateData.filter((i) => i.ID == stateId);
      if (pin != null && pin != undefined && pin != '') {
        this.data.STATE_NAME = pin[0]['NAME'];
      } else {
        this.data.STATE_NAME = null;
      }

      this.isDistSpinning = true; // Set loading to true when fetching data
      this.api
        .getDistrictData(
          0,
          0,
          'NAME',
          'asc',
          ` AND IS_ACTIVE=1 AND STATE_ID=${stateId}`
        ) // Added ' AND IS_ACTIVE = 1'
        .subscribe(
          (data) => {
            if (data['code'] === 200) {
              this.DistData = data['data'];
              this.getPincodesByCity(this.data.DISTRICT_ID, true);
            } else {
              this.DistData = [];
              this.message.error('Failed To Get District Data...', '');
            }
            this.isDistSpinning = false; // Ensure spinning state is turned off after data is fetched
          },
          () => {
            this.message.error('Something went wrong.', '');
            this.isDistSpinning = false; // Ensure spinning state is turned off on error
          }
        );
    } else {
      this.data.STATE_ID = null;
      this.data.DISTRICT_ID = null;
      this.data.PIN_CODE_ID = 0;
      this.data.PINCODE = null;
      this.data.DISTRICT_NAME = null;
      this.PincodeData = [];
      this.DistData = [];
      this.isStateSpinning = false;
    }
  }
  getpincodename(pincode: any) {
    if (pincode != null && pincode != undefined && pincode != '') {
      var pin = this.PincodeData.filter((i) => i.ID == pincode);
      if (pin != null && pin != undefined && pin != '') {
        this.data.PINCODE = pin[0]['PINCODE_NUMBER'];
      } else {
        this.data.PINCODE = null;
      }
    } else {
      this.data.PINCODE = null;
    }
  }

  getCountryname(pincode: any) {
    if (pincode != null && pincode != undefined && pincode != '') {
      var pin = this.PincodeData.filter((i) => i.ID == pincode);
      if (pin != null && pin != undefined && pin != '') {
        this.data.PINCODE = pin[0]['PINCODE_NUMBER'];
      } else {
        this.data.PINCODE = null;
      }
    } else {
      this.data.PINCODE = null;
    }
  }

  OnMangerSelect(manager: any) {
    if (manager != null && manager != undefined && manager != '') {
      var pin: any = this.WarehouseManagerData.filter((i) => i.ID == manager);
      if (pin != null && pin != undefined && pin != '') {
        this.data.WAREHOUSE_MANAGER_NAME = pin[0]['NAME'];

        if (
          this.data.MOBILE_NO == null ||
          this.data.MOBILE_NO == undefined ||
          this.data.MOBILE_NO == ''
        ) {
          this.data.MOBILE_NO = pin[0]['MOBILE_NUMBER'];
          this.data.COUNTRY_CODE = pin[0]['COUNTRY_CODE'];
        }
        if (
          this.data.EMAIL_ID == null ||
          this.data.EMAIL_ID == undefined ||
          this.data.EMAIL_ID == ''
        ) {
          this.data.EMAIL_ID = pin[0]['EMAIL_ID'];
        }
      } else {
        this.data.WAREHOUSE_MANAGER_NAME = null;
      }
    } else {
      this.data.WAREHOUSE_MANAGER_NAME = null;
    }
  }

  getPincodesByCity(stateId: any, value: boolean = true) {
    if (value === false) {
      this.data.PIN_CODE_ID = 0;
      this.data.PINCODE = null;
    }
    if (stateId != null && stateId != undefined && stateId != '') {
      var pin = this.DistData.filter((i) => i.ID == stateId);
      if (pin != null && pin != undefined && pin != '') {
        this.data.DISTRICT_NAME = pin[0]['NAME'];
      } else {
        this.data.DISTRICT_NAME = null;
      }

      this.isPincodeSpinning = true; // Set loading to true when fetching data
      this.api
        .getAllPincode(
          0,
          0,
          'ID',
          'asc',
          ` AND IS_ACTIVE=1 AND DISTRICT=${stateId}`
        ) // Added ' AND IS_ACTIVE = 1'
        .subscribe(
          (data) => {
            if (data['code'] === 200) {
              this.PincodeData = data['data'];
              this.data.PIN_CODE_ID = Number(this.data.PIN_CODE_ID);
              this.isPincodeSpinning = false;
            } else {
              this.PincodeData = [];
              this.message.error('Failed To Get Pincode Data...', '');
            }
            // Ensure spinning state is turned off after data is fetched
          },
          () => {
            this.message.error('Something went wrong.', '');
            this.isPincodeSpinning = false; // Ensure spinning state is turned off on error
          }
        );
    } else {
      this.data.DISTRICT_ID = null;
      this.data.PIN_CODE_ID = 0;
      this.data.PINCODE = null;
      this.data.DISTRICT_NAME = null;
      this.PincodeData = [];
      this.DistData = [];
      this.isStateSpinning = false;
    }
  }

  // map
  mapDraweVisible = false;
  mapDrawerTitle = 'Select Location';
  selectedLocation: any;

  noaddress: boolean = false;
  address1: any;
  nolandmark: boolean = false;
  address2: any;
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

  mapOptions: any;
  maps: any;
  marker: any;
  mapss: any;
  markers: any;
  map2: any;

  openmapModal() {
    if (
      !this.data.ADDRESS_LINE1 ||
      this.data.ADDRESS_LINE1 == '' ||
      this.data.ADDRESS_LINE1 == null ||
      this.data.ADDRESS_LINE1 == undefined
    ) {
      this.noaddress = true;
    } else if (this.address1) {
      this.noaddress = false;
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
      let district = this.DistData.find(
        (d) => d.ID === this.data.DISTRICT_ID
      )?.NAME;
      if (district) addressParts.push(district);
    }
    if (this.data.PINCODE) {
      addressParts.push(this.data.PINCODE);
    }
    if (this.data.ADDRESS_LINE1) {
      addressParts.push(this.data.ADDRESS_LINE1);
    }
    if (this.data.ADDRESS_LINE2) {
      addressParts.push(this.data.ADDRESS_LINE2);
    }

    if (Number(this.data.LATITUDE) && Number(this.data.LATITUDE)) {
      this.selectedLocation = addressParts.join(', ');
    } else {
      this.selectedLocation = '';
    }
    if ((Number(this.data.LATITUDE) && Number(this.data.LONGITUDE)) ||
      (this.data.PINCODE !== null && this.data.PINCODE !== undefined && this.data.PINCODE !== '') ||
      (this.data.ADDRESS_LINE1 !== null && this.data.ADDRESS_LINE1 !== undefined && this.data.ADDRESS_LINE1 !== '') ||
      (this.data.ADDRESS_LINE2 !== null && this.data.ADDRESS_LINE2 !== undefined && this.data.ADDRESS_LINE2 !== '') ||
      (this.data.COUNTRY_ID !== null && this.data.COUNTRY_ID !== undefined && this.data.COUNTRY_ID !== 0) ||
      (this.data.CITY_NAME !== null && this.data.CITY_NAME !== undefined && this.data.CITY_NAME !== '')) {
      this.selectedLocation = addressParts.join(', ');
    } else {
      this.selectedLocation = '';
    }
    // Open modal after setting location
    this.mapDraweVisible = true;

    // Set search box value and trigger search after modal opens
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
        // this.handleSearch(this.selectedLocation);

        this.handleSearch({ target: { value: this.selectedLocation } });
      }
    }, 100);

    if (!this.data.COUNTRY_ID) {
      // Convert latitude and longitude to numbers
      this.data.LATITUDE = Number(this.data.LATITUDE);
      this.data.LONGITUDE = Number(this.data.LONGITUDE);

      // this.mapDraweVisible = true;
      setTimeout(() => {
        this.loadMap();
      }, 5);
    }
    if (this.data.ID) {
      // Convert latitude and longitude to numbers
      this.data.LATITUDE = this.data.LATITUDE;
      this.data.LONGITUDE = this.data.LONGITUDE;
      // this.selectedLocation = '';
      if (this.data.LATITUDE && this.data.LONGITUDE) {
        this.selectedLocation = '';
      }
      // this.mapDraweVisible = true;
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

    const lat = Number(this.data.LATITUDE) || 20.5937;
    const lng = Number(this.data.LONGITUDE) || 78.9629;

    this.map2 = new google.maps.Map(map2Element, {
      center: { lat, lng },
      zoom: this.data.LATITUDE && this.data.LONGITUDE ? 14 : 5,
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
      var formattedaddress: any = ''
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
      var formattedaddress1: any = ''
      formattedaddress1 = '';
      this.selectedLocation = formattedaddress1;
      this.getAddress(lat, lng);
    });
  }
  handleSearch(event: any) {
    const query = event.target.value;

    let lat = this.data.LATITUDE ? parseFloat(this.data.LATITUDE) : 18.5204;
    let lng = this.data.LONGITUDE ? parseFloat(this.data.LONGITUDE) : 73.8567;

    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    this.map2 = new google.maps.Map(mapElement, {
      center: { lat, lng },
      zoom: this.data.LATITUDE && this.data.LONGITUDE ? 14 : 5,
    });

    this.marker = new google.maps.Marker({
      position: { lat, lng },
      map: this.map2,
    });

    // **Ensure Google Places Autocomplete provides global suggestions**
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

    // **Manual Geocoding when user presses Enter**
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

    // **Allow Clicking on the Map to Select a Location**
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

          // Get full place details using placeId
          const service = new google.maps.places.PlacesService(this.map2);
          service.getDetails({ placeId: placeId }, (placeResult, placeStatus) => {
            if (placeStatus === 'OK' && placeResult) {
              this.placeName = placeResult.name || ''; // <- Now you get name too
              this.getAddress(lat, lng, placeResult);  // Call your function with place
            } else {
              this.getAddress(lat, lng, null);
            }
          });
        } else {
          // fallback if geocoding fails
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
    if (value === false) {
      this.data.STATE_ID = null;
      this.data.DISTRICT_ID = null;
      this.data.PIN_CODE_ID = 0;
      this.data.PINCODE = null;
      this.data.STATE_NAME = null;
      this.data.DISTRICT_NAME = null;
      this.PincodeData = [];
      this.StateData = [];
      this.DistData = [];
    }
    if (countryId != null && countryId != undefined && countryId != '') {
      var pin = this.CountryData.filter((i) => i.ID == countryId);
      if (pin != null && pin != undefined && pin != '') {
        this.data.COUNTRY_NAME = pin[0]['NAME'];
      } else {
        this.data.COUNTRY_NAME = null;
      }

      this.isStateSpinning = true; // Set loading to true when fetching data
      this.api
        .getState(
          0,
          0,
          'NAME',
          'asc',
          ` AND COUNTRY_ID=${countryId} AND IS_ACTIVE = 1`
        ) // Added ' AND IS_ACTIVE = 1'
        .subscribe(
          (data) => {
            if (data['code'] === 200) {
              this.StateData = data['data'];

              if (state) {
                var stateDatas: any = this.StateData.find((c: any) => c.NAME === state)?.ID;
                if (stateDatas !== null && stateDatas !== undefined && stateDatas !== '') {
                  this.data.STATE_ID = Number(stateDatas);
                  this.getDistrictByLocationFetch(this.data.STATE_ID, true, postcode, distt)
                } else {
                  this.data.STATE_ID = null;
                  this.data.DISTRICT_ID = null;
                  this.data.PIN_CODE_ID = 0;
                  this.data.PINCODE = null;
                  this.data.STATE_NAME = null;
                  this.data.DISTRICT_NAME = null;
                  this.PincodeData = [];
                  this.DistData = [];
                }
              } else {
                this.data.STATE_ID = null;
                this.data.DISTRICT_ID = null;
                this.data.PIN_CODE_ID = 0;
                this.data.PINCODE = null;
                this.data.STATE_NAME = null;
                this.data.DISTRICT_NAME = null;
                this.PincodeData = [];
                this.DistData = [];
              }
            } else {
              this.StateData = [];
              this.message.error('Failed To Get State Data...', '');
            }
            this.isStateSpinning = false; // Ensure spinning state is turned off after data is fetched
          },
          () => {
            this.message.error('Something went wrong.', '');
            this.isStateSpinning = false; // Ensure spinning state is turned off on error
          }
        );
    } else {
      this.data.COUNTRY_NAME = null;
      this.data.STATE_ID = null;
      this.data.DISTRICT_ID = null;
      this.data.PIN_CODE_ID = 0;
      this.data.PINCODE = null;
      this.data.STATE_NAME = null;
      this.data.DISTRICT_NAME = null;
      this.PincodeData = [];
      this.StateData = [];
      this.DistData = [];
      this.isStateSpinning = false;
    }
  }

  getDistrictByLocationFetch(stateId: any, value: boolean, postcode: any, distt: any) {
    if (value === false) {
      this.data.DISTRICT_ID = 0;
      this.data.PIN_CODE_ID = 0;
      this.data.PINCODE = null;
      this.data.DISTRICT_NAME = null;
      this.PincodeData = [];
      this.DistData = [];
    }
    if (stateId != null && stateId != undefined && stateId != '') {
      var pin = this.StateData.filter((i) => i.ID == stateId);
      if (pin != null && pin != undefined && pin != '') {
        this.data.STATE_NAME = pin[0]['NAME'];
      } else {
        this.data.STATE_NAME = null;
      }

      this.isDistSpinning = true; // Set loading to true when fetching data
      this.api
        .getDistrictData(
          0,
          0,
          'NAME',
          'asc',
          ` AND IS_ACTIVE=1 AND STATE_ID=${stateId}`
        ) // Added ' AND IS_ACTIVE = 1'
        .subscribe(
          (data) => {
            if (data['code'] === 200) {
              this.DistData = data['data'];
              if (distt) {
                var DistrictDatas: any = this.DistData.find((c: any) => c.NAME === distt)?.ID;
                if (DistrictDatas !== null && DistrictDatas !== undefined && DistrictDatas !== '') {
                  this.data.DISTRICT_ID = Number(DistrictDatas);
                  this.getPincodeByLocation(this.data.DISTRICT_ID, true, postcode)
                } else {
                  this.data.DISTRICT_ID = 0;
                  this.data.PIN_CODE_ID = 0;
                  this.data.PINCODE = null;
                  this.data.DISTRICT_NAME = null;
                  this.PincodeData = [];
                }
              } else {
                this.data.DISTRICT_ID = 0;
                this.data.PIN_CODE_ID = 0;
                this.data.PINCODE = null;
                this.data.DISTRICT_NAME = null;
                this.PincodeData = [];
              }
            } else {
              this.DistData = [];
              this.message.error('Failed To Get District Data...', '');
            }
            this.isDistSpinning = false; // Ensure spinning state is turned off after data is fetched
          },
          () => {
            this.message.error('Something went wrong.', '');
            this.isDistSpinning = false; // Ensure spinning state is turned off on error
          }
        );
    } else {
      this.data.STATE_ID = null;
      this.data.DISTRICT_ID = null;
      this.data.PIN_CODE_ID = 0;
      this.data.PINCODE = null;
      this.data.DISTRICT_NAME = null;
      this.PincodeData = [];
      this.DistData = [];
      this.isStateSpinning = false;
    }
  }
  getPincodeByLocation(districtId: number, value: boolean, postcode: any) {
    if (value === false) {
      this.data.PIN_CODE_ID = 0;
      this.data.PINCODE = null;
    }
    if (districtId != null && districtId != undefined && districtId != 0) {
      var pin = this.DistData.filter((i) => i.ID == districtId);
      if (pin != null && pin != undefined && pin != '') {
        this.data.DISTRICT_NAME = pin[0]['NAME'];
      } else {
        this.data.DISTRICT_NAME = null;
      }

      this.isPincodeSpinning = true; // Set loading to true when fetching data
      this.api
        .getAllPincode(
          0,
          0,
          'ID',
          'asc',
          ` AND IS_ACTIVE=1 AND DISTRICT=${districtId}`
        ) // Added ' AND IS_ACTIVE = 1'
        .subscribe(
          (data) => {
            if (data['code'] === 200) {
              this.PincodeData = data['data'];
              if (postcode) {
                var PincodeDatas: any = this.PincodeData.find((c: any) => c.PINCODE_NUMBER === postcode)?.ID;
                if (PincodeDatas !== null && PincodeDatas !== undefined && PincodeDatas !== '') {
                  this.data.PIN_CODE_ID = Number(PincodeDatas);
                  this.getpincodename1(this.data.PIN_CODE_ID);
                } else {
                  this.data.PIN_CODE_ID = 0;
                  this.data.PINCODE = null;
                }
              } else {
                this.data.PIN_CODE_ID = 0;
                this.data.PINCODE = null;
              }
              this.isPincodeSpinning = false;
            } else {
              this.PincodeData = [];
              this.message.error('Failed To Get Pincode Data...', '');
            }
            // Ensure spinning state is turned off after data is fetched
          },
          () => {
            this.message.error('Something went wrong.', '');
            this.isPincodeSpinning = false; // Ensure spinning state is turned off on error
          }
        );
    } else {
      this.data.DISTRICT_ID = null;
      this.data.PIN_CODE_ID = 0;
      this.data.PINCODE = null;
      this.data.DISTRICT_NAME = null;
      this.PincodeData = [];
      this.DistData = [];
      this.isStateSpinning = false;
    }
  }

  getpincodename1(pincode: any) {
    if (pincode != null && pincode != undefined && pincode != '') {
      var pin = this.PincodeData.filter((i) => i.ID == pincode);
      if (pin != null && pin != undefined && pin != '') {
        this.data.PINCODE = pin[0]['PINCODE_NUMBER'];
      } else {
        this.data.PINCODE = null;
      }
    } else {
      this.data.PINCODE = null;
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
              // this.buildingSearch = component?.long_name || '';
              this.buildingSearch += (this.buildingSearch ? ', ' : '') + (component?.long_name || '');
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
          this.data.ADDRESS_LINE2 = [this.landmarkSearch, this.building1Search, this.locality2Search].filter(parts => !!parts && parts.trim() !== '').join(', ');
          if (this.data.ADDRESS_LINE2 === '' || this.data.ADDRESS_LINE2 === null || this.data.ADDRESS_LINE2 === undefined) {
            this.data.ADDRESS_LINE2 = this.citySearch ? this.citySearch : this.districtSearch;
          }
          this.data.ADDRESS_LINE1 = [this.floor, this.street_number, this.subpremise, this.placeName, this.buildingSearch, this.locality1Search].filter(partad => !!partad && partad.trim() !== '').join(', ');

        }

        // Preserve coordinates
        this.data.LATITUDE = Number(lat) || lat;
        this.data.LONGITUDE = Number(lng) || lng;


        // Respect your conditions
        if (!this.noaddress) {
          this.data.ADDRESS_LINE1 = this.data.ADDRESS_LINE1;
        } else {
          this.address1 = this.data.ADDRESS_LINE1;
        }
        this.data.ADDRESS_LINE1 = this.data.ADDRESS_LINE1 || '';

        if (typeof this.selectedLocation !== 'object') {
          this.selectedLocation = '';
        }
      } else {
        // this.selectedLocation = this.selectedLocation || {};
        this.selectedLocation = '';
      }
    });
  }

  varm: any;

  clearSearchBox() {
    this.selectedLocation = '';
    this.closemapModal();
  }


}