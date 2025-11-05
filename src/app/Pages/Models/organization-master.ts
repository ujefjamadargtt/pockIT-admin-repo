export class OrganizationMaster {
  ID: number;
  NAME: string;
  EMAIL_ID: string;
  PASSWORD: string;
  DAY_START_TIME: any;
  DAY_END_TIME: any;
  CLIENT_ID: number;
  IS_ACTIVE: Boolean = true;
  ADDRESS: string;
  COUNTRY_ID: any;
  STATE_ID: any;
  DISTRICT_ID: any;
  CITY_ID: any;
  PINCODE_ID: any;
  PINCODE: any;
  CAN_CHANGE_SERVICE_PRICE: boolean = true;
}
