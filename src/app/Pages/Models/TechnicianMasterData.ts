export class TechnicianMasterData {
  TYPE: string = 'O';
  OLD_TYPE: any = null;
  NAME: string = '';
  EXPERIENCE_LEVEL: string = '';
  MOBILE_NUMBER: number;
  EMAIL_ID: string;
  ADDRESS_LINE_1: string;
  ID: number;
  ADDRESS_LINE_2: string = '';
  IS_ACTIVE: boolean = true;
  COUNTRY_ID: number;
  COUNTRY_CODE: any = '+91';
  CITY_ID: number;
  STATE_ID: number;
  PINCODE_ID: number;
  PAN_CARD_NUMBER: string;
  AADHAR_NUMBER: string;
  GENDER: string = 'M';
  DOB: Date;
  IS_OWN_VEHICLE: boolean = true;
  VEHICLE_TYPE: string;
  VEHICLE_DETAILS: any = '';
  VEHICLE_NO: any;
  PHOTO: string;
  VENDOR_ID: any;
  CONTRACT_START_DATE: Date;
  CONTRACT_END_DATE: Date;
  WEEK_DAY_DATA: any = [];
  HOME_LONGITUDE: any;
  HOME_LATTITUDE: any;
  ORG_ID: any;
  CREATED_DATE: any;
  TECHNICIAN_STATUS: number = 1;
  PROFILE_PHOTO: any;
  IS_UNIFORM_ASSIGNED = false;
  IS_TOOLKIT_ASSIGNED = false;
}
export class Technicianconfigrationdata {
  ID: any;
  PREFERRED_LANGUAGE_ID: any = null
  TECHNICIAN_ID: any;
  CAN_VIEW_JOB_POOL: boolean = false;
  CAN_ASSIGN_EXPRESS_ORDER: boolean = false;
  CAN_ASSIGN_ORDERS_FORCEFULLY: boolean = false;
  CAN_VIEW_SERVICE_PRICES_SUMMARY: boolean = false;
  CREATED_MODIFIED_DATE: any;
  READ_ONLY: any;
  ARCHIVE_FLAG: any;
  CLIENT_ID: any;
  CAN_ACCEPT_JOB: any;
  CAN_EDIT_SKILL: boolean = false;
  CAN_EDIT_PINCODE: boolean = false;
}
export class techniacianRatings {
  ORDER_ID: any
  CUSTOMER_ID: any
  JOB_CARD_ID: any
  TECHNICIAN_ID: any
  RATING: any
  COMMENTS: any
  FEEDBACK_DATE_TIME: any
  ID: number
}
