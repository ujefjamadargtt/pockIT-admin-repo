// export class InventoryMaster {
//   ID: any;
//   ITEM_NAME: any;
//   INVENTORY_CATEGORY_ID: any;
//   INVENTRY_SUB_CATEGORY_ID: any;
//   UNIT_ID: any;
//   DATE_OF_ENTRY: any = new Date();
//   STATUS: boolean = true;
//   WAREHOUSE_ID: any;
//   BASE_UNIT_ID: any;
//   AVG_LEVEL: any;
//   SERIAL_NO: any;
//   REORDER_STOCK_LEVEL: any;
//   ALERT_STOCK_LEVEL: any;
//   HSN_ID: any;
//   TAX_PREFERENCE: any = 'T';
//   TAX_ID: any;
//   IS_HAVE_VARIANTS: boolean = false;
//   IS_SET: boolean = false;
//   DESCRIPTION: any;
//   INVENTORY_CATEGORY_NAME: any;
//   INVENTRY_SUB_CATEGORY_NAME: any;
//   BASE_UNIT_NAME: any;
//   HSN_NAME: any;
//   TAX_NAME: any;
//   UNIT_NAME: any;
//   WAREHOUSE_NAME: any;
//   SHORT_CODE: any;
//   // PURCHASE_PRICE: any;
//   SELLING_PRICE: any;
//   REMARKS: any;
//   BASE_QUANTITY: any = 1;
//   IMAGE_URL: any;
//   PARENT_ID: any = 0;
//   SKU_CODE: any;

//   IS_NEW: boolean = true;
//   IMAGE_URL_2: any;
//   IMAGE_URL_3: any;
//   IMAGE_URL_4: any;

//   INVENTORY_TRACKING_TYPE: any;
//   WARRANTY_ALLOWED: boolean = false;
//   GUARANTEE_ALLOWED: boolean = false;
//   EXPIRY_DATE_ALLOWED: boolean = false;
// }

// export class InventoryMaster2111 {
//   ID: any;
//   ITEM_NAME: any;
//   INVENTORY_CATEGORY_ID: any
//   INVENTRY_SUB_CATEGORY_ID: any;
//   UNIT_ID: any;
//   DATE_OF_ENTRY: any = new Date();
//   STATUS: boolean = true
//   WAREHOUSE_ID: any
//   BASE_UNIT_ID: any
//   AVG_LEVEL: any
//   SERIAL_NO: any
//   REORDER_STOCK_LEVEL: any
//   ALERT_STOCK_LEVEL: any
//   HSN_ID: any
//   TAX_PREFERENCE: any = 'T';
//   TAX_ID: any
//   IS_HAVE_VARIANTS: boolean = false;
//   IS_SET: boolean = false;
//   DESCRIPTION: any;
//   INVENTORY_CATEGORY_NAME: any
//   INVENTRY_SUB_CATEGORY_NAME: any
//   BASE_UNIT_NAME: any
//   HSN_NAME: any
//   TAX_NAME: any
//   UNIT_NAME: any
//   WAREHOUSE_NAME: any
//   SHORT_CODE: any
//   // PURCHASE_PRICE: any;
//   SELLING_PRICE: any;
//   REMARKS: any;
//   BASE_QUANTITY: any = 1;
//   IMAGE_URL: any;
//   PARENT_ID: any = 0;

//   IMAGE_URL_2: any;
//   IMAGE_URL_3: any;
//   IMAGE_URL_4: any;

//   INVENTORY_TRACKING_TYPE: any;
//   WARRANTY_ALLOWED: boolean = false;
//   GUARANTEE_ALLOWED: boolean = false;
//   EXPIRY_DATE_ALLOWED: boolean = false;
//   SKU_CODE: any;
//   IS_NEW: boolean = true;
// }

