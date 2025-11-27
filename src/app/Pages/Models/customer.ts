export class customer {
  ID: number;
  NAME: string;
  EMAIL: any;
  MOBILE_NO: any;
  DOB: any;
  GENDER: any;
  CUSTOMER_CATEGORY_ID: any;
  REGISTRATION_DATE: any;
  ACCOUNT_STATUS: boolean = true;
  IS_SPECIAL_CATALOGUE: boolean = false;
  COMPANY_NAME: any;
  CLIENT_ID: number;
  SHORT_CODE: any;
  ALTERNATE_MOBILE_NO: any;
  CUSTOMER_TYPE: any = "I";
  GST_NO: any;
  CUSTOMER_MANAGER_ID: any;
  PAN: any;
  PHONE_NO: any;
  TITLE: any;
  SALUTATION = "B";
  CONTACT_PERSON_NAME: any;
  COUNTRY_CODE: any = "+91";
  ALTCOUNTRY_CODE: any = "+91";
  CURRENT_ADDRESS_ID: any;
  PROFILE_PHOTO: any;
  CUSTOMER_MASTER_ID: any;

  IS_HAVE_GST: boolean = false;
  INDIVIDUAL_COMPANY_NAME: any;
  COMPANY_ADDRESS: any;
  PASSWORD:any
  PARENT_ID:any
}

export class SlotsMappingToCustomer {
  ID: number;
  ORG_ID: number = 0;
  MAPPING_FOR: any = 'C';
  MAPPING_ID: number = 0;
  SLOT1_START_TIME: any;
  SLOT1_END_TIME: any;
  SLOT2_START_TIME: any;
  SLOT2_END_TIME: any;
  SLOT3_START_TIME: any;
  SLOT3_END_TIME: any;
}
