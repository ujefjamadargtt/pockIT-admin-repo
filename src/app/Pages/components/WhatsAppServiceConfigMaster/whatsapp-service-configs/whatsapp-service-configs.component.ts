import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { emailserviceconfig } from 'src/app/Pages/Models/emailserviceconfig';
import { whatsappconfig } from 'src/app/Pages/Models/whatsappconfig';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
@Component({
  selector: 'app-whatsapp-service-configs',
  templateUrl: './whatsapp-service-configs.component.html',
  styleUrls: ['./whatsapp-service-configs.component.css'],
})
export class WhatsappServiceConfigsComponent {
  formTitle = 'Manage WhatsApp Service Configuration';
  drawerVisible: boolean = false;
  drawerData: whatsappconfig = new whatsappconfig();
  searchText = '';
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  totalRecords = 1;
  WhatsappServiceConfigData: any = [];
  drawerTitle = '';
  loadingRecords = false;
  ProviderText: string = '';
  ProviderVisible = false;
  AutehnticationVisible = false;
  AuthenticationText: string = '';
  URLText: string = '';
  URLVisible = false;
  PhoneVisible = false;
  Phonetext: string = '';
  CountryText: string = '';
  CountryVisible = false;
  SenderVisible = false;
  SenderText: string = '';
  RetryText: string = '';
  TimeoutText: string = '';
  TimeoutrVisible = false;
  TypeVisible = false;
  KeyVisible = false;
  KeyText: string = '';
  selectedData: number[] = [];
  columns: string[][] = [
    ['SERVICE_PROVIDER', 'SERVICE_PROVIDER'],
    ['PHONE_NUMBER_ID', 'PHONE_NUMBER_ID'],
    ['SENDER_PHONE_NUMBER', 'SENDER_PHONE_NUMBER'],
    ['AUTHENTICATION_TYPE', 'AUTHENTICATION_TYPE'],
  ];
  ngOnInit(): void {
    if (this.searchText.length > 3) {
      this.search(true);
    } else if (this.searchText.length == 0) {
      this.search(true);
    }
    this.search();
    const decryptedUserId = this.userId
      ? this.commonFunction.decryptdata(this.userId)
      : '0'; 
    this.USER_ID = Number(decryptedUserId);
  }
  whatsappApiAuthentication = [
    { Id: 1, Name: 'Bearer Token' },
    { Id: 2, Name: 'OAuth2' },
    { Id: 3, Name: 'Bearer Token' },
    { Id: 4, Name: 'Basic Authentication' },
    { id: 5, Name: 'Other' },
  ];
  isTypeFilterApplied = false;
  onServiceChange(): void {
    if (this.authenticiation?.length) {
      this.search();
      this.isTypeFilterApplied = true; 
    } else {
      this.search();
      this.isTypeFilterApplied = false; 
    }
  }
  isCountryCodeFilterApplied = false;
  onCountryCodeChange(): void {
    if (this.selectedCountry?.length) {
      this.search();
      this.isCountryCodeFilterApplied = true; 
    } else {
      this.search();
      this.isCountryCodeFilterApplied = false; 
    }
  }
  statusFilter: string | undefined = undefined;
  onStatusFilterChange(selectedStatus: string) {
    this.statusFilter = selectedStatus;
    this.search(true);
  }
  listOfFilter: any[] = [
    { text: 'Active', value: '1' },
    { text: 'Inactive', value: '0' },
  ];
  constructor(
    private router: Router,
    private api: ApiServiceService,
    private message: NzNotificationService
  ) { }
  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  back() {
    this.router.navigate(['/masters/menu']);
  }
  keyup() {
    if (this.searchText.length >= 3) {
      this.search();
    } else if (this.searchText.length == 0) {
      this.search();
    }
  }
  add(): void {
    this.drawerTitle = 'Add New WhatsApp Service Configuaration';
    this.drawerData = new whatsappconfig();
    this.drawerVisible = true;
    this.api.getemailServiceConfigData(1, 1, '', 'desc', '').subscribe(
      (data) => {
        if (data['code'] == 200) {
        } else {
          this.message.error('Server Not Found.', '');
        }
      },
      (err: HttpErrorResponse) => {
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
    );
  }
  edit(data: whatsappconfig): void {
    this.drawerTitle = 'Update Whatsapp Service Configuration';
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
  }
  isTypeApplied = false;
  onTypeChange(): void {
    if (this.authenticiation?.length) {
      this.search();
      this.isTypeApplied = true; 
    } else {
      this.search();
      this.isTypeApplied = false; 
    }
  }
  authenticiation: any = [];
  selectedCountry: any;
  search(reset: boolean = false) {
    if (this.searchText.length < 3 && this.searchText.length !== 0) {
      return;
    }
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
    let globalSearchQuery = '';
    if (this.searchText !== '') {
      globalSearchQuery =
        ' AND (' +
        this.columns
          .map((column) => {
            return `${column[0]} like '%${this.searchText}%'`;
          })
          .join(' OR ') +
        ')';
    }
    this.loadingRecords = true;
    if (this.ProviderText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `SERVICE_PROVIDER LIKE '%${this.ProviderText.trim()}%'`;
    }
    if (this.KeyText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') + `API_KEY LIKE '%${this.KeyText.trim()}%'`;
    }
    if (this.URLText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') + `API_URL LIKE '%${this.URLText.trim()}%'`;
    }
    if (this.Phonetext !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `PHONE_NUMBER_ID LIKE '%${this.Phonetext.trim()}%'`;
    }
    if (this.SenderText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `SENDER_PHONE_NUMBER LIKE '%${this.SenderText.trim()}%'`;
    }
    if (this.RetryText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `RETRY_ATTEMPTS LIKE '%${this.RetryText.trim()}%'`;
    }
    if (this.TimeoutText !== '') {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `TIMEOUT_SECONDS LIKE '%${this.TimeoutText.trim()}%'`;
    }
    if (this.statusFilter) {
      if (likeQuery !== '') {
        likeQuery += ' AND ';
      }
      likeQuery += `IS_ACTIVE = ${this.statusFilter}`;
    }
    if (
      this.authenticiation !== '' &&
      this.authenticiation != null &&
      this.authenticiation != undefined
    ) {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `AUTHENTICATION_TYPE LIKE '%${this.authenticiation}%'`;
    }
    if (
      this.selectedCountry !== '' &&
      this.selectedCountry != null &&
      this.selectedCountry != undefined
    ) {
      likeQuery +=
        (likeQuery ? ' AND ' : '') +
        `DEFAULT_COUNTRY_CODE LIKE '%${this.selectedCountry}%'`;
    }
    this.loadingRecords = true;
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');
    this.api
      .getWhatsappServiceConfigData(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + this.filterQuery
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadingRecords = false;
            this.totalRecords = data['count'];
            this.WhatsappServiceConfigData = data['data'];
            this.TabId = data['TAB_ID'];
          } else if (data['code'] == 400) {
            this.loadingRecords = false;
            this.WhatsappServiceConfigData = [];
            this.message.error('Invalid filter parameter', '');
          } else {
            this.loadingRecords = false;
            this.WhatsappServiceConfigData = [];
            this.message.error('Something Went Wrong ...', '');
          }
        },
        (err: HttpErrorResponse) => {
          this.loadingRecords = false;
          if (err.status === 0) {
            this.message.error(
              'Unable to connect. Please check your internet or server connection and try again shortly.',
              ''
            );
          } else if (err['status'] == 400) {
            this.loadingRecords = false;
            this.message.error('Invalid filter parameter', '');
          } else {
            this.message.error('Something Went Wrong.', '');
          }
        }
      );
  }
  isprovider = false;
  urlvisible = false;
  phonevisible = false;
  sendervisible = false;
  timeoutvisible = false;
  RetryVisible = false;
  reteyfiltervisible = false;
  iskeyFilterApplied = false;
  onKeyup(event: KeyboardEvent): void {
    if (this.ProviderText.length >= 3 && event.key === 'Enter') {
      this.search();
      this.isprovider = true;
    } else if (this.ProviderText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.isprovider = false;
    }
    if (this.URLText.length >= 3 && event.key === 'Enter') {
      this.search();
      this.urlvisible = true;
    } else if (this.URLText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.urlvisible = false;
    }
    if (this.KeyText.length >= 3 && event.key === 'Enter') {
      this.search();
      this.iskeyFilterApplied = true;
    } else if (this.KeyText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.iskeyFilterApplied = false;
    }
    if (this.Phonetext.length > 0 && event.key === 'Enter') {
      this.search();
      this.phonevisible = true;
    } else if (this.Phonetext.length == 0 && event.key === 'Backspace') {
      this.search();
      this.phonevisible = false;
    }
    if (this.SenderText.length > 0 && event.key === 'Enter') {
      this.search();
      this.sendervisible = true;
    } else if (this.SenderText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.sendervisible = false;
    }
    if (this.TimeoutText.length > 0 && event.key === 'Enter') {
      this.search();
      this.timeoutvisible = true;
    } else if (this.TimeoutText.length == 0 && event.key === 'Backspace') {
      this.search();
      this.timeoutvisible = false;
    }
    if (this.RetryText.length > 0 && event.key === 'Enter') {
      this.search();
      this.reteyfiltervisible = true;
    } else if (this.RetryText.length === 0 && event.key === 'Backspace') {
      this.search();
      this.reteyfiltervisible = false;
    }
  }
  dataList: any[] = [];
  onKeyupS(keys) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    if (this.searchText.length >= 3 && keys.key === 'Enter') {
      this.search(true);
    } else if (this.searchText.length === 0 && keys.key == 'Backspace') {
      this.dataList = [];
      this.search(true);
    }
  }
  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
  }
  filterQuery = '';
  reset(): void {
    this.searchText = '';
    this.ProviderText = '';
    this.URLText = '';
    this.Phonetext = '';
    this.SenderText = '';
    this.TimeoutText = '';
    this.RetryText = '';
    this.filterQuery = '';
    this.search();
  }
  sort(params: NzTableQueryParams) {
    this.loadingRecords = true;
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
    this.search();
  }
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
  showcloumnVisible: boolean = false;
  isColumnVisible(key: any): boolean {
    const column = this.showcolumn.find((col) => col.key === key);
    return column ? column.visible : true;
  }
  showcolumn = [
    { label: 'Service Provider Name', key: 'SERVICE_PROVIDER', visible: true },
    {
      label: 'Authentication Type ',
      key: 'AUTHENTICATION_TYPE',
      visible: true,
    },
    { label: 'API URL', key: 'API_URL', visible: true },
    {
      label: 'API Key',
      key: 'API_KEY',
      visible: true,
    },
    { label: 'Phonr No Id', key: 'PHONE_NUMBER_ID', visible: true },
    { label: 'Country Code ', key: 'DEFAULT_COUNTRY_CODE', visible: true },
    { label: 'Sender Phone No.', key: 'SENDER_PHONE_NUMBER', visible: true },
    { label: 'Retry Attempts', key: 'RETRY_ATTEMPTS', visible: true },
    { label: 'Timeout (Seconds)', key: 'TIMEOUT_SECONDS', visible: true },
    { label: 'Status', key: 'IS_ACTIVE', visible: true },
  ];
  isfilterapply: boolean = false;
  filterClass: string = 'filter-invisible';
  showMainFilter() {
    if (this.filterClass === 'filter-visible') {
      this.filterClass = 'filter-invisible';
    } else {
      this.filterClass = 'filter-visible';
      this.loadFilters();
    }
  }
  TabId: number;
  userId = sessionStorage.getItem('userId'); 
  USER_ID: number; 
  savedFilters: any; 
  currentClientId = 1; 
  loadFilters() {
    this.filterQuery = `AND TAB_ID=${this.TabId} AND USER_ID=${this.USER_ID}`;
    this.api
      .getFilterData(
        this.TabId,
        this.USER_ID,
        this.currentClientId,
        this.filterQuery
      ) 
      .subscribe(
        (response) => {
          if (response.code === 200) {
            this.savedFilters = response.data;
            this.filterQuery = '';
          } else {
            this.message.error('Failed to load filters.', '');
          }
        },
        (error) => {
          this.message.error('An error occurred while loading filters.', '');
        }
      );
    this.filterQuery = '';
  }
  public commonFunction = new CommonFunctionService();
  selectedFilter: string | null = null;
  applyfilter(item) {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = item.ID;
    this.isfilterapply = true;
    this.filterQuery = ' AND (' + item.FILTER_QUERY + ')';
    this.search(true);
  }
  oldFilter: any[] = [];
  isLoading = false;
  deleteItem(item: any) {
    this.isLoading = true;
    this.api.deleteFilterById(item.ID).subscribe({
      next: (response) => {
        this.isfilterapply = false;
        this.filterClass = 'filter-invisible';
        this.savedFilters = this.savedFilters.filter((i) => i !== item);
        if (this.savedFilters.length > 0) {
          this.filterQuery =
            ' AND (' +
            this.savedFilters.map((filter) => filter.query).join(' AND ') +
            ')';
        } else {
          this.filterQuery = '';
        }
        this.filterQuery = '';
        this.search(true);
      },
      error: (err) => {
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
  selectedQuery: string = ''; 
  isModalVisible = false;
  toggleLiveDemo(item): void {
    this.selectedQuery = item.FILTER_QUERY;
    this.isModalVisible = true; 
  }
  drawerFilterVisible: boolean = false;
  drawerfilterClose() {
    this.drawerFilterVisible = false;
    this.loadFilters();
  }
  get filtercloseCallback() {
    return this.drawerfilterClose.bind(this);
  }
  applyCondition: any;
  openfilter() {
    this.drawerTitle = 'Whatsapp Service Configuration Filter';
    this.applyCondition = '';
    this.drawerFilterVisible = true;
  }
  Clearfilter() {
    this.filterClass = 'filter-invisible';
    this.selectedFilter = '';
    this.isfilterapply = false;
    this.filterQuery = '';
    this.search();
  }
  filterFields: any[] = [
    {
      key: 'SERVICE_PROVIDER',
      label: ' Service Provider Name',
      type: 'text',
      comparators: [
        '=',
        '!=',
        'Contains',
        'Does Not Contains',
        'Starts With',
        'Ends With',
      ],
      placeholder: 'Enter Service Provider Name',
    },
    {
      key: 'AUTHENTICATION_TYPE',
      label: 'Authentication Type',
      type: 'select',
      comparators: ['=', '!='],
      options: [
        { value: '1', display: 'Bearer Token' },
        { value: '2', display: 'OAuth2' },
        { value: '3', display: 'Bearer Token' },
        { value: '4', display: 'Basic Authentication' },
        { value: '5', display: 'Other' },
      ],
      placeholder: 'Select Authentication Type',
    },
    {
      key: 'API_URL',
      label: ' API URL',
      type: 'text',
      comparators: [
        '=',
        '!=',
        'Contains',
        'Does Not Contains',
        'Starts With',
        'Ends With',
      ],
      placeholder: 'Enter API URL',
    },
    {
      key: 'API_KEY',
      label: ' API KEY',
      type: 'text',
      comparators: [
        '=',
        '!=',
        'Contains',
        'Does Not Contains',
        'Starts With',
        'Ends With',
      ],
      placeholder: 'Enter API KEY',
    },
    {
      key: 'PHONE_NUMBER_ID',
      label: ' Phone No Id',
      type: 'text',
      comparators: [
        '=',
        '!=',
        'Contains',
        'Does Not Contains',
        'Starts With',
        'Ends With',
      ],
      placeholder: 'Enter Phone No Id',
    },
    {
      key: 'SENDER_PHONE_NUMBER',
      label: 'Sender Phone Number',
      type: 'text',
      comparators: [
        '=',
        '!=',
        'Contains',
        'Does Not Contains',
        'Starts With',
        'Ends With',
      ],
      placeholder: 'Enter Sender Phone Number',
    },
    {
      key: 'IS_ACTIVE',
      label: 'Status',
      type: 'select',
      comparators: ['=', '!='],
      options: [
        { value: '1', display: 'Active' },
        { value: '0', display: 'Inactive' },
      ],
      placeholder: 'Select Status',
    },
  ];
  handleCancel(): void {
    this.isModalVisible = false; 
    this.selectedQuery = ''; 
  }
  showadd() {
    if (this.WhatsappServiceConfigData.length == 0) {
      return true;
    } else {
      return false;
    }
  }
}
