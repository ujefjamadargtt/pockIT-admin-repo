import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { smsservice } from 'src/app/Pages/Models/smsservice';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';
@Component({
  selector: 'app-sms-service-config',
  templateUrl: './sms-service-config.component.html',
  styleUrls: ['./sms-service-config.component.css'],
})
export class SmsServiceConfigComponent {
  @Input() data: smsservice;
  @Input() drawerClose: any = Function;
  @Input() drawerVisible: boolean;
  passwordVisible: boolean = false;
  isSpinning: boolean = false;
  senderIds: any = [];
  apiurlpattern: RegExp =
    /^https?:\/\/[a-zA-Z0-9\-\.]+\.[a-z]{2,}(:[0-9]{1,5})?(\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;%=]*)?$/;
  isFocused: string = '';
  Close() {
    this.drawerClose;
  }
  ngOnInit(): void {
    this.data.USERNAME = '';
    this.data.PASSWORD = '';
  }
  public commonFunction = new CommonFunctionService();
  timeLogs = [
    {
      date: '2024-04-15',
      time: '',
      action: 'Order Placed',
      description: '10 Apr. 2024, 10:40 AM',
    },
    {
      date: '2024-04-15',
      time: '11:00 AM',
      action: 'Order Accepted ',
      description: '11 Apr. 2024, 04:00 PM',
    },
    {
      date: '2024-04-15',
      time: '02:00 PM',
      action: 'Job Scheduled',
      description: '12 Apr. 2024, 11:50 AM',
    },
    {
      date: '2024-04-16',
      time: '09:00 AM',
      action: 'Job Done',
      description: '15 Apr. 2024, 03:40 PM',
    },
  ];
  currentStep = 2;
  getStatus(index: number): 'finish' | 'process' | 'wait' {
    if (index < this.currentStep) return 'finish';
    if (index === this.currentStep) return 'process';
    return 'wait';
  }
  close() {
    this.drawerClose();
  }
  resetDrawer(smsServiceForm: NgForm) {
    this.data = new smsservice();
    smsServiceForm.form.markAsPristine();
    smsServiceForm.form.markAsUntouched();
  }
  isOk = true;
  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService
  ) { }
  save(addNew: boolean, smsServiceForm: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;
    if (
      (this.data.SERVICE_PROVIDER == null ||
        this.data.SERVICE_PROVIDER == undefined ||
        this.data.SERVICE_PROVIDER.trim() == '') &&
      (this.data.AUTHENTICATION_TYPE == null ||
        this.data.AUTHENTICATION_TYPE == undefined ||
        this.data.AUTHENTICATION_TYPE.trim() == '') &&
      (this.data.API_URL == null ||
        this.data.API_URL == undefined ||
        this.data.API_URL.trim() == '') &&
      (this.data.API_KEY == null ||
        this.data.API_KEY == undefined ||
        this.data.API_KEY.trim() == '') &&
      (this.data.SENDER_NAME == null ||
        this.data.SENDER_NAME == undefined ||
        this.data.SENDER_NAME.trim() == '') &&
      (this.data.DEFAULT_COUNTRY_CODE == null ||
        this.data.DEFAULT_COUNTRY_CODE == undefined ||
        this.data.DEFAULT_COUNTRY_CODE.trim() == '') &&
      (this.data.USERNAME == null ||
        this.data.USERNAME == undefined ||
        this.data.USERNAME.trim() == '') &&
      (this.data.PASSWORD == null ||
        this.data.PASSWORD == undefined ||
        this.data.PASSWORD.trim() == '') &&
      (this.data.SENDER_EMAIL == null ||
        this.data.SENDER_EMAIL == undefined ||
        this.data.SENDER_EMAIL.trim() == '')
    ) {
      this.isOk = false;
      this.message.error('Please fill all the required fields ', '');
    } else if (!this.data.SERVICE_PROVIDER?.trim()) {
      this.isOk = false;
      this.message.error('Please enter the service provider.', '');
    } else if (!this.data.AUTHENTICATION_TYPE?.trim()) {
      this.isOk = false;
      this.message.error('Please select authentocation type.', '');
    } else if (!this.data.API_URL?.trim()) {
      this.isOk = false;
      this.message.error('Please enter the API url.', '');
    } else if (!this.apiurlpattern.test(this.data.API_URL?.trim())) {
      this.isOk = false;
      this.message.error('Please enter valid API url.', '');
    } else if (!this.data.API_KEY?.trim()) {
      this.isOk = false;
      this.message.error('Please enter the API key.', '');
    } else if (!this.data.SENDER_NAME?.trim()) {
      this.isOk = false;
      this.message.error('Please enter the sender name.', '');
    } else if (!String(this.data.DEFAULT_COUNTRY_CODE || '').trim()) {
      this.isOk = false;
      this.message.error('Please select default country code.', '');
    } else if (!this.data.USERNAME?.trim()) {
      this.isOk = false;
      this.message.error('Please enter the user name.', '');
    } else if (!this.data.PASSWORD?.trim()) {
      this.isOk = false;
      this.message.error('Please enter the password.', '');
    } else if (this.data.PASSWORD?.trim().length < 7) {
      this.isOk = false;
      this.message.error('Password must be at least 8 characters long.', '');
    }
    if (this.isOk) {
      this.isSpinning = true;
      if (this.data.ID) {
        this.api.updateSmsServiceConfigData(this.data).subscribe(
          (response: any) => {
            this.isSpinning = false;
            if (response.code === 200) {
              this.message.success(
                'Sms service configuration data updated successfully.',
                ''
              );
              if (!addNew) this.drawerClose();
              this.isSpinning = false;
            } else {
              this.message.error(
                'Failed to update sms service configuration data.',
                ''
              );
              this.isSpinning = false;
            }
          },
          (err) => {
            this.message.error(
              'Something went wrong, please try again later',
              ''
            );
            this.isSpinning = false;
          }
        );
      } else {
        this.api.CreateSmsServiceConfigData(this.data).subscribe(
          (response: any) => {
            this.isSpinning = false;
            if (response.code === 200) {
              this.message.success(
                'Sms service configuration data created successfully.',
                ''
              );
              if (!addNew) {
                this.drawerClose();
              } else {
                this.data = new smsservice();
                this.resetDrawer(smsServiceForm);
              }
            } else {
              this.message.error(
                'Failed to create sms service configuration data.',
                ''
              );
              this.isSpinning = false;
            }
            (error) => {
              this.message.error(
                'An error occurred while creating the back office team member.',
                ''
              );
              this.isSpinning = false;
            };
          },
          (err) => {
            this.message.error(
              'Something went wrong, please try again later',
              ''
            );
            this.isSpinning = false;
          }
        );
      }
    }
  }
  validateServiceProviderInput(event: KeyboardEvent): void {
    const allowedCharacters = /^[a-zA-Z\s\-\(\)]$/;
    const inputChar = event.key;
    if (!allowedCharacters.test(inputChar)) {
      event.preventDefault(); 
    }
  }
  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  countryCodes = [
    { label: "+91 (India)", value: "+91" },
    { label: "+92 (Pakistan)", value: "+92" },
    { label: "+93 (Afghanistan)", value: "+93" },
    { label: "+94 (Sri Lanka)", value: "+94" },
    { label: "+95 (Myanmar)", value: "+95" },
    { label: "+1 (United States)", value: "+1" },
    { label: "+1-242 (Bahamas)", value: "+1-242" },
    { label: "+1-246 (Barbados)", value: "+1-246" },
    { label: "+1-264 (Anguilla)", value: "+1-264" },
    { label: "+1-268 (Antigua and Barbuda)", value: "+1-268" },
    { label: "+1-284 (British Virgin Islands)", value: "+1-284" },
    { label: "+1-340 (U.S. Virgin Islands)", value: "+1-340" },
    { label: "+1-345 (Cayman Islands)", value: "+1-345" },
    { label: "+1-441 (Bermuda)", value: "+1-441" },
    { label: "+1-473 (Grenada)", value: "+1-473" },
    { label: "+1-649 (Turks and Caicos Islands)", value: "+1-649" },
    { label: "+1-664 (Montserrat)", value: "+1-664" },
    { label: "+1-670 (Northern Mariana Islands)", value: "+1-670" },
    { label: "+1-671 (Guam)", value: "+1-671" },
    { label: "+1-684 (American Samoa)", value: "+1-684" },
    { label: "+1-721 (Sint Maarten)", value: "+1-721" },
    { label: "+1-758 (Saint Lucia)", value: "+1-758" },
    { label: "+1-767 (Dominica)", value: "+1-767" },
    { label: "+1-784 (Saint Vincent and the Grenadines)", value: "+1-784" },
    { label: "+1-787 (Puerto Rico)", value: "+1-787" },
    { label: "+1-809 (Dominican Republic)", value: "+1-809" },
    { label: "+1-829 (Dominican Republic)", value: "+1-829" },
    { label: "+1-849 (Dominican Republic)", value: "+1-849" },
    { label: "+1-868 (Trinidad and Tobago)", value: "+1-868" },
    { label: "+1-869 (Saint Kitts and Nevis)", value: "+1-869" },
    { label: "+1-876 (Jamaica)", value: "+1-876" },
    { label: "+1-939 (Puerto Rico)", value: "+1-939" },
    { label: "+20 (Egypt)", value: "+20" },
    { label: "+211 (South Sudan)", value: "+211" },
    { label: "+212 (Morocco)", value: "+212" },
    { label: "+213 (Algeria)", value: "+213" },
    { label: "+216 (Tunisia)", value: "+216" },
    { label: "+218 (Libya)", value: "+218" },
    { label: "+220 (Gambia)", value: "+220" },
    { label: "+221 (Senegal)", value: "+221" },
    { label: "+222 (Mauritania)", value: "+222" },
    { label: "+223 (Mali)", value: "+223" },
    { label: "+224 (Guinea)", value: "+224" },
    { label: "+225 (Ivory Coast)", value: "+225" },
    { label: "+226 (Burkina Faso)", value: "+226" },
    { label: "+227 (Niger)", value: "+227" },
    { label: "+228 (Togo)", value: "+228" },
    { label: "+229 (Benin)", value: "+229" },
    { label: "+230 (Mauritius)", value: "+230" },
    { label: "+231 (Liberia)", value: "+231" },
    { label: "+232 (Sierra Leone)", value: "+232" },
    { label: "+233 (Ghana)", value: "+233" },
    { label: "+234 (Nigeria)", value: "+234" },
    { label: "+235 (Chad)", value: "+235" },
    { label: "+236 (Central African Republic)", value: "+236" },
    { label: "+237 (Cameroon)", value: "+237" },
    { label: "+238 (Cape Verde)", value: "+238" },
    { label: "+239 (Sao Tome and Principe)", value: "+239" },
    { label: "+240 (Equatorial Guinea)", value: "+240" },
    { label: "+241 (Gabon)", value: "+241" },
    { label: "+242 (Republic of the Congo)", value: "+242" },
    { label: "+243 (Democratic Republic of the Congo)", value: "+243" },
    { label: "+244 (Angola)", value: "+244" },
    { label: "+245 (Guinea-Bissau)", value: "+245" },
    { label: "+246 (British Indian Ocean Territory)", value: "+246" },
    { label: "+248 (Seychelles)", value: "+248" },
    { label: "+249 (Sudan)", value: "+249" },
    { label: "+250 (Rwanda)", value: "+250" },
    { label: "+251 (Ethiopia)", value: "+251" },
    { label: "+252 (Somalia)", value: "+252" },
    { label: "+253 (Djibouti)", value: "+253" },
    { label: "+254 (Kenya)", value: "+254" },
    { label: "+255 (Tanzania)", value: "+255" },
    { label: "+256 (Uganda)", value: "+256" },
    { label: "+257 (Burundi)", value: "+257" },
    { label: "+258 (Mozambique)", value: "+258" },
    { label: "+260 (Zambia)", value: "+260" },
    { label: "+261 (Madagascar)", value: "+261" },
    { label: "+262 (Reunion)", value: "+262" },
    { label: "+263 (Zimbabwe)", value: "+263" },
    { label: "+264 (Namibia)", value: "+264" },
    { label: "+265 (Malawi)", value: "+265" },
    { label: "+266 (Lesotho)", value: "+266" },
    { label: "+267 (Botswana)", value: "+267" },
    { label: "+268 (Eswatini)", value: "+268" },
    { label: "+269 (Comoros)", value: "+269" },
    { label: "+27 (South Africa)", value: "+27" },
    { label: "+290 (Saint Helena)", value: "+290" },
    { label: "+291 (Eritrea)", value: "+291" },
    { label: "+297 (Aruba)", value: "+297" },
    { label: "+298 (Faroe Islands)", value: "+298" },
    { label: "+299 (Greenland)", value: "+299" },
    { label: "+30 (Greece)", value: "+30" },
    { label: "+31 (Netherlands)", value: "+31" },
    { label: "+32 (Belgium)", value: "+32" },
    { label: "+33 (France)", value: "+33" },
    { label: "+34 (Spain)", value: "+34" },
    { label: "+350 (Gibraltar)", value: "+350" },
    { label: "+351 (Portugal)", value: "+351" },
    { label: "+352 (Luxembourg)", value: "+352" },
    { label: "+353 (Ireland)", value: "+353" },
    { label: "+354 (Iceland)", value: "+354" },
    { label: "+355 (Albania)", value: "+355" },
    { label: "+356 (Malta)", value: "+356" },
    { label: "+357 (Cyprus)", value: "+357" },
    { label: "+358 (Finland)", value: "+358" },
    { label: "+359 (Bulgaria)", value: "+359" },
    { label: "+36 (Hungary)", value: "+36" },
    { label: "+370 (Lithuania)", value: "+370" },
    { label: "+371 (Latvia)", value: "+371" },
    { label: "+372 (Estonia)", value: "+372" },
    { label: "+373 (Moldova)", value: "+373" },
    { label: "+374 (Armenia)", value: "+374" },
    { label: "+375 (Belarus)", value: "+375" },
    { label: "+376 (Andorra)", value: "+376" },
    { label: "+377 (Monaco)", value: "+377" },
    { label: "+378 (San Marino)", value: "+378" },
    { label: "+379 (Vatican City)", value: "+379" },
    { label: "+380 (Ukraine)", value: "+380" },
    { label: "+381 (Serbia)", value: "+381" },
    { label: "+382 (Montenegro)", value: "+382" },
    { label: "+383 (Kosovo)", value: "+383" },
    { label: "+385 (Croatia)", value: "+385" },
    { label: "+386 (Slovenia)", value: "+386" },
    { label: "+387 (Bosnia and Herzegovina)", value: "+387" },
    { label: "+389 (North Macedonia)", value: "+389" },
    { label: "+39 (Italy)", value: "+39" },
    { label: "+40 (Romania)", value: "+40" },
    { label: "+41 (Switzerland)", value: "+41" },
    { label: "+420 (Czech Republic)", value: "+420" },
    { label: "+421 (Slovakia)", value: "+421" },
    { label: "+423 (Liechtenstein)", value: "+423" },
    { label: "+43 (Austria)", value: "+43" },
    { label: "+44 (United Kingdom)", value: "+44" },
    { label: "+44-1481 (Guernsey)", value: "+44-1481" },
    { label: "+44-1534 (Jersey)", value: "+44-1534" },
    { label: "+44-1624 (Isle of Man)", value: "+44-1624" },
    { label: "+45 (Denmark)", value: "+45" },
    { label: "+46 (Sweden)", value: "+46" },
    { label: "+47 (Norway)", value: "+47" },
    { label: "+48 (Poland)", value: "+48" },
    { label: "+49 (Germany)", value: "+49" },
    { label: "+500 (Falkland Islands)", value: "+500" },
    { label: "+501 (Belize)", value: "+501" },
    { label: "+502 (Guatemala)", value: "+502" },
    { label: "+503 (El Salvador)", value: "+503" },
    { label: "+504 (Honduras)", value: "+504" },
    { label: "+505 (Nicaragua)", value: "+505" },
    { label: "+506 (Costa Rica)", value: "+506" },
    { label: "+507 (Panama)", value: "+507" },
    { label: "+508 (Saint Pierre and Miquelon)", value: "+508" },
    { label: "+509 (Haiti)", value: "+509" },
    { label: "+51 (Peru)", value: "+51" },
    { label: "+52 (Mexico)", value: "+52" },
    { label: "+53 (Cuba)", value: "+53" },
    { label: "+54 (Argentina)", value: "+54" },
    { label: "+55 (Brazil)", value: "+55" },
    { label: "+56 (Chile)", value: "+56" },
    { label: "+57 (Colombia)", value: "+57" },
    { label: "+58 (Venezuela)", value: "+58" },
    { label: "+590 (Guadeloupe)", value: "+590" },
    { label: "+591 (Bolivia)", value: "+591" },
    { label: "+592 (Guyana)", value: "+592" },
    { label: "+593 (Ecuador)", value: "+593" },
    { label: "+594 (French Guiana)", value: "+594" },
    { label: "+595 (Paraguay)", value: "+595" },
    { label: "+596 (Martinique)", value: "+596" },
    { label: "+597 (Suriname)", value: "+597" },
    { label: "+598 (Uruguay)", value: "+598" },
    { label: "+599 (Netherlands Antilles)", value: "+599" },
    { label: "+60 (Malaysia)", value: "+60" },
    { label: "+61 (Australia)", value: "+61" },
    { label: "+62 (Indonesia)", value: "+62" },
    { label: "+63 (Philippines)", value: "+63" },
    { label: "+64 (New Zealand)", value: "+64" },
    { label: "+65 (Singapore)", value: "+65" },
    { label: "Thailand (+66)", value: "+66" },
    { label: "Timor-Leste (+670)", value: "+670" },
    { label: "Australian External Territories (+672)", value: "+672" },
    { label: "Brunei (+673)", value: "+673" },
    { label: "Nauru (+674)", value: "+674" },
    { label: "Papua New Guinea (+675)", value: "+675" },
    { label: "Tonga (+676)", value: "+676" },
    { label: "Solomon Islands (+677)", value: "+677" },
    { label: "Vanuatu (+678)", value: "+678" },
    { label: "Fiji (+679)", value: "+679" },
    { label: "Palau (+680)", value: "+680" },
    { label: "Wallis and Futuna (+681)", value: "+681" },
    { label: "Cook Islands (+682)", value: "+682" },
    { label: "Niue (+683)", value: "+683" },
    { label: "Samoa (+685)", value: "+685" },
    { label: "Kiribati (+686)", value: "+686" },
    { label: "New Caledonia (+687)", value: "+687" },
    { label: "Tuvalu (+688)", value: "+688" },
    { label: "French Polynesia (+689)", value: "+689" },
    { label: "Tokelau (+690)", value: "+690" },
    { label: "Micronesia (+691)", value: "+691" },
    { label: "Marshall Islands (+692)", value: "+692" },
    { label: "Russia (+7)", value: "+7" },
    { label: "Kazakhstan (+7)", value: "+7" },
    { label: "Japan (+81)", value: "+81" },
    { label: "South Korea (+82)", value: "+82" },
    { label: "Vietnam (+84)", value: "+84" },
    { label: "North Korea (+850)", value: "+850" },
    { label: "Hong Kong (+852)", value: "+852" },
    { label: "Macau (+853)", value: "+853" },
    { label: "Cambodia (+855)", value: "+855" },
    { label: "Laos (+856)", value: "+856" },
    { label: "China (+86)", value: "+86" },
    { label: "Bangladesh (+880)", value: "+880" },
    { label: "Taiwan (+886)", value: "+886" },
    { label: "Turkey (+90)", value: "+90" },
    { label: "Maldives (+960)", value: "+960" },
    { label: "Lebanon (+961)", value: "+961" },
    { label: "Jordan (+962)", value: "+962" },
    { label: "Syria (+963)", value: "+963" },
    { label: "Iraq (+964)", value: "+964" },
    { label: "Kuwait (+965)", value: "+965" },
    { label: "Saudi Arabia (+966)", value: "+966" },
    { label: "Yemen (+967)", value: "+967" },
    { label: "Oman (+968)", value: "+968" },
    { label: "Palestine (+970)", value: "+970" },
    { label: "United Arab Emirates (+971)", value: "+971" },
    { label: "Israel (+972)", value: "+972" },
    { label: "Bahrain (+973)", value: "+973" },
    { label: "Qatar (+974)", value: "+974" },
    { label: "Bhutan (+975)", value: "+975" },
    { label: "Mongolia (+976)", value: "+976" },
    { label: "Nepal (+977)", value: "+977" },
    { label: "Iran (+98)", value: "+98" },
    { label: "Tajikistan (+992)", value: "+992" },
    { label: "Turkmenistan (+993)", value: "+993" },
    { label: "Azerbaijan (+994)", value: "+994" },
    { label: "Georgia (+995)", value: "+995" },
    { label: "Kyrgyzstan (+996)", value: "+996" },
    { label: "Uzbekistan (+998)", value: "+998" },
  ];
}