export class InventoryMaster {
  ID: any;
  ITEM_NAME: any;
  INVENTORY_CATEGORY_ID: any;
  INVENTRY_SUB_CATEGORY_ID: any;
  UNIT_ID: any;
  DATE_OF_ENTRY: any = new Date();
  STATUS: boolean = true;
  WAREHOUSE_ID: any;
  BASE_UNIT_ID: any;
  AVG_LEVEL: any;
  SERIAL_NO: any;
  REORDER_STOCK_LEVEL: any;
  ALERT_STOCK_LEVEL: any;
  HSN_ID: any;
  TAX_PREFERENCE: any = 'T';
  TAX_ID: any;
  IS_HAVE_VARIANTS: boolean = false;
  IS_SET: boolean = false;
  DESCRIPTION: any;
  INVENTORY_CATEGORY_NAME: any;
  INVENTRY_SUB_CATEGORY_NAME: any;
  BASE_UNIT_NAME: any;
  HSN_NAME: any;
  TAX_NAME: any;
  UNIT_NAME: any;
  WAREHOUSE_NAME: any;
  SHORT_CODE: any;
  // PURCHASE_PRICE: any;
  SELLING_PRICE: any;
  REMARKS: any;
  BASE_QUANTITY: any = 1;
  BASE_PRICE;
  DISCOUNTED_PERCENTAGE;
  IMAGE_URL: any;
  PARENT_ID: any = 0;
  SKU_CODE: any;
  INVENTORY_TYPE: any = 'B';
  IS_NEW: boolean = true;
  RETURN_ALOW: boolean = false;
  IS_REFURBISHED: boolean = false;
  IMAGE_URL_2: any;
  IMAGE_URL_3: any;
  INVENTORY_DETAILS_IMAGE: any;
  IMAGE_URL_4: any;
  INVENTORY_TRACKING_TYPE: any = 'N';
  WARRANTY_ALLOWED: boolean = false;
  GUARANTEE_ALLOWED: boolean = false;
  EXPIRY_DATE_ALLOWED: boolean = false;
  BRAND_ID: any;
  BRAND_NAME: any;

  WARRANTY_CARD: any = '';
  RATING;
  WARRANTY_PERIOD: number = 0;
  GUARANTEE_PERIOD: number = 0;
  DISCOUNT_ALLOWED: boolean = false;
  DISCOUNTED_PRICE: number = 0;
  RETURN_ALLOW_PERIOD: number = 0;
  REPLACEMENT_ALLOW: boolean = false;
  REPLACEMENT_PERIOD: number = 0;
  EXPECTED_DELIVERY_IN_DAYS: number = 0;
  EXPECTED_DELIVERY_CHARGES = 0;
  WEIGHT: any;
  LENGTH: any;
  BREADTH: any;
  HEIGHT: any;
}


export class InventoryMaster2111 {
  ID: any;
  ITEM_NAME: any;
  INVENTORY_CATEGORY_ID: any;
  INVENTRY_SUB_CATEGORY_ID: any;
  UNIT_ID: any;
  DATE_OF_ENTRY: any = new Date();
  STATUS: boolean = true;
  WAREHOUSE_ID: any = '';
  BASE_UNIT_ID: any;
  AVG_LEVEL: any;
  SERIAL_NO: any;
  REORDER_STOCK_LEVEL: any;
  ALERT_STOCK_LEVEL: any;
  HSN_ID: any;
  TAX_PREFERENCE: any = 'T';
  TAX_ID: any;
  IS_HAVE_VARIANTS: boolean = false;
  IS_SET: boolean = false;
  DESCRIPTION: any;
  INVENTORY_CATEGORY_NAME: any;
  INVENTRY_SUB_CATEGORY_NAME: any;
  BASE_UNIT_NAME: any;
  HSN_NAME: any;
  TAX_NAME: any;
  UNIT_NAME: any;
  WAREHOUSE_NAME: any;
  SHORT_CODE: any;
  // PURCHASE_PRICE: any;
  SELLING_PRICE: any;
  REMARKS: any;
  BASE_QUANTITY: any = 1;
  IMAGE_URL: any;
  PARENT_ID: any = 0;

  IMAGE_URL_2: any;
  IMAGE_URL_3: any;
  IMAGE_URL_4: any;
  INVENTORY_DETAILS_IMAGE: any;
  INVENTORY_TRACKING_TYPE: any = 'N';
  WARRANTY_ALLOWED: boolean = false;
  GUARANTEE_ALLOWED: boolean = false;
  EXPIRY_DATE_ALLOWED: boolean = false;
  SKU_CODE: any;
  IS_NEW: boolean = true;
  WEIGHT: any;
  LENGTH: any;
  BREADTH: any;
  HEIGHT: any;
}
